<template>
	<view class="page bg-page">
		<Title title="忘记原交易密码" />
		<view class="mt-20 plr-20">
			<view class="title">当前账号</view>
			<view class="fw-7 fs-20 mt-5" style="color: #6C6C6C;">{{ profile.account }}</view>

			<view class="title mt-20">验证码</view>
			<view class="mt-7 bg-white rounded-x plr-16 code">
				<LineInput v-model="form.captcha" placeholder="请输入验证码" placeholderClass="text-info fs-14 fw-7">
					<template #suffix>
						<button v-if="showCodeBtn"
							class="bg-base-change fw-7 fs-12 text-white h-35 w-82 flex-center rounded-x"
							@click="getMobileCode()">发送</button>
						<div v-else class="text-info flex-start h-35">
							<u-count-down ref="countDown" :time="$c.codeLimitTime()" format="ss"
								@finish="showCodeBtn = true"></u-count-down>
							<text>s</text>
						</div>
					</template>
				</LineInput>
			</view>

			<view class="title mt-40">设置新交易密码</view>
			<view class="mt-8">
				<u-code-input v-model="form.password" :maxlength="6" :color="$c.baseColor()" borderColor="#ffffff"
					dot></u-code-input>
			</view>

			<!-- <view class="title mt-40">确认新密码</view>
			<view class="mt-7 bg-white rounded-x pb-7 plr-16">
				<LineInput v-model="form.confirm_password" type="password" placeholder="请再次填写确认"
					placeholderClass="text-info fs-14 fw-7" :maxlength="20" />
			</view> -->
			<view class=" mt-47">
				<button class="bg-base-change fw-7 fs-14 text-white w-247 h-47 flex-center rounded-x"
					@click="doSubmit">确认</button>
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
					password: '',
					// confirm_password: '',
					captcha: ''
				},
				profile: this.$c.profile(),
				showCodeBtn: true,
				doSubmit: null
			}
		},
		onLoad() {
			// this.$c.checkeLogin(0)
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async getMobileCode() {
				const res = await this.$c.fetch(this.$api.user.resetPayPasswordCaptcha, {
					mode: 'resetpayment'
				})
				if (res) {
					this.showCodeBtn = false
					if (res.captcha) this.form.captcha = res.captcha
					this.$refs.countDown.reset();
					this.$refs.countDown.start();
				}
			},
			async onSubmit() {
				if (!this.form.captcha) {
					this.$c.toast('请输入验证码')
					return
				}
				if (!this.form.password) {
					this.$c.toast('请输入新密码')
					return
				}
				const res = await this.$c.fetch(this.$api.user.resetPayPassword, this.form)
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

	.code {
		.underline-box {
			padding: 7px 0 7px;
		}
	}
	
	::v-deep .u-code-input__item {
		background: #fff !important;
	}
</style>