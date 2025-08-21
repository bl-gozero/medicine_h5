<template>
	<view v-if="isBlank" style="height: calc(var(--status-bar-height, 0px) + 20px);"></view>
	<view v-else class="title-bar" :class="{ fixed }" :style="mergedBarStyle">
		<!-- 左侧返回 -->
		<image src="/static/icon/back.png" class="icon-24" @click="goUrl()" />

		<!-- 中间标题区域 -->
		<view class="center-title">
			<text class="title-text" :style="titleStyle">{{ title }}</text>
			<text v-if="subtitle" class="subtitle-text" :style="subtitleStyle">{{ subtitle }}</text>
		</view>

		<!-- 右侧插槽 -->
		<view class="right-slot" @click="handleRightClick">
			<slot name="right"></slot>
		</view>

		<!-- 插槽设置例子 -->
		<!-- <title-bar
		  title="订单列表"
		  @rightClick="handleRightClick"
		>
		  <template v-slot:right>
		    <image src="/static/icon/filter.png" class="icon-24" />
		  </template>
		</title-bar> -->
	</view>
</template>

<script>
	export default {
		name: 'titleBar',
		props: {
			isBlank: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: ''
			},
			subtitle: {
				type: String,
				default: ''
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
			url: {
				type: String,
				default: ''
			},
			fixed: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: '' // 比如传入 '#f5f5f5'、'linear-gradient(...)' 等
			}
		},
		computed: {
			mergedBarStyle() {
				return {
					paddingTop: 'calc(var(--status-bar-height, 0px) + 20px)',
					backgroundColor: this.bgColor || '#F8F8F8', // 增加这一行，优先 bgColor
					...this.barStyle // 外部传 style 可覆盖全部
				}
			}
		},
		methods: {
			goUrl() {
				if (this.$listeners.back) {
					this.$emit('back')
				} else if (this.url) {
					this.$c.goto(this.url)
				} else {
					this.$c.goBack()
				}
			},
			handleRightClick() {
				this.$emit('rightClick')
			}
		}
	}
</script>

<style scoped>
	.title-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28px 20rpx 11px;
		position: relative;
		z-index: 10;
	}

	.title-bar.fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
	}

	.center-title {
		flex: 1;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title-text {
		font-size: 18px;
		line-height: 18px;
		color: #3d3d3d;
	}

	.subtitle-text {
		font-size: 24rpx;
		color: #888;
		margin-top: 4rpx;
	}

	.icon-24 {
		width: 48rpx;
		height: 48rpx;
	}

	.right-slot {
		min-width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>