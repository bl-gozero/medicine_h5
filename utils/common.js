// utils/common.js
import env from './env'
import api from '@/utils/api/index.js'
import {
	teamBaseInfo,
	getMemberInfo,
	getMessageList,
	nimReady,
	getUserInfo,
	loginNIM,
	logoutNIM
} from './nim'

const BASE_URL = env.BASE_URL

const common = {
	/**
	 * 格式化时间：yyyy-mm-dd hh:MM:ss
	 */
	formatDateTime(date = null) {
		if (!date) date = new Date()
		const d = new Date(date)
		const yyyy = d.getFullYear()
		const mm = String(d.getMonth() + 1).padStart(2, '0')
		const dd = String(d.getDate()).padStart(2, '0')
		const hh = String(d.getHours()).padStart(2, '0')
		const MM = String(d.getMinutes()).padStart(2, '0')
		const ss = String(d.getSeconds()).padStart(2, '0')
		return `${yyyy}-${mm}-${dd} ${hh}:${MM}:${ss}`
	},

	/**
	 * 手机号校验
	 */
	isPhoneNumber(str) {
		return /^1[3-9]\d{9}$/.test(str)
	},

	/**
	 * 身份证校验
	 */
	isIdCard(str) {
		return /^[1-9]\d{5}(18|19|20)?\d{2}(0[1-9]|1[0-2])([0-2]\d|3[01])\d{3}[\dXx]$/.test(str)
	},

	/**
	 * 邮箱校验
	 */
	isEmail(str) {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
	},

	/**
	 * 金额格式化（保留两位小数）
	 */
	formatMoney(num) {
		return parseFloat(num || 0).toFixed(2)
	},

	priceFormatter(value) {
		if (!value) return '';
		let match = value.toString().match(/^\d*(\.?\d{0,2})?/);
		return match ? match[0] : '';
	},

	/**
	 * 防抖函数
	 */
	debounce(fn, delay = 500) {
		let timer = null
		return function(...args) {
			clearTimeout(timer)
			timer = setTimeout(() => fn.apply(this, args), delay)
		}
	},

	/**
	 * 节流函数
	 */
	throttle(fn, delay = 500) {
		let last = 0
		return function(...args) {
			const now = Date.now()
			if (now - last > delay) {
				last = now
				fn.apply(this, args)
			}
		}
	},

	/**
	 * 本地缓存：设置
	 */
	setStorage(key, value) {
		try {
			uni.setStorageSync(key, value)
		} catch (e) {
			console.error('setStorage error', e)
		}
	},

	/**
	 * 本地缓存：获取
	 */
	getStorage(key) {
		try {
			return uni.getStorageSync(key)
		} catch (e) {
			console.error('getStorage error', e)
			return null
		}
	},

	/**
	 * 本地缓存：删除
	 */
	removeStorage(key) {
		try {
			uni.removeStorageSync(key)
		} catch (e) {
			console.error('removeStorage error', e)
		}
	},

	/**
	 * 气泡
	 */
	toast(title, duration = 1500) {
		if (!title) return Promise.resolve()
		return new Promise(resolve => {
			uni.showToast({
				title,
				icon: 'none',
				mask: true,
				duration
			})
			
			setTimeout(resolve, duration)
		})
	},

	/**
	 * 跳转封装（防止重复点击）
	 */
	goto(url, type = 1, data = null) {
		if (!url) return
		const isHttp = /^https?:\/\//.test(url)
		if (isHttp) {
			// #ifdef H5
			// window.open(url) // 推荐新开页
			window.location.href = url
			// #endif
	
			// #ifdef APP-PLUS
			plus.runtime.openURL(url)
			// #endif
	
			return
		}
		switch (type) {
			case 2:
				uni.redirectTo({ url }) // 关闭当前页面，然后打开新的页面
				break
			case 3:
				uni.reLaunch({ url }) // 关闭所有页面，然后打开新的页面
				break
			default:
				uni.navigateTo({
					url,
					success(res) {
						if (data) {
							res.eventChannel.emit('pageData', data)
						}
					}
				})
		}
	},

	/**
	 * 返回上一页
	 */
	goBack(delta = 1) {
		if (getCurrentPages().length > 1) {
			uni.navigateBack({
				delta
			})
		} else {
			uni.reLaunch({
				url: '/pages/index/index'
			}) // 或跳首页
		}
	},

	/**
	 * 请求接口
	 */
	async fetch(apiFunc, ...params) {
		try {
			const res = await apiFunc(...params)
			return res || {}
		} catch (e) {
			console.error('请求错误:', e)
			return null
		}
	},

	/**
	 * 防止连续请求接口，在data里定义变量，在onload调用方法
	 */
	onceRequest(fn, delay = 500) {
		let locked = false // 这里定义在 onceRequest 的闭包作用域中，保持状态
		return async function(...args) {
			if (locked) {
				console.warn('请求被拦截：重复请求')
				return
			}
			locked = true
			try {
				const result = await fn.apply(this, args)
				return result
			} finally {
				setTimeout(() => {
					locked = false
				}, delay)
			}
		}
	},

	cs() {
		return 'https://dbqyhksh.kk.afastchat.online'
	},

	url(type) {
		switch (type) {
			case 'cs':
				return this.cs()
			case 'dl':
				return this.getStorage('endpoint') + '/download/app-release.new.apk'
			case 'dl2':
				return this.getStorage('endpoint') + '/download/app-release.m.new.apk'
			default:
				return ''
		}
	},

	barHeight() {
		let height = uni.$u.sys().statusBarHeight
		// #ifdef MP-WEIXIN
		const menu = uni.getMenuButtonBoundingClientRect()
		height += menu.height
		// #endif
		return height + 20
	},

	baseColor() {
		return '#EB5433'
		// #ifndef MP
		return '#1A7E84'
		// #endif
	},

	arrowColor() {
		return '#7D7D7D'
	},

	formatStatus(e, p = '') {
		switch (e) {
			case 1:
				return {
					color: '#FF8F1F', text: '待付款', hint: p && '订单会在' + p + '后自动取消订单，请您及时付款'
				}
			case 2:
				return {
					color: '#FF8F1F', text: '已付款', hint: '请您选择申请发货或者寄存仓库'
				}
			case 3:
				return {
					color: '#FF8F1F', text: '待收货', hint: '签收后7天后会自动确认收货'
				}
			case 4:
				return {
					color: '#3D3D3D', text: '交易成功', hint: '感谢您的支持，期待您下次再来购买'
				}
			case 5:
				return {
					color: '#3D3D3D', text: '已评价', hint: ''
				}
			case 6:
				return {
					color: '#9F9F9F', text: '已取消', hint: '您的订单已取消'
				}
			case 8:
				return {
					color: '#FF8F1F', text: '待发货', hint: '商家正在打包请耐心等待'
				}
			case 9:
				return {
					color: '#3d3d3d', text: '已寄存', hint: '您的商品已寄存，可去我的仓库内查看'
				}
			default:
				return {
					color: '#9F9F9F', text: ''
				}
		}
	},

	formatPointStatus(e, p = '') {
		switch (e) {
			case 1:
				return {
					color: '#FF8F1F', text: '待付款', hint: p && '订单会在' + p + '后自动取消订单，请您及时付款'
				}
			case 2:
				return {
					color: '#FF8F1F', text: '已付款', hint: '已付款，可申请发货'
				}
			case 3:
				return {
					color: '#FF8F1F', text: '待收货', hint: '签收后7天后会自动确认收货'
				}
			case 4:
				return {
					color: '#3D3D3D', text: '交易成功', hint: '感谢您的支持，期待您下次再来购买'
				}
			case 5:
				return {
					color: '#3D3D3D', text: '已评价', hint: ''
				}
			case 6:
				return {
					color: '#9F9F9F', text: '已取消', hint: '您的订单已取消'
				}
			case 8:
				return {
					color: '#FF8F1F', text: '待发货', hint: '商家正在打包请耐心等待'
				}
			case 9:
				return {
					color: '#3d3d3d', text: '已寄存', hint: '您的商品已寄存，可去我的仓库内查看'
				}
			default:
				return {
					color: '#9F9F9F', text: ''
				}
		}
	},


	copy(text) {
		uni.setClipboardData({
			data: text,
			success: () => {
				uni.showToast({
					title: '复制成功',
					icon: 'none'
				});
			},
			fail: () => {
				uni.showToast({
					title: '复制失败',
					icon: 'none'
				});
			}
		});
	},

	calcTime(dateTimeStr, s) {
		if (!dateTimeStr) return
		const date = new Date(dateTimeStr.replace(/-/g, '/'))
		const newDate = new Date(date.getTime() + s * 1000)
		return this.formatDateTime(newDate)
	},

	async checkeLogin(type = 0) {
		const jwt = this.getStorage('jwt')
		const profile = this.getStorage('profile')
		if (!jwt || !profile || Object.keys(profile).length === 0) {
			this.toast('请先登录')
			this.goto('/pages/index/login', 3)
			return false
		}
		if (type) {
			await this.getProfile()
			return this.profile()
		}
		return true
	},

	async getProfile() {
		const res = await this.fetch(api.user.profile)
		if (res) {
			this.setStorage('profile', res)
		}
		return res
	},

	profile() {
		return this.getStorage('profile') || {
			account: "heiseeyong",
			level: {
				id: 1,
				value: "普通用户"
			},
			medals: {
				id: 1,
				value: "无奖牌"
			},
			upgrade_at: "",
			balance: 0,
			referral_code: "",
			direct: 0,
			direct_vip: 0,
			spread_count: 0,
			share_url: '',
			subsidy: 0
		}
	},

	formatUrl(url) {
		if (!url) return '/static/group/default.png' // 默认头像
		if (url.startsWith('http')) return url // 已经是完整 URL
		return BASE_URL + url // 拼接域名
	},

	userAvatar() {
		return '/static/mp/user/icon_user_default.webp'
	},

	groupAvatar() {
		return '/static/group/default.png'
	},

	async goChat(item) {
		if (!item.conversationId) return
		this.setStorage('conversationId', item.conversationId)
		const parts = item.conversationId.split('|')
		if (parts.length != 3) return
		// 1 个人聊天 2 群聊
		if (parseInt(parts[1]) === 1) {
			const accountId = this.getCidInfo(item.conversationId, 2)
			this.setStorage('friend_id', accountId)
		} else {
			if (!item.team_id && item.conversationId) {
				item.team_id = parseInt(parts[2])
			}
			const chatInfo = this.getStorage('chatInfo')
			this.setStorage('chatInfo', item)
			const res1 = await teamBaseInfo()
			if (!res1) {
				this.removeStorage('chatInfo')
				return
			}
			const res2 = await getMemberInfo()
			if (!res2) {
				this.removeStorage('chatInfo')
				return
			}
		}
		this.goto('/pages/group/chat')
	},

	formatMessage(reply) {
		switch (reply.messageType) {
			case 0:
				return reply.text || ''
			case 1:
				return '[图片消息]'
			case 2:
				return '[语音消息]'
			case 3:
				return '[视频消息]'
			case 6:
				return '[文件消息]'
			default:
				return '消息'
		}
	},

	checkNim() {
		const jwt = this.getStorage('jwt')
		const pages = getCurrentPages()
		const arr = ['/pages/index/launch', '/pages/index/login', '/pages/index/index', '/pages/index/index', '/pages/index/protocols',
			'/pages/index/register', '/pages/web/register', '/pages/web/download', '/pages/web/downloadForMerchant', '/pages/web/pay', 
			'/pages/web/pay1', '/pages/info/protocols'
		]
		let current = ''
		if (pages.length) {
			const currentPage = pages[pages.length - 1]
			current = '/' + currentPage.route
		}
		const aotuLogin = arr.indexOf(current) > -1 || !jwt ? false : true
		nimReady(aotuLogin)
	},

	checkIcon(res) {
		// // #ifdef MP
		// return res ? '/static/icon/check_1_mp.webp' :
		// 	'/static/icon/check_0.webp'
		// // #endif
		// // #ifndef MP
		// return res ? '/static/icon/check_1.webp' :
		// 	'/static/icon/check_0.webp'
		// // #endif
		return res ? '/static/icon/check_1_mp.webp' :
			'/static/icon/check_0.webp'
	},

	codeLimitTime() {
		return 150 * 1000
	},

	levelIcon(level) {
		if (!level) return ''
		switch (level) {
			case 3:
				return '/static/user/vip.png'
			case 4:
				return '/static/user/partner.png'
			default:
				return ''
		}
	},

	parseJSON(str) {
		if (typeof str !== 'string') return false
		try {
			return JSON.parse(str)
		} catch (e) {
			return false
		}
	},

	payUrl() {
		return 'https://www.99bill.com/mobilegateway/recvMerchantInfoAction.htm'
	},

	quickPay(params, showTitle = true) {
		if (!params) return
		let data = this.parseJSON(params)
		if (!data) {
			this.setStorage('web', {
				title: '支付',
				src: params,
				showTitle: showTitle
			})
			this.goto('/pages/index/web?type=pay')
			return
		}
		const url = this.payUrl()

		// 创建隐藏 form 元素
		const form = document.createElement('form')
		form.method = 'POST'
		form.action = url
		form.style.display = 'none'

		uni.showLoading({
			title: '提交中，请稍等...',
			icon: 'none',
			mask: true
		})

		// 把 JSON 的 key/value 转成 input
		Object.keys(data).forEach(key => {
			const input = document.createElement('input')
			input.type = 'hidden'
			input.name = key
			input.value = data[key]
			form.appendChild(input)
		})

		// 插入页面并提交
		document.body.appendChild(form)
		setTimeout(() => {
			form.submit()
		}, 300)
	},
	
	formPay(formHtml) {
		uni.showLoading({
			title: '提交中，请稍等...',
			icon: 'none',
			mask: true
		})		
		const div = document.createElement('div')
		div.innerHTML = formHtml
		const form = div.querySelector('form')
		document.body.appendChild(form)
		setTimeout(() => {
			form.submit()
		}, 300)
	},
	
	async payJump(e, url = '', msg = '支付成功') {
		if (!e) return 
	
		if (e.status === 'success') {
			await this.toast(msg)
			return url ? this.goto(url) : this.goBack()
		}
		
		if (e.jump_url) {
			const payHandlers = {
				none: (e) => this.quickPay(e.jump_url),
				browser: (e) => this.quickPay(e.jump_url),
				out_browser: (e) => this.quickPay(e.jump_url),
				alipay: (e) => {},
				wechat: (e) => {},
				form: (e) => this.formPay(e.jump_url)
			}
			
			const handler = payHandlers[e.call] 
				|| (e.alipay && payHandlers.alipay)
				|| (e.wechat && payHandlers.wechat)
				
			handler ? handler(e) : console.warn('未知支付方式', e)
		}
	},

	getCid(id, mode = 2) {
		// mode 1 私聊 2 群聊
		if (!id) return ''
		const nimInfo = this.getStorage('nimInfo')
		if (!nimInfo || !nimInfo.account) return ''
		return `${nimInfo.account}|${mode}|${id}`
	},

	getCidInfo(id, n) {
		if (!id) return null
		const parts = id.split('|')
		if (parts.length != 3) return null
		return parts[n] ? parts[n] : null
	},

	async getExpress(id = null, mode = null) {
		if (!id) return
		if (!mode) return
		const res = await this.fetch(api.goods.orderExpress, {
			id: id,
			mode: mode
		})
		if (res) return res || []
	},

	formatTime(timestamp) {
		const date = new Date(timestamp)
		const now = new Date()

		const Y = date.getFullYear()
		const M = ('0' + (date.getMonth() + 1)).slice(-2)
		const D = ('0' + date.getDate()).slice(-2)
		const h = ('0' + date.getHours()).slice(-2)
		const m = ('0' + date.getMinutes()).slice(-2)

		const isToday =
			Y === now.getFullYear() &&
			M === ('0' + (now.getMonth() + 1)).slice(-2) &&
			D === ('0' + now.getDate()).slice(-2)

		if (isToday) {
			return `${h}:${m}`
		} else if (Y === now.getFullYear()) {
			return `${M}月${D}日 ${h}:${m}`
		} else {
			return `${Y}年${M}月${D}日 ${h}:${m}`
		}
	},

	formatImgUrl(url, key = 'avatar') {
		if (!url) return ''
		if (url.startsWith('http')) return url
		const domain = this.getStorage('endpoint')
		return domain ? `${domain}/${url}` : url
	},

	isMedals(data) {
		if (!data) return 0;
		const level = Number(data?.level?.id) || 1;
		const medals = Number(data?.medals?.id) || 1;
		return level > 3 && medals > 1 ? (medals - 1) : 0
	},

	calcLv(data) {
		if (!data) return 1;
		const level = Number(data?.level?.id) || 1;
		const medals = level > 3 ? (Number(data?.medals?.id) || 1) : 1;
		return level + medals - 1
	},

	calcLvName(data) {
		if (data?.level?.id > 3 && data?.medals?.id > 1 && data?.medals?.value) {
			return data.medals.value
		} else if (data?.level?.value) {
			return data.level.value
		}
		return ''
	},

	calcLvBg(item) {
		const lv = this.calcLv(item)
		switch (lv) {
			case 1:
				return 'background: #E1E9EA;color: #3D3D3D'
			case 2:
				return 'background: #E5E0D2;color: #3D3D3D'
			case 3:
				return 'background: #B08E3E;color: #fff'
			case 4:
				return 'background: #30304C;color: #fff'
			case 5:
				return 'background: linear-gradient(90deg, #895041 0%, #BD967E 96%);color: #fff'
			case 6:
				return 'background: linear-gradient(90deg, #41474D 0%, #9BA4B5 96%);color: #fff'
			case 7:
				return 'background: linear-gradient(90deg, #B76B20 0%, #DDAB57 100%);color: #fff'
			default:
				return 'background: #D8D8D8'
		}
	},

	sellData(id = 0, account = '') {
		if (!account) return
		this.setStorage('sellAccount', {
			id: Number(id) || 0,
			account: account
		})
		this.goto('/pages/finance/sell')
	},

	mode() {
		return 1
	},

	safeId(query, q = 'id') {
		const id = Number(query?.[q])
		return Number.isInteger(id) && id >= 0 ? id : null
	},

	img(path, mode = 1) {
		if (!path) return ''
		
		if (/^(https?:)?\/\//.test(path)) {
			return path
		}
		
		let domain = this.getStorage('endpoint')
		if (mode && domain) {
			path = domain + '/wx_mini_program' + path
		}
		
		return path
	},
	
	sleep(time) {
		return new Promise(resolve => setTimeout(resolve, time))
	},
	
	saveAccount(a) {
		const jwt = this.getStorage('jwt')
		if (!a || !jwt) return
		const nimInfo = this.getStorage('nimInfo')
		const newAccount = { ...a, jwt, nimInfo }
		let accounts = this.getStorage('accounts') || []
		const index = accounts.findIndex(i => i.account === newAccount.account)
		if (index > -1) {	
			if (accounts[index].deleted_at) newAccount.deleted_at = accounts[index].deleted_at
			accounts.splice(index, 1) // 先删
		}
		accounts.unshift(newAccount) // 放最前
		
		// 最多保留10个
		// accounts = accounts.slice(0, 10)
		this.setStorage('accounts', accounts)
	},
	
	async switchAccount(account) {
		if (!account.jwt && !account.nimInfo) {
			await this.$c.toast('登录已失效，需重新登录')
			this.$c.goto('/pages/index/login')
			return
		}
		this.setStorage('jwt', account.jwt)
		
		const nimInfo = account.nimInfo
		this.setStorage('nimInfo', nimInfo)
		
		await logoutNIM('switch')
		await loginNIM()
	}
}

export default common