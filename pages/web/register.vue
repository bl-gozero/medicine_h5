<template>
	<view class="page plr-20 bg">
		<Title isBlank></Title>
		<view class="fs-24">加入北辰</view>
		<view class="fs-36 fw-7 mt-10 mb-20">成为全球合伙人</view>
		<view class="flex-start">
			<view class="plr-11 ptb-8 rounded-x border-box" style="border: 1px solid #696969;background: #FFFFEB;">活动多多 名额有限 快快加入</view>
		</view>
		<view class="mt-35 bg-white border-box rounded-26 ptb-26 plr-11"
			style="box-shadow: 0px 0px 10px 0px rgba(88, 88, 88, 0.13);">
			<view class="flex-between input_box">
				<image src="/static/icon/user.png" class="i-18"></image>
				<LineInput class="flex-1 ml-7" v-model="form.account" placeholder="请输入手机号"
					placeholderClass="text-info fs-14 fw-5" />
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/password.png" class="i-18"></image>
				<LineInput class="flex-1 ml-7" v-model="form.password" type="password" placeholder="请输入密码(6-20位)"
					placeholderClass="text-info fs-14 fw-5" :maxlength="20" />
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/password.png" class="i-18"></image>
				<LineInput class="flex-1 ml-7" v-model="form.re_password" type="password" placeholder="确认密码"
					placeholderClass="text-info fs-14 fw-5" :maxlength="20" />
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/code.png" class="i-18"></image>
				<LineInput class="flex-1 ml-7" v-model="form.captcha_code" placeholder="请输入图形验证码"
					placeholderClass="text-info fs-14 fw-5">
					<template #suffix>
						<image v-if="!showCodeBtn1 && captcha" :src="captcha" class="h-29 ml-10" mode="heightFix"
							@click="getCode()"></image>
						<button v-if="showCodeBtn1"
							class="bg-base-change fw-7 fs-12 text-white plr-20 h-40 flex-center rounded-x"
							@click="getCode()">点击获取</button>
					</template>
				</LineInput>
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/code.png" class="i-18"></image>
				<LineInput class="flex-1 ml-7" v-model="form.captcha" placeholder="请输入短信验证码"
					placeholderClass="text-info fs-14 fw-5">
					<template #suffix>
						<button v-if="showCodeBtn"
							class="bg-base-change fw-7 text-white w-95 h-30 fs-14 flex-center rounded-x"
							@click="getMobileCode()">发送</button>
						<div v-else class="text-info flex-start h-30">
							<u-count-down ref="countDown" :time="$c.codeLimitTime()" format="ss"
								@finish="showCodeBtn = true"></u-count-down>
							<text>s</text>
						</div>
					</template>
				</LineInput>
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/invite.png" class="i-18"></image>
				<LineInput class="flex-1 ml-7" v-model="form.referral_code" placeholder="通过扫码进入将自动识别推荐人邀请码"
					placeholderClass="text-info fs-14 fw-5" :disabled="true" disabledColor="transparent" />
			</view>
		</view>
		<view class="mt-23 flex-center">
			<u-checkbox-group v-model="agreed">
				<u-checkbox name="agreed" size="16" :activeColor="$c.baseColor()" :inactiveColor="$c.baseColor()" />
			</u-checkbox-group>
			<text class="fs-10">
				<text>阅读并同意</text>
				<text class="text-base" @click="$c.goto('/pages/index/userAgreement')">《APP用户协议》</text>
			</text>
		</view>
		<button class="bg-base-change fw-7 text-white w-278 h-49 mt-20 fs-14 flex-center rounded-x"
			@click="onSubmit()">注册</button>
		<view class="mt-50 download_box flex-between">
			<image src="/static/common/logo_mall.webp" class="logo"></image>
			<view class="flex-1 ml-4">
				<view class="fw-7" style="color: #E77F1E;">APP下载</view>
				<view class="fs-10 mt-3">成为北辰代购全球合伙人共享福利</view>
			</view>
			<button class="bg-base-change fw-7 text-white w-77 h-36 fs-14 flex-center rounded-x"
				@click="$c.goto('/pages/web/download')">去下载</button>
		</view>
		<view class="h-30"></view>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	import LineInput from '@/components/LineInput.vue'
	import {
		initNIM,
		loginNIM
	} from '@/utils/nim.js'

	export default {
		components: {
			LineInput,
			Title
		},
		data() {
			return {
				form: {
					account: '',
					password: '',
					captcha: '',
					referral_code: '',
					re_password: '',
					captcha_id: null,
					captcha_code: ''
				},
				agreed: [],
				captcha: '',
				showCodeBtn: true,
				showCodeBtn1: true,
				doSubmit: null
			}
		},
		onLoad(p) {
			this.$c.removeStorage('jwt')
			this.$c.removeStorage('profile')
			if (p.invite) this.form.referral_code = p.invite
			this.getCode()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async getCode() {
				const res = await this.$c.fetch(this.$api.config.captcha)
				if (res) {
					this.showCodeBtn1 = false
					this.form.captcha_id = res.id
					this.captcha = res.base64_image
				} else {
					this.showCodeBtn1 = true
				}
			},
			async getMobileCode() {
				if (!this.form.account) {
					this.$c.toast('请输入手机号')
					return
				}
				const res = await this.$c.fetch(this.$api.config.mobile_captcha, {
					phone: this.form.account,
					mode: 'register'
				})
				if (res) {
					// this.showCodeBtn = false
					// this.$refs.countDown.reset();
					// this.$refs.countDown.start();
					this.$c.toast('发送成功')
					if (res.captcha) this.form.captcha = res.captcha
				}
			},
			async onSubmit() {
				if (!this.form.account) {
					this.$c.toast('请输入手机号')
					return
				}
				if (!this.form.password) {
					this.$c.toast('请输入密码')
					return
				}
				if (!this.form.re_password) {
					this.$c.toast('请输入确认密码')
					return
				}
				if (this.form.re_password != this.form.password) {
					this.$c.toast('两次密码不一致')
					return
				}
				if (!this.form.captcha_code) {
					this.$c.toast('请输入图形验证码')
					return
				}
				if (!this.form.captcha) {
					this.$c.toast('请输入短信验证码')
					return
				}
				if (!this.form.referral_code) {
					this.$c.toast('请输入推荐人邀请码')
					return
				}
				if (this.agreed.indexOf('agreed') == -1) {
					this.$c.toast('阅读并同意《APP用户协议》')
					return
				}
				const res = await this.$c.fetch(this.$api.user.register, this.form)
				if (res) {
					this.$c.toast('注册成功')
					this.$c.setStorage('jwt', res.jwt)
					this.$c.setStorage('index_pop', false)
					// this.$c.goto('/pages/user/payPassword?type=1')
					// this.getProfile()
					this.intIm()
				} else {
					this.getCode()
				}
			},
			async intIm() {
				this.$c.removeStorage('chatInfo')
				let nimInfo = this.$c.getStorage('nimInfo') || {}
				if (!nimInfo.appkey) {
					const res1 = await this.$c.fetch(this.$api.group.config)
					if (res1?.app_key) nimInfo.appkey = res1.app_key
				}
				const res2 = await this.$c.fetch(this.$api.group.login)
				if (res2?.account_id) {
					this.$c.setStorage('nimInfo', {
						...nimInfo,
						account: res2.account_id,
						token: res2.token,
					})
					await initNIM(true, res2.p_account_id)
				}
				this.getProfile()
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if (res) {
					this.$c.setStorage('profile', res)
					this.$c.saveAccount(res)
					this.$c.goto('/pages/user/payPassword?type=1')
				}
			}
		}
	}
</script>

<style>
	.input_box {
		background: #F6F6F6;
		border-radius: 8px;
		padding: 12px 9px;
	}

	.underline-box {
		padding: 0;
	}

	.download_box {
		box-sizing: border-box;
		background: linear-gradient(180deg, #F1F4E9 0%, #FCEBD4 100%);
		border: 1px solid #EAECE1;
		padding: 13px 10px;
		border-radius: 20px;
	}

	.logo {
		width: 46.77px;
		height: 47.52px;
	}
	
	.bg {
		background-color: #FCF3EB;
		background-image: url('/static/web/register.webp');
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
</style>