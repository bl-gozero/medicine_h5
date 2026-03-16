import request from '../request'

export default {
	wineProcess(data = {}, config = {}) {
		return request.post('/event/ginseng_wine', data, { ...config })
	},
	wineList(data = {}, config = {}) {
		return request.post('/event/ginseng_wine_list', data, { ...config })
	},
	tripStat(data = {}, config = {}) {
		return request.post('/travel/apply', data, { ...config })
	},
	tripAdd(data = {}, config = {}) {
		return request.post('/travel/add', data, { loading: true, ...config })
	},
	tripBuy(data = {}, config = {}) {
		return request.post('/travel_purchase/list', data, { ...config })
	},
	tripInfo(data = {}, config = {}) {
		return request.post('/user_travel/person_list', data, { ...config })
	},
	tripPopup(data = {}, config = {}) {
		return request.post('/travel/pop_up', data, { ...config })
	},
}