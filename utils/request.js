import env from './env'

const BASE_URL = env.BASE_URL

function request({
	url,
	method = 'POST',
	data = {},
	header = {},
	loading = false,
	auth = true
}) {
	const jwt = uni.getStorageSync('jwt')

	if (loading) {
		uni.showLoading()
	}

	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method,
			data,
			header: {
				'Content-Type': 'application/json',
				...(auth && jwt ? {
					Authorization: `Bearer ${jwt}`
				} : {}),
				...header
			},
			success(res) {
				if (loading) uni.hideLoading()

				if (res.statusCode === 200) {
					const {
						code,
						data,
						message
					} = res.data
					if (code === 0) {
						resolve(data)
					} else if (code === 1002) {
						// 未登录或登录失效
						uni.removeStorageSync('jwt')
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/login'
							})
						}, 1000)
						reject(res.data)
					} else {
						uni.showToast({
							title: message || '操作失败',
							icon: 'none'
						})
						reject(res.data)
					}
				} else {
					uni.showToast({
						title: '服务器错误',
						icon: 'none'
					})
					reject(res)
				}
			},
			fail(err) {
				if (loading) uni.hideLoading()
				uni.showToast({
					title: '请求失败，请检查您的网络情况或稍后再试',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}

export default {
	get(url, data = {}, config = {}) {
		return request({
			url,
			method: 'GET',
			data,
			...config
		})
	},
	post(url, data = {}, config = {}) {
		return request({
			url,
			method: 'POST',
			data,
			...config
		})
	},
	put(url, data = {}, config = {}) {
		return request({
			url,
			method: 'PUT',
			data,
			...config
		})
	},
	del(url, data = {}, config = {}) {
		return request({
			url,
			method: 'DELETE',
			data,
			...config
		})
	},
	raw: request
}