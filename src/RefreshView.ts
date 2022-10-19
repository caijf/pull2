import View from './View';
import './RefreshView.less';
import { hasOwnProperty, isWindow } from './util';

// 内部状态
export enum State {
  Default = 'default',
  Drop = 'drop',
  Loading = 'loading',
  Success = 'success',
  Failed = 'failed'
}

// 默认dom
const defaultDom = {
  [State.Default]:
    '<span class="pull2-to-refresh-icon"><span class="pull2-icon pull2-icon-circle"></span></span><%=text%>',
  [State.Drop]:
    '<span class="pull2-to-refresh-icon"><span class="pull2-icon pull2-icon-circle"></span></span><%=text%>',
  [State.Loading]:
    '<span class="pull2-to-refresh-icon"><span class="pull2-icon pull2-icon-circle pull2-icon-spin"></span></span><%=text%>',
  [State.Success]:
    '<span class="pull2-to-refresh-icon"><span class="pull2-icon pull2-icon-check"></span></span><%=text%>',
  [State.Failed]:
    '<span class="pull2-to-refresh-icon"><span class="pull2-icon pull2-icon-x"></span></span><%=text%>'
};

// 默认文本
const defaultText = {
  [State.Default]: '下拉刷新',
  [State.Drop]: '释放刷新',
  [State.Loading]: '刷新中...',
  [State.Success]: '刷新成功',
  [State.Failed]: '刷新失败'
};

const prefixCls = 'pull2-to-refresh';

// 实例配置
export type Options = {
  scrollView?: HTMLElement;
  text?: Partial<typeof defaultText>;
  dom?: Partial<typeof defaultDom>;
};

class RefreshView extends View {
  state: State;
  options: { scrollView: HTMLElement; text: typeof defaultText; dom: typeof defaultDom };
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
    this.setStyle({ height: '0px', overflow: 'hidden' });
    this.html(this.getHtml(this.state));

    this.render();
  }

  private __getWrapper(wrapper: any) {
    return isWindow(wrapper) || wrapper === document.documentElement ? document.body : wrapper;
  }

  private render() {
    const { scrollView } = this.options;
    const wrapper = this.__getWrapper(scrollView);
    if (wrapper.firstChild) {
      wrapper.insertBefore(this.el, wrapper.firstChild);
    } else {
      wrapper.append(this.el);
    }
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

    this.setState(this.state, true);

    if (changedWrapper) {
      this.render();
    }
  }

  private getHtml(state: State) {
    const { dom, text } = this.options;
    return dom[state] ? dom[state].replace(this.tplMarkText, text[state]) : '';
  }

  setState(state: State, force = false) {
    if (this.state === state && !force) {
      return;
    }

    if (!hasOwnProperty(this.options.dom, state)) {
      throw 'RefreshView 不支持 ' + state + ' 状态';
    }

    if (this.state !== state) {
      this.removeClass(`${prefixCls}-${this.state}`);
      this.state = state;
      this.addClass(`${prefixCls}-${this.state}`);
    }

    const htmlStr = this.getHtml(state);
    this.html(htmlStr);
  }
}

export default RefreshView;
