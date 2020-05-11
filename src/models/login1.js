import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeLogin, getCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import { message } from 'antd';
import { onGetCaptcha } from '@/pages/User1/Login';

export default {
  namespace: 'login1',

  state: {
    status: undefined,
    //用来保存返回的数据
    user: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      console.log('payloadLogin', payload);
      const response = yield call(fakeLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // if (response.status === 'ok') {
      //   reloadAuthorized();
      //   yield put(routerRedux.push('/'));
      // } else if (response.status === 'false') {
      //   message.success(response.result);
      // }
      console.log('response登录', response);
      return response
      
      // Login successfully
    },

    *getCaptcha({ payload }, { call, put }) {
      console.log('payload', payload);
      const response = yield call(getCaptcha, payload);
      console.log('response', response);
      return response;
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          result:undefined,
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          })
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, action) {
      console.log('currentAuthority', action.payload);
      setAuthority(action.payload);
      return {
        ...state,
        user: action.payload,
        status: action.payload.status,
        type: action.payload.type,
      };
    },
    // save(state, action) {
    //   return {
    //     ...state,
    //     user: action.payload,
    //   };
    // },
  },
};
