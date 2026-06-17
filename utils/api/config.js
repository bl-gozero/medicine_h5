import request from '../request'

export default {
	captcha(data = {}, config = {}) {
		return request.post('/captcha/add', data, { auth: false, ...config })
	},
	mobile_captcha(data = {}, config = {}) {
		return request.post('/user/mobile_captcha', data, { loading: true, auth: false, ...config })
	},
	images(data = {}, config = {}) {
		return request.post('/looping_pictures/list', data, { auth: false, ...config })
	},
	payCategoryList(data = {}, config = {}) {
		return request.post('/cashier_counter/list', data, { ...config })
	},
	payCategoryList2(data = {}, config = {}) {
		return request.post('/cashier_counter/list_v2', data, { ...config })
	},
	cardCategoryList(data = {}, config = {}) {
		return request.post('/card_holder/allow', data, { ...config })
	},
	levelList(data = {}, config = {}) {
		return request.post('/level/list', data, { ...config })
	},
	task(data = {}, config = {}) {
		return request.post('/task/list', data, { ...config })
	},
	taskFinish(data = {}, config = {}) {
		return request.post('/task/finish', data, { ...config })
	},
	config(data = {}, config = {}) {
		return request.post('/config/list', data, { ...config })
	},
	eventGoods(data = {}, config = {}) {
		return request.post('/event_goods/list', data, { ...config })
	},
	message(data = {}, config = {}) {
		return request.post('/message/list', data, { ...config })
	},
	messageUnread(data = {}, config = {}) {
		return request.post('/message/unread_count', data, { ...config })
	},
	messageDetail(data = {}, config = {}) {
		return request.post('/message/details', data, { ...config })
	},
	messageReadAll(data = {}, config = {}) {
		return request.post('/message/read_all', data, { loading: true, ...config })
	}
}