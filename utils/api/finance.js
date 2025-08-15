import request from '../request'

export default {
	recharge(data) {
		return request.post('/user/recharge', data, { loading: true })
	},
	withdraw(data) {
		return request.post('/withdrawals/add', data, { loading: true })
	},
	withdrawList(data) {
		return request.post('/withdrawals/list', data, { loading: true })
	},
	withdrawCheck(data) {
		return request.post('/withdrawals/check', data, { loading: true })
	}
}