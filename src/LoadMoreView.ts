import View from './View';
import './LoadMoreView.less';
import { isWindow } from './util';

// 内部状态
export enum State {
  Default = 'default',
  Loading = 'loading',
  Failed = 'failed',
  Done = 'done'
}

// 默认dom
const defaultDom = {
  [State.Default]: '<%=text%>',
  [State.Loading]: '<%=text%>',
  [State.Failed]: '<%=text%>',
  [State.Done]: '<%=text%>'
};

// 默认文本
const defaultText = {
  [State.Default]: '上拉或点击加载更多',
  [State.Loading]: '正在加载',
  [State.Failed]: '加载失败，点击重试',
  [State.Done]: '已全部加载'
};

// 实例配置
export type Options = {
  scrollView?: HTMLElement | Window;
  text?: Partial<typeof defaultText>;
  dom?: Partial<typeof defaultDom>;
};

const prefixCls = 'pull2-load-more';

class LoadMoreView extends View {
  state: State;
  options: { text: typeof defaultText; dom: typeof defaultDom; scrollView: HTMLElement | Window };
  tplMarkText: string;

  constructor(options?: Options) {
    super();

    this.tplMarkText = '<%=text%>';
    this.state = State.Default;
    this.options = {
      scrollView: document.documentElement,
      ...options,
      text: {
        ...defaultText,
        ...options?.text
      },
      dom: {
        ...defaultDom,
        ...options?.dom
      }
    };

    this.addClass([prefixCls, `${prefixCls}-${this.state}`]);
    this.html(this.getHtml(this.state));

    this.render();
  }

  private __getWrapper(wrapper: Window | HTMLElement) {
    return isWindow(wrapper) || wrapper === document.documentElement
      ? document.body
      : (wrapper as HTMLElement);
  }

  private render() {
    const { scrollView } = this.options;
    const wrapper = this.__getWrapper(scrollView);
    wrapper.appendChild(this.el);
  }

  updateOptions(options: Options) {
    let changedWrapper = false;
    if (options.scrollView && options.scrollView !== this.options.scrollView) {
      changedWrapper = true;
      this.__getWrapper(this.options.scrollView).removeChild(this.el);
    }
    this.options = {
      ...this.options,
      ...options,
      text: {
        ...this.options.text,
        ...options?.text
      },
      dom: {
        ...this.options.dom,
        ...options?.dom
      }
    };

    if (changedWrapper) {
      this.render();
    }
  }

  getHtml(state: State) {
    const { dom, text } = this.options;
    return dom[state] ? dom[state].replace(this.tplMarkText, text[state]) : '';
  }

  setState(state: State) {
    if (this.state === state) {
      return;
    }

    const htmlStr = this.getHtml(state);

    if (!htmlStr) {
      throw 'RefreshView 不支持 ' + state + ' 状态';
    }

    this.removeClass(`${prefixCls}-${this.state}`);
    this.state = state;
    this.addClass(`${prefixCls}-${this.state}`);
    this.html(htmlStr);
  }
}

export default LoadMoreView;
