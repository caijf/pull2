import { PullToRefresh } from 'pull2';
import { getPageDataApi } from './mock-api.js';

new PullToRefresh({
  scrollView: document.getElementById('main'),
  onRefresh: refresh
});

// 处理下拉刷新成功
async function refresh() {
  const { data } = await getPageDataApi();
  let html = '';
  data.forEach((item) => {
    html += `<li class="list-group-item">${item.id} ${item.name} ${item.age}</li>`;
  });
  document.getElementById('wrapper').innerHTML = html;
}
