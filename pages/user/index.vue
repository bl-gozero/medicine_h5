<template>
	<view class="page">
		<view class="user_box plr-20" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between">
				<u-avatar :src="profile.avatar" size="55" :default-url="$c.userAvatar()"></u-avatar>
				<view class="flex-1 mlr-13">
					<view class="fs-16 fw-7 u-line-1">{{ profile.account }}</view>
					<image
						v-if="profile.level && profile.level.id > 2" 
						:src="$c.levelIcon(profile.level.id)" 
						class="w-45 h-18 mt-8"
					></image>
					<view v-else class="">{{ profile.level.value }}</view>
				</view>
				<image src="/static/icon/qr.webp" class="i-20" @click="$c.goto('/pages/user/qrcode')"></image>
			</view>
			<view class="flex-between lh-10 mt-47 pl-20 pr-20 border-box text-center" style="color: #064144;gap: 15px;">
				<view class="pw-30" @click="$c.goto('/pages/finance/balance')">
					<view class="fw-7 fs-22 flex-start u-line-1" style="line-height: 30px;">{{ profile.balance }}</view>
					<view class="mt-12 text-name">余额</view>
				</view>
				<view class="pw-30" @click="$c.goto('/pages/point/index')">
					<view class="fw-7 fs-22 flex-start u-line-1" style="line-height: 30px;">{{ profile.integral }}</view>
					<view class="mt-12 text-name">积分</view>
				</view>
				<view class="w-98" @click="$c.goto('/pages/index/task')">
					<view class="w-98 h-30">
						<image v-if="is_sign === true" :src="`/static/user/signed_0.webp`" class="w-98 h-30"></image>
						<!-- <image v-if="is_sign === false" :src="`/static/user/signed_1.webp`" class="w-98 h-30"></image> -->
						<view v-if="is_sign === false" class="relative h-30">
							<!-- <PlayImg
								canvas-id="sign"
								path="sign/1_"
								:count="15"
								:fps="18"
								:width="76"
								:height="29"
								style="transform: scale(1.4) translate(10%, -1px);"
							/>
							<PlayImg
								:paths="['sign/1']"
								:counts="[15]"
								:loopModes="['loop']"
								:fpsModes="[15]"
								:overallLoop="true"
								:width="76"
								:height="29"
								style="transform: scale(1.4) translate(10%, -1px);"
							/> -->
							<view class="w-76 h-29" style="transform: scale(1.4) translate(10%, -1px);">
								<PlayImgs
									path="sign/1"
									:interval="70"
									:length="15"
									:width="76"
								></PlayImgs>
							</view>
							<view class="sign_box full">签到领现金</view>
						</view>
					</view>
					<view class="mt-12 text-name">任务中心</view>
				</view>
			</view>
			<view class="h-120"></view>
		</view>
		<view class="flex-1 relative" style="margin-top: -89px;z-index: 10;">
			<view class="plr-20" @click="$c.goto('/pages/user/vip')">
				<image v-if="profile.level.id < 3" src="/static/user/check_1.png" class="pw-100 block maxh-55 block" mode="widthFix"></image>
				<image v-else-if="profile.level.id <= 4" src="/static/user/check_2.png" class="pw-100 maxh-55 block" mode="widthFix"></image>
			</view>
			<view class="bg-white roundedTop-20 pt-30 plr-20 border-box">
				<view class="flex-between" style="gap: 10px;">
					<view class="order_box flex-between pl-16" @click="$c.goto('/pages/order/list')">
						<view class="flex-1">
							<view class="fs-16 fw-7">我的订单</view>
							<view class="mt-6 text-info fs-12">查看全部</view>
						</view>
						<image src="/static/user/order.webp" class="w-37 h-41 self-start m-7 "></image>
					</view>
					<view class="store_box flex-between pl-16" @click="$c.goto('/pages/store/index')">
						<view class="flex-1">
							<view class="fs-16 fw-7">我的仓库</view>
							<view class="mt-6 text-info fs-12">查看全部</view>
						</view>
						<image src="/static/user/store.webp" class="w-37 h-41 self-start m-7"></image>
					</view>
				</view>
				<view class="fw-5 mt-34">加入北辰代购</view>
				<!-- <image src="/static/user/join.png" class="pw-100 mt-10 maxh-110" mode="widthFix" @click="$c.goto('/pages/user/join')"></image> -->
				<view class="relative" @click="$c.goto('/pages/user/join')">
					<image src="/static/user/join.png" class="pw-100 mt-10 maxh-110" mode="widthFix"></image>
					<view class="absolute pw-100 left-0" style="top: 8%">
						<PlayImgs
							path="user/index_join/2"
							:interval="50"
							:length="40"
						></PlayImgs>
					</view>
				</view>
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
			<view class="w-308 h-280 sign_reward_box rounded-20 text-center">
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
	import TabBar from '../../components/TabBar.vue'
	import PlayImg from '../../components/PlayImg.vue'
	import PlayImgs from '../../components/PlayImgs.vue'
	
	export default {
		components: {
			TabBar,
			PlayImg,
			PlayImgs
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
			this.$c.checkeLogin()
			this.getSignStatus()
			this.doSign = this.$c.onceRequest(this.onSign)
		},
		onShow() {
			this.getProfile()
			// this.getOrderNum()
			if(this.is_sign !== true) this.getSignStatus()
		},
		methods: {
			onWithdraw() {
				// this.$c.toast('功能正在开发中')
				this.$c.goto('/pages/finance/withdraw')
			},
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
		width: 98px;
		height: 30px;
		/* background-image: url('/static/user/sign.png');
		background-size: 100% 100%; */
		font-size: 12px;
		line-height: 30px;
		text-align: right;
		padding-right: 8px;
		font-weight: 500;
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
	.text-name {
		color: #586B6C;
	}
	.order_box {
		flex: 1;
		height: 75px;
		border-radius: 12px;
		background: linear-gradient(180deg, #E0EEE6 2%, rgba(240, 253, 253, 0.89) 100%);
	}
	.store_box {
		flex: 1;
		height: 75px;
		border-radius: 12px;
		background: linear-gradient(180deg, #E0E2EE 0%, rgba(240, 253, 253, 0.89) 100%);
	}
</style>