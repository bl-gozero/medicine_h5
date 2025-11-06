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
		<view class="h-65"></view>
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
				<u-button class="btn" shape="circle" text="官方回购" @click="onShowEvent('buy')"></u-button>
				<u-button class="btn" shape="circle" text="转赠他人" @click="onShowEvent('transfer')"></u-button>
				<u-button class="btn fw-7 bg-base-change text-white" shape="circle" text="发货" @click="onShowEvent('ship')"></u-button>
			</view>
		</view>
		
		<u-modal :show="show" title="提示" content='确定要删除？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="show = false" @confirm="onDelete()"></u-modal>
		
		<!-- 发货 -->
		<u-popup :show="showShip" mode="bottom" bgColor="transparent" closeable @close="showShip = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">仓库发货</view>
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
				<view class="mt-20 fw-5">共计{{ num }}件</view>
				<scroll-view scroll-y class="h-170 mt-20">
					<view class="flex-between mb-20" v-for="(i, index) in order" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<!-- <view class="flex-end mt-10 fs-12 text-info">
								<text class="">×{{ i.quantity }}</text>
							</view> -->
						</view>
					</view>
				</scroll-view>
				<u-button class="btn-submit bg-base mt-40" shape="circle" text="确认地址并领取" @click="doSubmit('ship')"></u-button>
			</view>
		</u-popup>
		
		<!-- 转增 -->
		<u-popup :show="showTransfer" mode="bottom" bgColor="transparent" closeable @close="showTransfer = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">转赠他人</view>
				<view class="ptb-20 flex-between border-bottom border-top mt-20">
					<view class="">对方账户</view>
					<u-input v-model.number="to_account" placeholder="手机号/账号" placeholderClass="fs-14 text-info"
						border="none" class="flex-1 mlr-24"></u-input>
					<image src="/static/finance/account.webp" class="i-23"></image>
				</view>
				<view class="fs-12 p-12 border-box rounded-8 mtb-15 lh-15" style="background: #F0ECE1;color: #99935C;">
					<view class="fw-7 flex-start">
						<u-icon name="bell-fill" color="#9D9762" size="14"></u-icon>
						<text class="ml-3">温馨提示</text>
					</view>
					<view class="">仓库内产品可转赠其他用户，转赠后所有权即时转移且不可撤销。请核对受赠人信息，平台仅提供服务，不承担操作失误责任。</view>
				</view>
				<view class="h-10 bg-page"></view>
				<view class="mt-20 fw-5">共计{{ num }}件</view>
				<scroll-view scroll-y class="h-140 mt-20">
					<view class="flex-between mb-20" v-for="(i, index) in order" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<!-- <view class="flex-end mt-10 fs-12 text-info">
								<text class="">×{{ i.quantity }}</text>
							</view> -->
						</view>
					</view>
				</scroll-view>
				<u-button class="btn-submit bg-base mt-40" shape="circle" text="填写账号并转赠" @click="doSubmit('transfer')"></u-button>
			</view>
		</u-popup>
		
		<!-- 回购 -->
		<u-popup :show="showBuy" mode="bottom" bgColor="transparent" closeable @close="showBuy = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">官方回购</view>
				<view class="mt-30">回购总价：￥345.88</view>
				<view class="fs-12 p-12 border-box rounded-8 mtb-15 lh-15" style="background: #F0ECE1;color: #99935C;">
					<view class="fw-7 flex-start">
						<u-icon name="bell-fill" color="#9D9762" size="14"></u-icon>
						<text class="ml-3">温馨提示</text>
					</view>
					<view class="">平台提供官方回购服务，用户可按规定将仓库内产品出售给平台以补充库存。回购期结束后，产品价格将上调 5%–20%；回购期开放时间将根据货物储备量及市场情况灵活调整。到账方式为账户余额</view>
				</view>
				<view class="h-10 bg-page"></view>
				<view class="mt-20 fw-5">共计{{ num }}件</view>
				<scroll-view scroll-y class="h-140 mt-20">
					<view class="flex-between mb-20" v-for="(i, index) in order" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<view class="mt-10 flex-start">
								<view class="buy_price">￥156431</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<u-button class="btn-submit bg-base mt-40" shape="circle" text="申请回购" @click="onClose();showBuyConfirm = true"></u-button>
			</view>
		</u-popup>
		
		<!-- 转增成功 -->
		<u-popup :show="showTransferResult" mode="center" bgColor="transparent" @close="showTransferResult = false;">
			<view class="w-308 h-280 sign_reward_box rounded-20 text-center">
				<image src="/static/point/tranfer_1.webp" class="w-140 h-102" style="margin-top: -53px;"></image>
				<view class="fw-7 fs-18 mt-20 text-base">转赠成功</view>
				<view class="text-center fs-14 text-info lh-15 mt-20">
					<view class="">已将指定产品转赠给</view>
					<view class="">对方账号：{{ to_account }}</view>
				</view>
				<button
					class="bg-black bold fs-16 flex-center text-white w-234 h-51 rounded-x mt-30"
					@click="showTransferResult = false;"
				>知道了</button>
			</view>
		</u-popup>
		
		<!-- 确认回购 -->
		<u-popup :show="showBuyConfirm" mode="center" bgColor="transparent" @close="showBuyConfirm = false;">
			<view class="w-308 pb-25 rounded-20 text-center plr-20 border-box" style="background: linear-gradient(180deg, #FFEFCE 0%, #FFFFFF 93%);">
				<image src="/static/point/ring.webp" class="w-127 h-125" style="margin-top: -62px;"></image>
				<view class="fw-7 fs-18 text-base">回购提醒</view>
				<view class="mt-25 fs-14 plr-7 lh-15">平台数据显示，未来几天产品价格预计将<text class="fw-7">上涨约 10</text>%，请谨慎操作！</view>
				<view class="flex-between mt-60" style="gap: 10px;">
					<u-button class="fs-16 fw-7 w-135 h-51" shape="circle" @click="doSubmit('buy')">我已确认</u-button>
					<u-button class="fs-16 fw-7 w-135 h-51 bg-base text-white" shape="circle" @click="showBuyConfirm = false">暂时取消</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import AddressPicker from '../../components/AddressPicker.vue';
	
	export default {
		components: {
			Title,
			AddressPicker
		},
		data() {
			return {
				nav: 1,
				showShipItem: false,
				showShip: false,
				shipIndex: 0,
				showTransfer: false,
				showBuy: false,
				showTransferResult: false,
				showBuyConfirm: false,
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
				address_id: null,
				doSubmit: null,
				page: 1,
				status: 'more',
				limit: 10,
				address: {},
				to_account: null
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
			this.init()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if(address) this.address = address
		},
		onReachBottom() {
			this.getList()
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
			onClose() {
				this.showBuy = false
				this.showShip = false
				this.showTransfer = false
				this.showTransferResult = false
			},
			onShipItem(n) {
				this.shipIndex = n
				this.nav = 2
				this.showShipItem = false
			},
			onShowEvent(e) {
				// this.$c.toast('未到开放时间')
				this.onClose()
				if(!this.num) {
					this.$c.toast('请选择商品')
					return
				}
				if(e == 'ship') this.showShip = true
				if(e == 'transfer') this.showTransfer = true
				if(e == 'buy') this.showBuy = true
			},
			init() {
				if(this.status == 'load') return
				this.status = 'more'
				this.list = []
				this.page = 1
				this.getList()
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
				// this.$c.toast('未到开放时间')
				this.onClose()
				if(mode == 'transfer') {
					if(!this.order.length) {
						this.$c.toast('请选择转增产品')
						return
					}
					if(!this.to_account) {
						this.$c.toast('请填写转增账号')
						return
					}
					const ids = this.order.map(item => item.id)
					const res = await this.$c.fetch(this.$api.goods.storeTransfer, { id: ids, to_account: this.to_account })
					if(res) {
						this.showTransferResult = true
						this.init()
					}
				}
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
	
	.buy_price {
		height: 25px;
		line-height: 25px;
		padding: 0 11px 0 27px;
		font-size: 16px;
		font-weight: 700;
		background: #FFF3D7;
		color: #723E02;
		border-radius: 999px;
		position: relative;
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 27px;
			height: 25px;
			background-image: url('/static/point/buy.webp');
			background-size: 100% 100%;
		}
	}
</style>