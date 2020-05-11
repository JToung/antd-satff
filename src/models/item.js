import {
  addItem,
  addPartition,
  addInterrupt,
  queryItem,
  queryByItem,
  addTask,
  queryTask,
  upItem,
  upPartition,
  upInterrupt,
  upTask,
} from '@/services/api';

export default {
  namespace: 'item',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *fetchItem({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryItem, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryItem', response);
      return response;
    },
    *fetchByItem({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryByItem, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryByItem', response);
      return response;
    },
    *fetchTask({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryTask, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('fetchTask', response);
      return response;
    },
    *addItem({ payload }, { call, put }) {
      console.log('addItemPayload', payload);
      const response = yield call(addItem, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('addItemResponse', response);
      return response;
    },
    *addPartition({ payload }, { call, put }) {
      console.log('addPartitionPayload', payload);
      const response = yield call(addPartition, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('addPartitionResponse', response);
      return response;
    },
    *addInterrupt({ payload }, { call, put }) {
      console.log('addInterruptPayload', payload);
      const response = yield call(addInterrupt, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('addInterruptResponse', response);
      return response;
    },
    *addTask({ payload }, { call, put }) {
      console.log('addTaskPayload', payload);
      const response = yield call(addTask, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('addTaskResponse', response);
      return response;
    },
    *upItem({ payload }, { call, put }) {
      console.log('upItemPayload', payload);
      const response = yield call(upItem, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('upItemResponse', response);
      return response;
    },
    *upPartition({ payload }, { call, put }) {
      console.log('upPartitionPayload', payload);
      const response = yield call(upPartition, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('upPartitionResponse', response);
      return response;
    },
    *upInterrupt({ payload }, { call, put }) {
      console.log('upInterruptPayload', payload);
      const response = yield call(upInterrupt, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('upInterruptResponse', response);
      return response;
    },
    *upTask({ payload }, { call, put }) {
      console.log('upTaskPayload', payload);
      const response = yield call(upTask, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('upTaskResponse', response);
      return response;
    },
    // *uporoffCategory({ payload }, { call, put }) {
    //   console.log('uporoffCategoryPayload', payload);
    //   const response = yield call(uporoffCategory, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   console.log('uporoffCategoryResponse', response);
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
  },
};
