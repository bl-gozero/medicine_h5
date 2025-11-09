// utils/confirm.js

export default function confirm(options = {}) {
	// 支持字符串写法：this.$confirm('确定取消订单？')
	if (typeof options === 'string') {
		options = {
			content: options
		}
	}

	const {
		title = '提示',
			content = '',
			confirmText = '确定',
			cancelText = '取消',
			confirmColor = '#3D3D3D',
			cancelColor = '#9F9F9F',
			showCancel = true
	} = options

	return new Promise((resolve, reject) => {
		uni.showModal({
			title,
			content,
			confirmText,
			cancelText,
			confirmColor,
			cancelColor,
			showCancel,
			success: res => {
				if (res.confirm) {
					resolve(res)
				} else {
					reject(res)
				}
			},
			fail: err => {
				reject(err)
			}
		})
	})
}