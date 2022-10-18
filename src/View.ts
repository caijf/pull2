import { formatPx, hasOwnProperty, reflow } from './util';

function processClass(className?: string | string[]) {
  let cls: string[] = [];
  if (Array.isArray(className)) {
    cls = className;
  } else {
    cls = className && typeof className === 'string' ? [className] : [];
  }
  return cls;
}

class View {
  el: HTMLElement;
  handler: { [k: string]: ((...args: any[]) => void)[] };
  isUnmounted: boolean;
  private transitionTimer: any;

  constructor(element?: HTMLElement) {
    this.el = element ? element : document.createElement('div');
    this.handler = {};
    this.isUnmounted = false; // 标识卸载
    this.transitionTimer = null; // 过度样式定时器
  }

  on(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
    if (this.isUnmounted) return;

    if (!this.handler[type]) {
      this.handler[type] = [];
    }
    this.handler[type].push(listener);
    this.el.addEventListener(type, listener, options);
  }

  off(type: string, listener: EventListener, options?: boolean | AddEventListenerOptions) {
    if (this.isUnmounted) return;

    this.el.removeEventListener(type, listener, options);
  }

  setAttrs(obj: Record<string, any>) {
    if (this.isUnmounted) return;

    if (obj && typeof obj === 'object') {
      for (const prop in obj) {
        if (hasOwnProperty(obj, prop)) {
          this.el.setAttribute(prop, obj[prop]);
        }
      }
    }
  }

  setStyle(obj: Record<string, string>) {
    if (this.isUnmounted) return;

    if (obj && typeof obj === 'object') {
      for (const prop in obj) {
        if (hasOwnProperty(obj, prop)) {
          // @ts-ignore
          this.el.style[prop] = obj[prop];
        }
      }
    }
  }

  updateTransition(enabled = false) {
    const transValue = enabled ? 'all .3s' : '';
    this.setStyle({ webkitTransition: transValue, transition: transValue });
  }

  html(htmlStr: string) {
    if (this.isUnmounted) return;

    this.el.innerHTML = htmlStr;
  }

  getHeight() {
    return this.el?.clientHeight || 0;
  }

  setHeight(num: number | string) {
    this.setStyle({ height: formatPx(num) });
  }

  setTransitionHeight(num: number | string) {
    if (this.isUnmounted) return;

    clearTimeout(this.transitionTimer);

    this.updateTransition(true);
    reflow(this.el);
    this.setHeight(num);
    this.transitionTimer = setTimeout(() => {
      this.updateTransition(false);
    }, 300);
  }

  addClass(className?: string | string[]) {
    if (this.isUnmounted) return;

    const cls = processClass(className);
    if (cls.length <= 0) {
      return;
    }
    const prevClasses = this.el.getAttribute('class');
    const arrPrevClasses = !prevClasses ? [] : prevClasses.split(' ');
    const arrNextClasses = arrPrevClasses.filter(itemCls => cls.indexOf(itemCls) === -1).concat(cls);
    this.setAttrs({ class: arrNextClasses.join(' ') });
  }

  removeClass(className?: string | string[]) {
    if (this.isUnmounted) return;

    const cls = processClass(className);
    if (cls.length <= 0) {
      return;
    }
    const prevClasses = this.el.getAttribute('class');
    const arrPrevClasses = !prevClasses ? [] : prevClasses.split(' ');
    const arrNextClasses = arrPrevClasses.filter(itemCls => cls.indexOf(itemCls) === -1);
    this.setAttrs({ class: arrNextClasses.join(' ') });
  }

  show() {
    this.setStyle({ display: 'block' });
  }

  hide() {
    this.setStyle({ display: 'none' });
  }

  destroy() {
    if (this.isUnmounted) return;

    for (const type in this.handler) {
      if (this.handler[type].length > 0) {
        for (let i = 0; i < this.handler[type].length; i++) {
          this.off(type, this.handler[type][i]);
        }
        this.handler[type].length = 0;
      }
      delete this.handler[type];
    }
    this.el.parentNode?.removeChild(this.el);
    this.isUnmounted = true;
  }
}

export default View;