import request from '../request'

export default {
	captcha() {
		return request.post('/captcha/add', {}, { auth: false })
	},
	images(data) {
		return request.post('/looping_pictures/list', data, { auth: false })
	},
	payCategoryList() {
		return request.post('/cashier_counter/list')
	},
	cardCategoryList() {
		return request.post('/card_holder/allow')
	},
	levelList() {
		return request.post('/level/list')
	}
}