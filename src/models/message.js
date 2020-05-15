import { queryNews, queryOneNews, setRead} from '@/services/api';

export default {
  namespace: 'message',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *queryNews({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryNews, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryNews', response);
      return response;
    },
    *queryOneNews({ payload }, { call, put }) {
      console.log('queryOneNewsPayload', payload);
      const response = yield call(queryOneNews, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryOneNewsResponse', response);
      return response;
    },
    *setRead({ payload }, { call, put }) {
      console.log('setReadPayload', payload);
      const response = yield call(setRead, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('setReadResponse', response);
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
