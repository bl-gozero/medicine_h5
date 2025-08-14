<template>
	<view class="page bg-page">
		<Title title="更改交易密码" />
		<view class="mt-20 plr-20">
			<view class="title">原交易密码</view>
			<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
				<LineInput
					v-model="form.old_password"
					type="password"
					placeholder="请输入交易现密码"
					placeholderClass="text-info fs-14 fw-7"
					:maxlength="20"
				/>
			</view>
			<view class="mt-10 fs-12 text-info">若为首次修改原交易密码可不填</view>
			
			<view class="title mt-40">新密码</view>
			<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
				<LineInput
					v-model="form.password"
					type="password"
					placeholder="请输入6位数字"
					placeholderClass="text-info fs-14 fw-7"
					:maxlength="6"
					formatter="number"
				/>
			</view>
			
			<view class="title mt-40">确认新密码</view>
			<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
				<LineInput
					v-model="form.confirm_password"
					type="password"
					placeholder="请再次填写确认"
					placeholderClass="text-info fs-14 fw-7"
					:maxlength="6"
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
					confirm_password: ''
				},
				doSubmit: null
			}
		},
		onLoad() {
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async onSubmit() {
				if(!this.form.password) {
					this.$c.toast('请输入新密码')
					return
				}
				if(!this.form.confirm_password) {
					this.$c.toast('请再次填写确认')
					return
				}
				const res = await this.$c.fetch(this.$api.user.payPassword, this.form)
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
</style>