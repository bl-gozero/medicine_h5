<template>
	<view class="page flex-col" style="background: linear-gradient(to bottom, #F5F8FF, #AEC7E5);">
		<!-- <Title title="APP下载" /> -->
		<view class="flex-1 flex-center">
			<view class="text-center">
				<image src="/static/common/logo_merchant.webp" class="i-86 block auto-x"></image>
				<view class="mt-15 fs-16 fw-5" style="color: #242424;">北辰乐购-商户端</view>
			</view>
		</view>
		<view class="relative bg">
			<image :src="img('/static/web/bottom.webp')" class="pw-100" mode="widthFix"></image>
			<view class="full flex-center">
				<view class="">
					<image :src="img('/static/web/new.webp')" class="w-200 h-20 block auto-x"></image>
					<u-button class="btn fw-7 text-white w-278 h-49 border-0 mt-40" shape="circle" icon="android-fill"
						iconColor="#fff" text="安卓版APP下载" @click="onDownload('android')"></u-button>
					<!-- <u-button class="btn fw-7 text-white w-278 h-49 border-0 mt-20" shape="circle" icon="apple-fill"
						iconColor="#fff" text="IOS版APP下载" @click="onDownload('apple')"></u-button> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'

	export default {
		components: {
			Title
		},
		data() {
			return {
			}
		},
		onLoad() {
			this.$c.removeStorage('endpoint')
		},
		methods: {
			async onDownload(e) {
				let link = ''
				if (e === 'android') link = this.$c.url('dl2')
				// 如果不是完整链接，先去拿配置
				if (!link || link.indexOf('http') === -1) {
					await this.getConfig(e)
					return
				}
				window.location.href = link
			},
			async getConfig(e) {
				const res = await this.$c.fetch(this.$api.group.config)
				if (res?.endpoint) {
					this.$c.setStorage('endpoint', res.endpoint)
					this.onDownload(e)
				}
			},
			img(path, root = '') {
				if (!/^(https?:)?\/\//.test(path)) path = root + path
				return this.$c.img(path, 0)
			}
		}
	}
</script>

<style>
	.btn {
		box-shadow: 0px 4px 10px 0px rgba(51, 89, 178, 0.45);
		background: #386AF4;
	}
	.text-bottom {
		font-size: 20px;
		font-family: DingTalk JinBuTi;
		line-height: 16px;
		color: #3D6DF3;
		font-variation-settings: "opsz" auto;
		font-feature-settings: "kern" on;
	}
</style>