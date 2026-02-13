<template>
	<view class="page bg-page">
		<view class="relative">
			<u-swiper :list="goods.picture" height="375"></u-swiper>
			<view class="">
				<image src="/static/goods/back.png" class="i-24 absolute left-20" :class="`top-${top}`" @click="$c.goBack()"></image>
				<!-- <image src="/static/goods/cart.png" class="i-24 absolute right-20" :class="`top-${top}`" @click="$c.goto('/pages/goods/cart')"></image> -->
			</view>
		</view>
		<view class="plr-20 ptb-16 bg-white">
			<view class="flex-between">
				<view class="text-base">
					<text class="fs-24 fw-7">{{ sku.price }}</text>
					<text class="fs-12">积分</text>
				</view>
				<!-- <view class="text-info fs-12">
					<text>已售{{ sku.sales }}</text>
					<text class="ml-16">库存{{ sku.stock }}</text>
				</view> -->
			</view>
			<view class="fs-16 fw-5 mt-12">
				<text>{{ goods.name }}</text>
				<text class="fs-12 fw-4 ml-10">{{ sku.name }}</text>
			</view>
		</view>
		<view class="mt-14 bg-white">
			<view class="text-center fw-5 ptb-18">商品详情</view>
			<u--image :src="item" v-for="(item, index) in goods.details" :key="index" width="100%" height="auto" bgColor="transparent" mode="widthFix">
			  <template v-slot:loading>
			    <u-loading-icon color="#9F9F9F" class="mtb-100"></u-loading-icon>
			  </template>
			</u--image>
		</view>
		<view class="h-100"></view>
		<view class="fixed left-0 bottom-0 pw-100 flex-between p-20 bg-white border-box">
			<view class="text-center relative" @click="$c.goto('/pages/index/web')">
				<image src="/static/goods/cs.png" class="i-24 auto"></image>
				<view class="fs-10 text-base mt-1">客服</view>
			</view>
			<view class="flex-start">
				<u-button
					class="bg-base-change fw-7 text-white w-200 h-41"
					shape="circle"
					text="兑换"
					@click="onChooseMode(2)"
				></u-button>
			</view>
		</view>
		
		<!-- 选购 -->
		<u-popup :show="showInfo" mode="bottom" round="8" closeable @close="showInfo = false">
			<view class="ptb-20 fs-12 info_box lh-10">
				<view class="text-center fs-18 fw-5">{{ mode == 1? '添加到购物车' : '提交订单'}}</view>
				<view class="plr-20 flex justify-between mt-37" style="align-items: flex-start;" @click="$c.goto('/pages/user/address?from=goodsDetail')">
					<image src="/static/goods/place.png" class="w-12 h-14"></image>
					<view v-if="address.district" class="flex-1 ml-8 mr-20">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-10">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<view v-else class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D"></u-icon>
				</view>
				<view class="plr-20 flex-start mt-30 mb-20">
					<image v-if="sku.picture" :src="sku.picture[0]" class="i-76 rounded-12" mode="aspectFill"></image>
					<view class="ml-9 flex-1">
						<view class="text-base">
							<text class="fs-18 fw-7">{{ sku.price }}</text>
							<text class="fs-12">积分</text>
						</view>
						<view class="flex-between mt-20">
							<u-number-box
								v-model="quantity" 
								name="quantity"
								bgColor="#fff" 
								iconStyle="font-size: 10px;" 
								inputWidth="29"
								:integer="true"
								:asyncChange="true"
								@change="onNumChange"
							></u-number-box>
							<!-- <view class="text-info fs-12">
								<text>已售{{ sku.sales }}</text>
								<text class="ml-10">库存{{ sku.stock }}</text>
								<text class="ml-10">{{ sku.limit_quantity ? `限购${sku.limit_quantity}` : '不限购' }}</text>
							</view> -->
						</view>
					</view>
				</view>
				<view class="h-6 bg-page"></view>
				<view class="h-300 sroller-y">
					<view class="ptb-20 plr-20">
						<view class="fs-14 fw-7">规格</view>
						<view class="flex-start mt-10 flex-wrap">
							<view
								class="sku_name mt-10 mr-10"
								:class="sku.id == item.id && 'sku_name_1'"
								v-for="(item, index) in goods.goods_sku"
								:key="item.id"
								@click="sku = item"
							>{{ item.name }}</view>
						</view>
					</view>
					<view class="h-6 bg-page"></view>
					<view v-if="mode == 2" class="plr-20">
						<view class="mt-20 fs-14 fw-7">支付方式</view>
						<view class="mt-15">
							<view class="flex-between item-stretch ptb-13" v-for="item in cateList" :key="item.id">
								<image src="/static/pay/point.webp" class="i-18"></image>
								<view class="flex-1 mlr-10">
									<view>{{ item.value }}</view>
									<view class="mt-10 fs-12 text-info">当前积分 {{ profile.integral || 0 }}</view>
								</view>
								<image src="/static/point/check_1.webp" class="i-18"></image>
							</view>
						</view>
						<!-- <Payment v-model="paying_mode"></Payment> -->
					</view>
					<u-button
						v-if="mode == 1"
						class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-30"
						shape="circle"
						text="添加到购物车"
						@click="doCartAdd"
					></u-button>
					<u-button
						v-else
						class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-30"
						shape="circle"
						text="提交订单"
						@click="onShowPasswrod()"
					></u-button>
					<view class="h-30"></view>
				</view>
			</view>
		</u-popup>
		
		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">需支付</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-28">{{ (sku.price) * quantity }}</text>
					<text class="fs-20">积分</text>
				</view>
				<view class="mt-28 fw-7 text-left">请输入交易密码</view>
				<view class="mt-20">
					<u-code-input 
						v-model="password" 
						:maxlength="6" 
						:focus="true"
						:color="$c.baseColor()"
						borderColor="#EAEAEA"
						dot 
						@finish="doBuy"
					></u-code-input>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import Payment from '../../components/Payment.vue'
	
	export default {
		components: { Title,Payment },
		data() {
			return {
				profile: {},
				id: null,
				goods: {},
				top: this.$c.barHeight(),
				sku: {},
				address: {},
				mode: 0,
				showPassword: false,
				showInfo: false,
				quantity: 1,
				paying_mode: 4,
				password: '',
				cateList: [{ id: 4, value: '积分支付' }],
				doCartAdd: null,
				doBuy: null,
				orderId: null
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
			this.doCartAdd = this.$c.onceRequest(this.onCartAdd)
			this.doBuy = this.$c.onceRequest(this.onBuy)
		},
		onShow() {
			this.addressList()
		},
		methods: {
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
				const res = await this.$c.fetch(this.$api.goods.goodsDetail, { id: this.id })
				if(res) { this.goods = res; this.sku = res.goods_sku[0] }
			},
			onChooseMode(n) {
				this.mode = n
				if(!this.goods_sku_id) this.goods_sku_id = this.sku.id
				if(this.profile.integral < this.sku.price) {
					this.$c.toast('积分不足')
					return
				}
				this.showInfo = true
			},
			async onCartAdd() {
				const res = await this.$c.fetch(this.$api.goods.cartAdd, {
					goods_sku_id: this.sku.id,
					quantity: this.quantity
				})
				if(res) { this.$c.toast('添加成功');this.showInfo = false }
			},
			async onBuy() {
				this.showPassword = false
				if (!this.orderId) {
					const res = await this.$c.fetch(this.$api.goods.orderAdd, {
						goods_sku: [{ id: this.sku.id, quantity: this.quantity, shopping_cart_id: 0 }],
						user_address_id: this.address.id
					})
					if(res) this.orderId = res.id
				}
				if (this.orderId) this.onPay()
			},
			async onPay() {
				this.showInfo = false
				const res = await this.$c.fetch(this.$api.goods.orderPay, {
					id: this.orderId,
					paying_mode: this.paying_mode,
					password: this.password
				})
				if(res) {
					if(res.jump_url) {
						// this.$c.setStorage('web', { title: '支付', src: res.jump_url })
						// this.$c.goto('/pages/index/web?type=pay')
						this.$c.quickPay(res.jump_url)
					} else {
						this.$c.goto('/pages/point/order')
					}
				}
			},
			onNumChange(e) {
				// if(this.sku.limit_quantity && this.sku.limit_quantity < e.value) {
				// 	this.$c.toast('当前商品限购' + this.sku.limit_quantity + '件')
				// 	return
				// }
				// if(this.sku.stock - this.sku.sales < e.value) {
				// 	this.$c.toast('库存不足')
				// 	this.quantity = this.sku.stock - this.sku.sales
				// 	return
				// }
				this.quantity = e.value
			},
			onShowPasswrod() {
				if(!this.paying_mode) {
					this.$c.toast('请选择支付方式')
					return
				}
				if (!this.address?.id) {
					this.$c.toast('请先添加收货地址')
					return false
				}
				this.password = ''
				this.showPassword = true
			}
		}
	}
</script>

<style>
	.price_box {
		height: 65px;
		background: linear-gradient(90deg, #6C5B47 0%, #312323 100%);
		color: #F7E7CD;
	}
	image {
		display: block;
	}
	.btn_left {
		border-radius: 999px 0 0 999px;
	}
	.btn_right {
		border-radius: 0 999px 999px 0;
		margin-left: -2px;
		border-left: 1px solid #1A7E84;
	}
	.info_box {
		background: linear-gradient(180deg, #CDEAEB 2%, #FFFFFF 95%);
		background-size: 100% 32px;
		background-repeat: no-repeat;
	}
	.sku_name {
		background: #F5F5F5;
		padding: 10px;
		border-radius: 4px;
	}
	.sku_name_1 {
		border: 1px solid #1A7E84;
		color: #1A7E84;
		background: #EFFEFF;
	}
</style>