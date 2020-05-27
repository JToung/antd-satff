import {
  queryOrder,
  queryWorkorder,
  queryPartition,
  queryAssign,
  assignPost,
  queryLog,
  queryBadOrderMonth,
  queryBadOrder,
  queryGoodOrder,
  queryGoodOrderMonth,
  queryTotalOrder,
  queryTotalOrderYear,
  queryTotalOrderOneday,
  queryTotalOrderMonth,
  queryBadOrderYear,
  queryGoodOrderYear,
  queryPartitonRank,
} from '@/services/api';

export default {
  namespace: 'order',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *queryOrder({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryOrder', response);
      return response;
    },
    *queryWorkorder({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryWorkorder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryWorkorder', response);
      return response;
    },
    *queryPartition({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryPartition, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryPartition', response);
      return response;
    },
    *queryAssign({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryAssign, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryAssign', response);
      return response;
    },
    *assignPost({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(assignPost, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('assignPost', response);
      return response;
    },
    *queryLog({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryLog, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryLog', response);
      return response;
    },
    *queryBadOrderMonth({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryBadOrderMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryBadOrderMonth', response);
      return response;
    },
    *queryBadOrder({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryBadOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryBadOrder', response);
      return response;
    },
    *queryGoodOrder({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryGoodOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryGoodOrder', response);
      return response;
    },
    *queryGoodOrderMonth({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryGoodOrderMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryGoodOrderMonth', response);
      return response;
    },
    *queryTotalOrder({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryTotalOrder, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryTotalOrder', response);
      return response;
    },
    *queryTotalOrderYear({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryTotalOrderYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryTotalOrderYear', response);
      return response;
    },
    *queryTotalOrderOneday({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryTotalOrderOneday, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryTotalOrderOneday', response);
      return response;
    },
    *queryTotalOrderMonth({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryTotalOrderMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryTotalOrderMonth', response);
      return response;
    },
    *queryBadOrderYear({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryBadOrderYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryBadOrderYear', response);
      return response;
    },
    *queryGoodOrderYear({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryGoodOrderYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryGoodOrderYear', response);
      return response;
    },
    *queryPartitonRank({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryPartitonRank, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryPartitonRank', response);
      return response;
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
