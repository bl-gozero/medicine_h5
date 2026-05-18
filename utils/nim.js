import Vue from 'vue'
import SDK from 'nim-web-sdk-ng/dist/v2/NIM_UNIAPP_SDK'

let nim = null
let nimInfo = {}
let nimInitPromise = null
let eventsBound = false
let isLogin = false
const NIM_KEY = 'nimInfo'

// 个人信息
export const userInfo = Vue.observable({})
// 当前群组信息
export const teamInfo = Vue.observable({})
// 好友信息
export const friendInfo = Vue.observable({})
// 在当前群组中的信息
export const memberInfo = Vue.observable({})
// 全局会话数据
export const globalConversations = Vue.observable({
	list: []
})
// 消息列表
export const messageList = Vue.observable({
	list: []
})
// 申请列表
export const teamJoinList = Vue.observable({
	list: []
})
export const teamMemberList = Vue.observable({
	list: []
})
export const friendJoinList = Vue.observable({
	list: []
})
// 申请数量
export const teamJoinCount = Vue.observable({
	value: 0
})
export const friendApplictionCount = Vue.observable({
	value: 0
})
export const friendList = Vue.observable({
	list: []
})
export const blackList = Vue.observable({
	list: []
})

// 初始化 NIM 实例
export async function initNIM(autoLogin = true, accountId = null) {
	nimInfo = uni.getStorageSync(NIM_KEY)
	if (!nimInfo) return null
	if (!nim) {
		nim = SDK.getInstance({
			appkey: nimInfo.appkey,
			account: nimInfo.account,
			token: nimInfo.token,
			// debugLevel: 'debug',
			apiVersion: "v2",
			enableStickTop: true,
			enableSyncFriendApplication: true,
		})
		Vue.prototype.$nim = nim
	}
	if (!eventsBound) _bindEvents(nim)
	if (autoLogin) await loginNIM(accountId)
	return nim
}

// 登录
export async function loginNIM(accountId) {
	if (!await nimReady()) return false
	const nimInfo = uni.getStorageSync(NIM_KEY)
	if (!nimInfo) return
	if (!nimInfo.account || !nimInfo.token) {
		uni.reLaunch({
			url: '/pages/index/login'
		})
		return
	}
	try {
		const res = await nim.V2NIMLoginService.login(nimInfo.account, nimInfo.token, {
			"forceMode": false
		})
		isLogin = true
		teamBaseInfo(0)
		getMemberInfo(0)
		if(accountId) await addFriend(accountId, { addMode: 1 })
	} catch (err) {
		console.error('NIM 登录失败', err)
	}
}

export async function loginout() {
	if (!await nimReady()) return false
	if (nim) {
		try {
			await nim.V2NIMLoginService.logout()
			isLogin = false
		} catch (err) {
			// console.log(err.code)
		}
	}
}

// 登出
export async function logoutNIM(mode = 'logout') {
	if (isLogin) {
		clearConversations()
		loginout()
	}
	uni.removeStorageSync('chatInfo')
	uni.removeStorageSync('frind_id')
	if (mode == 'logout') {
		uni.removeStorageSync(NIM_KEY)
		uni.setStorageSync('jwt', '')
		uni.removeStorageSync('profile')
		uni.reLaunch({
			url: '/pages/index/login'
		})
	}
}

// 卸载
export async function unload() {
	clearConversations()
	loginout()
	uni.removeStorageSync(NIM_KEY)
	Vue.prototype.$nim = null
	nim = null
}

