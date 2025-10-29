import request from '../request'

export default {
	list(data = {}, config = {}) {
		return request.post('/user/integral_list', data, { loading: true, ...config })
	},
}