/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

// 延迟执行
function waitTime(time) {
  time = time || 1000;
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

// 随机数据总数量
var total = Math.ceil(Math.random() * 50) + 20;

// 获取分页列表数据
function getPageData(current, pageSize) {
  current = current || 1;
  pageSize = pageSize || 10;
  var realPageSize = pageSize < 1 ? 1 : pageSize;
  var realCurrent = current < 1 ? 1 : current;

  // 剩余数量
  var restSize = total - realPageSize * (realCurrent - 1);

  // 当前页码的数量
  var size = restSize > realPageSize ? realPageSize : restSize;

  if (size === 0) {
    return {
      data: [],
      total: total
    };
  }

  // mock 数据模型
  var mockModel = {
    'id|+1': realPageSize * (realCurrent - 1) + 1,
    'age|10-50': 10,
    name: '@cname'
  };
  var mockDataProp = 'data|' + size;
  var mockDataObj = {};
  mockDataObj[mockDataProp] = [mockModel];

  var mockData = size === 1 ? [Mock.mock(mockModel)] : Mock.mock(mockDataObj).data;

  return {
    data: mockData,
    total: total
  };
}

// 获取分页列表数据接口
function getPageDataApi(current, pageSize) {
  current = current || 1;
  pageSize = pageSize || 10;
  return waitTime().then(function () {
    // 模拟请求失败
    if (Math.random() < 0.2) {
      return Promise.reject();
    }
    return Promise.resolve(getPageData(current, pageSize));
  });
}
