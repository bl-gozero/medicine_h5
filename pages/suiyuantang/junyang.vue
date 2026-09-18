<template>
	<view class="page" style="background: #120E0A;">
		<Title title="菌养" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
			:titleStyle="{ color: '#B88344' }"></Title>
		<image :src="img('index-1.webp')" class="x-100" mode="widthFix"></image>
		<view class="relative">
			<image :src="img('index-2.webp')" class="x-100" mode="widthFix"></image>
			<view class="full border-box flex-center">
				<view class="x-23 y-100" v-for="i in 4" :key="i" @click="onClick(i)"></view>
			</view>
		</view>
		<image :src="img('index-3.webp')" class="x-100" mode="widthFix" @click="onClick(5)"></image>
		<image :src="img('index-4.webp')" class="x-100" mode="widthFix" @click="onClick(6)"></image>
		<image :src="img('index-5.webp')" class="x-100" mode="widthFix" @click="onClick(7)"></image>
		<view class="relative">
			<image :src="img('index-6.webp')" class="x-100" mode="widthFix"></image>
			<view class="full border-box flex-between" style="padding: 3% 5% 0 4%;">
				<view class="x-22 y-84" v-for="i in 4" :key="i" @click="onClick()"></view>
			</view>
		</view>
		<view class="h-20"></view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				links: {
					1: '/pages/suiyuantang/agreementUpload',
					2: '/pages/suiyuantang/scanInput',
					3: '/pages/suiyuantang/grow',
					4: '/pages/suiyuantang/guide',
					5: '/pages/suiyuantang/sellList',
					6: '/pages/suiyuantang/index',
					7: '/pages/goods/category?goods_nation_id=20'
				}
			}
		},
		onLoad() {
			this.$c.checkeLogin()
		},
		onShow() {},
		methods: {
			onClick(i) {
				if (i && this.links?.[i]) {
					this.$c.goto(this.links?.[i])
				} else if (i) {
					this.$c.toast('菌养功能将于9月15日完成更新优化并正式上线')
				} else {
					this.$c.toast('近期开放')
				}
			},
			img(path, mode = 0, root = '/static/suiyuantang/junyang/') {
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