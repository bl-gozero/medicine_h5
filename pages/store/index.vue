<template>
	<view class="page bg-page">
		<view class="fixed top-0 left-0 x-100 bg-page pb-10 title_box" style="z-index: 100;">
			<Title is-blank></Title>
			<view class="flex-between plr-20">
				<view class="flex-start">
					<image src="/static/icon/back.png" class="i-24" @click="$c.goBack()" />
					<text class="fs-18">我的仓库</text>
				</view>
				<image src="/static/store/goExchange.webp" class="w-103 h-32" @click="$c.goto('/pages/store/exchange')">
				</image>
			</view>
			<view class="plr-30 mt-15">
				<view class="flex-start fs-12 text-info nav_box pl-10" style="gap: 5%;">
					<view class="relative" :class="nav == 1 && 'nav_active text-base fw-7'" @click="onNav(1)">已寄存</view>
					<!-- #ifndef MP -->
					<view class="relative w-80 flex-center" :class="nav == 2 && 'nav_active text-base fw-7'"
						@click="onNav(2)">
						<text>发货 - {{ ships[shipIndex]? ships[shipIndex].value : '' }}</text>
						<u-icon name="arrow-down-fill" :color="nav == 2? '#3D3D3D' : '#9F9F9F'" size="8"></u-icon>
						<view v-if="showShipItem" class="ship_box text-info fw-4">
							<view :class="shipIndex == index && 'text-base'" v-for="(item, index) in ships"
								:key="item.id" @click.stop="onShipItem(index)">{{ item.value }}</view>
						</view>
					</view>
					<view v-if="$c.mode()" class="relative" :class="nav == 3 && 'nav_active text-base fw-7'"
						@click="onNav(3)">已赠出</view>
					<view v-if="$c.mode()" class="relative" :class="nav == 4 && 'nav_active text-base fw-7'"
						@click="onNav(4)">已回购</view>
					<!-- #endif -->
				</view>
			</view>
			<view v-if="nav == 1 && storeNavs.length" class="flex-start plr-20 mt-15 fgap-10 sroller-x border-box">
				<view :class="['nation text-nowrap pt-2 pb-4', { 'nation-active': item.id == storeNav.id }]"
					v-for="item in storeNavs" :key="item.id" @click="onStoreNav(item)">
					<view class="nation-name">{{ item.goods_name }}</view>
					<view class="shrink-0">({{ item.count }})</view>
				</view>
			</view>
		</view>
		<view :class="['plr-20', `pt-${top}`]">
			<view v-if="nav == 1" class="ptb-14 plr-12 rounded-12 flex-start bg-white mt-12 relative"
				v-for="item in list" :key="item.id">
				<!-- #ifndef MP -->
				<image :src="$c.checkIcon(item.selected)" class="i-18 self-start"
					@click="item.selected = !item.selected"></image>
				<!-- #endif -->
				<view class="flex-1 ml-8">
					<view class="flex-between">
						<text v-if="item.is_gift && item.is_gift.id == 1"
							class="fs-12 fw-5">转赠账号：{{ item.gitf_account }}</text>
						<text v-else class="fs-12 fw-5">订单号：{{ item.order_number }}</text>
						<text class="fs-12 fw-5"></text>
						<text class="fs-10">已寄存</text>
					</view>
					<view class="flex-between mt-14">
						<image :src="item.picture" class="i-57 rounded-12 mr-10 self-start" mode="aspectFill"></image>
						<view class="flex-1 fs-12 text-info">
							<view class="fw-5 fs-14 text-black u-line-1">{{ item.goods_name }}</view>
							<view class="mt-2">{{ item.goods_sku_name }}</view>
							<view v-if="item.is_gift && item.is_gift.id == 1" class="mt-2">转赠时间：{{ item.gitf_at }}
							</view>
							<view v-else class="">
								<view v-if="item.paying_at" class="mt-2">下单时间：{{ item.paying_at }}</view>
								<view v-if="item.created_at" class="mt-2">存入时间：{{ item.created_at }}</view>
							</view>
						</view>
					</view>
					<view
						v-if="$c.mode() && item.is_buyback && item.is_buyback.id == 1 && item.buyback_status && item.buyback_status.id === 2"
						class="mt-10 flex-start">
						<image src="/static/point/buy.webp" class="w-20 h-19 block"></image>
						<text
							class="text-gold fs-12 ml-5 lh-10">此商品已开启回购，回购数量限制{{ item.min_quantity }}-{{ item.max_quantity }}件</text>
					</view>
				</view>
				<view v-if="item.is_gift && item.is_gift.id == 1" class="gift-tag">他人转赠</view>
				<!-- <view class="exchange-tag">置换商品</view> -->
			</view>
			<view v-if="nav == 2" class="p-12 rounded-12 bg-white mt-12" v-for="(item, index) in list" :key="index"
				@click="$c.goto(`/pages/store/detailForShip?id=${item.id}`)">
				<view class="flex-between">
					<text class="fs-12">发货号：{{ item.order_number }}</text>
					<text
						:class="['fs-10', { 'text-gold': item.status && item.status.id < 3 }]">{{ item.status ? item.status.value : '' }}</text>
				</view>
				<view class="flex-between mt-14" v-for="i in item.details" :key="i.id">
					<image :src="i.picture" class="i-57 rounded-12 mr-10" mode="aspectFill"></image>
					<view class="flex-1 fs-12 text-info">
						<view class="fw-5 fs-14 text-black u-line-1">{{ i.goods_name }}</view>
						<view class="mtb-3">{{ i.goods_sku_name }}</view>
						<view class="h-17"></view>
					</view>
				</view>
				<view class="flex-end" @click.stop>
					<view class="">
						<button v-if="item.status && item.status.id == 2"
							class="btn-list btn-black fs-12 p-0 border-plain flex-center" plain
							@click="onReceive(item)">确认收货</button>
					</view>
				</view>
			</view>
			<view v-if="nav == 3" class="p-12 rounded-12 bg-white mt-12" v-for="(item, index) in list" :key="index"
				@click="item.id && $c.goto(`/pages/store/detailForTransfer?id=${item.id}`)">
				<view class="flex-between">
					<text class="fs-12">赠出账号：{{ item.receive_account }}</text>
					<text class="fs-10">已赠出</text>
				</view>
				<view class="flex-between mt-14" v-for="i in item.info" :key="i.id">
					<image :src="i.picture" class="i-57 rounded-12 mr-10" mode="aspectFill"></image>
					<view class="flex-1 fs-12 text-info">
						<view class="fw-5 fs-14 text-black u-line-1">{{ i.goods_name }}</view>
						<view class="mtb-3">{{ i.goods_sku_name }}</view>
						<view class="">于{{ i.created_at }}赠出</view>
					</view>
				</view>
			</view>
			<view v-if="nav == 4" class="p-12 rounded-12 bg-white mt-12" v-for="(item, index) in list" :key="index"
				@click="item.id && $c.goto(`/pages/store/detailForBuy?id=${item.id}`)">
				<view class="flex-between">
					<text class="fs-12">回购日期：{{ item.buyback_at }}</text>
					<text class="fs-10">已回购</text>
				</view>
				<view class="flex-between mt-14">
					<image :src="item.picture" class="i-57 rounded-12 mr-10" mode="aspectFill"></image>
					<view class="flex-1 fs-12 text-info">
						<view class="fw-5 fs-14 text-black u-line-1">{{ item.goods_name }}</view>
						<view class="mtb-3">{{ item.goods_sku_name }}</view>
						<view class="">回购价格:￥{{ item.buyback_price }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="h-70"></view>
		<!-- #ifndef MP -->
		<view v-if="nav == 1"
			class="total_box fixed x-100 bottom-0 left-0 plr-20 ptb-9 flex-between fs-10 border-box bg-white"
			style="z-index: 10;">
			<view class="">
				<view class="flex-start">
					<image :src="$c.checkIcon(all)" class="i-18" @click="onAll()"></image>
					<text class="ml-10">全选</text>
				</view>
				<view class="fs-10 text-info mt-6 text-center">已选{{ num }}件</view>
			</view>
			<view class="flex-end">
				<button v-if="$c.mode()" class="btn border-plain" plain @click="onShowEvent('buy')">官方回购</button>
				<button v-if="$c.mode()" class="btn border-plain" plain @click="onShowEvent('transfer')">转赠他人</button>
				<button class="btn fw-7 bg-base-change text-white" @click="onShowEvent('ship')">发货</button>
			</view>
		</view>
		<!-- #endif -->

		<u-modal :show="show" title="提示" content='确定要删除？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="show = false" @confirm="onDelete()"></u-modal>

		<!-- 发货 -->
		<u-popup :show="showShip" mode="bottom" :round="20" closeable @close="showShip = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">仓库发货</view>
				<view class="flex-between ptb-30 fs-12" @click="$c.goto('/pages/user/address?from=address')">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>
					<view v-if="address.district" class="flex-1 ml-8 mr-20">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-15 ">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<view v-else class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start"></u-icon>
				</view>
				<view class="h-10 bg-page"></view>
				<view class="mt-20 fw-5">共计{{ num }}件</view>
				<scroll-view scroll-y class="h-170 mt-20">
					<view class="flex-between mb-20" v-for="(i, index) in order" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
						</view>
					</view>
				</scroll-view>
				<button class="btn-submit bg-base mt-40" @click="doSubmit('ship')">确认地址并领取</button>
			</view>
		</u-popup>

		<!-- 转增 -->
		<u-popup :show="showTransfer" mode="bottom" :round="20" :safe-area="false" closeable
			@close="showTransfer = false">
			<view class="popup-fixed pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">转赠他人</view>
				<view class="ptb-20 flex-between border-bottom border-top mt-20">
					<view class="">对方账户</view>
					<u-input v-model="to_account" placeholder="手机号/账号" placeholderClass="fs-14 text-info" border="none"
						class="flex-1 mlr-24"></u-input>
					<!-- <image src="/static/finance/account.webp" class="i-23"
						@click="$c.goto('/pages/group/myGroup?mode=select')"></image> -->
				</view>
				<view :class="isKeyboardShow && 'h-100 sroller-y'">
					<view class="fs-12 p-12 border-box rounded-8 mtb-15 lh-15"
						style="background: #F0ECE1;color: #99935C;">
						<view class="fw-7 flex-start">
							<u-icon name="bell-fill" color="#9D9762" size="14"></u-icon>
							<text class="ml-3">温馨提示</text>
						</view>
						<view class="">仓库内产品可转赠其他用户，转赠后所有权即时转移且不可撤销。请核对受赠人信息，平台仅提供服务，不承担操作失误责任。</view>
					</view>
					<view class="h-10 bg-page"></view>
					<view class="mt-20 fw-5">共计{{ num }}件</view>
					<scroll-view scroll-y class="h-100 mt-20">
						<view class="flex-between mb-20" v-for="(i, index) in order" :key="i.index">
							<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
							<view class="ml-9 flex-1">
								<view class="flex-between">
									<text class="fw-5">{{ i.goods_name }}</text>
								</view>
								<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							</view>
						</view>
					</scroll-view>
					<button class="btn-submit bg-base mt-20" @click="onShowPassword()">填写账号并转赠</button>
				</view>
			</view>
		</u-popup>

		<!-- 回购 -->
		<u-popup :show="showBuy" mode="bottom" :round="20" closeable @close="showBuy = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-18 fw-5 text-center">官方回购</view>
				<view class="mt-30">回购总价：￥{{ buyTotal }}</view>
				<view class="fs-12 p-12 border-box rounded-8 mtb-15 lh-15" style="background: #F0ECE1;color: #99935C;">
					<view class="fw-7 flex-start">
						<u-icon name="bell-fill" color="#9D9762" size="14"></u-icon>
						<text class="ml-3">温馨提示</text>
					</view>
					<view class="">平台提供官方回购服务，用户可按规定将仓库内产品出售给平台以补充库存。回购期结束后，产品价格将上调
						5%–20%；回购期开放时间将根据货物储备量及市场情况灵活调整。到账方式为账户奖励</view>
				</view>
				<view class="h-10 bg-page"></view>
				<view class="mt-20 fw-5">共计{{ num }}件</view>
				<scroll-view scroll-y class="h-140 mt-20">
					<view class="flex-between mb-20" v-for="(i, index) in order" :key="i.index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<view class="mt-10 flex-start">
								<view class="buy_price">￥{{ i.buyback_price }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
				<button class="btn-submit bg-base mt-40" @click="onClose();showPop('rule')">申请回购</button>
			</view>
		</u-popup>

		<payPassword v-model="password" :show.sync="showPassword" @finish="doSubmit('transfer')"></payPassword>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import payPassword from '../../components/payPassword.vue'

	export default {
		components: {
			Title,
			payPassword
		},
		data() {
			return {
				nav: 1,
				showShipItem: false,
				showShip: false,
				shipIndex: 0,
				showTransfer: false,
				showBuy: false,
				ships: [{
						id: 0,
						value: "全  部"
					},
					{
						id: 1,
						value: "待发货"
					},
					{
						id: 2,
						value: "待收货"
					},
					{
						id: 3,
						value: "已收货"
					},
					{
						id: 4,
						value: "已驳回"
					},
				],
				height: 0,
				list: [],
				all: false,
				show: false,
				address_id: null,
				doSubmit: null,
				page: 1,
				status: 'more',
				limit: 10,
				address: {},
				to_account: null,
				isKeyboardShow: false,
				baseHeight: 0,
				showPassword: false,
				password: '',
				storeNavs: [],
				storeNav: { id: 0, goods_id: [] },
				profile: this.$c.profile()
			}
		},
		computed: {
			top() {
				return this.nav == 1 ? 130 : 95
			},
 			num() {
				return this.list
					.filter(item => item.selected === true)
					.reduce((sum, cur) => sum + 1, 0);
			},
			buyTotal() {
				return this.list
					.filter(item => item.selected === true)
					.reduce((sum, cur) => sum + (cur.buyback_price || 0), 0);
			},
			order() {
				return this.list
					.filter(item => item.selected === true)
			}
		},
		onLoad() {
			this.$c.removeStorage('friendAccount')
			this.$c.checkeLogin()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
			
			// 监听键盘
			if (window.visualViewport) {
				this.baseHeight = window.visualViewport.height
				this._onResize = () => {
					const height = window.visualViewport.height
					this.isKeyboardShow = height < this.baseHeight - 100
				}
				window.visualViewport.addEventListener('resize', this._onResize)
			}
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if (address) this.address = address
			const account = this.$c.getStorage('friendAccount')
			if (account.account) this.to_account = account.account
			this.init()
		},
		onUnload() {
			window.visualViewport?.removeEventListener('resize', this._onResize)
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async storeCount() {
				const res = await this.$c.fetch(this.$api.goods.storeSelfCount)
				if(res) {		
					const firstTwo = res.slice(0, 2)
					const others = res.slice(2)
					this.storeNavs = [
					  {
					    id: 0,
					    goods_name: '全部',
					    goods_id: [],
					    count: res.reduce((sum, item) => sum + item.count, 0)
					  },
					  ...firstTwo.map(item => ({
					    ...item,
						id: item.goods_id,
					    goods_id: [item.goods_id]
					  })),
					  ...(others.length
					    ? [{
					        id: -1,
					        goods_name: '其他',
					        goods_id: others.map(item => item.goods_id),
					        count: others.reduce((sum, item) => sum + item.count, 0)
					      }]
					    : [])
					]
					const nav = this.storeNavs.some(item => item.id == this.storeNav)
					 if (!nav) this.storeNav = this.storeNavs[0]
				}
			},
			onStoreNav(item) {
				if (this.status == 'load') return
				this.storeNav = item
				this.init(0)
			},
			onAll(v = -1) {
				const value = v !== -1 ? v : !this.all
				this.all = value
				this.list.forEach(item => {
					item.selected = value
				});
			},
			onShowPassword() {
				this.password = ''
				this.showPassword = true
			},
			onNav(n) {
				if (this.status == 'load') return
				if (n == 2) {
					if (this.nav != n) {
						this.onShipItem(0)
					} else {
						this.showShipItem = !this.showShipItem
					}
				} else if (this.nav != n) {
					this.showShipItem = false
					this.nav = n
					this.init()
				}
			},
			onClose() {
				this.showBuy = false
				this.showShip = false
				this.showTransfer = false
				this.showPassword = false
			},
			onShipItem(n) {
				if (this.status == 'load') return
				if (this.nav == 2 && this.shipIndex == n) {
					this.showShipItem = false
					return
				}
				this.shipIndex = n
				this.nav = 2
				this.showShipItem = false
				this.init()
			},
			onShowEvent(e) {
				this.onClose()
				if (!this.num) {
					this.$c.toast('请选择产品')
					return
				}
				if (e == 'ship') this.showShip = true
				if (e == 'transfer') this.showTransfer = true
				if (e == 'buy') {
					const res = this.validateList(this.order)
					if (res !== true) return this.showPop('reset', res)
					this.showBuy = true
				}
			},
			validateList(list) {
				const noBuy = list.find(i => i?.is_buyback?.id !== 1)
				if (noBuy) return '暂未开启回购，请回购期进行尝' // return `${noBuy.goods_name}(${noBuy.goods_sku_name})不可回购`

				const map = {};
				list.forEach(item => {
					const id = item.goods_sku_id || 0
					map[id] = map[id] ? {
						...map[id],
						count: map[id].count + 1
					} : {
						...item,
						count: 1
					}
				});
				const goods = Object.values(map)
				const errors = [];
				goods.forEach(item => {
					if (item.count < item.min_quantity) {
						errors.push(
							`${item.goods_name}(${item.goods_sku_name})至少回购 ${item.min_quantity} 件 ，已选 ${item.count} 件`
						);
					}
					if (item.count > item.max_quantity) {
						errors.push(
							`${item.goods_name}(${item.goods_sku_name})至多回购 ${item.max_quantity} 件 ，已选 ${item.count} 件`
						);
					}
				});
				if (errors.length === 0) return true;
				return errors[0];
			},
			async init(count = 1) {
				if (this.status == 'load') return
				this.status = 'more'
				this.list = []
				this.page = 1
				this.onAll(false)
				if (count && this.nav == 1) await this.storeCount()
				this.getList()
			},
			async getList() {
				if (this.status != 'more') return
				this.status = 'load'
				const api = [this.$api.goods.storeList, this.$api.goods.storeShipList, this.$api.goods
					.storeTransferList, this.$api.goods.storeBuyList
				][this.nav - 1]
				if (api) {
					const res = await this.$c.fetch(api, {
						page: this.page,
						limit: this.limit,
						search: {
							status: this.shipIndex,
							goods_id: this.nav == 1 ? this.storeNav.goods_id : null
						}
					})
					if (res) {
						res.map(item => {
							item.selected = false
						})
						this.list = [...this.list, ...res]
						this.status = res.length >= this.limit ? 'more' : 'end'
						this.page++
					}
					this.status = this.status == 'end' ? this.status : 'more'
				} else {
					this.status = 'more'
				}
			},
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if (res) this.address = res.length > 0 ? res[0] : {}
			},
			onReceive(item) {
				this.$confirm('确定该订单已收货？')
					.then(() => {
						this.doSubmit('receive', item)
					})
			},
			async onSubmit(mode, order = null) {
				this.onClose()
				if (mode == 'transfer') {
					if (!this.order.length) {
						this.$c.toast('请选择产品')
						return
					}
					if (!this.to_account) {
						this.$c.toast('请填写转增账号')
						return
					}
					const ids = this.order.map(item => item.id)
					const res = await this.$c.fetch(this.$api.goods.storeTransfer, {
						id: ids,
						to_account: this.to_account + '',
						payment_password: this.password
					})
					if (res) {
						this.$know({
							img: "/static/point/tranfer_1.webp",
							title: "转赠成功",
							text: {
								text: `已将指定产品转赠给<br />对方账号：${this.to_account}`,
								class: "text-info"
							}
						})
						this.init()
					}
				}
				if (mode == 'ship') {
					if (!this.order.length) {
						this.$c.toast('请选择产品')
						return
					}
					if (!this.address) {
						this.$c.toast('请填写转增账号')
						return
					}
					const ids = this.order.map(item => item.id)
					const res = await this.$c.fetch(this.$api.goods.storeShip, {
						warehouse_id: ids,
						address_id: this.address.id
					})
					if (res) {
						this.$c.toast('提交成功，请等待发货')
						this.init()
					}
				}
				if (mode == 'receive') {
					if (!order) return this.$c.toast('请选择产品')
					const res = await this.$c.fetch(this.$api.goods.storeReceive, {
						id: order.id
					})
					if (res) {
						this.$c.toast('操作成功')
						this.init()
					}
				}
				if (mode == 'buy') {
					if (!this.order) return this.$c.toast('请选择产品')
					const ids = this.order.map(item => item.id)
					const total = this.buyTotal
					this.$api.goods.storeBuy({
						id: ids
					}, {
						loading: true,
						showErr: false
					}).then(res => {
						this.init()
						this.showPop('success', `本次回购总金额元${total}，<br />已到账，请查看账户奖励。`)
					}).catch(err => {
						if (err.message == '有商品本期回购已达上线') {
							this.showPop('finished')
						} else {
							this.$c.toast(err.message || '回购失败')
						}
					})
				}
			},
			showPop(mode = null, text = '') {
				if (mode == 'end') {
					// 已结束
					this.$know({
						img: "/static/know/clock.webp",
						title: "已结束",
						text: "本期回购已结束，<br/>请等待下一期回购开放",
					})
				} else if (mode == 'finished') {
					// 已参加
					this.$know({
						img: "/static/know/time.webp",
						title: "已参与",
						text: "您已参与本周期回购，<br />请等待下一周期更高价格回购，<br />不容错过！",
					})
				} else if (mode == 'reset') {
					// 重新选择
					this.$know({
						bg: "background: linear-gradient(180deg, #FFEFCE 3%, #FFFFFF 49%);",
						img: "/static/know/warn.webp",
						title: "回购提醒",
						text: text,
						buttons: [{
							text: '重新选择',
							class: 'bg-base bold fs-16 text-white w-234 h-51'
						}]
					})
				} else if (mode == 'rule') {
					// 确认
					this.$know({
						bg: 'background: linear-gradient(180deg, #FFEFCE 3%, #FFFFFF 49%);',
						img: "/static/know/ring.webp",
						title: "回购提醒",
						text: {
							text: "1、平台数据显示，未来几天产品价格预计将上涨约5%-20%！<br />2、在同一个回购周期内，每位用户只能发起一次回购交易，请谨慎操作！",
							class: "text-left"
						},
						buttons: [{
								text: '我已确认',
								class: 'bold fs-16 w-135 h-51'
							},
							{
								text: '暂时取消',
								class: 'bold fs-16 w-135 h-51 bg-base text-white'
							}
						]
					}).then(i => {
						i === 0 && this.doSubmit('buy')
					})
				} else if (mode == 'success') {
					this.$know({
						img: "/static/point/tranfer_1.webp",
						title: "回购成功",
						text: text,
						buttons: [{
								text: '账户奖励',
								class: 'bold fs-16 w-135 h-51'
							},
							{
								text: '已回购列表',
								class: 'bold fs-16 w-135 h-51 bg-base text-white'
							}
						]
					}).then(i => {
						i === 0 && this.$c.goto('/pages/finance/list')
						i === 1 && this.onNav(4)
					})
				}
			},
			async run10(orderId, ctx) {
				const limit = 10; // 写死并发 10
				const total = 10; // 写死任务数量 10
				const results = new Array(total);

				let index = 0;

				async function worker() {
					while (true) {
						const cur = index++;
						if (cur >= total) break;

						try {
							results[cur] = await ctx.$c.fetch(ctx.$api.goods.storeBuy, {
								id: orderId
							});
						} catch (e) {
							results[cur] = {
								__error: true,
								error: e
							};
						}
					}
				}

				// 创建 10 个 worker
				const workers = Array.from({
					length: limit
				}, () => worker());

				await Promise.all(workers);
				return results;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav_box>view {
		// margin-right: 30px;
	}

	.ship_box {
		position: absolute;
		z-index: 100;
		left: -10%;
		bottom: 0;
		margin: 0 auto;
		transform: translateY(105%);
		width: 120%;
		background: #fff;
		text-align: center;
		border-radius: 4px;
		padding-bottom: 7px;
		transition: all 0.3s ease;
		box-shadow:
			0px 2px 6px rgba(0, 0, 0, 0.15),
			/* 下方阴影 */
			2px 0px 6px rgba(0, 0, 0, 0.1),
			/* 右侧阴影 */
			-2px 0px 6px rgba(0, 0, 0, 0.1);
		/* 左侧阴影 */
	}

	.ship_box>view {
		padding-top: 7px;
	}

	.btn {
		width: 82px;
		height: 35px;
		margin-left: 3px;
	}

	.buy_price {
		height: 25px;
		line-height: 25px;
		padding: 0 11px 0 27px;
		font-size: 16px;
		font-weight: 700;
		background: #FFF3D7;
		color: #723E02;
		border-radius: 999px;
		position: relative;

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 27px;
			height: 25px;
			background-image: url('/static/point/buy.webp');
			background-size: 100% 100%;
		}
	}

	.btn-list {
		width: 65px;
		height: 26px;
		margin-left: 5px;
		border-radius: 999px;
	}

	.gift-tag {
		background: linear-gradient(270deg, #00B578 0%, #41EBB2 100%);
		border-radius: 5px 0px 0px 5px;
		font-size: 13px;
		color: #FFFFFF;
		font-weight: bold;
		padding: 2px 5px;
		position: absolute;
		top: 78px;
		right: -3px;
	}

	.gift-tag::after {
		content: '';
		width: 0;
		height: 0;
		border-left: 3px solid #007E54;
		border-bottom: 3px solid transparent;
		position: absolute;
		right: .5px;
		top: 100%;
	}

	.exchange-tag {
		background: linear-gradient(270deg, #1d409f 0%, #829eeb 100%);
		border-radius: 5px 0px 0px 5px;
		font-size: 13px;
		color: #FFFFFF;
		font-weight: bold;
		padding: 2px 5px;
		position: absolute;
		top: 78px;
		right: -3px;
	}

	.exchange-tag::after {
		content: '';
		width: 0;
		height: 0;
		border-left: 3px solid #0B1F57;
		border-bottom: 3px solid transparent;
		position: absolute;
		right: .5px;
		top: 100%;
	}
	
	.nation {
		background: #E2E2E2;
		border-radius: 4px;
		font-size: 12px;
		position: relative;
		box-sizing: border-box;
		padding: 0 8px;
		border: 1px solid #E2E2E2;
		color: #575D62;
		display:flex;
		align-items:center;
		// min-width: 0;
		// flex: 0 0 calc((100% - 30px) / 4);
		// width: calc((100% - 30px) / 4);
	}
	.nation-name {
	    overflow:hidden;
	    white-space:nowrap;
	    text-overflow:ellipsis;
	    min-width:0;
	}
	.nation-active {
		border: 1px solid #E8380D;
		background: #FFDCD3;
		color: #E8380D;
		font-weight: bold;
	}
</style>