<template>
	<view class="sell-box border-box plr-16 fs-12">
		<view v-if="!submited" class="relative auto-x" style="transform: translateY(-50%);z-index: 10;">
			<image :src="img('bg-title.webp')" class="w-203 h-45 auto-x"></image>
			<view class="flex-center fs-16 fw-7 full">售卖申请</view>
		</view>
		<view class="flex-between ptb-15">
			<view class="flex-start">
				<image :src="img('num.webp')" class="i-19"></image>
				<text class="fs-14 ml-7">出售数量</text>
			</view>
			<view class="">1</view>
		</view>
		<view class="flex-between ptb-15 sell-bottom">
			<view class="flex-start">
				<image :src="img('code.webp')" class="i-19"></image>
				<text class="fs-14 ml-7">培育编号</text>
			</view>
			<view class="">{{ info.barcode || '-'}}</view>
		</view>
		<view class="ptb-15 sell-bottom">
			<view class="flex-between">
				<view class="flex-start">
					<image :src="img('money.webp')" class="i-19"></image>
					<text class="fs-14 ml-7">出售价格</text>
				</view>
				<view class="">¥5,000.00/个</view>
			</view>
			<view class="text-right mt-3 fs-10" style="color: #E0B321;">以公司最终检测结果为准</view>
		</view>
		<view class="ptb-15 sell-bottom">
			<view class="flex-between">
				<view class="flex-start">
					<image :src="img('fee.webp')" class="i-19"></image>
					<text class="fs-14 ml-7">服务费用</text>
				</view>
				<view class="">¥1,000.00</view>
			</view>
			<view class="text-right mt-3 fs-10" style="color: #E0B321;">含检测费、仓储费、物流服务费等</view>
		</view>
		<view v-if="submited" class="">
			<view class="ptb-15 sell-bottom">
				<view class="flex-between">
					<view class="flex-start">
						<image :src="img('file.webp')" class="i-19"></image>
						<text class="fs-14 ml-7">出售协议</text>
					</view>
					<view class="">我已阅读并同意</view>
				</view>
				<view class="text-right mt-3 fs-10 underline" style="color: #E0B321;">《岁元堂培育(太岁)出售协议》</view>
			</view>
			<view class="ptb-15 sell-bottom">
				<view class="flex-between">
					<view class="flex-start">
						<image :src="img('time.webp')" class="i-19"></image>
						<text class="fs-14 ml-7">申请时间</text>
					</view>
					<view class="">{{ info.created_at || '-' }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'SellInfo',
		props: {
			submited: {
				type: Boolean,
				default: false
			},
			info: {
				type: Object,
				default: () => ({})
			}
		},
		methods: {
			img(path, root = '/static/suiyuantang/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.sell-bottom {
		border-top: 1px solid #342D24;
	}
	image {
		display: block;
	}
</style>