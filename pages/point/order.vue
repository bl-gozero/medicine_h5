<template>
	<view class="page bg-page">
		<Title title="兑换记录" fixed @back="$c.goBack()" />
		<view class="plr-20 mt-10">
			<view 
				class="bg-white rounded-8 p-8 mb-10" 
				v-for="item in list" 
				:key="item.id" 
			>
				<view 
					class="flex-between details" v-for="(i, index) in item.details" 
					:key="i.goods_sku_id" 
					@click="$c.goto(`/pages/point/orderDetail?id=${item.id}`)"
				>
					<image :src="i.picture" class="i-70 rounded-10" mode="aspectFill"></image>
					<view class="flex-1 ml-10 text-info fs-12">
						<view class="flex-between">
							<view class="u-line-1 fw-5 text-black flex-1">{{ i.goods_name }}</view>
							<text v-if="index === 0" class="fs-10 text-right ml-10"
								:style="{color: $c.formatStatus(item.status).color}">{{ $c.formatStatus(item.status).text }}</text>
						</view>
						<view class="mt-4">{{ i.price }}积分 ×{{ i.quantity }}</view>
						<view class="mt-4">{{ item.created_at }}</view>
					</view>
				</view>
				<view class="mt-10 flex-between">
					<view class="relative w-40 h-20">
						<text class="fs-12 text-info" @click="item.more = !item.more">更多</text>
						<view v-if="item.more" class="absolute left-0 bottom-0 more_box flex-center"
							style="z-index: 10;transform: translate(-13px, 22%);">
							<view class="fs-12" @click="id = item.id;item.more = false;showDelete = true">删除订单</view>
						</view>
					</view>
					<view class="flex-start">
						<u-button v-if="item.status == 1" class="btn btn-black" shape="circle" plain
							text="取消订单" @click="id = item.id; showCancel = true"></u-button>
						<!-- <u-button v-if="item.status == 4 || item.status == 6" class="btn btn-black" shape="circle" plain
							text="再来一单" @click="onAgain(item)" ></u-button> -->
						<u-button v-if="item.status == 3" class="btn border-1 text-base" shape="circle" plain
							text="确认收货" @click="id = item.id; showReceive = true"></u-button>
						<u-button v-if="item.status == 1" class="btn border-1 text-base" shape="circle" plain text="去付款"
							@click="$c.goto(`/pages/point/pay?id=${item.id}`)"></u-button>
						
						<!-- <u-button v-if="item.status == 2" class="btn btn-black" shape="circle" plain
							text="寄存仓库" @click="id = item.id; showStore = true"></u-button> -->
						<u-button v-if="item.status == 2" class="btn border-1 text-base" shape="circle" plain
							text="申请发货" @click="onShowShip(item)"></u-button>
							
						<!-- <u-button v-if="item.status == 9" class="btn btn-black" shape="circle" plain
							text="我的仓库" @click="$c.goto('/pages/store/index')"></u-button> -->
					</view>
				</view>
			</view>
		</view>
		<view class="h-50"></view>
		
		<u-modal :show="showCancel" title="提示" content='确定要取消该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showCancel = false" @confirm="doCancel"></u-modal>
		<u-modal :show="showDelete" title="提示" content='确定要删除该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showDelete = false" @confirm="doDelete"></u-modal>
		<u-modal :show="showReceive" title="提示" content='确定该订单已收货？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showReceive = false" @confirm="doReceive"></u-modal>
		<u-modal :show="showStore" title="提示" content='确定寄存该订单商品？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showStore = false" @confirm="doStore"></u-modal>
		
		<u-popup :show="showShip" mode="bottom" bgColor="transparent" closeable @close="showShip = false">
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
				<u-button class="btn-submit bg-base mt-40" shape="circle" text="确认地址并领取" @click="doShip"></u-button>
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
				list: [],
				form: { page: 1, limit: 10, status: 0, is_integral: 1 },
				status: 'more',
				id: null,
				showCancel: false,
				showDelete: false,
				showReceive: false,
				showShip: false,
				showStore: false,
				doCancel: null,
				doDelete: null,
				doReceive: null,
				doShip: null,
				doStore: null,
				order: {},
				address: {}
			}
		},
		onLoad() {
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
			if(address) this.address = address
			if(!this.showShip) this.int()
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			cancelShow() {
				this.showCancel = false
				this.showDelete = false
				this.showReceive = false
				this.showShip = false
				this.showStore = false
			},
			int() {
				this.form.page = 1
				this.status = 'more'
				this.list = []
				this.getList()
			},
			async getList() {
				if(this.status != 'more') return
				this.status = 'loading'
				const res = await this.$c.fetch(this.$api.goods.orderList, this.form)
				if (res) {
					res.map(item => { item.more = false })
					this.list = [...this.list, ...(res || [])]
					this.status = res.length >= this.form.limit ? 'more' : 'end'
					this.form.page++
				}
				if(this.status != 'end') this.status = 'more'
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.address = res.length > 0? res[0] : {} }
			},
			async onCancel() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderCancel, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.int()
				}
			},
			async onDelete() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderDelete, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.int()
				}
			},
			async onReceiving() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderReceiving, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.int()
				}
			},
			async onAgain(item) {
				const goods_sku = item.details.map(i => ({
					id: i.goods_sku_id,
					quantity: i.quantity,
					shopping_cart_id: 0
				}))
				const res = await this.$c.fetch(this.$api.goods.orderAdd, { 
					goods_sku: goods_sku,
					user_address_id: 0
				})
				if(res) this.$c.goto(`/pages/order/pay?id=${res.id}`)
			},
			async onShowShip(item) {
				const res = await this.$c.fetch(this.$api.goods.orderDetail, {
					id: item.id
				})
				if(res) {
					this.order = res
					this.showShip = true
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
					this.int()
				}
			},
			async onStore() {
				this.cancelShow()
				const res = await this.$c.fetch(this.$api.goods.orderStore, {
					id: this.id
				})
				if (res) {
					this.$c.toast('寄存成功')
					this.int()
				}
			},
		}
	}
</script>

<style>
	.details:not(:first-child) {
		margin-top: 10px;
	}
	.btn {
		width: 65px;
		height: 26px;
		margin-left: 5px;
	}
	::v-deep .u-button__text {
		font-size: 12px !important;
	}
</style>