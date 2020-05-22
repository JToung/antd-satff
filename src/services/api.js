import { stringify } from 'qs';
import request from '@/utils/request';
import { OPERATOR_URL, platform_URL } from '../utils/Constants';
import ajax from './ajax';

//查询信息
export async function queryNews(params) {
  // console.log('api', params);
  return request(
    `${OPERATOR_URL}/manager/getnews?receiveId=${params.pt}&read=${
      params.read
    }`
  );
}

//查询单个信息
export async function queryOneNews(params) {
  // console.log('queryOneNews', params.id);
  return request(`${OPERATOR_URL}/manager/getnews?_id=${params.id}`);
}

//更新消息已读
export async function setRead(params) {
  // console.log('setRead', params.id);
  return request(`${OPERATOR_URL}/manager/setread?_id=${params.id}`, {
    method: 'POST',
    body: params,
  });
}

//查询平台商
export async function queryStaff(id) {
  console.log('api', id);
  return request(`${platform_URL}/platform/querystaff?_id=${id}`);
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

/**
 * 审核列表
 * @param {*} params 
 * object c：品类，o:运营商，I:单品，i: 中断要求,p:分区,t:任务
 */
export async function queryAdjust(params) {
  console.log('api1', params);
  return request(`${platform_URL}/platform/queryadjust?${stringify(params)}`);
}

//审核品类
//params.id = 中断要求id
export async function verifyCategory(params) {
  return request(`${platform_URL}/platform/verifycategory?_id=${params._id}`, {
    method: 'POST',
    body: params,
  });
}


//查看运营商列表
export async function queryOperator(params) {
  return request(`${platform_URL}/platform/queryoperator?${stringify(params)}`);
}

//审核运营商
//params.id = 中断要求id
export async function verifyOperator(params) {
  return request(`${platform_URL}/platform/verifyoperator?adjustId=${params.adjustId}`, {
    method: 'POST',
    body: params,
  });
}

//查看运营商合约
export async function queryContract(params) {
  console.log('api', params);
  return request(`${platform_URL}/platform/querycontract?${stringify(params)}`);
}

//添加运营商合约
export async function addContract(params) {
  return request(`${platform_URL}/platform/addcontract`, {
    method: 'POST',
    body: params,
  });
}

//添加运营商
export async function addOperator(params) {
  return request(`${OPERATOR_URL}/manager/addoperator`, {
    method: 'POST',
    body: params,
  });
}

//订单查工单
export async function queryWorkorder(params) {
  console.log('api', params);
  return request(`${platform_URL}/platform/queryworkorder?${stringify(params)}`);
}

//查看订单列表
export async function queryOrder(params) {
  console.log('api', params);
  return request(`${platform_URL}/platform/queryorder?${stringify(params)}`);
}

//查看单个分区
export async function queryPartition(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/querypartition?_id=${params.id}`);
}

//分单-专才列表 传入工单id
export async function queryAssign(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/assign_get?_id=${params.id}`);
}

//派单
export async function assignPost(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/assignpost?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}

//查看任务分区 传入工单id
export async function queryLog(params) {
  console.log('api', params);
  return request(`${OPERATOR_URL}/manager/checklog?${stringify(params)}`);
}

//查看现金流量表
export async function queryCash(params) {
  console.log('api', params);
  return request(`${platform_URL}/platform/querycash?${stringify(params)}`);
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
  return request(`${platform_URL}/platform/signin`, {
    method: 'POST',
    body: params,
  });
}


export async function getCaptcha() {
  // console.log('img', request(`${OPERATOR_URL}/operator/signin`));
  return request(`${platform_URL}/platform/signin`);
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
