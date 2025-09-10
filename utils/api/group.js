import request from '../request'

export default {
	groupList(data) {
		return request.post('/im/teams/list', data)
	},
	myList() {
		return request.post('/im/teams/my_list', {})
	},
	userInfo(data = {}) {
		return request.post('/im/user/info', data)
	},
	create(data) {
		return request.post('/im/teams/create', data, { loading: true })
	},
	join(data) {
		return request.post('/im/teams/join', data, { loading: true })
	},
	join_info(data)	{
		return request.post('/im/teams/join_info', data)
	},
	config() {
		return request.post('/im/config/info', {})
	},
	login()	{
		return request.post('/im/user/login', {})
	},
	quit(data = {}) {
		return request.post('/im/teams/quit', data, { loading: true })
	},
	pay(data = {}) {
		return request.post('/im/teams/paying', data, { loading: true })
	},
	payingList(data = {}) {
		return request.post('/im/teams/paying_list', data)
	},
	payDelete(data = {}) {
		return request.post('/im/teams/delete_group', data, { loading: true })
	},
}