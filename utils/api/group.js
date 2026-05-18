import request from '../request'

export default {
	groupList(data = {}, config = {}) {
		if(!data?.search?.is_official) data.search.is_official = 2
		return request.post('/im/teams/list', data, { ...config })
	},
	myList(data = {}, config = {}) {
		return request.post('/im/teams/my_list', data, { ...config })
	},
	userInfo(data = {}) {
		return request.post('/im/user/info', data)
	},
	create(data) {
		return request.post('/im/teams/create', data, { loading: true })
	},
	join(data) {
		return request.post('/im/teams/join', data, { loading: false })
	},
	join_info(data)	{
		return request.post('/im/teams/join_info', data, { loading: true })
	},
	config() {
		return request.post('/im/config/info', {}, { auth: false })
	},
	login()	{
		return request.post('/im/user/login', {})
	},
	quit(data = {}) {
		return request.post('/im/teams/quit', data, { loading: true })
	},
	pay(data = {}, config = {}) {
		return request.post('/im/teams/paying', { device: 2, ...data }, { loading: true, ...config })
	},
	payingList(data = {}) {
		return request.post('/im/teams/paying_list', data)
	},
	payDelete(data = {}) {
		return request.post('/im/teams/delete_group', data, { loading: true })
	},
	memberList(data = {}) {
		return request.post('/im/teams_members/list', data)
	},
	groupInfo(data = {}) {
		return request.post('/im/teams/info', data)
	},
	baseInfo(data = {}) {
		return request.post('/im/teams/base_info', data, { loading: true })
	},
	teamDelete(data = {}) {
		return request.post('/im/teams/delete', data, { loading: true })
	},
	announcement(data = {}) {
		return request.post('/im/teams/announcement', data, { loading: true })
	},
	category(data = {}) {
		return request.post('/im/teams/category', data)
	},
	joinMode(data = {}) {
		return request.post('/im/teams/join_mode', data)
	},
	role(data = {}) {
		return request.post('/im/teams/role', data, { loading: true })
	},
	remove(data = {}) {
		return request.post('/im/teams/remove', data, { loading: true })
	},
	banned(data = {}) {
		return request.post('/im/teams/chat_banned', data, { loading: true })
	},
	pass(data = {}) {
		return request.post('/im/teams/pass', data, { loading: true })
	},
	reject(data = {}) {
		
	},
	searchUser(data = {}, config = {}) {
		return request.post('/im/user/search', data, { loading: true, ...config })
	},
	account_id_profile(data = {}, config = {}) {
		return request.post('/im/user/account_id_profile', data, { ...config })
	},
	partnerGroup(data = {}, config = {}) {
		return request.post('/im/teams/partners_add', data, { ...config })
	},
	levelGroup(data = {}, config = {}) {
		return request.post('/im/teams_level/add_list', data, { ...config })
	}
}