import {
    queryWorkorder,
    queryPartition,
    queryAssign,
    assignPost
  } from '@/services/api';
  
  export default {
    namespace: 'workorder',
  
    state: {
      //用来保存数据
      data: [],
    },
  
    effects: {
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
  