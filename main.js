import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import common from '@/utils/common.js'
import api from '@/utils/api/index.js'
import uView from '@/uni_modules/uview-ui'
import './uni.promisify.adaptor'
import env from '@/utils/env'
import UConfirm from '@/utils/confirm'
import $know from '@/utils/know.js'

Vue.config.productionTip = false

Vue.prototype.$c = common
Vue.prototype.$api = api
Vue.prototype.$baseUrl = env.BASE_URL
Vue.prototype.$know = $know
Vue.prototype.$confirm = function(options) {
	// 兼容简写：this.$confirm('内容')
	if (typeof options === 'string') {
		options = {
			content: options
		}
	}
	return UConfirm(options)
}
Vue.use(uView)
uni.$u.setConfig({
	config: {
		unit: 'px'
	},
	props: {
		radio: {
			size: 15
		}
	}
})

App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif