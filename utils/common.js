// utils/common.js
import env from './env'
import api from '@/utils/api/index.js'
import { teamBaseInfo, getMemberInfo, getMessageList, initNIM } from './nim'

const BASE_URL = env.BASE_URL

const common = {
	/**
	 * 格式化时间：yyyy-mm-dd hh:MM:ss
	 */
	formatDateTime(date) {
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
	toast(title) {
		if (!title) return
		uni.showToast({
			title: title,
			icon: 'none'
		})
	},

	/**
	 * 跳转封装（防止重复点击）
	 */
	goto(url, type = 1) {
		if (!url) return
		if(type == 2) {
			uni.redirectTo({
				url
			})
		} else {
			uni.navigateTo({
				url
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
	  let locked = false  // 这里定义在 onceRequest 的闭包作用域中，保持状态
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
		switch(type) {
			case 'cs': return this.cs()
			case 'dl': return 'https://resource.kkanyng.vip/medicine/download/app-release.new.apk'
			default: return ''
		}
	},
	
	barHeight() {
		return uni.$u.sys().statusBarHeight + 20
	},
	
	baseColor() {
		return '#1A7E84'
	},
	
	arrowColor() {
		return '#7D7D7D'
	},
	
	formatStatus(e, p = '') {
		switch(e) {
			case 1: return { color: '#FF8F1F', text: '待付款', hint: p && '订单会在' + p +  '后自动取消订单，请您及时付款' }
			case 2: return { color: '#FF8F1F', text: '已付款', hint: '请您选择申请发货或者寄存仓库' }
			case 3: return { color: '#FF8F1F', text: '待收货', hint: '签收后7天后会自动确认收货' }
			case 4: return { color: '#3D3D3D', text: '交易成功', hint: '感谢您的支持，期待您下次再来购买' }
			case 5: return { color: '#3D3D3D', text: '已评价', hint: '' }
			case 6: return { color: '#9F9F9F', text: '已取消', hint: '您的订单已取消' }
			case 8: return { color: '#FF8F1F', text: '待发货', hint: '商家正在打包请耐心等待' }
			case 9: return { color: '#3d3d3d', text: '已寄存', hint: '您的商品已寄存，可去我的仓库内查看' }
			default: return { color: '#9F9F9F', text: '' }
		}
	},
	
	formatPointStatus(e, p = '') {
		switch(e) {
			case 1: return { color: '#FF8F1F', text: '待付款', hint: p && '订单会在' + p +  '后自动取消订单，请您及时付款' }
			case 2: return { color: '#FF8F1F', text: '已付款', hint: '已付款，可申请发货' }
			case 3: return { color: '#FF8F1F', text: '待收货', hint: '签收后7天后会自动确认收货' }
			case 4: return { color: '#3D3D3D', text: '交易成功', hint: '感谢您的支持，期待您下次再来购买' }
			case 5: return { color: '#3D3D3D', text: '已评价', hint: '' }
			case 6: return { color: '#9F9F9F', text: '已取消', hint: '您的订单已取消' }
			case 8: return { color: '#FF8F1F', text: '待发货', hint: '商家正在打包请耐心等待' }
			case 9: return { color: '#3d3d3d', text: '已寄存', hint: '您的商品已寄存，可去我的仓库内查看' }
			default: return { color: '#9F9F9F', text: '' }
		}
	},
	
	
	copy(text) {
		uni.setClipboardData({
			data: text,
			success: () => {
				uni.showToast({ title: '复制成功', icon: 'none' });
			},
			fail: () => {
				uni.showToast({ title: '复制失败', icon: 'none' });
			}
		});
	},
	
	calcTime(dateTimeStr, s) {
		if(!dateTimeStr) return
		const date = new Date(dateTimeStr.replace(/-/g, '/'))
		const newDate = new Date(date.getTime() + s * 1000)
		return this.formatDateTime(newDate)
	},
	
	async checkeLogin(type = 0) {
		const jwt = this.getStorage('jwt')
		const profile = this.getStorage('profile')
		if (!jwt || !profile || Object.keys(profile).length === 0) {
			this.toast('请先登录')
			this.goto('/pages/index/login')
		}
		if(type) {
			await this.getProfile()
			return this.profile()
		}
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
			upgrade_at: "",
			balance: 0,
			referral_code: "",
			direct: 0,
			direct_vip: 0,
			spread_count: 0,
			share_url: ''
		}
	},
	
	formatUrl(url) {
	    if (!url) return '/static/group/default.png' // 默认头像
	    if (url.startsWith('http')) return url      // 已经是完整 URL
	    return BASE_URL + url      // 拼接域名
	},
	
	userAvatar() {
		return '/static/user/avatar.png'
	},
	
	groupAvatar() {
		return '/static/group/default.png'
	},
	
	async goChat(item) {
		if(!item.team_id && item.conversationId) {
			const parts = item.conversationId.split('|')
			if (parts.length == 3) {
				item.team_id = parseInt(parts[2])
			}
		}
		const chatInfo = this.getStorage('chatInfo')
		this.setStorage('chatInfo', item)
		if(item.team_id != chatInfo.team_id) {
			const res1 = await teamBaseInfo()
			if(!res1) {
				this.removeStorage('chatInfo')
				return
			}
			const res2 = await getMemberInfo()
			if(!res2) {
				this.removeStorage('chatInfo')
				return
			}
			await getMessageList()
		}
		this.goto('/pages/group/chat')
	},
	
	formatMessage(reply) {
		switch(reply.messageType) {
			case 0: return reply.text || ''
			case 1: return '[图片消息]'
			case 2: return '[语音消息]'
			case 3: return '[视频消息]'
			case 6: return '[文件消息]'
			default: return '消息'
		}
	},
	
	checkNim() {
		const pages = getCurrentPages()
		const currentPage = pages[pages.length - 1]
		const current = '/' + currentPage.route
		const arr = ['/pages/index/launch', '/pages/index/login', '/pages/index/index', '/pages/index/index', '/pages/index/register']
		const aotuLogin = arr.indexOf(current) > -1? false : true
		initNIM(aotuLogin)
	},
	
	checkIcon(res) {
		return res ? '/static/icon/check_1.webp' :
			'/static/icon/check_0.webp'
	},
	
	codeLimitTime () {
		return 150 * 1000
	},
	
	levelIcon(level) {
		if(!level) return ''
		switch (level) {
			case 3: return '/static/user/vip.png'
			case 4: return '/static/user/partner.png'
			default: return ''
		}
	},
}

export default common