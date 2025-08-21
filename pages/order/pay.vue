<template>
	<view class="page bg-page lh-10">
		<Title title="提交订单" fixed></Title>
		<view class="plr-20 relative" :class="`pt-${top}`">
			<view class="mt-10 bg-white rounded-12 plr-13 ptb-18 border-box">
				<view class="flex-between">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start mt-2"></image>
					<view class="mlr-11 flex-1">
						<view class="lh-13">{{ order.address }}</view>
						<view class="mt-10 fs-12 text-info">
							<text>{{ order.name }}</text>
							<text class="ml-15">{{ order.phone }}</text>
						</view>
					</view>
					<!-- <u-icon class="self-start mt-2" name="arrow-right" size="14" :color="$c.arrowColor()"></u-icon> -->
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
								<!-- <u-number-box
									v-model="i.quantity" 
									:name="index" 
									bgColor="#fff" 
									iconStyle="font-size: 10px;" 
									inputWidth="29" 
									:integer="true"
									:asyncChange="true"
									@change="onNumChange"
								></u-number-box> -->
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
			</view>
			<view class="mt-12 plr-13 ptb-20 bg-white rounded-12">
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
		<u-button class="w-279 h-41 bg-base-change fw-7 text-white mt-10" shape="circle"
			text="立即支付" @click="onShowPassword()"></u-button>
			
		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">需支付</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ order.price }}</text>
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
	export default {
		components: {
			Title
		},
		data() {
			return {
				top: 0,
				id: 0,
				order: {},
				showPassword: false,
				password: '',
				cateList: [{ id: 4, value: '余额' }],
				paying_mode: '',
				doPay: null
			}
		},
		onLoad(p) {
			this.$c.removeStorage('address')
			if (p.id) {
				this.id = parseInt(p.id)
				this.getDetail()
				this.getCateList()
			}
			this.doPay = this.$c.onceRequest(this.onPay)
		},
		onShow() {
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title-bar').then(res => {
					this.top = res.height
				})
			}, 100)
		},
		methods: {
			// onNumChange(e) {
			// 	const item = this.order.details[e.name]
			// 	if(item.limit_quantity < e.value) {
			// 		this.$c.toast('当前商品限购' + item.limit_quantity + '件')
			// 	} else {
			// 		this.quantity = e.value
			// 	}
			// },
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
						this.$c.setStorage('web', { title: '支付', src: res.jump_url })
						this.$c.goto('/pages/index/web?type=pay')
					} else {
						this.$c.goto('/pages/order/list')
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