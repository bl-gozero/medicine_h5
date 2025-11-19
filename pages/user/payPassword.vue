<template>
	<view class="page bg-page">
		<Title :title="type == 1? '设置交易交易' : '更改交易密码'" />
		<view class="mt-20 plr-20">
			<view v-if="type != 1" class="">
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
			</view>
			
			<view class="title mt-40">{{ type == 1? '设置密码' : '新密码' }}</view>
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
			
			<view class="title mt-40">{{ type == 1? '确认交易密码' : '确认新密码' }}</view>
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
				doSubmit: null,
				type: 0
			}
		},
		onLoad(p) {
			if(p.type == 1) this.type = 1
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
					await this.$c.toast('操作成功')
					this.type == 1? this.$c.goto('/pages/user/baseInfo?type=1') : this.$c.goBack()
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