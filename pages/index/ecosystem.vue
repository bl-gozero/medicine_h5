<template>
	<view>
		<view v-if="page == 1" class="">
			<view class="relative">
				<image :src="img('top.webp')" class="x-100" mode="widthFix"></image>
				<view class="absolute left-0 top-0">
					<Title onlyBack bgColor="transparent" />
				</view>
				<view class="absolute left-0 x-100" style="top: 79%;height: 400rpx;z-index: 100;">
					<u-swiper :list="shops" keyName="img" :current="joinIndex - 1" height="400rpx" :autoplay="false" nextMargin="120"
						bgColor="transparent" imgMode="widthFix" @click="onJoin" @change="onChange"></u-swiper>
				</view>
			</view>
			<image :src="img(imgIndex + '.webp')" class="x-100" mode="widthFix"></image>
		</view>
		<view v-if="page == 2" class="">
			<Title :title="shop.name" bgColor="#fff" fixed isBack @back="page = 1" />
			<image :src="img('detail-' + joinIndex + '.webp')" class="x-100" mode="widthFix"></image>
			<image :src="img('btns-2.webp')" class="join-btn" mode="widthFix" @click="onShowship()"></image>
			<image :src="btnImg()" class="join-btn" mode="widthFix" @click="onShowship()"></image>
		</view>
		<view v-if="page == 3" class="page bg">
			<Title title="报名申请" bgColor="transparent" isBack @back="page = 2" />
			<view class="flex-center">
				<image v-if="shop.joined == 3" :src="'/static/ecosystem/step-1.webp'" class="step"></image>
				<image v-else :src="'/static/ecosystem/step-' + shop.joined + '.webp'" class="step"></image>
			</view>
			<view class="plr-20 mt-28">
				<view class="fw-7">使用以下商品进行兑换</view>
				<view class="mt-10 rounded-14 plr-15 ptb-12 bg-white">
					<view class="flex-between fgap-10 mb-10" v-for="i in goods" :key="i.goods_sku_id"  @click="skuID = i.goods_sku_id">
						<image v-if="i.goods_sku_id" :src="$c.checkIcon(skuID == i.goods_sku_id)" class="i-18"></image>
						<view class="flex-1 flex-between fgap-8">
							<image :src="i.picture" class="i-60 rounded-12 bg-page" mode="aspectFill"></image>
							<view class="flex-1">
								<view class="fs-14 fw-5 u-line-1">{{ i.goods_name }}</view>
								<view class="fs-12 text-info">{{ i.goods_sku_name }}</view>
								<view class="fs-12 text-info text-right">×{{ i.quantity }}</view>
							</view>
						</view>
					</view>
					<view class="text-gold fs-12">*请保持有充足的库存！库存不足将被驳回！</view>
				</view>
				<view class="fw-7 mt-20">{{ joinIndex > 2 ? '展馆地址及报名信息' : '收货地址及报名信息' }}</view>
				<view v-if="joinIndex > 2" class="mt-14 rounded-14 plr-16 ptb-14 bg-white flex-between fgap-10">
					<view class="">场地面积(㎡)：</view>
					<u-input v-model="area" type="number" placeholder="请填写场地面积" placeholderClass="fs-14" border="none" 
						inputAlign="right" :formatter="priceFormatter"></u-input>
				</view>
				<view class="mt-14 rounded-14 plr-16 pt-10 pb-18 bg-white">
					<view v-if="joinIndex > 2" class="fs-14">展馆地址：</view>
					<view class="flex-between fs-12 mt-10" @click="onAddress()">
						<image src="/static/goods/place.png" class="w-12 h-14 self-start mt-3"></image>
						<view v-if="address.address" class="flex-1 ml-8 mr-20">
							<view class="fw-5">{{ address.district + address.address }}</view>
							<view class="mt-10" style="color: rgba(61, 61, 61, 0.8);">
								<text class="">{{ address.name }}</text>
								<text class="ml-20">{{ address.phone }}</text>
							</view>
						</view>
						<view v-else class="flex-1 ml-8 mr-20 text-info mb-20">点我添加地址</view>
						<u-icon name="arrow-right" size="14" color="#F07328" class="self-start mt-3"></u-icon>
					</view>
					<view class="fs-12 text-gold mt-14">*请填写并确认<text
							class="fw-7">展馆详细地址及联系方式</text>等，后续平台会为店铺进行依序发货。</view>
				</view>
				<view v-if="joinIndex > 2" class="">
					<view class="fw-7 mt-20">照片信息</view>
					<view class="mt-14 rounded-14 plr-16 pt-17 pb-13 bg-white">
						<view class="">
							<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" :maxSize="5 * 1024 * 1024"
								multiple :maxCount="4" width="53" height="53"></u-upload>
						</view>
						<view class="fs-12 text-gold mt-14">*照片需要4张（单张不大于5M）包分别含：入户、工作区、洽谈区 、室内墙面广告位。</view>
					</view>
				</view>
				<view class="h-100"></view>
				<view class="fixed bottom-20 x-100 border-box left-0" style="z-index: 10;">
					<button v-if="shop.joined == 1" class="btn fw-7 w-247 h-47 text-white" style="background: #868686;">资料审核中</button>
					<button v-else-if="shop.joined == 2"  class="btn fw-7 w-247 h-47 text-white bg-base" @click="onCheck()">查看物流</button>
					<button v-else class="btn fw-7 w-247 h-47 text-white bg-base" @click="doSubmit">报名提交</button>
				</view>
			</view>
		</view>
		<!-- <view v-if="page == 4" class="page bg-page">
			<Title title="添加地址" :fixed="true" isBack @back="page = 3" />
			<view class="plr-20 mt-10">
				<view class="bg-white rounded-8 plr-14">
					<view class="ptb-18 border-bottom flex-between">
						<text class="mr-20">联系人</text>
						<u-input v-model="address.name" placeholder="请填写联系人姓名" placeholderClass="text-info fs-14"
							inputAlign="right" border="none"></u-input>
					</view>
					<view class="ptb-18 flex-between">
						<text class="mr-20">手机号码</text>
						<u-input v-model="address.phone" placeholder="请填写联系人手机号码" placeholderClass="text-info fs-14"
							inputAlign="right" border="none"></u-input>
					</view>
				</view>
				<view class="bg-white rounded-8 plr-14 mt-11">
					<view class="ptb-18 border-bottom flex-between">
						<text class="mr-20">省市区</text>
						<RegionPicker v-model="address.district" placeholder="请填写省市区街道"></RegionPicker>
					</view>
					<view class="ptb-18 flex-between">
						<text class="mr-20">详细地址</text>
						<u-input v-model="address.address" placeholder="请输入详细地址" placeholderClass="text-info fs-14"
							inputAlign="right" border="none"></u-input>
					</view>
				</view>
			</view>
			<view class="mt-40">
				<button class="bg-base fw-7 fs-14 text-white w-224 h-43 flex-center rounded-x"
					@click="page = 3">确定</button>
			</view>
		</view> -->
		<u-popup :show="showFail" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @close="showFail = false">
			<view class="w-308 rounded-20 plr-14 border-box pb-20"
				style="background: linear-gradient(180deg, #FFEFCE 3%, #FFFFFF 49%);">
				<view class="flex-center" style="margin-top: -50px;">
					<image src="/static/ecosystem/fail.webp" style="width: 100px;height: 100px;" />
				</view>
				<view class="fs-18 fw-7 text-center text-danger">审核结果</view>
				<view class="text-center fs-14 mt-10" style="line-height: 20px;">很抱歉！您的申请未通过，请您仔细阅读以下原因，再重新申请</view>
				<view class="rounded-8 p-10 fs-12 mt-25" style="background: #F7F2E8;color: #817968;">
					<view class="fw-7">未通过原因：</view>
					<scroll-view class="h-82 mt-10" scroll-y>
						<view class="lh-15">{{ reason }}</view>
					</scroll-view>
				</view>
				<view class="flex-center fgap-10 mt-20">
					<view class="">
						<button class="w-239 h-51 bg-base text-white fw-7 fs-16 btn" @click="onReset()">重新申请</button>
					</view>
				</view>
			</view>
		</u-popup>
		<u-back-top v-if="page < 3" :scroll-top="scrollTop"></u-back-top>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
