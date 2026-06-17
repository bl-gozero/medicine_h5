<template>
	<view class="page bg-page">
		<view class="relative">
			<u-swiper :list="goods.picture" height="375"></u-swiper>
			<view class="">
				<image src="/static/goods/back.png" class="i-24 absolute left-20" :class="'top-' + $c.barHeight()"
					@click="$c.goBack()"></image>
			</view>
		</view>
		<view class="plr-20 ptb-16 bg-white">
			<view class="flex-between">
				<view class="text-num">
					<text class="fs-24 fw-7">{{ sku.price }}颗</text>
					<text class="fs-12">幸运星</text>
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
			<view class="text-center fw-5 ptb-18">礼品详情</view>
			<u--image :src="item" v-for="(item, index) in goods.details" :key="index" width="100%" height="auto"
				bgColor="transparent" mode="widthFix">
				<template v-slot:loading>
					<u-loading-icon color="#9F9F9F" class="mtb-100"></u-loading-icon>
				</template>
			</u--image>
		</view>
		<view class="h-100"></view>
		<view class="fixed left-0 bottom-0 x-100 flex-between plr-20 ptb-10 bg-white border-box">
			<view class="text-center relative" @click="$c.goto('/pages/index/web')">
				<image src="/static/goods/cs.png" class="i-24 auto"></image>
				<view class="fs-10 text-base mt-1">客服</view>
			</view>
			<view class="flex-start">
				<button class="bg-base-change fw-7 fs-14 text-white w-200 h-41 flex-center rounded-x"
					@click="onChooseMode(2)">兑换</button>
			</view>
		</view>

		<!-- 选购 -->
		<u-popup :show="showInfo" mode="bottom" round="20" closeable @close="showInfo = false">
			<view class="p-20 fs-12 bg-address lh-10">
				<view class="text-center fs-18 fw-5">收货地址</view>
				<view class="flex-start ptb-30 border-bottom">
					<image v-if="sku.picture" :src="sku.picture[0]" class="i-76 rounded-12" mode="aspectFill"></image>
					<view class="ml-9 flex-1">
						<view class="">{{ sku.name }}</view>
						<view class="text-num mt-34">
							<text class="fs-16 fw-7">{{ sku.price }}颗</text>
							<text class="fs-12">幸运星</text>
						</view>
					</view>
				</view>
				<view class="flex justify-between ptb-30 border-bottom" style="align-items: flex-start;"
					@click="$c.goto('/pages/user/address?from=goodsDetail')">
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
				<view class="mt-5 flex-center mt-50 text-num">
					<image :src="img('star.webp')" class="i-22"></image>
					<text class="fs-12 fw-7 lh-10">我的幸运星：{{ star.lucky_star }}颗 </text>
				</view>
				<button class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-14 flex-center rounded-x"
					@click="doBuy">确认地址并兑换</button>
				<view class="h-30"></view>
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
				profile: {},
				id: null,
				goods: {},
				sku: {},
				address: {},
				mode: 0,
				showInfo: false,
				quantity: 1,
				doBuy: null,
				orderId: null,
				star: {
					lucky_star: 0,
					total_lucky_star: 0,
					completed: 0
				},
			}
		},
		async onLoad(p) {
			this.$c.removeStorage('address')
			const profile = await this.$c.checkeLogin(1)
			if (profile && p.id && parseInt(p.id)) {
				this.profile = profile
				this.id = parseInt(p.id)
				this.getVideoInfo()
				this.goodsDetail()
			}
			this.doBuy = this.$c.onceRequest(this.onBuy)
		},
		onShow() {
			this.addressList()
		},
		methods: {
			async getVideoInfo() {
				const res = await this.$c.fetch(this.$api.event.videoInfo)
				if (res) this.star = res
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
			onChooseMode(n) {
				this.mode = n
				this.showInfo = true
			},
			async onBuy() {
				const res = await this.$c.fetch(this.$api.event.videoReceive, {
					address_id: this.address.id,
					goods_sku_id: this.sku.id
				})
				if (res) {
					await this.$c.toast('兑换成功')
					this.$c.goBack()
				}
			},
			// async onBuy() {
			// 	this.showPassword = false
			// 	if (!this.orderId) {
			// 		const res = await this.$c.fetch(this.$api.goods.orderAdd, {
			// 			goods_sku: [{
			// 				id: this.sku.id,
			// 				quantity: this.quantity,
			// 				shopping_cart_id: 0
			// 			}],
			// 			user_address_id: this.address.id
			// 		})
			// 		if (res) this.orderId = res.id
			// 	}
			// 	if (this.orderId) this.onPay()
			// },
			// async onPay() {
			// 	this.showInfo = false
			// 	const res = await this.$c.fetch(this.$api.goods.orderPay, {
			// 		id: this.orderId,
			// 		paying_mode: this.paying_mode,
			// 		password: this.password
			// 	})
			// 	if (res) {
			// 		if (res.jump_url) {
			// 			// this.$c.setStorage('web', { title: '支付', src: res.jump_url })
			// 			// this.$c.goto('/pages/index/web?type=pay')
			// 			this.$c.quickPay(res.jump_url)
			// 		} else {
			// 			this.$c.goto('/pages/point/order')
			// 		}
			// 	}
			// },
			img(path) {
				let imgPath = '/static/avtivity/video/' + path
				return this.$c.img(imgPath, 0)
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
	.text-num {
		color: #B2611C !important;
	}
</style>