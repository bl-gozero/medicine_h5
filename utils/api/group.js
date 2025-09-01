import request from '../request'

export default {
	groupList(data) {
		return request.post('/im/teams/list', data)
	}
}