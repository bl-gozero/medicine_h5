<template>
	<view class="page">
		<Title title="全民体验" fixed bgColor="#fff" />
		<view class="relative">
			<image :src="img('bg-1.webp')" class="x-100" mode="widthFix"></image>
			<view class="flex-center x-100" style="position: absolute;top: 28%;">
				<PromoteSteps :promote="promote1" :goods="goods1" @active="showActive = true" />
			</view>
		</view>
		<view class="relative">
			<image :src="img('bg-2.webp')" class="x-100" mode="widthFix"></image>
			<view class="flex-center x-100" style="position: absolute;top: 9%;">
				<PromoteSteps :promote="promote2" :goods="goods2" @active="showActive = true" />
			</view>
		</view>
		<view class="relative">
			<image :src="img('bg-3.webp')" class="x-100" mode="widthFix"></image>
			<view class="absolute auto-x left-0 right-0 x-60 y-8" style="top: 85%;" @click="showShare = true"></view>
		</view>
		<view class="relative">
			<image :src="img('bg-4.webp')" class="x-100" mode="widthFix"></image>
			<view class="absolute x-80 y-20 border-box auto-x fgap-2 flex-between" style="bottom: 6%;">
				<view class="flex-1 y-100" v-for="i in 3" @click="$c.goto('/pages/activity/promote/log?type=' + i)"></view>
			</view>
		</view>
		<image :src="img('bg-5.webp')" class="x-100" mode="widthFix"></image>

		<u-popup :show="showShare" mode="bottom" bgColor="transparent" closeable @close="showShare = false">
			<view class="relative">
				<image :src="img('bg-share.webp')" class="x-100" mode="widthFix"></image>
				<view class="full border-box" style="padding: 0 3%">
					<image :src="img('share-title.webp')" class="w-187 h-93 auto-x" style="margin-top: -43px;"></image>
					<view class="y-7"></view>
					<view class="share-outside">
						<view class="share-box flex-between border-box">
							<view class="">
								<image :src="img(promote1.price + '.webp')" class="h-70"
									style="transform: translate(-6%, -17%) scale(1.4);" mode="heightFix"></image>
								<ShareProgress :promote="promote1" style="margin-top: -27px;" />
							</view>
							<ShareButton :promote="promote1" />
						</view>
					</view>
					<view class="y-5"></view>
					<view class="share-outside">
						<view class="share-box flex-between border-box">
							<view class="">
								<image :src="img(promote2.price + '.webp')" class="h-70"
									style="transform: translate(-6%, -17%) scale(1.4);" mode="heightFix"></image>
								<ShareProgress :promote="promote2" style="margin-top: -27px;" />
							</view>
							<ShareButton :promote="promote2" />
						</view>
					</view>
				</view>
			</view>
		</u-popup>
		
		<active-popup :showActive.sync="showActive" @submit="getInfo()" />
	</view>
</template>

<script>
	import PromoteSteps from './components/PromoteSteps.vue'
	import ShareProgress from './components/ShareProgress.vue'
	import ShareButton from './components/ShareButton.vue'
	import ActivePopup from './components/ActivePopup.vue'
	
	export default {
		components: {
			PromoteSteps,
			ShareProgress,
			ShareButton,
			ActivePopup
		},
		data() {
			return {
				showActive: false,
				showShare: false,
				goods1: [],
				goods2: [],
				promote1: {
					max: 2,
					count: 0,
					status: 0,
					num: 300,
					income: 1298,
					price: 998,
					amount: 0
				},
				promote2: {
					max: 2,
					count: 0,
					status: 0,
					num: 800,
					income: 3798,
					price: 2998,
					amount: 0
				},
				type: 0,
			}
		},
		onLoad() {
			this.getGoods()
		},
		onShow() {
			this.getInfo()
		},
		methods: {
			getGoods() {
				this.$api.goods.goodsList({
					page: 1,
					limit: 10,
					search: {
						goods_category_id: 2
					}
				}).then(res => {
					this.goods1 = res
				})
				
				this.$api.goods.goodsList({
					page: 1,
					limit: 10,
					search: {
						goods_category_id: 3
					}
				}).then(res => {
					this.goods2 = res
				})
				
				this.$api.event.recruitCommission({
					goods_category_id: 2
				}).then(res => {
					this.promote1.amount = res.total || 0
				})
				this.$api.event.recruitCommission({
					goods_category_id: 3
				}).then(res => {
					this.promote2.amount = res.total || 0
				})
			},
			getInfo() {
				this.$api.event.recruitCount({
					goods_category_id: 2
				}).then(res => {
					this.promote1.count = res.count || 0
				})
				this.$api.event.recruitCount({
					goods_category_id: 3
				}).then(res => {
					this.promote2.count = res.count || 0
				})
				this.$api.event.recruitJoin().then(res => {
					const status1 = res.some(i => i.goods_category_id == 2)
					if (status1) this.promote1.status = 1
					const status2 = res.some(i => i.goods_category_id == 3)
					if (status2) this.promote2.status = 1
				})
			},
			img(path, root = '/static/avtivity/promote/index/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.steps {
		width: 375px;
		height: 486px;
	}

	.step-1 {
		width: 153px;
		position: absolute;
		top: -17px;
		right: 25px;
		transform: scale(1.3);
	}

	.step-2 {
		width: 343px;
		height: 252px;
	}

	.price {
		position: absolute;
		top: -34px;
		left: 25px;
		width: 152px;
		transform: scale(1.5);
	}

	.goods-box {
		width: 343px;
		height: 134px;
		border-radius: 10px 10px 11px 11px;
		background: linear-gradient(180deg, #fdf1d800 0%, #fdf1d8 14%, #fdd689 100%);
	}

	.goods {
		width: 80px;
		height: 127px;
		background: linear-gradient(180deg, #ffffff 0%, #fbe8ce 100%);
		border-radius: 6px;
		box-shadow: 0px 0px 2px 0px #EA903C;
	}

	.btns {
		width: 67px;
		height: 20px;
		margin: 5px auto 0;
		line-height: 18px;
		text-align: center;
		font-size: 11px;
		font-weight: 500;
		color: #fff;
	}

	.btn-1 {
		background-image: url('/static/avtivity/promote/index/btn-1.webp');
		background-size: 100% 100%;
	}

	.btn-2 {
		background-image: url('/static/avtivity/promote/index/btn-2.webp');
		background-size: 100% 100%;
	}

	.btn-3 {
		background-image: url('/static/avtivity/promote/index/btn-3.webp');
		background-size: 100% 100%;
	}

	.share-box {
		background: linear-gradient(180deg, #fcf5e9 0%, #fce7cc 100%);
		border: 1px solid #F59B3D;
		border-radius: 8px;
		padding: 2% 13px 2% 10px;
	}

	.share-outside {
		box-shadow: 0px 0px 2px 0px #FFFFFF;
		border: 1px solid #FFFEEE;
		background: #FDCA6B;
		border-radius: 10px;
	}

	image {
		display: block;
	}
</style>