import axios from 'axios';
// import router from '@/plugins/router';

const getInitialState = () => ({
	loading: false,
	refreshing: false,
	rooms: [],
    metrics: null,
	error: null
});

export default {
	namespaced: true,
	state: getInitialState(),
	getters: {
		loading: (state) => state.loading,
		error: (state) => state.error,
        storeMetrics: (state) => state.metrics,
        storeRooms: (state) => state.rooms
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
        setRooms(state, payload) {
            state.rooms = payload;
            state.loading = false;
			state.refreshing = false;
        },
        setMetrics(state, payload) {
            state.metrics = payload;
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
		loadAllRooms({commit}) {
			// commit('reset');
			commit('startLoading');
			return axios.get(
				'https://e-bettor.herokuapp.com/all_rooms',
				{ headers: {
					'Content-type':'application/json'
				}
			}
			)
				.then(({data}) => {
                    console.log('SHOW DATA: ', data);
					commit('setRooms', data);
					return Promise.resolve();
				})
				.catch(({response}) => {
					commit('setError', response?.data?.message ?? 'Load all rooms failed');
					return Promise.resolve();
				});
		},
        loadAllMetrics({commit}) {
			commit('startLoading');
			return axios.get(
				'https://e-bettor.herokuapp.com/all_metrics',
				{ headers: {
					'Content-type':'application/json'
				}
			}
			)
				.then(({data}) => {
                    console.log('SHOW METRICS: ', data);
					commit('setMetrics', data);
					return Promise.resolve();
				})
				.catch(({response}) => {
					commit('setError', response?.data?.message ?? 'Load all metrics failed');
					return Promise.resolve();
				});
        }
	}
};