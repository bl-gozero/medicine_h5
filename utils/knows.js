export function showPopup(options = {}) {
	uni.$emit('global-popup-show', options)
}

export function closePopup() {
	uni.$emit('global-popup-close')
}

export default {
	show: showPopup,
	close: closePopup
}

/*
this.$knows.show({
	bgStyle: '',
	bgClass: '',
	img: {
		src: '',
		class: ''
	},
	title: {
		text: '提示',
		class: 'p-20'
	},
	text:'当前功能仅支持 App 使用，是否前往 App？',
	buttons:[
		{
			text:'取消',
			class: 'flex-1 fs-14 border-0 w-80'
		},
		{
			text:'打开 App',
			class:'bg-base text-white flex-1 fs-14 w-100',
			click:()=>{
				this.$c.openApp()
			}
		},
		{
			text:'去下载',
			class: 'flex-1 fs-14 border-0 w-80',
			click:()=>{
				this.$c.goto('/pages/web/download')
			}
		}
	]
})
*/