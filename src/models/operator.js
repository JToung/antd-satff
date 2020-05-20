import { queryOperator , queryAdjust, verifyOperator , queryContract, addContract} from '@/services/api';

export default {
  namespace: 'operator',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *fetchOperator({ payload }, { call, put }) {
      console.log('payload',payload);
      const response = yield call(queryOperator, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response',response);
      return response
    },
    //获取审核列表
    *fetchAdjust({ payload }, { call, put }) {
      console.log('payload1', payload);
      const response = yield call(queryAdjust, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryAdjust1', response);
      return response;
    },
    *verifyOperator({ payload }, { call, put }) {
      console.log('verifyOperatorpayload1',payload);
      const response = yield call(verifyOperator, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('verifyOperator',response);
      return response;
    },
    *queryContract({ payload }, { call, put }) {
      console.log('payload1',payload);
      const response = yield call(queryContract, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response1',response);
      return response;
    },
    *addContract({ payload }, { call, put }) {
      console.log('addContractpayload1',payload);
      const response = yield call(addContract, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('addContract',response);
      return response;
    },
    // *upOperator({ payload }, { call, put }) {
    //   console.log('payload1',payload);
    //   const response = yield call(updateOperator, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   console.log('response1',response);
    //   return response;
    // },
    // *uplegalPersonPhoto({ payload }, { call, put }) {
    //   console.log('saveIMG',payload);
    //   const response = yield call(uplegalPersonPhoto, payload);
    //   yield put({
    //     type: 'saveIMG',
    //     payload: response,
    //   });
    //   console.log('IMGresponse1',response);
    //   return response;
    // },
  },

  
  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveIMG(state, action) {
      return {
        ...state,
        url: action.payload,
      };
    },
  },
};
