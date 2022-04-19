import axios from 'axios';
import router from '@/plugins/router';

const getInitialState = () => ({
	resetRequestLoading: false,
	resetRequestError: null,
	resetLoading: false,
	resetError: null
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		resetRequestLoading: (state) => state.resetRequestLoading,
		resetRequestError: (state) => state.resetRequestError,
		resetLoading: (state) => state.resetLoading,
		resetError: (state) => state.resetError
	},
	mutations: {
		startResetRequestLoading(state) {
			state.resetRequestLoading = true;
			state.resetRequestError = null;
		},
		stopResetRequestLoading(state) {
			state.resetRequestLoading = false;
		},
		startResetLoading(state) {
			state.resetLoading = true;
			state.resetError = null;
		},
		stopResetLoading(state) {
			state.resetLoading = false;
		},
		setResetRequestError(state, error) {
			state.resetRequestError = error;
			state.resetRequestLoading = false;
		},
		setResetError(state, error) {
			state.resetError = error;
			state.resetLoading = false;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
		resetPasswordRequest({commit}, email) {
			commit('reset');
			commit('startResetRequestLoading');

			return axios.post(
				'TellStoryUser/PasswordReset',
				{
					email,
					baseUrl: `${window.location.origin}${router.resolve({
						name: 'confirm-password-reset',
						params: {token: 'a'}
					}).href.slice(0, -1)}`
				}
			)
				.then(() => {
					commit('stopResetRequestLoading');
					return Promise.resolve();
				})
				.catch(({response}) => {
					commit('setResetRequestError', response?.data?.message ?? 'Password reset request failed.');
					return Promise.reject();
				});
		},
		resetPassword({commit}, data) {
			commit('startResetLoading');

			return axios.post(
				'TellStoryUser/PasswordResetConfirm',
				data
			)
				.then(() => {
					commit('stopResetLoading');
					return Promise.resolve();
				})
				.catch(({response}) => {
					commit('setResetError', response?.data?.message ?? 'Password reset failed');
					return Promise.reject();
				});
		}
	}
};
