<template>
	<view v-if="isBlank" :class="'h-' + $c.barHeight()"></view>
	<view v-else class="navbar-wrapper">

		<!-- 占位 -->
		<view v-if="fixed && ph" :style="{ height: totalHeight + 'px' }"></view>

		<!-- navbar -->
		<view class="navbar" :class="{ fixed }" :style="{ height: totalHeight + 'px' }">

			<!-- 背景层 -->
			<view class="navbar-bg" :style="bgStyle"></view>

			<!-- 状态栏 -->
			<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

			<!-- 导航内容 -->
			<view class="nav-content" :style="{ height: navHeight + 'px' }">

				<!-- 左侧 -->
				<view class="nav-left">
					<image v-if="showBack" src="/static/icon/back.png" class="icon" @click="goUrl" />
				</view>

				<!-- 标题（绝对居中） -->
				<view v-if="!onlyBack" class="nav-title">
					<text class="title-text" :style="titleStyle">
						{{ title }}
					</text>

					<text v-if="subtitle" class="subtitle-text" :style="subtitleStyle">
						{{ subtitle }}
					</text>
				</view>

				<!-- 右侧 -->
				<view v-if="!onlyBack" class="right-slot relative" :class="hasRightSlot ? ('mr-' + rightSafe) : ''" @click="handleRightClick">
					<view class="absolute top-0 right-0 y-100 flex-center text-nowrap">
						<slot name="right"></slot>
					</view>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		name: "titleBar",

		props: {
			title: String,
			subtitle: String,
			bgColor: {
				type: String,
				default: "#F8F8F8"
			},
			titleStyle: {
				type: Object,
				default: () => ({})
			},
			subtitleStyle: {
				type: Object,
				default: () => ({})
			},
			barStyle: {
				type: Object,
				default: () => ({})
			},
			url: String,
			fixed: Boolean,
			showBack: {
				type: Boolean,
				default: true
			},
			ph: {
				type: Boolean,
				default: true
			},
			isBlank: {
				type: Boolean,
				default: false
			},
			isBack: {
				type: Boolean,
				default: false
			},
			onlyBack: {
				type: Boolean,
				default: false
			}
		},

		data() {
			return {
				statusBarHeight: 0,
				navHeight: 44,
				rightSafe: 0
			}
		},

		computed: {
			totalHeight() {
				return this.statusBarHeight + this.navHeight
			},

			bgStyle() {
				return 'background-color: ' + this.bgColor + ';height: ' + this.totalHeight + "px"
			},
			
			hasRightSlot() {
				return !!this.$slots.right
			}
		},

		created() {
			const sys = uni.getSystemInfoSync()

			this.statusBarHeight = sys.statusBarHeight || 20

			// 微信小程序胶囊适配
			// #ifdef MP-WEIXIN
			const menu = uni.getMenuButtonBoundingClientRect()

			this.navHeight =
				menu.height +
				(menu.top - this.statusBarHeight) * 2
				
			this.rightSafe = menu.width + 16
			// #endif
		},

		methods: {
			goUrl() {
				// console.log(this.$listeners)
				if (this.isBack) {
					this.$emit("back")
				} else if (this.url) {
					this.$c.goto(this.url)
				} else {
					this.$c.goBack()
				}
			},

			handleRightClick() {
				this.$emit("rightClick")
				this.$emit("right")
			}
		}
	}
</script>

<style scoped>
	.navbar-wrapper {
		width: 100%;
	}

	.navbar {
		width: 100%;
		left: 0;
		top: 0;
		position: relative;
		z-index: 100;
	}

	.navbar.fixed {
		position: fixed;
	}

	.navbar-bg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}

	.status-bar {
		width: 100%;
	}

	.nav-content {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.nav-left {
		width: 80rpx;
		display: flex;
		align-items: center;
	}

	.nav-right {
		width: 80rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.nav-title {
		/* position: absolute;
		left: 0;
		right: 0; */
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		pointer-events: none;
	}

	.title-text {
		font-size: 18px;
		color: #333;
		font-weight: 500;
	}

	.subtitle-text {
		font-size: 24rpx;
		color: #888;
		margin-top: 4rpx;
	}

	.icon {
		width: 48rpx;
		height: 48rpx;
	}
	
	.right-slot {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		text-wrap: nowrap !important;
	}
</style>