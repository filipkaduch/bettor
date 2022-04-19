const getInitialState = () => ({
	error: null
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		error: (state) => state.error
	},
	mutations: {
		setError(state, error) {
			state.error = error;
		},
		reset(state) {
			Object.assign(state, getInitialState());
		}
	},
	actions: {
	}
};
