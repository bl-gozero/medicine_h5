<template>
	<view class="page bg-page">
		<view class="user_box" :class="'pt-' + $c.barHeight()">
			<view class="flex-end plr-20">
				<image src="/static/icon/set.webp" class="i-20" @click="$c.goto('/pages/user/settings')"></image>
				<image src="/static/icon/qr.webp" class="i-20 ml-14" @click="$c.goto('/pages/user/qrcode')"></image>
			</view>
			<view v-if="$c.mode()" class="flex-center">
				<view class="relative mt-30">
					<image :src="`/static/vip/user_index/bg_level_${$c.calcLv(profile)}.webp`" class="w-351 h-126"
						mode="widthFix"></image>
					<view class="full border-box pl-25">
						<view class="flex-start" style="margin-top: -13px;">
							<view class="i-60 rounded" style="border: 2px solid #fff;background: #EAEAEA;">
								<u-avatar :src="profile.avatar" size="60" :default-url="$c.userAvatar()"></u-avatar>
							</view>
							<view class="relative">
								<view class="fs-16 u-line-1">{{ profile.account }}</view>
								
								<!-- #ifdef MP -->
								<image :src="`/static/vip/name_level_${$c.calcLv(profile)}.webp`"
									class="h-10 block absolute" style="top: 120%;" mode="heightFix"></image>
								<!-- #endif -->
								
							</view>
						</view>
						
						<!-- #ifndef MP -->
						<image :src="`/static/vip/name_level_${$c.calcLv(profile)}.webp`" class="h-14 mt-10 block"
							mode="heightFix"></image>
						<view class="fs-12 mt-10">升级成为合伙人，享永久绩效分红</view>
						<!-- #endif -->
						
					</view>
					
					<!-- #ifdef MP -->
					<view class="flex-between absolute left-20 right-20 bottom-26">
						<view class="flex-start" @click="$c.goto('/pages/user/address')">
							<image src="/static/mp/icon/address.webp" class="i-16 mr-8 block"></image>
							<text class="fs-12">我的地址</text>
						</view>
						<view class="w-98 h-30" @click="$c.goto('/pages/index/task')">
							<image v-if="is_sign === true" :src="`/static/user/signed_0.webp`" class="w-98 h-30"></image>
							<view v-if="is_sign === false" class="relative h-30">
								<view class="w-76 h-29" style="transform: scale(1.4) translate(10%, -1px);">
									<PlayImgs path="sign/1" :interval="70" :length="15" :width="76" type="webp"></PlayImgs>
								</view>
								<view class="sign_box full">签到领购物金</view>
							</view>
						</view>
					</view>
					<!-- #endif -->
					
					<!-- #ifndef MP -->
					<image src="/static/vip/user_index/center.webp" class="w-111 h-55 absolute right-0"
						style="bottom: 3%;" @click="$c.goto('/pages/user/vip')"></image>
					<!-- #endif -->
				</view>
			</view>
			<view v-else class="flex-start plr-20">
				<u-avatar :src="profile.avatar" size="80" :default-url="$c.userAvatar()"></u-avatar>
				<view class="fs-16 u-line-1 ml-15">{{ profile.account }}</view>
			</view>
			<view class="flex-between lh-10 mt-20 plr-40 border-box text-center" style="color: #064144;gap: 15px;">
				
				<!-- #ifndef MP -->
				<view v-if="$c.mode()" class="pw-30" @click="$c.goto('/pages/finance/balance')">
					<view class="fw-7 fs-22 flex-start u-line-1" style="line-height: 30px;">{{ profile.balance }}</view>
					<view class="mt-12 text-name">奖励</view>
				</view>
				<!-- #endif -->
				
				<view class="pw-30" @click="$c.goto('/pages/point/index')">
					<view class="fw-7 fs-22 flex-start u-line-1" style="line-height: 30px;">{{ profile.integral }}
					</view>
					<view class="mt-12 text-name">积分</view>
				</view>
				<view class="pw-30" @click="$c.goto('/pages/finance/subsidy')">
					<view class="fw-7 fs-22 flex-start u-line-1" style="line-height: 30px;">{{ profile.subsidy }}
					</view>
					<view class="mt-12 text-name">购物金</view>
				</view>
				
				<!-- #ifdef MP -->
				<view class="pw-30" @click="$c.goto('/pages/store/index')">
					<view class="fw-7 fs-22 flex-start u-line-1" style="line-height: 30px;">
						{{ profile.warehouse_count }}
					</view>
					<view class="mt-12 text-name">已寄存</view>
				</view>
				<!-- #endif -->
				
			</view>
			
			<!-- #ifndef MP -->
			<view class="h-120"></view>
			<!-- #endif -->
			
			<!-- #ifdef MP -->
			<view class="plr-20 mt-25">
				<view class="bg-white rounded-14 ptb-20 plr-14 border-box">
					<view class="fw-5">我的订单</view>
					<view class="flex-between mt-33 border-box">
						<view v-if="index < 3" class="text-center relative flex-1" v-for="(item, index) in orders"
							:key="index" @click="$c.goto(`/pages/order/list?status=${item.value}`)">
							<image :src="'/static/mp/icon/order-' +  (index + 1) + '.webp'" class="i-26"></image>
							<view class="mt-10 fs-12">{{ item.name }}</view>
							<u-badge :value="item.count" :absolute="true" bgColor="#FF2A40" color="#fff" max="99"
								:offset="[-5, 15]"></u-badge>
						</view>
						<view class="line"></view>
						<view v-if="index == 3" class="text-center relative flex-1" v-for="(item, index) in orders"
							:key="index" @click="$c.goto(`/pages/order/list?status=${item.value}`)">
							<image :src="'/static/mp/icon/order-' +  (index + 1) + '.webp'" class="i-26"></image>
							<view class="mt-10 fs-12">{{ item.name }}</view>
						</view>
					</view>
				</view>

				<view class="flex-between fgap-10 mt-15">
					<view class="mp-view mp-left relative" @click="$c.goto('/pages/index/task')">
						<image src="/static/user/center.webp" class="i-54 absolute top-8 right-9"></image>
						<view class="fs-16 fw-7">任务中心</view>
						<view class="fs-12 mt-5" style="color: #C0B38F;">做任务赢好礼</view>
					</view>
					<view class="mp-view mp-right relative" @click="$c.goto('/pages/user/join')">
						<image src="/static/user/invite.webp" class="i-54 absolute top-8 right-9"></image>
						<view class="fs-16 fw-7">加入北辰</view>
						<view class="fs-12 mt-5" style="color: #D3A69C;">邀好友全球代购</view>
					</view>
				</view>
				
				<view class="bg-white rounded-14 ptb-20 plr-14 border-box mt-16">
					<view class="mp-menu-list" v-for="item in mp_menus" :key="item.id">
						<view class="fw-5">{{ item.name }}</view>
						<view class="flex-start mt-23 border-box">
							<view class="pw-25 text-center" v-for="i in item.list" :key="i.id" @click="$c.goto(i.url)">
								<image :src="i.icon" class="i-16 auto-x block"></image>
								<view class="fs-12 mt-10">{{ i.name }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="h-80"></view>
			</view>
			<!-- #endif -->
		</view>
		<!-- #ifndef MP -->
		<view class="flex-1 relative" style="margin-top: -89px;z-index: 10;">
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
				<view class="rounded-8 mt-15 ptb-7 plr-10 flex-between fgap-5"
					style="background: linear-gradient(264deg, #FFD0B7 6%, #F9EBDB 44%, #FFEDE5 98%);"
					@click="$c.goto('/pages/index/task')">
					<view class="fw-7 fs-14" style="color: #733C14;">任务中心</view>
					<view class="fs-10 flex-1 u-line-1" style="color: #F68330;">参与更多活动任务，奖励多多</view>
					<view class="w-98 h-30">
						<image v-if="is_sign === true" :src="`/static/user/signed_0.webp`" class="w-98 h-30"></image>
						<view v-if="is_sign === false" class="relative h-30">
							<view class="w-76 h-29" style="transform: scale(1.4) translate(10%, -1px);">
								<PlayImgs path="sign/1" :interval="70" :length="15" :width="76" type="webp"></PlayImgs>
							</view>
							<view class="sign_box full">签到领购物金</view>
						</view>
					</view>
				</view>
				<view v-if="$c.mode()" class="">
					<view class="fw-5 mt-34">加入北辰代购</view>
					<view class="relative" @click="$c.goto('/pages/user/join')">
						<image src="/static/user/join.png" class="pw-100 mt-10 maxh-110" mode="widthFix"></image>
						<view class="absolute pw-100 left-0" style="top: 8%">
							<PlayImgs path="user/index_join/2" :interval="50" :length="40" type="webp"></PlayImgs>
						</view>
					</view>
				</view>
				<view class="fw-5 mt-23">其他</view>
				<view class="">
					<view class="border-bottom ptb-20 flex-between" v-for="item in menus" :key="item.id"
						@click="$c.goto(item.url)">
						<view class="flex-start">
							<image :src="item.icon" class="i-16"></image>
							<text class="fs-12 lh-8 ml-9">{{ item.name  }}</text>
						</view>
						<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
					</view>
					<view class="h-80"></view>
				</view>
			</view>
		</view>
		<!-- #endif -->
		<TabBar />
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue'
	import PlayImgs from '../../components/PlayImgs.vue'

	export default {
		components: {
			TabBar,
			PlayImgs
		},
		data() {
			return {
				profile: {
					...{
						level: {
							id: 1
						}
					},
					...this.$c.getStorage('profile')
				},
				orders: [{
						id: 1,
						name: '待付款',
						value: 1,
						count: 0
					},
					{
						id: 2,
						name: '待发货',
						value: 8,
						count: 0
					},
					{
						id: 3,
						name: '待收货',
						value: 3,
						count: 0
					},
					{
						id: 4,
						name: '全部订单',
						value: 0,
						count: 0
					}
				],
				menus: [{
						id: 1,
						name: '招募计划',
						icon: '/static/icon/recruit.webp',
						url: '/pages/index/recruit'
					},
					{
						id: 2,
						name: '在线客服',
						icon: '/static/icon/cs.png',
						url: '/pages/index/web'
					},
					{
						id: 3,
						name: '地址管理',
						icon: '/static/icon/address.png',
						url: '/pages/user/address'
					},
					{
						id: 4,
						name: '关于北辰',
						icon: '/static/icon/about.webp',
						url: '/pages/index/protocols?type=6'
					},
				],
				mp_menus: [
					{
						id: 1,
						name: '功能',
						list: [{
							id: 1,
							name: '积分商城',
							icon: '/static/mp/icon/mall.webp',
							url: '/pages/point/index',
							type: 1
						},
						{
							id: 2,
							name: '创客平台',
							icon: '/static/mp/icon/maker.webp',
							url: '/pages/index/maker',
							type: 1
						},
						{
							id: 3,
							name: '招募计划',
							icon: '/static/mp/icon/recruit.webp',
							url: '/pages/index/recruit',
							type: 1
						},
						{
							id: 4,
							name: '关于北辰',
							icon: '/static/mp/icon/about.webp',
							url: '/pages/index/protocols?type=6',
							type: 1
						}]
					},
					{
						id: 2,
						name: '帮助',
						list: [{
							id: 5,
							name: '在线客服',
							icon: '/static/mp/icon/cs.webp',
							url: '/pages/index/web',
							type: 2
						}]
					}
				],
				is_sign: 'no-load',
				reward: 0,
				showReward: false,
				doSign: null
			}
		},
		onLoad() {
			this.doSign = this.$c.onceRequest(this.onSign)
		},
		async onShow() {
			await this.$c.checkeLogin()
			this.getProfile()
			this.getOrderNum()
			if (this.is_sign !== true) this.getSignStatus()
		},
		methods: {
			onWithdraw() {
				this.$c.goto('/pages/finance/withdraw')
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if (res) {
					this.profile = res
					this.$c.setStorage('profile', res)
				}
			},
			async getSignStatus() {
				const res = await this.$c.fetch(this.$api.user.signStatus)
				if (res) this.is_sign = res.is_sign
			},
			async onSign() {
				const res = await this.$c.fetch(this.$api.user.signIn)
				if (res) {
					this.is_sign = true
					this.reward = res.amount
					this.showReward = true
					this.getProfile()
				}
			},
			async getOrderNum() {
				const validOrders = this.orders.filter(order => order.value > 0)
				const results = await Promise.all(
					validOrders.map(order => this.$api.goods.orderNum({
						status: order.value
					}))
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
	/* #ifndef MP */
	.user_box {
		background:
			linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 40%, #f8f8f8 100%),
			linear-gradient(270deg, #92CBCE 4%, #DBEBEB 98%);
	}
	/* #endif */
	/* #ifdef MP */
	.user_box {
		background:
			linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 40%, #f8f8f8 100%),
			linear-gradient(270deg, #FFE5C6 4%, #F9F6F4 98%);
			
	}
	/* #endif */

	.sign_box {
		font-size: 10px;
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

	.mp-view {
		border-radius: 14px;
		padding: 23px 17px;
		flex: 1;
		box-sizing: border-box;
	}
	.mp-view.mp-left {
		background: linear-gradient(180deg, #FFE7A4 0%, #FFFFFF 72%);
	}
	.mp-view.mp-right {
		background: linear-gradient(180deg, #FCD3C9 0%, #FFFFFF 68%);
	}
	.mp-menu-list:not(:first-child) {
		margin-top: 36px;
	}
</style>