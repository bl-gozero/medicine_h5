<template>
	<u-popup :show="show" mode="center" bgColor="transparent" closeable :closeOnClickOverlay="false" @close="handleClose">
		<view class="popup-box flex-center bg-white pt-20">

			<view class="flex-center" style="height: 200px;">
				<UQrcode ref="uqrcode" canvas-id="qrcode" :value="qrcodeValue" size="185" :h5DownloadName="downloadName" />
			</view>

			<view class="text-info fs-12 mt-15">
				{{ message }}
			</view>

			<button class="fw-7 lh-10 fs-14 bg-base text-white w-247 h-47 flex-center rounded-x mt-30" @click="onSave">
				保存
			</button>

		</view>
	</u-popup>
</template>

<script>
	import UQrcode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue'

	export default {
		name: 'Qrcode',
		components: {
			UQrcode
		},
		data() {
			return {
				show: false,
				qrcodeValue: '',
				message: ''
			}
		},
		computed: {
		    downloadName() {
		        const d = new Date()
		        const pad = n => String(n).padStart(2, '0')
		        return `二维码_${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
		    }
		},
		mounted() {
			uni.$on('showQrcode', this.open)
		},

		beforeDestroy() {
			uni.$off('showQrcode', this.open)
		},
		methods: {
			open(data) {
				this.qrcodeValue = data.url
				this.message = data.message || '请保存二维码或者直接使用微信扫码支付'
				this.show = true
			},
			handleClose() {
				this.show = false
				this.qrcodeValue = ''
				this.message = ''
				this.$emit('close')
			},
			onSave() {
				this.$refs.uqrcode.save({
					success: () => {
						// uni.showToast({
						// 	title: '保存成功',
						// 	icon: 'none'
						// })
					}
				})
			}
		}
	}
</script>