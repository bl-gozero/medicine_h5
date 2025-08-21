import request from '../request'

export default {
	login(data) {
		return request.post('/user/login', data, { loading: true, auth: false })
	},
	register(data) {
		return request.post('/user/register', data, { loading: true, auth: false })
	},
	getProfile() {
		return request.post('/user/profile')
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
}