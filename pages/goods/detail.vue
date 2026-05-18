<template>
	<view class="page bg-page">
		<view class="relative">
			<u-swiper :list="goods.picture" height="375"></u-swiper>
			<view class="">
				<image src="/static/goods/back.png" class="i-24 absolute left-20" :class="'top-' + top"
					@click="$c.goBack()"></image>
				<image src="/static/goods/cart.png" class="i-24 absolute right-20" :class="'top-' + top"
					@click="$c.goto('/pages/goods/cart')"></image>
			</view>
		</view>
		<view class="relative price_box flex-start plr-20">
			<view v-if="$c.mode()" class="absolute top-0 right-0">
				<!-- #ifndef MP -->
				<image src="/static/goods/price_bg.png" class="w-152 h-65"></image>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<image src="/static/mp/goods/price_bg.webp" class="w-152 h-65"></image>
				<!-- #endif -->
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
					<text v-if="$c.mode()" class="">VIP价</text>
					<text class="fs-10 fw-7 ml-3">￥</text>
					<text class="fs-24 fw-7">{{ sku.vip_price }}</text>
					<text class="mlr-16 line-through">原价 ￥{{ sku.price }}</text>
				</view>
				<view v-else class="">
					<text class="">原价</text>
					<text class="fs-10 fw-7 ml-3">￥</text>
					<text class="fs-24 fw-7">{{ sku.price }}</text>
					<text class="mlr-16 line-through"><text v-if="$c.mode()">VIP价</text> ￥{{ sku.vip_price }}</text>
				</view>
				<text class="fs-12 fw-6 bg-white plr-3 ptb-2 rounded-4 zhuanshu">会员可享专属折扣</text>
			</view>
		</view>
		<view class="p-20 bg-white">
			<view class="fs-16 fw-6">{{ goods.name }}</view>
			<view class="mtb-10">{{ sku.name }}</view>
			<!-- <view class="text-info fs-12">
				<text>已售{{ sku.sales }}</text>
				<text class="ml-16">库存{{ sku.stock }}</text>
			</view> -->
		</view>
		<view v-if="!showInfo && priceLog.length" class=""
			style="background: linear-gradient(78deg, #FCFFF0 0%, #FFE0C3 99%);">
			<scroll-view ref="scrollView" :scroll-left="scrollLeft" scroll-x class="scroll-view_H"
				scroll-with-animation>
				<EChart ref="echartRef" @ready="initEchart" :width="getWidth()" height="77px" />
			</scroll-view>
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
		<view class="h-100"></view>
		<view class="fixed left-0 bottom-0 pw-100 flex-between p-20 bg-white border-box">
			<view class="text-center relative" @click="$c.goto('/pages/index/web')">
				<!-- #ifdef MP -->
				<image src="/static/mp/goods/cs.webp" class="i-24 auto"></image>
				<!-- #endif -->
				<!-- #ifndef MP -->
				<image src="/static/goods/cs.png" class="i-24 auto"></image>
				<!-- #endif -->
				<view class="fs-10 text-base mt-1">客服</view>
			</view>
			<view class="flex-start">
				<button class="bg-white border-1 fw-7 fs-14 text-base w-100 h-41 btn_left flex-center p-0"
					@click="onChooseMode(1)">加入购物车</button>
				<button class="bg-base-change fw-7 fs-14 text-white w-100 h-41 btn_right flex-center p-0"
					@click="onChooseMode(2)">提交订单</button>
			</view>
		</view>

		<!-- 选购 -->
		<u-popup :show="showInfo" mode="bottom" round="8" closeable @close="showInfo = false">
			<view class="ptb-20 fs-12 bg-address lh-10">
				<view class="text-center fs-18 fw-5">{{ mode == 1? '添加到购物车' : '提交订单'}}</view>
				<view class="plr-20 flex justify-between mt-37" style="align-items: flex-start;"
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
				<view class="plr-20 flex-start mt-30 mb-20">
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
								<!-- <text>已售{{ sku.sales }}</text>
								<text class="ml-10">库存{{ sku.stock }}</text> -->
								<text class="ml-10">{{ sku.limit_quantity ? `限购${sku.limit_quantity}` : '不限购' }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="h-6 bg-page"></view>
				<view class="h-300 sroller-y">
					<view class="ptb-20 plr-20">
						<view class="fs-14 fw-7">规格</view>
						<view class="flex-start mt-10 flex-wrap">
							<view class="sku_name mr-10 mt-10" :class="sku.id == item.id && 'sku_name_1'"
								v-for="(item, index) in goods.goods_sku" :key="item.id" @click="sku = item">
								{{ item.name }}
							</view>
						</view>
						<view v-if="subsidy.amount && subsidy.pay" class="mt-20 flex-between">
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
						</view>
					</view>
					<view class="h-6 bg-page"></view>
					<view v-if="mode == 2" class="plr-20">
						<Payment v-model="paying_mode"></Payment>
					</view>
					<button v-if="mode == 1"
						class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-30 flex-center rounded-x"
						@click="doCartAdd">添加到购物车</button>
					<button v-else class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-30 flex-center rounded-x"
						@click="onShowPasswrod()">{{ `提交订单（￥${(profile.level.id > 2? sku.vip_price : sku.price) * quantity - (subsidy.amount || 0)}）` }}</button>
					<view class="h-30"></view>
				</view>
			</view>
		</u-popup>

		<!-- 密码 -->
		<payPassword v-model="password" :show.sync="showPassword"
			:amount="(profile.level.id > 2? sku.vip_price : sku.price) * quantity - (subsidy.amount || 0)"
			@finish="doBuy"></payPassword>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import Payment from '../../components/Payment.vue'
	import payPassword from '../../components/payPassword.vue'

	// #ifdef MP
	import EChart from '@/pages/goods/e-chart/components/e-chart/e-chart.vue'
	// #endif
	
	// #ifndef MP
	import EChart from '@/uni_modules/e-chart/components/e-chart/e-chart.vue'
	// #endif

	export default {
		components: {
			Title,
			Payment,
			payPassword,
			EChart
		},
		data() {
			return {
				profile: this.$c.profile(),
				id: null,
				goods: {},
				top: this.$c.barHeight(),
				sku: {},
				address: {},
				mode: 0,
				showPassword: false,
				showInfo: false,
				quantity: 1,
				paying_mode: {
					id: null,
					is_password: false
				},
				password: '',
				doCartAdd: null,
				doBuy: null,
				option: {
					xAxis: {
						type: 'category',
						data: [],
						boundaryGap: false,
						show: false,
					},
					yAxis: {
						show: false,
					},
					series: [{
							type: 'line',
							smooth: true,
							data: [],
							label: {
								show: true, // 显示标签
								position: 'top', // 显示在点的上方
								color: '#FE9A53', // 文字颜色
								fontSize: 10,
							},
							symbol: 'circle',
							lineStyle: {
								width: 2,
								z: 2,
								color: {
									type: 'linear',
									x: 0,
									y: 1,
									x2: 0,
									y2: 0, // 从下到上 180deg
									colorStops: [{
											offset: 0,
											color: '#FEB64A'
										},
										{
											offset: 1,
											color: '#FF3644'
										}
									]
								}
							},
							// 下方区域渐变
							areaStyle: {
								color: {
									type: 'linear',
									x: 0,
									y: 0,
									x2: 0,
									y2: 1,
									colorStops: [{
											offset: 0.02,
											color: 'rgba(255,34,49,0.75)'
										},
										{
											offset: 1,
											color: 'rgba(254,181,74,0)'
										}
									]
								}
							},
							// 点的渐变
							itemStyle: {
								color: {
									type: 'linear',
									x: 0.11,
									y: 0,
									x2: 0.85,
									y2: 1, // 近似 CSS 305deg
									colorStops: [{
											offset: 0,
											color: 'rgba(255, 34, 49, 1)'
										},
										{
											offset: 1,
											color: 'rgba(254, 181, 74, 1)'
										}
									]
								},
								borderWidth: 0,
								borderColor: 'transparent'
							},
							clipOverflow: false,
							connectNulls: true,
						},
						{
							type: 'scatter',
							data: [],
							symbolSize: 0 // 隐藏点，只显示文字
						}
					],
					grid: {
						left: 0,
						right: 30,
						top: 30,
						bottom: 15,
						containLabel: false
					},
				},
				scrollLeft: 0,
				priceLog: [],
				orderId: null,
				subsidy: {
					show: false,
					amount: null,
					pay: 0
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
			this.doCartAdd = this.$c.onceRequest(this.onCartAdd)
			this.doBuy = this.$c.onceRequest(this.onBuy)
			this.onTask()
		},
		onShow() {
			this.addressList()
		},
		methods: {
			getWidth() {
				let len = this.priceLog.length
				return `${len * 16}%`
			},
			priceFormatter(value) {
				if (!value) return '';
				let max = Math.min(this.profile.level.id > 2 ? this.sku.vip_price : this.sku.price, this.profile.subsidy)
				let v = Math.min(max, value)
				v = v < 1 ? 1 : v
				let match = v.toString().match(/^[1-9]\d*/)
				return match ? match[0] : ''
			},
			async initEchart() {
				await this.$refs.echartRef.init(this.option);
				this.setOption()
			},
			setOption() {
				// 执行更新
				let m = this.priceLog.map(item => item.date)
				let p = this.priceLog.map(item => item.price)
				const months = ['', ...m]
				const prices = [p[0] * 0.98, ...p];
				this.option.series[0].data = prices.map((v, i) => {
					let item = {
						value: v
					};
					item.symbolSize = i === 0 ? 0 : 6;
					if (i === prices.length - 1) {
						item.symbolSize = 10;
						item.itemStyle = {
							borderColor: 'rgba(255,255,255,.8)', // 边框颜色
							borderWidth: 2, // 边框宽度
						};
					}
					return item;
				});
				this.option.series[1].data = prices.map((v, i) => ({
					value: v,
					label: {
						show: true,
						position: 'bottom',
						formatter: months[i],
						color: '#CAB097',
						fontSize: 8
					},
				}))
				this.option.series[0].label = {
					show: true,
					position: 'top',
					color: '#FE9A53',
					fontSize: 10,
					formatter: (params) => {
						// 第一个是假点，不显示
						if (params.dataIndex === 0) return '';
						// 其他点显示带 ￥ 的价格
						return `￥${params.value}`;
					}
				}
				// console.log('绘图', this.$refs.echartRef)
				this.$refs.echartRef.setOption(this.option);
				setTimeout(() => {
					this.scrollLeft = 99999;
				}, 1000)
			},
			async getPriceLog() {
				const res = await this.$c.fetch(this.$api.goods.priceLog, {
					goods_sku_id: this.sku.id
				})
				if (res.length) {
					this.priceLog = res
				}
			},
			onTask() {
				this.$c.fetch(this.$api.config.taskFinish, {
					id: 2
				})
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
					this.getPriceLog()
				}
			},
			onChooseMode(n) {
				this.mode = n
				if (!this.goods_sku_id) this.goods_sku_id = this.sku.id
				this.showInfo = true
			},
			async onCartAdd() {
				const res = await this.$c.fetch(this.$api.goods.cartAdd, {
					goods_sku_id: this.sku.id,
					quantity: this.quantity
				})
				if (res) {
					this.$c.toast('添加成功');
					this.showInfo = false
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
					const max1 = allowed > -10000000 ? Math.max(allowed, 0) :limit
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
			}
		}
	}
</script>

<style>
	/* #ifndef MP */
	.price_box {
		height: 65px;
		background: linear-gradient(90deg, #6C5B47 0%, #312323 100%);
		color: #F7E7CD;
	}

	.zhuanshu {
		color: #362826;
	}

	/* #endif */

	/* #ifdef MP */
	.price_box {
		height: 65px;
		background: linear-gradient(90deg, #EB5433 0%, #F53939 99%);
		color: #F7E7CD;
	}

	.zhuanshu {
		color: #B05217;
	}

	/* #endif */

	image {
		display: block;
	}

	.btn_left {
		border-radius: 999px 0 0 999px;
	}

	.btn_right {
		border-radius: 0 999px 999px 0;
		margin-left: -2px;
		/* border-left: 1px solid #1A7E84; */
	}
</style>