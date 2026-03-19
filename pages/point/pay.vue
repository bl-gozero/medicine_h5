<template>
	<view class="page bg-page lh-10">
		<Title title="提交订单" fixed></Title>
		<view v-if="load" class="plr-20 relative">
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
								<view class="text-base fw-7">
									<text class="fs-14">{{ i.price }}</text>
									<text class="fs-10">积分</text>
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
					<text class="fw-7">{{ order.price }}积分</text>
				</view>
			</view>
			<view class="mt-12 plr-13 ptb-20 bg-white rounded-12">
				<view class="fs-14 fw-7">支付方式</view>
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
			</view>
			<button class="w-279 h-41 bg-base-change fw-7 text-white mt-50 flex-center rounded-x"
				@click="onShowPassword()">立即支付</button>
		</view>
			
		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">需支付</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-28">{{ order.price }}</text>
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
						@finish="doPay"></u-code-input>
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
				cateList: [{ id: 4, value: '积分' }],
				paying_mode: 4,
				doPay: null,
				profile: {},
				load: false,
				from: ''
			}
		},
		onLoad(p) {
			this.profile = this.$c.checkeLogin(1)
			this.$c.removeStorage('address')
			if (p.id) {
				this.id = parseInt(p.id)
				this.getDetail()
			}
			if (p.from) this.from = p.from
			this.doPay = this.$c.onceRequest(this.onPay)
		},
		onShow() {
		},
		methods: {
			onShowPassword() {
				if(!this.paying_mode) {
					this.$c.toast('请选择支付方式')
					return
				}
				this.password = '';
				this.showPassword = true;
			},
			async getDetail() {
				const res = await this.$c.fetch(this.$api.goods.orderDetail, {
					id: this.id
				})
				if (res) {
					this.order = res
					this.load = true
				}
			},
			async getCateList() {
				const res = await this.$c.fetch(this.$api.config.payCategoryList)
				if (res) this.cateList = [...this.cateList, ...(res || [])]
			},
			async onPay() {
				this.showPassword = false
				const res = await this.$c.fetch(this.$api.goods.orderPay, {
					id: this.id,
					paying_mode: this.paying_mode,
					password: this.password
				})
				if(res) {
					if(res.jump_url) {
						// this.$c.setStorage('web', { title: '支付', src: res.jump_url })
						// this.$c.goto('/pages/index/web?type=pay')
						this.$c.quickPay(res.jump_url)
					} else {
						this.from == 'detail' ? this.$c.goto('/pages/point/order', 2) : this.$c.goBack()
					}
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