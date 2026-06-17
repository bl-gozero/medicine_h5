<template>
	<view class="page bg-page lh-10">
		<view class="absolute top-0 left-0 x-100 h-218 order_detail_bg"></view>
		<Title title="订单详情" bgColor="tetransparent"></Title>
		<view class="pt-10 plr-20 relative" style="z-index: 2;">
			<view class="order_detail_text">
				<view class="fs-18 fw-7">{{ $c.formatPointStatus(order.status).text }}</view>
				<view class="fs-12 mt-14 lh-15 border-box">
					{{ $c.formatPointStatus(order.status, $c.calcTime(order.created_at, 30 * 60)).hint }}</view>
			</view>
			<view v-if="order.address" class="mt-20 bg-white rounded-12 plr-16 ptb-20 border-box">
				<view class="flex-between">
					<image src="/static/order/car.png" class="i-18 self-start"></image>
					<view class="ml-11 flex-1">
						<view>物流信息</view>
						<view v-if="order.waybill_number" class="mt-10 flex-between ">
							<view class="flex-start" @click="$c.copy(order.waybill_number)">
								<text class="fs-12 text-info">{{ order.waybill_number }}</text>
								<image src="/static/order/copy.png" class="i-12 ml-10"></image>
							</view>
							<button
								class="w-52 h-23 bg-base text-white fs-12 self-start m-0 ml-10 p-0 flex-center rounded-x"
								@click="$c.goto('/pages/index/express', 1, { id: order.id, mode: 1, number: order.waybill_number })">查询</button>
						</view>
						<view v-else class="mt-10 fs-12 text-info">暂无信息</view>
						<!-- <view v-if="express.AcceptStation" class="lh-15 mt-15 fs-12 text-info">
							<view class="">{{ express.AcceptTime }}</view>
							<view class="mt-8">{{ express.AcceptStation }}</view>
						</view> -->
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
			<view class="mt-20 bg-white rounded-14 ptb-20 plr-16">
				<view class="list_box">
					<view class="flex-between pb-19" v-for="(i, index) in order.details" :key="i.index">
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
							<text class="">积分</text>
						</view>
						<view class="flex-between mt-20">
							<text class="text-info">{{ order.status > 1 ? '付款' : '应付' }}</text>
							<text class="">{{ order.price }}积分</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="h-100"></view>
		<view class="fixed bottom-0 left-0 x-100 flex-between ptb-15 plr-20 bg-white border-box" style="z-index: 100;">
			<view class="relative w-40 h-20">
				<text class="fs-12 text-info" @click="showMore = !showMore">更多</text>
				<view v-if="showMore" class="absolute left-0 top-0 more_box flex-center"
					style="z-index: 10;transform: translate(-13px, -151%);">
					<view class="fs-12" @click="showMore = false;showDelete = true">删除订单</view>
				</view>
			</view>
			<view class="flex-start">
				<button v-if="order.status == 1" class="btn btn-black border-plain" plain
					@click="showCancel = true">取消订单</button>
				<button v-if="order.status == 2" class="btn bg-base text-white"
					@click="showShip = true">申请发货</button>
				<button v-if="order.status == 3" class="btn bg-base text-white"
					@click="showReceive = true">确认收货</button>
				<button v-if="order.status == 1" class="btn bg-base text-white"
					@click="$c.goto(`/pages/point/pay?id=${order.id}`)">去付款</button>
			</view>
		</view>

		<u-modal :show="showCancel" title="提示" content='确定要取消该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showCancel = false" @confirm="doCancel"></u-modal>
		<u-modal :show="showDelete" title="提示" content='确定要删除该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showDelete = false" @confirm="doDelete"></u-modal>
		<u-modal :show="showReceive" title="提示" content='确定该订单已收货？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showReceive = false" @confirm="doReceive"></u-modal>

		<u-popup :show="showShip" mode="bottom" :round="20" closeable @close="showShip = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">申请发货</view>
				<view class="flex-between ptb-30 fs-12" @click="$c.goto('/pages/user/address?from=address')">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>
					<view v-if="address.district" class="flex-1 ml-8 mr-20">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-10">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<view v-else class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start"></u-icon>
				</view>
				<view class="h-10 bg-page"></view>
				<view class="mt-20 fw-5">订单号：{{ order.order_number }}</view>
				<scroll-view scroll-y class="h-170 mt-20">
					<view class="flex-between" v-for="(i, index) in order.details" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<view class="flex-between mt-10 fs-12 text-info">
								<view class="">{{ i.price }}积分</view>
								<text class="">×{{ i.quantity }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
				<button class="btn-submit bg-base mt-40" @click="doShip">确认地址并领取</button>
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
				showMore: false,
				showDelete: false,
				showCancel: false,
				showReceive: false,
				showShip: false,
				showStore: false,
				doCancel: null,
				doDelete: null,
				doReceive: null,
				doShip: null,
				doStore: null,
				address: {},
				load: false,
				express: {}
			}
		},
		onLoad(p) {
			if (p.id) this.id = parseInt(p.id)
			this.$c.removeStorage('address')
			this.addressList()
			this.doCancel = this.$c.onceRequest(this.onCancel)
			this.doDelete = this.$c.onceRequest(this.onDelete)
			this.doReceive = this.$c.onceRequest(this.onReceiving)
			this.doShip = this.$c.onceRequest(this.onShip)
			this.doStore = this.$c.onceRequest(this.onStore)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if (address) this.address = address
			this.getDetail()
		},
		methods: {
			async getDetail() {
				const res = await this.$c.fetch(this.$api.goods.orderDetail, {
					id: this.id
				})
				if (res) {
					this.order = res
					// if(res.waybill_number) this.express = await this.$c.getExpress(res.id, 1)
					this.load = true
				}
			},
			async onCancel() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderCancel, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.getDetail()
				}
			},
			async onDelete() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderDelete, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.$c.goBack()
				}
			},
			async onReceiving() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderReceiving, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.getDetail()
				}
			},
			async onAgain() {
				const goods_sku = this.order.details.map(i => ({
					id: i.goods_sku_id,
					quantity: i.quantity,
					shopping_cart_id: 0
				}))
				const res = await this.$c.fetch(this.$api.goods.orderAdd, {
					goods_sku: goods_sku,
					user_address_id: 0
				})
				if (res) this.$c.goto(`/pages/order/pay?id=${res.id}`)
			},
			cancelShow() {
				this.showCancel = false
				this.showDelete = false
				this.showReceive = false
				this.showShip = false
				this.showStore = false
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if (res) {
					this.address = res.length > 0 ? res[0] : {}
				}
			},
			async onShip() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderShip, {
					id: this.order.id,
					address_id: this.address.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.getDetail()
				}
			},
			async onStore() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderStore, {
					id: this.id
				})
				if (res) {
					this.$c.toast('寄存成功')
					this.getDetail()
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 95px;
		height: 40px;
		margin-left: 5px;
		font-size: 14px;
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