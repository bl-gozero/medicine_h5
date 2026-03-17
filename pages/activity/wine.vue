<template>
	<view>
		<view v-if="page == 1" class="page" style="background: #FC4F43;">
			<Title title="新年赠好礼活动" fixed bgColor="#fff" />
			<image src="/static/avtivity/wine/top.webp" class="pw-100 block" mode="widthFix"></image>
			<view class="flex-center">
				<view class="relative">
					<image src="/static/avtivity/wine/part_1.webp" class="w-375 h-453 block"></image>
					<view class="full border-box pt-72 plr-20">
						<image src="/static/avtivity/wine/1.webp" class="w-330 h-86 block"></image>
						<view class="relative">
							<image src="/static/avtivity/wine/2.webp" class="w-330 h-262 mt-6"></image>
							<view class="full border-box pt-63 text-center">
								<view class="flex-center">
									<view class="relative">
										<image src="/static/avtivity/wine/out.webp" class="w-260 h-15 block"></image>
										<view class="full border-box ptb-5 plr-4">
											<view class="process rounded-x h-5" :class="'pw-' + process">
												<view v-if="![0, 10, 15].includes(num)" class="circle"></view>
											</view>
										</view>
										<view class="percent text-center" style="left: 67%;">
											<view class="">
												<image src="/static/avtivity/wine/bottle_1.webp" class="i-52"></image>
											</view>
											<view class="">
												<image src="/static/avtivity/wine/gift.webp" class="i-19"></image>
											</view>
											<view class="flex-center">
												<view class="num w-30">10份</view>
											</view>
										</view>
										<view class="percent text-center" style="left: 100%;">
											<view class="">
												<image src="/static/avtivity/wine/bottle_2.webp" class="i-52"></image>
											</view>
											<view class="">
												<image src="/static/avtivity/wine/gift.webp" class="i-19"></image>
											</view>
											<view class="flex-center">
												<view class="num w-30">15份</view>
											</view>
										</view>
									</view>
								</view>
								<view class="fs-12 mt-30">
									<text class="fw-3" style="color: #816060;">已购买数量</text>
									<text class="fw-7 ml-2" style="color: #4D0101;">{{ num }}份</text>
								</view>
								<view class="fs-12 fw-3 mt-20" style="color: #4D0101;">活动期限:即日起至2026年2月28日</view>
								<view class="flex-center">
									<image src="/static/avtivity/wine/buy.webp" class="w-220 h-61" @click="$c.goto('/pages/goods/detail?id=28')"></image>
								</view>
								<view class="flex-center fs-12 mt-7" style="color: #2D674A;">
									<view class="" @click="onLog()">活动购买记录>></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-center">
				<image src="/static/avtivity/wine/part_2.webp" class="w-375 h-207 block" @click="page = 2"></image>
			</view>
			<view class="flex-center">
				<image src="/static/avtivity/wine/part_3.webp" class="w-375 h-310 block"></image>
			</view>
			<view class="flex-center pt-10 pb-20" style="background: #CD2220;">
				<image v-if="done" src="/static/avtivity/wine/check.webp" class="w-227 h-50 block" @click="onDetail()"></image>
				<image v-else src="/static/avtivity/wine/get.webp" class="w-227 h-50 block" @click="showAddress = true"></image>
			</view>
		</view>
		
		<view v-if="page == 2" class="page" style="background: #010101;">
			<Title title="礼品详细说明" fixed bgColor="#fff" @back="page = 1" />
			<u-image :src="`/static/avtivity/wine/rule/${index}.webp`" v-for="index in 5" :key="index" width="100%" height="auto"
				bgColor="transparent" mode="widthFix">
			  <template v-slot:loading>
			    <view class="ptb-50 pw-100" style="background: #010101;">
					<u-loading-icon color="#9F9F9F" class=""></u-loading-icon>
				</view>
			  </template>
			  <template v-slot:error>
			    <view class="ptb-10 pw-100 flex-center" style="background: #010101;">
					<u-icon name="info-circle" color="#9F9F9F"></u-icon>
				</view>
			  </template>
			</u-image>
		</view>
		
		<view v-if="page == 3" class="page bg-page plr-20">
			<Title title="购买记录" fixed bgColor="#F8F8F8" @back="page = 1" />
			<view class="bg-white p-12 rounded-8 flex-between mt-10 fgap-10" v-for="item in logs" :key="item.id">
				<view class="fw-5 u-line-1">购买指定商品</view>
				<view class="text-right text-info fs-12">
					<view class="">{{ item.quantity }}份</view>
					<view class="mt-8">{{ item.created_at }}</view>
				</view>
			</view>
		</view>
		
		<!-- address -->
		<u-popup :show="showAddress" mode="bottom" bgColor="transparent" closeable @close="showAddress = false">
			<view class="pt-14 pb-30 plr-20 bg lh-10 roundedTop-20">
				<view class="fs-16 text-center">收货地址</view>
				<view class="border-bottom pb-30">
					<view class="flex-between item-stretch mt-30 " v-for="item in items">
						<view class="i-76 rounded-8 flex-center" style="background: #D8D8D8;">
							<image :src="item.img" :class="item.class"></image>
						</view>
						<view class="flex-1 ml-8">
							<view class="">{{ item.name }}</view>
							<view class="text-info fs-12 mt-8">2瓶</view>
							<view v-if="!item.stock" class="text-info fs-12 mt-8">库存不足</view>
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
				<u-button class="w-247 h-47 bg-base text-white fw-7 mt-60" shape="circle" text="确认地址并领取" @click="doSubmit"></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import PlayImg from '../../components/PlayImgs.vue'
	
	export default {
		components: {
			Title,
			PlayImg
		},
		data() {
			return {
				page: 1,
				done: false,
				doSubmit: null,
				load: false,
				items: [
					{ id: 5, name: '人参鹿鞭酒', img: '/static/avtivity/wine/wine.webp', class: 'w-68 h-66', stock: 1 },
				],
				event_id: 3,
				profile: {},
				address: {},
				num: 0,
				showAddress: false,
				logs: []
			}
		},
		computed: {
			process() {
				return Math.ceil(this.num * 100 / 15)
			}
		},
		async onLoad() {
			this.profile = await this.$c.checkeLogin(1)
			this.$c.removeStorage('address')
			this.getActivity()
			this.getActivity2()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if(address) this.address = address
		},
		methods: {
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.address = res.length > 0? res[0] : {} }
			},
			async onSubmit() {
				this.showAddress = false
				const res = await this.$c.fetch(this.$api.user.activityAddress, {
					id: this.event_id,
					address_id: this.address.id,
					commodity: 5
				})
				if(res) {
					this.$c.toast('提交成功')
					this.getActivity()
				}
			},
			async onLog() {
				this.page = 3
				const res = await this.$c.fetch(this.$api.event.wineList)
				if(res) this.logs = res
			},
			async getActivity2() {
				const res = await this.$c.fetch(this.$api.event.wineProcess)
				if (res) {
					this.num = res.order_count || 0
				}
			},
			async getActivity() {
				const res = await this.$c.fetch(this.$api.user.activity, { id: this.event_id })
				if (res) {
					this.done = res.is_participate
				}
			},
			onDetail(item) {
				this.$c.goto(`/pages/activity/detail?event_id=${this.event_id}&id=1`)
			},
		}
	}
</script>

<style scoped lang="scss">
	.process {
		background: repeating-linear-gradient(
			135deg,
			#ECA626 0,
			#ECA626 2px,
			#E48E17 2px,
			#E48E17 4px
		);
		position: relative;
		transition: all 1s ease;
		
		.circle {
			background: #E23F20;
			width: 14px;
			height: 14px;
			border: 2px solid #fff;
			border-radius: 50%;
			box-sizing: border-box;
			position: absolute;
			top: 50%;
			right: 0;
			transform: translate(50%, -50%);
		}
	}
	.percent {
		position: absolute;
		transform: translate(-50%, -74%);
	}
	.num {
		border-radius: 3px;
		border: 1px solid #fff;
		background: #427D6B;
		font-weight: 700;
		font-size: 12px;
		color: #fff;
		text-align: center;
		height: 16px;
		line-height: 16px;
	}
	.bg {
		background: linear-gradient(180deg, #CDEAEB 2%, #FFFFFF 32px);
	}
</style>