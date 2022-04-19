import Vue from 'vue'
import Vuex from 'vuex'
import appLoading from '@/store/appLoading';
import error from '@/store/error';
import {authLogin, authRegister} from '@/store/auth/index';
import {roomsData} from '@/store/rooms/index';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
    resetAll({commit}) {
			commit('appLoading/reset');
			commit('error/reset');
			commit('authLogin/reset');
			commit('authRegister/reset');
			commit('authPassword/reset');
      commit('roomsData/reset');
			return Promise.resolve();
		}
  },
	modules: {
    authLogin,
    authRegister,
		appLoading,
		error,
    roomsData
	},
})


if (module.hot) {
  module.hot.accept([
    '@/store/appLoading',
    '@/store/error',
    '@/store/auth/index',
    '@/store/rooms/index'
  ], () => {
    // noinspection NpmUsedModulesInstalled
    store.hotUpdate({
      modules: {
        appLoading: require('@/store/appLoading').default,
        authLogin: require('@/store/auth/index').default,
        roomsData: require('@/store/rooms/index').default,
        error: require('@/store/error').default
      }
    });
  });
}

export default store;