<template>
	<view class="page bg-page">
		<view class="level_box">
			<view class="" :class="['bg-' + level_index]">
				<Title title="商户权益中心" bgColor="transparent">
					<template v-if="profile.level.id < 3" v-slot:right>
						<view @click="$c.goto('/pages/user/team')">邀请的商户</view>
					</template>
				</Title>
				<image :src="$c.img(`/static/vip/v2/pointer_${level_index}.webp`)" class="x-100 maxh-50"
					mode="widthFix"></image>
				<swiper class="h-170" :interval="5000" :duration="500" :current="level_index - 1"
					@change="(e) => { level_index = e.detail.current + 1 }">
					<swiper-item v-for="item in level_list">
						<view class="">
							<view class="flex-center">
								<view class="relative">
									<image :src="$c.img(`/static/vip/v2/bg_${item.id}.webp`)" class="w-335 h-148 block"></image>
									<view class="absolute left-0 bottom-0 x-100 y-85 pl-20 pt-14 border-box">
										<view class="flex-start x-100">
											<image :src="$c.img(`/static/vip/v2/name_${item.id}.webp`)" class="h-22" style="max-width: 120px;" mode="heightFix">
											</image>
											<view class="unfinished text-black ml-10 mr-5">
												<text v-if="$c.calcLv(profile) < item.id">未达到</text>
												<text v-else-if="$c.calcLv(profile) == item.id">当前等级</text>
												<text v-else-if="$c.calcLv(profile) > item.id">已超过</text>
											</view>
											<u-icon name="info-circle" color="rgba(255, 255, 255, 0.8)" size="14" @click="showInfo = true"></u-icon>
										</view>
										<view class="text-white fw-7 fs-12 x-100 mt-10">升级进度</view>
										<view :class="'requirement_' + item.id">
											<view class="flex-start mt-2">
												<view class="w-97">
													<u-line-progress :percentage="getPercent(item)" :showText="false"
														inactiveColor="#D8D8D8" :height="2"></u-line-progress>
												</view>
												<text v-if="item.id > 3"
													class="fw-7 fs-12 ml-7">{{ item.count > item.num? item.num : item.count }}/{{ item.num }}</text>
												<image v-else :src="$c.img('/static/vip/v2/icon.webp')" class="i-16 block ml-8">
												</image>
											</view>
											<image src="/static/vip/partner/pop-arrow.webp"
												class="w-8 h-5 block ml-109 mt-3"></image>
											<view class="flex-start">
												<view class="fs-10 flex-start ptb-5 plr-7 rounded-x num relative"
													style="background: rgba(255, 255, 255, 0.5);">
													<image :src="$c.img('/static/vip/v2/ring.webp')" class="i-14"></image>
													<text>{{ item.require }}</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
				<view class="flex-between plr-20">
					<text class="fs-16">可享{{ level_list[level_index - 1].privilege }}/18特权</text>
					<view v-if="level_index > 4" class="flex-end lh-10"
						@click="$c.goto('/pages/index/protocols?type=5')">
						<text class="fs-12" style="color: #051835;">查看《商户合伙人计划》</text>
						<image src="/static/vip/right.webp" class="i-14"></image>
					</view>
					<view v-else class="flex-end lh-10"
						@click="$c.goto('/pages/index/protocols?type=4')">
						<text class="fs-12" style="color: #051835;">查看《商户服务介绍》</text>
						<image src="/static/vip/right.webp" class="i-14"></image>
					</view>
				</view>
			</view>
			<view class="bg-white ptb-15">
				<swiper :style="{ height: `${privilege_index == 0? swiperHeight1 : swiperHeight2}px` }" :interval="5000" :duration="500"
					@change="(e) => { privilege_index = e.detail.current }">
					<swiper-item>
						<view class="">
							<image :src="$c.img(`/static/vip/v2/privilege_1_${level_index}.webp`)"
								class="x-100 inline-block" mode="widthFix" @load="onImgLoad1"></image>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="">
							<image :src="$c.img(`/static/vip/v2/privilege_2_${level_index}.webp`)"
								class="x-100 inline-block" mode="widthFix" @load="onImgLoad2"></image>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view v-if="$c.calcLv(profile) < 4" class="roundedTop-14 p-20 pt-25 mt-15"
			style="background: linear-gradient(180deg, #FFF2E5 0%, #FFFFFF 15%);">
			<view class="fs-16">提升代理</view>
			<view class="mt-20">
				<view class="step_box flex-between">
					<view class="i-35 flex-center bg-white rounded">
						<image src="/static/vip/lv-2.webp" class="w-24 h-20 block"></image>
					</view>
					<view class="mlr-9 flex-1">
						<view class="">初级商户</view>
						<view class="text-info">进货1件指定商品</view>
					</view>
					<button v-if="profile.level.id < 2" class="btn bg-0 text-0"
						@click="$c.goto('/pages/goods/searchResult?is_level_valid=1')">去完成</button>
					<button v-else class="btn bg-1 text-1">已完成</button>
				</view>
				<view class="step_box flex-between">
					<view class="i-35 relative flex-center bg-white rounded">
						<image src="/static/vip/lv-3.webp" class="w-24 h-20 block"></image>
						<view class="line"></view>
						<image src="/static/vip/good-1.webp" class="w-109 h-31 absolute bottom-33 left-19"></image>
					</view>
					<view class="mlr-9 flex-1">
						<view class="">进阶商户</view>
						<view class="text-info">扩招{{ level3.upgrade_count || 3 }}名“初级商户”</view>
					</view>
					<button v-if="profile.level.id < 3" class="btn bg-0 text-0" @click="$c.goto('/pages/user/qrcode')">{{ num1 > 0? `还需${num1}人` : '去完成' }}</button>
					<button v-else class="btn bg-1 text-1">已完成</button>
				</view>
				<view class="step_box flex-between step_3">
					<view class="i-35 relative flex-center bg-white rounded">
						<image src="/static/vip/lv-4.webp" class="w-24 h-20 block"></image>
						<view class="line"></view>
						<image src="/static/vip/good-1.webp" class="w-109 h-31 absolute bottom-33 left-19"></image>
					</view>
					<view class="mlr-9 flex-1">
						<view class="">高级商户</view>
						<view class="text-info">扩招{{ level4.upgrade_count || 5 }}名“进阶商户”</view>
					</view>
					<button v-if="profile.direct_vip < 5" class="btn bg-0 text-0" @click="$c.goto('/pages/user/qrcode')">{{ num2 > 0? `还需${num2}人` : '去完成' }}</button>
					<button v-else class="btn bg-1 text-1">已完成</button>
				</view>
			</view>
		</view>
		<view v-if="$c.calcLv(profile) > 2" class="">
			<view class="mt-15" :class="$c.calcLv(profile) == 3 && ''">
				<view v-if="$c.calcLv(profile) > 2" class="relative mt-15">
					<image :src="`/static/vip/switch-${switcher}.webp`" class="x-100 block" mode="widthFix"></image>
					<view class="full flex-between item-stretch pr-20 border-box" style="padding-top: 7%;">
						<view class="fw-5 x-26 plr-13 border-box"
							:style="{ color: switcher == 4 ? '#969AA7' : '#B2A09B' }"
							@click="switcher = switcher == 3 ? 4 : 3">{{ switcher == 4 ? '销售数据' : '体系数据' }}</view>
						<view class="flex-1">
							<view class="fs-16 fw-5 flex-center">
								<text>{{ switcher == 3 ? '销售数据' : '体系数据' }}</text>
								<view class="icon_info ml-3" @click="showHint = true"></view>
							</view>
							<view v-if="switcher == 3" class="text-info flex-center mt-13 fs-10 lh-10">
								<text>数据更新于{{ now }}</text>
								<image src="/static/vip/refresh.webp" class="i-11 ml-4"
									@click="getSellData(1)"></image>
							</view>
							<view v-else class="text-info flex-center mt-13 fs-10 lh-10">
								<text>数据来源于{{ today }}</text>
							</view>
						</view>
						<view class="x-24">
							<view class="flex-end" @click="switcher == 4 ? $c.goto('/pages/finance/performance') : $c.sellData(0, profile.account)">
								<text class="fs-12">历史数据</text>
								<u-icon name="arrow-right" color="#9F9F9F" size="13"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view v-else-if="$c.calcLv(profile) == 3" class="">
					<view class="fs-16 fw-5 flex-center">
						<text>销售数据</text>
						<view class="icon_info ml-3" @click="showHint = true"></view>
					</view>
					<view class="text-info flex-center mt-13 fs-12 lh-10">
						<text>数据更新于{{ now }}</text>
						<image src="/static/vip/refresh.webp" class="i-11 ml-4" @click="getSellData()"></image>
					</view>
				</view>
				<view class="bg-white">
					<view v-if="switcher == 3" class="plr-20 pb-30">
						<view class="flex-between pt-33 flex-wrap fgap-20">
							<view class="data_bg rounded-8 p-12 border-box">
								<image src="/static/vip/ri.webp" class="icon"></image>
								<view class="text-info fs-12 mt-6">今日总销售（元）</view>
								<view class="fs-16 fw-7 u-line-1">{{ sell.day_sales || 0 }}</view>
							</view>
							<view class="data_bg rounded-8 p-12 border-box">
								<image src="/static/vip/zhou.webp" class="icon"></image>
								<view class="text-info fs-12 mt-6">本周总销售（元）</view>
								<view class="fs-16 fw-7 u-line-1">{{ sell.week_sales || 0 }}</view>
							</view>
							<view class="data_bg rounded-8 p-12 border-box">
								<image src="/static/vip/yue.webp" class="icon"></image>
								<view class="text-info fs-12 mt-6">当月总销售（元）</view>
								<view class="fs-16 fw-7 u-line-1">{{ sell.month_sales || 0 }}</view>
							</view>
							<view class="data_bg rounded-8 p-12 border-box">
								<image src="/static/vip/lei.webp" class="icon"></image>
								<view class="text-info fs-12 mt-6">累计总销售（元）</view>
								<view class="fs-16 fw-7 u-line-1">{{ sell.total_sales || 0 }}</view>
							</view>
							<view class="data_bg rounded-8 p-12 border-box icon">
								<image src="/static/vip/cun.webp" class="icon"></image>
								<view class="text-info fs-12 mt-6">存储产品总数量（件）</view>
								<view class="fs-16 fw-7 u-line-1">{{ sell.save_count || 0 }}</view>
							</view>
							<view class="data_bg rounded-8 p-12 border-box icon">
								<image src="/static/vip/xian.webp" class="icon"></image>
								<view class="text-info fs-12 mt-6">现存储产品数量（件）</view>
								<view class="fs-16 fw-7 u-line-1">{{ sell.save_buy_count || 0 }}</view>
							</view>
						</view>
						<button class="fw-7 btn-search flex-center rounded-x" @click="$c.goto('/pages/user/sell')">
							<image src="/static/vip/search.webp" class="i-22 mr-3"></image>
							<text class="text-white">查询销售数据</text>
						</button>
					</view>
					<view v-else-if="switcher == 4" class="">
						<view class="plr-20">
							<view class="pt-10 mb-17">当月数据</view>
							<view class="flex-between flex-wrap fgap-20">
								<view class="data_bg rounded-8 ptb-11 plr-13 border-box">
									<image src="/static/vip/data_1.png" class="i-17"></image>
									<view class="text-info fs-10 mtb-5">销售业绩（元）</view>
									<view class="fs-16 fw-7 u-line-1">{{ month_sales }}</view>
								</view>
								<view class="data_bg rounded-8 ptb-11 plr-13 border-box">
									<image src="/static/vip/data_2.png" class="i-17"></image>
									<view class="text-info fs-10 mtb-5">绩效分红（元）</view>
									<view class="fs-16 fw-7 u-line-1">{{ month_bonus }}</view>
								</view>
								<!-- <view class="data_bg rounded-8 ptb-11 plr-13 border-box">
									<image src="/static/vip/data_5.webp" class="i-17"></image>
									<view class="text-info fs-10 mtb-5">平级业绩（元）</view>
									<view class="fs-16 fw-7 u-line-1">{{ pingji }}</view>
								</view> -->
							</view>
							<view class="mt-10 mtb-17">累计数据</view>
							<view class="flex-between flex-wrap fgap-20">
								<view class="data_bg rounded-8 ptb-11 plr-13 border-box">
									<image src="/static/vip/data_3.png" class="i-17"></image>
									<view class="text-info fs-10 mtb-5">销售业绩（元）</view>
									<view class="fs-16 fw-7 u-line-1">{{ total_sales }}</view>
								</view>
								<view class="data_bg rounded-8 ptb-11 plr-13 border-box">
									<image src="/static/vip/data_4.png" class="i-17"></image>
									<view class="text-info fs-10 mtb-5">绩效分红（元）</view>
									<view class="fs-16 fw-7 u-line-1">{{ total_bonus }}</view>
								</view>
							</view>
						</view>
						<image :src="$c.img('/static/vip/reward_3.webp')" class="x-100 block mt-40" mode="widthFix"></image>
					</view>
				</view>
			</view>
		</view>
		<view v-if="load" class="fs-10 text-center ptb-30">
			<text class="text-info">详细权益等请查看</text>
			<text class="text-base" @click="$c.goto('/pages/index/userService')">《商户服务介绍》</text>
		</view>
		<!-- 提示 -->
		<u-popup :show="showHint" mode="center" round="20" :closeOnClickOverlay="false" @close="showHint = false">
			<view class="w-308 plr-30 ptb-25 text-center border-box">
				<view class="fs-18">温馨提示</view>
				<view v-if="switcher == 3" class="mt-34 lh-17 fs-14">
					“销售数据”将体现您整个销售团队的所有数据情况，包含同级别以下用户数据。
				</view>
				<view v-if="switcher == 4" class="mt-34 lh-17 fs-14">
					“体系数据”同合伙人级别用户团队业绩将不纳入“体系数据”统计范围。每月完成“团队绩效”考核可获得对应“绩效分红”。“绩效分红”每月1日自动重置，不做累计计算。
				</view>
				<button class="bg-base text-white w-234 h-51 fs-16 fw-7 mt-68 flex-center rounded-x"
					@click="showHint = false">知道了</button>
			</view>
		</u-popup>
		<u-popup :show="showInfo" mode="center" bgColor="transparent" :closeOnClickOverlay="false"
			@close="showInfo = false;">
			<view class="popup-box bg-white p-20">
				<view class="text-black text-center fs-18">温馨提示</view>
				<view class="lh-20 mt-40 text-black plr-20">
					App内“级别”仅用于业务身份与权限区分，“合伙人”等称谓仅为内部名称，不涉及法律、投资或收益关系
				</view>
				<button class="bg-base fs-16 flex-center text-white w-234 h-51 mt-34 flex-center rounded-x"
					@click="showInfo = false;">知道了</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	import PlayImg from '../../components/PlayImgs.vue';

	export default {
		components: {
			Title,
			PlayImg
		},
		data() {
			return {
				profile: this.$c.profile(),
				switcher: 3,
				load: false,
				performance: {
					load: false
				},
				year: new Date().getFullYear(),
				month: new Date().getMonth() + 1,
				today: new Date(Date.now() - 86400000).toISOString().slice(0, 10),
				now: this.$c.formatDateTime(),
				month_sales: 0,
				month_bonus: 0,
				total_sales: 0,
				total_bonus: 0,
				pingji: 0,
				level3: {},
				level4: {},
				num1: 0,
				num2: 0,
				showHint: false,
				sell: {},
				level_list: [{
						id: 1,
						name: '',
						num: 0,
						count: 0,
						privilege: 1,
						require: '注册可得该等级，升级可获得更多权益~'
					},
					{
						id: 2,
						name: '',
						num: 1,
						count: 0,
						privilege: 2,
						require: '进货1件指定商品提升到该等级'
					},
					{
						id: 3,
						name: '',
						num: 3,
						count: 0,
						privilege: 5,
						require: '扩招3名初级商户提升到该等级'
					},
					{
						id: 4,
						name: '',
						num: 5,
						count: 0,
						privilege: 5,
						require: '扩招5名进阶商户提升到该等级'
					},
					{
						id: 5,
						name: '',
						num: 5,
						count: 0,
						privilege: 9,
						require: '扩招5名进阶商户提升到该等级'
					},
					{
						id: 6,
						name: '',
						num: 5,
						count: 0,
						privilege: 14,
						require: '扩招5名区级商户提升到该等级'
					},
					{
						id: 7,
						name: '',
						num: 12,
						count: 0,
						privilege: 18,
						require: '扩招12名市级商户提升到该等级'
					}
				],
				level_index: 1,
				privilege_index: 0,
				scrollOffset: 50,
				swiperHeight1: 50,
				swiperHeight2: 200,
				showInfo: false
			}
		},
		async onLoad() {
			this.profile = await this.$c.checkeLogin(1)
			if (this.profile.direct) this.level_list[2].count = this.profile.direct
			// if (this.profile.spread_count) this.level_list[2].count = this.profile.spread_count
			if (this.profile.direct_vip) this.level_list[3].count = this.profile.direct_vip
			if (this.profile.team_partners_count) this.level_list[4].count = this.profile.team_partners_count
			if (this.profile.team_bronze_count) this.level_list[5].count = this.profile.team_bronze_count
			if (this.profile.team_silver_count) this.level_list[6].count = this.profile.team_silver_count
			this.levelList()
			if (this.$c.calcLv(this.profile) >= 3) this.getSellData()
			if (this.$c.calcLv(this.profile) >= 3) this.getPerformce()
			this.level_index = this.$c.calcLv(this.profile)
		},
		methods: {
			onImgLoad1(e) {
				const { width, height } = e.detail;
				// 获取 window 宽度
				const screenWidth = uni.getSystemInfoSync().windowWidth;
				// 计算图片显示宽度（根据你的 x-100 = 100% 宽度来算）
				const displayWidth = screenWidth;
				// 按比例计算高度
				const displayHeight = (height / width) * displayWidth;
				this.swiperHeight1 = displayHeight;
			},
			onImgLoad2(e) {
				const { width, height } = e.detail;
				// 获取 window 宽度
				const screenWidth = uni.getSystemInfoSync().windowWidth;
				// 计算图片显示宽度（根据你的 x-100 = 100% 宽度来算）
				const displayWidth = screenWidth;
				// 按比例计算高度
				const displayHeight = (height / width) * displayWidth;
				this.swiperHeight2 = displayHeight;
			},
			getPercent(item) {
				if(this.$c.calcLv(this.profile) >= item.id) return 100
				if(item.id < 4) {
					return 0
				} else {
					const count = Number(item?.count) || 0
					const num = Number(item?.num) || 0
					if (num <= 0) return 0
					return Math.floor((count * 100) / num)
				}
			},
			async getSellData(n = null) {
				const res = await this.$c.fetch(this.$api.user.mySellInfo)
				if (res) {
					this.sell = res
					this.now = this.$c.formatDateTime()
					if(n) this.$c.toast('刷新成功')
				}
			},
			async levelList() {
				const res = await this.$c.fetch(this.$api.config.levelList)
				if (res) {
					this.list = res;
					this.load = true
					if (this.profile.level.id < 3) {
						const level3 = res.find(i => i.id == 1)
						if (level3) {
							this.level3 = level3
							this.num1 = level3.upgrade_count - this.profile.direct
							this.level_list[2].num = level3.upgrade_count
						}
						const level4 = res.find(i => i.id == 3)
						if (level4) {
							this.level4 = level4
							this.num2 = level4.upgrade_count - this.profile.direct_vip
							this.level_list[3].num = level4.upgrade_count
						}
					}
				}
			},
			async getPerformce() {
				const res = await this.$c.fetch(this.$api.finance.performance)
				if (res) {
					this.month_sales = res.month_sales || 0
					this.month_bonus = res.month_dividends || 0
					this.total_sales = res.total_sales || 0
					this.total_bonus = res.total_dividends || 0
					this.pingji = res.replenish_sales || 0
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.level_box {
		.bg-1 {
			background: linear-gradient(180deg, #C0D4D2 0%, #DCEDEB 14%, #E5EFEC 26%, #FFFFFF 57%);
		}

		.bg-2 {
			background: linear-gradient(180deg, #CDC7B6 0%, #E5E1D3 10%, #F6EFE3 30%, #FFFFFF 87%);
		}

		.bg-3 {
			background: linear-gradient(180deg, #EDDEB1 0%, #F6EED2 13%, #F6EFE3 30%, #FFFFFF 87%);
		}

		.bg-4 {
			background: linear-gradient(180deg, #767CA5 0%, #B0B9D5 13%, #D4DFF7 30%, #FFFFFF 87%);
		}

		.bg-5 {
			background: linear-gradient(180deg, #B89E8E 0%, #F2E6DB 25%, #FCF6F1 48%, #FFFFFF 100%);
		}

		.bg-6 {
			background: linear-gradient(180deg, #AEB3BA 0%, #D5DEE5 13%, #EAEFF1 30%, #FFFFFF 87%);
		}

		.bg-7 {
			background: linear-gradient(180deg, #CBA149 0%, #E4C88F 17%, #F9EACB 30%, #FFFFFF 87%);
		}

		.name {
			color: #A29FB2;
			font-size: 10px;
			font-weight: 700;
		}

		.active {
			background: rgba(255, 255, 255, 0.2);
			border-radius: 4px;
			color: #fff;
			padding: 3px 6px;
		}

		.unfinished {
			background: linear-gradient(90deg, #FFFFFF 0%, #D0D0D0 100%);
			border-radius: 5px;
			font-size: 12px;
			padding: 4px 6px;
			line-height: 1;
		}

		.requirement_1 {
			color: #69706E;

			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #69706E 0%, #98ADA8 100%);
			}
		}

		.requirement_2 {
			color: #736E68;

			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #736E68 3%, #A79A8B 100%);
			}
		}

		.requirement_3 {
			color: #A8792A;

			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #A8792A 3%, #FFE3A4 100%);
			}
		}

		.requirement_4 {
			color: #191931;

			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #191931 0%, #384E77 97%);
			}
		}

		.requirement_5 {
			color: #905847;

			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #8F5746 0%, #B48E77 100%);
			}
		}

		.requirement_6 {
			color: #707F8F;

			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #6D7D8C 0%, #9BA5B6 99%);
			}
		}

		.requirement_7 {
			color: #B56A1F;

			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #B5691E 0%, #C78535 99%);
			}
		}
	}

	.form_box {
		background: linear-gradient(180deg, #FFF2E5 0%, #FFFFFF 12%);
		padding: 34px 20px;
	}

	.data_bg {
		background: #F3F4FB;
		position: relative;
		width: calc(50% - 10px);

		.icon {
			position: absolute;
			left: 12px;
			top: 0;
			transform: translateY(-50%);
			width: 23px;
			height: 23px;
		}
	}

	.switch_box {
		background: linear-gradient(180deg, #E0E5FA 0%, #FFFFFF 12%);
		padding-top: 30px;
		border-radius: 14px;
	}

	.step_box {
		background: linear-gradient(90deg, #FFF6DC 0%, #FFFFFF 100%);
		box-shadow: 0px 2px 4px 0px rgba(208, 149, 46, 0.3);
		height: 66px;
		border-radius: 10px;
		margin-bottom: 15px;
		padding: 14px 7px;
		box-sizing: border-box;

		.text-info {
			color: #968970;
			margin-top: 5px;
			font-size: 12px;
		}

		.btn {
			width: 87px;
			height: 35px;
			border: 0;
		}

		.text-0 {
			color: #E7D0BF;
		}

		.text-1 {
			color: #696969;
		}

		.bg-1 {
			background-color: #D1CBBE !important;
			color: #897E68 !important;
		}

		.bg-0 {
			background: linear-gradient(180deg, #FFF6E4 0%, #F3C973 100%) !important;
			box-shadow: 0px 2px 5px 0px rgba(209, 171, 94, 0.45);
			color: #8F6238 !important;
			font-weight: 500;
		}

		.line {
			position: absolute;
			left: 50%;
			bottom: 100%;
			width: 0;
			border-left: 1.5px dashed #CAA154;
			height: 45px;
			transform: translateX(-50%);
		}
	}

	.step_3 {
		background: linear-gradient(270deg, #C0C5D4 5%, #F2F6FD 100%) !important;
	}

	.btn-search {
		background: linear-gradient(270deg, #72A3F7 0%, #1D66E2 100%);
		width: 180px;
		height: 38px;
		margin-top: 30px;
		font-size: 14px;
	}
</style>