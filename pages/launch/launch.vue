<template>
	<!-- #ifndef MP -->
	<!-- <view class="page bg flex-center">
		<image src="/static/launch/launch_logo.png" style="width: 150px;height: 150px;"></image>
	</view> -->
	<!-- #endif -->
	<!-- #ifdef MP -->
	<!-- <image src="/static/mp/launch/mp.webp" class="x-100" mode="widthFix"></image> -->
	<!-- #endif -->
	<image src="/static/mp/launch/mp.webp" class="x-100" mode="widthFix"></image>
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
		background-image: url('/static/launch/bg.webp');
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
</style>