import LoadMoreView, { Options as LoadMoreOptions, State as LoadMoreState } from './LoadMoreView';
import { getClientHeight, getScrollHeight, getScrollTop, throttle } from './util';

type Options<T = any> = {
  threshold?: number; // 滚动距离底部多少触发加载
  onScrollLower: () => Promise<T>; // 滚动底部触发
  isNoMore?: (res: T) => boolean; // 每次加载成功后触发该，是否没有更多了
  autoCheckOnContentUpdate?: boolean; // 加载成功后是否自动判断满足触发加载更多条件
  throttleWaitTime?: number; // 节流等待时间
} & LoadMoreOptions;

class ScrollToLoadMore<T = any> {
  options: Required<Omit<Options<T>, 'text' | 'dom'>> & Pick<Options<T>, 'text' | 'dom'>;
  private view!: LoadMoreView;
  private isUnmouted: boolean;
  private isLock: boolean;
  private calledLock: boolean;
  private handler: { click: any; scroll: any; };

  constructor(options: Options<T>) {
    this.options = {
      threshold: 100,
      scrollView: document.documentElement,
      throttleWaitTime: 50,
      isNoMore: () => false,
      autoCheckOnContentUpdate: true,
      ...options
    };

    // 如没有设置 onScrollLower ，不做任何处理
    if (!this.options.onScrollLower) {
      throw 'ScrollToLoadMore 需要设置 onScrollLower 回调方法';
    }

    this.isUnmouted = false;
    this.isLock = false; // 标识锁定
    this.calledLock = false; // 标识外部调用lock方法

    this.handler = {
      click: this.clickView.bind(this),
      scroll: throttle.call(this, this.scroll, this.options.throttleWaitTime > 0 ? this.options.throttleWaitTime : 0)
    }

    this.init();
  }

  private init() {
    const { text, dom, scrollView } = this.options;
    this.view = new LoadMoreView({ text, dom, scrollView });
    this.bindEvent();
  }

  // 点击
  private clickView() {
    if (this.isLock) return;

    if (this.view.state === LoadMoreState.Default || this.view.state === LoadMoreState.Failed) {
      this.triggerLoad();
    }
  }

  // 滚动
  private scroll() {
    if (this.isLock || this.isUnmouted || this.view.state !== LoadMoreState.Default) return;

    const { scrollView, threshold } = this.options;
    const height = getClientHeight(scrollView); // 内容高度
    const scrollHeight = getScrollHeight(scrollView); // 滚动容器高度
    const scrollTop = getScrollTop(scrollView);

    if (scrollHeight - (threshold > 0 ? threshold : 0) <= height + scrollTop) {
      this.triggerLoad();
    }
  }

  private bindEvent() {
    const { scrollView } = this.options;
    this.view.on('click', this.handler.click);
    let scrollWrapper = scrollView;
    if (scrollView === document.documentElement) {
      scrollWrapper = window;
    }
    scrollWrapper.addEventListener('scroll', this.handler.scroll);
  }

  private unbindEvent() {
    const { scrollView } = this.options;
    this.view.off('click', this.handler.click);
    let scrollWrapper = scrollView;
    if (scrollView === document.documentElement) {
      scrollWrapper = window;
    }
    scrollWrapper.removeEventListener('scroll', this.handler.scroll);
  }

  triggerLoad() {
    this.internalLock();
    this.view.setState(LoadMoreState.Loading);
    const { onScrollLower, isNoMore, autoCheckOnContentUpdate } = this.options;

    return onScrollLower().then((res) => {
      this.internalUnlock();
      if (isNoMore(res)) {
        this.view.setState(LoadMoreState.Done);
      } else {
        this.view.setState(LoadMoreState.Default);

        // 触发更新内容高度，滚动容器高度。
        // 可以由外部触发。比如外部下拉刷新或者内容增删改，需要重新更新内容高度。
        if (autoCheckOnContentUpdate) {
          this.scroll();
        }
      }
    }).catch(() => {
      this.view.setState(LoadMoreState.Failed);
      this.internalUnlock();
    });
  }

  // 重置状态
  reset() {
    this.view.setState(LoadMoreState.Default);
  }

  updateOptions(options: Options) {
    let changedScrollView = false;

    if (options?.scrollView && options.scrollView !== this.options.scrollView) {
      changedScrollView = true;
      this.unbindEvent();
    }

    if (typeof options?.throttleWaitTime === 'number' && options.throttleWaitTime !== this.options.throttleWaitTime) {
      this.handler.scroll = throttle.call(this, this.scroll, options.throttleWaitTime > 0 ? options.throttleWaitTime : 0)
    }

    this.options = {
      ...this.options,
      ...options
    }
    const { text, dom, scrollView } = this.options;
    this.view.updateOptions({ text, dom, scrollView });
    if (changedScrollView) {
      this.bindEvent();
    }
  }

  // 内部锁定，锁定后将不再触发下拉刷新
  private internalLock() {
    this.isLock = true;
  }

  // 内部解除锁定
  private internalUnlock() {
    if (!this.calledLock) {
      this.isLock = false;
    }
  }

  // 暴露给外部的锁定方法
  lock() {
    this.calledLock = true;
    this.internalLock();
  }

  // 暴露给外部的解除锁定方法
  unlock() {
    this.calledLock = false;
    this.internalUnlock();
  }

  destroy() {
    if (!this.isUnmouted) return;

    this.internalLock();
    this.unbindEvent();
    this.view.destroy();
    this.isUnmouted = true;
  }

  // 恢复
  resume() {
    if (!this.isUnmouted) return;

    this.isUnmouted = false;
    this.init();
    this.internalUnlock();
  }
}

export default ScrollToLoadMore;
