<template>
	<view class="page bg-page lh-10">
		<Title title="提交订单" fixed></Title>
		<view class="plr-20 relative">
			<view v-if="order.address" class="mt-10 bg-white rounded-12 plr-13 ptb-18 border-box">
				<view class="flex-between">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start mt-2"></image>
					<view class="mlr-11 flex-1">
						<view class="lh-13">{{ order.address }}</view>
						<view class="mt-10 fs-12 text-info">
							<text>{{ order.name }}</text>
							<text class="ml-15">{{ order.phone }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="mt-20 bg-white rounded-14 plr-16">
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
									<text class="fs-14">{{ i.price }}</text>
								</view>
								<text class="text-info fs-12">×{{ i.quantity }}</text>
								<!-- <u-number-box v-model="i.quantity" :name="index" bgColor="#fff"
									iconStyle="font-size: 10px;" inputWidth="29" :integer="true" :asyncChange="true"
									@change="onNumChange"></u-number-box> -->
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="mt-12 plr-13 ptb-23 bg-white rounded-12">
				<view class="flex-between">
					<text>商品总价</text>
					<text class="fw-7">￥{{ order.price }}</text>
				</view>
				<view v-if="order.subsidy" class="mt-20 flex-between">
					<text>购物金抵扣</text>
					<text class="fw-7" style="color: #FF8F1F;">-￥{{ order.subsidy }}</text>
				</view>
				<view v-else-if="subsidy.pay" class="mt-20 flex-between">
					<text>购物金抵扣</text>
					<text class="fw-7" style="color: #FF8F1F;">-￥{{ subsidy.amount }}</text>
				</view>
				<view v-else-if="subsidy.show && profile.subsidy >= 1" class="mt-20">
					<view class="flex-between fgap-20">
						<text>可用{{ profile.subsidy }}购物金抵扣</text>
						<u-input v-model.number="subsidy.amount" placeholder="输入抵扣金额" inputAlign="right" border="none"
							type="number" :formatter="priceFormatter"></u-input>
					</view>
					<view class="mt-10 text-info fs-12">购物金使用后，无法退还</view>
				</view>
				<view class="flex-between mt-20">
					<text>合计</text>
					<text class="fw-7">￥{{ total }}</text>
				</view>
			</view>
			<view class="mt-12 plr-13 ptb-10 bg-white rounded-12">
				<Payment v-model="paying_mode"></Payment>
			</view>
		</view>
		<button class="w-279 h-41 bg-base-change fw-7 text-white mt-10 btn"
			@click="onShowPassword()">{{ total ? `立即支付（￥${total}）` : '立即支付' }}</button>
		<view class="h-30"></view>

		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">需支付</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ total }}</text>
				</view>
				<view class="mt-28 fw-7 text-left">请输入交易密码</view>
				<view class="mt-20">
					<u-code-input v-model="password" :maxlength="6" :focus="true" :color="$c.baseColor()"
						borderColor="#EAEAEA" dot @finish="doPay"></u-code-input>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import Payment from '../../components/Payment.vue'

	export default {
		components: {
			Title,
			Payment
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
				paying_mode: {
					id: null,
					is_password: false
				},
				doPay: null,
				subsidy: {
					show: false,
					amount: null,
					pay: 0
				},
				profile: this.$c.profile()
			}
		},
		computed: {
			total() {
				return this.order.price - this.order.subsidy - (this.subsidy.amount || 0)
			}
		},
		async onLoad(p) {
			this.$c.removeStorage('address')
			const profile = await this.$c.checkeLogin(1)
			if (profile) {
				this.profile = profile
				this.id = this.$c.safeId(p)
				this.id && this.getDetail()
			}
			this.doPay = this.$c.onceRequest(this.onPay)
		},
		onShow() {},
		methods: {
			onShowPassword() {
				if (!this.paying_mode) {
					this.$c.toast('请选择支付方式')
					return
				}
				this.password = '';
				if (this.paying_mode.is_password) {
					return this.showPassword = true
				}
				this.doPay()
			},
			priceFormatter(value) {
				if (!value) return '';
				let max = Math.min(this.total, this.profile.subsidy)
				let v = Math.min(max, value)
				v = v < 1 ? 1 : v
				let match = v.toString().match(/^[1-9]\d*/)
				return match ? match[0] : ''
			},
			async getDetail() {
				const res = await this.$c.fetch(this.$api.goods.orderDetail, {
					id: this.id
				})
				if (res) {
					this.order = res
					this.subsidy.show = (res?.details || []).some(i => i.is_subsidy == 1)
				}
			},
			async getCateList() {
				const res = await this.$c.fetch(this.$api.config.payCategoryList)
				if (res) this.cateList = [...this.cateList, ...(res || [])]
			},
			async onPay() {
				this.showPassword = false
				if (!this.subsidy.pay && this.subsidy.amount) {
					const res1 = await this.$c.fetch(this.$api.goods.orderSubsidy, {
						id: this.id,
						amount: this.subsidy.amount,
					})
					if (!res1) return false
					this.subsidy.pay = 1
				}
				const res = await this.$c.fetch(this.$api.goods.orderPay, {
					id: this.id,
					paying_mode: this.paying_mode.id,
					password: this.password
				})
				if (res) {
					this.$c.payJump(res, '/pages/order/list')
					// if (res.jump_url) {
					// 	this.$c.quickPay(res.jump_url)
					// } else {
					// 	this.$c.goto('/pages/order/list')
					// }
				}
			},
			async onCancel() {
				this.showCancel = false
				this.showDelete = false
				this.showReceive = false
				const res = await this.$c.fetch(this.$api.goods.orderCancel, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.getDetail()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>