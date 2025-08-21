<template>
	<view class="page bg flex-center">
		<image src="/static/launch/launch_logo.png" class="i-150"></image>
	</view>
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
				cateList: [{ id: 4, value: '余额' }],
				paying_mode: '',
				doPay: null
			}
		},
		onLoad(p) {
			setTimeout(() => {
				this.$c.goto('/pages/index/index')
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