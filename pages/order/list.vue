<template>
	<view class="page bg-page">
		<view class="title_box fixed top-0 left-0 pw-100 bg-page" style="z-index: 300;">
			<Title title="我的订单"></Title>
			<view class="pt-10 pb-20 plr-20 fs-12 flex-between">
				<view class="relative" :class="search.status == item.id ? 'active' : 'text-info'"
					v-for="item in navList" :key="item.id" @click="onNav(item.id)">{{ item.value }}</view>
			</view>
		</view>
		<view class="plr-20" :class="`pt-${top}`">
			<view class="p-13 bg-white rounded-18 mt-10" v-for="item in list" :key="item.id">
				<view class="flex-between mb-15" v-for="(i, index) in item.details" :key="i.index"
					@click="$c.goto(`/pages/order/detail?id=${item.id}`)">
					<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
					<view class="ml-7 flex-1">
						<view class="flex-between">
							<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							<text v-if="index === 0" class="fs-10 text-right"
								:style="{color: $c.formatStatus(item.status).color}">{{ $c.formatStatus(item.status).text }}</text>
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
				<view class="flex-between">
					<text class="fs-10 self-end lh-18" style="color: #FF8F1F;">{{ item.created_at }}后将自动取消订单</text>
					<view class="">
						<text class="fs-12">实付</text>
						<text class="fs-16 fw-7">￥{{ item.price }}</text>
					</view>
				</view>
				<view class="mt-20 flex-between">
					<view class="relative w-40 h-20">
						<text class="fs-12 text-info" @click="item.more = !item.more">更多</text>
						<view v-if="item.more" class="absolute left-0 bottom-0 more_box flex-center"
							style="z-index: 10;transform: translate(-13px, 22%);">
							<view class="fs-12" @click="id = item.id;item.more = false;showDelete = true">删除订单</view>
						</view>
					</view>
					<view class="flex-start">
						<u-button v-if="item.status == 1 || item.status == 2" class="btn btn-black" shape="circle" plain
							text="取消订单" @click="id = item.id; showCancel = true"></u-button>
						<!-- <u-button
							v-if="item.status > 3"
							class="btn btn-black"
							shape="circle"
							plain
							text="再来一单"
							@click="onAgain(item)"
						></u-button> -->
						<u-button v-if="item.status == 3" class="btn border-1 text-base" shape="circle" plain
							text="确认收货" @click="id = item.id; showReceive = true"></u-button>
						<u-button v-if="item.status == 1" class="btn border-1 text-base" shape="circle" plain text="去付款"
							@click="$c.goto(`/pages/goods/pay?id=${item.id}`)"></u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="h-100"></view>
		<u-modal :show="showCancel" title="提示" content='确定要取消该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showCancel = false" @confirm="doCancel"></u-modal>
		<u-modal :show="showDelete" title="提示" content='确定要删除该订单？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showDelete = false" @confirm="doDelete"></u-modal>
		<u-modal :show="showReceive" title="提示" content='确定要该订单已收货？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
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
				top: 0,
				list: [],
				search: {
					page: 1,
					limit: 10,
					status: 0,
					load: 'more'
				},
				navList: [{
						id: 0,
						value: '全部'
					},
					{
						id: 1,
						value: '待付款'
					},
					{
						id: 2,
						value: '待发货'
					},
					{
						id: 3,
						value: '待收货'
					},
					{
						id: 6,
						value: '已取消'
					},
				],
				id: null,
				showCancel: false,
				showDelete: false,
				showReceive: false,
				doCancel: null,
				doDelete: null,
				doReceive: null
			}
		},
		onLoad(p) {
			if (p.status) this.search.status = parseInt(p.status)
			this.doCancel = this.$c.onceRequest(this.onCancel)
			this.doDelete = this.$c.onceRequest(this.onDelete)
			this.doReceive = this.$c.onceRequest(this.onReceiving)
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title_box').then(res => {
					this.top = res.height
				})
			}, 100)
		},
		onShow() {
			this.int()
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			int() {
				this.search = {
					...this.search,
					...{
						page: 1,
						load: 'more'
					}
				}
				this.list = []
				this.getList()
			},
			onNav(e) {
				if (this.search.status == e) return
				if (this.search.load == 'loading') return
				this.search = {
					...this.search,
					...{
						page: 1,
						status: e,
						load: 'more'
					}
				}
				this.list = []
				this.getList()
			},
			async getList() {
				if (this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.goods.orderList, this.search)
				if (res) {
					res.map(item => {
						item.more = false
					})
					this.list = [...this.list, ...res]
					this.search.load = res.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if (this.search.load != 'end') this.search.load = 'more'
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
					this.int()
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
					this.int()
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
				}
			},
			async onAgain(item) {
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
	.active {
		&::after {
			content: '';
			display: block;
			width: 10px;
			height: 2px;
			background: #1A7E84;
			position: absolute;
			bottom: -4px;
			left: 0;
			right: 0;
			margin: auto;
		}
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