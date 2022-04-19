const getInitialState = (reset = false) => ({
	configLoading: !reset,
	resourcesLoading: !reset
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		configLoading: (state) => state.configLoading,
		loading: (state) => state.resourcesLoading || state.configLoading
	},
	mutations: {
		startConfigLoading(state) {
			state.configLoading = true;
		},
		stopConfigLoading(state) {
			state.configLoading = false;
		},
		startResourcesLoading(state) {
			state.resourcesLoading = true;
		},
		stopResourcesLoading(state) {
			state.resourcesLoading = false;
		},
		reset(state) {
			Object.assign(state, getInitialState(true));
		}
	},
	actions: {
	}
};
