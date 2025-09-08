<template>
	<view class="page bg-white">
		<view class="top_box pb-45">
			<Title title="提交订单" bgColor="transparent"></Title>
			<view class="mt-64 text-center">
				<view class="fw-7 text-base">
					<text class="fs-16">￥</text>
					<text class="fs-36">99</text>
				</view>
				<view class="mt-13 text-info">创建群聊会费</view>
			</view>
		</view>
		<view class="h-10 bg-page"></view>
		<view class="plr-20">
			<view class="mt-20 fs-14 fw-7">支付方式</view>
			<view class="mt-15">
				<view class="flex-between ptb-13" v-for="item in cateList" :key="item.id" @click="paying_mode = item.id">
					<view class="flex-start">
						<image :src="`/static/pay/icon/${item.id}.png`" class="i-18 mr-10"></image>
						<text>{{ item.value }}</text>
					</view>
					<u-icon v-if="paying_mode == item.id" name="checkmark-circle-fill" :color="$c.baseColor()" size="20"></u-icon>
					<view v-else class="circle"></view>
				</view>
			</view>
		</view>
		<view class="absolute left-0 bottom-25 pw-100">
			<u-button
				class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white"
				shape="circle"
				text="立即支付￥99"
				@click=""
			></u-button>
		</view>
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
				cateList: [{ id: 4, value: '余额' }],
				paying_mode: 0
			}
		},
		onLoad() {
		},
		onShow() {
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.top_box {
		background: linear-gradient(180deg, #CDEAEB 0%, #FFFFFF 120px);
	}
</style>