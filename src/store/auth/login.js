import axios from 'axios';
import router from '@/plugins/router';

const getInitialState = () => ({
	loading: false,
	refreshing: false,
	token: localStorage.authToken ?? 'null',
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
		login(state, payload) {
			console.log(payload);
			/* if (saveToLocalStorage) {
				localStorage.authToken = token;
			} */
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
				'https://e-bettor.herokuapp.com/login',
				{ headers: {
					'Content-type':'application/json'
				}, data: {
					name: username,
					password
				}
			}
			)
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
			axios.get('/tellStoryUser/RefreshToken')
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
