<template>
	<view :id="qrId" :style="{ width: size + 'px', height: size + 'px' }"></view>
</template>

<script>
	export default {
		name: 'u-qrcode',
		props: {
			text: {
				type: String,
				required: true
			},
			size: {
				type: Number,
				default: 150
			},
			colorDark: {
				type: String,
				default: '#000000'
			},
			colorLight: {
				type: String,
				default: '#ffffff'
			},
			qrId: {
				type: String,
				default: () => 'qrcode_' + Math.floor(Math.random() * 100000)
			}
		},
		mounted() {
			this.$nextTick(() => {
				this.loadQRCode(() => {
					const QR = (typeof window !== 'undefined' ? window.QRCode : global.QRCode)
					if (!QR) {
						console.error('QRCode 未加载')
						return
					}

					const el = document.getElementById(this.qrId)
					if (!el) return

					el.innerHTML = '' // 清空旧二维码
					new QR(el, {
						text: this.text,
						width: this.size,
						height: this.size,
						colorDark: this.colorDark,
						colorLight: this.colorLight,
						correctLevel: QR.CorrectLevel.H
					})
				})
			})
		},
		methods: {
			loadQRCode(callback) {
				// 已经加载过
				if ((typeof window !== 'undefined' && window.QRCode) || (typeof global !== 'undefined' && global.QRCode)) {
					callback && callback()
					return
				}

				// 动态加载
				const script = document.createElement('script')
				script.src = '/static/js/qrcode.js' // 请确保 qrcode.js 放在 static/js/
				script.onload = () => callback && callback()
				document.body.appendChild(script)
			}
		}
	}
</script>

<style scoped>
	/* 可选样式 */
</style>