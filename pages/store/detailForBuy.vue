<template>
	<view class="page bg-page lh-10">
		<Title title="官方回购详情" fixed></Title>
		<view v-if="load" class="pt-10 plr-20">
			<view class="ptb-24 plr-14 rounded-14 text-base" style="background: linear-gradient(90deg, #FFFCEC 0%, #EBE8DB 100%);">
				<view class="fs-18 fw-7">{{ order.status.value }}</view>
				<view class="fs-12 mt-15">您已被官方平台回购，感谢支持</view>
			</view>
			<view class="mt-12 bg-white rounded-14 ptb-16 plr-13 list">
				<view :class="['flex-between', { 'mt-20' : index > 0 }]" v-for="(item, index) in order.details">
					<image :src="item.picture" class="i-57 rounded-12" mode="aspectFill"></image>
					<view class="ml-7 flex-1 self-start ptb-4">
						<view class="flex-between">
							<text class="u-line-1 fw-5">{{ item.goods_name }}</text>
						</view>
						<view class="mt-8 fs-12 text-info">{{ item.goods_sku_name }}</view>
						<view class="mt-8 fs-12 text-info">回购价格:￥234</view>
					</view>
				</view>
			</view>
			<view class="mt-13 bg-white rounded-14 p-18 fs-12">
				<view class="flex-between">
					<text class="text-info">回购总额</text>
					<text>{{ order.created_at }}</text>
				</view>
				<view class="flex-between mt-25">
					<text class="text-info">到账方式</text>
					<text>奖励</text>
				</view>
				<view class="flex-between mt-25">
					<text class="text-info">回购时间</text>
					<text>{{ order.created_at }}</text>
				</view>
			</view>
		</view>
		<view class="h-100"></view>
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
					if(res.waybill_number) this.express = await this.$c.getExpress(res.id, 3)
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