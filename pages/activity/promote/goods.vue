<template>
	<view class="page bg-page">
		<Title title="商品详情" fixed />
		<view class="relative">
			<u-swiper :list="goods.picture" height="375"></u-swiper>
		</view>
		<view class="relative price_box flex-start plr-20">
			<view class="absolute top-0 right-0">
				<image src="/static/mp/goods/price_bg.webp" class="w-152 h-65"></image>
				<view class="full flex-center fs-12 border-box" style="color: #F7E7CD;">
					完成2位好友体验<br />后，即可返还押金
				</view>
			</view>
			<view class="" style="transform: translateY(-5px);">
				<view class="fs-12">
					<text class="">活动价</text>
					<text class="fs-10 fw-7 ml-3">￥</text>
					<text class="fs-24 fw-7">{{ sku.vip_price }}</text>
					<text class="mlr-16 line-through">原价 ￥{{ sku.price }}</text>
				</view>
				<text class="fs-12 fw-5 bg-white plr-3 ptb-2 rounded-4 zhuanshu">参与活动免费领</text>
			</view>
		</view>
		<view class="p-20 bg-white">
			<view class="fs-16 fw-6">{{ goods.name }}</view>
			<view class="mtb-10">{{ sku.name }}</view>
		</view>
		<view class="mt-14 bg-white">
			<view class="text-center fw-5 ptb-18">商品详情</view>
			<u--image :src="item" v-for="(item, index) in goods.details" :key="index" width="100%" height="auto"
				bgColor="transparent" mode="widthFix">
				<template v-slot:loading>
					<u-loading-icon color="#9F9F9F" class="mtb-100"></u-loading-icon>
				</template>
			</u--image>
		</view>
		<view class="h-60"></view>
		<view class="fixed h-60 bottom-0 x-100 pt-5 border-box">
			<button class="btn bg-base text-white w-300 h-39" @click="showActive = true">马上领取 激活任务</button>
		</view>

		<!-- 选购 -->
		<u-popup :show="showInfo" mode="bottom" round="14" closeable @close="showInfo = false">
			<view class="fs-12 lh-10 relative">
				<view class="flex-between types">
					<view :class="mode == 1 && 'type'" @click="mode = 1">线上邮寄</view>
					<view :class="mode == 2 && 'type'" @click="mode = 2">门店自取</view>
				</view>
				<view class="plr-20 mt-15">
					<view v-if="mode == 1" class="flex justify-between " style="align-items: flex-start;"
						@click="$c.goto('/pages/user/address?from=goodsDetail')">
						<image src="/static/goods/place.png" class="w-12 h-14"></image>
						<view v-if="address.district" class="flex-1 ml-8 mr-20">
							<view class="">{{ address.district + address.address }}</view>
							<view class="mt-15 fs-12">
								<text class="text-info">{{ address.name }}</text>
								<text class="text-info ml-20">{{ address.phone }}</text>
							</view>
						</view>
						<view v-else class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
						<u-icon name="arrow-right" size="14" color="#7D7D7D"></u-icon>
					</view>
					<view v-else class="">
						<view v-if="shop.id" class="flex-between border-bottom fgap-14 pb-18" @click="page = 2">
							<image :src="img('shop.webp')" class="i-15 self-start"></image>
							<view class="flex-1">
								<view class="fw-5 fs-14">{{ shop.name }}</view>
								<view class="text-info fs-12">
									<view class="mtb-10">地址：{{ shop.address }}</view>
									<view class="">电话：{{ shop.phone }}</view>
								</view>
							</view>
							<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start mt-2"></u-icon>
						</view>
						<view v-else class="flex-between border-bottom fgap-14 pb-18">
							<image :src="img('shop.webp')" class="i-15"></image>
							<view class="flex-1" @click="page = 2">
								<u-search placeholder="输入地址，查找附近门店" style="pointer-events: none;" placeholderColor="#9F9F9F" searchIconColor="#9F9F9F"
									searchIconSize="19" bgColor="#EBEBEB" :showAction="false" height="32" disabled></u-search>
							</view>
						</view>
						<view class="flex-start fgap-14 mt-15" @click="onUser()">
							<image :src="img('user.webp')" class="i-15 self-start mt-3"></image>
							<view class="fs-14 flex-1">{{ user.name ? `${user.name} ${user.phone}` : '请填写提货人' }}</view>
							<u-icon name="arrow-right" size="14" color="#7D7D7D"></u-icon>
						</view>
					</view>
					<view class="fs-12 p-12 border-box rounded-8 mtb-15 lh-15" style="background: #F0ECE1;color: #99935C;">
						<view class="fw-7 flex-start">
							<u-icon name="bell-fill" color="#9D9762" size="14"></u-icon>
							<text class="ml-3">温馨提示</text>
						</view>
						<view v-if="mode == 1" class="">
							<view class="">*请填写并确认详细地址及联系方式等，后续平台会按照提交时间依序发货。</view>
							<view class="">*您也可以选择最近门店，就近原则到店取货。</view>
						</view>
						<view v-else class="">*您也可以搜索所在地区的门店，选择最近门店，就近原则到店取货。完成登记后系统记录已取货。</view>
					</view>
					<view class="h-6 bg-page"></view>
					<view class="sroller-y" style="height: 40vh;">
						<view class="flex-start mt-30 mb-20">
							<image v-if="sku.picture" :src="sku.picture[0]" class="i-76 rounded-12" mode="aspectFill"></image>
							<view class="ml-9 flex-1">
								<view class="fw-7 text-danger">
									<text class="">￥</text>
									<text class="fs-18">{{ profile.level.id > 2?  sku.vip_price : sku.price }}</text>
								</view>
								<view class="flex-between mt-20">
									<u-number-box v-model="quantity" name="quantity" bgColor="#fff" iconStyle="font-size: 10px;"
										inputWidth="29" :integer="true" :asyncChange="true"
										@change="onNumChange"></u-number-box>
									<view class="text-info fs-12">
										<text class="ml-10">{{ sku.limit_quantity ? `限购${sku.limit_quantity}` : '不限购' }}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="h-6 bg-page"></view>
						<view class="">
							<view class="ptb-20">
								<view class="fs-14 fw-7">规格</view>
								<view class="flex-start mt-10 flex-wrap">
									<view class="sku_name mr-10 mt-10" :class="sku.id == item.id && 'sku_name_1'"
										v-for="(item, index) in goods.goods_sku" :key="item.id" @click="sku = item">
										{{ item.name }}
									</view>
								</view>
								<!-- <view v-if="subsidy.amount && subsidy.pay" class="mt-20 flex-between">
									<text>购物金抵扣</text>
									<text class="fw-7" style="color: #FF8F1F;">-￥{{ subsidy.amount }}</text>
								</view>
								<view v-else-if="mode == 2 && goods.is_subsidy == 1 && profile.subsidy >= 1" class="mt-20">
									<view class="flex-between fgap-20">
										<text>可用{{ profile.subsidy }}购物金抵扣</text>
										<u-input v-model.number="subsidy.amount" placeholder="输入抵扣金额" inputAlign="right"
											border="none" type="number" :formatter="priceFormatter"></u-input>
									</view>
									<view class="mt-10 text-info fs-12">购物金使用后，无法退还</view>
								</view> -->
							</view>
							<view class="h-6 bg-page"></view>
							<view class="plr-20">
								<Payment v-model="paying_mode"></Payment>
							</view>
							<button class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-30 flex-center rounded-x"
								@click="onShowPasswrod()">{{ `提交订单（￥${(profile.level.id > 2? sku.vip_price : sku.price) * quantity - (subsidy.amount || 0)}）` }}</button>
							<view class="h-30"></view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<view v-if="page == 2" class="page absolute top-0 left-0 x-100 bg-white flex-col" style="z-index: 11000;">
			<Title title="选择门店" bgColor="#fff" isBack @back="page = 1"></Title>
			<view class="flex-1 relative">
				<scroll-view scroll-y class="full p-20 border-box" @scrolltolower="">
					<u-search v-model="shop.shop_name" placeholder="输入地址，查找附近门店" placeholderColor="#9F9F9F" searchIconColor="#9F9F9F"
						searchIconSize="19" bgColor="#EBEBEB" :showAction="false" height="32"></u-search>
					<view class="flex-between fgap-7 border-bottom ptb-20" v-for="item in shops" :key="item.id" @click="onShop(item)">
						<image :src="img('shop.webp')" class="i-15 self-start mt-3"></image>
						<view class="flex-1">
							<view class="fw-5 fs-14">{{ item.name }}</view>
							<view class="text-info fs-12">
								<view class="mtb-10">地址：{{ item.address }}</view>
								<view class="">电话：{{ item.phone }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<u-popup :show="showUser" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @close="onShowPasswrod = false">
			<view class="w-308 bg-white rounded-12 p-24">
				<view class="pb-28 text-center border-bottom fs-18">填写提货人信息</view>
				<view class="flex-between ptb-11 border-bottom">
					<view class="w-70">提货人</view>
					<u-input v-model="user.name" placeholder="请输入姓名"
						clearable border="none" placeholderClass="fs-14 text-info"></u-input>
				</view>
				<view class="flex-between ptb-11 border-bottom">
					<view class="w-70">手机号</view>
					<u-input v-model="user.phone" placeholder="请输入手机号"
						clearable type="number" border="none" placeholderClass="fs-14 text-info"></u-input>
				</view>
				<view class="mt-40 flex-between">
					<button class="btn w-129 h-43 border-plain" plain @click="onUser()">取消</button>
					<button class="btn w-129 h-43 bg-base text-white" @click="onUserConfirm()">确定</button>
				</view>
			</view>
		</u-popup>

		<!-- 密码 -->
		<payPassword v-model="password" :show.sync="showPassword"
			:amount="(profile.level.id > 2? sku.vip_price : sku.price) * quantity - (subsidy.amount || 0)"
			@finish="doBuy"></payPassword>
		
		<active-popup :showActive.sync="showActive" />
	</view>
</template>

<script>
	import Payment from '@/components/Payment.vue'
	import payPassword from '@/components/payPassword.vue'
	import ActivePopup from './components/ActivePopup.vue'

	export default {
		components: {
			Payment,
			payPassword,
			ActivePopup
		},
		data() {
			return {
				showActive: false,
				page: 1,
				profile: this.$c.profile(),
				id: null,
				goods: {},
				top: this.$c.barHeight(),
				sku: {},
				address: {},
				shop: {},
				mode: 1,
				showPassword: false,
				showInfo: false,
				quantity: 1,
				paying_mode: {
					id: null,
					is_password: false
				},
				password: '',
				doBuy: null,
				orderId: null,
				subsidy: {
					show: false,
					amount: null,
					pay: 0
				},
				shops: [
					{ id: 1, name: '岁元堂门店地址名称1号店', phone: '13365659656', address: '湖北省 武汉市 某某区 某某街道 某某街详细地址' }
				],
				showUser: false,
				user: {
					name: '',
					phone: ''
				}
			}
		},
		async onLoad(p) {
			this.$c.removeStorage('address')
			const profile = await this.$c.checkeLogin(1)
			if (profile && p.id && parseInt(p.id)) {
				this.profile = profile
				this.id = parseInt(p.id)
				this.goodsDetail()
			}
			this.doBuy = this.$c.onceRequest(this.onBuy)
		},
		onShow() {
			this.addressList()
		},
		methods: {
			priceFormatter(value) {
				if (!value) return '';
				let max = Math.min(this.profile.level.id > 2 ? this.sku.vip_price : this.sku.price, this.profile.subsidy)
				let v = Math.min(max, value)
				v = v < 1 ? 1 : v
				let match = v.toString().match(/^[1-9]\d*/)
				return match ? match[0] : ''
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if (!Array.isArray(res) || res.length === 0) {
					this.address = {}
					return
				}
				const address = this.$c.getStorage('address')
				this.address = !this.address?.id || !res.some(i => i.id === address.id) ? res[0] : address
			},
			async goodsDetail() {
				const res = await this.$c.fetch(this.$api.goods.goodsDetail, {
					id: this.id
				})
				if (res) {
					this.goods = res;
					this.sku = res.goods_sku[0]
				}
			},
			async onBuy() {
				this.showPassword = false
				if (!this.orderId) {
					const res = await this.$c.fetch(this.$api.goods.orderAdd, {
						goods_sku: [{
							id: this.sku.id,
							quantity: this.quantity,
							shopping_cart_id: 0
						}],
						user_address_id: this.address.id
					})
					if (res) this.orderId = res.id
				}
				if (this.orderId) this.onPay()
			},
			async onPay() {
				this.showPassword = false
				if (!this.subsidy.pay && this.subsidy.amount) {
					const res1 = await this.$c.fetch(this.$api.goods.orderSubsidy, {
						id: this.orderId,
						amount: this.subsidy.amount,
					})
					if (!res1) return false
					this.subsidy.pay = 1
				}
				const res = await this.$c.fetch(this.$api.goods.orderPay, {
					id: this.orderId,
					paying_mode: this.paying_mode.id,
					password: this.password
				})
				if (res) {
					this.$c.payJump(res, '/pages/order/list')
					this.orderId = null
					this.showInfo = false
				}
			},
			onNumChange(e) {
				// if(this.sku.stock - this.sku.sales < e.value) {
				// 	this.$c.toast('库存不足')
				// 	this.quantity = this.sku.stock - this.sku.sales
				// 	return
				// }
				const max = this.isMax(e.value)
				this.quantity = max === false ? e.value : Math.max(max, 1)
			},
			isMax(e) {
				const limit = Number(this.sku.limit_quantity)
				const allowed = Number(this.sku.allowed_purchase_quantity)
				if(limit || allowed > -10000000) {
					const max1 = allowed > -10000000 ? Math.max(allowed, 0) : limit
					const max2 = limit ? limit : Math.max(allowed, 0)
					const max = Math.min(max1, max2)
					if (e > max) {
						this.$c.toast('已达购买上限')
						return max
					}
				}
				return false
			},
			onShowPasswrod() {
				if (!this.paying_mode.id) {
					this.$c.toast('请选择支付方式')
					return
				}
				if (!this.address?.id) {
					this.$c.toast('请先添加收货地址')
					return false
				}
				if (this.isMax(this.quantity) !== false) {
					return false
				}
				this.password = ''
				if (this.paying_mode.is_password) {
					return this.showPassword = true
				}
				this.doBuy()
			},
			onShop(item) {
				this.shop = item
				this.page = 1
			},
			img(path, mode = 0, root = '/static/avtivity/promote/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			},
			onUser() {
				this.showUser = !this.showUser
				this.showInfo = !this.showInfo
			},
			onCheckUser() {
				if (!this.user.name) {
					this.$c.toast('请输入姓名')
					return false
				}
				if (!this.user.phone) {
					this.$c.toast('请输入手机号')
					return false
				}
				return true
			},
			onUserConfirm() {
				if (this.onCheckUser()) this.onUser()
			}
		}
	}
</script>

<style>
	.price_box {
		height: 65px;
		background: linear-gradient(90deg, #EB5433 0%, #F53939 99%);
		color: #fff;
	}
	
	.zhuanshu {
		color: #B05217;
	}
	
	image {
		display: block;
	}
	
	.types > view {
		color: #838383;
		font-size: 18px;
		font-weight: 500;
		text-align: center;
		padding: 28px 0 15px;
		flex: 1;
		border: 2px solid transparent;
	}
	
	.type {
		border-bottom: 0;
		border-radius: 14px 14px 0 0;
	
		background:
			linear-gradient(180deg, #ffd294 0%, #ffffff 97%) padding-box,
			linear-gradient(180deg, #ffbe66 0%, #ff8d7200 100%) border-box;
		position: relative;
		color: #3D3D3D;
	}
	
	.type::after {
		content: '';
		position: absolute;
		background: #EA5531;
		border-radius: 6px;
		width: 67px;
		height: 3px;
		left: 0;
		right: 0;
		margin: 0 auto;
		bottom: 0;
	}
</style>