// 确保实例化
export async function nimReady(autoLogin = true) {
	try {
		if (nim) {
			return true
		}
		if (nimInitPromise) {
			await nimInitPromise
			return !!nim
		}
		nimInitPromise = (async () => {
			const instance = await initNIM(autoLogin)
			if (!instance) throw new Error('NIM 初始化失败')
			console.log('[NIM] 初始化及登录完成，等待同步...')
			await waitForSDKSync(instance)
			await new Promise(r => setTimeout(r, 2000))
			return instance
		})()
		nim = await nimInitPromise
		nimInitPromise = null
		console.log('初始化彻底完成')
		return true
	} catch (err) {
		console.error('NIM 初始化异常', err)
		nimInitPromise = null
		return false
	}
}
async function waitForSDKSync(nimInstance) {
	return new Promise((resolve) => {
		const syncState = nimInstance.V2NIMLoginService.getDataSync()
		console.log('[NIM] 当前同步状态:', syncState)
		if (syncState === 1) {
			console.log('[NIM] 已经同步完成 ✅')
			resolve(true)
			return
		}
		let done = false
		let timeout = setTimeout(() => {
			if (!done) {
				done = true
				console.warn('[NIM] 同步超时，继续执行')
				resolve(true)
			}
		}, 5000)
		const handler = (res) => {
			console.log('[NIM] 同步状态变化:', res)
			if (res === 1 && !done) {
				done = true
				clearTimeout(timeout)
				nimInstance.V2NIMLoginService.off('onDataSync', handler) // ✅解绑监听
				console.log('[NIM] 同步完成 ✅')
				resolve(true)
			}
		}
		nimInstance.V2NIMLoginService.on('onDataSync', handler)
	})
}

// 修改自己的信息
export async function updateSelfUserProfile(data) {
	if (!await nimReady()) return false
	if (!data || Object.prototype.toString.call(data) !== '[object Object]' || !Object.keys(data).length)
	return false
	try {
		const res = await nim.V2NIMUserService.updateSelfUserProfile(data);
		return true
	} catch (err) {
		console.error('更新资料失败', err)
		return false
	}
}

// 用户信息  mode: 1 自己的信息 2 好友的信息
export async function getUserInfo(ids = [], mode = 1) {
	if (!await nimReady()) return
	if (!ids.length) return
	const accoudIds = []
	if (mode == 1) {
		Object.keys(userInfo).forEach(key => {
			Vue.delete(userInfo, key)
		})
	}
	if (mode == 2) {
		Object.keys(friendInfo).forEach(key => {
			Vue.delete(friendInfo, key)
		})
	}
	try {
		const users = await nim.V2NIMUserService.getUserList(ids)
		if ((mode == 1 || mode == 2) && users.length > 0) {
			for (const key in users[0]) {
				if (mode == 1) Vue.set(userInfo, key, users[0][key])
				if (mode == 2) Vue.set(friendInfo, key, users[0][key])
			}
		}
		return users || {}
	} catch (err) {
		return false
	}
}

// 好友信息
export async function getFriendInfo() {
	if (!await nimReady()) return
	let fid = uni.getStorageSync('friend_id')
	Object.keys(friendInfo).forEach(key => {
		Vue.delete(friendInfo, key)
	})
	try {
		const users = await nim.V2NIMUserService.getUserList([fid])
		if (users.length > 0) {
			for (const key in users[0]) {
				Vue.set(friendInfo, key, users[0][key])
			}
		}
		// 确认是否在黑名单
		const res = await checkBlock([fid])
		if (res) Vue.set(friendInfo, 'isBlocked', res[fid])
		return users || {}
	} catch (err) {
		showNimError(err)
		console.error('好友信息失败', err)
		return false
	}
}

// 群信息
export async function teamBaseInfo(showMsg = 1) {
	if (!await nimReady()) return
	const chatInfo = uni.getStorageSync('chatInfo')
	if (!chatInfo || !chatInfo.team_id) return
	Object.keys(teamInfo).forEach(key => { Vue.delete(teamInfo, key) })
	try {
		const res = await nim.V2NIMTeamService.getTeamInfo(chatInfo.team_id + '', 1)
		for (const key in res) { Vue.set(teamInfo, key, res[key]) }
		const members = await  getTeamMembersAvatarMap(chatInfo.team_id)
		Vue.set(teamInfo, 'members', members)
		return true
	} catch (err) {
		const errmsg = showNimError(err, '', showMsg)
		if (errmsg == 'team not exist') uni.removeStorageSync('chatInfo')
		return false
	}
}

