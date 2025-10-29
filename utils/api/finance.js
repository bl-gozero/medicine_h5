import request from '../request'

export default {
	list(data = {}, config = {}) {
		return request.post('/user/integral_list', data, { loading: true, ...config })
	},
	balanceList(data = {}, config = {}) {
		return request.post('/balance_logs/list', data, { loading: true, ...config })
	},
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
	},
	performance(data) {
		return request.post('/team_performance/list', data, { loading: true })
	},
	transfer(data = {}, config = {}) {
		return request.post('/user/transfer', data, { loading: true, ...config  })
	}
}