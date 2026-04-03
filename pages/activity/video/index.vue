<template>
	<view>
		<view v-if="page == 1" class="page page_1">
			<view class="relative">
				<image :src="img('top_3.webp')" class="x-100 block" mode="widthFix"></image>
				<view v-if="star.end_time" class="time">活动日期：即日 - {{ star.end_time }}</view>
				<view class="full">
					<Title onlyBack bgColor="transparent" />
				</view>
			</view>
			<view class="flex-center">
				<view class="w-375 h-605 relative">
					<image :src="img('part_1.webp')" class="x-100 y-100 block"></image>
					<view class="absolute top-13 right-21 ptb-4 plr-10 flex-center lh-10 rounded-x"
						style="background: linear-gradient(90deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);">
						<image :src="img('star.webp')" class="i-20"></image>
						<text class="text-num fs-12 fw-7">我的幸运星：{{ star.lucky_star || 0 }}颗 </text>
					</view>
					<view class="full border-box plr-39 pt-87">
						<view class="flex-start flex-wrap fgap-3 y-83">
							<view v-if="index < 9" class="text-center mb-16 self-start" v-for="(item, index) in goods"
								:key="item.id">
								<view class="goods relative"
									@click="$c.goto('/pages/activity/video/goodsDetail?id=' + item.id)">
									<image :src="item.picture" class="w-69 h-53 block auto-x roundedTop-4" mode="aspectFill"></image>
									<view class="flex-center fs-10 absolute bottom-11 x-100 text-num lh-10">
										<text>幸运星：</text>
										<text class="fw-7">{{ item.price }}</text>
										<image :src="img('star.webp')" class="i-16"></image>
									</view>
								</view>
								<view class="fw-7 fs-12 u-line-1 w-98">{{ item.name }}</view>
								<button class="btn btn-exchange fs-12 fw-7 mt-6">兑换</button>
							</view>
						</view>
						<image :src="img('btn.webp')" class="btn-check auto-x block mt-14" @click="onLog(2)"></image>
					</view>
				</view>
			</view>
			<view class="flex-center">
				<view class="w-375 h-316 relative">
					<image :src="img('part_2.webp')" class="x-100 y-100 block"></image>
					<view class="full border-box plr-31 pt-58">
						<view class="flex-between fgap-10 fs-12">
							<view class="step self-start">STEP1</view>
							<view class="flex-1">
								<view class="fw-7 mb-11">下载素材复制文案发布到指定平台</view>
								<button class="btn-play m-0" @click="onLog(4)">去素材库</button>
							</view>
						</view>
						<view class="flex-between fgap-10 fs-12 mt-17">
							<view class="step self-start">STEP2</view>
							<view class="flex-1">
								<view class="fw-7 mb-11">提交发布证明通过审核，获取幸运星兑换礼品</view>
								<image :src="img('step.webp')" class="w-204 h-71 block mt-16 m-10"></image>
								<button class="btn-play m-0" @click="onLog(5)">去提交</button>
								<view class="mt-8">
									<text class="fs-12" style="color: #FF5600;" @click="onLog(3)">查看提交记录></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-center">
				<view class="w-375 h-395 relative">
					<image :src="img('part_3.webp')" class="x-100 y-100 block"></image>
					<view class="full border-box">
						<view class="fw-7 mt-70 ml-63">做任务获得幸运星</view>
						<view class="flex-between text-center plr-50 fgap-10 mt-15">
							<view class="flex-1">
								<view class="text-num fs-20 fw-7">{{ star.total_lucky_star || 0 }}</view>
								<view class="mt-5 flex-center">
									<image :src="img('star.webp')" class="i-22"></image>
									<text class="fs-12 fw-7 lh-10">累积获得</text>
								</view>
							</view>
							<view class="line"></view>
							<view class="flex-1">
								<view class="text-num fs-20 fw-7">{{ star.lucky_star || 0 }}</view>
								<view class="mt-5 flex-center">
									<image :src="img('star.webp')" class="i-22"></image>
									<text class="fs-12 fw-7 lh-10">目前拥有</text>
								</view>
							</view>
						</view>
						<view class="mt-35 ml-63">
							<view class="fw-7">
								<text>审核通过概览</text>
								<text style="color: #FF5600;" @click="onLog(3, 2)">（共计{{ star.completed }}>）</text>
							</view>
							<view class="fs-12 mt-10 text-num">审核通过1条得1颗幸运星，单平台限投10条</view>
						</view>
						<view class="flex-between flex-wrap plr-40">
							<view class="x-33 flex-center" v-for="item in platforms">
								<view class="text-center mt-12">
									<image :src="item.logo" class="i-30 block auto-x bg-page"></image>
									<view class="fs-12 fw-5 mt-4">{{ item.value }}(<text
											class="text-danger">{{ item.completed }}</text>/{{ item.max }})</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<image :src="img('part_4.webp')" class="w-375 h-382 block auto-x"></image>
			<view class="h-50"></view>
		</view>

		<view v-if="page == 2" class="page bg-page plr-20">
			<Title title="兑换记录" fixed isBack @back="page = 1" />
			<view class="bg-white p-12 rounded-8 flex-between mt-10 fgap-10" v-for="item in logs" :key="item.id">
				<image :src="item.picture" class="i-70 block rounded-10 bg-page"></image>
				<view class="lh-10 flex-1">
					<view class="fs-14 fw-5">{{ item.name }}</view>
					<view class="text-info fs-12 mtb-10">{{ item.price }}颗幸运星</view>
					<view class="flex-between">
						<text class="text-info fs-12">{{ item.exchange_at }}</text>
						<button class="w-65 h-26 border-plain btn fs-12 m-0" plain>查看物流</button>
					</view>
				</view>
			</view>
		</view>

		<view v-if="page == 3" class="page bg-page plr-20">
			<Title title="提交记录" fixed isBack @back="page = 1" />
			<view class="flex-start fgap-36 nav">
				<view :class="item.id == nav ? 'fw-7 nav_active' : 'text-info'" v-for="item in navList" :key="item.id"
					@click="onVideoList(item.id)">{{ item.name }}</view>
			</view>
			<view class="bg-white p-12 rounded-8 flex-between mt-10 fgap-10" v-for="item in logs" :key="item.id"
				@click="onLog(5, item.id)">
				<image :src="item.picture" class="i-70 block rounded-10 bg-page"></image>
				<view class="lh-10 flex-1">
					<view class="flex-between">
						<text class="fs-14 fw-5 u-line-1">{{ item.code }}</text>
						<text class="text-gold" :class="statusClass">{{ item.verify? item.verify.value : '' }}</text>
					</view>
					<view class="text-info fs-12 mtb-10">{{ item.price }}抖音</view>
					<view class="text-info fs-12">{{ item.exchange_at }}</view>
				</view>
			</view>
		</view>

		<view v-if="page == 4" class="page" style="background: #B9E5FD;">
			<view class="relative">
				<image :src="img('subtop.webp')" class="x-100 block"></image>
				<view class="full">
					<Title title="素材库" bgColor="transparent" isBack @back="page = 1" />
				</view>
			</view>
			<view class="flex-center" style="margin-top: -80rpx;">
				<view class="rounded-10 bg-white relative border-box pt-30 pb-20 plr-14 w-348">
					<image :src="img('asset.webp')" class="title block"></image>
					<view class="">
						<view class="flex-end">
							<button class="btn-play m-0 w-79 p-0 flex-center">
								<image :src="img('copy.webp')" class="i-16 block"></image>复制文案
							</button>
						</view>
						<view class="rounded-4 h-95 border-box p-10 mt-10" style="background: #E6F3FA;">
							<scroll-view class="h-75 rounded-4" scroll-y>
								<view class="" style="color: #637B87;">#北辰乐购#还在为买不到海外好物发愁？</view>
							</scroll-view>
						</view>
						<view class="flex-end mt-15">
							<button class="btn-play m-0 w-108 p-0 flex-center">
								<image :src="img('download.webp')" class="i-16 block"></image>下载图片/视频
							</button>
						</view>
						<view class="flex-start fgap-6 mt-10 flex-wrap">
							<view class="i-75 bg-page" v-for="item in 6"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'

	export default {
		components: {
			Title
		},
		data() {
			return {
				page: 1,
				logs: [],
				platforms: [],
				star: {
					lucky_star: 0,
					total_lucky_star: 0,
					completed: 0
				},
				navList: [{
						id: 1,
						name: '审核中'
					},
					{
						id: 4,
						name: '已修改'
					},
					{
						id: 2,
						name: '已通过'
					},
					{
						id: 3,
						name: '未通过'
					}
				],
				goods: [],
				nav: 1
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getVideoInfo()
			this.getGoods()
			this.getPlatforms()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			statusClass(item) {
				const map = {
					0: 'text-info',
					1: 'text-gold',
					2: 'text-success',
					3: 'text-danger',
					4: 'text-gold'
				}
				return map[item.verify?.id] || 'text-info'
			},
			async onLog(n, e = null) {
				this.page = n
				if (n == 2) {
					this.getReceiveList()
				}
				if (n == 3) {
					if (e == 2) this.nav = 2
					this.getVideoList()
				}
				if (n == 5) {
					let page = '/pages/activity/video/video' + (e ? `?id=${e}` : '')
					this.$c.goto(page)
				}
			},
			async getReceiveList() {
				const res = await this.$c.fetch(this.$api.event.videoReceiveList)
				if (res) this.logs = res
			},
			async getPlatforms() {
				const res = await this.$c.fetch(this.$api.event.platformList)
				if (res) this.platforms = res
			},
			async getVideoInfo() {
				const res = await this.$c.fetch(this.$api.event.videoInfo)
				if (res) this.star = res
			},
			async getGoods() {
				const res = await this.$c.fetch(this.$api.goods.goodsList, {
					is_level_valid: 0,
					is_integral: 2,
					is_lucky_star: 1,
					page: 1,
					limit: 10
				})
				if (res) this.goods = res
			},
			onVideoList(e) {
				if (this.nav == e) return
				this.nav = e
				this.getVideoList()
			},
			async getVideoList() {
				const res = await this.$c.fetch(this.$api.event.videoList, {
					search: {
						verify: this.nav
					}
				})
				if (res) this.logs = res
			},
			img(path, root = '/static/avtivity/video/') {
				let imgPath = root + path
				return this.$c.img(imgPath, 0)
			}
		}
	}
</script>

<style scoped lang="scss">
	.page_1 {
		background-color: #B9E5FD;
		background-image: url('/static/avtivity/video/top.webp');
		background-repeat: no-repeat;
		background-size: 100% auto;
	}

	.goods {
		width: 98px;
		height: 82px;
		background-image: url('/static/avtivity/video/goods.webp');
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.btn-exchange {
		background: linear-gradient(180deg, #ECF5C1 0%, #FDEF0A 27%, #FFF99A 100%);
		width: 67px;
		height: 22px;
		border: 1px solid #FFFFFF;
	}

	.btn-check {
		width: 211px;
		height: 49px;
		animation: scalePulse 2s infinite ease-in-out;
	}

	@keyframes scalePulse {

		0%,
		100% {
			transform: scale(1);
		}

		50% {
			transform: scale(1.1);
		}
	}

	.step {
		background: #FF7C93;
		border-radius: 5px 5px 11px 5px;
		width: 52px;
		height: 20px;
		line-height: 18px;
		font-weight: 900;
		font-size: 12px;
		font-family: Be Vietnam Pro;
		// transform: skew(-10deg);
		font-style: italic;
		color: #fff;
		padding-left: 5px;
	}

	.btn-play {
		background: linear-gradient(90deg, #FF9563 0%, #FF470C 47%, #FC37A9 100%);
		border-radius: 8px;
		width: 77px;
		height: 27px;
		font-size: 13px;
		font-weight: 500;
		line-height: 25px;
		text-align: center;
		color: #FFFFFF;
	}

	.line {
		border-left: 1px solid #D8D8D8;
		width: 0;
		height: 30px;
	}

	.text-num {
		color: #B2611C;
	}

	.nav .text-info {
		color: #575D62;
	}
	
	.title {
		position: absolute;
		top: -8px;
		left: -3px;
		width: 354px;
		height: 76px;
	}

	.time {
		background: linear-gradient(180deg, #D5F4FD 0%, #F6FDFF 17%);
		border: 1px solid #FFFFFF;
		border-radius: 999px;
		font-weight: 500;
		padding: 8px 12px;
		position: absolute;
		top: 77%;
		left: 4%;
	}
</style>