// utils/common.js

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
	goto(url) {
		if (!url) return
		uni.navigateTo({
			url
		})
	},

	/**
	 * 返回上一页
	 */
	goBack(delta = 1) {
		uni.navigateBack({
			delta
		})
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
	
	barHeight() {
		return uni.$u.sys().statusBarHeight + 20
	},
	
	baseColor() {
		return '#1A7E84'
	}

}

export default common