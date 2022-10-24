import { PullToRefresh } from 'pull2';
import { getPageDataApi } from './mock-api.js';

new PullToRefresh({
  height: 60,
  dom: {
    default:
      '<div class="loadRefresh-over-box"><div class="slogan"><p class="refresh_slogan"></p><p><i class="i-loading"></i><span>--下拉可刷新--</span></p></div></div>',
    drop: '<div class="loadRefresh-over-box"><div class="slogan"><p class="refresh_slogan"></p><p><i class="i-loading"></i><span>--释放可刷新--</span></p></div></div>',
    loading:
      '<div class="loadRefresh-over-box"><div class="slogan"><p class="refresh_slogan"></p><p><i class="i-loading i-loading2"></i><span>--刷新中...--</span></p></div></div>',
    success:
      '<div class="loadRefresh-over-box"><div class="slogan"><p class="refresh_slogan"></p><p><i class="i-loadingSucc"></i><span>--刷新成功--</span></p></div></div>',
    failed:
      '<div class="loadRefresh-over-box"><div class="slogan"><p class="refresh_slogan"></p><p><i class="i-loadingFailed"></i><span>--未加载成功，稍后再试吧--</span></p></div></div>'
  },
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
