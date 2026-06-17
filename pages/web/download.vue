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
					<u-button class="bg-base btn fw-7 text-white w-278 h-49 border-0" shape="circle" icon="android-fill"
						iconColor="#fff" text="安卓版APP下载" @click="onDownload()"></u-button>
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
				downloadUrl: this.$c.url('dl'),
				show: false
			}
		},
		onLoad(p) {
			if (p?.show) this.show = true
		},
		methods: {
			onDownload() {
				window.location.href = this.downloadUrl;
			}
		}
	}
</script>

<style>
	.btn {
		box-shadow: 0px 4px 10px 0px rgba(21, 105, 112, 0.45);
	}
</style>