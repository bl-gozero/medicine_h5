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
	gift(data = {}, config = {}) {
		return request.post('/redeem_gifts/exchange', data, { loading: true, ...config })
	},
	giftList(data = {}, config = {}) {
		return request.post('/redeem_gifts/list', data, { ...config })
	},
	giftStatus(data = {}, config = {}) {
		return request.post('/redeem_gifts/status', data, { ...config })
	},
	platformList(data = {}, config = {}) {
		return request.post('/user_lucky_star/platform_list', data, { ...config })
	},
	videoCreate(data = {}, config = {}) {
		return request.post('/user_lucky_star/create', data, { loading: true, ...config })
	},
	videoList(data = {}, config = {}) {
		return request.post('/user_lucky_star/list', data, { ...config })
	},
	videoEdit(data = {}, config = {}) {
		return request.post('/user_lucky_star/edit', data, { loading: true, ...config })
	},
	videoDetail(data = {}, config = {}) {
		return request.post('/user_lucky_star/view', data, { ...config })
	},
	videoInfo(data = {}, config = {}) {
		return request.post('/user_lucky_star/info', data, { ...config })
	},
	videoReceive(data = {}, config = {}) {
		return request.post('/user_lucky_star/receive', data, { loading: true, ...config })
	},
	videoReceiveList(data = {}, config = {}) {
		return request.post('/user_lucky_star/receive_list', data, { ...config })
	},
	assetList(data = {}, config = {}) {
		return request.post('/material/details', data, { ...config })
	}
}