import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fpPromise = null

export async function getFingerprint() {

	// 小程序不支持 fingerprintjs
	// 直接返回 deviceId
	// #ifdef MP
	return uni.getStorageSync('device_id')
	// #endif

	// H5 使用指纹
	// #ifdef H5
	if (!fpPromise) {
		fpPromise = FingerprintJS.load()
	}

	const fp = await fpPromise
	const result = await fp.get()

	return result.visitorId
	// #endif
}

export const generateUUID = () => {
	return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => {
		return (Math.random() * 16 | 0).toString(16)
	})
}

export async function initDevice() {

	let deviceId = uni.getStorageSync('device_id')
	let fingerprint = uni.getStorageSync('fingerprint')

	if (!deviceId) {
		deviceId = generateUUID()
		uni.setStorageSync('device_id', deviceId)
	}

	if (!fingerprint) {
		fingerprint = await getFingerprint()
		uni.setStorageSync('fingerprint', fingerprint)
	}

	return {
		deviceId,
		fingerprint
	}
}