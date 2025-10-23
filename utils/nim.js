import Vue from 'vue'
import SDK from 'nim-web-sdk-ng/dist/v2/NIM_UNIAPP_SDK'

let nim = null
let eventsBound = false
const NIM_KEY = 'nimInfo'

// 全局会话数据
export const globalConversations = Vue.observable({ list: [] })
// 消息列表
export const messageList = Vue.observable({ list: [] })
// 申请列表
export const teamJoinList = Vue.observable({ list: [] })
// 当前群组信息
export const teamInfo = Vue.observable({})
// 在当前群组中的信息
export const memberInfo = Vue.observable({})
// 申请数量
export const teamJoinCount = Vue.observable({ value: 0 })

/**
 * 初始化 NIM 实例
 */
export function initNIM(autoLogin = true) {
	const nimInfo = uni.getStorageSync(NIM_KEY)
	if (!nimInfo) return null
	if (!nim) {
		nim = SDK.getInstance({
			appkey: nimInfo.appkey,
			account: nimInfo.account,
			token: nimInfo.token,
			// debugLevel: 'debug',
			apiVersion: "v2",
			enableStickTop: true,
		})
		Vue.prototype.$nim = nim
	}
	if (!eventsBound) _bindEvents(nim)
	if (autoLogin) loginNIM()
	return nim
}

/**
 * 登录
 */
export async function loginNIM() {
	const nimInfo = uni.getStorageSync(NIM_KEY)
	if (!nimInfo) return
	if (!nimInfo.account || !nimInfo.token) {
		uni.reLaunch({
			url: '/pages/index/login'
		})
		return
	}
	try {
		await nim.V2NIMLoginService.login(nimInfo.account, nimInfo.token, {
			"forceMode": false
		})
		await teamBaseInfo()
		await getMemberInfo()
		await getMessageList()
	} catch (err) {
		// console.error('NIM 登录失败', err)
	}
}

/**
 * 尝试从本地初始化（免登录）
 */
export function tryInitFromStorage() {
	const nimInfo = uni.getStorageSync(NIM_KEY)
	if (nimInfo && nimInfo.account && nimInfo.token) {
		initNIM()
		return Vue.prototype.$nim
	}
	return null
}

async function loginout() {
	if (nim) {
		try {
			await nim.V2NIMLoginService.logout()
		} catch (err) {
			// console.log(err.code)
		}
	}
}

/**
 * 登出
 */
export async function logoutNIM() {
	clearConversations()
	loginout()
	uni.removeStorageSync(NIM_KEY)
	uni.removeStorageSync('chatInfo')
	uni.setStorageSync('jwt', '')
	uni.setStorageSync('profile', {})
	uni.reLaunch({
		url: '/pages/index/login'
	})
}

/**
 * 卸载
 */
export async function unload() {
	clearConversations()
	loginout()
	uni.removeStorageSync(NIM_KEY)
	Vue.prototype.$nim = null
	nim = null
}

/**
 * 群信息
 */
export async function teamBaseInfo() {
	if (!nim) return
	const chatInfo = uni.getStorageSync('chatInfo')
	if (!chatInfo || !chatInfo.team_id) return
	// 清空旧数据，避免属性残留
	Object.keys(teamInfo).forEach(key => {
		Vue.delete(teamInfo, key)
	})
	try {
		const res = await nim.V2NIMTeamService.getTeamInfo(chatInfo.team_id + '', 1)
		for (const key in res) {
			Vue.set(teamInfo, key, res[key])
		}
		return true
	} catch (err) {
		// console.error('获取群信息失败', err)
		const errmsg = showNimError(err)
		if (errmsg == 'team not exist') {
			uni.removeStorageSync('chatInfo')
		}
		return false
	}
}

/**
 * 群信息变更
 */
export async function updateTeamInfo(teamId, teamType, data = {}) {
	if (!nim) return
	try {
		await nim.V2NIMTeamService.updateTeamInfo(teamId, teamType, data)
		return true
	} catch (err) {
		console.error('变更群信息失败', err)
		return false
	}
}

/**
 * 个人群信息
 */
