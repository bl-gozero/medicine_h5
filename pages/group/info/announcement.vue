<template>
	<view class="page bg-page">
		<Title title="群公告" />
		<view class="plr-20">
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<view class="">
					<u--textarea 
						v-model="form.announcement"
						placeholder="请输入群公告，限500个字数"
						class="disabled-textarea"
						placeholderClass="placeholderClass"
						border="none" 
						:maxlength="500"
						height="350"
						:count="memberInfo.memberRole === 1"
						:disabled="memberInfo.memberRole !== 1"
						clearable
					></u--textarea>
				</view>
			</view>
			<view class="h-120"></view>
		</view>
		<view v-if="memberInfo.memberRole === 1" class="fixed left-0 bottom-20 pw-100 ptb-20">
			<button class="fw-7 lh-10 fs-14 bg-base text-white w-247 h-47 flex-center rounded-x"
				@click="doSubmit">保存</button>
		</view>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	import {
		teamInfo,
		memberInfo,
		updateTeamInfo
	} from '@/utils/nim.js'

	export default {
		components: {
			Title
		},
		data() {
			return {
				memberInfo,
				teamInfo,
				doSubmit: null,
				show: false,
				role: 100,
				form: teamInfo
			}
		},
		watch: {
			teamInfo(newValue) {
			    this.form = newValue;
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.$c.checkNim()
			const info = this.$c.getStorage('chatInfo') || {}
			if (!info || Object.keys(info).length === 0 || !info.team_id) {
				this.$c.toast('参数有误')
				this.$c.goto('/pages/group/index')
				return
			}
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async onSubmit() {
				const res1 = await updateTeamInfo(this.teamInfo.teamId, this.teamInfo.teamType, { announcement: this.form.announcement || ''})
				if(res1) {
					const res = await this.$c.fetch(this.$api.group.announcement, {
						team_id: parseInt(this.teamInfo.teamId),
						announcement: this.form.announcement || ''
					})
					if (res) {
						await this.$c.toast('更新成功')
						this.$c.goBack()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-textarea {
		padding: 0 !important;
	}

	.placeholderClass {
		font-size: 14px !important;
		color: #989898 !important;
	}

	::v-deep .u-textarea__field {
		font-size: 14px !important;
		color: #3d3d3d !important;
	}

	.disabled-textarea {
		background-color: #fff !important;
	}
</style>