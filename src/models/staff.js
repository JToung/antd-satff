import {
  queryStaff,
  updatetaff,
  upPhoto,
  queryCash,
  queryTotalamout,
  querySaleonday,
  queryVolume,
  queryVolumeOneday,
  querySaleMonth,
  querySaleYear,
  queryProfit,
  queryVolumeMonth,
  queryVolumeYear,
  queryProfitYear,
  queryProfitMonth,
  queryDebtYear,
  queryDebtMonth,
  queryDebt,
  queryCash01,
  queryOperatorRank
} from '@/services/api';

export default {
  namespace: 'staff',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *fetchStaff({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryStaff, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response', response);
      return response;
    },
    *updatetaff({ payload }, { call, put }) {
      console.log('payload1', payload);
      const response = yield call(updatetaff, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('response1', response);
      return response;
    },
    *upPhoto({ payload }, { call, put }) {
      console.log('saveIMG', payload);
      const response = yield call(upPhoto, payload);
      yield put({
        type: 'saveIMG',
        payload: response,
      });
      console.log('IMGresponse1', response);
      return response;
    },
    *queryCash({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryCash, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryCash', response);
      return response;
    },
    *queryCash01({ payload }, { call, put }) {
      console.log('save', payload);
      const response = yield call(queryCash01, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryCash01', response);
      return response;
    },
    *queryTotalamout({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryTotalamout, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryTotalamoutresponse', response);
      return response;
    },
    *querySaleonday({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(querySaleonday, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('querySaleondayresponse', response);
      return response;
    },
    *queryVolume({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryVolume, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolume', response);
      return response;
    },
    *queryVolumeOneday({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryVolumeOneday, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolumeOneday', response);
      return response;
    },
    *querySaleMonth({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(querySaleMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('querySaleMonth', response);
      return response;
    },
    *querySaleYear({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(querySaleYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('querySaleYear', response);
      return response;
    },
    *queryProfit({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryProfit, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryProfit', response);
      return response;
    },
    *queryVolumeMonth({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryVolumeMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolumeMonth', response);
      return response;
    },
    *queryVolumeYear({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryVolumeYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryVolumeYear', response);
      return response;
    },
    *queryProfitMonth({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryProfitMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryProfitMonth', response);
      return response;
    },
    *queryProfitYear({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryProfitYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryProfitYear', response);
      return response;
    },
    *queryDebtMonth({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryDebtMonth, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryDebtMonth', response);
      return response;
    },
    *queryDebtYear({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryDebtYear, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryDebtYear', response);
      return response;
    },
    *queryDebt({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryDebt, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryDebt', response);
      return response;
    },
    *queryOperatorRank({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryOperatorRank, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryOperatorRank', response);
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
    saveIMG(state, action) {
      return {
        ...state,
        url: action.payload,
      };
    },
  },
};
