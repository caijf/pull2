import { ScrollToLoadMore } from 'pull2';
import { getPageDataApi } from './mock-api.js';

let current = 1; // 当前页码

const scrollToloadMoreInstance = new ScrollToLoadMore({
  scrollView: document.getElementById('main'),
  onScrollLower: load,
  isNoMore: (res) => {
    return res.data.length < 10;
  }
});

scrollToloadMoreInstance.checkLoad();

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