export async function getMemberInfo() {
	if (!nim) return
	const chatInfo = uni.getStorageSync('chatInfo')
	if (!chatInfo.team_id) return
	const nimInfo = uni.getStorageSync('nimInfo')
	if (!nimInfo.account) return
	Object.keys(memberInfo).forEach(key => {
		Vue.delete(memberInfo, key)
	})
	try {
		// 获取当前用户所在群的成员列表（只查这个群）
		const res = await nim.V2NIMTeamService.getTeamMemberListByIds(chatInfo.team_id + '', 1, [nimInfo.account])
		if (res.length > 0) {
			for (const key in res[0]) {
				Vue.set(memberInfo, key, res[0][key])
			}
		}
		return true
	} catch (err) {
		const msg = showNimError(err)
		if(msg == 'team not exist') {
			uni.removeStorageSync('chatInfo')
		}
		return null
	}
}

/**
 * 加入
 */
export async function joinTeam(teamId, teamType, postscript = '') {
	if (!nim) return false
	try {
		const res = await nim.V2NIMTeamService.applyJoinTeam(teamId + '', teamType, postscript)
		return true
	} catch (err) {
		showNimError(err)
		return false 
	}
}

/**
 * 群申请
 */
export async function teamUnreadCount() {
	if (!nim) return 0
	try {
		const res = await nim.V2NIMTeamService.getTeamJoinActionInfoUnreadCount()
		teamJoinCount.value = res
		return res || 0
	} catch (err) {
		console.error('获取群未读数失败', err)
		return 0
	}
}

/**
 * 通过申请
 */
export async function acceptJoinApplication(teamId, teamType, accountId) {
	if (!nim) return false
	try {
		await nim.V2NIMTeamService.acceptJoinApplication({
			"teamId": teamId,
			"teamType": teamType,
			"operatorAccountId": accountId,
			"actionType": 0
		})
		return true
	} catch (err) {
		showNimError(err)
		return false
	}
}

/**
 * 拒绝申请
 */
export async function rejectJoinApplication(teamId, teamType, accountId) {
	if (!nim) return false
	try {
		await nim.V2NIMTeamService.rejectJoinApplication({
				"teamId": teamId,
				"teamType": teamType,
				"operatorAccountId": accountId,
				"actionType": 0
			},
			""
		)
		return true
	} catch (err) {
		showNimError(err)
		return false
	}
}

/**
 * 拒绝申请
 */
export async function clearAllTeamJoinActionInfo() {
	if (!nim) return false
	try {
		await nim.V2NIMTeamService.clearAllTeamJoinActionInfo()
		return true
	} catch (err) {
		showNimError(err)
		return false
	}
}

/**
 * 获取所有群申请列表（处理分页）
 * @param {number} limit 每页数量，默认 50
 * @returns {Promise<{ list: Array, pendingCount: number }>}
 */
export async function getTeamJoinList(limit = 50) {
	if (!nim) return []

	let offset = 0
	let finished = false
	let allList = []

	while (!finished) {
		try {
			const res = await nim.V2NIMTeamService.getTeamJoinActionInfoList({
				offset,
				limit
			})
			if (res && Array.isArray(res.infos)) {
				allList.push(...res.infos)
			}
			// 更新 offset 和判断是否完成
			offset = res.offset || 0
			finished = res.finished || (res.infos.length < limit)
		} catch (err) {
			// console.error('获取群申请列表失败', err)
			break
		}
	}

	//获取或有人和群等信息
	if (allList.length > 0) {
		const accountIds = allList.map(item => item.operatorAccountId)
		const users = await nim.V2NIMUserService.getUserList(accountIds)
		const userMap = {}
		users.forEach(u => {
			userMap[u.accountId] = u
		})
		allList = allList.map(item => ({
			...item,
			user: userMap[item.operatorAccountId] || {}
		}))
		
		const teamIds = allList.map(item => item.teamId)
		const teams = await nim.V2NIMTeamService.getTeamInfoByIds(teamIds, 1)
		const teamMap = {}
		teams.forEach(u => {
			teamMap[u.teamId] = u
		})
		allList = allList.map(item => ({
			...item,
			team: teamMap[item.teamId] || {}
		}))
		
	}
	
	// console.log('获取申请列表', allList)
	teamJoinList.list = allList
	return allList
}

/**
 * 置顶会话
 */
