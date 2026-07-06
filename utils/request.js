import env from './env'
import {
	initDevice
} from '@/utils/device'

let deviceCache = null

async function getDeviceInfo() {
	if (!deviceCache) {
		deviceCache = await initDevice()
	}
	return deviceCache
}

const BASE_URL = env.BASE_URL

async function request({
	url,
	method = 'POST',
	data = {},
	header = {},
	loading = false,
	auth = true,
	showErr = true,
	jwt = null
}) {
	jwt = jwt ? jwt : uni.getStorageSync('jwt')
	if (auth && !jwt) return false
	
	const { deviceId, fingerprint } = await getDeviceInfo()
	// console.log(deviceId, fingerprint)
	
	if (loading) uni.showLoading({
		mask: true
	})
	const pageName = window.location.hash.replace(/^#\/?/, '').split('?')[0]
	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + url,
			method,
			data,
			header: {
			  'Content-Type': 'application/json',
			  ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
			  'App-ID': deviceId,
			  'Device-ID': fingerprint,
			  'Page-Name': pageName,
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
						if (showErr) {
							uni.showToast({
								title: message || '操作失败',
								icon: 'none'
							})
						}
						reject(res.data)
					}
				} else {
					uni.showToast({
						title: '你的网络有点卡顿哦，请稍后再试。',
						icon: 'none'
					})
					reject(res)
				}
			},
			fail(err) {
				if (loading) uni.hideLoading()
				uni.showToast({
					title: '你的网络有点卡顿哦，请稍后再试。',
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