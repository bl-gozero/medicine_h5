<template>
	<!-- #ifndef MP -->
	<view class="page bg flex-center">
		<image src="/static/launch/launch_logo.png" class="i-150"></image>
	</view>
	<!-- #endif -->
	<!-- #ifdef MP -->
	<image src="/static/mp/launch/mp.webp" class="pw-100" mode="widthFix"></image>
	<!-- #endif -->
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: {
			Title
		},
		data() {
			return {
				top: 0,
				id: 0,
				order: {},
				showPassword: false,
				password: '',
				cateList: [{ id: 4, value: '奖励' }],
				paying_mode: '',
				doPay: null
			}
		},
		onLoad(p) {
			setTimeout(() => {
				this.$c.goto('/pages/index/login')
			}, 2000)
		},
		onShow() {
		},
		methods: {
		}
	}
</script>

<style>
	.bg {
		background-image: url('/static/launch/bg.jpg');
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
</style>