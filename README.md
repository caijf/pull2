# pull2

提供了 **下拉刷新** 和 **滚动底部加载** 两个组件。

## 特性

- 原生 js 开发，不依赖任何框架，也可以集成到任何框架
- 导出 `umd`、`cjs`、 `es` 模块，适用多种应用场景
- 支持自定义文本和 dom
- 使用 TypeScript 开发，提供完整的类型定义文件

## 在线示例

> 你也可以将项目下载到本地，安装依赖后，执行 `yarn start` 查看开发示例。

- [下拉刷新](https://githubbox.com/caijf/pull2/tree/main/examples/native)
- [滚动底部加载](https://githubbox.com/caijf/pull2/tree/main/examples/native)
- [下拉刷新 + 滚动底部加载](https://githubbox.com/caijf/pull2/tree/main/examples/native)

## 安装

### `es` 或 `node` 开发环境

安装依赖

```bash
npm install pull2
```

或你使用 yarn ，其他包管理工具也支持。

```bash
yarn add pull2
```

项目中使用

```typescript
import { PullToRefresh, ScrollToLoadMore } from 'pull2';
```

### 原生 js 开发环境

如果你的项目使用的是原生方式开发，可以在浏览器中使用 script 标签直接引入文件，并使用全局变量 pull2 。

npm 包的 dist 目录下提供了 UMD 包 pull2.umd.js 以及 pull2.umd.min.js。你也可以通过 [UNPKG](https://unpkg.com/pull2/dist/) 下载到本地进行使用。或者直接使用 [UNPKG 线上版本](https://unpkg.com/pull2@latest/dist/pull2.umd.min.js)<sup>注意版本</sup>。

```javascript
// pull2.PullToRefresh
// pull2.ScrollToLoadMore
```

## API

### PullToRefresh - 下拉刷新

```typescript
import { PullToRefresh } from 'pull2';

// 实例配置项
const pullToRefreshInstance = new PullToRefresh(options: {
  onRefresh: () => Promise<any>; // 必填。下拉刷新触发方法。
  scrollView?: HTMLElement; // 滚动容器 dom 。默认 document.documentElement
  distance?: number; // 下拉距离多少触发刷新。默认 60 。
  height?: number; // 下拉刷新视图的高度（刷新中、刷新完成的高度，回弹动画需要）。默认 40 。
  unmovableStayTime?: number; // 不动的停留时间，单位毫秒。默认 3000 。
  completionStayTime?: number; // 完成状态停留时间，单位毫秒。默认 500 。
  updateOptions?: Partial<Options>; // 更新配置项。
  text?: { // 自定义文本
    default?: string; // 下拉刷新
    drop?: string; // 释放刷新
    loading?: string; // 刷新中
    failed?: string; // 刷新失败
    success?: string; // 刷新成功
  };
  dom?: { // 自定义 dom ，优先级比自定义文本高
    default?: string;
    drop?: string;
    loading?: string;
    failed?: string;
    success?: string;
  };
});

// 实例方法
pullToRefreshInstance.triggerRefresh(); // 手动触发下拉刷新。
pullToRefreshInstance.lock(); // 锁定，无法触发下拉操作。但还可以通过 triggerRefresh 触发下拉刷新。
pullToRefreshInstance.unlock(); // 解除锁定。
pullToRefreshInstance.destroy(); // 销毁，删除 dom，无法触发下拉操作，也无法通过 triggerRefresh 触发下拉刷新。
pullToRefreshInstance.resume(); // 销毁之后，如果执行该方法可恢复dom 和下拉操作。
```

### ScrollToLoadMore - 滚动底部加载

```typescript
import { ScrollToLoadMore } from 'pull2';

// 实例配置项
const scrollToLoadMoreInstance = new ScrollToLoadMore(options: {
  onScrollLower: () => Promise<any>; // 必填。滚动底部触发方法。
  isNoMore?: (res: T) => boolean; // 每次加载成功后触发该，判断是否没有更多了（加载完成）。返回 true 表示没有更多了，显示加载完成。
  scrollView?: HTMLElement; // 滚动容器 dom 。默认 document.documentElement
  threshold?: number; // 滚动距离底部多少触发。默认 100 。
  autoCheckOnContentUpdate?: boolean; // 加载成功后是否自动判断满足触发加载更多条件。默认 true 。
  throttleWaitTime?: number; // 滚动事件方法节流时间，单位毫秒。默认 50 。
  updateOptions?: Partial<Options>; // 更新配置项。
  text?: { // 自定义文本
    default?: string; // 上拉或点击加载更多
    loading?: string; // 正在加载
    failed?: string; // 加载失败，点击重试
    done?: string; // 已全部加载
  };
  dom?: { // 自定义 dom ，优先级比自定义文本高
    default?: string;
    loading?: string;
    failed?: string;
    done?: string;
  };
});

// 实例方法
scrollToLoadMoreInstance.triggerLoad(); // 手动触发加载方法，即 onScrollLower。
scrollToLoadMoreInstance.checkLoad(); // 检测当前滚动条位置是否满足触发加载方法条件，如果满足立即调用加载方法。
scrollToLoadMoreInstance.reset(); // 重置视图到默认状态，不会触发加载方法。例如下拉刷新后，需要重置底部加载更多为默认状态。
scrollToLoadMoreInstance.lock(); // 锁定，滚动操作不会触发加载方法。但还可以通过 triggerLoad 触发加载方法。
scrollToLoadMoreInstance.unlock(); // 解除锁定。
scrollToLoadMoreInstance.destroy(); // 销毁，删除 dom，滚动操作不会触发加载方法，也无法通过 triggerLoad 触发。
scrollToLoadMoreInstance.resume(); // 销毁之后，如果执行该方法可恢复dom 和滚动操作可触发加载方法。
```
