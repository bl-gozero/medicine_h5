<template>
	<view class="page flex-col login-bg">
		<view class="border-box pt-48 pl-38 pb-20">
			<view class="fw-3" style="color: #75A3A5;">Welcome</view>
			<view class="fs-40 fw-9" style="color: #2E4E50;">登录</view>
		</view>
		<view class="relative flex-1 bg-white roundedTop-40 fs-12 fw-5">
			<view class="full sroller-y pt-60 plr-35">
				<view class="flex-start">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/user.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>账号</view>
						<LineInput 
							v-model="form.account"
							placeholder="请输入账号"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
						/>
					</view>
				</view>
				<view class="flex-start mt-52">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/password.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>密码</view>
						<LineInput
							v-model="form.password"
							type="password"
							placeholder="请输入密码"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
							:maxlength="20"
						/>
					</view>
				</view>
				<view class="flex-start mt-52">
					<view class="i-18 mr-7 self-start">
						<image src="/static/icon/code.png" class="i-18"></image>
					</view>
					<view class="flex-1">
						<view>验证码</view>
						<LineInput 
							v-model="form.captcha_code"
							placeholder="请输入验证码"
							placeholderClass="text-info fs-14 fw-5"
							:showLine="true"
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
				</view>
				<view class="mt-47 flex-center">
					<!-- <u-checkbox v-model="agreed" label="我已阅读并同意《用户协议》" /> -->				
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
						text="登录"
						@click="onSubmit()"
					></u-button>
				</view>
				<view class="text-center mt-23">
					<text class="text-base fw-4" @click="$c.goto('/pages/index/register')">没有账号？去注册</text>
				</view>
				<view class="h-50"></view>
			</view>
		</view>
	</view>
</template>

<script>
	import LineInput from '@/components/LineInput.vue'
	
	export default {
		components: { LineInput },
		data() {
			return {
				form: { account: '', password: '', captcha_id: '', captcha_code: '' },
				agreed: [],
				captcha: '',
				showCodeBtn: false,
				doSubmit: null
			}
		},
		onLoad() {
			this.$c.removeStorage('jwt')
			this.$c.removeStorage('profile')
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
				if(this.agreed.indexOf('agreed') == -1) {
					this.$c.toast('阅读并同意《APP用户协议》')
					return
				}
				const res = await this.$c.fetch(this.$api.user.login, this.form)
				if(res) {
					this.$c.toast('登录成功')
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
					this.$c.goto('/pages/user/index')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-bg {
		background-image: url('/static/login/bg.png');
		background-color: linear-gradient(270deg, #92CBCE 4%, #DBEBEB 98%);
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
</style>