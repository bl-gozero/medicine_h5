<template>
	<view class="page plr-20 pt-20" style="background: #F5F6ED;">
		<view class="fs-24">加入北辰</view>
		<view class="fs-36 fw-7 mt-10 mb-20">成为全球合伙人</view>
		<text class="plr-11 ptb-8 rounded-x border-box" style="border: 1px solid #696969;background: #FFFFEB;">活动多多  名额有限  快快加入</text>
		<view 
			class="mt-35 bg-white border-box rounded-26 ptb-26 plr-11" 
			style="box-shadow: 0px 0px 10px 0px rgba(88, 88, 88, 0.13);"
		>
			<view class="flex-between input_box">
				<image src="/static/icon/user.png" class="i-18"></image>
				<LineInput
					class="flex-1 ml-7"
					v-model="form.account"
					placeholder="请输入账号"
					placeholderClass="text-info fs-14 fw-5"
				/>
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/password.png" class="i-18"></image>
				<LineInput
					class="flex-1 ml-7"
					v-model="form.password"
					type="password"
					placeholder="请输入密码(6-20位)"
					placeholderClass="text-info fs-14 fw-5"
					:maxlength="20"
				/>
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/code.png" class="i-18"></image>
				<LineInput
					class="flex-1 ml-7"
					v-model="form.captcha_code"
					placeholder="请输入验证码"
					placeholderClass="text-info fs-14 fw-5"
					:maxlength="6"
				>
					<template #suffix>
					    <image v-if="!showCodeBtn && captcha" :src="captcha" class="h-29 ml-10" mode="heightFix" @click="getCode()"></image>
					    <u-button
					    	v-if="showCodeBtn"
					    	class="bg-base-change fw-7 fs-12 text-white plr-20 h-40"
					    	shape="circle"
					    	text="点击获取"
					    	@click="getCode()"
					    ></u-button>
					</template>
				</LineInput>
			</view>
			<view class="flex-between input_box mt-14">
				<image src="/static/icon/invite.png" class="i-18"></image>
				<LineInput
					class="flex-1 ml-7"
					v-model="form.referral_code"
					placeholder="通过扫码进入将自动识别推荐人邀请码"
					placeholderClass="text-info fs-14 fw-5"
					:disabled="true"
					disabledColor="transparent"
				/>
			</view>
		</view>
		<view class="mt-23 flex-center">
			<u-checkbox-group v-model="agreed">
				<u-checkbox name="agreed" size="16" activeColor="#1A7E84" inactiveColor="#1A7E84" />
			</u-checkbox-group>
			<text class="fs-10">
			    <text>阅读并同意</text>
			    <text class="text-base" @click="$c.goto('/pages/index/userAgreement')">《APP用户协议》</text>
			</text>
		</view>
		<u-button
			class="bg-base-change fw-7 text-white w-278 h-49 mt-20"
			shape="circle"
			text="注册"
			@click="onSubmit()"
		></u-button>
		<view class="mt-50 download_box flex-between">
			<image src="/static/common/logo_white.png" class="logo"></image>
			<view class="flex-1 ml-4">
				<view class="fw-7" style="color: #E77F1E;">APP下载</view>
				<view class="fs-10 mt-3">成为北辰代购全球合伙人共享福利</view>
			</view>
			<u-button
				class="bg-base-change fw-7 text-white w-77 h-36"
				shape="circle"
				text="去下载"
				@click="$c.goto('/pages/web/download')"
			></u-button>
		</view>
		<view class="h-30"></view>
	</view>
</template>

<script>
	import LineInput from '@/components/LineInput.vue'
	
	export default {
		components: { LineInput },
		data() {
			return {
				form: { account: '', password: '', captcha_id: '', captcha_code: '', referral_code: '' },
				agreed: [],
				captcha: '',
				showCodeBtn: false,
				doSubmit: null
			}
		},
		onLoad(p) {
			this.$c.removeStorage('jwt')
			this.$c.removeStorage('profile')
			if(p.invite) this.form.referral_code = p.invite
			this.getCode()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async getCode() {
				const res = await this.$c.fetch(this.$api.config.captcha)
				if(res) {
					this.showCodeBtn = false
					this.form.captcha_id = res.id
					this.captcha = res.base64_image
				} else {
					this.showCodeBtn = true
				}
			},
			async onSubmit() {
				if(!this.form.account) {
					this.$c.toast('请输入账号')
					return
				}
				if(!this.form.password) {
					this.$c.toast('请输入密码')
					return
				}
				if(!this.form.captcha_code) {
					this.$c.toast('请输入验证码')
					return
				}
				if(!this.form.referral_code) {
					this.$c.toast('请输入推荐人邀请码')
					return
				}
				if(this.agreed.indexOf('agreed') == -1) {
					this.$c.toast('阅读并同意《APP用户协议》')
					return
				}
				const res = await this.$c.fetch(this.$api.user.register, this.form)
				if(res) {
					this.$c.toast('注册成功')
					this.$c.setStorage('jwt', res.jwt)
					this.getProfile()
				} else {
					this.getCode()
				}
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.$c.setStorage('profile', res)
					this.$c.goto('/pages/web/download')
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
</style>