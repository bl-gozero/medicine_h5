<template>
	<view class="page bg-page lh-10">
		<Title title="仓储详情" fixed></Title>
		<view v-if="load" class="pt-10 plr-20">
			<view class="ptb-24 plr-14 rounded-14 text-base" style="background: linear-gradient(90deg, #FFFCEC 0%, #EBE8DB 100%);">
				<view class="fs-18 fw-7">已寄存</view>
				<view class="fs-12 mt-15">商品已寄存在仓库内</view>
			</view>
			<view class="mt-10 bg-white rounded-14 pb-20 plr-16">
				<view class="list_box">
					<view class="flex-between ptb-19">
						<image :src="order.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-7 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ order.goods_name }}</text>
							</view>
							<view class="mt-8 fs-12 text-info">{{ order.goods_sku_name }}</view>
							<view class="flex-between mt-15">
								<view v-if="order.price" class="text-danger fw-7">
									<text class="fs-10">￥</text>
									<text class="fs-14">{{ order.price }}</text>
								</view>
								<text v-if="order.quantity" class="text-info fs-12">×{{ order.quantity }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="fs-13">
					<view class="flex-between">
						<text class="text-info">来源方式</text>
						<text>自购存入</text>
					</view>
					<view v-if="order.order_number" class="flex-between mt-20">
						<text class="text-info">订单编号</text>
						<view class="flex-start" @click="$c.copy(order.order_number)">
							<text class="w-130 u-line-1">{{ order.order_number }}</text>
							<text class="mlr-5" style="color: #DFDFDF;">|</text>
							<text style="color: #1575F6;">复制</text>
						</view>
					</view>
					<view v-if="order.created_at" class="flex-between mt-20">
						<text class="text-info">下单时间</text>
						<text class="">{{ order.created_at }}</text>
					</view>
					<view v-if="order.paying_at" class="flex-between mt-20">
						<text class="text-info">付款时间</text>
						<text class="">{{ order.paying_at }}</text>
					</view>
					<view v-if="order.mailing_at" class="flex-between mt-20">
						<text class="text-info">发货时间</text>
						<text class="">{{ order.mailing_at }}</text>
					</view>
					<view v-if="order.receiving_at" class="flex-between mt-20">
						<text class="text-info">收货时间</text>
						<text class="">{{ order.receiving_at }}</text>
					</view>
					<view v-if="order.cancel_at" class="flex-between mt-20">
						<text class="text-info">取消时间</text>
						<text class="">{{ order.cancel_at }}</text>
					</view>
					<view v-else class="">
						<view v-if="order.status > 1" class="flex-between mt-20">
							<text class="text-info">支付方式</text>
							<text class="">{{ order.paying_mode }}</text>
						</view>
						<view class="flex-between mt-20">
							<text class="text-info">{{ order.status > 1 ? '付款' : '应付' }}</text>
							<text class="">￥{{ order.price }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="h-100"></view>
		<view 
			class="fixed bottom-0 left-0 pw-100 flex-end ptb-15 plr-20 bg-white border-box"
			style="z-index: 100;box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.09);"
		>
			<u-button class="btn" shape="circle" text="官方回购" @click="doSubmit('buy')"></u-button>
			<u-button class="btn" shape="circle" text="转赠他人" @click="doSubmit('transfer')"></u-button>
			<u-button class="btn fw-7 bg-base-change text-white" shape="circle" text="发货" @click="onShowShip()"></u-button>
		</view>

		<u-popup :show="showShip" mode="bottom" bgColor="transparent" closeable @close="showShip = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">申请发货</view>
				<view class="flex-between ptb-30 fs-12" @click="$c.goto('/pages/user/address?from=address')">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>
					<view v-if="address.district" class="flex-1 ml-8 mr-20">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-15 ">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<view v-else class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start"></u-icon>
				</view>
				<view class="h-10 bg-page"></view>
				<scroll-view scroll-y class="h-170 mt-20">
					<view class="flex-between">
						<image :src="order.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ order.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ order.goods_sku_name }}</view>
							<view class="flex-between mt-10 fs-12 text-info">
								<view v-if="order.price" class="">实付￥{{ order.price }}</view>
								<text v-if="order.quantity" class="">×{{ order.quantity }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<u-button class="btn-submit bg-base mt-40" shape="circle" text="确认地址并领取" @click="doSubmit('ship')"></u-button>
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
				id: 0,
				order: {},
				showShip: false,
				address: {},
				load: false,
				doSubmit: null
			}
		},
		onLoad(p) {
			if (p.id) this.id = parseInt(p.id)
			this.$c.removeStorage('address')
			this.getDetail()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if(address) this.address = address
		},
		methods: {
			async getDetail() {
				const res = await this.$c.fetch(this.$api.goods.orderDetail, {
					id: this.id
				})
				if (res) {
					this.order = res
					this.load = true
				}
			},
			async onSubmit(mode) {
				this.$c.toast('功能开发中')
			},
			onShowShip() {
				this.$c.toast('功能开发中')
				// if(!this.num) {
				// 	this.$c.toast('请选择商品')
				// 	return
				// }
				// this.showShip = true
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 82px;
		height: 35px;
		margin-left: 3px;
	}

	.more_box {

		/* 小三角形 */
		&::before {
			content: '';
			position: absolute;
			top: 99%;
			left: 20px;
			width: 0;
			height: 0;
			border-left: 10px solid transparent;
			border-right: 10px solid transparent;
			border-top: 10px solid #fff;
		}
	}
</style>