// utils/nim.js
import NIM from 'nim-web-sdk-ng/dist/v2/NIM_UNIAPP_SDK'

let nim = null

export function initNIM({
	appkey,
	account,
	token
}) {
	if (nim) return nim

	nim = NIM.getInstance({
		appkey,
		account,
		token,
		debugLevel: 'debug',
		apiVersion: 'v2'
	})
	return nim
}

export function getNIM() {
	return nim
}

export async function loginNIM(account, token) {
	if (!nim) throw new Error('请先调用 initNIM 初始化实例')
	try {
		await nim.V2NIMLoginService.login(account, token, {
			forceMode: false
		})
	} catch (err) {
		throw err
	}
}

export async function getConversations(limit = 50, cursor = '') {
	if (!nim) throw new Error('请先初始化 nim')
	try {
		const res = await nim.V2NIMConversationService.getConversationList({
			limit,
			cursor
		})
		return res
	} catch (err) {
		return []
	}
}