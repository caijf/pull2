import Mockjs from 'mockjs';
import { waitTime } from 'util-helpers';

// 随机数据总数量
const total = Math.ceil(Math.random() * 50) + 20;

// 获取分页列表数据接口
export async function getPageDataApi(current = 1, pageSize = 10) {
  await waitTime();

  if (Math.random() < 0.1) {
    return Promise.reject();
  }

  const realPageSize = pageSize < 1 ? 1 : pageSize;
  const realCurrent = current < 1 ? 1 : current;

  // 剩余数量
  const restSize = total - realPageSize * (realCurrent - 1);

  // 当前页码的数量
  const size = restSize > realPageSize ? realPageSize : restSize;

  if (size === 0) {
    return {
      data: [],
      total
    };
  }

  // mock 数据模型
  const mockModel = {
    'id|+1': realPageSize * (realCurrent - 1) + 1,
    'age|10-50': 10,
    name: '@cname'
  };

  const data =
    size === 1
      ? [Mockjs.mock(mockModel)]
      : Mockjs.mock({
          ['data|' + size]: [mockModel]
        }).data;

  return Promise.resolve({
    data,
    total
  });
}
