<template>
	<view class="page bg-page">
		<view class="bg">
			<Title title="会员" bgColor="transparent" />
			<view class="plr-20">
				<view class="flex-between">
					<u-avatar :src="profile.avatar" size="55" :default-url="$c.userAvatar()"></u-avatar>
					<view class="ml-10 flex-1">
						<view class="u-line-1">{{ profile.account }}</view>
						<view class="fw-7">{{ profile.level.value }}</view>
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
							<u-button v-else class="btn bg-1 text-1" text="已完成"></u-button>
						</view>
						<view class="step_box flex-between">
							<view class="i-35 relative">
								<image src="/static/vip/step-2.webp" class="i-35"></image>
								<view class="line-1"></view>
							</view>
							<view class="mlr-9 flex-1">
								<view class="">升级为VIP</view>
								<view class="text-info">邀请3位好友成为推广员</view>
							</view>
							<u-button v-if="profile.level.id < 3" class="btn bg-0 text-0" shape="circle" text="去完成" @click="$c.goto('/pages/user/qrcode')"></u-button>
							<u-button v-else class="btn bg-1 text-1" text="已完成"></u-button>
						</view>
						<view v-if="switcher == 4" class="step_box flex-between step_3">
							<view class="i-35 relative">
								<image src="/static/vip/step-3.webp" class="i-35"></image>
								<view class="line-2"></view>
								<image src="/static/vip/good-1.webp" class="w-109 h-31 absolute bottom-30 left-20"></image>
							</view>
							<view class="mlr-9 flex-1">
								<view class="">升级为合伙人</view>
								<view class="text-info">邀请5位好友成为VIP会员</view>
							</view>
							<u-button v-if="profile.direct_vip < 5" class="btn bg-0 text-0" shape="circle" text="去完成" @click="$c.goto('/pages/user/qrcode')"></u-button>
							<u-button v-else class="btn bg-1 text-1" text="已完成"></u-button>
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
							<image :src="`/static/vip/right_${switcher}.png`" class="w-312 h-223"></image>
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
								/>
							</view>
							<view v-if="switcher == 4" class="absolute right-0 pw-55" style="top: -8%;">
								<PlayImg
									path="user/vip/tag_4/2"
									:interval="50"
									:length="40"
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
	import PlayImg from '../../components/PlayImgs.vue';
	
	export default {
		components: {
			Title,
			PlayImg
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
</style>