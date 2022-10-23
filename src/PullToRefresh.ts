import RefreshView, {
  Options as RefreshViewOptions,
  State as RefreshViewState
} from './RefreshView';
import { Events, getClient, getScrollTop } from './util';

type Options = {
  onRefresh: () => Promise<any>; // 下拉刷新回调方法
  distance?: number; // 下拉距离多少触发刷新
  height?: number; // 下拉刷新视图的高度（刷新中、刷新完成的高度）
  unmovableStayTime?: number; // 下拉后保持不动停留多少时间后执行end，为了处理一些意外操作，如移动端移出屏幕
  completionStayTime?: number; // 完成状态停留时间
} & RefreshViewOptions;

const TransitionDurantion = 300; // 动画过渡持续时间

class PullToRefresh {
  options: Required<Omit<Options, 'text' | 'dom'>> & Pick<Options, 'text' | 'dom'>;

  private touchesStart: {
    x: number;
    y: number;
  };
  private diffY: number;
  private isTouch: boolean;
  private isMove: boolean;
  private isLock: boolean;
  private isUnmouted: boolean;
  private calledLock: boolean;
  private lockTimer: any;
  private completionStayTimer: any;
  private __timerFixSlideOutScreen: any;
  private view!: RefreshView;
  private handler: { start: any; move: any; end: any } | null;

  constructor(options: Options) {
    this.options = {
      height: 40,
      distance: 60,
      unmovableStayTime: 3000,
      completionStayTime: 500,
      scrollView: document.documentElement,
      ...options
    };

    // 如没有设置 onRefresh ，不做任何处理
    if (!this.options.onRefresh) {
      throw 'PullToRefresh 需要设置 onRefresh 回调方法';
    }

    this.touchesStart = { x: 0, y: 0 }; // 开始坐标
    this.diffY = 0; // 滑动距离
    this.isTouch = false; // 标识触摸开始
    this.isMove = false; // 标识触摸滑动
    this.isLock = false; // 标识锁定
    this.isUnmouted = false; // 标识卸载
    this.calledLock = false; // 标识是否调用过lock方法

    this.lockTimer = null; // 锁定定时器
    this.completionStayTimer = null; // 停留定时器

    this.__timerFixSlideOutScreen = null; // 定时器，修复滑出屏幕导致下拉刷新显示错误问题

    this.handler = {
      start: this.fnTouchstart.bind(this),
      move: this.fnTouchmove.bind(this),
      end: this.fnTouchend.bind(this)
    };

    this.init();
  }

  private init() {
    const { dom, text, scrollView } = this.options;
    this.view = new RefreshView({ dom, text, scrollView });
    this.bindEvent();
  }

  // 绑定事件
  private bindEvent() {
    if (this.isUnmouted) return;

    const { scrollView } = this.options;
    scrollView.addEventListener(Events.start, this.handler?.start, { passive: false });
    document.addEventListener(Events.move, this.handler?.move, { passive: false });
    document.addEventListener(Events.end, this.handler?.end, { passive: false });
    document.addEventListener(Events.cancel, this.handler?.end, { passive: false });
  }

  // 解绑事件
  private unbindEvent() {
    if (this.isUnmouted) return;

    const { scrollView } = this.options;
    scrollView.removeEventListener(Events.start, this.handler?.start);
    document.removeEventListener(Events.move, this.handler?.move);
    document.removeEventListener(Events.end, this.handler?.end);
    document.removeEventListener(Events.cancel, this.handler?.end);
  }

  // 开始触摸
  private fnTouchstart(e: any) {
    if (this.view.state !== RefreshViewState.Default || this.isLock) {
      return;
    }

    const scrollTop = getScrollTop(this.options.scrollView);

    // 滚动区域需置顶
    if (scrollTop > 0) {
      return;
    }

    this.isTouch = true;
    this.isMove = false;
    this.diffY = 0;
    this.view.updateTransition(false);

    const { clientX, clientY } = getClient(e);
    this.touchesStart.x = clientX;
    this.touchesStart.y = clientY;
  }

