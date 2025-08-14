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
		return request.post('/card_holder/list', data, { loading: true })
	},
	cardBind(data) {
		return request.post('/card_holder/add', data, { loading: true })
	},
	cardDelete(data) {
		return request.post('/card_holder/delete', data, { loading: true })
	},
	balanceList(data) {
		return request.post('/balance_logs/list', data, { loading: true })
	}
}