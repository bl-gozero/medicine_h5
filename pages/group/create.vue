<template>
	<view class="page bg-page">
		<Title title="创建群聊" />
		<view class="plr-20">
			<view class="bg-white plr-15 ptb-14 flex-between rounded-8 mt-12" @click="chooseAvatar()">
				<text class="">群头像</text>
				<view class="flex-start">
					<u-avatar :src="form.icon" size="39" default-url="/static/group/default.png" class="mr-9"></u-avatar>
					<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
				</view>
			</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<text class="">群名称</text>
				<view class="">
				</view>
			</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<text class="">群介绍</text>
				<view class="">
				</view>
			</view>
		</view>
		<button
			class="fixed bottom-45 left-0 right-0 fw-7 lh-10 fs-14 bg-white text-base w-247 h-47 rounded-x border-1 flex-center"
			@click="onLogOut()">退出登录</button>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: {
			Title
		},
		data() {
			return {
				form: { icon: '', intro: '', team_category: '', join_mode: '' }
			}
		},
		onLoad() {
			this.getProfile()
			this.doAvatar = this.$c.onceRequest(this.onAvatarEdit)
		},
		methods: {
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if (res) {
					this.profile = res
					this.$c.setStorage('profile', res)
				}
			},
			onLogOut() {
				this.$c.setStorage('jwt', '')
				this.$c.setStorage('profile', {})
				this.$c.goto('/pages/index/login')
			},
			onMenu(i) {
				if (i.type == 'link') {
					this.$c.goto(i.url)
				} else if (i.type == 'avatar') {
					this.chooseAvatar()
				}
			},
			chooseAvatar() {
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
						this.form.icon = res.data.url;
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
		}
	}
</script>

<style>

</style>