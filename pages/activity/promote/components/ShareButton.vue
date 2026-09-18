<template>
	<view class="">
		<image :src="shareButton" class="w-92 h-91" @click="onShare()"></image>
	</view>
</template>

<script>
	export default {
		name: 'ShareButton',
		props: {
			promote: {
				type: Object,
				default: () => ({
					status: 0,
					num: 0,
					max: 2,
					price: '',
					income: ''
				})
			}
		},
		computed: {
			// 分享按钮图片
			shareButton() {
				if (!this.promote.status) {
					return this.img('btn-share-0.webp')
				}
				if (this.promote.count >= this.promote.max) {
					return this.img('btn-share-3.webp')
				}
				const remain = this.promote.max - this.promote.count
				return this.img(`btn-share-${remain}.webp`)
			}
		},
		methods: {
			img(path, mode = 0, root = '/static/avtivity/promote/index/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			},
			onShare() {
				// console.log(`/pages/activity/promote/qrcode?type=${this.promote.price}`)
				if (!this.promote.status) return
				this.$c.goto(`/pages/activity/promote/qrcode?type=${this.promote.price}`)
			}
		}
	}
</script>

<style>
</style>