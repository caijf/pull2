// 是否为 window 对象
export const isWindow = (obj: any) => {
  return obj !== null && obj !== undefined && obj === obj?.window;
};

// 是否支持Touch事件
export const isSupportTouch = typeof window === 'object' && 'ontouchstart' in window;

// 事件
export const Events = {
  start: isSupportTouch ? 'touchstart' : 'mousedown',
  move: isSupportTouch ? 'touchmove' : 'mousemove',
  end: isSupportTouch ? 'touchend' : 'mouseup',
  cancel: 'touchcancel'
};

// 获取滚动条距离顶部长度
export function getScrollTop(el: HTMLElement | Window) {
  var top = 0;

  if (el === document.body || el === document.documentElement || el === window) {
    top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
  } else {
    // @ts-ignore
    top = el.scrollTop;
  }

  return top;
}

// 获取事件触发客户端坐标
export function getClient(e: any) {
  let x = 0,
    y = 0;
  if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
    x = e.clientX;
    y = e.clientY;
  } else if (e.touches && e.touches[0]) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  } else if (e.changedTouches && e.changedTouches[0]) {
    x = e.changedTouches[0].clientX;
    y = e.changedTouches[0].clientY;
  }
  return {
    clientX: x,
    clientY: y
  };
}

export function formatPx(num: string | number) {
  return typeof num === 'number' ? `${num}px` : num;
}

export function hasOwnProperty(obj: Record<string, any>, prop: string | number) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// 重绘
export function reflow(el?: HTMLElement) {
  return el?.scrollTop;
}

// 获取可视高度
export function getClientHeight(el: HTMLElement | Window) {
  if (typeof window === 'undefined') {
    return 0;
  }
  if (isWindow(el)) {
    return document.documentElement.clientHeight;
  }
  return (el as HTMLElement).clientHeight;
}

// 获取滚动高度
export function getScrollHeight(el: Window | HTMLElement = window) {
  if (typeof window === 'undefined') {
    return 0;
  }
  if (isWindow(el)) {
    return document.documentElement.scrollHeight;
  }
  return (el as HTMLElement).scrollHeight;
};

// 节流
export function throttle(fn: (...args: any[]) => void, wait = 300) {
  // @ts-ignore
  const context = this;
  let lastCallTime = Date.now();
  let hasTimer = false;
  let cacheArgs: any[] = [];

  return (...args: any[]) => {
    cacheArgs = args;
    if (hasTimer) return;

    const now = Date.now();
    const diffTime = now - lastCallTime;

    if (diffTime >= wait) {
      lastCallTime = now;
      fn.call(context, cacheArgs);
    } else {
      hasTimer = true;
      setTimeout(() => {
        hasTimer = false;
        lastCallTime = Date.now();
        fn.call(context, cacheArgs);
      }, wait - diffTime);
    }
  }
}