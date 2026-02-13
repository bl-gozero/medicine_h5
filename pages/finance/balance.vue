<template>
	<view class="page bg-page bg">
		<Title title="我的奖励" bgColor="transparent" />
		<view class="plr-20 mt-40">
			<view class="balance_box bg-white rounded-8">
				<view class="pt-44 plr-25 pb-60 border-bottom bg-1 roundedTop-8">
					<view class="text-info fs-12">钱包奖励（元）</view>
					<view class="mt-20 fs-32 fw-7">{{ profile.balance }}</view>
				</view>
				<view class="flex-between h-57">
					<view class="flex-center left flex-1" @click="$c.goto('/pages/finance/list')">
						<view class="flex-start">
							<image src="/static/finance/balance_icon.webp" class="i-16"></image>
							<view class="ml-4">账单明细</view>
						</view>
					</view>
					<view class="line"></view>
					<view class="flex-center right flex-1" @click="$c.goto('/pages/finance/withdrawList')">
						<view class="flex-start">
							<image src="/static/finance/withdraw_icon.webp" class="i-16"></image>
							<view class="ml-4">提现明细</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mt-60 plr-17 bg-white rounded-9 list_box">
				<view 
					class="ptb-22 flex-between" 
					v-for="item in list" 
					:key="item.id"
					@click="$c.goto(item.url)"
				>
					<view class="flex-start">
						<image :src="item.icon" class="w-21 h-20 mr-20"></image>
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
					{ id: 2, name: '转账', url: '/pages/finance/transfer', icon: '/static/finance/transfer.webp' },
					{ id: 3, name: '提现', url: '/pages/finance/withdraw', icon: '/static/finance/withdraw.webp' },
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

<style>
	.bg {
		background-image: url('/static/finance/balance.webp');
		background-size: 100% auto;
		background-position: top;
		background-repeat: no-repeat;
	}
	.bg-1 {
		background: linear-gradient(180deg, #EBFEFF 0%, rgba(239, 254, 255, 0) 44px);
	}
	.line {
		width: 1px;
		background: #D8D8D8;
		height: 57px;
	}
	.balance_boxs .border-bottom {
		border-bottom: 1px solid #D8D8D8;
	}
</style>