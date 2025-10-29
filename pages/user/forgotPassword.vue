<template>
	<view class="page bg-page">
		<Title title="忘记密码" />
		<view class="mt-20 plr-20">
			<view class="title">手机号</view>
			<view class="mt-7 bg-white rounded-x pb-7 plr-16">
				<LineInput
					v-model="form.account"
					type="password"
					placeholder="请输入手机号"
					placeholderClass="text-info fs-14 fw-7"
					:maxlength="20"
				/>
			</view>
			
			<view class="title mt-20">验证码</view>
			<view class="mt-7 bg-white rounded-x plr-16 code">
				<LineInput
					v-model="form.captcha_code"
					placeholder="请输入验证码"
					placeholderClass="text-info fs-14 fw-7"
					:maxlength="6"
				>
					<template #suffix>
						<u-button
							v-if="showCodeBtn"
							class="bg-base-change fw-7 fs-12 text-white h-35 w-82"
							shape="circle"
							text=""
							@click="getMobileCode()"
						>点击获取</u-button>
						<div v-else class="text-info flex-start h-35">
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
			
			<view class="title mt-40">设置新密码</view>
			<view class="mt-7 bg-white rounded-x pb-7 plr-16">
				<LineInput
					v-model="form.password"
					type="password"
					placeholder="请输入新密码(6-20位)"
					placeholderClass="text-info fs-14 fw-7"
					:maxlength="20"
				/>
			</view>
			
			<view class="title mt-40">确认新密码</view>
			<view class="mt-7 bg-white rounded-x pb-7 plr-16">
				<LineInput
					v-model="form.confirm_password"
					type="password"
					placeholder="请再次填写确认"
					placeholderClass="text-info fs-14 fw-7"
					:maxlength="20"
				/>
			</view>
			<view class=" mt-47">
				<u-button
					class="bg-base-change fw-7 fs-14 text-white w-247 h-47"
					shape="circle"
					text="完成"
					@click="onSubmit()"
				></u-button>
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
					old_password: '',
					password: '',
					confirm_password: '',
					captcha_code: ''
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
				if(!this.form.account) {
					this.$c.toast('请输入手机号')
					return
				} 
				const res = await this.$c.fetch(this.$api.config.mobile_captcha, {
					phone: this.form.account,
					mode: 'reset'
				})
				if(res) {
					this.showCodeBtn = false
					// this.form.captcha_id = res.id
					// this.captcha = res.base64_image
					this.$refs.countDown.reset();
					this.$refs.countDown.start();
				}
			},
			async onSubmit() {
				if(!this.form.old_password) {
					this.$c.toast('请输入原登录密码')
					return
				}
				if(!this.form.password) {
					this.$c.toast('请输入新密码')
					return
				}
				if(!this.form.confirm_password) {
					this.$c.toast('请再次填写确认')
					return
				}
				const res = await this.$c.fetch(this.$api.user.loginPassword, this.form)
				if(res) {
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
</style>