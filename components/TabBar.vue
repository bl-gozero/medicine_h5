<template>
	<view class="tabbar flex-evenly">
		<view v-for="(item, index) in tabs" class="flex-center flex-1" :key="index" @click="switchTab(item)">
			<view class="text-center">
				<image class="i-22 block auto-x" :src="current === item.pagePath ? item.selectedIconPath : item.iconPath" mode="aspectFit" />
				<view class="tab-text" :class="current === item.pagePath && 'text-base'">{{ item.text }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// #ifdef MP
				tabs: [{
						text: '首页',
						pagePath: '/pages/index/index',
						iconPath: '/static/mp/tabbar/home.webp',
						selectedIconPath: '/static/mp/tabbar/home_active.webp',
					},
					{
						text: '购物车',
						pagePath: '/pages/goods/cart',
						iconPath: '/static/mp/tabbar/cart.webp',
						selectedIconPath: '/static/mp/tabbar/cart_active.webp',
					},
					{
						text: '聊天',
						pagePath: '/pages/group/index',
						iconPath: '/static/mp/tabbar/group.webp',
						selectedIconPath: '/static/mp/tabbar/group_active.webp',
					},
					{
						text: '我的',
						pagePath: '/pages/user/index',
						iconPath: '/static/mp/tabbar/user.webp',
						selectedIconPath: '/static/mp/tabbar/user_active.webp',
					}
				],
				// #endif
				// #ifndef MP
				tabs: [{
						text: '首页',
						pagePath: '/pages/index/index',
						iconPath: '/static/tabbar/home.png',
						selectedIconPath: '/static/tabbar/home_active.png',
					},
					{
						text: '购物车',
						pagePath: '/pages/goods/cart',
						iconPath: '/static/tabbar/cart.png',
						selectedIconPath: '/static/tabbar/cart_active.png',
					},
					{
						text: '聊天',
						pagePath: '/pages/group/index',
						iconPath: '/static/tabbar/group.png',
						selectedIconPath: '/static/tabbar/group_active.png',
					},
					{
						text: '我的',
						pagePath: '/pages/user/index',
						iconPath: '/static/tabbar/user.png',
						selectedIconPath: '/static/tabbar/user_active.png',
					}
				],
				// #endif
				current: ''
			}
		},
		mounted() {
			this.setCurrentPath()
		},
		methods: {
			setCurrentPath() {
				const pages = getCurrentPages()
				if(pages.length) {
					const currentPage = pages[pages.length - 1]
					this.current = '/' + currentPage.route
				}
			},
			switchTab(item) {
				if (item.pagePath !== this.current) {
					this.$c.goto(item.pagePath)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.tabbar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		z-index: 999;
		box-shadow: 0px -6px 20px 0px rgba(0, 0, 0, 0.0392);
	}

	.tab-text {
		display: block;
		margin-top: 5px;
		font-size: 10px;
		line-height: 10px;
		font-size: 400;
		color: #999999;
	}
</style>