  // 触摸移动
  private fnTouchmove(e: any) {
    if (!this.isTouch) {
      return;
    }

    const { clientX, clientY } = getClient(e);
    const diffY = clientY - this.touchesStart.y;

    if (!this.isMove) {
      const diffX = clientX - this.touchesStart.x;

      // 可能没有移动但是触发move事件
      if (diffX === 0 && diffY === 0) {
        e.preventDefault();
        return;
      }

      // 横向移动或往上滑动，不触发下拉刷新
      if (diffY <= 0) {
        this.isTouch = false;
        return;
      }

      this.isMove = true;
    }

    e.preventDefault();
    const { unmovableStayTime, distance } = this.options;
    this.diffY = diffY;

    // 触摸停留2s后，执行touchend事件
    clearTimeout(this.__timerFixSlideOutScreen);
    this.__timerFixSlideOutScreen = setTimeout(() => {
      this.fnTouchend();
    }, unmovableStayTime);

    // 下拉dom的偏移高度
    let offsetY = 0;

    // 下拉
    if (this.diffY <= distance) {
      offsetY = this.diffY;
      this.view.setState(RefreshViewState.Default);
      // 指定距离 < 下拉距离 < 指定距离*2
    } else if (this.diffY > distance && this.diffY <= distance * 2) {
      offsetY = distance + (this.diffY - distance) * 0.5;
      this.view.setState(RefreshViewState.Drop);
      // 下拉距离 > 指定距离*2
    } else {
      offsetY = distance + distance * 0.5 + (this.diffY - distance * 2) * 0.2;
    }

    this.view.setHeight(Math.max(offsetY, 0));
  }

  // 触摸结束
  private async fnTouchend() {
    clearTimeout(this.__timerFixSlideOutScreen);

    if (!this.isTouch || !this.isMove) {
      this.isTouch = false;
      this.isMove = false;
      return;
    }

    const { distance, completionStayTime } = this.options;

    this.isTouch = false;
    this.isMove = false;

    this.internalLock();
    let interval = TransitionDurantion;

    if (this.diffY > distance) {
      await this.triggerRefresh();
      interval += completionStayTime;
    } else {
      this.view.setTransitionHeight(0);
    }

    this.lockTimer = setTimeout(() => {
      this.internalUnlock();
    }, interval);
  }

  // 重置
  private resetView() {
    this.completionStayTimer = setTimeout(() => {
      this.view.setTransitionHeight(0);

      this.completionStayTimer = setTimeout(() => {
        this.view.setState(RefreshViewState.Default);
      }, 300);
    }, this.options.completionStayTime);
  }

  // 触发下拉刷新
  // 锁定后也支持外部手动触发
  triggerRefresh() {
    // fix: 如果停留时，手动触发刷新，可能产生异常
    if (this.isUnmouted || this.view.state === RefreshViewState.Loading) return;
    clearTimeout(this.completionStayTimer);

    this.view.setState(RefreshViewState.Loading);
    this.view.setTransitionHeight(this.options.height);
    return this.options
      .onRefresh()
      .then(() => {
        this.view.setState(RefreshViewState.Success);
      })
      .catch(() => {
        this.view.setState(RefreshViewState.Failed);
      })
      .finally(() => {
        this.resetView();
      });
  }

  // 内部锁定，锁定后将不再触发下拉刷新
  private internalLock() {
    clearTimeout(this.lockTimer);
    this.isLock = true;
  }

  // 内部解除锁定
  private internalUnlock() {
    clearTimeout(this.lockTimer);
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

  // 更新配置
  updateOptions(options: Partial<Options>) {
    let changedScrollView = false;

    if (options?.scrollView && options.scrollView !== this.options.scrollView) {
      changedScrollView = true;
      this.unbindEvent();
    }

    this.options = {
      ...this.options,
      ...options
    };
    const { text, dom, scrollView } = this.options;
    this.view.updateOptions({ text, dom, scrollView });
    if (changedScrollView) {
      this.bindEvent();
    }
  }

  // 销毁
  destroy() {
    if (this.isUnmouted) return;

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

export default PullToRefresh;
