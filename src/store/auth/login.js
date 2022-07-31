import axios from 'axios';
import router from '@/plugins/router';

const getInitialState = () => ({
	loading: false,
	refreshing: false,
	token: localStorage.token ?? 'null',
	error: null
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		loading: (state) => state.loading,
		error: (state) => state.error,
		token: (state) => state.token
	},
	mutations: {
		startLoading(state) {
			state.loading = true;
			state.error = null;
		},
		startRefreshing(state) {
			state.refreshing = true;
		},
		stopRefreshing(state) {
			state.refreshing = false;
		},
		login(state, payload, saveToLocalStorage=true) {
			if (saveToLocalStorage) {
				localStorage.authToken = payload?.access_token;
				localStorage.token = payload;
			}
			state.token = payload;
			state.loading = false;
			state.refreshing = false;
		},
		setError(state, error) {
			state.error = error;
			state.loading = false;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		login({commit}, {username, password}) {
			commit('reset');
			commit('startLoading');
			return axios.post(
				//'https://bettor-be.onrender.com/user/token',
				'http://127.0.0.1:5000/user/token',
				{
					username: username,
					password: password
				})
				.then(({data}) => {
					console.log(data);
					commit('login', data);
					return Promise.resolve();
				})
				.catch(({response}) => {
					commit('setError', response?.data?.message ?? 'Login failed');
					return Promise.resolve();
				});
		},
		logout({dispatch}, redirect = true) {
			localStorage.removeItem('authToken');
			localStorage.removeItem('token');
			dispatch('resetAll', null, {root: true});
			if (redirect) {
				router.push({
					name: 'home',
					query: {redirect: router.currentRoute.path}
				});
			}
		},
		refreshToken({commit}) {
			commit('startRefreshing');
			axios.get('https://bettor-be.onrender.com/user/token')
				.then(({data}) => {
					commit('login', data);
				})
				.catch(({response}) => {
					console.log(response);
				})
				.finally(() => {
					commit('stopRefreshing');
				});
		}
	}
};
