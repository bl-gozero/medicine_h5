<template>
	<view class="page bg-page">
		<view class="bg">
			<Title title="会员" bgColor="transparent" />
			<view class="plr-20">
				<view class="flex-between">
					<u-avatar :src="profile.avatar" size="55" default-url="/static/user/avatar.png"></u-avatar>
					<view class="ml-10 flex-1">
						<view class="u-line-1">{{ profile.account }}</view>
						<view class="fw-7 mt-6">{{ profile.level.value }}</view>
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
			</view>
			<view v-if="load" class="">
				<view class="relative mt-24">
					<image :src="`/static/vip/switch_${switcher}.png`" class="pw-100 block" mode="widthFix"></image>
					<view class="full flex-between">
						<view class="pw-50 ph-100" @click="onSwitch(3)"></view>
						<view class="pw-50 ph-100" @click="onSwitch(4)"></view>
					</view>
				</view>
				<view  class="bg-white ptb-26" style="border-radius: 0 0 20px 20px;">
					<view v-if="profile.level.id < switcher" class="">
						<view class="flex-center">
							<view class="relative left-0 right-0 auto-x">
								<image :src="`/static/vip/open_${switcher}.png`" class="w-202 h-99"></image>
								<view :class="`open_${switcher}`">{{ switcher == 3? '开通即得' : '开通VIP并邀请' + list[switcher - 2].upgrade_count + '位好友成为' + list[switcher - 2].name }}</view>
								<view class="full flex-center">
									<view class="text-center" :class="`price_${switcher}`">
										<view class="fw-5 fs-16">{{ list[switcher - 1].name + (switcher == 3? '会员卡' : '') }}</view>
										<view class="fw-7 flex-center">
											<view class="">
												<text class="fs-12">￥</text>
												<text class="fs-26">{{ list[2].price }}</text>
											</view>
											<image v-if="switcher == 4" src="/static/vip/plus.png" class="i-8 mlr-20"></image>
											<image v-if="switcher == 4" src="/static/vip/invite.png" class="i-20"></image>
										</view>
									</view>
								</view>
								<image v-if="switcher == 4" src="/static/vip/good.png" class="w-85 h-56 absolute" style="top: -29px;right: -32px;"></image>
							</view>
						</view>
						<u-button v-if="switcher == 3" class="btn_3 mt-25" shape="circle" text="立即开通" @click="onShowPassword()"></u-button>
						<u-button 
							v-else-if="profile.level.id < 3 && list[switcher - 2].upgrade_count - profile.direct_vip > 0"
							class="btn_4 mt-25"
							shape="circle"
							:text="'开通' + list[switcher - 2].name + '，' + '需再邀请' + (list[switcher - 2].upgrade_count - profile.direct_vip) + '人'"
							@click="onShowPassword()"
						></u-button>
						<u-button
							v-else-if="profile.level.id == 3"
							class="btn_4 mt-25"
							shape="circle"
							:text="'需再邀请' + (list[switcher - 2].upgrade_count - profile.direct_vip) + '人'"
							@click="$c.goto('/pages/user/qrcode')"
						></u-button>
						<u-button
							v-else
							class="btn_4 mt-25"
							shape="circle"
							:text="'开通' + list[switcher - 2].name"
							@click="onShowPassword()"
						></u-button>
						<view v-if="profile.level.id < 3" class="mt-20 flex-center">			
							<u-checkbox-group v-model="agreed">
								<u-checkbox name="agreed" size="16" activeColor="#1A7E84" inactiveColor="#1A7E84" />
							</u-checkbox-group>
							<text class="fs-10">
								<text>开通前阅读并同意</text>
								<text v-if="switcher == 3" class="text-base" @click="$c.goto('/pages/index/protocols?type=2')">《VIP服务介绍》</text>
								<text v-if="switcher == 4" class="text-base" @click="$c.goto('/pages/index/protocols?type=3')">《合伙人服务介绍》</text>
							</text>
						</view>
						<view v-else class="mt-20 flex-center fs-10">
							<text>查看</text>
							<text v-if="switcher == 4" class="text-base" @click="$c.goto('/pages/index/protocols?type=3')">《合伙人服务介绍》</text>
						</view>
					</view>
					<view v-else class="flex-center">
						<view class="relative">
							<image :src="`/static/vip/right_${switcher}.png`" class="w-312 h-223"></image>
							<image 
								:src="`/static/vip/tag_${switcher}.png`" 
								class="absolute right-0"
								:class="switcher == 3? 'w-121 h-110' : 'w-131 h-102'"
								style="top: -21px;"
							></image>
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
			<view v-if="profile.level.id >= 4 && performance.load" class="mt-12 rounded-20 ptb-25 plr-20 relative" style="background: linear-gradient(180deg, #FFE6E6 0%, #FFFFFF 17%);">
				<view class="fs-16 fw-5 text-center">团队业绩</view>
				<view class="text-info text-center mt-13 fs-12">数据更新于{{ today }}</view>
				<view class="mt-10 mb-17">当月数据</view>
				<view class="flex-between">
					<view class="data_bg rounded-8 ptb-11 plr-13 pw-48 border-box">
						<image src="/static/vip/data_1.png" class="i-17"></image>
						<view class="text-info fs-10 mtb-5">销售业绩（元）</view>
						<view class="fs-16 fw-7 u-line-1">{{ performance.month && performance.month.lengtn > 0? performance.month[0].sales : 0 }}</view>
					</view>
					<view class="data_bg rounded-8 ptb-11 plr-13 pw-48 border-box">
						<image src="/static/vip/data_2.png" class="i-17"></image>
						<view class="text-info fs-10 mtb-5">绩效分红（元）</view>
						<view class="fs-16 fw-7 u-line-1">{{ performance.month && performance.month.lengtn > 0? performance.month[0].bonus : 0 }}</view>
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
			<view class="mt-12 roundedTop-20 form_box text-center">
				<view class="">尊享权益</view>
				<image src="/static/vip/form.png" class="pw-100 mt-30 mb-17" mode="widthFix"></image>
				<view class="fs-10">
					<text class="text-info">详细权益、佣金比例等请查看</text>
					<text class="text-base" @click="$c.goto('/pages/index/userService')">《会员服务介绍》</text>
				</view>
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
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	export default {
		components: {
			Title
		},
		data() {
			return {
				profile: this.$c.getStorage('profile') || {},
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
				price: 0
			}
		},
		onLoad() {
			this.getProfile()
			this.levelList()
			this.doPay = this.$c.onceRequest(this.onPay)
		},
		methods: {
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) { this.profile = res; if(res.level.id >= 3) this.getPerformce() }
			},
			async levelList() {
				const res = await this.$c.fetch(this.$api.config.levelList)
				if(res) { this.list = res; this.price = res[2].price; this.load = true }
			},
			async getPerformce() {
				const res = await this.$c.fetch(this.$api.finance.performance, { year: this.year })
				if(res) { this.performance = { ...res, ...{ load: true } } }
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

<style>
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
	}
</style>