// 群信息变更
export async function updateTeamInfo(teamId, teamType, data = {}) {
	if (!await nimReady()) return
	try {
		await nim.V2NIMTeamService.updateTeamInfo(teamId, teamType, data)
		return true
	} catch (err) {
		console.error('变更群信息失败', err)
		return false
	}
}

/**
 * 获取群成员头像映射表
 * @param {string} teamId - 群ID
 * @returns {Promise<Object>} 成员头像映射 { userId: avatarUrl }
 */
export async function getTeamMembersAvatarMap(teamId) {
	if (!await nimReady()) return {}
	let allMembers = []
	let nextToken = ""
	let hasMore = true
	while (hasMore) {
		const res = await nim.V2NIMTeamService.getTeamMemberList(teamId + '', 1, {
			roleQueryType: 0,
			onlyChatBanned: false,
			direction: 0,
			limit: 100,
			nextToken
		})
		allMembers.push(...res.memberList)
		hasMore = res.hasMore
		nextToken = res.nextToken
	}
	const accountIds = allMembers.map(m => m.accountId)
	const userInfos = await nim.V2NIMUserService.getUserList(accountIds)
	const avatarMap = {}
	userInfos.forEach(user => {
		avatarMap[user.accountId] = user.avatar || ''
	})
	return avatarMap
}

// 群成员列表
export async function getTeamMembers(teamId = '') {
	if (!await nimReady()) return []
	if (!teamId) {
		const chatInfo = uni.getStorageSync('chatInfo')
		if (!chatInfo.team_id) return
		teamId = chatInfo.team_id
	}
	const allMembers = []
	let nextToken = ""
	teamMemberList.list = []
	try {
		while (true) {
			const res = await nim.V2NIMTeamService.getTeamMemberList(
				String(teamId),
				1,
				{
					roleQueryType: 0,
					onlyChatBanned: false,
					direction: 0,
					limit: 100,
					nextToken
				}
			)
			const list = res.memberList || []
			allMembers.push(...list)
			if (!list.length) {
				break
			}
			nextToken = res.nextToken
			if (!nextToken) break
		}
		teamMemberList.list = allMembers
		return allMembers
	} catch (e) {
		console.log('获取群成员失败', e)
		return []
	}
}

/**
 * 个人群信息
 */
export async function getMemberInfo(showMsg = 1) {
	if (!await nimReady()) return
	const chatInfo = uni.getStorageSync('chatInfo')
	if (!chatInfo.team_id) return
	const nimInfo = uni.getStorageSync('nimInfo')
	if (!nimInfo.account) return
	Object.keys(memberInfo).forEach(key => { Vue.delete(memberInfo, key) })
	try {
		const res = await nim.V2NIMTeamService.getTeamMemberListByIds(chatInfo.team_id + '', 1, [nimInfo.account])
		if (res.length > 0) {
			for (const key in res[0]) {
				Vue.set(memberInfo, key, res[0][key])
			}
		}
		return true
	} catch (err) {
		const msg = showNimError(err, '', showMsg)
		if (msg == 'team not exist') uni.removeStorageSync('chatInfo')
		return null
	}
}

/**
 * 加入
 */
export async function joinTeam(teamId, teamType, postscript = '', showErr = true) {
	if (!await nimReady()) return
	try {
		const res = await nim.V2NIMTeamService.applyJoinTeam(teamId + '', teamType, postscript)
		return true
	} catch (err) {
		showErr && showNimError(err)
		console.error('加入群组失败', err)
		return false
	}
}

/**
 * 群申请
 */
export async function teamUnreadCount() {
	if (!await nimReady()) return
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
	if (!await nimReady()) return
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
		console.error('同意进群失败', err)
		return false
	}
}

/**
 * 拒绝申请
 */
export async function rejectJoinApplication(teamId, teamType, accountId) {
	if (!await nimReady()) return
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
		console.error('拒绝进群失败', err)
		return false
	}
}

