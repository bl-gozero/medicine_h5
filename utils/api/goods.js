import request from '../request'

export default {
	goodsList(data) {
		return request.post('/goods/list', data, { auth: false })
	},
	goodsDetail(data) {
		return request.post('/goods/details', data)
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
	cartAdd(data) {
		return request.post('/shopping_cart/add', data)
	},
	orderNum(data) {
		return request.post('/order_form/count', data)
	},
	orderList(data) {
		return request.post('/order_form/list', data)
	},
	orderAdd(data) {
		return request.post('/order_form/create', data, { loading: true })
	},
	orderPay(data) {
		return request.post('/order_form/paying', data, { loading: true })
	},
	orderCancel(data) {
		return request.post('/order_form/cancel', data, { loading: true })
	},
	orderCancel(data) {
		return request.post('/order_form/cancel', data, { loading: true })
	},
	orderDelete(data) {
		return request.post('/order_form/delete', data, { loading: true })
	},
	orderReceiving(data) {
		return request.post('/order_form/receiving', data, { loading: true })
	},
	orderDetail(data) {
		return request.post('/order_form/details', data)
	}
}