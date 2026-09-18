<template>
	<view class="page">
		<view class="relative">
			<image :src="img('1.webp')" class="x-100" mode="widthFix"></image>
			<view class="absolute top-0 left-0 x-100">
				<Title title="退款服务" bgColor="transparent"></Title>
			</view>
		</view>
		<image :src="img('2.webp')" class="x-100" mode="widthFix"></image>
		<image :src="img('3.webp')" class="x-100" mode="widthFix"></image>
		<image :src="img('4.webp')" class="x-100" mode="widthFix"></image>
		<view class="h-60 mt-10">
			<button class="w-224 h-43 btn bg-base fs-14 fw-7 text-white" @click="$c.goto('/pages/group/index')">跳转到聊天页面</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
			img(path, mode = 0, root = '/static/refund/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}
</style>