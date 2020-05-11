import { addCategory, queryCategory, editorCategory, deleteCategory, uporoffCategory } from '@/services/api';

export default {
  namespace: 'category',

  state: {
    //用来保存数据
    data: [],
  },

  effects: {
    *fetchCategory({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(queryCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('queryCategory', response);
      return response;
    },
    *addCategory({ payload }, { call, put }) {
      console.log('addCategoryPayload', payload);
      const response = yield call(addCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('addCategoryResponse', response);
      return response;
    },
    *editorCategory({ payload }, { call, put }) {
      console.log('editorCategoryPayload', payload);
      const response = yield call(editorCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('editorCategoryResponse', response);
      return response;
    },
    *deleteCategory({ payload }, { call, put }) {
      console.log('deleteCategoryPayload', payload);
      const response = yield call(deleteCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('deleteCategoryResponse', response);
      return response;
    },
    *uporoffCategory({ payload }, { call, put }) {
      console.log('uporoffCategoryPayload', payload);
      const response = yield call(uporoffCategory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      console.log('uporoffCategoryResponse', response);
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
