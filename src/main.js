import '../custom.scss';

import '@babel/polyfill'
import 'mutationobserver-shim'
import * as plugins from '@/plugins/all';

import App from '@/App.vue';
import Vue from 'vue';
import VueAxios from 'vue-axios';
import './plugins/bootstrap-vue'
import './plugins/fontawesome'
// import './plugins/axios'
import axios from 'axios';
Vue.use(VueAxios, axios);

window.Vue = Vue;
Vue.config.productionTip = false;

let appConfig = null;


plugins.store.commit('appLoading/startConfigLoading');

axios({
	url: '/config.json',
	baseURL: '/'
})
	.then(({data}) => {
		appConfig = data;
	})
	.catch(() => {
		plugins.store.commit('error/setError', 't_CantLoadConfig');
	})
	.finally(() => {
		console.log(plugins);
		new Vue({
			...plugins,
			appConfig,
			render: (render) => render(App)
		}).$mount('#app');
    console.log(appConfig);
		plugins.store.commit('appLoading/stopConfigLoading');
	});
