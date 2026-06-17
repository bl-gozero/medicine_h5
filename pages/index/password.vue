<template>
	<view class="page bg-page">
		<Title title="忘记密码" />
		<view class="mt-20 plr-20">
			<view class="title mt-40">手机号</view>
			<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
				<LineInput v-model="form.account" placeholder="请输入手机号"
					placeholderClass="text-info fs-14 fw-7" :maxlength="11" />
			</view>
			
			<view class="mt-20 title">验证码</view>
			<view class="mt-7 bg-white rounded-8 plr-16 code">
				<LineInput v-model="form.captcha" placeholder="请输入验证码" placeholderClass="text-info fs-14 fw-7">
					<template #suffix>
						<button v-if="showCodeBtn"
							class="bg-base-change fw-7 fs-14 text-white plr-20 w-82 h-35 flex-center rounded-x"
							@click="getMobileCode()">发送</button>
						<div v-else class="text-info flex-start h-40">
							<u-count-down ref="countDown" :time="$c.codeLimitTime()" format="ss"
								@finish="showCodeBtn = true"></u-count-down>
							<text>s</text>
						</div>
					</template>
				</LineInput>
			</view>

			<view class="title mt-40">新密码</view>
			<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
				<LineInput v-model="form.password" type="password" placeholder="请输入新密码(6-20位)"
					placeholderClass="text-info fs-14 fw-7" :maxlength="20" />
			</view>

			<view class="title mt-40">确认新密码</view>
			<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
				<LineInput v-model="form.confirm_password" type="password" placeholder="请再次填写确认"
					placeholderClass="text-info fs-14 fw-7" :maxlength="20" />
			</view>
			<view class=" mt-47">
				<button class="bg-base-change fw-7 fs-14 text-white w-247 h-47 flex-center rounded-x"
					@click="doSubmit">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	import LineInput from '@/components/LineInput.vue'

	export default {
		components: {
			Title,
			LineInput
		},
		data() {
			return {
				form: {
					account: '',
					captcha: '',
					password: '',
					confirm_password: ''
				},
				showCodeBtn: true,
				doSubmit: null
			}
		},
		onLoad() {
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async getMobileCode() {
				if (!this.form.account) {
					this.$c.toast('请输入手机号')
					return
				}
				const res = await this.$c.fetch(this.$api.config.mobile_captcha, {
					phone: this.form.account,
					mode: 'reset'
				})
				if (res) {
					this.showCodeBtn = false
					// this.form.captcha_id = res.id
					// this.captcha = res.base64_image
					if (res.captcha) this.form.captcha = res.captcha
					this.$refs.countDown.reset();
					this.$refs.countDown.start();
				}
			},
			async onSubmit() {
				if (!this.form.account) {
					this.$c.toast('请输入手机号')
					return
				}
				if (!this.form.captcha) {
					this.$c.toast('请输入验证码')
					return
				}
				if (!this.form.password) {
					this.$c.toast('请输入新密码')
					return
				}
				if (!this.form.confirm_password) {
					this.$c.toast('请再次填写确认')
					return
				}
				if (this.form.password != this.form.confirm_password) {
					this.$c.toast('两次密码不一致')
					return
				}
				const res = await this.$c.fetch(this.$api.user.resetPassword, this.form)
				console.log(res)
				if (res) {
					this.$c.toast('修改成功')
					setTimeout(() => {
						this.$c.goBack()
					}, 1000)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.title {
		color: #9F9F9F;
	}
	.code > .underline-box {
		padding: 5px 0 5px !important;
	}
</style>