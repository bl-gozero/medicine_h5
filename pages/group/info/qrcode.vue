<template>
	<view class="page bg-page">
		<Title title="群二维码" fixed />
		<view class="flex-center" style="margin-top: 30%;">
			<view v-if="qrcode" class="rounded-8 p-14 border-box bg-white">
				<uqrcode ref="uqrcode" canvas-id="qrcode" :value="qrcode" size="185"></uqrcode>
			</view>
		</view>
		<view class="fixed left-0 bottom-20 pw-100 ptb-20">
			<button class="fw-7 lh-10 fs-14 bg-base text-white w-247 h-47 flex-center rounded-x"
				@click="onSave()">保存</button>
		</view>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	import {
		teamInfo
	} from '@/utils/nim.js'

	export default {
		components: {
			Title
		},
		data() {
			return {
				qrcode: ''
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
			this.getInfo(info.team_id)
		},
		methods: {
			async getInfo(team_id) {
				const res = await this.$c.fetch(this.$api.group.join_info, {
					team_id: team_id
				})
				if (res) this.qrcode = JSON.stringify(res)
			},
			onSave() {
				this.$refs.uqrcode.save({
					success: () => {
						// uni.showToast({
						// 	icon: 'success',
						// 	title: '保存成功'
						// });
					}
				});
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