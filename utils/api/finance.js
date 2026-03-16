import request from '../request'

export default {
	list(data = {}, config = {}) {
		return request.post('/user/integral_list', data, { loading: true, ...config })
	},
	balanceList(data = {}, config = {}) {
		return request.post('/balance_logs/list', data, { loading: true, ...config })
	},
	recharge(data = {}, config = {}) {
		return request.post('/user/recharge', { device: 2, ...data }, { loading: true, ...config })
	},
	withdraw(data = {}, config = {}) {
		return request.post('/withdrawals/add', data, { loading: true, ...config })
	},
	withdrawList(data) {
		return request.post('/withdrawals/list', data, { loading: true })
	},
	withdrawCheck(data) {
		return request.post('/withdrawals/check', data, { loading: true })
	},
	performanceList(data = {}, config = {}) {
		return request.post('/team_performance/list', data, { ...config  })
	},
	performance(data = {}, config = {}) {
		return request.post('/team_performance/stat', data, { ...config  })
	},
	transfer(data = {}, config = {}) {
		return request.post('/user/transfer', data, { loading: true, ...config  })
	},
	sellList(data = {}, config = {}) {
		return request.post('/user_team/person_list', data, { loading: true, ...config  })
	},
	subsidyList(data = {}, config = {}) {
		return request.post('/subsidy_logs/list', data, { loading: true, ...config  })
	}
}