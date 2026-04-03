<template>
	<view class="page bg-page">
		<Title title="我的信息" />
		<view class="plr-20">
			<view class="menu_box bg-white plr-15 rounded-8 mt-12">
				<view class="menu ptb-14 flex-between">
					<text class="">头像</text>
					<u-avatar :src="profile.avatar" size="39" :default-url="$c.userAvatar()" class="mr-10" @click="chooseAvatar()"></u-avatar>
				</view>
				<view class="menu ptb-17 flex-between">
					<text class="">昵称</text>
					<view class="flex-1 ml-30">
						<u-input 
							v-model="profile.nickname"
							placeholder="请输入昵称"
							placeholderClass="fs-14"
							inputAlign="right"
							border="none"
						></u-input>
					</view>
				</view>
			</view>
		</view>
		<button
			class="fixed bottom-45 left-0 right-0 fw-7 lh-10 fs-14 bg-base text-white w-247 h-47 rounded-x border-1 flex-center"
			@click="doNick">保存</button>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import { updateSelfUserProfile } from '@/utils/nim.js'
	// #ifdef H5
	// import lrz from 'lrz'
	// #endif

	export default {
		components: {
			Title
		},
		data() {
			return {
				profile: this.$c.profile(),
				doAvatar: null,
				avatar: '',
				doNick: null,
				type: 0
			}
		},
		async onLoad(p) {
			if(p.type == 1) this.type = 1
			this.profile = await this.$c.checkeLogin(1)
			this.doAvatar = this.$c.onceRequest(this.onAvatarEdit)
			this.doNick = this.$c.onceRequest(this.onNick)
		},
		onShow() {
			
		},
		methods: {
			chooseAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], // 初步压缩
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempPath = res.tempFilePaths[0];
						// 压缩图片
						// #ifdef H5
						// lrz(tempPath, {
						// 	quality: 0.7
						// }).then(rst => {
						// 	const ext = tempPath.split('.').pop(); // 从原路径取扩展名
						// 	const fixedFile = new File([rst.file], `avatar.${ext}`, { type: rst.file.type });
						// 	console.log(fixedFile)
						// 	this.uploadAvatar(fixedFile);
						// }).catch(() => {
						// 	this.uploadAvatar(tempPath);
						// });
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
					formData: {
						mode: 'avatar'
					},
					success: (uploadRes) => {
						const res = JSON.parse(uploadRes.data);
						this.avatar = res.data.url;
						if (this.doAvatar) this.doAvatar();
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
			async onAvatarEdit() {
				const res1 = await updateSelfUserProfile({ avatar: this.avatar })
				if (res1) {
					const res = await this.$c.fetch(this.$api.user.avatarEdit, {
						avatar: this.avatar
					})
					if (res) this.profile.avatar = this.avatar
				} else {
					this.$c.toast('操作失败')
				} 
			},
			async onNick() {
				if(this.profile.nickname == this.profile.account) {
					this.$c.toast('昵称不能和账号相同')
					return
				}
				const res = await this.$c.fetch(this.$api.user.nickname, {
					im_name: this.profile.nickname
				})
				if (res) {
					this.$c.toast('保存成功')
					this.type == 1 ?  this.$c.goto('/pages/web/download') : this.$c.goBack()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.menu_box>*:not(:last-child) {
		border-bottom: 1px solid #F5F5F5;
	}
	
	::v-deep .uni-input-input {
		font-size: 14px !important;
	}
</style>