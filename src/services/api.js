import { stringify } from 'qs';
import request from '@/utils/request';
import { OPERATOR_URL } from '../utils/Constants';
import ajax from './ajax';

//查询运营商
export async function queryOperator(id) {
  console.log('api', id);
  return request(`${OPERATOR_URL}/manager/queryoperator?_id=${id}`);
}

export async function updateOperator(params) {
  console.log('api1', params);
  return request(`${OPERATOR_URL}/manager/updateoperator?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新法人照片
export async function uplegalPersonPhoto(params) {
  console.log('api1', params);
  return request(`${OPERATOR_URL}/manager/addimage?_id=${params.id}`, {
    method: 'POSTIMG',
    body: params,
  });
}

//添加品类
export async function addCategory(params) {
  return request(`${OPERATOR_URL}/manager/addcategory`, {
    method: 'POST',
    body: params,
  });
}

//添加品类
export async function editorCategory(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/updateCategory_O?_id=${params.id}`,{
    method: 'POST',
    body: params,
  });
}

//查看品类
export async function queryCategory(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/queryCategory?${stringify(params)}`);
}

//删除品类
export async function deleteCategory(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/deletecategory?_id=${params.id}`,{
    method: 'POST',
    body: params,
  });
}

//上下架品类
export async function uporoffCategory(params) {
  console.log('uporoffCategoryapi', params);
  return request(`${OPERATOR_URL}/manager/uporoff?_id=${params.id}`,{
    method: 'POST',
    body: params,
  });
}

//查看单品列表
export async function queryItem(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/queryitem?${stringify(params)}`);
}

//查看单品
export async function queryByItem(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/querybyitem?_id=${params.id}`);
}

//查看任务
export async function queryTask(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/querytask?_id=${params.id}`);
}

//添加单品
export async function addItem(params) {
  return request(`${OPERATOR_URL}/manager/additem`, {
    method: 'POST',
    body: params,
  });
}

//添加分区
export async function addPartition(params) {
  return request(`${OPERATOR_URL}/manager/addpartition`, {
    method: 'POST',
    body: params,
  });
}

//添加任务
export async function addTask(params) {
  return request(`${OPERATOR_URL}/manager/addtask`, {
    method: 'POST',
    body: params,
  });
}

//添加中断要求
export async function addInterrupt(params) {
  return request(`${OPERATOR_URL}/manager/addInterrupt`, {
    method: 'POST',
    body: params,
  });
}

//更新单品
export async function upItem(params) {
  return request(`${OPERATOR_URL}/manager/updateitem?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新分区
export async function upPartition(params) {
  return request(`${OPERATOR_URL}/manager/updatepartition?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新任务
export async function upTask(params) {
  return request(`${OPERATOR_URL}/manager/updatetask?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//更新中断要求
//params.id = 中断要求id
export async function upInterrupt(params) {
  return request(`${OPERATOR_URL}/manager/updateinterrupt?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function fakeLogin(params) {
  console.log('params', params);
  return request(`${OPERATOR_URL}/operator/signin`, {
    method: 'POST',
    body: params,
  });
}


export async function getCaptcha() {
  // console.log('img', request(`${OPERATOR_URL}/operator/signin`));
  return request(`${OPERATOR_URL}/operator/signin`);
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
