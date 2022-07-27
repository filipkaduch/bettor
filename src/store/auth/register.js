import axios from 'axios';
// import router from '@/plugins/router';

const getInitialState = () => ({
	loading: false,
	error: null,
	verificationLoading: false,
	verificationError: null
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		loading: (state) => state.loading,
		error: (state) => state.error,
		verificationLoading: (state) => state.verificationLoading,
		verificationError: (state) => state.verificationError
	},
	mutations: {
		startLoading(state) {
			state.loading = true;
			state.error = null;
		},
		stopLoading(state) {
			state.loading = false;
		},
		startVerificationLoading(state) {
			state.verificationLoading = true;
			state.verificationError = null;
		},
		stopVerificationLoading(state) {
			state.verificationLoading = false;
		},
		setError(state, error) {
			state.error = error;
			state.loading = false;
		},
		setVerificationError(state, error) {
			state.verificationError = error;
			state.verificationLoading = false;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		register({commit}, userData) {
			commit('reset');
			commit('startLoading');

			return axios.post(
				'https://bettor-be.onrender.com/user',
				// 'http://127.0.0.1:5000/user',
				{
					email: userData.email,
					lol_name: '',
					cs_name: '',
					dota_name: '',
					password: userData.password,
					joined: Date.now(),
					credits: 0,
					rooms_won: 0
					/* baseUrl: `${window.location.origin}${router.resolve({
						name: 'confirm-registration',
						params: {token: 'a'}
					}).href.slice(0, -1)}` */
				}
			)
				.then(() => {
					commit('stopLoading');
					return Promise.resolve();
				})
				.catch(({response}) => {
					const error = response?.data?.message ?? 'Registration failed';
					commit('setError', error);
					return Promise.reject(error);
				});
		},
		verifyRegistration({commit}, token) {
			commit('startVerificationLoading');

			return axios.post(
				'https://e-bettor.herokuapp.com/register-confirm',
				{
					token
				}
			)
				.then(() => {
					commit('stopVerificationLoading');
					return Promise.resolve();
				})
				.catch(({response}) => {
					const error = response?.data?.message ?? 'Registration confirm failed';
					commit('setVerificationError', error);
					return Promise.reject(error);
				});
		}
	}
};