export async function setTopConversations(id) {
	if (!nim) return
	try {
		const res = await nim.V2NIMLocalConversationService.stickTopConversation(id, true)
		return res
	} catch (err) {
		console.error('设置失败', err)
		uni.showToast({
			title: '操作失败',
			icon: 'none'
		})
		return false
	}
}

/**
 * 群禁言
 */
export async function setTeamMute(team, mute) {
	if (!nim) return
	try {
		const res = await nim.V2NIMTeamService.setTeamChatBannedMode(team.teamId, team.teamType, mute)
		return true
	} catch (err) {
		console.error('设置群禁言失败', err)
		return false
	}
}

/**
 * 清除会话
 */
export async function clearConversations() {
	if (!nim) return
	try {
		const res = await nim.V2NIMLocalConversationService.getConversationList(0, 100)
		const ids = res.conversationList.map(c => c.conversationId)
		if (ids.length) {
			await nim.V2NIMLocalConversationService.deleteConversationListByIds(ids, true)
			console.log('旧会话已清理')
		}
	} catch (err) {
		console.error('清理旧会话失败', err)
	}
}

/**
 * 清除指定会话
 */
export async function deleteConversation(id) {
	if (!nim) return
	try {
		const res = await nim.V2NIMLocalConversationService.deleteConversation(id, true)
		return true
	} catch (err) {
		console.error('清理会话失败', err)
		return false
	}
}

/**
 * 清除某个群的本地消息
 */
export async function clearTeamMessages() {
	if (!nim) return false
	const conversationId = getCid()
	if (!conversationId) return false
	try {
		// 调用 SDK 清本地消息
		const option = {
			conversationId,
			deleteRoam: false, // 不删漫游（只清本地）
			onlineSync: false, // 不同步给其他端
			clearMode: 0
		}
		await nim.V2NIMMessageService.clearHistoryMessage(option)
		messageList.list = messageList.list.filter(
			msg => msg.conversationId !== conversationId
		)
		return true
	} catch (err) {
		console.error("清除群消息失败:", err)
		return false
	}
}

/**
 * 群成员角色
 */
export async function updateTeamMemberRole(accountIds, role) {
	if (!nim) return false
	if (!accountIds.length) return false
	if (!Object.keys(teamInfo).length) return false
	try {
		const res = await nim.V2NIMTeamService.updateTeamMemberRole(teamInfo.teamId, teamInfo.teamType, accountIds, role)
		return true
	} catch (err) {
		showNimError('操作失败')
		return false
	}
}

/**
 * 退出群
 */
export async function leaveTeam(teamId, teamType) {
	if (!nim) return false
	let id = null
	let type = null
	if(teamId && teamType) {
		id = teamId
		type = teamType
	} else if (Object.keys(teamInfo).length){
		id = teamInfo.teamId
		type = teamInfo.teamType
	} else {
		return false
	}
	try {
		const res = await nim.V2NIMTeamService.leaveTeam(id + '', type)
		return true
	} catch (err) {
		console.error(err)
		showNimError('操作失败')
		return false
	}
}

/**
 * 踢出群
 */
export async function kickMember(accoundIds) {
	if (!nim) return false
	if (!accoundIds.length) return false
	if (!Object.keys(teamInfo).length) return false
	try {
		const res = await nim.V2NIMTeamService.kickMember(teamInfo.teamId, teamInfo.teamType, accoundIds)
		return true
	} catch (err) {
		showNimError('操作失败')
		return false
	}
}

/**
 * 解散群
 */
export async function dismissTeam() {
	if (!nim) return false
	if (!Object.keys(teamInfo).length) return false
	try {
		const res = await nim.V2NIMTeamService.dismissTeam(teamInfo.teamId, teamInfo.teamType)
		return true
	} catch (err) {
		showNimError('操作失败')
		return false
	}
}

/**
 * 群成员禁言
 */
export async function setMemberBanned(teamId, teamType, accountId, status) {
	if (!nim) return
	try {
		const res = await nim.V2NIMTeamService.setTeamMemberChatBannedStatus(teamId, teamType, accountId, status)
		return true
	} catch (err) {
		console.error('禁言/解禁失败', err)
		showNimError(err)
		return false
	}
}


/**
 * 更新全局会话列表
 */