import toast from '../../uni_modules/uview-ui/libs/config/props/toast';
	import RegionPicker from './components/RegionPicker.vue'
	export default {
		components: {
			Title,
			RegionPicker
		},
		data() {
			return {
				page: 1,
				imgIndex: 1,
				scrollTop: 0,
				joinIndex: 0,
				joined: false,
				showShip: false,
				goods: [],
				doSubmit: null,
				order: {
					id: 106,
					mode: 1,
					number: 435243434
				},
				fileList1: [],
				address: {},
				area: null,
				showFail: false,
				shops: [
					{ id: 1, value: 2, name: '加入岁元堂云店', joined: 0, info: {}, img: this.img('join-0-1.webp'), },
					{ id: 2, value: 5, name: '加入岁元堂门店', joined: 0, info: {}, img: this.img('join-0-2.webp'), },
					{ id: 3, value: 4, name: '加入A馆', joined: 0, info: {}, img: this.img('join-0-3.webp'), },
					{ id: 4, value: 3, name: '加入B馆', joined: 0, info: {}, img: this.img('join-0-4.webp'), },
				],
				shop: {},
				reason: '',
				skuID: null
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.$c.removeStorage('address')
			this.getInfo()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if (address) this.address = address
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			btnImg() {
				if (this.shop.joined == 0) return this.img(`btn-${this.joinIndex}.webp`)
				return status = this.shop.joined == 3 ? this.img(`btns-1.webp`) : this.img(`btns-${this.shop.joined}.webp`)
			},
			async onJoin(e) {
				this.joinIndex = e + 1
				this.shop = this.shops.find(i => i.id == e + 1)
				if (!this.shop) return
				this.page = 2
			},
			onChange(e) {
				this.imgIndex = e.current < 2 ? 1 : e.current
			},
			onShowship() {
				this.page = 3
				this.onDetail()
			},
			async getGoods() {
				const res = await this.$c.fetch(this.$api.user.shopRegisterGoods, {
					shops_id: this.shop.value
				})
				if (res && res.length) {
					this.goods = res
					this.skuID = this.goods[0].goods_sku_id
				}
			},
			async getInfo() {
			   const res = await this.$c.fetch(this.$api.user.shopRegisterStatus)
			   if (res) {
				   res.forEach(item => {
					   let shop = this.shops.find(shop => shop.value == item.shops_id)
					   if (shop) {
						   shop.joined = item.verify?.id || 0
						   const status = shop.joined == 3 ? 1 : shop.joined
						   shop.img = this.img(`join-${status}-${shop.id}.webp`) // 轮播按钮刷新
					   }
				   })
			   }
			},
			async onDetail() {
				const res = await this.$c.fetch(this.$api.user.shopRegisterDetail, {
					shops_id: this.shop.value
				})
				if (res && res.id) {
					this.goods = [{ goods_name: res.goods_name, goods_sku_name: res.goods_sku_name, quantity: res.quantity, picture: res.goods_sku_picture }]
					this.address = { name: res.name, phone: res.phone, address: res.address, district: ''  }
					this.area = res.site_area
					this.fileList1 = (res.picture || []).map(url => ({
					  url
					}))
					if (res.verify?.id) {
						const shop = this.shops.find(i => i.id == this.shop.id)
						if (shop) {
							shop.joined = res.verify?.id
							const status = shop.joined == 3 ? 1 : shop.joined
							shop.img = this.img(`join-${status}-${shop.id}.webp`)
							shop.info = res
						}
						if (res.verify?.id == 3) {
							this.reason = res.remark
							if (this.page == 3) this.showFail = true
						}
					}
					this.shop = this.shops.find(i => i.id == this.shop.id)
				} else {
					this.onReset()
					await this.getGoods()
				}
			},
			async addressList() {
				// const res = await this.$c.fetch(this.$api.user.addressList)
				// if (res) this.address = res.length > 0 ? res[0] : {}
				this.address = {}
			},
			onAddress() {
				// this.page = 4
				this.$c.goto('/pages/user/address?from=address')
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
					// console.log('文件信息：', lists[i])
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
						console.error('上传失败：', e)
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
							console.log('upload result：', res)
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
								const result = typeof res.data === 'string'
									? JSON.parse(res.data)
									: res.data
			
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
							console.error('upload fail：', err)
							reject(new Error('网络上传失败'))
						}
					})
				})
			},
			async onSubmit() {
				if (!this.skuID) return this.$c.toast('请选择兑换商品')
				if (!this.address.id) return this.$c.toast('请选择收货地址')
				let picture = []
				if (this.joinIndex > 2) {
					if (!this.area) return this.$c.toast('请填写场地面积')
					if (this.fileList1.length < 4) return this.$c.toast('请补充照片信息')
					picture = this.fileList1.map(item => item.url)
				}
				const res = await this.$c.fetch(this.$api.user.shopRegister, {
					address_id: this.address.id,
					shops_id: this.shop.value,
					site_area: parseFloat(this.area || 0),
					picture: picture,
					goods_sku_id: this.skuID
				})
				if (res) {
					this.$c.toast('资料提交成功，请等待审核')
					this.getInfo()
					this.onDetail()
				}
			},
			onReset() {
				this.showFail = false
				this.area = null
				this.fileList1 = []
				this.addressList()
				this.getGoods()
			},
			onCheck() {
				const id = this.shop?.info?.warehouse_mailing_id
				if (!id) return 
				this.$c.goto(`/pages/store/detailForShip?id=${id}`)
			},
			priceFormatter(value) {
				if (!value) return '';
				let match = value.toString().match(/^\d*(\.?\d{0,2})?/);
				return match ? match[0] : '';
			},
			img(path, root = '/static/ecosystem/') {
				if (!/^(https?:)?\/\//.test(path)) {
					path = root + path
				}
				return this.$c.img(path, 0)
			},
		}
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}

	.bg {
		background: linear-gradient(180deg, #ffdfa8 0%, #ffffff00 218px, #F8F8F8 250px, #F8F8F8 100%);
	}

	.step {
		width: 303px;
		height: 39px;
	}
	
	.join-btn {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		margin: 0 auto;
	}
</style>