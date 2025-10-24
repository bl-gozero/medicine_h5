import request from '../request'

export default {
	captcha(data = {}, config = {}) {
		return request.post('/captcha/add', {}, { auth: false, ...config })
	},
	mobile_captcha(data = {}, config = {}) {
		return request.post('/user/mobile_captcha', {}, { auth: false, ...config })
	},
	images(data = {}, config = {}) {
		return request.post('/looping_pictures/list', data, { auth: false, ...config })
	},
	payCategoryList(data = {}, config = {}) {
		return request.post('/cashier_counter/list', data, { ...config })
	},
	cardCategoryList(data = {}, config = {}) {
		return request.post('/card_holder/allow', data, { ...config })
	},
	levelList(data = {}, config = {}) {
		return request.post('/level/list', data, { ...config })
	}
}