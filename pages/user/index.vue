<template>
	<view class="page">
		<view class="user_box plr-20" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between">
				<view class="relative">
					<u-avatar :src="profile.avatar" size="55" default-url="/static/user/avatar.png"></u-avatar>
					<image 
						v-if="profile.level && profile.level.id == 3" 
						src="/static/user/vip.png" 
						class="w-49 h-18 absolute top-50 left-0 right-0 auto-x"
					></image>
					<image 
						v-else-if="profile.level && profile.level.id == 4" 
						src="/static/user/partner.png" 
						class="w-49 h-18 absolute top-50 left-0 right-0 auto-x"
					></image>
				</view>
				<view class="flex-1 mlr-15">
					<view class="fs-16 fw-7 u-line-1">{{ profile.account }}</view>
					<view class="mt-13 flex-start">
						<image src="/static/user/scan.png" class="i-11"></image>
						<view class="flex-start ml-3" @click="$c.goto('/pages/user/qrcode')">
							<text class="fs-12 lh-8">我的二维码</text>
							<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
						</view>
					</view>
				</view>
				<view v-if="is_sign === false" class="sign_box" @click="doSign">签到领现金</view>
				<view v-if="is_sign === true" class="sign_box" style="color: #AD8246;">今日已签到</view>
			</view>
			<view class="flex-between fs-12 mt-26" style="color: #71989B;">
				<view class="">钱包余额</view>
				<view class="flex-start ml-3" @click="$c.goto('/pages/finance/list')">
					<text class="fs-12 lh-8">查看明细</text>
					<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
				</view>
			</view>
			<view class="flex-between">
				<text class="fw-7 fs-32" style="color: #064144;">{{ profile.balance }}</text>
				<view class="flex-end">
					<button 
						class="bg-base-change fw-7 fs-10 text-white w-46 h-23 rounded-x plr-0"
						@click="$c.goto('/pages/finance/recharge')"
					>充值</button>
					<button
						class="bg-base-change fw-7 fs-10 text-white w-46 h-23 rounded-x ml-7 plr-0"
						@click="$c.toast('功能正在开发中')"
					>提现</button>
				</view>
			</view>
			<view class="h-120"></view>
		</view>
		<view class="flex-1 relative" style="margin-top: -89px;z-index: 10;">
			<view class="plr-20" @click="$c.goto('/pages/user/vip')">
				<image v-if="profile.level.id < 3" src="/static/user/check_1.png" class="pw-100 block" mode="widthFix"></image>
				<image v-else-if="profile.level.id <= 4" src="/static/user/check_1.png" class="pw-100 block" mode="widthFix"></image>
			</view>
			<view class="bg-white roundedTop-20 pt-24 plr-20 border-box">
				<view class="fw-5">我的订单</view>
				<view class="flex-between mt-33 border-box">
					<view
						v-if="index < 3"
						class="text-center relative flex-1"
						v-for="(item, index) in orders"
						:key="index"
						@click="$c.goto(`/pages/order/list?status=${item.value}`)"
					>
						<image :src="'/static/user/order-' +  (index + 1) + '.png'" class="i-26"></image>
						<view class="mt-10 fs-12">{{ item.name }}</view>
						<u-badge
							:value="item.count"
							:absolute="true"
							bgColor="#FF2A40"
							color="#fff"
							max="99"
							:offset="[-5, 15]"
						></u-badge>
					</view>
					<view class="line"></view>
					<view
						v-if="index == 3"
						class="text-center relative flex-1"
						v-for="(item, index) in orders"
						:key="index"
						@click="$c.goto(`/pages/order/list?status=${item.value}`)"
					>
						<image :src="'/static/user/order-' +  (index + 1) + '.png'" class="i-26"></image>
						<view class="mt-10 fs-12">{{ item.name }}</view>
					</view>
				</view>
				<view class="fw-5 mt-34">加入北辰代购</view>
				<image src="/static/user/join.png" class="pw-100 mt-10" mode="widthFix" @click="$c.goto('/pages/user/join')"></image>
				<view class="fw-5 mt-23">其他</view>
				<view class="">
					<view class="border-bottom ptb-20 flex-between" @click="$c.goto('/pages/index/web')">
						<view class="flex-start">
							<image src="/static/icon/cs.png" class="i-16"></image>
							<text class="fs-12 lh-8 ml-9">在线客服</text>
						</view>
						<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
					</view>
					<view class="border-bottom ptb-20 flex-between" @click="$c.goto('/pages/user/address')">
						<view class="flex-start">
							<image src="/static/icon/address.png" class="i-16"></image>
							<text class="fs-12 lh-8 ml-9">地址管理</text>
						</view>
						<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
					</view>
					<view class="ptb-20 flex-between"  @click="$c.goto('/pages/user/settings')">
						<view class="flex-start">
							<image src="/static/icon/settings.png" class="i-16"></image>
							<text class="fs-12 lh-8 ml-9">设置</text>
						</view>
						<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
					</view>
					<view class="h-80"></view>
				</view>
			</view>
		</view>
		<TabBar />
		
		<u-popup :show="showReward" mode="center" bgColor="transparent" @close="showReward = false;">
			<view class="w-308 h-280 reward_box rounded-20 text-center">
				<image src="/static/user/sign_reward.png" class="w-113 h-107" style="margin-top: -53px;"></image>
				<view class="fw-7 fs-18 mt-20 text-base">签到成功</view>
				<view class="mt-9 fs-12" style="color: #8B9E9F;">真棒！请保持每天签到哦！</view>
				<view class="fs-16 mt-10">恭喜您获得<text class="fs-36 fw-7 text-danger">{{ reward }}</text>元</text></view>
				<button
					class="bg-black bold fs-16 flex-center text-white w-234 h-51 rounded-x mt-20"
					@click="showReward = false;"
				>知道了</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue';
	export default {
		components: {
			TabBar
		},
		data() {
			return {
				profile: {...{ level: {id: 1} }, ...this.$c.getStorage('profile') },
				orders: [
					{ id: 1, name: '待付款', value: 1, count: 0 },
					{ id: 2, name: '待发货', value: 2, count: 0 },
					{ id: 3, name: '待收货', value: 3, count: 0 },
					{ id: 4, name: '全部订单', value: 0, count: 0 }
				],
				is_sign: 'no-load',
				reward: 0,
				showReward: false,
				doSign: null
			}
		},
		onLoad() {
			this.getSignStatus()
			this.doSign = this.$c.onceRequest(this.onSign)
		},
		onShow() {
			this.getProfile()
			this.getOrderNum()
		},
		methods: {
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.profile = res
					this.$c.setStorage('profile', res)
				}
			},
			async getSignStatus() {
				const res = await this.$c.fetch(this.$api.user.signStatus)
				if(res) this.is_sign = res.is_sign
			},
			async onSign() {
				const res = await this.$c.fetch(this.$api.user.signIn)
				if(res) {
					this.is_sign = true
					this.reward = res.amount
					this.showReward = true
					this.getProfile()
				}
			},
			async getOrderNum() {
				const validOrders = this.orders.filter(order => order.value > 0)
				const results = await Promise.all(
					validOrders.map(order => this.$api.goods.orderNum({ status: order.value }))
				)
				results.forEach((res, index) => {
					const orderId = validOrders[index].id
					const target = this.orders.find(order => order.id === orderId)
					if (target) {
						target.count = res.count
					}
				})
			}
		}
	}
</script>

<style>
	.user_box {
		background-image: url('/static/user/bg.png');
		background-size: 100% 100%;
	}
	.sign_box {
		width: 119px;
		height: 36px;
		background-image: url('/static/user/sign.png');
		background-size: 100% 100%;
		font-size: 12px;
		line-height: 36px;
		text-align: right;
		padding-right: 12px;
	}
	.reward_box {
		background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);
	}
	.fw-5 { 
		font-weight: 600;
	}
	.line {
		border-top: 1px solid #D8D8D8;
		transform: rotate(90deg);
		width: 34px;
		height: 0px;
	}
</style>