/**
 * 拒绝申请
 */
export async function clearAllTeamJoinActionInfo() {
	if (!await nimReady()) return
	try {
		await nim.V2NIMTeamService.clearAllTeamJoinActionInfo()
		return true
	} catch (err) {
		showNimError(err)
		console.error('清除进群申请失败', err)
		return false
	}
}

/**
 * 获取所有群申请列表（处理分页）
 * @param {number} limit 每页数量，默认 50
 * @returns {Promise<{ list: Array, pendingCount: number }>}
 */
export async function getTeamJoinList(limit = 50) {
	if (!await nimReady()) return []
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
			offset = res.offset || 0
			finished = res.finished || (res.infos.length < limit)
		} catch (err) {
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
	teamJoinList.list = allList
	return allList
}

/**
 * 置顶会话
 */
export async function setTopConversations(id) {
	if (!await nimReady()) return
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
	if (!await nimReady()) return
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
	if (!await nimReady()) return
	try {
		const res = await nim.V2NIMLocalConversationService.getConversationList(0, 100)
		const ids = res.conversationList.map(c => c.conversationId)
		if (ids.length) {
			await nim.V2NIMLocalConversationService.deleteConversationListByIds(ids, true)
			console.log('旧会话已清理')
		}
	} catch (err) {
		// console.error('清理旧会话失败', err)
	}
}

/**
 * 清除指定会话
 */
export async function deleteConversation(id) {
	if (!id) return
	if (!await nimReady()) return
	try {
		const res = await nim.V2NIMLocalConversationService.deleteConversation(id, true)
		// console.log(id, res)
		return true
	} catch (err) {
		console.error('清理会话失败', err)
		return false
	}
}

/**
 * 清除指定会话未读数量
 */
export async function clearUnreadCountByIds(ids = []) {
	if (!await nimReady()) return
	if (!Array.isArray(ids) || !ids.length) {
		const cid = uni.getStorageSync('conversationId')
		ids.push(cid)
	}
	try {
		const results = await nim.V2NIMLocalConversationService.clearUnreadCountByIds(ids)
		return true
	} catch (err) {
		console.error('清除会话未读', err)
		return false
	}
}

/**
 * 清除某个群的本地消息
 */
export async function clearTeamMessages() {
	if (!await nimReady()) return false
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
 * 清除某个群的本地消息
 */
export async function clearHistoryMessage(cid) {
	if (!await nimReady()) return false
	const conversationId = getCid(cid)
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
		console.error("清除消息失败:", err)
		return false
	}
}

/**
 * 群成员角色
 */
export async function updateTeamMemberRole(accountIds, role) {
	if (!await nimReady()) return false
	if (!accountIds.length) return false
	if (!Object.keys(teamInfo).length) return false
	try {
		const res = await nim.V2NIMTeamService.updateTeamMemberRole(teamInfo.teamId, teamInfo.teamType, accountIds,
			role)
		return true
	} catch (err) {
		showNimError('操作失败')
		console.error('修改群角色失败', err)
		return false
	}
}

/**
 * 退出群
 */
export async function leaveTeam(teamId, teamType) {
	if (!await nimReady()) return false
	let id = null
	let type = null
	if (teamId && teamType) {
		id = teamId
		type = teamType
	} else if (Object.keys(teamInfo).length) {
		id = teamInfo.teamId
		type = teamInfo.teamType
	} else {
		return false
	}
	try {
		const res = await nim.V2NIMTeamService.leaveTeam(id + '', type)
		return true
	} catch (err) {
		console.error('退群失败', err)
		showNimError('操作失败')
		return false
	}
}

// 踢出群
export async function kickMember(accoundIds) {
	if (!await nimReady()) return false
	if (!accoundIds.length) return false
	if (!Object.keys(teamInfo).length) return false
	try {
		const res = await nim.V2NIMTeamService.kickMember(teamInfo.teamId, teamInfo.teamType, accoundIds)
		return true
	} catch (err) {
		console.error('踢人失败', err)
		showNimError('操作失败')
		return false
	}
}

