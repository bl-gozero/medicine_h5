<template>
	<view class="page flex-col" style="background: linear-gradient(to bottom, #FFFAF3, #FFEBD6);">
		<Title title="APP下载" />
		<view class="flex-1 flex-center">
			<view class="text-center">
				<image src="/static/common/logo_mall_white.webp" class="i-100 block auto-x"></image>
				<image src="/static/common/mall_name_py.webp" class="w-115 h-37 block auto-x mt-10"></image>
				<view class="mt-10" style="color: #4A4A4A;">拓展新零售·购物新体验</view>
			</view>
		</view>
		<view class="relative bg">
			<image :src="$c.img('/static/web/bottom.webp', 0)" class="x-100" mode="widthFix"></image>
			<view class="full flex-center">
				<view class="">
					<u-button v-if="isAndroid" class="bg-base btn fw-7 text-white w-278 h-49 border-0" shape="circle" icon="android-fill"
						iconColor="#fff" text="安卓版APP下载" @click="onDownload()"></u-button>
					<u-button v-if="isIOS" class="bg-base btn fw-7 text-white w-278 h-49 border-0 mt-30" shape="circle" icon="apple-fill"
						iconColor="#fff" text="IOS版APP下载" @click="onDownload()"></u-button>
					<u-button v-if="show" class="border-1 btn fw-7 text-base w-278 h-49 mt-30" shape="circle"
						icon="home" :iconColor="$c.baseColor()" text="进入网页版"
						@click="$c.goto('/pages/index/index')"></u-button>
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
				show: false,
				isIOS: false,
				isAndroid: false,
				isWx: false
			}
		},
		onLoad(p) {
			if (p?.show) this.show = true
			this.$c.removeStorage('endpoint')
			const ua = navigator.userAgent.toLowerCase()
			this.isIOS = /iphone|ipad|ipod/.test(ua)
			this.isAndroid = /android/.test(ua)
			this.isWx = /micromessenger/.test(ua)
		},
		methods: {
			async onDownload() {
				if (this.isWx) {
					uni.showModal({
						title: '提示',
						content: '请点击右上角，在浏览器中打开后下载',
						showCancel: false
					})
					return
				}
				let link = ''
				if (this.isAndroid) {
					link = this.$c.url('dl')
					if (link && link.indexOf('http') === -1) {
						await this.getConfig(e)
						return
					}
				}
				if (this.isIOS) link = this.$c.url('dl3')
				if (link) window.location.href = link
			},
			async getConfig(e) {
				const res = await this.$c.fetch(this.$api.group.config)
				if (res?.endpoint) {
					this.$c.setStorage('endpoint', res.endpoint)
					this.onDownload(e)
				}
			},
		}
	}
</script>

<style>
	.btn {
		box-shadow: 0px 4px 10px 0px rgba(21, 105, 112, 0.45);
	}
</style>