function updateGlobalConversations(list) {
	list.forEach(c => {
		const idx = globalConversations.list.findIndex(i => i.conversationId === c.conversationId)
		if (idx !== -1) globalConversations.list.splice(idx, 1, c)
		else globalConversations.list.unshift(c)
	})
}

/**
 * 消息列表
 */
export async function getMessageList(paramas = {}) {
	if (!nim) return
	const conversationId = getCid()
	if (!conversationId) return false
	try {
		const res = await nim.V2NIMMessageService.getMessageList({
			conversationId: conversationId,
			limit: 100,
			...paramas
		})
		// console.log('消息列表获取', res)
		if (res) messageList.list = res
	} catch (err) {
		// console.error('消息列表获取失败', err)
		return false
	}
}

/**
 * 删除单条消息
 */
export async function deleteMessage(message) {
	if (!nim) return
	if (!message) return
	try {
		await nim.V2NIMMessageService.deleteMessage(message)
		return true
	} catch (err) {
		return false
	}
}

/**
 * 撤回消息
 */
export async function revokeMessage(message) {
	if (!nim) return
	if (!message) return
	try {
		await nim.V2NIMMessageService.revokeMessage(message)
		return true
	} catch (err) {
		return false
	}
}


/**
 * 发送群聊消息
 * @param {String} conversationId 群聊会话ID
 * @param {Object} options 消息参数
 * options = {
 *   type: 'text' | 'image' | 'file' | 'audio' | 'emoji',
 *   content: 文本内容（文字 / 表情）
 *   file: 文件路径 / File 对象（图片 / 文件 / 语音）
 *   duration: 语音时长，单位 ms
 * }
 */
export async function sendMessage(options) {
	if (!nim || !options) return
	const conversationId = getCid()
	if(!conversationId) return
	const {
		type,
		value,
		name,
		duration
	} = options

	if (!value) return
	let messageBeforeSend

	switch (type) {
		case 'text':
			messageBeforeSend = nim.V2NIMMessageCreator.createTextMessage(value)
			break
		case 'image':
			messageBeforeSend = nim.V2NIMMessageCreator.createImageMessage(value)
			break
		case 'file':
			messageBeforeSend = nim.V2NIMMessageCreator.createFileMessage(value, name)
			break
		case 'audio':
			messageBeforeSend = nim.V2NIMMessageCreator.createAudioMessage(value)
			break
		default:
			console.warn('未知消息类型', type)
			messageBeforeSend = ''
			break
	}
	if (!messageBeforeSend) return

	const paramsForAIConfig = {
		"accountId": uni.getStorageInfoSync('nimInfo').account,
		"content": {
			"msg": "",
			"type": 0
		}
	}

	try {
		const res = await nim.V2NIMMessageService.sendMessage(
			messageBeforeSend,
			conversationId
		)
		if(res) messageList.list.push(res.message)
	} catch (err) {
		console.error('发送失败', err)
	}
}

export async function replyMessage(options, repliedMessage) {
	if (!nim || !options || !repliedMessage) return
	const {
		type,
		value,
		name,
		duration
	} = options
	try {
		if (!value) return
		let message
		
		switch (type) {
			case 'text':
				message = nim.V2NIMMessageCreator.createTextMessage(value)
				break
			case 'image':
				message = nim.V2NIMMessageCreator.createImageMessage(value)
				break
			case 'file':
				message = nim.V2NIMMessageCreator.createFileMessage(value, name)
				break
			case 'audio':
				message = nim.V2NIMMessageCreator.createAudioMessage(value)
				break
			default:
				message = ''
				break
		}
		
		if (!message) return
		const res = await await nim.V2NIMMessageService.replyMessage(message, repliedMessage)
		if(res) messageList.list.push(res.message)
	} catch (err) {
		console.error('回复失败', err)
	}
}

/**
 * 内部事件绑定
 */
