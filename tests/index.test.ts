/**
 * @jest-environment jsdom
 */
import { PullToRefresh, ScrollToLoadMore } from '..';

beforeEach(() => {
  // 每个测试单元开始前清空dom
  document.body.innerHTML = '';
});

describe('PullToRefresh', () => {
  it('render default', async () => {
    const fn = jest.fn().mockRejectedValueOnce({}).mockResolvedValue({});
    const pullToRefreshInstance = new PullToRefresh({
      onRefresh: fn
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // mock drop
    // TODO 模拟下拉操作 mousedown/mousemove事件
    // @ts-ignore
    pullToRefreshInstance.view.setState('drop');
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    const p = pullToRefreshInstance.triggerRefresh();

    // loding
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // failed
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await pullToRefreshInstance.triggerRefresh();

    // success
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('render define', async () => {
    document.body.innerHTML = '<div id="content">test</div>';
    const fn = jest.fn().mockRejectedValueOnce({}).mockResolvedValue({});
    const pullToRefreshInstance = new PullToRefresh({
      onRefresh: fn,
      dom: {
        default: '<div>默认</div>',
        drop: '<div>拖动</div>',
        loading: '<div>加载</div>',
        failed: '<div>失败</div>',
        success: '<div>成功</div>'
      }
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // mock drop
    // TODO 模拟下拉操作 mousedown/mousemove事件
    // @ts-ignore
    pullToRefreshInstance.view.setState('drop');
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    const p = pullToRefreshInstance.triggerRefresh();

    // loding
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // failed
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await pullToRefreshInstance.triggerRefresh();

    // success
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('render update', async () => {
    document.body.innerHTML = '<div id="content">test</div>';
    const fn = jest.fn().mockRejectedValueOnce({}).mockResolvedValue({});
    const pullToRefreshInstance = new PullToRefresh({
      onRefresh: fn
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    pullToRefreshInstance.updateOptions({
      dom: {
        default: '<div>默认</div>',
        drop: '<div>拖动</div>',
        loading: '<div>加载</div>',
        failed: '<div>失败</div>',
        success: '<div>成功</div>'
      }
    });

    // default 2
    expect(document.body.innerHTML).toMatchSnapshot();

    // mock drop
    // TODO 模拟下拉操作 mousedown/mousemove事件
    // @ts-ignore
    pullToRefreshInstance.view.setState('drop');
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    const p = pullToRefreshInstance.triggerRefresh();

    // loding
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // failed
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await pullToRefreshInstance.triggerRefresh();

    // success
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('destroy & resume', async () => {
    const fn = jest.fn().mockResolvedValue({});
    const pullToRefreshInstance = new PullToRefresh({
      onRefresh: fn
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // destroy
    pullToRefreshInstance.destroy();
    pullToRefreshInstance.triggerRefresh();

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // resume
    pullToRefreshInstance.resume();
    const p = pullToRefreshInstance.triggerRefresh();

    // loading
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // success
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('ScrollToLoadMore', () => {
  it('render default', async () => {
    const fn = jest.fn().mockRejectedValueOnce({}).mockResolvedValue({ done: true });
    const scrollToLoadMoreInstance = new ScrollToLoadMore({
      onScrollLower: fn,
      isNoMore: (res) => res?.done
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // 模拟点击
    // @ts-ignore
    // scrollToLoadMoreInstance.view.el.click();
    const p = scrollToLoadMoreInstance.triggerLoad();

    // loding
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // failed
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    // 模拟点击
    // @ts-ignore
    // scrollToLoadMoreInstance.view.el.click();
    await scrollToLoadMoreInstance.triggerLoad();

    // success
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('render define', async () => {
    document.body.innerHTML = '<div id="content">test</div>';
    const fn = jest.fn().mockRejectedValueOnce({}).mockResolvedValue({ done: true });
    const scrollToLoadMoreInstance = new ScrollToLoadMore({
      onScrollLower: fn,
      isNoMore: (res) => res?.done,
      dom: {
        default: '<div>默认</div>',
        loading: '<div>加载</div>',
        failed: '<div>失败</div>',
        done: '<div>完成</div>'
      }
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // 模拟点击
    // @ts-ignore
    // scrollToLoadMoreInstance.view.el.click();
    const p = scrollToLoadMoreInstance.triggerLoad();

    // loding
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // failed
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    // 模拟点击
    // @ts-ignore
    // scrollToLoadMoreInstance.view.el.click();
    await scrollToLoadMoreInstance.triggerLoad();

    // success
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('render update', async () => {
    document.body.innerHTML = '<div id="content">test</div>';
    const fn = jest.fn().mockRejectedValueOnce({}).mockResolvedValue({ done: true });
    const scrollToLoadMoreInstance = new ScrollToLoadMore({
      onScrollLower: fn,
      isNoMore: (res) => res?.done
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    scrollToLoadMoreInstance.updateOptions({
      dom: {
        default: '<div>默认</div>',
        loading: '<div>加载</div>',
        failed: '<div>失败</div>',
        done: '<div>完成</div>'
      }
    });

    // default 2
    expect(document.body.innerHTML).toMatchSnapshot();

    // 模拟点击
    // @ts-ignore
    // scrollToLoadMoreInstance.view.el.click();
    const p = scrollToLoadMoreInstance.triggerLoad();

    // loding
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // failed
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    // 模拟点击
    // @ts-ignore
    // scrollToLoadMoreInstance.view.el.click();
    await scrollToLoadMoreInstance.triggerLoad();

    // success
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('destroy & resume', async () => {
    const fn = jest.fn().mockResolvedValue({});
    const scrollToLoadMoreInstance = new ScrollToLoadMore({
      onScrollLower: fn
    });

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // destroy
    scrollToLoadMoreInstance.destroy();
    scrollToLoadMoreInstance.triggerLoad();

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(0);

    // resume
    scrollToLoadMoreInstance.resume();
    const p = scrollToLoadMoreInstance.triggerLoad();

    // loading
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);

    await p;

    // default
    expect(document.body.innerHTML).toMatchSnapshot();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
