<template>
	<view class="page bg-page">
		<view class="title_bg pb-18 plr-20" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between">
				<text class="fw-7 fs-18">购物车</text>
				<text v-if="mode == 1" class="" @click="mode = 2">管理</text>
				<text v-else class="text-base" @click="mode = 1">退出管理</text>
			</view>
		</view>
		<view class="pt-11 plr-8">
			<view class="ptb-14 plr-12 rounded-12 flex-start bg-white mt-12" v-for="item in list" :key="item.id">
				<view class="" @click="item.status = !item.status">
					<u-icon v-if="item.status" name="checkmark-circle-fill" :color="$c.baseColor()" size="20"></u-icon>
					<view v-else class="circle"></view>
				</view>
				<image :src="item.picture" class="i-76 rounded-12 plr-9" mode="aspectFill"></image>
				<view class="flex-1">
					<view class="u-line-1 fw-5">{{ item.goods_name }}</view>
					<view class="mtb-8 fs-12 text-info">{{ item.goods_sku_name }}</view>
					<view class="flex-between">
						<view v-if="level > 2" class="pw-100">
							<text class="text-danger fs-10 fw-7">￥</text>
							<text class="text-danger fw-7">{{ item.vip_price }}</text>
							<!-- <text class="ml-4 text-base fs-10 fw-4 line-through">￥{{ item.price }}</text> -->
						</view>
						<view v-else class="pw-100">
							<text class="text-danger fs-10 fw-7">￥</text>
							<text class="text-danger fw-7">{{ item.price }}</text>
						</view>
						<u-number-box v-model="item.quantity" :name="item.id" bgColor="#fff"
							iconStyle="font-size: 10px;" inputWidth="29" :integer="true" asyncChange
							@change="onEdit"></u-number-box>
					</view>
				</view>
			</view>
		</view>
		<view :class="`h-${height}`"></view>
		<view class="total_box fixed pw-100 bottom-48 left-0 plr-20 ptb-9 flex-between fs-10 border-box bg-white"
			style="z-index: 10;">
			<view class="flex-start">
				<view class="" @click="onAll()">
					<u-icon v-if="all" name="checkmark-circle-fill" :color="$c.baseColor()" size="20"></u-icon>
					<view v-else class="circle"></view>
				</view>
				<text class="ml-10">全选</text>
			</view>
			<view v-if="mode == 1" class="flex-end">
				<text class="text-info">已选{{ num }}件</text>
				<text class="ml-10">合计：</text>
				<text class="text-danger fw-7">￥</text>
				<text class="text-danger fw-7 fs-14 mr-10">{{ total }}</text>
				<button class="bg-base-change fw-7 fs-14 text-white w-82 h-35 rounded-x" @click="doBuy">结算</button>
			</view>
			<view v-else class="">
				<button class="bg-danger fw-7 fs-14 text-white w-82 h-35 rounded-x" @click="onShowDelete()">删除</button>
			</view>
		</view>
		<u-modal :show="show" title="提示" content='确定要删除？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@click="onDelete()"></u-modal>
		<TabBar />
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue'
	export default {
		components: {
			TabBar
		},
		data() {
			return {
				mode: 1,
				level: 1,
				list: [],
				selectedIds: [],
				doEdit: null,
				height: 0,
				all: false,
				show: false,
				doBuy: null,
				address: {}
			}
		},
		computed: {
			num() {
				return this.list
					.filter(item => item.status === true)
					.reduce((sum, cur) => sum + cur.quantity, 0);
			},
			total() {
				let total = this.list
					.filter(item => item.status === true)
					.reduce((sum, cur) => sum + (this.level > 2 ? cur.vip_price : cur.price) * cur.quantity, 0);
				return total.toFixed(2)
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getProfile()
			this.addressList()
			this.doEdit = this.$c.onceRequest(this.onEdit)
			this.doBuy = this.$c.onceRequest(this.onBuy)
		},
		onShow() {
			this.getList()
		},
		onReady() {
			this.$uGetRect('.total_box').then(res => {
				this.height = 70 + res.height
			})
		},
		methods: {
			onAll() {
				this.all = !this.all
				this.list.forEach(item => {
					item.status = this.all;
				});
			},
			async getList() {
				const res = await this.$c.fetch(this.$api.goods.cartList)
				if (res) {
					res.map(item => {
						item.status = false
						if(item.quantity > item.limit_quantity) {
							item.quantity = item.limit_quantity
							this.onLimit(item)
						}
					});
					this.list = res
				}
			},
			async onLimit(item) {
				const res = await this.$c.fetch(this.$api.goods.cartEdit, {
					id: item.id,
					quantity: item.limit_quantity
				})
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if (res) {
					this.level = res.level.id
					this.$c.setStorage('profile', res)
				}
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.address = res.length > 0? res[0] : {} }
			},
			async onEdit(e) {
				const item = this.list.find(item => item.id == e.name)
				if(!item) return
				if(item.limit_quantity && item.limit_quantity < e.value) {
					this.$c.toast('当前商品限购' + item.limit_quantity + '件')
					e.value = item.limit_quantity
				}
				const res = await this.$c.fetch(this.$api.goods.cartEdit, {
					id: e.name,
					quantity: e.value
				})
				if (res) item.quantity = e.value
			},
			onShowDelete() {
				const ids = this.list.filter(item => item.status === true).map(item => item.id);
				if (ids.length == 0) {
					this.$c.toast('请选择要删除的商品')
					return
				}
				this.show = true
			},
			async onDelete() {
				const ids = this.list.filter(item => item.status === true).map(item => item.id);
				if (ids.length == 0) {
					this.$c.toast('请选择要删除的商品')
					return
				}
				const res = await this.$c.fetch(this.$api.goods.cartDelete, {
					id: ids
				})
				if (res) this.getList()
			},
			async onBuy() {
				const goods_sku = this.list
					.filter(item => item.status === true)
					.map(item => ({
						id: item.goods_sku_id,
						quantity: item.quantity,
						shopping_cart_id: item.id
					}))
				if(goods_sku.length == 0) {
					this.$c.toast('请选择要结算的商品')
					return
				}
				const res = await this.$c.fetch(this.$api.goods.orderAdd, {
					goods_sku: goods_sku,
					user_address_id: this.address.id
				})
				if (res) this.$c.goto(`/pages/order/pay?id=${res.id}`)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.title_bg {
		background: linear-gradient(180deg, #95C6C8 0%, #F7FAFF 99%);
	}

	.tabbar {
		box-shadow: none;
	}
</style>