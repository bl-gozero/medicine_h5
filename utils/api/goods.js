import request from '../request'

export default {
	goodsList(data = {}, config = {}) {
		return request.post('/goods/list', { is_integral: 2, ...data }, { ...config })
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
		return request.post('/order_form/list', { is_integral: 2, ...data })
	},
	orderAdd(data) {
		return request.post('/order_form/create', data, { loading: true })
	},
	orderPay(data) {
		return request.post('/order_form/paying', { device: 2, ...data }, { loading: true })
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
	},
	orderShip(data = {}, config = {}) {
		return request.post('/order_form/traffic', data, { loading: true, ...config })
	},
	orderStore(data = {}, config = {}) {
		return request.post('/order_form/save', data, { loading: true, ...config })
	},
	orderExpress(data = {}, config = {}) {
		return request.post('/order_form/courier', data, { ...config })
	},
	storeList(data = {}, config = {}) {
		return request.post('/warehouse/list', data, { ...config })
	},
	storeTransfer(data = {}, config = {}) {
		return request.post('/warehouse/handsel', data, { loading: true, ...config })
	},
	storeTransferList(data = {}, config = {}) {
		return request.post('/warehouse/handsel_list', data, { ...config })
	},
	storeShip(data = {}, config = {}) {
		return request.post('/warehouse_mailing/create', data, { loading: true, ...config })
	},
	storeShipList(data = {}, config = {}) {
		return request.post('/warehouse_mailing/list', data, { ...config })
	},
	storeShipDetail(data = {}, config = {}) {
		return request.post('/warehouse_mailing/details', data, { ...config })
	},
	storeReceive(data = {}, config = {}) {
		return request.post('/warehouse_mailing/receiving', data, { loading: true, ...config })
	},
	storeBuyList(data = {}, config = {}) {
		return request.post('/warehouse/buyback_yes', data, { ...config })
	},
	priceLog(data = {}, config = {}) {
		return request.post('/goods_sku_price_logs/list', data, { ...config })
	},
	storeBuy(data = {}, config = {}) {
		return request.post('/warehouse/buyback', data, { loading: true, ...config })
	}
}