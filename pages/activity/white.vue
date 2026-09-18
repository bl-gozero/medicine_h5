<template>
	<view>
		<view v-if="page == 1" class="page" style="background: #fff;">
			<Title title="商品详情" fixed bgColor="#fff" />
			<view class="relative">
				<image :src="img('1.webp')" class="x-100 block" mode="widthFix"></image>
				<view class="absolute left-20 right-20 rounded-15 process-box p-10 border-box" style="top: 61%;">
					<view class="flex-center pt-5 pb-15">
						<image :src="img('dec.webp')" class="w-12 h-22 block"></image>
						<view class="fs-16 fw-7 mlr-4" style="color: #FFF9AB;">已完成购买 {{ num }} 盒</view>
						<image :src="img('dec.webp')" class="w-12 h-22 block" style="transform: scaleX(-1);"></image>
					</view>
					<view class="rounded-8 plr-30 pb-20 pt-70"
						style="background: linear-gradient(90deg, #f7e5bc 0%, #ffffff 100%);">
						<view class="flex-between">
							<view class="flex-start" :class="i < max && 'flex-1'" v-for="i in max" :key="i">
								<view class="relative">
									<image v-if="num >= i" :src="img('check-1.webp')" class="i-17 block"></image>
									<image v-else :src="img('check-0.webp')" class="i-15 block"></image>
									<view class="absolute text-center text-nowrap w-50"
										style="bottom: 100%;left: 50%;transform: translateX(-50%);">
										<view class="fs-12" style="color: #1C0D00;">{{ i }}盒</view>
										<view class="fs-10 mt-7">
											<view v-if="num >= i" style="color: #674B31;">已完成</view>
											<view v-else style="color: ##727272;">待完成</view>
										</view>
										<view class="h-12"></view>
									</view>
								</view>
								<view v-if="i < max" class="p-line" :class="num >= i && 'p-line-1'"></view>
							</view>
						</view>
						<view class="fs-12 mt-20 mb-25 text-center">已完成<text class="fs-16 fw-5"
								style="color: #000027;">{{ num }}/{{ max }}</text>盒任务，{{ max - num ? '再购买' + max - num + '盒即' : '' }}可领取赠品!</view>
						<image v-if="done" :src="img('btn-2.webp')" class="w-223 h-39 block auto-x" @click="onDetail()"></image>
						<image v-else-if="num >= max" :src="img('btn-1.webp')" class="w-223 h-39 block auto-x" @click="eventGoods()"></image>
						<image v-else :src="img('btn-0.webp')" class="w-223 h-39 block auto-x"></image>
					</view>
				</view>
			</view>
			<view class="" style="margin-top: -60rpx">
				<image :src="img(index + 1 + '.webp')" class="x-100 block" mode="widthFix" v-for="index in 4"
					:key="index"></image>
			</view>
		</view>

		<!-- address -->
		<u-popup :show="showAddress" mode="bottom" :round="20" closeable @close="showAddress = false">
			<view class="pt-14 pb-30 plr-20 bg lh-10 roundedTop-20 bg-address">
				<view class="fs-16 text-center">收货地址</view>
				<view class="border-bottom pb-30">
					<view class="flex-between item-stretch mt-30 " v-for="item in items">
						<view class="i-76 rounded-8 flex-center" style="background: #D8D8D8;">
							<image :src="item.img" :class="item.class"></image>
						</view>
						<view class="flex-1 ml-8">
							<view class="">{{ item.name }}</view>
							<view class="text-info fs-12 mt-8">36盒</view>
							<!-- <view class="text-info fs-12 mt-8">{{ item.stock }}</view> -->
							<view v-if="!item.stock" class="text-info fs-12 mt-8">库存不足</view>
						</view>
					</view>
				</view>
				<view class="flex-between ptb-25 border-bottom" @click="$c.goto('/pages/user/address?from=address')">
					<image :src="$c.img('/static/goods/place.png')" class="w-12 h-14 self-start"></image>
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
				<button class="w-247 h-47 bg-base text-white fw-7 mt-60 rounded-x flex-center"
					@click="doSubmit">确认地址并领取</button>
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
				page: 1,
				done: false,
				doSubmit: null,
				items: [{
					id: 6,
					name: '完白态活性益生性B420',
					img: '/static/avtivity/goods/white.webp',
					class: 'i-76',
					stock: 1
				}, ],
				event_id: 4,
				max: 5,
				num: 0,
				showAddress: false,
				address: {}
			}
		},
		async onLoad() {
			this.$c.checkeLogin()
			this.$c.removeStorage('address')
			this.getActivity()
			this.getActivity2()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if (address) this.address = address
		},
		methods: {
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if (res) {
					this.address = res.length > 0 ? res[0] : {}
				}
			},
			async onSubmit() {
				const item = this.items?.[0] || {}
				if (!item.stock) return this.$c.toast('库存不足')
				this.showAddress = false
				const res = await this.$c.fetch(this.$api.user.activityAddress, {
					id: this.event_id,
					address_id: this.address.id,
					commodity: 6
				})
				if (res) {
					this.$c.toast('提交成功')
					this.done = true
				}
			},
			async getActivity2() {
				const res = await this.$c.fetch(this.$api.user.activityDetail, {
					id: 1,
					event_id: this.event_id
				}, { showErr: false })
				if (res) this.done = !!res.id
			},
			async getActivity() {
				const res = await this.$c.fetch(this.$api.user.activity, {
					id: this.event_id
				})
				if (res) {
					this.num = res.count < this.max ? res.count : this.max
					// this.done = res.is_participate
				}
			},
			async eventGoods() {
				const res = await this.$c.fetch(this.$api.config.eventGoods)
				if (res) {
					this.items.forEach(item => {
						item.stock = res.find(i => i.id == item.id)?.stock || 0
					})
				}
				this.showAddress = true
			},
			onDetail() {
				this.$c.goto(`/pages/activity/detail?event_id=${this.event_id}&id=1`)
			},
			img(path, mode = 0, root = '/static/avtivity/white/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style scoped lang="scss">
	.process-box {
		border: 1.5px solid transparent;
		background:
			linear-gradient(128deg, #39296e 1%, #0e0a2f 85%) padding-box,
			linear-gradient(180deg, #f9e397 0%, #ebaf60 100%) border-box;
	}

	.p-line {
		box-shadow: 0px 0.5px 0.5px 0px #674B31;
		height: 4px;
		flex: 1;
		background: #A79E90;
	}

	.p-line-1 {
		background: linear-gradient(90deg, #a6660b 0%, #eaa718 100%);
	}
</style>