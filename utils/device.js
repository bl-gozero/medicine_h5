import FingerprintJS from '@fingerprintjs/fingerprintjs'

let fpPromise = null

export async function getFingerprint() {
	if (!fpPromise) {
		fpPromise = FingerprintJS.load()
	}

	const fp = await fpPromise
	const result = await fp.get()

	return result.visitorId
}

export const generateUUID = () => crypto.randomUUID().replace(/-/g, '')

export async function initDevice() {
	let deviceId = localStorage.getItem('device_id')
	let fingerprint = localStorage.getItem('fingerprint')

	if (!deviceId) {
		deviceId = generateUUID()
		localStorage.setItem('device_id', deviceId)
	}

	if (!fingerprint) {
		fingerprint = await getFingerprint()
		localStorage.setItem('fingerprint', fingerprint)
	}

	return {
		deviceId,
		fingerprint
	}
}