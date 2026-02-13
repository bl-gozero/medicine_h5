<template>
	<view class="page bg-page lh-10">
		<Title title="提交订单" fixed></Title>
		<view class="plr-20 relative">
			<view class="mt-10 bg-white rounded-12 plr-13 ptb-18 border-box">
				<view class="flex justify-between" style="align-items: flex-start;" @click="$c.goto('/pages/user/address?from=goodsDetail')">
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
			</view>
			<view class="mt-10 bg-white rounded-14 plr-16">
				<view class="pb-20">
					<view class="flex-between pt-20" v-for="(i, index) in order.details" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-7 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-8 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<view class="flex-between mt-15">
								<view class="text-danger fw-7">
									<text class="fs-10">￥</text>
									<text class="fs-14">{{ profile.level.id > 2 ? i.vip_price : i.price }}</text>
								</view>
								<text class="text-info fs-12">×{{ i.quantity }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mt-12 plr-13 ptb-23 bg-white rounded-12">
				<view class="flex-between">
					<text>商品总价</text>
					<text class="fw-7">￥{{ total }}</text>
				</view>
			</view>
			<view class="mt-12 plr-13 ptb-10 bg-white rounded-12">
				<Payment v-model="paying_mode"></Payment>
			</view>
		</view>
		<u-button class="w-279 h-41 bg-base-change fw-7 text-white mt-20" shape="circle" text="立即支付"
			@click="onShowPassword()"></u-button>

		<!-- 密码 -->
		<payPassword v-model="password" :show.sync="showPassword" :amount="total" @finish="doPay"></payPassword>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import Payment from '../../components/Payment.vue'
	import payPassword from '../../components/payPassword.vue'

	export default {
		components: {
			Title,
			Payment,
			payPassword
		},
		data() {
			return {
				id: 0,
				order: {},
				showPassword: false,
				password: '',
				cateList: [{
					id: 4,
					value: '奖励'
				}],
				paying_mode: '',
				doPay: null,
				address: {},
				profile: this.$c.profile(),
				total: 0
			}
		},
		async onLoad(p) {
			this.$c.removeStorage('address')
			const profile = await this.$c.checkeLogin(1)
			if(profile) {
				this.profile = profile
				this.getDetail()
			}
			this.doPay = this.$c.onceRequest(this.onBuy)
		},
		onShow() {
			this.addressList()
		},
		onUnload() {
			this.$c.removeStorage('goods_sku')
		},
		methods: {
			onShowPassword() {
				if (!this.paying_mode) {
					this.$c.toast('请选择支付方式')
					return
				}
				this.password = '';
				this.showPassword = true;
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
			async getDetail() {
				const goods_sku = this.$c.getStorage('goods_sku')
				if(goods_sku) {
					this.order.details = goods_sku
					this.total =  (this.order.details || []).reduce(
					    (sum, item) => sum + (this.profile.level?.id > 2 ? item.vip_price : item.price) * item.quantity,
					    0
					)
					// console.log(this.order.details)
				} else {
					this.$c.goBack()
				}
			},
			async onBuy() {
				this.showPassword = false
				if (!this.id) {
					const goods_sku = this.order.details
						.map(item => ({
							id: item.goods_sku_id,
							quantity: item.quantity,
							shopping_cart_id: item.id
						}))
					const res = await this.$c.fetch(this.$api.goods.orderAdd, {
						goods_sku: goods_sku,
						user_address_id: this.address.id
					})
					if (res) this.id = res.id
				}
				if (this.id) this.onPay()
			},
			async onPay(id) {
				this.showPassword = false
				const res = await this.$c.fetch(this.$api.goods.orderPay, {
					id: this.id,
					paying_mode: this.paying_mode,
					password: this.password
				})
				if (res) {
					if (res.jump_url) {
						this.$c.quickPay(res.jump_url)
					} else {
						this.$c.goto('/pages/order/list')
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>