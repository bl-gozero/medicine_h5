<template>
	<view class="page text-title fs-12" style="background: #120E0A;">
		<Title title="我的培育" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
			:titleStyle="{ color: '#B88344' }"></Title>
		<view class="relative mlr-20 auto-x border-box">
			<image :src="img('grow/1.webp')" class="x-100" mode="widthFix"></image>
			<view class="absolute flex-end" style="top: 5%;right: 20px;" @click="page = 3">
				<view class="opacity-6 lh-10">查看全部</view>
				<image :src="img('right.webp')" class="w-7 h-11 mt-1 ml-2"></image>
			</view>
			<view class="absolute x-100 plr-20 border-box" style="top: 19%;">
				<view class="flex-between">
					<view class="flex-1 flex-center relative">
						<e-chart ref="echartRef" @ready="initEchart" height="130px" />
						<view class="full flex-center fs-36 fw-7 lh-10" style="transform: translateY(-3%);">{{ list.length }}</view>
					</view>
					<view class="flex-1 flex-center">
						<view class="">
							<view class="flex-start">
								<view class="i-10 status-1 rounded"></view>
								<view class="w-82 flex-between ml-3">
									<view class="">培育中</view>
									<view class="">{{ total.grow }}份</view>
								</view>
							</view>
							<view class="flex-start mt-15">
								<view class="i-10 status-2 rounded"></view>
								<view class="w-82 flex-between ml-3">
									<view class="">周期达成</view>
									<view class="">{{ total.over }}份</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="x-50 text-center fs-14">我的培育：{{ list.length }}份</view>
			</view>
		</view>
		<view v-if="list.length" class="">
			<swiper class="h-38 mt-20" :current="activeIndex" previous-margin="calc((100vw - 190px) / 2)"
				next-margin="calc((100vw - 190px) / 2)" :duration="300" circular @change="swiperChange">
				<swiper-item v-for="(item, index) in list" :key="item.id">
					<view class="code flex-center fgap-5" :class="activeIndex != index && 'code-0'"
						@click="changeCard(index)">
						<image :src="img('grow/tag.webp')" class="w-12 h-19" mode="widthFix"></image>
						<view class="">{{ item.barcode }}</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="relative mlr-20 auto-x border-box mt-15">
				<image :src="img('grow/2.webp')" class="x-100" mode="widthFix"></image>
				<view class="flex-end absolute" style="top: 2.5%;right: 20px;"
					@click="$c.goto('/pages/suiyuantang/sellList')">
					<view class="opacity-6 fs-12 lh-10">委托售卖记录</view>
					<image :src="img('right.webp')" class="w-7 h-11 mt-1 ml-2"></image>
				</view>
				<view class="absolute x-100 plr-20 border-box" style="top: 12%;">
					<view class="flex-between">
						<image :src="img('junyang/scan-goods.webp')" class="w-74 h-82"></image>
						<view class="ml-23 flex-1">
							<view class="fs-20 fw-7">酵岁菌（太岁）</view>
							<view class="flex-start mt-3">
								<text>当前状态：第{{ info.cycle || '' }}周期</text>
								<GrowStatus :status="info.is_progress" class="ml-6" />
							</view>
						</view>
					</view>
					<view class="relative mt-20">
						<image :src="img('grow/box-process.webp')" class="x-100" mode="widthFix"></image>
						<view class="full p-15 border-box">
							<view class="fs-14">我的年度培养进度</view>
							<view class="flex-between">
								<!-- <view class="opacity-6">
									{{ $c.formatDate(info.created_time) }}-{{ $c.formatDate(info.over_time) }}
								</view> -->
								<view class="opacity-6">
									{{ $c.formatDate(info.start_time, '.') }}-{{ $c.formatDate(info.end_time, '.') }}
								</view>
								<view class="">共6次</view>
							</view>
							<GrowProcess :num="info.cycle" class="mt-15" />
						</view>
					</view>
					<GrowInfo :info="info" class="mt-15"></GrowInfo>
					<image :src="img('btn-sell.webp')" class="w-228 h-44 auto-x mt-20" @click="onShowSell(info)"></image>
				</view>
			</view>
			<view class="relative mt-15 mlr-20 border-box">
				<image :src="img('grow/3.webp')" class="x-100" mode="widthFix"></image>
				<view class="absolute flex-end" style="top: 5%;right: 20px;" @click="page = 2">
					<view class="opacity-6 lh-10">查看全部</view>
					<image :src="img('right.webp')" class="w-7 h-11 mt-1 ml-2"></image>
				</view>
				<view class="absolute border-box y-81 left-20 right-20 border-box" style="top: 14%">
					<GrowLog :logs="logs.slice(0, 3)" @upload="showUpload = true" />
				</view>
			</view>
			<view class="h-20"></view>
		</view>

		<view v-if="page == 2" class="page fixed top-0 x-100 vh-100 bg-syt flex-col text-title plr-20 border-box"
			style="z-index: 100;">
			<Title title="动态培育记录" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
				:titleStyle="{ color: '#B88344' }" isBack @back="page = 1"></Title>
			<view class="flex-center">
				<view class="code flex-center fgap-5">
					<image :src="img('grow/tag.webp')" class="w-12 h-19" mode="widthFix"></image>
					<view class="">{{ info.barcode }}</view>
				</view>
			</view>
			<view class="flex-center fgap-10 mt-10">
				<view class="opacity-6 fs-12">{{ $c.formatDate(info.start_time, '.') }}-{{ $c.formatDate(info.end_time, '.') }}</view>
				<GrowStatus :status="info.is_progress" class="ml-6" />
			</view>
			<view class="flex-1 relative">
				<GrowLog :logs="logs" @upload="showUpload = true" />
			</view>
		</view>

		<view v-if="page == 3" class="page fixed top-0 x-100 vh-100 bg-syt text-title plr-20 border-box flex-col fs-12"
			style="z-index: 100;">
			<Title title="我的培育概览" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
				:titleStyle="{ color: '#B88344' }" isBack @back="page = 1"></Title>
			<view class="flex-1 relative">
				<view v-if="!list.length" class="h-200 flex-center text-black fs-14">暂无记录</view>
				<scroll-view v-else scroll-y class="full pt-10 border-box" @scrolltolower="">
					<view class="relative mb-10" v-for="i in grows" :key="i.id">
						<image :src="img('grow/bg-list.webp')" class="x-100" mode="widthFix"></image>
						<view class="absolute flex-start" style="top: 4%;left: 5%;">
							<image :src="img('grow/tag.webp')" class="w-12 h-19" mode="widthFix"></image>
							<view class="ml-7 fw-7 fs-14" style="color: #120E0A;">{{ i.barcode }}</view>
						</view>
						<view class="absolute flex-end" style="top: 5%;right: 20px;"
							@click="$c.goto('/pages/suiyuantang/sellList')">
							<view class="opacity-6 lh-10">委托售卖记录</view>
							<image :src="img('right.webp')" class="w-7 h-11 mt-1 ml-2"></image>
						</view>
						<view class="absolute x-100 plr-20 border-box" style="top: 20%">
							<view class="flex-between">
								<view class="fs-16 fw-7">酵岁菌（太岁）</view>
								<view class="opacity-6">
									{{ $c.formatDate(i.start_time) }}-{{ $c.formatDate(i.end_time) }}
								</view>
							</view>
							<GrowInfo :info="i" class="mt-15" :showIcon="false"></GrowInfo>
							<view class="flex-between mt-15">
								<view class="">
									<GrowProcess :num="i.cycle" iconClass="i-10"
										lineStyle="border-top: 2px dashed #A86D16;" />
									<view class="flex-start mt-10">
										<GrowStatus :status="i.is_progress" />
										<view class="flex-start ml-7" @click="page = 2">
											<view class="opacity-6 lh-10">查看培育记录</view>
											<image :src="img('right.webp')" class="w-7 h-11 mt-1 ml-2"></image>
										</view>
									</view>
								</view>
								<image :src="img('btn-sell-s.webp')" class="w-109 h-28" @click="onShowSell(i)">
								</image>
							</view>
						</view>
					</view>
					<view class="h-20"></view>
				</scroll-view>
			</view>
		</view>

		<u-popup :show="showUpload" mode="bottom" bgColor="#120E0A" :closeOnClickOverlay="false" closeable
			@close="showUpload = false">
			<view class="relative title-color p-20 border-box">
				<view class="relative">
					<image :src="img('grow/bg-upload.webp')" class="x-100" mode="widthFix"></image>
					<view class="flex-center h-83 absolute x-100" style="top: 45%;">
						<view class="">
							<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1"
								:maxSize="5 * 1024 * 1024" multiple :maxCount="3" width="79" height="79">
								<image v-if="!fileList1.length" :src="img('junyang/img.webp')" class="upload-0"></image>
								<image v-else :src="img('junyang/blank.webp')" class="i-79"></image>
							</u-upload>
						</view>
					</view>
				</view>
				<image :src="img('btn-submit.webp')" class="w-273 h-44 auto-x mt-39" @click="doSubmit"></image>
			</view>
		</u-popup>

		<u-popup :show="showSell" mode="bottom" bgColor="#120E0A" :closeOnClickOverlay="false" closeable
			@close="showSell = false">
			<view class="relative title-color plr-20 pb-20 border-box text-title fs-12 pt-50">
				<SellInfo />
				<view class="sell-box ptb-22 plr-16 mt-10">
					<view class="flex-start">
						<image :src="img('file.webp')" class="i-19"></image>
						<text class="fs-14 ml-7">出售协议</text>
					</view>
					<view class="mt-10 flex-start">
						<image :src="img('check-' + (agreed ? 1 : 0) + '.webp')" class="i-16 self-start"
							@click="agreed = !agreed"></image>
						<view class="fs-10 flex-1 ml-5">
							我已阅读并同意<text class="underline"
								style="color: #E0B321;">《岁元堂培育(太岁)出售协议》</text>相关条款并确认所提交的培育为本人合法持有，无任何权属纠纷。
						</view>
					</view>
				</view>
				<image :src="img('btn-sell-submit.webp')" class="w-273 h-44 auto-x mt-39" @click="doSubmit"></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import GrowLog from './components/GrowLog.vue'
	import GrowInfo from './components/GrowInfo.vue'
	import GrowStatus from './components/GrowStatus.vue'
	import GrowProcess from './components/GrowProcess.vue'
	import SellInfo from './components/SellInfo.vue'

	export default {
		components: {
			GrowLog,
			GrowInfo,
			GrowStatus,
			GrowProcess,
			SellInfo
		},
		data() {
			return {
				page: 1,
				showUpload: false,
				showSell: false,
				doSubmit: null,
				fileList1: [],
				agreed: false,
				list: [],
				logs: [],
				info: {},
				total: {
					grow: 0,
					over: 0
				},
				grows: [],
				option: {
					series: [{
						type: 'pie',
						radius: ['42%', '90%'],
						label: {
							show: false
						},
						data: [{
								value: 0,
								name: '培育中',
								itemStyle: {
									color: '#d9982d'
								}
							},
							{
								value: 0,
								name: '周期达成',
								itemStyle: {
									color: '#809533'
								}
							},
							{
								value: 5,
								name: '',
								itemStyle: {
									color: '#8EA1BD'
								}
							}
						],
						itemStyle: {
							borderColor: '#120E0A',
							borderWidth: 6
						}
					}]
				},
				activeIndex: 0,
				scrollIntoView: ''
			}
		},
		onLoad() {
			this.getList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {},
		methods: {
			async initEchart() {
				await this.$refs.echartRef.init(this.option);
				// this.setOption()
			},
			setOption() {
				// 执行更新
				this.$refs.echartRef.setOption(this.option);
			},
			changeProject(index) {
				this.activeIndex = index
				this.scrollIntoView = `project-${index}`
				this.getProjectData(this.list[index])
			},
			swiperChange(e) {
				this.activeIndex = e.detail.current
				// const item = this.list[this.activeIndex]
				// 根据当前项目加载数据
				this.getInfo()
			},
			changeCard(index) {
				this.activeIndex = index
			},
			onShowSell(i) {
				this.$c.toast('未满足可售卖条件')
				// this.showSell = true
			},
			async getList() {
				const res = await this.$c.fetch(this.$api.syt.strainList, {
					barcode_id: 0
				})
				if (res && res.length) {
					res.forEach(item => {
						// item.cycle++
						const index = this.list.findIndex(i => i.barcode === item.barcode)
						if (index === -1) {
							item.created_time = item.start_time
							item.over_time = this.addMonths(item.created_time)
							this.list.push(item)
							return
						}
						const info = this.list[index]
						if (info.cycle < item.cycle) {
							item.created_time =
								new Date(info.start_time) < new Date(item.start_time) ?
								info.start_time :
								item.start_time
							item.over_time = this.addMonths(item.created_time)
							this.list[index] = item
						}
					})
					// this.total.grow = this.list.filter(item => item.is_progress === 1).length
					// this.total.over = this.list.filter(item => item.is_progress === 2).length
					this.grows = res
					this.info = this.list[0]
					this.getLog()
					this.total.grow = res.filter(item => item.is_progress === 1).length
					this.total.over = res.filter(item => item.is_progress === 2).length
				
					this.option.series[0].data[0].value = this.total.grow
					this.option.series[0].data[1].value = this.total.over
					this.option.series[0].data[2].value =
					this.total.grow || this.total.over ? 0 : 5
			
					this.$nextTick(() => {
						this.$refs.echartRef.setOption(this.option)
					})
				}
			},
			async getLog() {
				const res = await this.$c.fetch(this.$api.syt.growLog, {
					cultivate_id: this.info.id
				})
				if (res) this.logs = res
			},
			addMonths(dateStr) {
				const date = new Date(dateStr.replace(/-/g, '/'))
				date.setMonth(date.getMonth() + 12)
				const pad = n => String(n).padStart(2, '0')
				return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
			},
			async getInfo() {
				// const res = await this.$c.fetch(this.$api.syt.strainList, {
				// 	barcode_id: this.list?.[this.activeIndex]?.id
				// })
				// if (res && res.length) {
				// 	this.info = res.at(-1)
				// 	this.info.cycle = res.length
				// }
				this.info = this.list[this.activeIndex]
				this.getLog()
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
			async onSubmit() {
				if (this.fileList1.length < 3) return this.$c.toast('请按要求上传照片')
				let picture = this.fileList1.map(item => item.url)
				const res = await this.$c.fetch(this.$api.syt.growUpload, {
					cultivate_id: this.info.id,
					picture: picture
				})
				if (res) {
					this.$c.toast('上传成功')
					this.showUpload = false
					this.fileList1 = []
					this.getLog()
				}
			},
			img(path, root = '/static/suiyuantang/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text-title {
		color: #B88344;
	}

	.text-color {
		color: #E0B321;
	}

	image {
		display: block;
	}

	.status-1 {
		background: linear-gradient(156deg, #d9982d 13%, #a06718 93%);
	}

	.status-2 {
		background: #809533;
	}

	.code {
		width: 179.5px;
		height: 38px;
		background-image: url('/static/suiyuantang/grow/bg-code.webp');
		background-size: 100% 100%;
		font-weight: bold;
		font-size: 14px;
		color: #120E0A;
		flex-shrink: 0;
	}

	.code-0 {
		background-image: url('/static/suiyuantang/grow/bg-code-0.webp');
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