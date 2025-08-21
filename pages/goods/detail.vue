<template>
	<view class="page bg-page">
		<view class="relative">
			<u-swiper :list="goods.picture" height="375"></u-swiper>
			<view class="">
				<image src="/static/goods/back.png" class="i-24 absolute left-20" :class="`top-${top}`" @click="$c.goBack()"></image>
				<image src="/static/goods/cart.png" class="i-24 absolute right-20" :class="`top-${top}`" @click="$c.goto('/pages/goods/cart')"></image>
			</view>
		</view>
		<view class="relative price_box flex-start plr-20">
			<view class="absolute top-0 right-0">
				<image src="/static/goods/price_bg.png" class="w-152 h-65"></image>
				<view class="full flex-center">
					<image v-if="profile.level.id > 2" src="/static/goods/price_info_2.png" class="w-114 h-34"></image>
					<view v-else class="flex-center" @click="$c.goto('/pages/user/vip')">
						<image src="/static/goods/vip.png" class="w-35 h-27"></image>
						<image src="/static/goods/price_info_1.png" class="w-48 h-32 mlr-7"></image>
						<image src="/static/goods/right.png" class="w-6 h-11"></image>
					</view>
				</view>
			</view>
			<view class="">
				<view v-if="profile.level.id > 2" class="fs-12">
					<text class="">VIP价</text>
					<text class="fs-10 fw-7 ml-3">￥</text>
					<text class="fs-24 fw-7">{{ sku.vip_price }}</text>
					<text class="mlr-16 line-through">原价 ￥{{ sku.price }}</text>
				</view>
				<view v-else class="">
					<text class="">原价</text>
					<text class="fs-10 fw-7 ml-3">￥</text>
					<text class="fs-24 fw-7">{{ sku.price }}</text>
					<text class="mlr-16 line-through">VIP价 ￥{{ sku.vip_price }}</text>
				</view>
				<text class="fs-12 fw-6 bg-white plr-3 ptb-2 rounded-4" style="color: #362826;">会员最高专享99折</text>
			</view>
		</view>
		<view class="p-20 bg-white">
			<view class="fs-16 fw-6">{{ goods.name }}</view>
			<view class="mtb-10">{{ sku.name }}</view>
			<view class="text-info fs-12">
				<text>已售{{ sku.sales }}</text>
				<text class="ml-16">库存{{ sku.stock }}</text>
			</view>
		</view>
		<view class="mt-14 bg-white">
			<view class="text-center fw-5 ptb-18">商品详情</view>
			<u--image :src="item" v-for="(item, index) in sku.picture" :key="index" width="100%" height="auto" bgColor="transparent" mode="widthFix">
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
					class="border-1 fw-7 text-base w-100 h-39 btn_left"
					text="加入购物车"
					@click="onChooseMode(1)"
				></u-button>
				<u-button
					class="bg-base-change fw-7 text-white w-100 h-41 btn_right"
					text="提交订单"
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
					<view class="flex-1 ml-8 mr-20">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-10">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D"></u-icon>
				</view>
				<view class="plr-20 flex-start mt-30 mb-20">
					<image v-if="sku.picture" :src="sku.picture[0]" class="i-76 rounded-12" mode="aspectFill"></image>
					<view class="ml-9 flex-1">
						<view class="fw-7 text-danger">
							<text class="">￥</text>
							<text class="fs-18">{{ profile.level.id > 2?  sku.vip_price : sku.price }}</text>
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
							<view class="text-info fs-12">
								<text>已售{{ sku.sales }}</text>
								<text class="ml-10">库存{{ sku.stock }}</text>
								<text class="ml-10">{{ sku.limit_quantity ? `限购${sku.limit_quantity}` : '不限购' }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="h-6 bg-page"></view>
				<view class="h-300 sroller-y">
					<view class="ptb-20 plr-20">
						<view class="fs-14 fw-7">规格</view>
						<view class="flex-start mt-20">
							<view
								class="sku_name mr-10"
								:class="sku.id == item.id && 'sku_name_1'"
								v-for="(item, index) in goods.goods_sku"
								:key="item.id"
								@click="sku = item"
							>{{ item.name }}</view>
						</view>
					</view>
					<view class="h-6 bg-page"></view>
					<view v-if="mode == 2" class="plr-20">
						<view class="mt-20 fs-14 fw-7">选择支付方式</view>
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
					<u-button
						v-if="mode == 1"
						class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-30"
						shape="circle"
						text="添加到购物车"
						@click="doCartAdd"
					></u-button>
					<u-button
						v-else
						class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-50"
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
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ (profile.level.id > 2? sku.vip_price : sku.price) * quantity }}</text>
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
						@finish="doBuy"></u-code-input>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: { Title },
		data() {
			return {
				profile: this.$c.getStorage('profile') || {},
				id: null,
				goods: {},
				top: this.$c.barHeight(),
				sku: {},
				address: {},
				mode: 0,
				showPassword: false,
				showInfo: false,
				quantity: 1,
				paying_mode: null,
				password: '',
				cateList: [{ id: 4, value: '余额' }],
				doCartAdd: null,
				doBuy: null
			}
		},
		onLoad(p) {
			this.$c.removeStorage('address')
			if(p.id && parseInt(p.id)) {
				this.id = parseInt(p.id)
				this.getProfile()
				this.goodsDetail()
				this.addressList()
				this.getCateList()
			}
			this.doCartAdd = this.$c.onceRequest(this.onCartAdd)
			this.doBuy = this.$c.onceRequest(this.onBuy)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if(address) this.address = address
		},
		methods: {
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.profile = this.profile
					this.$c.setStorage('profile', res)
				}
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.address = res.length > 0? res[0] : {} }
			},
			async getCateList() {
				const res = await this.$c.fetch(this.$api.config.payCategoryList)
				if (res) this.cateList = [...this.cateList, ...(res || [])]
			},
			async goodsDetail() {
				const res = await this.$c.fetch(this.$api.goods.goodsDetail, { id: this.id })
				if(res) { this.goods = res; this.sku = res.goods_sku[0] }
			},
			onChooseMode(n) {
				this.mode = n
				if(!this.goods_sku_id) this.goods_sku_id = this.sku.id
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
				const res = await this.$c.fetch(this.$api.goods.orderAdd, { 
					goods_sku: [{ id: this.sku.id, quantity: this.quantity, shopping_cart_id: 0 }],
					user_address_id: this.address.id
				})
				if(res) this.onPay(res.id)
			},
			async onPay(id) {
				this.showPassword = false
				const res = await this.$c.fetch(this.$api.goods.orderPay, {
					id: id,
					paying_mode: this.paying_mode,
					password: this.password
				})
				if(res) {
					if(res.jump_url) {
						this.$c.setStorage('web', { title: '支付', src: res.jump_url })
						this.$c.goto('/pages/index/web?type=pay')
					} else {
						this.$c.goto('/pages/order/list')
					}
				}
			},
			onNumChange(e) {
				if(this.sku.limit_quantity && this.sku.limit_quantity < e.value) {
					this.$c.toast('当前商品限购' + this.sku.limit_quantity + '件')
					return
				}
				if(this.sku.stock - this.sku.sales < e.value) {
					this.$c.toast('库存不足')
					this.quantity = this.sku.stock - this.sku.sales
					return
				}
				this.quantity = e.value
			},
			onShowPasswrod() {
				if(!this.paying_mode) {
					this.$c.toast('请选择支付方式')
					return
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