// 解散群
export async function dismissTeam() {
	if (!await nimReady()) return false
	if (!Object.keys(teamInfo).length) return false
	try {
		const res = await nim.V2NIMTeamService.dismissTeam(teamInfo.teamId, teamInfo.teamType)
		return true
	} catch (err) {
		console.error('解散群失败', err)
		showNimError('操作失败')
		return false
	}
}

/**
 * 群成员禁言
 */
export async function setMemberBanned(teamId, teamType, accountId, status) {
	if (!await nimReady()) return
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
export async function getMessageList(paramas = {}, id = null, refresh = true) {
	if (!await nimReady()) return []
	const conversationId = getCid(id)
	if (!id && !conversationId) return []
	if (refresh) messageList.list = []
	try {
		const res = await nim.V2NIMMessageService.getMessageList({
			conversationId: id ? id : conversationId,
			limit: 100,
			...paramas
		})
		// 当前群时同步消息
		if (res && refresh && !id) messageList.list = res
		return res || []
	} catch (err) {
		console.error('消息列表获取失败', err)
		return false
	}
}

/**
 * 删除单条消息
 */
export async function deleteMessage(message) {
	if (!await nimReady()) return
	if (!message) return
	try {
		await nim.V2NIMMessageService.deleteMessage(message)
		return true
	} catch (err) {
		return false
	}
}

// 批量删除消息
export async function deleteMessages(messages) {
	if (!await nimReady()) return
	if (!messages || !messages.length) return
	try {
		await nim.V2NIMMessageService.deleteMessages(messages, '{}')
		console.log('删除成功')
		return true
	} catch (err) {
		console.log(err)
		return false
	}
}

// 删除某个特定人员的信息
export async function deleteMemberMessages(teamMembers, mode = '') {
	const allTargetMsgs = []
	let currentConversationId = uni.getStorageSync('conversationId')
	let needRefreshMembers = false
	let kickedIds = []
	for (const member of teamMembers) {
		if (mode == 'kicked' || member.chatBanned) {
			const { teamId, accountId } = member
			const conversationId = getCid(teamId, 2)
			if (!conversationId) continue
			if (conversationId == currentConversationId) {
				needRefreshMembers = true
				kickedIds.push(accountId)
			}
			let list = await getMessageList({}, conversationId, false)
			const targetMsgs = [...list].filter(msg => {
				return msg.senderId === accountId
			})
			allTargetMsgs.push(...targetMsgs)
			if (mode == 'kicked' && nimInfo.account == accountId) {
				deleteConversation(conversationId)
			}
		}
		if (member.accountId == nimInfo.account) getMemberInfo(0)
	}
	if (allTargetMsgs.length) {
		await deleteMessages(allTargetMsgs)
	}
	// 当前页面过滤
	if (needRefreshMembers) {
		messageList.list = messageList.list.filter(msg => {
			return !kickedIds.includes(msg.senderId)
		})
		await getTeamMembers()
	}
}

// 撤回消息
export async function revokeMessage(message) {
	if (!await nimReady()) return
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
export async function sendMessage(options, cid) {
	if (!await nimReady() || !options) return false
	const conversationId = getCid(cid)
	if (!conversationId) return false
	// if (getCidInfo(conversationId, 1) == 1) {
	// 	// 确定是不是好友关系
	// 	const id = getCidInfo(conversationId, 2)
	// 	const check = await checkFriend([id])
	// 	if (check && !check[id]) {
	// 		uni.showToast({
	// 			title: '你们还不是好友哦~',
	// 			icon: 'none'
	// 		})
	// 		return false
	// 	}
	// }
	const { type, value, name, duration } = options
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
		case 'hint':
			messageBeforeSend = nim.V2NIMMessageCreator.createTipsMessage(value)
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
		if (res) {
			messageList.list.push(res.message)
			return true
		}
	} catch (err) {
		console.error('发送失败', err)
		return false
	}
}

export async function replyMessage(options, repliedMessage) {
	if (!nim || !options || !repliedMessage) return
	const { type, value, name, duration } = options
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
		if (res) {
			messageList.list.push(res.message)
			return true
		}
	} catch (err) {
		console.error('回复失败', err)
		return false
	}
}

