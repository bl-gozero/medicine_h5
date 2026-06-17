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
			class="fixed bottom-0 left-0 x-100 flex-end ptb-15 plr-20 bg-white border-box"
			style="z-index: 100;box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.09);"
		>
			<view><button class="btn" @click="doSubmit('buy')">官方回购</button></view>
			<view><button class="btn" @click="doSubmit('transfer')">转赠他人</button></view>
			<view><button class="btn fw-7 bg-base-change text-white" @click="onShowShip()">发货</button></view>
		</view>

		<u-popup :show="showShip" mode="bottom" :round="20" closeable @close="showShip = false">
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
				<button class="btn-submit bg-base mt-40" @click="doSubmit('ship')">确认地址并领取</button>
			</view>
		</u-popup>
		
		<!-- 发货 -->
		<u-popup :show="showShip" mode="bottom" :round="20" closeable @close="showShip = false">
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
						</view>
					</view>
				</scroll-view>
				<button class="btn-submit bg-base mt-40" @click="doSubmit('ship')">确认地址并领取</button>
			</view>
		</u-popup>
		
		<!-- 转增 -->
		<u-popup :show="showTransfer" mode="bottom" :round="20" closeable @close="showTransfer = false">
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
						</view>
					</view>
				</scroll-view>
				<button class="btn-submit bg-base mt-40" @click="doSubmit('transfer')">填写账号并转赠</button>
			</view>
		</u-popup>
		
		<!-- 回购 -->
		<u-popup :show="showBuy" mode="bottom" :round="20" closeable @close="showBuy = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">官方回购</view>
				<view class="mt-30">回购总价：￥345.88</view>
				<view class="fs-12 p-12 border-box rounded-8 mtb-15 lh-15" style="background: #F0ECE1;color: #99935C;">
					<view class="fw-7 flex-start">
						<u-icon name="bell-fill" color="#9D9762" size="14"></u-icon>
						<text class="ml-3">温馨提示</text>
					</view>
					<view class="">平台提供官方回购服务，用户可按规定将仓库内产品出售给平台以补充库存。回购期结束后，产品价格将上调 5%–20%；回购期开放时间将根据货物储备量及市场情况灵活调整。到账方式为账户奖励</view>
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
				<button class="btn-submit bg-base mt-40" @click="onClose();showBuyConfirm = true">申请回购</button>
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
					<button class="fs-16 fw-7 w-135 h-51 flex-center rounded-x" @click="doSubmit('buy')">我已确认</button>
					<button class="fs-16 fw-7 w-135 h-51 bg-base text-white flex-center rounded-x" @click="showBuyConfirm = false">暂时取消</button>
				</view>
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
				showShipItem: false,
				showShip: false,
				shipIndex: 0,
				showTransfer: false,
				showBuy: false,
				showTransferResult: false,
				showBuyConfirm: false,
				address: {},
				load: false,
				doSubmit: null,
				to_account: null
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
			onClose() {
				this.showBuy = false
				this.showShip = false
				this.showTransfer = false
				this.showTransferResult = false
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