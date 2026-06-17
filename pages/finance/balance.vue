<template>
	<view class="page bg">
		<Title title="我的奖励" bgColor="transparent" />
		<view class="plr-20 mt-40 border-box">
			<view class="relative">
				<image src="/static/finance/balance_bg.webp" class="x-100" mode="widthFix"></image>
				<view class="full pb-10 border-box flex-col">
					<view class="y-30 flex-start pl-16">
						<image src="/static/finance/my_wallet.webp" class="w-73 h-22 block"></image>
					</view>
					<view class="plr-23 flex-1 flex-start">
						<view class="">
							<view class="text-title">账户结余(元）</view>
							<view class="text-danger fs-28 fw-7">{{ profile.balance }}</view>
						</view>
					</view>
					<view class="mlr-10 rounded-12 flex-between pt-8 pb-10" style="background: #EEE5E2;">
						<view class="text-center flex-1 plr-5">
							<view class="text-title">今日收入</view>
							<view class="fw-5 u-line-1">{{ profile.today_revenue || 0 }}</view>
						</view>
						<view class="text-center flex-1 plr-5">
							<view class="text-title">昨日收入</view>
							<view class="fw-5 u-line-1">{{ profile.yesterday_revenue || 0 }}</view>
						</view>
						<view class="text-center flex-1 plr-5">
							<view class="text-title">本月收入</view>
							<view class="fw-5 u-line-1">{{ profile.current_month_revenue || 0 }}</view>
						</view>
						<view class="text-center flex-1 plr-5">
							<view class="text-title">上月收入</view>
							<view class="fw-5 u-line-1">{{ profile.last_month_revenue || 0 }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-between h-57 mt-10 fgap-10">
				<view class="flex-start left flex-1 rounded-10 plr-10 ptb-12 border-box" style="background: linear-gradient(270deg, #FFFFFF 71%, #FFF0DD 100%);"
				 @click="$c.goto('/pages/finance/list')">
					<image src="/static/finance/balance_log.webp" class="i-26 mr-7"></image>
					<view class="">
						<view class="fw-5">账单明细</view>
						<view class="fs-10" style="color: rgba(98, 98, 98, 0.34);">查看全部</view>
					</view>
				</view>
				<view class="flex-start right flex-1 rounded-10 plr-10 ptb-12 border-box" style="background: linear-gradient(90deg, #FFDBDA 0%, #FFFFFF 29%);"
				 @click="$c.goto('/pages/finance/withdrawList')">
					<image src="/static/finance/balance_wlog.webp" class="i-26 mr-7"></image>
					<view class="">
						<view class="fw-5">提现明细</view>
						<view class="fs-10" style="color: rgba(98, 98, 98, 0.34);">查看全部</view>
					</view>
				</view>
			</view>
			<view class="mt-60 plr-17 bg-white rounded-9 list_box">
				<view class="ptb-22 flex-between" v-for="item in list" :key="item.id" @click="$c.goto(item.url)" >
					<view class="flex-start">
						<image :src="item.icon" class="w-27 h-26 mr-20"></image>
						<text class="fw-7">{{ item.name }}</text>
					</view>
					<image src="/static/icon/right.webp" class="w-6 h-11"></image>
				</view>
			</view>
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
				profile: this.$c.profile(),
				list: [
					// { id: 1, name: '充值', url: '/pages/finance/recharge', icon: '/static/finance/recharge.webp' },
					{ id: 2, name: '转账', url: '/pages/finance/transfer', icon: '/static/finance/balance_transfer.webp' },
					{ id: 3, name: '提现', url: '/pages/finance/withdraw', icon: '/static/finance/balance_withdraw.webp' },
				]
			}
		},
		async onShow() {
			this.profile = await this.$c.checkeLogin(1)
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		background: linear-gradient(180deg, #FFE5C6 0%, rgba(255, 229, 198, 0) 134px, #f8f8f8 134px, #f8f8f8 100%);
	}
	.text-title {
		color: #C48F84;
		font-size: 10px;
	}
</style>