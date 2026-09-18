<template>
	<view class="page plr-20 border-box title-color" style="background: #120E0A;">
		<Title title="协议上传" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
			:titleStyle="{ color: '#B88344' }"></Title>
		<view class="text-center text-color mb-40 mt-10">完成合作协议登记后，即可进行成果录入</view>
		<view class="relative mt-10">
			<image :src="img('agreement-1.webp')" class="x-100" mode="widthFix"></image>
			<view class="full border-box text-center flex-center">
				<view class="" style="padding-top: 8%;">
					<view class="flex-center h-83 relative">
						<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1"
							:maxSize="5 * 1024 * 1024" multiple :maxCount="3" width="79" height="79">
							<image v-if="!fileList1.length" :src="img('img.webp')" class="upload-0"></image>
							<image v-else :src="img('blank.webp')" class="i-79"></image>
						</u-upload>
					</view>
					<view class="fs-18 fw-7 title-color mt-12">拍照上传协议</view>
					<view class="fs-12 mt-5">需要上传：协议首页、协议签署页、条形码</view>
					<image :src="img('upload.webp')" class="w-179 h-42 auto-x" style="margin-top: 10%;" @click="doSubmit"></image>
					<view class="title-color flex-center" style="margin-top: 5%;">
						<image :src="img('icon-0.webp')" class="i-16 mr-5"></image>
						<text>待上传</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="lastLog.id" class="relative mt-10">
			<image :src="img('agreement-2.webp')" class="x-100" mode="widthFix"></image>
			<view class="full border-box flex-center plr-17" style="top: 6%;">
				<view class="flex-between fgap-20">
					<view class="flex-1 self-start">
						<view class="flex-start fgap-3">
							<image :src="img('icon-2.webp')" class="i-16"></image>
							<text style="color: #82A525;">协议已上传并通过审核</text>
						</view>
						<view class="flex-start fgap-3 mt-25">
							<image :src="img('log.webp')" class="i-16"></image>
							<view class="flex-between fgap-14 flex-1">
								<view class="">协议编号</view>
								<view class="flex-1 u-line-1">{{ lastLog.serial_number }}</view>
							</view>
						</view>
						<view class="flex-start fgap-3 mt-25">
							<image :src="img('time.webp')" class="i-16"></image>
							<view class="flex-between fgap-14">
								<view class="">上传时间</view>
								<view class="flex-1 u-line-1">{{ lastLog.created_at }}</view>
							</view>
						</view>
					</view>
					<view class="">
						<image :src="img('agreement.webp')" class="w-78 h-106 auto-x"></image>
						<view class="w-78 flex-center fgap-6 mt-10 rounded-3" style="border: 1px solid #B88344;"
							@click="preview()">
							<image :src="img('search.webp')" class="i-13"></image>
							<view class="rounded-3 fs-12 ptb-5">查看预览</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="relative mt-10">
			<image :src="img('agreement-3.webp')" class="x-100" mode="widthFix"></image>
			<view class="full border-box">
				<view v-if="!logs.length" class="full flex-center" style="opacity: .6;">暂无记录</view>
				<scroll-view v-else scroll-y class="full" style="padding: 14% 5% 7%;" @scrolltolower="">
					<view class="flex-between ptb-10 fgap-8" v-for="i in logs" :key="i.id"
						style="border-bottom: 1px solid #342D24;">
						<image :src="img('log.webp')" class="i-16"></image>
						<view class="flex-1">
							<view class="">{{ i.serial_number }}</view>
							<view class="mt-8 fs-12" style="opacity: .6;">{{ i.created_at }}</view>
							<view v-if="i.remark && i.is_veriry && i.is_veriry.id == 3" class="flex-start mt-5" @click="onReason(i)">
								<text class="text-color">查看驳回理由</text>
								<image :src="img('arrow.webp')" class="w-7 h-11 ml-2"></image>
							</view>
						</view>
						<view class="flex-end">
							<image v-if="i.is_veriry" :src="img('status-' + i.is_veriry.id + '.webp')"
								class="w-68 h-19"></image>
							<image :src="img('arrow.webp')" class="w-7 h-11 ml-6"></image>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<image :src="img('agreement-4.webp')" class="x-100 mt-10" mode="widthFix"></image>
		<view class="h-20"></view>

		<u-popup :show="showReason" mode="center" bgColor="transparent" :closeOnClickOverlay="false"
			@close="showReason = false">
			<view class="relative title-color">
				<image :src="img('popup.webp')" class="w-337" mode="widthFix"></image>
				<view class="full border-box plr-16">
					<view class="text-center fs-18 fw-7 h-40 flex-center">驳回理由</view>
					<view class="pt-36 text-center">
						<text class="fs-20 fw-7">协议：</text>
						<text>{{ log.serial_number }}</text>
					</view>
					<scroll-view scroll-y class="mt-25 h-137">
						<view class="text-color">{{ log.remark }}</view>
					</scroll-view>
					<view class="flex-center mt-30">
						<!-- <image :src="img('cancel.webp')" class="w-146 h-44" @click="showReason = false"></image> -->
						<image :src="img('btn-reupload.webp')" class="w-147 h-44" @click="onReupload()"></image>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				showReason: false,
				log: {},
				logs: [],
				fileList1: [],
				doSubmit: null,
				lastLog: {}
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {},
		methods: {
			onReason(i) {
				this.log = i
				this.showReason = true
			},
			onReupload() {
				// this.doSubmit(this.log.picture)
				this.showReason = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
			preview() {
				if (!this.lastLog.picture || !this.lastLog.picture.length) return
				uni.previewImage({
					current: this.lastLog.picture[0],
					urls: this.lastLog.picture
				})
			},
			async getList() {
				const res = await this.$c.fetch(this.$api.syt.agreementList)
				if (res) {
					this.logs = res
					this.lastLog = res.filter(item => item.is_veriry?.id === 2)
						.sort((a, b) => {
							return new Date(b.created_at) - new Date(a.created_at)
						})[0] || {}
					// console.log(this.lastLog)
				}
			},
			async onSubmit(p = []) {
				let picture = []
				if (Array.isArray(p)) {
					picture = p
				} else {
					if (this.fileList1.length < 3) return this.$c.toast('请按要求上传照片')
					picture = this.fileList1.map(item => item.url)
				}
				const res = await this.$c.fetch(this.$api.syt.upload, {
					picture: picture
				})
				if (res) {
					this.$c.toast('提交成功，请等待审核')
					this.fileList1 = []
					this.getList()
				}
			},
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1);
			},
			// 上传图片
			async afterRead(event) {
				// multiple=true 时 event.file 是数组，否则是对象
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length

				// 先加入列表，显示上传中
				lists.forEach(item => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: ''
					})
				})

				for (let i = 0; i < lists.length; i++) {
					try {
						const url = await this.uploadFilePromise(lists[i].url)
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(
							fileListLen,
							1,
							Object.assign(item, {
								status: 'success',
								message: '',
								url
							})
						)
					} catch (e) {
						// console.error('上传失败：', e)
						let item = this[`fileList${event.name}`][fileListLen]
						this[`fileList${event.name}`].splice(
							fileListLen,
							1,
							Object.assign(item, {
								status: 'failed',
								message: e.message || '上传失败'
							})
						)
						this.$c.toast(e.message || '上传失败')
					}
					fileListLen++
				}
			},
			// 上传接口
			uploadFilePromise(url) {
				const api = this.$baseUrl + '/resource/upload'

				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: api,
						filePath: url,
						name: 'file',
						formData: {
							mode: 'shops'
						},
						success: (res) => {
							// console.log('upload result：', res)
							// HTTP 状态码错误
							if (res.statusCode === 413) {
								reject(new Error('文件过大'))
								return
							}
							if (res.statusCode !== 200) {
								reject(new Error(`上传失败（${res.statusCode}）`))
								return
							}
							try {
								const result = typeof res.data === 'string' ?
									JSON.parse(res.data) :
									res.data

								if (result.code === 0) {
									resolve(result.data.url)
								} else {
									reject(new Error(result.msg || '上传失败'))
								}
							} catch (e) {
								reject(new Error('服务器返回数据格式错误'))
							}
						},
						fail: (err) => {
							// console.error('upload fail：', err)
							reject(new Error('网络上传失败'))
						}
					})
				})
			},
			img(path, mode = 0, root = '/static/suiyuantang/junyang/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-color {
		color: #B88344;
	}

	.text-color {
		color: #E0B321;
	}

	image {
		display: block;
	}

	.upload-0 {
		display: block;
		width: 83px;
		height: 83px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
</style>