function _bindEvents(nim) {
	if (!nim) return
	eventsBound = true

	/**
	 * 登录相关
	 */
	const loginSvc = nim.V2NIMLoginService
	loginSvc.on('onLoginStatus', (status) => {
		// console.log('登录状态变化:', status)
	})
	loginSvc.on('onLoginFailed', (err) => {
		// console.error('登录失败:', err)
	})
	loginSvc.on('onKickedOffline', (info) => {
		// console.warn('被踢下线:', info)
		uni.showToast({
			title: "账号在别处登录",
			icon: 'none'
		})
		setTimeout(() => {
			logoutNIM()
		}, 1500)
	})
	loginSvc.on('onLoginClientChanged', (data) => {
		// console.log('多端登录变化:', data)
	})
	loginSvc.on('onConnectStatus', (status) => {
		// console.log('连接状态变化:', status)
	})
	loginSvc.on('onDisconnected', (err) => {
		// console.warn('连接断开:', err)
	})
	loginSvc.on('onConnectFailed', (err) => {
		// console.error('连接失败:', err)
	})
	loginSvc.on('onDataSync', (data) => {
		// console.log('数据同步:', data)
	})

	/**
	 * 会话相关
	 */
	const convSvc = nim.V2NIMLocalConversationService
	convSvc.on('onSyncStarted', () => {})
	convSvc.on('onSyncFinished', () => {})
	convSvc.on('onSyncFailed', (err) => {})
	convSvc.on('onConversationCreated', c => updateGlobalConversations([c]))
	convSvc.on('onConversationChanged', list => updateGlobalConversations(list))
	convSvc.on('onConversationDeleted', ids => {
		ids.forEach(id => {
			const idx = globalConversations.list.findIndex(i => i.conversationId === id)
			if (idx !== -1) globalConversations.list.splice(idx, 1)
		})
	})
	convSvc.on('onTotalUnreadCountChanged', (count) => {})

	//监听群信息变化
	const teamSvc = nim.V2NIMTeamService
	teamSvc.on('onTeamInfoUpdated', (team) => {
		if (team.teamId == teamInfo.teamId) {
			for (const key in team) Vue.set(teamInfo, key, team[key])
		}
	})
	teamSvc.on('onTeamMemberInfoUpdated', (data) => {
		if (data.teamId == memberInfo.teamId && data.teamId == memberInfo.accountId ) {
			for (const key in data) {
				Vue.set(memberInfo, key, data[key])
			}
		}
	})
	// 入群申请
	teamSvc.on('onTeamMemberJoined', (data) => { 
		teamUnreadCount();
		getTeamJoinList()
	})
	teamSvc.on('onReceiveTeamJoinActionInfo', (data) => {
		teamUnreadCount();
		getTeamJoinList()
	})

	/**
	 * 消息相关（可选）
	 */
	const msgSvc = nim.V2NIMMessageService
	msgSvc.on('onReceiveMessages', (msgs) => {
		console.log(msgs)
		const conversationId = getCid()
		if(conversationId) {
			const newMsgs = msgs.filter(msg => msg.conversationId === conversationId)
			messageList.list = [...messageList.list, ...newMsgs]
		}
	})
	msgSvc.on('onMessageRevokeNotifications', (msgs) => {
		msgs.forEach(msg => {
			// 查找对应的消息
			const targetMessage = messageList.list.find(item => item.messageClientId === msg
				.messageRefer.messageClientId);
			// 如果找到了该消息
			if (targetMessage) {
				Vue.set(targetMessage, 'revokeType', msg.revokeType);
				Vue.set(targetMessage, 'postscript', msg.postscript || '撤回了一条信息');
			}
		});
	});
}

/**
 * 统一处理并展示 IM 错误
 * @param {any} err - SDK 抛出的错误对象
 * @param {string} fallback - 兜底提示
 */
function showNimError(err, fallback = '操作失败', show = 1) {
	let msg = fallback

	if (typeof err === 'string') {
		// 如果本身就是字符串
		msg = err
	} else if (err instanceof Error) {
		// SDK 抛出的 V2NIMError 继承自 Error
		msg = err.message || err.toString()
	} else {
		// 其他情况直接转字符串
		msg = String(err)
	}

	// 过滤掉 V2NIMError: 前缀
	msg = msg.replace(/^V2NIMError:\s*/, '')
	if (msg == 'team not exist') msg = '群不存在或您不是群成员'
	
	if (show) {
		uni.showToast({
			title: msg || fallback,
			icon: 'none'
		})
	}
	return msg
}

function getCid() {
	if (!Object.keys(teamInfo).length) return ''
	const nimInfo = uni.getStorageSync('nimInfo')
	if(!nimInfo || !nimInfo.account) return ''
	return `${nimInfo.account}|2|${teamInfo.teamId}`
}