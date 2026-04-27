<template>
	<view class="page" style="background: #E03D2F;">
		<Title title="加入北辰" fixed />
		<image :src="img('/static/join/top.webp')" class="pw-100 block" mode="widthFix"></image>
		<view class="flex-center" style="margin-top: -130rpx;">
			<view class="relative">
				<image :src="img('/static/join/part_1.webp')" class="w-335 h-236 block"></image>
				<view class="absolute w-193 h-50 bottom-45 left-72" @click="$c.copy(profile.share_url)"></view>
				<view class="absolute w-153 h-16 bottom-22 left-91" @click="$c.goto('/pages/user/team')"></view>
			</view>
		</view>
		<view class="flex-center mt-15">
			<image :src="img('/static/join/part_2.webp')" class="w-335 h-520"></image>
		</view>
		<view class="line_text mt-10 text-white" @click="$c.goto('/pages/index/userService')">点击了解详细规则</view>
		<image :src="img('/static/join/bottom.png')" class="pw-100 block" mode="widthFix"></image>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';

	export default {
		components: {
			Title
		},
		data() {
			return {
				profile: this.$c.getStorage('profile') || {},
			}
		},
		onLoad() {
			this.$c.checkeLogin()
		},
		methods: {
			img(path, root = '') {
				if (!/^(https?:)?\/\//.test(path)) path = root + path
				return this.$c.img(path, 1)
			}
		}
	}
</script>

<style lang="less" scoped>
	.line_text {
		font-family: Alibaba PuHuiTi 2.0;
		font-size: 14px;
		font-weight: normal;
		line-height: 16px;
		letter-spacing: 0em;
		text-decoration: underline;
		text-underline-offset: 3px;
		font-variation-settings: "opsz" auto;
		font-feature-settings: "kern" on;
		color: #F76231;
		text-align: center;
	}
</style>