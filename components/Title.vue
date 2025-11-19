<template>
	<view class="">
		<view v-if="isBlank" style="height: calc(var(--status-bar-height, 0px) + 20px);"></view>
		<view v-else ref="bar" class="title-bar" :class="{ fixed }" :style="mergedBarStyle">
			<!-- 左侧返回 -->
			<image src="/static/icon/back.png" class="icon-24" @click="goUrl()" />

			<!-- 中间标题区域 -->
			<view class="center-title">
				<text class="title-text" :style="titleStyle">{{ title }}</text>
				<text v-if="subtitle" class="subtitle-text" :style="subtitleStyle">{{ subtitle }}</text>
			</view>

			<!-- 右侧插槽 -->
			<view class="right-slot relative" @click="handleRightClick">
				<view class="absolute top-0 right-0 ph-100 flex-end w-100">
					<slot name="right"></slot>
				</view>
			</view>
		</view>
		<view v-if="fixed && ph" :style="{ height: barHeight }"></view>
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
				default: ''
			},
			showBack: {
				type: Boolean,
				default: true,
			},
			ph: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {
				barHeight: '0px'
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
		mounted() {
			this.$nextTick(() => {
				if (this.$refs.bar) {
					this.$uGetRect('.title-bar').then(res => {
						this.barHeight = res.height + 'px'
					})
				}
			})
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
				this.$emit('right')
			}
		}
	}
</script>

<style scoped>
	.title-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 28px 20px 11px 20px;
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
		line-height: 1;
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
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		text-wrap: nowrap;
	}
</style>