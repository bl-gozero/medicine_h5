<template>
	<view class="page bg-page">
		<view class="bg" style="min-height: 100vh;">
			<Title title="会员" bgColor="transparent" />
			<!-- <view class="plr-20">
				<view class="flex-between">
					<u-avatar :src="profile.avatar" size="55" :default-url="$c.userAvatar()"></u-avatar>
					<view class="ml-10 flex-1">
						<view class="u-line-1">{{ profile.account }}</view>
						<view class="h-20">
							<view v-if="load" class="">
								<view v-if="profile.level.id == 4" class="flex-start fw-7">
									<image src="/static/vip/icon_4.webp" class="i-18 mr-3"></image>
									<text style="color: #30304C;">{{ profile.level.value }}</text>
								</view>
								<view v-else-if="profile.level.id == 3" class="flex-start fw-7">
									<image src="/static/vip/icon_3.webp" class="i-18 mr-3"></image>
									<text style="color: #7B351B;">{{ profile.level.value }}</text>
								</view>
								<view v-else class="fw-7">{{ profile.level.value }}</view>
							</view>
						</view>
					</view>
					<view class="self-start">
						<u-text
							suffixIcon="arrow-right"
							iconStyle="font-size: 14px;color: #8A6539;"
							size="12"
							color="#8A6539"
							lineHeight="1"
							text="已邀请的好友"
							@click="$c.goto('/pages/user/team')"
						></u-text>
					</view>
				</view>
			</view> -->
			<view class="flex-center mt-10">
				<view class="relative w-335">
					<image :src="`/static/vip/vip/bg-lv-${$c.calcLv(profile)}.webp`" class="pw-100" mode="widthFix"></image>
					<view class="full border-box flex-start ph-85" style="padding-left: 8%;">
						<view class="">
							<image :src="`/static/vip/name_level_${$c.calcLv(profile)}.webp`" class="h-20 block" mode="heightFix"></image>
							<view class="pl-28 mt-8 fs-12">{{profile.account}}的当前等级</view>
						</view>
					</view>
					<image 
						v-if="profile.level.id < 3"
						src="/static/vip/invite.webp"
						class="w-140 h-48 absolute right-0"
						style="bottom: 3%;"
						@click="$c.goto('/pages/user/team')"
					></image>
				</view>
			</view>
			<view v-if="load" class="">
				<view class="relative mt-24">
					<image :src="`/static/vip/switch_${switcher}.webp`" class="pw-100 block" mode="widthFix"></image>
					<view class="full flex-between">
						<view class="pw-50 ph-100" @click="onSwitch(3)"></view>
						<view class="pw-50 ph-100" @click="onSwitch(4)"></view>
					</view>
				</view>
				<view  class="bg-white ptb-26 h-280 relative border-box" style="border-radius: 0 0 20px 20px;">
					<view v-if="profile.level.id < switcher" class="plr-30">
						<view class="step_box flex-between">
							<view class="i-35">
								<image src="/static/vip/step-1.webp" class="i-35"></image>
							</view>
							<view class="mlr-9 flex-1">
								<view class="">成为推广员</view>
								<view class="text-info">购买1件指定商品即可</view>
							</view>
							<u-button 
								v-if="profile.level.id < 2"
								class="btn bg-0 text-0"
								shape="circle"
								text="去完成"
								@click="$c.goto('/pages/goods/searchResult?is_level_valid=1')"
							></u-button>
							<u-button v-else class="btn bg-1 text-1" shape="circle" text="已完成"></u-button>
						</view>
						<view class="step_box flex-between">
							<view class="i-35 relative">
								<image src="/static/vip/step-2.webp" class="i-35"></image>
								<view class="line-1"></view>
							</view>
							<view class="mlr-9 flex-1">
								<view class="">升级为VIP</view>
								<view class="text-info">邀请{{ level3.upgrade_count || 3 }}位好友成为推广员</view>
							</view>
							<u-button v-if="profile.level.id < 3" class="btn bg-0 text-0" shape="circle" :text="num1 > 0? `还需${num1}人` : '去完成'" @click="$c.goto('/pages/user/qrcode')"></u-button>
							<u-button v-else class="btn bg-1 text-1" shape="circle" text="已完成"></u-button>
						</view>
						<view v-if="switcher == 4" class="step_box flex-between step_3">
							<view class="i-35 relative">
								<image src="/static/vip/step-3.webp" class="i-35"></image>
								<view class="line-2"></view>
								<image src="/static/vip/good-1.webp" class="w-109 h-31 absolute bottom-30 left-20"></image>
							</view>
							<view class="mlr-9 flex-1">
								<view class="">升级为合伙人</view>
								<view class="text-info">邀请{{ level4.upgrade_count || 5 }}位好友成为VIP会员</view>
							</view>
							<u-button v-if="profile.direct_vip < 5" class="btn bg-0 text-0" shape="circle" :text="num2 > 0? `还需${num2}人` : '去完成'" @click="$c.goto('/pages/user/qrcode')"></u-button>
							<u-button v-else class="btn bg-1 text-1" shape="circle" text="已完成"></u-button>
						</view>
						<view class="absolute text-center pw-100 left-0 bottom-12 fs-10">
							<view>
								<text>了解详情请阅读</text>
								<text class="text-base" @click="$c.goto('/pages/index/protocols?type=' + (switcher - 1))">
									{{ switcher == 3? '《VIP服务介绍》' : '《合伙人服务介绍》'}}
								</text>
							</view>
						</view>
					</view>
					<view v-else class="flex-center">
						<view class="relative">
							<image :src="`/static/vip/right_${switcher}.webp`" class="w-312 h-223"></image>
							<!-- <image 
								:src="`/static/vip/tag_${switcher}.png`" 
								class="absolute right-0"
								:class="switcher == 3? 'w-121 h-110' : 'w-131 h-102'"
								style="top: -21px;"
							></image> -->
							
							<view v-if="switcher == 3" class="absolute right-0 pw-57" style="top: -10%;">
								<PlayImg
									path="user/vip/tag_3/1"
									:interval="50"
									:length="40"
									type='webp'
								/>
							</view>
							<view v-if="switcher == 4" class="absolute right-0 pw-55" style="top: -8%;">
								<PlayImg
									path="user/vip/tag_4/2"
									:interval="50"
									:length="40"
									type='webp'
								/>
							</view>
							<view class="absolute text-center pw-100 left-0 bottom-12 fs-10">
								<view class="" :style="{ color: switcher == 3 ? '#7B351B' : '#30304C' }">
									<text>更多详细权益查看</text>
									<text class="underline" @click="$c.goto('/pages/index/protocols?type=' + (switcher - 1))">
										{{ switcher == 3? '《VIP服务介绍》' : '《合伙人服务介绍》'}}
									</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view 
				v-if="profile.level.id >= 3 && performance.load && switcher == 3" 
				class="mt-12 rounded-20 ptb-25 plr-20 relative" 
				style="background: linear-gradient(180deg, #E0E5FA 0%, #FFFFFF 12%);"
			>
				<view class="fs-16 fw-5 flex-center">
					<text>销售数据</text>
					<view class="icon_info ml-3" @click="showHint = true"></view>
				</view>
				<view class="text-info flex-center mt-13 fs-12 lh-10">
					<text>数据更新于{{ now }}</text>
					<image src="/static/vip/refresh.webp" class="i-11 ml-4" @click="getSellData()"></image>
				</view>
				<view class="flex-between mt-33 flex-wrap fgap-20">
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
				</view>
				<u-button class="fw-7 btn-search" shape="circle" @click="$c.goto('/pages/user/sell')">
					<image src="/static/vip/search.webp" class="i-22 mr-3"></image>
					<text class="text-white">查询销售数据</text>
				</u-button>
			</view>
			<view 
				v-if="profile.level.id >= 4 && performance.load && switcher == 4" 
				class="mt-12 rounded-20 pt-25 relative" 
				style="background: linear-gradient(180deg, #FFE6E6 0%, #FFFFFF 17%);"
			>
				<view class="plr-20">
					<view class="fs-16 fw-5 flex-center">
						<text>团队业绩</text>
						<view class="icon_info ml-3" @click="showHint = true"></view>
					</view>
					<view class="text-info text-center mt-13 fs-12">数据更新于{{ today }}</view>
					<view class="mt-10 mb-17">当月数据</view>
					<view class="flex-between">
						<view class="data_bg rounded-8 ptb-11 plr-13 pw-48 border-box">
							<image src="/static/vip/data_1.png" class="i-17"></image>
							<view class="text-info fs-10 mtb-5">销售业绩（元）</view>
							<view class="fs-16 fw-7 u-line-1">{{ month_sales }}</view>
						</view>
						<view class="data_bg rounded-8 ptb-11 plr-13 pw-48 border-box">
							<image src="/static/vip/data_2.png" class="i-17"></image>
							<view class="text-info fs-10 mtb-5">绩效分红（元）</view>
							<view class="fs-16 fw-7 u-line-1">{{ month_bonus }}</view>
						</view>
					</view>
					<view class="mt-10 mtb-17">累计数据</view>
					<view class="flex-between">
						<view class="data_bg rounded-8 ptb-11 plr-13 pw-48 border-box">
							<image src="/static/vip/data_3.png" class="i-17"></image>
							<view class="text-info fs-10 mtb-5">销售业绩（元）</view>
							<view class="fs-16 fw-7 u-line-1">{{ performance.total.sales }}</view>
						</view>
						<view class="data_bg rounded-8 ptb-11 plr-13 pw-48 border-box">
							<image src="/static/vip/data_4.png" class="i-17"></image>
							<view class="text-info fs-10 mtb-5">绩效分红（元）</view>
							<view class="fs-16 fw-7 u-line-1">{{ performance.total.bonus }}</view>
						</view>
					</view>
					<view class="absolute top-30 right-20">
						<u-text
							suffixIcon="arrow-right"
							iconStyle="font-size: 14px;color: #9F9F9F;"
							size="12"
							color="#3D3D3D"
							lineHeight="1"
							text="历史数据"
							@click="$c.goto('/pages/finance/performance')"
						></u-text>
					</view>
				</view>
				<image src="/static/vip/level_4_reward.webp" class="pw-100 block mt-40" mode="widthFix"></image>
				
				<!-- partner -->
				<view class="partner_box pb-20 pt-10">
					<view class="">
						<swiper class="h-220" :interval="5000" :duration="500" @change="onParnterChange">
							<swiper-item v-for="item in partner_list">
								<view class="">
									<image :src="`/static/vip/partner/pointer-${item.id}.webp`" class="pw-100 maxh-50" mode="widthFix"></image>
									<view class="flex-center">
										<view class="relative">
											<image :src="`/static/vip/partner/bg-${item.id}.webp`" class="w-334 h-148 block"></image>
											<view class="absolute left-0 bottom-0 pw-100 ph-85 pl-20 pt-14 border-box">
												<view class="flex-start pw-100">
													<image :src="`/static/vip/partner/name-${item.id}.webp`" class="w-120 h-22"></image>
													<view v-if="item.count < item.num" class="unfinished text-black ml-10">未完成</view>
												</view>
												<view class="text-white fw-7 fs-12 pw-100 mt-10">升级进度</view>
												<view :class="`requirement_${item.id}`">
													<view class="flex-start mt-2">
														<view class="w-97">
															<u-line-progress :percentage="getPercent(item)" :showText="false" inactiveColor="#D8D8D8" :height="2"></u-line-progress>
														</view>
														<text class="fw-7 fs-12 ml-7">{{ item.count }}/{{ item.num }}</text>
													</view>
													<image src="/static/vip/partner/pop-arrow.webp" class="w-8 h-5 block ml-109 mt-3"></image>
													<view class="flex-start">
														<view class="fs-10 flex-start ptb-5 plr-7 rounded-x num relative" style="background: rgba(255, 255, 255, 0.5);">
															<image src="/static/vip/partner/ring.webp" class="i-14"></image>
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
					</view>
					<view class="flex-between plr-20">
						<text class="fs-16">可享14特权</text>
						<view class="flex-end lh-10" @click="$c.goto('/pages/index/protocols?type=5')">
							<text class="fs-12" style="color: #051835;">查看《合伙人计划》</text>
							<image src="/static/vip/right.webp" class="i-14"></image>
						</view>
					</view>
					<view class="mt-20 pl-20">
						<scroll-view ref="scrollView" scroll-x class="scroll-view_H" scroll-with-animation>
						    <image :src="`/static/vip/privilege/${partner_index}.webp`" style="width: 1095px;" class="h-55 inline-block mr-20"></image>
						</scroll-view>
					</view>
				</view>
			</view>
			<view v-if="(profile.level.id == 3 && switcher == 4) || profile.level.id < 3" class="mt-12 roundedTop-20 form_box text-center">
				<view class="">尊享权益</view>
				<image src="/static/vip/form.webp" class="pw-100 mt-30 mb-17" mode="widthFix"></image>
			</view>
			<view v-if="load" class="fs-10 text-center ptb-30">
				<text class="text-info">详细权益、佣金比例等请查看</text>
				<text class="text-base" @click="$c.goto('/pages/index/userService')">《会员服务介绍》</text>
			</view>
		</view>
		
		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">需支付</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ price }}</text>
				</view>
				<view class="mt-28 fw-7 text-left">请输入交易密码</view>
				<view class="mt-20">
					<u-code-input 
						v-model="password" 
						:maxlength="6" 
						:focus="true"
						:color="$c.baseColor()"
						borderColor="#EAEAEA"
						dot 
						@finish="doPay"></u-code-input>
				</view>
			</view>
		</u-popup>
		
		<!-- 密码 -->
		<u-popup :show="showHint" mode="center" round="20" :closeOnClickOverlay="false" @close="showHint = false">
			<view class="w-308 plr-30 ptb-25 text-center border-box">
				<view class="fs-18">温馨提示</view>
				<view v-if="switcher == 3" class="mt-34 lh-17 fs-14">
					“销售数据”将体现您整个销售团队的所有数据情况，包含同级别以下用户数据。
				</view>
				<view v-if="switcher == 4" class="mt-34 lh-17 fs-14">
					<!-- 同级别团队绩效数据不纳入绩效统计范围。绩效分红每月1日自动重置，每月完成绩效考核可获得不同程度的绩效分红奖励。 -->
					“团队绩效”同合伙人级别用户团队业绩将不纳入“团队绩效”统计范围。每月完成“团队绩效”考核可获得对应“绩效分红”。“绩效分红”每月1日自动重置，不做累计计算。
				</view>
				<u-button class="bg-base text-white w-234 h-51 fs-16 fw-7 mt-68" shape="circle" @click="showHint = false">知道了</u-button>
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
				agreed: [],
				load: false,
				password: '',
				performance: { load: false },
				year: new Date().getFullYear(),
				today: new Date().toISOString().slice(0, 10),
				showPassword: false,
				password: '',
				doPay: null,
				price: 0,
				month_sales: 0,
				month_bonus: 0,
				level3: {},
				level4: {},
				num1: 0,
				num2: 0,
				showHint: false,
				sell: {},
				now: this.$c.formatDateTime(),
				partner_index: 1,
				partner_list: [
					{ id: 1, name: '铜牌', num: 5, count: 0, require: '团队内累计 ≥5 名合伙人升级为铜牌合伙人' },
					{ id: 2, name: '银牌', num: 5, count: 0, require: '团队内累计 ≥5 名铜牌合伙人升级为银牌合伙人' },
					{ id: 3, name: '金牌', num: 20, count: 0, require: '团队内累计 ≥20 名银牌合伙人升级为金牌合伙人' }
				],
				scrollOffset: 50
			}
		},
		async onLoad() {
			this.profile = await this.$c.checkeLogin(1)
			if(this.profile.team_partners_count) this.partner_list[0].count = this.profile.team_partners_count
			if(this.profile.team_bronze_count) this.partner_list[1].count = this.profile.team_bronze_count
			if(this.profile.team_silver_count) this.partner_list[2].count = this.profile.team_silver_count
			this.levelList()
			if(this.profile.level.id >= 3) {
				this.getSellData()
				this.getPerformce()
			}
			this.doPay = this.$c.onceRequest(this.onPay)
		},
		methods: {
			getPercent(item) {
			    const count = Number(item?.count) || 0
			    const num = Number(item?.num) || 0
			    if (num <= 0) return 0
			    return Math.floor((count * 100) / num)
			},
			onParnterChange(e) {
				this.partner_index = e.detail.current + 1
			},
			async getSellData() {
				const res = await this.$c.fetch(this.$api.user.mySellInfo)
				if(res) {
					this.sell = res
					this.now = this.$c.formatDateTime()
				}
			},
			async levelList() {
				const res = await this.$c.fetch(this.$api.config.levelList)
				if(res) { 
					this.list = res; 
					this.price = res[2].price;
					this.load = true
					if(this.profile.level.id < 3) {
						const level3 = res.find(i => i.id == 1)
						if(level3) {
							this.level3 = level3
							this.num1 = level3.upgrade_count - this.profile.direct
						}
						const level4 = res.find(i => i.id == 3)
						if(level4) {
							this.level4 = level4
							this.num2 = level4.upgrade_count - this.profile.direct_vip
						}
					}
 				}
			},
			async getPerformce() {
				const res = await this.$c.fetch(this.$api.finance.performance, { year: this.year })
				if(res) { 
					this.performance = { ...res, ...{ load: true } }
					if(res.month && Array.isArray(res.month) && res.month.length) {
						this.month_bonus =  res.month.reduce((sum, item) => sum + (item.bonus || 0), 0)
						this.month_sales = res.month.reduce((sum, item) => sum + (item.sales || 0), 0)
					}
				}
			},
			onSwitch(e) {
				if(this.switcher != e) {
					this.agreed = []
					this.switcher = e
				}
			},
			async onPay() {
				this.showPassword = false
				if(this.agreed.indexOf('agreed') == -1) {
					this.$c.toast('开通前阅读并同意《VIP服务介绍》')
					return
				}
				const res = await this.$c.fetch(this.$api.user.upgradeVip, { password: this.password })
				if(res) {
					this.$c.toast('您已成为尊贵的' + this.list[2].name + '会员')
					this.getProfile()
				}
			},
			onShowPassword() {
				if(this.agreed.indexOf('agreed') == -1) {
					this.$c.toast('开通前阅读并同意《VIP服务介绍》')
					return
				}
				this.password = ''
				this.showPassword = true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		background-image: url('/static/vip/bg.png');
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
	.open_3 {
		background: #F1D6AE;
		border: 1px solid #F5B879;
		padding: 6px 11px;
		border-radius: 99px 99px 99px 0;
		position: absolute;
		left: 0;
		top: -10px;
		color: #8A6539;
		font-size: 10px;
	}
	.btn_3 {
		width: 271px;
		height: 48px;
		background: #2A1601 !important;
		font-weight: 500;
		font-size: 14px;
		line-height: 14px;
		color: #E7D0BF;
	}
	.form_box {
		background: linear-gradient(180deg, #FFF2E5 0%, #FFFFFF 12%);
		padding: 34px 20px;
	}
	.open_4 {
		background: #3C3C5A;
		border: 1px solid #C6DDED;
		padding: 6px 11px;
		border-radius: 99px 99px 99px 0;
		position: absolute;
		left: 0;
		top: -10px;
		color: #FFFFFF;
		font-size: 10px;
	}
	.btn_4 {
		width: 271px;
		height: 48px;
		background: #191931 !important;
		font-weight: 500;
		font-size: 14px;
		line-height: 14px;
		color: #E7D0BF;
	}
	.price_3 {
		color: #7B351B;
	}
	.price_4 {
		color: #191931;
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
	.step_box {
		background: linear-gradient(270deg, #F9E6CD 0%, #FEF7EA 100%);
		height: 66px;
		border-radius: 10px;
		margin-bottom: 5px;
		padding: 0 11px;
		
		.text-info {
			color: #968970;
			margin-top: 5px;
			font-size: 12px;
		}
		.btn {
			width: 87px;
			height: 35px;
		}
		.text-0 {
			color: #E7D0BF;
		}
		.text-1 {
			color: #696969;
		}
		.bg-0 {
			background-color: #2A1601 !important;
		}
		.bg-1 {
			background-color: #B6B6B6 !important;
		}
		.line-1 {
			position: absolute;
			left: 0;
			top: -18px;
			width: 37px;
			height: 0px;
			transform: rotate(90deg);
			border-top: 1.5px dashed #CAA154;
		}
		.line-2 {
			position: absolute;
			left: 0;
			top: -18px;
			width: 37px;
			height: 0px;
			transform: rotate(90deg);
			border-top: 1.5px dashed #77788F;
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
	}
	.partner_box {
		background: linear-gradient(180deg, #424460 3%, #C4CFEA 28%, #DEEAFF 43%, #FFFFFF 100%);
		border-radius: 20px;
		
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
			color: #905847;
			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #8F5746 0%, #B48E77 100%) !important;
			}
		}
		.requirement_2 {
			color: #707F8F;
			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #6D7D8C 0%, #9BA5B6 99%);
			}
		}
		.requirement_3 {
			color: #B56A1F;
			::v-deep .u-line-progress__line {
				background: linear-gradient(270deg, #B5691E 0%, #C78535 99%);
			}
		}
	}
</style>