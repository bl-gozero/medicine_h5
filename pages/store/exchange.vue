<template>
	<view class="page bg-page">
		<view class="title_bg">
			<Title title="可置换的商品" bgColor="transparent"></Title>
		</view>
		<view class="pt-11 plr-8">
			<view class="ptb-14 plr-12 rounded-12 flex-start bg-white mt-12" v-for="item in list" :key="item.id">
				<image :src="$c.checkIcon(item.goods_sku_id == goods.goods_sku_id)" class="i-18"
					@click="onGoods(item)"></image>
				<image :src="item.picture" class="i-76 rounded-12 plr-9" mode="aspectFill"></image>
				<view class="flex-1">
					<view class="u-line-1 fw-5">{{ item.goods_name }}</view>
					<view class="mtb-8 fs-12 text-info">{{ item.goods_sku_name }}</view>
					<view class="flex-between">
						<view class="x-100">
							<text class="text-danger fs-10 fw-7">￥</text>
							<text class="text-danger fw-7">{{ item.price }}</text>
						</view>
						<!-- <u-number-box v-model="item.quantity" :name="item.id" bgColor="#fff"
							iconStyle="font-size: 10px;" inputWidth="29" :integer="true"></u-number-box> -->
					</view>
				</view>
			</view>
		</view>
		<view class="fixed bottom-0 x-100">
			<view class="flex-between bg-white ptb-9 plr-20">
				<view class="flex-start">
					<!-- <image :src="$c.checkIcon(all)" class="i-18" @click="onAll()"></image>
					<text class="ml-10">全选</text> -->
				</view>
				<view class="flex-end">
					<!-- <text class="text-info">已选{{ num }}件</text>
					<text class="ml-10">合计：</text>
					<text class="text-danger fw-7">￥</text>
					<text class="text-danger fw-7 fs-14 mr-10">{{ total }}</text> -->
					<button class="bg-base-change fw-7 fs-14 text-white w-82 h-35 rounded-x"
						@click="onShowExchange()">置换</button>
				</view>
			</view>
			<view class="bg-white plr-20 ptb-9 pb-3 flex-between fs-12"
				style="box-shadow: 0px -6px 20px 0px rgba(0, 0, 0, 0.0392);">
				<view class="self-start fw-7 pt-3">库存：</view>
				<view class="flex-1">
					<view class="flex-between fgap-20">
						<view class="u-line-1">{{ exchangeGoods.goods_name }}</view>
						<u-number-box v-model="exchangeGoods.exquantity" bgColor="#fff" iconStyle="font-size: 10px;"
							inputWidth="29" :integer="true" :max="exchangeGoods.quantity"></u-number-box>
					</view>
					<view class="flex-between">
						<view class="">{{ exchangeGoods.quantity || '0.00' }}盒 ￥{{ exchangeGoods.price * exchangeGoods.quantity || '0.00' }}</view>
						<view class="">
							<text class="ml-10">合计：</text>
							<text class="fw-7 fs-10 text-blue">￥</text>
							<text class="fw-7 fs-14 mr-10 text-blue">{{ exchangeTotal }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<u-popup :show="showBuy" mode="bottom" :round="20" closeable @close="showBuy = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">商品置换</view>
				<view class="mt-30 flex-between">
					<view class="">置换总价：￥{{ exchangeTotal }}</view>
					<view class="fw-5">{{ exchangeGoods.name }}x{{ exchangeGoods.quantity }}</view>
				</view>
				<view class="fs-12 p-12 border-box rounded-8 mtb-15 lh-15" style="background: #F0ECE1;color: #99935C;">
					<view class="fw-7 flex-start">
						<u-icon name="bell-fill" color="#9D9762" size="14"></u-icon>
						<text class="ml-3">温馨提示</text>
					</view>
					<view class="">申请置换后，需等待1-5个工作日进行审核，置换成功后的商品寄存在库存内，仍可根据平台政策进行发货、转赠、回购等操作</view>
				</view>
				<view class="h-10 bg-page"></view>
				<view class="mt-20 fw-5">置换的商品</view>
				<scroll-view scroll-y class="h-160 mt-20">
					<view class="flex-between mb-20">
						<image :src="goods.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="fw-5">{{ goods.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ goods.goods_sku_name }}</view>
							<view class="mt-10 text-danger fw-7 flex-between">
								<view class="">
									<text class="fs-10">￥</text>
									<text class="fs-14">{{ goods.price }}</text>
								</view>
								<text class="text-info fs-12">×{{ goods.quantity }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<button class="btn-submit bg-base mt-20" @click="doSubmit">申请置换</button>
			</view>
		</u-popup>

		<!-- <payPassword v-model="password" :show.sync="showPassword" @finish="doSubmit('transfer')"></payPassword> -->

		<u-popup :show="showAlert" mode="center" bgColor="transparent" @close="showAlert = false;">
			<view class="popup-box sign_reward_box">
				<image :src="$c.img('/static/know/ring.webp')" class="popup-img" mode="heightFix"></image>
				<view class="popup-title" style="color: #3B444C;">置换提醒</view>
				<view class="popup-text flex-1">
					<view v-if="!exchangeGoods.quantity" class="">您当前无可置换商品</view>
					<view v-else class="">置换前后商品总价应相等，<br />请重新选择商品</view>
				</view>
				<view class="popup-buttons">
					<button v-if="!exchangeGoods.quantity" class="bold fs-16 w-234 h-51 flex-center text-white rounded-x bg-base"
						@click="$c.goBack();">知道了</button>
					<button v-else class="bold fs-16 w-234 h-51 flex-center text-white rounded-x bg-base"
						@click="showAlert = false;">重新置换</button>
				</view>
			</view>
		</u-popup>

		<u-popup :show="showSuccess" mode="center" bgColor="transparent" @close="showSuccess = false;">
			<view class="popup-box" style="background: linear-gradient(180deg, #cfdeff 0%, #ffffff 48%);">
				<image :src="$c.img('/static/know/coin.webp')" class="popup-img" mode="heightFix"></image>
				<view class="popup-title" style="color: #3B444C;">申请置换成功</view>
				<view class="popup-text flex-1">
					<view class="text-center">
						本次申请置换商品总价格{{ exchangeTotal }}元，<br />
						请到【库存-已寄存】列表<br />
						进行查看置换信息。
					</view>
				</view>
				<view class="popup-buttons">
					<button class="bold fs-16 w-234 h-51 flex-center text-white rounded-x bg-base"
						@click="$c.goBack()">已寄存列表</button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'

	export default {
		components: {
			Title
		},
		data() {
			return {
				list: [],
				all: false,
				doSubmit: null,
				quantity: 1,
				profile: this.$c.profile(),
				showBuy: false,
				goods: {},
				showPassword: false,
				password: '',
				showAlert: false,
				showSuccess: false,
				exchangeGoods: {},
			}
		},
		computed: {
			// num() {
			// 	return this.list
			// 		.filter(item => item.status === true)
			// 		.reduce((sum, cur) => sum + cur.quantity, 0);
			// },
			// total() {
			// 	let total = this.list
			// 		.filter(item => item.status === true)
			// 		.reduce((sum, cur) => sum + cur.price * cur.quantity, 0);
			// 	return total.toFixed(2)
			// },
			exchangeTotal() {
				let total = this.exchangeGoods.exquantity * this.exchangeGoods.price
				return total ? total.toFixed(2) : '0.00'
			}
		},
		onLoad() {
			this.$c.checkeLogin(0)
			this.getInfo()
			this.getList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async getList() {
				const res = await this.$c.fetch(this.$api.goods.storeExchangeGoodsList)
				if (res) {
					// res.map(item => {
					// 	item.status = false
					// 	item.quantity = 1
					// });
					this.list = res
				}
			},
			async getInfo() {
				const res = await this.$c.fetch(this.$api.goods.storeExchangeInfo)
				if (res) {
					this.exchangeGoods = { ...res, exquantity: 1 }
					if (!res.quantity) this.showAlert = true
				}
			},
			onGoods(item) {
				// this.$set(item, 'status', !item.status)
				this.goods = item
			},
			onAll() {
				// this.all = !this.all
				// this.list.forEach(item => {
				// 	item.status = this.all;
				// });
			},
			onShowExchange() {
				// this.goods = this.list
				// 	.filter(item => item.status === true)
				// if (this.goods == 0) {
				// 	this.$c.toast('请选择要置换的商品')
				// 	return
				// }
				if (!this.goods.goods_sku_id) {
					this.$c.toast('请选择要置换的商品')
					return
				}
				if (!this.exchangeGoods.price || !this.goods.price) {
					this.$c.toast('数据加载失败')
					return
				}
				this.goods.quantity = this.divide(this.exchangeGoods.price * this.exchangeGoods.exquantity, this.goods.price)
				if (this.goods.quantity === false) {
					this.showAlert = true
					return
				}
				this.showBuy = true
			},
			async onSubmit() {
				this.showBuy = false
				const res = await this.$c.fetch(this.$api.goods.storeExchange, {
					quantity: this.exchangeGoods.exquantity,
					rep_goods_sku_id: this.goods.goods_sku_id
				})
				if (res) {
					this.showSuccess = true
				}
			},
			divide(a, b) {
			    const quotient = a / b
				// console.log(a, b, quotient)
			    return Number.isInteger(quotient) ? quotient : false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title_bg {
		background: linear-gradient(180deg, #FBE3C2 0%, #F8F8F8 99%);
	}

	.text-blue {
		color: #3769F4;
	}
</style>