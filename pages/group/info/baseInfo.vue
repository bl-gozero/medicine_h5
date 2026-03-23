<template>
	<view class="page bg-page">
		<Title title="群资料" />
		<view class="plr-20">
			<view class="bg-white plr-15 ptb-14 flex-between rounded-8 mt-12" @click="chooseAvatar()">
				<text class="">群头像</text>
				<view class="flex-start">
					<u-avatar :src="$c.formatImgUrl(form.avatar)" size="39" default-url="/static/group/default.png" class="mr-9"
						mode="aspectFill"></u-avatar>
					<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
				</view>
			</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<text class="">群名称</text>
				<view class="mt-12">
					<u--textarea v-model="form.name" placeholder="请输入群名称" class="disabled-textarea"
						placeholderClass="placeholderClass" border="none" :maxlength="24" height="100" :count="role < 3"
						clearable :disabled="memberInfo.memberRole !== 1"></u--textarea>
				</view>
			</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<text class="">群介绍</text>
				<view class="mt-12">
					<u--textarea v-model="form.intro" placeholder="请输入群介绍" class="disabled-textarea"
						placeholderClass="placeholderClass" border="none" :maxlength="50" height="100" :count="role < 3"
						clearable :disabled="memberInfo.memberRole !== 1"></u--textarea>
				</view>
			</view>
			<view class="h-120"></view>
		</view>
		<view v-if="memberInfo.memberRole === 1" class="fixed left-0 bottom-20 pw-100 ptb-20">
			<button class="fw-7 lh-10 fs-14 bg-base text-white w-247 h-47 flex-center rounded-x"
				:disabled="btnDisable" @click="show = true">保存</button>
		</view>

		<u-modal :show="show" title="提示" content='修改群资料后将重新审核，审核期间会在大厅列表中消失，是否修改？' confirmColor="#3D3D3D"
			cancelColor="#9F9F9F" showCancelButton @cancel="show = false" @confirm="doSubmit"></u-modal>
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
				teamInfo,
				memberInfo,
				form: {
					...teamInfo
				},
				doSubmit: null,
				show: false,
				role: 100
			}
		},
		computed: {
			btnDisable() {
				const params = {}
				if (this.form && this.teamInfo) {
					['avatar', 'name', 'intro'].forEach(key => {
						if (this.form[key] !== this.teamInfo[key]) {
							params[key] = this.form[key]
						}
					})
				}
				return Object.keys(params).length === 0 ? true : false
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
			chooseAvatar() {
				if (memberInfo.memberRole !== 1) return
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], // 初步压缩
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempPath = res.tempFilePaths[0];
						// 压缩图片
						// #ifdef H5
						this.uploadAvatar(tempPath);
						// #endif

						// #ifndef H5
						uni.compressImage({
							src: tempPath,
							quality: 70,
							success: res => {
								this.uploadAvatar(res.tempFilePath);
							},
							fail: () => {
								this.uploadAvatar(tempPath);
							}
						})
						// #endif
					}
				});
			},
			uploadAvatar(file) {
				const api = this.$baseUrl + '/resource/upload'
				uni.showLoading()
				uni.uploadFile({
					url: api,
					filePath: typeof file === 'string' ? file : file.path, // 非 H5 端就是本地路径
					name: 'file',
					success: (uploadRes) => {
						const res = JSON.parse(uploadRes.data);
						this.form.avatar = res.data.url;
					},
					fail: (err) => {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			async onSubmit() {
				this.show = false
				if (!this.form.avatar) {
					this.$c.toast('请选择群头像')
					return
				}
				if (!this.form.name) {
					this.$c.toast('请输入群名称')
					return
				}
				if (!this.form.intro) {
					this.$c.toast('请输入群介绍')
					return
				}
				const params = {}
				if (this.form && this.teamInfo) {
					['avatar', 'name', 'intro'].forEach(key => {
						if (this.form[key] !== this.teamInfo[key]) {
							params[key] = this.form[key]
						}
					})
				}
				if (Object.keys(params).length > 0) {
					const res1 = updateTeamInfo(this.form.teamId, this.form.teamType, params)
					if (res1) {
						const res = await this.$c.fetch(this.$api.group.baseInfo, {
							team_id: parseInt(this.form.teamId),
							icon: this.form.avatar,
							name: this.form.name,
							intor: this.form.intro
						})
						if (res) {
							this.$c.toast('更新成功')
							setTimeout(() => {
								this.$c.goBack()
							}, 1500)
						}
					}
				} else {
					this.$c.toast('未更新信息')
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