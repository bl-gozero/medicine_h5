<template>
	<view class="page bg-page">
		<Title title="设置" />
		<view class="plr-20">
			<view class="menu_box bg-white plr-15 rounded-8 mt-12" v-for="(item, index) in list" :key="index">
				<view class="menu ptb-14 flex-between" v-for="(i, j) in item" :key="j" @click="onMenu(i)">
					<text class="">{{ i.name }}</text>
					<text v-if="i.type == 'account'" class="text-info">{{ profile.account }}</text>
					<u-icon v-else-if="i.type == 'link'" name="arrow-right" size="12" color="#7D7D7D"></u-icon>
					<u-avatar v-else-if="i.type == 'avatar'" :src="profile.avatar" size="55" default-url="/static/user/avatar.png" class="mr-10"></u-avatar>
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
	// #ifdef H5
	// import lrz from 'lrz'
	// #endif

	export default {
		components: {
			Title
		},
		data() {
			return {
				profile: this.$c.getStorage('profile') || {},
				list: [
					[{
							name: '头像',
							type: 'avatar'
						},
						{
							name: '账号',
							type: 'account'
						},
						{
							name: '我的二维码',
							type: 'link',
							url: '/pages/user/qrcode'
						}
					],
					[{
							name: '更改登录密码',
							type: 'link',
							url: '/pages/user/loginPassword'
						},
						{
							name: '更改交易密码',
							type: 'link',
							url: '/pages/user/payPassword'
						}
					],
					[{
							name: '账户绑定管理',
							type: 'link',
							url: '/pages/user/bindCard'
						},
						{
							name: '地址管理',
							type: 'link',
							url: '/pages/user/address'
						}
					]
				],
				doAvatar: null,
				avatar: ''
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
				const res = await this.$c.fetch(this.$api.user.avatarEdit, {
					avatar: this.avatar
				})
				if (res) this.profile.avatar = this.avatar
			}
		}
	}
</script>

<style>
	.menu_box>*:not(:last-child) {
		border-bottom: 1px solid #F5F5F5;
	}
</style>