// 搜索用户
export async function searchUser(account) {
	if (!nim || !account) return
	try {
		const users = await nim.V2NIMUserService.searchUserByOption({
			keyword: account,
			searchName: true,
			searchAccountId: false,
			searchMobile: true
		})
		return users || []
	} catch (err) {
		console.error('searchUserByOption Error:', err)
		return false
	}
}

// 添加好友
export async function addFriend(accountId, params = {}) {
	if (!accountId) return
	if (!await nimReady()) return
	try {
		const data = {
			addMode: 2,
			postscript: '',
			...params
		}
		await nim.V2NIMFriendService.addFriend(accountId, data);
		if(data.addMode == 1) {
			const text = '我们已经是好友了，现在开始聊天吧~'
			const cid = getCid(accountId, 1)
			sendMessage({ type: 'text', value: text }, cid)
		}
		return true
	} catch (err) {
		console.error('加好友成功 Error:', err)
		return false
	}
}

// 查询关系
export async function checkFriend(accoundIds) {
	if (!await nimReady()) return
	if (!Array.isArray(accoundIds) || !accoundIds.length) return
	try {
		const res = await nim.V2NIMFriendService.checkFriend(accoundIds);
		return res
	} catch (err) {
		console.error('关系查询失败:', err)
	}
}

// 好友申请数
export async function frienUnreadCount() {
	if (!await nimReady()) return
	try {
		const count = await nim.V2NIMFriendService.getAddApplicationUnreadCount()
		friendApplictionCount.value = count || 0
		return count || 0
	} catch (err) {
		console.error('getAddApplicationUnreadCount Error:', err)
	}
}

// 获取好友申请列表（已防重复）
export async function getFrienApplicaionList(limit = 50) {
	if (!await nimReady()) return
	let offset = 0
	let finished = false
	let allList = []
	while (!finished) {
		try {
			const res = await nim.V2NIMFriendService.getAddApplicationList({
				offset,
				limit
			})
			if (res && Array.isArray(res.infos)) allList.push(...res.infos)
			offset = res.offset || 0
			finished = res.finished || (res.infos.length < limit)
		} catch (err) {
			console.error('获取好友申请列表失败', err)
			break
		}
	}
	const uniqueMap = {}
	allList.forEach(item => {
		const key = [item.applicantAccountId, item.recipientAccountId].sort().join('_')
		if (!uniqueMap[key] || item.timestamp > uniqueMap[key].timestamp) {
			uniqueMap[key] = item
		}
	})
	allList = Object.values(uniqueMap)
	if (allList.length > 0) {
		const accountIds = allList.map(item => item.applicantAccountId)
		const users = await nim.V2NIMUserService.getUserList(accountIds)
		const userMap = {}
		users.forEach(u => {
			userMap[u.accountId] = u
		})
		allList = allList.map(item => ({
			...item,
			user: userMap[item.applicantAccountId] || {}
		}))
	}
	friendJoinList.list = allList
	return allList
}

// 同意添加好友
export async function acceptAddApplication(application) {
	if (!await nimReady()) return
	if (!application) return
	try {
		await nim.V2NIMFriendService.acceptAddApplication(application)
		return true
	} catch (err) {
		showNimError(err)
		console.error('添加好友失败', err)
	}
}

// 拒绝添加好友
export async function rejectAddApplication(application) {
	if (!await nimReady()) return
	if (!application) return
	try {
		await nim.V2NIMFriendService.rejectAddApplication(application, '')
		return true
	} catch (err) {
		showNimError(err)
		console.error('拒绝好友失败', err)
	}
}

