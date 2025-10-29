<template>
	<view class="page bg-page">
		<Title title="我的仓库"></Title>
		<view class="plr-30 mt-10">
			<view class="flex-start fs-12 text-info nav_box pl-10">
				<view class="relative" :class="nav == 1 && 'nav_active text-black'" @click="onNav(1)">已寄存</view>
				<view class="relative w-65" :class="nav == 2 && 'nav_active text-black'" @click="onNav(2)">
					<text>发货-{{ ships[shipIndex]? ships[shipIndex].value : '' }}</text>
					<view v-if="showShipItem" class="ship_box">
						<view 
							:class="shipIndex == index && 'text-black'"
							v-for="(item, index) in ships"
							:key="item.id"
							@click.stop="onShipItem(index)"
						>{{ item.value }}</view>
					</view>
				</view>
				<view class="relative" :class="nav == 3 && 'nav_active text-black'" @click="onNav(3)">已赠出</view>
				<view class="relative" :class="nav == 4 && 'nav_active text-black'" @click="onNav(4)">已回购</view>
			</view>
		</view>
		<view class="pt-11 plr-8">
			<view class="ptb-14 plr-12 rounded-12 flex-start bg-white mt-12" v-for="item in list" :key="item.id">
				<image :src="$c.checkIcon(item.status)" class="i-18 self-start" @click="item.status = !item.status"></image>
				<view class="flex-1 ml-8">
					<view class="flex-between">
						<text class="fs-12 fw-5">自购存入</text>
						<text class="fs-10">已寄存</text>
					</view>
					<view class="flex-between mt-14">
						<image :src="item.picture" class="i-57 rounded-12 mr-10" mode="aspectFill"></image>
						<view class="flex-1 fs-12 text-info">
							<view class="fw-5 fs-14 text-black">{{ item.goods_name }}</view>
							<view class="mtb-3">{{ item.goods_sku_name }}</view>
							<view class="">订单号：{{ item.order_number }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view :class="`h-${height}`"></view>
		<view class="total_box fixed pw-100 bottom-0 left-0 plr-20 ptb-9 flex-between fs-10 border-box bg-white"
			style="z-index: 10;">
			<view class="">
				<view class="flex-start">
					<image :src="$c.checkIcon(all)" class="i-18" @click="onAll()"></image>
					<text class="ml-10">全选</text>
				</view>
				<view class="fs-10 text-info mt-6 text-center">已选{{ num }}件</view>
			</view>
			<view class="flex-end">
				<u-button class="btn" shape="circle" text="官方回购" @click="doSubmit('buy')"></u-button>
				<u-button class="btn" shape="circle" text="转赠他人" @click="doSubmit('transfer')"></u-button>
				<u-button class="btn fw-7 bg-base-change text-white" shape="circle" text="发货" @click="onShowShip()"></u-button>
			</view>
		</view>
		
		<u-modal :show="show" title="提示" content='确定要删除？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="show = false" @confirm="onDelete()"></u-modal>
			
		<u-popup :show="showShip" mode="bottom" bgColor="transparent" closeable @close="showShip = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">仓库发货</view>
				<view class="flex-between ptb-30 fs-12" @click="$c.goto('/pages/user/address?from=address')">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>
					<view class="flex-1 ml-8 mr-20">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-15 ">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start"></u-icon>
				</view>
				<view class="h-10 bg-page"></view>
				<view class="mt-20 fw-5">共计{{ num }}件</view>
				<scroll-view scroll-y class="h-170 mt-20">
					<view class="flex-between mb-20" v-for="(i, index) in order" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<view class="flex-end mt-10 fs-12 text-info">
								<!-- <view class="">实付￥{{ i.price }}</view> -->
								<text class="">×{{ i.quantity }}</text>
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
				nav: 1,
				showShipItem: false,
				showShip: false,
				shipIndex: 0,
				ships: [
					{ id: 0, value: "全  部"},
					{ id: 1, value: "待发货"},
					{ id: 2, value: "待收货"},
					{ id: 3, value: "已收货"},
				],
				height: 0,
				list: [],
				all: false,
				show: false,
				address: {},
				doSubmit: null,
				page: 1,
				status: 'more',
				limit: 10
			}
		},
		computed: {
			num() {
				return this.list
					.filter(item => item.status === true)
					.reduce((sum, cur) => sum + 1, 0);
			},
			order() {
				return this.list
					.filter(item => item.status === true)
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getList()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if(address) this.address = address
		},
		onReady() {
			this.$uGetRect('.total_box').then(res => { this.height = res.height })
		},
		methods: {
			onAll() {
				this.all = !this.all
				this.list.forEach(item => { item.status = this.all });
			},
			onNav(n) {
				if(n != 0) return
				if(n == 2) {
					this.showShipItem = !this.showShipItem
				} else if(this.nav != n) {
					this.showShipItem = false
					this.nav = n
				}
			},
			onShipItem(n) {
				this.shipIndex = n
				this.nav = 2
				this.showShipItem = false
			},
			onShowShip() {
				this.$c.toast('功能开发中')
				// if(!this.num) {
				// 	this.$c.toast('请选择商品')
				// 	return
				// }
				// this.showShip = true
			},
			async getList() {
				if(this.status != 'more') return
				this.status = 'load'
				const res = await this.$c.fetch(this.$api.goods.storeList, {
					page: this.page,
					limit: this.limit
				})
				if (res) {
					res.map(item => { item.status = false })
					this.list = [...this.list, ...res]
					this.status = res.length >= this.limit ? 'more' : 'end'
					this.page++
				}
				this.status = this.status == 'end' ? this.status : 'more'
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.address = res.length > 0? res[0] : {} }
			},
			async onSubmit(mode) {
				this.$c.toast('功能开发中')
			}
		}
	}
</script>

<style lang="scss" scoped>	
	.nav_box > view {
		margin-right: 30px;
	}
	
	.ship_box {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		margin: 0 auto;
		transform: translateY(105%);
		background: #fff;
		text-align: center;
		border-radius: 4px;
		padding-bottom: 7px;
		transition: all 0.3s ease;
	}
	
	.ship_box > view {
		padding-top: 7px;
	}
	
	.btn {
		width: 82px;
		height: 35px;
		margin-left: 3px;
	}
</style>