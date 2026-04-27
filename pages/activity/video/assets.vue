<template>
	<view class="page" style="background: #B9E5FD;">
		<view class="relative">
			<image :src="img('subtop.webp')" class="x-100 block"></image>
			<view class="full">
				<Title title="素材库" bgColor="transparent" />
			</view>
		</view>
		<view class="flex-center" style="margin-top: -80rpx;">
			<view class="rounded-10 bg-white relative border-box pt-30 pb-20 plr-14 w-348">
				<image :src="img('asset.webp')" class="title block"></image>
				<view class="">
					<view class="flex-end">
						<button class="btn-play m-0 w-79 p-0 flex-center" @click="$c.copy(asset.text)">
							<image :src="img('copy.webp')" class="i-16 block"></image>复制文案
						</button>
					</view>
					<view class="rounded-4 h-95 border-box p-10 mt-10" style="background: #E6F3FA;">
						<scroll-view class="h-75 rounded-4" scroll-y>
							<view class="" style="color: #637B87;">{{ asset.text }}</view>
						</scroll-view>
					</view>
					<view class="flex-end mt-15">
						<button class="btn-play m-0 w-108 p-0 flex-center" @click="onDownload()">
							<image :src="img('download.webp')" class="i-16 block"></image>下载图片/视频
						</button>
					</view>
					<view class="flex-start fgap-6 mt-10 flex-wrap">
						<view class="i-75" v-for="(item, index) in asset.media" :key="index">
							<u-image :src="img(assetType(item))" :showLoading="true" width="77" height="77"
								bgColor="#D0EBFA" :errorIcon="img(assetType(item, 0))" mode="aspectFill"></u-image>
						</view>
					</view>
				</view>
			</view>
		</view>
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
				asset: {},
				loading: false
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getAssetList()
		},
		methods: {
			img(path, root = '/static/avtivity/video/') {
				if (!/^(https?:)?\/\//.test(path)) {
					path = root + path
				}
				return this.$c.img(path, 0)
			},
			async getAssetList() {
				const id = this.$c.getStorage('videoId') || 0
				const res = await this.$c.fetch(this.$api.event.assetList, {
					id: id
				})
				if (res) {
					this.asset = res
					this.$c.setStorage('videoId', res.id)
				}
			},
			assetType(e, mode = 1) {
				return this.getFileType(e) == 'video' ? 'video.webp' : (mode == 1 ? e : 'image.webp')
			},
			getFileType(url) {
				const ext = url.split('.').pop().toLowerCase()

				if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image'
				if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) return 'video'

				return 'other'
			},
			async onDownload() {
				if (this.loading) return this.$c.toast('下载中')	
				const list = this.asset?.media || []
				if (!list.length) return this.$c.toast('没有可下载资源')
				this.loading = true
				// #ifdef H5
				this.downloadAllH5(list)
				// #endif
				// #ifdef MP-WEIXIN
				this.downloadAllMp(list)
				// #endif
			},
			async downloadAllH5(list) {
				for (let i = 0; i < list.length; i++) {
					const url = list[i]
					const type = this.getFileType(url)
					try {
						const blob = await fetch(url).then(res => res.blob())
						const a = document.createElement('a')
						const objectUrl = URL.createObjectURL(blob)

						const ext = url.split('.').pop().toLowerCase()

						a.href = objectUrl
						a.download = `file_${i + 1}.${ext}`
						a.click()
						URL.revokeObjectURL(objectUrl)
						await this.sleep(300)
					} catch (e) {
						console.log('下载失败', url)
					}
				}
				this.$c.toast('下载完成')
				this.loading = false
			},
			async downloadAllMp(list) {
				uni.showLoading({
					title: '下载中...'
				})
				let success = 0
				for (let i = 0; i < list.length; i++) {
					const url = list[i]
					const type = this.getFileType(url)
					try {
						const res = await uni.downloadFile({
							url
						})
						if (res.statusCode === 200) {
							if (type === 'image') {
								await uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath
								})
							} else if (type === 'video') {
								await uni.saveVideoToPhotosAlbum({
									filePath: res.tempFilePath
								})
							}
							success++
						}
					} catch (e) {
						console.log('失败', url)
						if (e.errMsg.includes('auth deny')) {
							uni.showModal({
								title: '提示',
								content: '需要授权保存到相册',
								success: (r) => {
									if (r.confirm) uni.openSetting()
								}
							})
							break
						}
					}
				}
				uni.hideLoading()
				this.$c.toast(`成功保存 ${success}/${list.length}`)
				this.loading = false
			}
		}
	}
</script>

<style scoped lang="scss">
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

	.title {
		position: absolute;
		top: -8px;
		left: -3px;
		width: 354px;
		height: 76px;
	}
</style>