// 删除好友
export async function deleteFriend(accountId) {
	try {
		const res = await nim.V2NIMFriendService.deleteFriend(accountId + '', {
			deleteAlias: true
		});
		return true
	} catch (err) {
		showNimError(err)
		console.error('删除好友失败', err)
		return false
	}
}

// 好友列表
export async function getFriendList() {
	if (!await nimReady()) return
	try {
		let friends = await nim.V2NIMFriendService.getFriendList()
		if (!Array.isArray(friends)) friends = []
		const blockList = await nim.V2NIMUserService.getBlockList() // 获取黑名单列表
		const blockedSet = new Set(blockList || [])
		// 给好友列表加 isBlocked 标记
		friends = friends.map(f => ({
			...f,
			isBlocked: blockedSet.has(f.accountId)
		}))
		const friend_id = uni.getStorageSync('friend_id')
		if (friend_id) {
			const friend = friends.find(i => i.accounId = friend_id)
			if (friend) {
				for (const key in friend) {
					Vue.set(friendInfo, key, friend[key])
				}
			}
		}
		friendList.list = friends
		return friends
	} catch (err) {
		console.error('获取好友列表错误', err)
		return []
	}
}

// 加入黑名单
export async function addUserToBlockList(accountId) {
	if (!await nimReady()) return
	try {
		await nim.V2NIMUserService.addUserToBlockList(accountId + '')
		await getFriendList()
		return true
	} catch (err) {
		console.error('加入黑名单失败', err)
		return false
	}
}

// 移除黑名单
export async function removeUserFromBlockList(accountId) {
	if (!await nimReady()) return
	try {
		await nim.V2NIMUserService.removeUserFromBlockList(accountId + '');
		await getBlockList()
		return true
	} catch (err) {
		console.error('加入黑名单失败', err)
		return false
	}
}

// 检查是否在黑名单中
export async function checkBlock(accountIds = []) {
	if (!await nimReady()) return
	if (!Array.isArray(accountIds) || !accountIds.length) return
	try {
		const res = await nim.V2NIMUserService.checkBlock(accountIds)
		return res
	} catch (err) {
		console.error('检查是否在黑名单中失败', err)
		return false
	}
}

// 黑名单
export async function getBlockList() {
	if (!await nimReady()) return
	try {
		// 获取黑名单账号数组
		let blockList = await nim.V2NIMUserService.getBlockList()
		let result = []
		if (blockList.length > 0) {
			// 获取用户详细信息
			const users = await nim.V2NIMUserService.getUserList(blockList)
			const userMap = {}
			users.forEach(u => {
				userMap[u.accountId] = u
			})
			result = blockList.map(accId => ({
				accountId: accId,
				userProfile: userMap[accId] || {}
			}))
		}
		blackList.list = result || []
		return result
	} catch (err) {
		console.error('黑名单获取失败', err)
		return false
	}
}

