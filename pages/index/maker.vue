<template>
	<view class="page" style="background: #F3F6FF;">
		<view class="relative">
			<image :src="$c.img('/static/user/maker/part_1.webp')" class="x-100 block" mode="widthFix"></image>
			<view class="absolute top-0 left-0 x-100">
				<Title title="创客平台" bgColor="transparent" />
			</view>
			<view class="flex-center fgap-7 absolute left-0 bottom-5 x-100">
				<image :src="$c.img('/static/user/maker/1.webp')" class="w-107 h-74 block"></image>
				<image :src="$c.img('/static/user/maker/2.webp')" class="w-107 h-74 block"
					@click="$c.goto('/pages/index/protocols?type=5')"></image>
				<image :src="$c.img('/static/user/maker/3.webp')" class="w-107 h-74 block"
					@click="$c.goto('/pages/index/protocols?type=4')"></image>
			</view>
		</view>
		<image :src="$c.img('/static/user/maker/part_2.webp')" class="x-100 block" mode="widthFix"></image>
		<button class="fs-16 fw-5 w-335 h-46 flex-center rounded-8 text-white mt-47 auto-x"
			style="background: #387FFD;">入驻平台</button>
		<view class="h-30"></view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	export default {
		components: {
			Title
		},
		data() {
			return {}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
</style>