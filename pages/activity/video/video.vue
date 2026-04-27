<template>
	<view class="page" style="background: #B9E5FD;">
		<view class="relative">
			<image :src="img('subtop.webp')" class="x-100 block"></image>
			<view class="full">
				<Title title="提交证明" bgColor="transparent" />
			</view>
		</view>
		<view class="plr-14 relative" style="margin-top: -80rpx;z-index: 1;">
			<view v-if="form.verify && form.verify.id == 2"
				class="rounded-8 plr-16 ptb-13 page_5 flex-between flex-start mb-10" style="">
				<u-icon name="checkmark-circle-fill" color="#00B578" size="20" class="self-start"></u-icon>
				<view class="ml-5 flex-1 fs-12 fw-7" style="color: #00B578;">恭喜您，已通过通过审核</view>
			</view>
			<view v-if="form.verify && form.verify.id == 3" class="rounded-8 plr-16 ptb-13 page_5 flex-between mb-10"
				style="">
				<view class="flex-1">
					<view class="flex-start">
						<u-icon name="close-circle-fill" color="#B95050" size="20" class="self-start"></u-icon>
						<view class="ml-5 flex-1 fs-12">
							<view class="fw-7" style="color: #B95050;">很抱歉，暂未通过审核</view>
							<view class="mt-3">您可以根据要求重新上传</view>
						</view>
					</view>
				</view>
				<button class="btn m-0 w-70 h-22 p-0 fs-12 text-white" style="background: #FF5600;"
					@click="show = true">查看原因></button>
			</view>
			<view class="rounded-10 page_5 plr-12 ptb-19">
				<view class="flex-between fgap-10">
					<view class="step self-start">1</view>
					<view class="flex-1">
						<view class="fw-7">上传发布截图</view>
						<view class="relative i-75 mt-10" @click="chooseImg()">
							<image :src="img('upload.webp')" class="x-100 y-100 block"></image>
							<image v-if="tempImg" :src="tempImg"
								class="x-100 y-100 block absolute top-0 left-0 rounded-8" mode="aspectFill"></image>
						</view>
					</view>
				</view>
				<view class="flex-between fgap-10 mt-15">
					<view class="step self-start">2</view>
					<view class="flex-1">
						<view class="fw-7 mb-10">填写视频链接</view>
						<u-input v-model="form.link" placeholder="粘贴到此处" placeholderClass="text-info"
							:customStyle="inputStyle" clearable></u-input>
					</view>
				</view>
				<view class="flex-between fgap-10 mt-15">
					<view class="step self-start">3</view>
					<view class="flex-1">
						<view class="fw-7 mb-10">填写社交平台账户ID</view>
						<u-input v-model="form.account" placeholder="填写到此处" placeholderClass="text-info"
							:customStyle="inputStyle" clearable></u-input>
					</view>
				</view>
				<view class="flex-between fgap-10 mt-15">
					<view class="step self-start">4</view>
					<view class="flex-1">
						<view class="fw-7 mb-10">选择社交平台ID</view>
						<view class="flex-between" :style="inputStyle" @click="showPicker = true">
							<view :class="!platform && 'text-info'">{{ platform ? platform : '选择平台' }}</view>
							<u-icon name="arrow-right" :color="$c.arrowColor()" size="12"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="h-100"></view>
		<view class="fixed left-0 bottom-30 x-100">
			<button v-if="form.verify && [1, 4].includes(form.verify.id)"
				class="btn-play flex-center w-246 h-50 fs-20 fw-7 rounded-20" style="opacity: .5">审核中</button>
			<button v-if="!form.verify || form.verify.id == 3"
				class="btn-play flex-center w-246 h-50 fs-20 fw-7 rounded-20" @click="doSubmit()">提交审核</button>
		</view>


		<u-picker :show="showPicker" :columns="platforms" keyName="value" :confirmColor="$c.baseColor()"
			@confirm="onConfirm" @cancel="showPicker = false"></u-picker>

		<u-popup :show="show" mode="center" round="20" :closeOnClickOverlay="true" @close="show = false">
			<view class="w-308 p-25 border-box">
				<view class="text-center fs-18">未通过原因</view>
				<view class="mt-20 fs-14 lh-20">{{ form.remark }}</view>
				<button class="btn bg-base w-234 h-51 text-white fs-16 fw-7 mt-50" @click="show = false">知道了</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'

	export default {
		components: {
			Title
		},
		data() {
			return {
				doSubmit: null,
				show: false,
				loading: false,
				showPicker: false,
				inputStyle: {
					backgroundColor: '#F3F7F8',
					borderRadius: '12px',
					height: '45px',
					padding: '0 14px',
					boxSizing: 'border-box',
					border: '1px solid #ECECEC !important'
				},
				form: {
					account: '',
					link: '',
					picture: '',
					platform: null
				},
				platforms: [],
				tempImg: '',
			}
		},
		computed: {
			platform() {
				return this.platforms?.[0]?.find(
					i => i.id == this.form.platform
				)?.value || ''
			}
		},
		onLoad(p) {
			this.$c.checkeLogin()
			const id = this.$c.safeId(p)
			if (id) this.form.id = id
			this.getInfo()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			onConfirm(e) {
				this.form.platform = e.value[0]?.id || null
				this.showPicker = false
			},
			async onSubmit(mode) {
				if (this.loading) return
				this.loading = true
				const api = this.form?.id ? this.$api.event.videoEdit : this.$api.event.videoCreate
				const res = await this.$c.fetch(api, this.form)
				if (res) {
					await this.$c.toast('提交成功，请等待审核')
					this.$c.goBack()
				}
				this.loading = false
			},
			async getInfo() {
				await this.getPlatforms()
				if (this.form?.id) this.getVideoDetail()
			},
			async getPlatforms() {
				const res = await this.$c.fetch(this.$api.event.platformList)
				if (res) this.platforms = [res]
			},
			async getVideoDetail() {
				const res = await this.$c.fetch(this.$api.event.videoDetail, {
					id: this.form?.id
				})
				if (res) {
					this.form = { ... res, ...{
						platform: res.platform.id
					}}
					this.tempImg = res.picture
				}
			},
			chooseImg() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], // 初步压缩
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempPath = res.tempFilePaths[0]
						// #ifdef H5
						this.uploadImg(tempPath)
						// #endif

						// #ifndef H5
						uni.compressImage({
							src: tempPath,
							quality: 70,
							success: res => {
								this.uploadImg(res.tempFilePath)
							},
							fail: () => {
								this.uploadImg(tempPath)
							}
						})
						// #endif
					}
				});
			},
			uploadImg(file) {
				const api = this.$baseUrl + '/resource/upload'
				const filePath = typeof file === 'string' ? file : file.path // 非 H5 端就是本地路径
				uni.showLoading()
				uni.uploadFile({
					url: api,
					filePath: filePath,
					name: 'file',
					formData: {
						mode: 'lucky_star'
					},
					success: (uploadRes) => {
						const res = JSON.parse(uploadRes.data)
						this.form.picture = res.data?.url
						this.tempImg = filePath
					},
					fail: (err) => {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading()
					}
				});
			},
			img(path, root = '/static/avtivity/video/') {
				let imgPath = root + path
				return this.$c.img(imgPath, 0)
			}
		}
	}
</script>

<style scoped lang="scss">
	.step {
		background: #FF7C93;
		border-radius: 5px 5px 11px 5px;
		width: 22px;
		height: 20px;
		line-height: 18px;
		font-weight: 900;
		font-size: 12px;
		font-family: Be Vietnam Pro;
		// transform: skew(-10deg);
		font-style: italic;
		color: #fff;
		padding-left: 5px;
	}

	.btn-play {
		background: linear-gradient(90deg, #FF9563 0%, #FF470C 47%, #FC37A9 100%);
		border-radius: 8px;
		width: 77px;
		height: 27px;
		font-size: 13px;
		font-weight: 500;
		line-height: 25px;
		text-align: center;
		color: #FFFFFF;
	}

	.page_5 {
		border-radius: 8px;
		background: linear-gradient(180deg, rgba(220, 243, 255, 0.9) 0%, rgba(255, 255, 255, 0.9) 50%);
		border: 2px solid #fff;
		box-sizing: border-box;
	}
</style>