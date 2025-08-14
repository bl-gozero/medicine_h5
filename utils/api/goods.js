import request from '../request'

export default {
	goodsList(data) {
		return request.post('/goods/list', data, {
			auth: false
		})
	},
	cartList() {
		return request.post('/shopping_cart/list')
	},
	cartEdit(data) {
		return request.post('/shopping_cart/edit', data)
	},
	cartDelete(data) {
		return request.post('/shopping_cart/delete', data)
	},
	orderNum(data) {
		return request.post('/order_form/count', data)
	}
}