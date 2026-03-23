<template>
	<view class="page" style="background: #E54C32;">
		<Title title="每月领福利活动" fixed bgColor="#fff" />
		<view class="relative">
			<image src="/static/avtivity/egg/top_1_1.webp" class="pw-100" mode="widthFix"></image>
			<!-- <image src="/static/avtivity/egg/top_1_2.webp" class="w-375 h-256 absolute left-0 right-0 auto-x" style="top: 72%;"></image> -->
			<view class="flex-center" style="margin-top: -80rpx;">
				<image src="/static/avtivity/egg/rule.webp" class="w-375 h-511"></image>
			</view>
		</view>
		<view v-if="load" class="">
			<view class="flex-center">
				<view class="relative">
					<image src="/static/avtivity/egg/box-2.webp" class="w-360 h-257 block"></image>
					<image 
						:src="`/static/avtivity/egg/btn-${done? 2 : 1}.webp`"
						class="absolute top-130 left-0 right-0 auto-x w-279 h-68"
						@click="done || $c.goto('/pages/goods/searchResult?is_level_valid=1')"
					></image>
					<view v-if="done" class="absolute top-160 left-0 right-0 auto-x text-center text-info fs-12">时间：{{ profile.first_purchase_at }}</view>
				</view>
			</view>
			<view class="flex-center" style="margin-top: -1px;">
				<view class="relative w-343">
					<!-- <image src="/static/avtivity/egg/box_2.webp" class="pw-100 block" style="height: 888px;"></image> -->
					<view class="w-343 bg-white plr-20 pb-30 border-box" style="border-radius: 0 0 20px 20px;">
						<view class="warn_box">
							<image src="/static/avtivity/egg/warn.webp" class="i-12"></image>
							<text class="ml-3">礼品若遇缺货，公司将以同等级别其它品牌作为平替，确保您的权益不受影响。</text>
						</view>
						<view class="">
							<view class="mt-6 flex-between plr-4 ptb-4 border-box rounded-8" style="background: #E8F1FC;" v-for="(item, i) in list" :key="item.datetime">
								<image src="/static/avtivity/egg/list_2.webp" class="i-47"></image>
								<view class="flex-1 mlr-4">
									<!-- <view class="">初生鸡蛋/东北大米一箱</view> -->
									<view class="">洗衣液一桶/东北大米一箱</view>
									<view class="mt-6 text-info fs-12 mt-6">{{ done ? `第${i+1}月` : '待购物' }}</view>
								</view>
								<image v-if="item.is_expired" src="/static/avtivity/egg/btn-5.webp" class="w-95 h-54"></image>
								<image v-else-if="item.is_participate" src="/static/avtivity/egg/btn-4.webp" class="w-95 h-54" @click="onDetail(item)"></image>
								<image v-else src="/static/avtivity/egg/btn-3.webp" class="w-95 h-54" @click="onAddress(item, i)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="h-30"></view>
		</view>
		
		<u-popup :show="showAddress" mode="bottom" :round="20" closeable @close="showAddress = false">
			<view class="pt-14 pb-30 plr-20 bg lh-10 roundedTop-20">
				<view class="fs-16 text-center">选择礼品和填写收货地址</view>
				<view class="border-bottom pb-30">
					<view class="flex-between item-stretch mt-30 " v-for="item in items" @click="onGoods(item)">
						<view class="i-76 rounded-8 flex-center" style="background: #F6F6F6;">
							<image :src="item.img" :class="item.class"></image>
						</view>
						<view class="flex-1 ml-8">
							<view class="flex-between">
								<view class="">{{ item.name }}</view>
								<image :src="$c.checkIcon(select == item.id)" class="i-18"></image>
							</view>
							<view class="text-info fs-12 mt-8">第{{ index + 1 }}月</view>
							<view v-if="!item.stock" class="text-info fs-12 mt-8">库存不足</view>
							<view v-if="item.id == 2" class="warn_box1 mt-9">
								<image src="/static/avtivity/egg/warn.webp" class="i-12"></image>
								<text class="ml-3">温馨提示：部分地区较远，长途运输破损需自行承担损失。请慎重考虑</text>
							</view>
						</view>
					</view>
				</view>
				<view class="flex-between ptb-25 border-bottom" @click="$c.goto('/pages/user/address?from=address')">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>
					<view v-if="address.district" class="flex-1 ml-8 mr-20">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-15 fs-12">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<view v-else class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start"></u-icon>
				</view>
				<view class="text-center fs-12 mt-60" style="color: #F36E25;">下单后将于10日内按照订单先后顺序排队发出</view>
				<button class="btn mt-10 rounded-x flex-center" @click="doSubmit">确认地址并领取</button>
			</view>
		</u-popup>
		
		<u-popup :show="showActive" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @close="close">
			<view class="w-308 h-354 rounded-20 plr-14 border-box" style="background: linear-gradient(180deg, #FFEFCE 3%, #FFFFFF 49%);">
				<view class="text-center" style="margin-top: -50px;">
					<image src="/static/avtivity/egg/active.webp" class="w-95 h-89" />
				</view>
				<view class="fs-18 fw-7 text-center text-base">活跃度提醒</view>
				<view class="text-center mt-10" style="line-height: 20px;">
					<view class="">很抱歉！您的活跃度不足</view>
					<view class="">目前无法领取，请激活您的活跃度</view>
				</view>
				<view class="rounded-8 p-10 fs-12 mt-25" style="background: #F7F2E8;color: #817968;">
					<view class="fw-7">激活活跃度，获取持续领取资格：</view>
					<scroll-view class="h-82 mt-10" scroll-y>
						<view class="lh-15">
							1、用户需要保持账户拥有“有效购买记录的商品”（已邮寄或选择平台存储均可），才可以持续领取相关礼品权益。<br />
							2、如果商品 转赠给他人 或 被平台回购，导致账户内已经没有任何商品，则系统会判定为 “活跃度不足”，该账户将暂时无法继续领取。<br />
							3、若想恢复领取资格，需重新购买商品，并选择 邮寄 或 存储在平台，即可恢复领取。<br />
							4、注意：转赠获得的商品不计入有效资格。<br />
						</view>
					</scroll-view>
				</view>
				<view class="flex-center fgap-10 mt-20">
					<view class="">
						<button class="w-135 h-51 fw-7 fs-16 rounded-x flex-center border-plain" plain="" @click="showActive = false">取消</button>
					</view>
					<view class="">
						<button class="w-135 h-51 bg-base text-white fw-7 fs-16 rounded-x flex-center" @click="$c.goto('/pages/goods/searchResult?is_level_valid=1')">去购买</button>
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
				done: false,
				showAddress: false,
				address: {},
				index: 0,
				event_id: 2,
				profile: {},
				list: Array.from({ length: 12 }, () => ({})), //生成12个空对象
				load: false,
				items: [
					// { id: 1, name: '人参', img: '/static/avtivity/egg/img_egg.webp', class: 'w-63 h-33' },
					// { id: 2, name: '北辰优选初生鸡蛋', img: '/static/avtivity/egg/img_egg.webp', class: 'w-63 h-33' },
					{ id: 4, name: '满婷内衣洗专用洗衣液', img: '/static/avtivity/egg/img_ld.webp', class: 'w-50 h-67', stock: 1 },
					{ id: 3, name: '北辰优选东北大米', img: '/static/avtivity/egg/img_rice.webp', class: 'w-64 h-51', stock: 1 },
				],
				select: null,
				showActive: true
			}
		},
		async onLoad() {
			this.profile = await this.$c.checkeLogin(1)
			this.$c.removeStorage('address')
			this.getActivity()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if(address) this.address = address
		},
		methods: {
			onGoods(item) {
				if(!item.stock) return this.$c.toast('库存不足')
				this.select = item.id
			},
			async eventGoods() {
				const res = await this.$c.fetch(this.$api.config.eventGoods)
				if (res) {
					this.items.forEach(item => {
						item.stock = res.find(i => i.id == item.id)?.stock || 0
					})
					this.showAddress = true
				}
				this.showAddress = true
			},
			onAddress(item, i) {
				if(!this.done) {
					this.$c.toast('请先完成购买指定商品，获取领取资格')
					return
				}
				if(!this.isInMonth(item.datetime)) {
					this.$c.toast('不可领取')
					return
				}
				this.index = i
				this.eventGoods()
			},
			async getActivity() {
				const res = await this.$c.fetch(this.$api.user.activity, { id: this.event_id })
				if (res) {
					if (res.list && res.list.length > 0) {
						this.done = true
						this.list = res.list || []
					}
					this.load = true
				}
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.address = res.length > 0? res[0] : {} }
			},
			async onSubmit() {
				if(!this.select) {
					return this.$c.toast('请选择礼品')
				}
				if(!this.address?.id) {
					return this.$c.toast('请选择收货地址')
				}
				this.showAddress = false
				// const res = await this.$c.fetch(this.$api.user.activityAddress, {
				// 	id: this.event_id,
				// 	address_id: this.address.id,
				// 	commodity: this.select
				// })
				// if(res) {
				// 	this.$c.toast('提交成功')
				// 	this.getActivity()
				// }
				this.$api.user.activityAddress({
					id: this.event_id,
					address_id: this.address.id,
					commodity: this.select
				}, { showErr: false })
					.then(res => {
						this.$c.toast('提交成功')
						this.getActivity()
					}).catch(res => {
						if (res.code == 2001) {
							this.showActive = true
						} else {
							this.$c.toast(res.message || '领取失败')
						}
					})
			},
			onDetail(item) {
				this.$c.goto(`/pages/activity/detail?event_id=${this.event_id}&id=${item.id}`)
			},
			isInMonth(monthStr) {
				// monthStr 格式如 '2025-10'
				const [year, month] = monthStr.split('-').map(Number)

				const now = new Date()
				const currentYear = now.getFullYear()
				const currentMonth = now.getMonth() + 1 // getMonth 从 0 开始

				return year === currentYear && month === currentMonth
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		background: linear-gradient(180deg, #F9F2C4 4%, #FFFFFF 32px);
	}
	.btn {
		background: #F36E25;
		width: 247px;
		height: 47px;
		font-weight: 700;
		color: #fff;
	}
	.warn_box {
		background: #FFE6E6;
		color: #B84C4C;
		font-size: 12px;
		line-height: 16px;
		padding: 6px;
		border-radius: 8px;
	}
	
	.warn_box1 {
		color: #B84C4C;
		font-size: 12px;
		line-height: 16px;
	}
</style>