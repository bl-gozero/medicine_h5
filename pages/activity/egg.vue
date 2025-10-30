<template>
	<view class="page" style="background: #FFF4E7;">
		<Title title="领鸡蛋福利活动" fixed bgColor="#fff" />
		<view class="relative">
			<image src="/static/avtivity/egg/top_1.webp" class="pw-100" mode="widthFix"></image>
			<image src="/static/avtivity/egg/top_2.webp" class="absolute left-0 pw-100" style="top: 48%" mode="widthFix"></image>
		</view>
		<view v-if="load" class="">
			<view class="flex-center" style="margin-top: -40px;">
				<view class="relative">
					<image src="/static/avtivity/egg/box_1.webp" class="w-375 h-257 block"></image>
					<image 
						:src="`/static/avtivity/egg/btn-${done? 2 : 1}.webp`"
						class="absolute top-130 left-0 right-0 auto-x w-279 h-68"
						@click="done || $c.goto('/pages/goods/searchResult?is_level_valid=1')"
					></image>
					<view v-if="done" class="absolute top-160 left-0 right-0 auto-x text-center text-info fs-12">时间：{{ profile.first_purchase_at }}</view>
				</view>
			</view>
			<view class="flex-center">
				<view class="relative">
					<image src="/static/avtivity/egg/box_2.webp" class="w-375 block" style="height: 888px;"></image>
					<view class="full plr-20 border-box">
						<view v-if="list.length" class="">
							<view class="mt-6 flex-between plr-4 ptb-6 border-box rounded-8" style="background: #E8F1FC;" v-for="(item, i) in list" :key="item.datetime">
								<view class="i-47 bg-white rounded-8 flex-center">
									<image src="/static/avtivity/egg/egg.webp" class="w-37 h-25"></image>
								</view>
								<view class="flex-1 mlr-4">
									<view class="">百冠山初生鸡蛋一箱</view>
									<view class="mt-6 text-info fs-12 mt-6">第{{ i + 1 }}月</view>
								</view>
								<image v-if="item.is_expired" src="/static/avtivity/egg/btn-5.webp" class="w-95 h-54"></image>
								<image v-else-if="item.is_participate" src="/static/avtivity/egg/btn-4.webp" class="w-95 h-54" @click="onDetail(item)"></image>
								<image v-else src="/static/avtivity/egg/btn-3.webp" class="w-95 h-54" @click="onAddress(item, i)"></image>
							</view>
						</view>
						<view v-else class="">
							<view class="mt-7 flex-between plr-4 ptb-5 border-box rounded-8" style="background: #E8F1FC;" v-for="item in 12" :key="item">
								<view class="i-47 bg-white rounded-8 flex-center">
									<image src="/static/avtivity/egg/egg.webp" class="w-37 h-25"></image>
								</view>
								<view class="flex-1 mlr-4">
									<view class="">百冠山初生鸡蛋一箱</view>
									<view v-if="!done" class="mt-6 text-info fs-12 mt-6">待购物</view>
									<!-- <view v-else class="mt-6 text-info fs-12 mt-6">第{{ item }}月</view> -->
								</view>
								<image src="/static/avtivity/egg/btn-3.webp" class="w-95 h-54" @click="onAddress(item, item)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<u-popup :show="showAddress" mode="bottom" bgColor="transparent" closeable @close="showAddress = false">
			<view class="pt-14 pb-30 plr-20 bg lh-10 roundedTop-20">
				<view class="fs-16 text-center">收货地址</view>
				<view class="flex-between ptb-30 border-bottom">
					<view class="i-76 rounded-8 flex-center" style="background: #F6F6F6;">
						<image src="/static/avtivity/egg/egg.webp" class="w-60 h-40"></image>
					</view>
					<view class="flex-1 ml-8 self-start">
						<view class="">百冠山初生鸡蛋</view>
						<view class="text-info fs-12 mt-10">第{{ index + 1 }}月</view>
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
				<u-button class="btn mt-80" shape="circle" text="确认地址并领取" @click="doSubmit"></u-button>
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
				list: [],
				load: false
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
				this.showAddress = true
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
				this.showAddress = false
				const res = await this.$c.fetch(this.$api.user.activityAddress, {
					id: this.event_id,
					address_id: this.address.id
				})
				if(res) {
					this.$c.toast('提交成功')
					this.getActivity()
				}
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
			}
		}
	}
</script>

<style>
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
</style>