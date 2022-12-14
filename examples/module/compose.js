import { PullToRefresh, ScrollToLoadMore } from 'pull2';
import { getPageDataApi } from './mock-api.js';

let current = 1; // 当前页码

const pullToRefreshInstance = new PullToRefresh({
  onRefresh: () => {
    scrollToloadMoreInstance.lock();
    current = 1;
    return refresh().then(() => {
      scrollToloadMoreInstance.reset();
      scrollToloadMoreInstance.unlock();
      scrollToloadMoreInstance.checkLoad();
    });
  }
});

const scrollToloadMoreInstance = new ScrollToLoadMore({
  onScrollLower: () => {
    pullToRefreshInstance.lock();

    return load().finally(() => {
      pullToRefreshInstance.unlock();
    });
  },
  isNoMore: (res) => {
    return res.data.length < 10;
  }
});

scrollToloadMoreInstance.checkLoad();

// 处理下拉刷新成功
async function refresh() {
  const { data } = await getPageDataApi();
  let html = '';
  data.forEach((item) => {
    html += `<li class="list-group-item">${item.id} ${item.name} ${item.age}</li>`;
  });
  document.getElementById('wrapper').innerHTML = html;
  current += 1;
}

// 处理滚动底部加载
async function load() {
  const res = await getPageDataApi(current);
  const fragment = document.createDocumentFragment();

  res.data.forEach((item) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-group-item');
    li.innerHTML = `${item.id} ${item.name} ${item.age}`;
    fragment.append(li);
  });
  document.getElementById('wrapper').append(fragment);
  current += 1;
  return res;
}