// 内部事件绑定
async function _bindEvents(nim) {
	if (!await nimReady()) return
	eventsBound = true

	// 登录相关
	const loginSvc = nim.V2NIMLoginService
	loginSvc.on('onLoginStatus', (status) => {})
	loginSvc.on('onLoginFailed', (err) => {})
	loginSvc.on('onKickedOffline', (info) => {
		uni.showToast({
			title: "账号在别处登录",
			icon: 'none'
		})
		setTimeout(() => { logoutNIM() }, 1500)
	})
	loginSvc.on('onLoginClientChanged', (data) => { console.log('多端登录变化:', data) })
	loginSvc.on('onConnectStatus', (status) => { console.log('连接状态变化:', status) })
	loginSvc.on('onDisconnected', (err) => { console.warn('连接断开:', err) })
	loginSvc.on('onConnectFailed', (err) => { console.error('连接失败:', err) })
	loginSvc.on('onDataSync', (data) => { console.log('数据同步:', data) })

	// 会话相关
	const convSvc = nim.V2NIMLocalConversationService
	convSvc.on('onSyncStarted', () => {})
	convSvc.on('onSyncFinished', () => {})
	convSvc.on('onSyncFailed', (err) => {})
	convSvc.on('onTotalUnreadCountChanged', (count) => {})
	convSvc.on('onConversationCreated', c => updateGlobalConversations([c]))
	convSvc.on('onConversationChanged', list => updateGlobalConversations(list))
	convSvc.on('onConversationDeleted', ids => {
		ids.forEach(id => {
			const idx = globalConversations.list.findIndex(i => i.conversationId === id)
			if (idx !== -1) globalConversations.list.splice(idx, 1)
		})
	})
	
	//监听群信息变化
	const teamSvc = nim.V2NIMTeamService
	teamSvc.on('onTeamInfoUpdated', (team) => {
		if (team.teamId == teamInfo.teamId) {
			for (const key in team) Vue.set(teamInfo, key, team[key])
		}
	})
	teamSvc.on('onTeamMemberInfoUpdated', (data) => {
		if (data.teamId == memberInfo.teamId && data.accountId == memberInfo.accountId) {
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
	// 群成员踢出
	teamSvc.on('onTeamMemberKicked', async (operateAccountId, teamMembers) => {
		deleteMemberMessages(teamMembers, 'kicked')
	})
	// 成员信息变化
	teamSvc.on('onTeamMemberInfoUpdated', (teamMembers) => { 
		deleteMemberMessages(teamMembers, 'chatBanned')
	})
	// 群解散
	teamSvc.on('onTeamDismissed', (team) => {
		console.log("recv onTeamDismissed", team)
	})
	// 群退出
	teamSvc.on('onTeamLeft', (team, isKicked) => {
		const cid = getCid(team.teamId, 2)
		deleteConversation(cid)
		if (cid == uni.getStorageSync('conversationId')) {
			Vue.set(memberInfo, 'kicked', isKicked)
		}
	})
	//
	teamSvc.on('onTeamMemberJoined', async (teamMembers) => { 
		const currentConversationId = uni.getStorageSync('conversationId')
		for (const member of teamMembers) {
			const conversationId = getCid(member.teamId, 2)
			if (conversationId == currentConversationId) {
				await getTeamMembers()
				break
			}
		}
	})

	// 好友相关
	const friendSvc = nim.V2NIMFriendService
	friendSvc.on('onFriendAddRejected', (friend) => {})
	friendSvc.on('onFriendProfileUpdated', (friend) => {})
	friendSvc.on('onFriendListSync', (friends) => {})
	friendSvc.on('onFriendAdded', (friend) => { getFriendList() })
	friendSvc.on('onFriendDeleted', (accountId) => {
		friendList.list = friendList.list.filter(f => f.accountId !== accountId)
		setTimeout(() => getFriendList(), 300)
	})
	friendSvc.on("onFriendAddApplication", (friend) => {
		setTimeout(() => {
			frienUnreadCount()
			getFrienApplicaionList()
		}, 500)
	})

	// 消息相关
	const msgSvc = nim.V2NIMMessageService
	msgSvc.on('onReceiveMessages', (msgs) => {
		const conversationId = getCid()
		if (conversationId) {
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
	if (msg == 'illegal state') msg = '登录状态异常'
	if (show) {
		uni.showToast({
			title: msg || fallback,
			icon: 'none'
		})
	}
	return msg
}

function getCid(cid, mode = 0, account = '') {
	if (cid && !mode) {
		return cid
	} else if(cid && mode) {
		if (!nimInfo || !nimInfo.account) return ''
		account = account ? account : nimInfo.account
		return `${nimInfo.account}|${mode}|${cid}`
	} else {
		let conversationId = uni.getStorageSync('conversationId')
		if (!conversationId) {
			if (!Object.keys(teamInfo).length) return ''
			if (!nimInfo || !nimInfo.account) return ''
			conversationId = `${nimInfo.account}|2|${teamInfo.teamId}`
		}
		return conversationId
	}
}

function getCidInfo(id, n) {
	if (!id) return null
	const parts = id.split('|')
	if (parts.length != 3) return null
	return parts[n] ? parts[n] : null
}