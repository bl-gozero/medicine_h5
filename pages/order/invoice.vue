<template>
	<view class="page plr-20 bg-page lh-10">
		<Title :title="load == 2 ? '发票详情' : '申请开票'" fixed />
		<view v-if="load" class="">
			<view class="bg-white rounded-14 plr-16 ptb-12 flex-between fgap-10 mt-10">
				<image :src="order.details[0].picture" class="i-41 rounded-12" mode="aspectFill"></image>
				<view class="flex-1 fs-12">
					<view class="">订单编号 {{ order.order_number }}</view>
					<view class="mt-9 flex-start fgap-6">
						<text>开票金额 ￥{{ order.price }}</text>
						<u-icon name="info-circle" color="#9F9F9F" size="12" @click="showInfo = true"></u-icon>
					</view>
				</view>
			</view>
			<view v-if="load == 1" class="">
				<view class="bg-white rounded-14 p-16 mt-10">
					<view class="flex-between">
						<text>发票类型</text>
						<text class="text-content">普通发票-纸质</text>
					</view>
					<view class="flex-between mt-26">
						<text>发票内容</text>
						<text class="text-content">明细</text>
					</view>
				</view>
				<view class="bg-white rounded-14 p-16 mt-10">
					<view class="flex-between fgap-20">
						<text>发票类型</text>
						<view class="flex-1 flex-end">
							<u-radio-group v-model="order.mode" :activeColor="$c.baseColor()" inactiveColor="#DBDBDB" iconSize="14">
								<u-radio name="1" label="个人或事业单位" labelSize="12"></u-radio>
								<u-radio name="2" label="企业" labelSize="12"></u-radio>
							</u-radio-group>
						</view>
					</view>
					<view class="flex-between fgap-20 mt-30">
						<view>发票抬头</view>
						<u-input v-model="order.title" placeholder="请输入抬头" placeholderClass="fs-12 text-info" border="none" inputAlign="right"></u-input>
					</view>
					<view v-if="order.mode == 2" class="flex-between fgap-20 mt-30">
						<view>税号</view>
						<u-input v-model="order.title" placeholder="请输入纳税人识别号或社会统一征信代码" placeholderClass="fs-12 text-info" border="none" inputAlign="right"></u-input>
					</view>
				</view>
				<view class="bg-white rounded-14 plr-16 ptb-20 mt-10">
					<view class="flex-between">
						<text>收票地址</text>
						<u-icon name="arrow-right" :color="$c.arrowColor()" size="12"></u-icon>
					</view>
					<view class="flex-between mt-20" @click="$c.goto('/pages/user/address?from=goodsDetail')">
						<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>
						<view v-if="address.district" class="flex-1 ml-8 mr-20 fs-12">
							<view class="">{{ address.district + address.address }}</view>
							<view class="mt-15">
								<text class="text-info">{{ address.name }}</text>
								<text class="text-info ml-20">{{ address.phone }}</text>
							</view>
						</view>
						<view v-else class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
					</view>
				</view>
				<view class="absolute bottom-30 left-0 x-100">
					<button class="fs-14 fw-7 bg-base text-white w-247 h-47 rounded-x flex-center"
						@click="showConfirm = true">提交</button>
				</view>
			</view>
			<view v-else-if="load == 2" class="bg-white rounded-14 p-16 pb-30 mt-10">
				<view class="flex-between info">
					<text>发票类型</text>
					<text class="">普通发票-纸质</text>
				</view>
				<view class="flex-between info">
					<text>发票内容</text>
					<text class="">明细</text>
				</view>
				<view class="flex-between info">
					<text>抬头类型</text>
					<text class="">个人或事业单位</text>
				</view>
				<view class="flex-between info">
					<text class="self-start">收票地址</text>
					<view class="flex-1 text-right lh-12">
						<view class="">北京市朝阳区-南杨庄路与武基街交叉口西南150米</view>
						<view class="mt-10">张三  13756457878</view>
					</view>
				</view>
				<view class="flex-between info">
					<text>物流信息</text>
					<view class="flex-between flex-1 fgap-20">
						<view class="flex-start fgap-10" @click="$c.copy(order.waybill_number)">
							<text class="fs-12 u-line-1">{{ order.waybill_number }}</text>
							<view class="line h-12"></view>
							<text style="color: #1575F6;">复制</text>
						</view>
						<button class="w-52 h-23 bg-base text-white fs-12 self-start m-0 ml-10 p-0 flex-center rounded-x"
							@click="$c.goto('/pages/index/express', 1, { id: order.id, mode: 1, number: order.waybill_number })">查询</button>
					</view>
				</view>
			</view>
		</view>
		
		<u-popup :show="showInfo" mode="center" bgColor="transparent" @close="showInfo = false;">
			<view class="popup-box bg-white" style="min-height: 303px;">
				<view class="popup-title mt-20 text-black">温馨提示</view>
				<view class="popup-text flex-1 mt-30">您好!现展示的为订单预计开票金额，最终金额以发票实际开具为准</view>
				<view class="popup-buttons">
					<view class="">
						<button class="bg-base bold fs-16 text-white w-234 h-51 flex-center rounded-x"
							@click="showInfo = false;">知道了</button>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup :show="showConfirm" mode="center" bgColor="transparent" @close="showConfirm = false;">
			<view class="popup-box bg-white" style="min-height: 303px;">
				<view class="popup-title mt-20 text-black">开票提示</view>
				<view class="popup-text flex-1 text-left">
					1. 请填写常用收货地址（非常用地址将导致丢失）；<br/>
					2. 提交后5-10个工作日开出发票并开始 邮寄 ；<br/>
					3. 邮费为到付。
				</view>
				<view class="popup-buttons">
					<view class="">
						<button class="bold fs-16 w-134 h-51 flex-center rounded-x border-plain" plain
							@click="showConfirm = false;">取消</button>
					</view>
					<view class="">
						<button class="bg-base bold fs-16 text-white w-134 h-51 flex-center rounded-x"
							@click="doSubmit">确认申请</button>
					</view>
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
				load: 0,
				order: {},
				showInfo: false,
				showConfirm: false,
				doSubmit: null,
				address: {},
				express: {}
			}
		},
		onLoad(p) {
			this.$c.removeStorage('address')
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
			this.id = this.$c.safeId(p)
			if (this.id) {
				this.getDetail()
				this.addressList()
			}
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
					this.load = 2
				}
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if (res) {
					this.address = res.length > 0 ? res[0] : {}
				}
			},
			async onSubmit() {
				this.showConfirm =false
				const res = await this.$c.fetch(this.$api.goods.orderCancel, {
					id: this.id
				})
				if (res) {
					this.$c.toast('操作成功')
					this.getDetail()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	::v-deep .u-radio-group {
		flex: none !important;
		gap: 24px;
	}
	.info:not(:first-child) {
		margin-top: 26px;
		gap: 20px;
	}
	.info>:nth-child(2) {
		font-size: 12px;
		opacity: .8;
	}
</style>