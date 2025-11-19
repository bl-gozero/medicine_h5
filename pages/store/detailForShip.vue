<template>
	<view class="page bg-page lh-10">
		<Title title="发货详情" fixed></Title>
		<view v-if="load" class="pt-10 plr-20">
			<view class="ptb-24 plr-14 rounded-14 text-base" style="background: linear-gradient(90deg, #FFFCEC 0%, #EBE8DB 100%);">
				<view class="fs-18 fw-7">{{ order.status.value }}</view>
				<view class="fs-12 mt-15">发货号：{{ order.order_number }}</view>
			</view>
			<view v-if="order.address" class="mt-15 bg-white rounded-12 plr-16 ptb-20 border-box">
				<view class="flex-between">
					<image src="/static/order/car.png" class="i-18 self-start"></image>
					<view class="ml-11 flex-1">
						<view>物流信息</view>
						<view v-if="order.waybill_number" class="mt-10 flex-between ">
							<text class="fs-12 text-info">{{ order.waybill_number }}</text>
							<image src="/static/order/copy.png" class="i-12" @click="$c.copy(order.waybill_number)"></image>
						</view>
						<view v-else class="mt-10 fs-12 text-info">暂无信息</view>
						<view v-if="express.AcceptStation" class="lh-15 mt-15 fs-12 text-info">
							<view class="">{{ express.AcceptTime }}</view>
							<view class="mt-8">{{ express.AcceptStation }}</view>
						</view>
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
			<view class="mt-12 bg-white rounded-14 ptb-16 plr-13 list">
				<view :class="['flex-between', { 'mt-20' : index > 0 }]" v-for="(item, index) in order.details">
					<image :src="item.picture" class="i-57 rounded-12" mode="aspectFill"></image>
					<view class="ml-7 flex-1 self-start ptb-4">
						<view class="flex-between">
							<text class="u-line-1 fw-5">{{ item.goods_name }}</text>
						</view>
						<view class="mt-8 fs-12 text-info">{{ item.goods_sku_name }}</view>
					</view>
				</view>
			</view>
			<view class="mt-13 bg-white rounded-14 p-18 fs-12">
				<view class="flex-between">
					<text class="text-info">申请发货</text>
					<text>{{ order.created_at }}</text>
				</view>
				<view v-if="order.mailing_at" class="flex-between mt-18">
					<text class="text-info">发货时间</text>
					<text>{{ order.mailing_at }}</text>
				</view>
			</view>
		</view>
		<view class="h-100"></view>
		<view class="fixed bottom-0 left-0 pw-100 flex-between ptb-15 plr-20 bg-white border-box" style="z-index: 100;">
			<view class="relative w-40 h-20">
				<!-- <text class="fs-12 text-info" @click="showMore = !showMore">更多</text>
				<view v-if="showMore" class="absolute left-0 top-0 more_box flex-center"
					style="z-index: 10;transform: translate(-13px, -151%);">
					<view class="fs-12" @click="showMore = false;showDelete = true">删除订单</view>
				</view> -->
			</view>
			<view class="flex-start">
				<u-button v-if="order.status == 2" class="btn bg-base text-white" shape="circle" plain
					text="确认收货" @click="onReceive()"></u-button>
			</view>
		</view>
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
				load: false,
				doSubmit: null,
				showMore: false,
				express: {}
			}
		},
		onLoad(p) {
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
			if (p.id && parseInt(p.id)) {
				this.id = parseInt(p.id)
				this.getDetail()
			} 
		},
		methods: {
			async getDetail() {
				const res = await this.$c.fetch(this.$api.goods.storeShipDetail, {
					id: this.id
				})
				if (res) {
					this.order = res
					if(res.courier_number) this.express = await this.$c.getExpress(res.id, 3)
					this.load = true
				}
			},
			onReceive() {
				this.$confirm('确定该订单已收货？')
				  .then(() => { this.doSubmit() })
			},
			async onSubmit() {
				const res = await this.$c.fetch(this.$api.goods.storeReceive, { id: this.id })
				if(res) {
					this.$c.toast('操作成功')
					this.getDetail()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.btn {
		width: 95px;
		height: 39px;
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