import Vue from 'vue'
import App from './App'
import axios from './common/request.js'
import  qs from 'qs'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
App.mpType = 'app'
const app = new Vue({
	...App
})
Vue.prototype.$qs = qs
app.$mount()
