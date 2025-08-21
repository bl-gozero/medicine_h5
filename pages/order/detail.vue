<template>
	<view class="page bg-page lh-10">
		<view class="absolute top-0 left-0 pw-100 h-218"
			style="background: linear-gradient(180deg, #92CBCE 4%, #DBEBEB 85%, rgba(219, 235, 235, 0) 100%);"></view>
		<Title title="订单详情" bgColor="tetransparent"></Title>
		<view class="pt-10 plr-20 relative" style="z-index: 2;">
			<view class="text-center" style="color: #064144;">
				<view class="fs-18 fw-7">{{ $c.formatStatus(order.status).text }}</view>
				<view class="fs-12 mt-14 lh-15 border-box" style="padding: 0 10%;">{{ $c.formatStatus(order.status, $c.calcTime(order.created_at, 30 * 60)).hint }}</view>
			</view>
			<view class="mt-20 bg-white rounded-12 plr-16 ptb-20 border-box">
				<view class="flex-between">
					<image src="/static/order/car.png" class="i-18 self-start"></image>
					<view class="ml-11 flex-1">
						<view>物流信息</view>
						<view v-if="order.waybill_number" class="mt-10 flex-between ">
							<text class="fs-12 text-info">{{ order.waybill_number }}</text>
							<image src="/static/order/copy.png" class="i-12" @click="$c.copy(order.waybill_number)"></image>
						</view>
						<view v-else class="mt-10 fs-12 text-info">暂无信息</view>
					</view>
				</view>
				<view class="flex-between mt-23">
					<image src="/static/order/address.png" class="i-18 self-start"></image>
					<view class="ml-11 flex-1">
						<view>{{ order.address }}</view>
						<view class="mt-10 fs-12 text-info">
							<text>{{ order.name }}</text>
							<text class="ml-15">{{ order.phone }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="mt-20 bg-white rounded-14 pb-20 plr-16">
				<view class="list_box">
					<view class="flex-between ptb-19" v-for="(i, index) in order.details" :key="i.index">
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
							</view>
						</view>
					</view>
				</view>
				<view class="fs-13">
					<view class="flex-between">
						<text class="text-info">订单编号</text>
						<view class="flex-start" @click="$c.copy(order.order_number)">
							<text class="w-130 u-line-1">{{ order.order_number }}</text>
							<text class="mlr-5" style="color: #DFDFDF;">|</text>
							<text style="color: #1575F6;">复制</text>
						</view>
					</view>
					<view class="flex-between mt-20">
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
		<view class="fixed bottom-0 left-0 pw-100 flex-between ptb-15 plr-20 bg-white border-box" style="z-index: 100;">
			<view class="relative w-40 h-20">
				<text class="fs-12 text-info" @click="showMore = !showMore">更多</text>
				<view v-if="showMore" class="absolute left-0 top-0 more_box flex-center"
					style="z-index: 10;transform: translate(-13px, -151%);">
					<view class="fs-12" @click="showMore = false;showDelete = true">删除订单</view>
				</view>
			</view>
			<view class="flex-start">
				<u-button v-if="order.status == 1" class="btn btn-black" shape="circle" plain
					text="取消订单" @click="showCancel = true"></u-button>
				<!-- <u-button v-if="order.status > 3" class="btn btn-black" shape="circle" plain text="再来一单"
					@click="onAgain()"></u-button> -->
				<u-button v-if="order.status == 3" class="btn bg-base text-white" shape="circle" plain text="确认收货"
					@click="showReceive = true"></u-button>
				<u-button v-if="order.status == 1" class="btn bg-base text-white" shape="circle" plain text="去付款"
					@click="$c.goto(`/pages/order/pay?id=${order.id}`)"></u-button>
			</view>
		</view>

		<u-modal :show="showCancel" title="提示" content='确定要取消该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showCancel = false" @confirm="doCancel"></u-modal>
		<u-modal :show="showDelete" title="提示" content='确定要删除该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showDelete = false" @confirm="doDelete"></u-modal>
		<u-modal :show="showReceive" title="提示" content='确定该订单已收货？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showReceive = false" @confirm="doReceive"></u-modal>
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
				showMore: false,
				showDelete: false,
				showCancel: false,
				showReceive: false,
				doCancel: null,
				doDelete: null,
				doReceive: null
			}
		},
		onLoad(p) {
			if (p.id) this.id = parseInt(p.id)
			this.getDetail()
			this.doCancel = this.$c.onceRequest(this.onCancel)
			this.doDelete = this.$c.onceRequest(this.onDelete)
			this.doReceive = this.$c.onceRequest(this.onReceiving)
		},
		methods: {
			async getDetail() {
				const res = await this.$c.fetch(this.$api.goods.orderDetail, {
					id: this.id
				})
				if (res) {
					this.order = res
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
			async onDelete() {
				this.showCancel = false
				this.showDelete = false
				this.showReceive = false
				const res = await this.$c.fetch(this.$api.goods.orderDelete, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.$c.goBack()
				}
			},
			async onReceiving() {
				this.showCancel = false
				this.showDelete = false
				this.showReceive = false
				const res = await this.$c.fetch(this.$api.goods.orderReceiving, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.getDetail()
				}
			},
			async onAgain() {
				// const res = await this.$c.fetch(this.$api.goods.orderAdd, { 
				// 	goods_sku: [{ id: this.sku.id, quantity: item., shopping_cart_id: 0 }],
				// 	user_address_id: 0
				// })
				// if(res) {
				// 	this.$c.goto(`/pages/goods/pay?id=${res.id}`)
				// }
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 95px;
		height: 40px;
		margin-left: 5px;
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