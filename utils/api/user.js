import request from '../request'

export default {
	login(data) {
		return request.post('/user/login', data, { loading: true, auth: false })
	},
	mobile_login(data = {}, config = {}) {
		return request.post('/user/mobile_login', data, { loading: true, auth: false, ... config  })
	},
	register(data = {}, config = {}) {
		return request.post('/user/mobile_register', data, { loading: true, auth: false, ... config })
	},
	getProfile(data = {}, config = {}) {
		return request.post('/user/profile', data, { ...config })
	},
	profile(data = {}, config = {}) {
		return request.post('/user/profile', data, { ...config })
	},
	signStatus() {
		return request.post('/user_sign_logs/check')
	},
	signIn() {
		return request.post('/user_sign_logs/add', {}, { loading: true })
	},
	avatarEdit(data) {
		return request.post('/user/edit_avatar', data, { loading: true })
	},
	loginPassword(data) {
		return request.post('/user/edit_password', data, { loading: true })
	},
	payPassword(data) {
		return request.post('/user/edit_payment_password', data, { loading: true })
	},
	cardList(data) {
		return request.post('/card_holder/list', data)
	},
	cardBind(data) {
		return request.post('/card_holder/add', data, { loading: true })
	},
	cardDelete(data) {
		return request.post('/card_holder/delete', data, { loading: true })
	},
	addressList() {
		return request.post('/user_address/list', {})
	},
	addressAdd(data) {
		return request.post('/user_address/add', data, { loading: true })
	},
	addressEdit(data) {
		return request.post('/user_address/edit', data, { loading: true })
	},
	addressDelete(data) {
		return request.post('/user_address/delete', data, { loading: true })
	},
	upgradeVip(data) {
		return request.post('/user/upgrade_vip', data, { loading: true })
	},
	friend(data) {
		return request.post('/user/friend', data, { loading: true })
	},
	activity(data = {}, config = {}) {
		return request.post('/event/info', data, { ...config })
	},
	activity(data = {}, config = {}) {
		return request.post('/event/info', data, { ...config })
	},
	activityAddress(data = {}, config = {}) {
		return request.post('/event/add', data, { loading: true, ...config })
	},
	activityDetail(data = {}, config = {}) {
		return request.post('/event/details', data, { ...config })
	},
	activityStatus(data = {}, config = {}) {
		return request.post('/event/pop_up', data, { ...config })
	},
	nickname(data = {}, config = {}) {
		return request.post('/user/edit_nickname', data, { loading: true, ...config })
	},
	accountInfo(data = {}, config = {}) {
		return request.post('/user/search_profile', data, { ...config })
	},
	sellInfo(data = {}, config = {}) {
		return request.post('/user_team/person', data, { ...config })
	},
	mySellInfo(data = {}, config = {}) {
		return request.post('/user_team/self_stat', data, { ...config })
	},
	teamList(data = {}, config = {}) {
		return request.post('/user_team/list', data, { loading: true, ...config })
	},
	teamNum(data = {}, config = {}) {
		return request.post('/user_team/member_stat', data, { ...config })
	},
	isRecruit(data = {}, config = {}) {
		return request.post('/user_enlist/is_add', data, { ...config })
	},
	recruit(data = {}, config = {}) {
		return request.post('/user_enlist/add', data, { loading: true, ...config })
	},
	partnerNum(data = {}, config = {}) {
		return request.post('/user_team/partner_region_list', data, { ...config })
	},
	deleteAccount(data = {}, config = {}) {
		return request.post('/user/cancel_account', data, { loading: true, ...config })
	}
}