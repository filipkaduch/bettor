"use strict";


import Vue from 'vue';
import axios from "axios";


// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

console.log(Vue.config);

let config = {
  //baseURL: 'https://e-bettor.herokuapp.com/',
  // baseURL: 'https://bettor-be.onrender.com/',
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },

    (error) => {
      return Promise.reject(error);
    }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

// Plugin.install = function(Vue) {
//   Vue.axios = _axios;
//   window.axios = _axios;
//   Object.defineProperties(Vue.prototype, {
//     axios: {
//       get() {
//         return _axios;
//       }
//     },
//     $axios: {
//           get() {
//             return _axios;
//           }
//     },
//   });
// };

// Vue.use(Plugin)


// Vue.mixin({
//     beforeCreate() {
//         this.$axios = _axios;
//     }
// });
Vue.prototype.$axios = _axios;
export default Plugin;

