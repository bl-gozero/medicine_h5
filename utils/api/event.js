import request from '../request'

export default {
	wineProcess(data = {}, config = {}) {
		return request.post('/event/ginseng_wine', data, { ...config })
	},
	wineList(data = {}, config = {}) {
		return request.post('/event/ginseng_wine_list', data, { ...config })
	},
}