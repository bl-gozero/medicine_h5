<template>
	<view class="page" style="background: #120E0A;">
		<Title title="新手指南" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
			:titleStyle="{ color: '#B88344' }"></Title>
		<image :src="img(i + '.webp')" class="x-100" mode="widthFix" v-for="i in 3"></image>
		<view class="h-20"></view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
			}
		},
		onLoad() {
		},
		onShow() {},
		methods: {
			img(path, root = '/static/suiyuantang/guide/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-color {
		color: #B88344 !important;
	}

	image {
		display: block;
	}
</style>