<template>
	<view class="page flex-col login-bg">
		<view class="border-box pt-48 pl-38 pb-20">
			<view class="fw-3" style="color: #75A3A5;">Welcome</view>
			<view class="fs-40 fw-9" style="color: #2E4E50;">注册</view>
		</view>
		<view class="relative flex-1 bg-white roundedTop-40 fs-12 fw-5">
			<view class="full sroller-y pt-40 plr-35">
				<view class="flex-start">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/user.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>账号</view>
						<LineInput 
							v-model="form.account"
							placeholder="请输入手机号"
							type="number"
							:maxlength="11"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
						/>
					</view>
				</view>
				<view class="flex-start mt-30">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/password.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>密码</view>
						<LineInput
							v-model="form.password"
							type="password"
							placeholder="请输入密码(6-20位)"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
							:maxlength="20"
						/>
					</view>
				</view>
				<view class="flex-start mt-30">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/password.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>再次确认密码</view>
						<LineInput
							v-model="form.re_password"
							type="password"
							placeholder="请再次输入密码(6-20位)"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
							:maxlength="20"
						/>
					</view>
				</view>
				<view class="flex-start mt-30">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/code.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>验证码</view>
						<LineInput 
							v-model="form.captcha"
							placeholder="请输入验证码"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
							:maxlength="6"
						>
							<template #suffix>
							    <!-- <image v-if="!showCodeBtn && captcha" :src="captcha" class="h-29 ml-10" mode="heightFix" @click="getCode()"></image> -->
							    <u-button
							    	v-if="showCodeBtn"
							    	class="bg-base-change fw-7 fs-12 text-white w-107 h-40"
							    	shape="circle"
							    	text="发送"
							    	@click="getMobileCode()"
							    ></u-button>
								<div v-else class="text-info flex-start h-40">
									<u-count-down 
										ref="countDown" 
										:time="$c.codeLimitTime()" 
										format="ss"
										@finish="showCodeBtn = true"
									></u-count-down>
									<text>s</text>
								</div>
							</template>
						</LineInput>
					</view>
				</view>
				<view class="flex-start mt-30">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/invite.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>推荐人</view>
						<LineInput 
							v-model="form.referral_code"
							placeholder="请输入推荐人邀请码"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
						/>
					</view>
				</view>
				<view class="mt-47 flex-center">		
					<u-checkbox-group v-model="agreed">
						<u-checkbox name="agreed" size="16" activeColor="#1A7E84" inactiveColor="#1A7E84" />
					</u-checkbox-group>
					<text class="fs-10">
					    <text>阅读并同意</text>
					    <text class="text-base" @click="$c.goto('/pages/index/userAgreement')">《APP用户协议》</text>
					</text>
				</view>
				<view class="mt-14 text-center">
					<u-button 
						class="bg-base-change fw-7 fs-14 text-white w-278 h-49"
						shape="circle"
						text="注册"
						@click="onSubmit()"
					></u-button>
				</view>
				<view class="text-center mt-23">
					<text class="text-base fw-4" @click="$c.goto('/pages/index/login')">已有账号？去登录</text>
				</view>
				<view class="h-50"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import LineInput from '@/components/LineInput.vue'
	import { initNIM, loginNIM } from '@/utils/nim.js'
	
	export default {
		components: { LineInput },
		data() {
			return {
				form: { account: '', password: '', captcha: '', referral_code: '', re_password: '' },
				agreed: [],
				captcha: '',
				showCodeBtn: true,
				doSubmit: null,
			}
		},
		onLoad() {
			this.$c.removeStorage('jwt')
			this.$c.removeStorage('profile')
			// this.getCode()
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
			async getMobileCode() {
				if(!this.form.account) {
					this.$c.toast('请输入手机号')
					return
				} 
				const res = await this.$c.fetch(this.$api.config.mobile_captcha, {
					phone: this.form.account,
					mode: 'register'
				})
				if(res) {
					// this.showCodeBtn = false
					// this.form.captcha_id = res.id
					// this.captcha = res.base64_image
					// this.$refs.countDown.reset();
					// this.$refs.countDown.start();
					this.$c.toast('发送成功')
					if(res.captcha) this.form.captcha = res.captcha
				}
			},
			async onSubmit() {
				if(!this.form.account) {
					this.$c.toast('请输入手机号')
					return
				}
				if(!this.form.password) {
					this.$c.toast('请输入密码')
					return
				}
				if(!this.form.re_password) {
					this.$c.toast('请输入确认密码')
					return
				}
				if(this.form.re_password != this.form.password) {
					this.$c.toast('两次密码不一致')
					return
				}
				if(!this.form.captcha) {
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
					this.$c.setStorage('jwt', res.jwt)
					this.$c.setStorage('index_pop', false)
					await this.$c.toast('注册成功')
					this.intIm()
					// this.getProfile()
				}
			},
			async intIm() {
				this.$c.removeStorage('chatInfo')
				let nimInfo = this.$c.getStorage('nimInfo') || {}
				if(!nimInfo.appkey) {
					const res1 = await this.$c.fetch(this.$api.group.config)
					if(res1) nimInfo.appkey = res1.app_key
				}
				const res2 = await this.$c.fetch(this.$api.group.login)
				if(res2) {
					this.$c.setStorage('nimInfo', { ...nimInfo,
						account: res2.account_id,
						token: res2.token,
					})
					initNIM()
				}
				this.getProfile()
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.$c.setStorage('profile', res)
					this.$c.goto('/pages/user/payPassword?type=1')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-bg {
		background-image: url('/static/login/bg.png'), linear-gradient(270deg, #92CBCE 4%, #DBEBEB 98%);
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
</style>