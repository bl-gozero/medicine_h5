<template>
	<view class="page flex-col" style="background: linear-gradient(to bottom, #F5F6ED, #95CDD1);">
		<Title title="APP下载"/>
		<view class="flex-1 flex-center">
			<view class="text-center">
				<view class="">
					<image src="/static/common/logo_white.png" class="logo"></image>
				</view>
				<view class="mt-32">
					<image src="/static/common/logo_name.png" class="w-130 h-30"></image>
				</view>
				<view class="mt-8">加入北辰成为全球合伙人</view>
			</view>
		</view>
		<view class="relative bg">
			<image src="/static/web/download_bg.png" class="pw-100" mode="widthFix"></image>
			<view class="full flex-center">
				<view class="">
					<u-button
						class="bg-base btn fw-7 text-white w-278 h-49 border-0"
						shape="circle"
						icon="android-fill"
						iconColor="#fff"
						text="安卓版APP下载"
						@click="onDownload()"
					></u-button>
					<u-button
						v-if="show"
						class="border-1 btn fw-7 text-base w-278 h-49 mt-30"
						shape="circle"
						icon="home"
						:iconColor="$c.baseColor()"
						text="进入网页版"
						@click="$c.goto('/pages/index/index')"
					></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	
	export default {
		components: { Title },
		data() {
			return {
				downloadUrl: this.$c.url('dl'),
				show: false
			}
		},
		onLoad() {
			if(this.$c.getStorage('jwt')) this.show = true
		},
		methods: {
			onDownload() {
				window.location.href = this.downloadUrl;
			}
		}
	}
</script>

<style>
	.logo {
		width: 82.56px;
		height: 85.57px;
	}
	.btn {
		box-shadow: 0px 4px 10px 0px rgba(21, 105, 112, 0.45);
	}
</style>