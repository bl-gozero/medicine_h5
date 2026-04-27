<template>
	<view class="page flex-col bg">
		<view class="title_box pb-15 plr-20 pw-100 border-box" :class="'pt-' + $c.barHeight()">
			<view class="flex-center">
				<!-- #ifndef MP -->
				<image :src="$c.img('/static/common/logo.gif')" class="w-73 h-32 mr-11"></image>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<image src="/static/common/logo_mall_name.webp" class="w-100 h-25"></image>
				<!-- #endif -->
			</view>
			<!-- #ifndef MP -->
			<view class="flex-end fgap-8">
				<view class="w-192">
					<u-search v-model="name" placeholder="输入药品名称" :searchIconColor="$c.baseColor()"
						:placeholderColor="$c.baseColor()" bgColor="#fff" :showAction="false"></u-search>
				</view>
				<text class="fs-14 lh-14 fw-7 text-white ml-8" @click="onSearch()">搜索</text>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<view class="flex-between fgap-8 mt-15 bg-white rounded-x pr-20 ptb-3">
				<view class="flex-1">
					<u-search v-model="name" placeholder="输入药品名称" searchIconColor="#3D3D3D"
						placeholderColor="#3D3D3D" bgColor="#fff" :showAction="false"></u-search>
				</view>
				<text class="fs-14 lh-14 fw-7 text-base ml-8" @click="onSearch()">搜索</text>
			</view>
			<!-- #endif -->
		</view>
		<!-- #ifndef MP -->
		<view :class="'h-' + height"></view>
		<!-- #endif -->
		
		<view class="plr-20">
			<!-- Banner -->
			<view class="h-105">
				<u-swiper :list="banner" keyName="src" :height="105"></u-swiper>
			</view>	
			
			<!-- memu -->
			<!-- #ifdef MP -->
			<view v-if="nationed" class="plr-15 pt-10 pb-20 rounded-14 mt-15" style="background: linear-gradient(180deg, #FEC86A 0%, #FFFFFF 49%);">
				<view class="flex-between">
					<view class="flex-start" v-for="(item,index) in good" :key="index">
						<image src="/static/index/check.png" class="i-12"></image>
						<text class="ml-3 fs-12 lh-12" style="color: #9B682F;">{{ item }}</text>
					</view>
				</view>
				<view class="flex-between mt-20">
					<view class="text-center" v-for="item in nation" :key="item.id" @click="$c.goto('/pages/goods/category?goods_nation_id=' + item.id)">
						<image :src="$c.formatImgUrl(item.flag)" class="i-45 auto-x block"></image>
						<view class="fs-11 mt-8 lh-10">{{ item.name }}商品</view>
					</view>
					<view class="text-center" v-for="item in menus" :key="item.id" @click="$c.goto(item.url)">
						<image :src="item.icon" class="i-45 auto-x block"></image>
						<view class="fs-11 mt-8 lh-10">{{ item.name }}</view>
					</view>
				</view>
			</view>
			
			<!-- point -->
			<view v-if="pointList.length" class="relative mt-10">
				<image src="/static/mp/index/point_box.webp" class="pw-100 block" mode="widthFix"></image>
				<view class="absolute pw-22 ph-18 top-10 right-0" @click="$c.goto('/pages/point/index')"></view>
				<view class="absolute pw-100 flex-between plr-17 border-box" style="top: 29%;">
					<view class="" v-for="(item, index) in pointList" :key="item.id"
						@click="$c.goto(`/pages/point/goodsDetail?id=${item.id}`)">
						<view v-if="index < 4" class="w-70">
							<view class="bg-white rounded-8 i-70">
								<image :src="item.picture" class="i-70 rounded-8" mode="aspectFill"></image>
							</view>
							<view class="fs-10 text-center mt-7 u-line-1">{{ item.name }}</view>
							<view class="flex-center">
								<view class="flex-start u-line-1">
									<image src="/static/icon/coin.webp" class="i-8 mr-2"></image>
									<text class="text-base fs-10 fw-5">{{ item.price }}积分</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- #endif -->
		</view>
		
		<view class="flex-1 mt-14 roundedTop-20 pt-15 plr-20 pb-60 border-box list_bg">
			<!-- #ifndef MP -->
			<view class="relative mb-30">
				<image src="/static/index/point_box.webp" class="pw-100" mode="widthFix"></image>
				<view class="absolute pw-100 top-0 left-0">
					<PlayImg path="indexpoint/1" :interval="40" :length="51" />
				</view>
				<view class="absolute ph-19 pw-50" style="top: 3%;right: 2%" @click="$c.goto('/pages/index/task')">
				</view>
				<view class="absolute left-0 right-0 bottom-0 flex-between plr-14 border-box" style="top: 28%">
					<view class="self-start" v-for="(item, index) in pointList" :key="item.id"
						@click="$c.goto(`/pages/point/goodsDetail?id=${item.id}`)">
						<view v-if="index < 3" class="w-70">
							<view class="bg-white rounded-8 i-70">
								<image :src="item.picture" class="i-70 rounded-8" mode="aspectFill"></image>
							</view>
							<view class="fs-10 text-center mt-7 u-line-1">{{ item.name }}</view>
							<view class="flex-center">
								<view class="flex-start u-line-1">
									<image src="/static/icon/point.webp" class="i-9 mr-2"></image>
									<text class="text-base fs-10">{{ item.price }}积分</text>
								</view>
							</view>
						</view>
					</view>
					<view class="self-start" @click="$c.goto('/pages/point/index')">
						<view class="bg-white rounded-8 i-70 text-center">
							<image src="/static/index/poin_more.webp" class="w-46 h-49"></image>
							<view class="text-base fs-12 lh-10">更多好礼</view>
						</view>
						<view class="bg-white ptb-9 plr-5 rounded-8 mt-6 fs-10" style="color: #173F41;">进入积分商城</view>
					</view>
				</view>
			</view>
			<view v-if="place" class="flex-start mb-25">
				<image src="/static/index/location.png" class="w-15 h-17"></image>
				<view class="ml-9 mr-4 fw-5">收货:{{ place }}</view>
				<u-icon name="play-right-fill" color="#3D3D3D" size="16"></u-icon>
			</view>
			<view class="flex-between">
				<view class="flex-start" v-for="(item,index) in good" :key="index">
					<image src="/static/index/check.png" class="i-12"></image>
					<text class="ml-3 fs-12 lh-12" style="color: #387175;">{{ item }}</text>
				</view>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP -->
			<image src="/static/mp/index/title.webp" class="pw-100 maxh-30" mode="widthFix"></image>
			<!-- #endif -->
			<view class="flex-between flex-wrap" style="gap: 10px;">
				<view class="mt-10 bg-white rounded-12" style="width: calc((100% - 10px) / 2);"
					v-for="(item,index) in list" :key="item.id" @click="$c.goto('/pages/goods/detail?id=' + item.id)">
					<view class="img-box flex-center">
						<image :src="item.picture" class="pw-100 ph-100 roundedTop-12 block" lazy-load
							mode="aspectFill"></image>
					</view>
					<view class="p-10 border-box">
						<text class="u-line-1 fs-14 fw-5">{{ item.name }}</text>
						<view class="flex-between mt-18">
							<view class="goods_price_box plr-4 flex-center">
								<view v-if="level > 2" class="pw-100">
									<text class="text-danger fs-10 fw-7">￥</text>
									<text class="text-danger fw-7">{{ item.vip_price }}</text>
									<text class="ml-4 text-base fs-10 fw-4 line-through">￥{{ item.price }}</text>
								</view>
								<view v-else class="pw-100">
									<text class="text-base fs-10 fw-7">￥</text>
									<text class="text-base fw-7">{{ item.price }}</text>
									<text class="ml-4 text-danger fs-10 fw-4 line-through">￥{{ item.vip_price }}</text>
								</view>
							</view>
							<view class="goods_cart"></view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifndef MP -->
		<view class="fixed right-0 bottom-75 w-56 h-69">
			<image src="/static/index/cs.png" class="w-56 h-69" @click="$c.goto('/pages/index/web')"></image>
		</view>
		<!-- #endif -->
		<TabBar />
		
		<!-- video -->
		<u-popup :show="showWine" mode="center" bgColor="transparent"
			overlayStyle="background: 'rgba(0, 0, 0, 0.6)'" @close="showWine == false">
			<view class="text-center vw-100 relative">
				<view class="" @click="$c.goto('/pages/activity/video/index')">
					<PlayImg path="index_video/1/1" :interval="40" :length="25" :loop="false" path2="index_video/2/2"
						:interval2="40" :length2="50" :start2="25" type="webp" />
				</view>
				<image v-if="showClose" src="/static/icon/close.webp" class="i-52 mt-17 block auto-x" @click="onClose('wine')"></image>	
			</view>
		</u-popup>
		
		<!-- new -->
		<u-popup :show="!showWine && showNew" mode="center" bgColor="transparent" overlayStyle="background: 'rgba(0, 0, 0, 0.6)'"
			:closeOnClickOverlay="false" @close="showNew == false">
			<view class="text-center vw-100 relative">
				<PlayImg path="index_new/1/1" :interval="40" :length="25" :loop="false" path2="index_new/2/1"
					:interval2="40" :length2="50" :start2="25" type="webp" />
				<view class="absolute left-0 right-0 auto-x pw-55 ph-9" style="bottom: 37%;"
					@click="$c.goto('/pages/activity/newExclusive')"></view>
				<image v-if="showClose" src="/static/icon/close.webp" class="i-52 mt-17 absolute left-0 right-0 auto-x"
					style="bottom: 26%;" @click="onClose('new')"></image>
			</view>
		</u-popup>

		<!-- egg -->
		<u-popup :show="!showWine && !showNew && showEgg" mode="center" bgColor="transparent"
			overlayStyle="background: 'rgba(0, 0, 0, 0.6)'" @close="showEgg == false">
			<view class="text-center vw-100 relative">
				<PlayImg path="index_ld_rice/1/1" :interval="40" :length="25" :loop="false" path2="index_ld_rice/2/2"
					:interval2="40" :length2="25" type="webp" />
				<view class="absolute left-0 right-0 auto-x pw-70 ph-15" style="bottom: 23%;"
					@click="showEgg = false;$c.goto('/pages/activity/egg')"></view>
				<image src="/static/icon/close.webp" class="i-52" style="margin-top: -10%;" @click="onClose('egg')">
				</image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue';
	import PlayImg from '../../components/PlayImgs.vue';
	export default {
		components: {
			TabBar,
			PlayImg
		},
		data() {
			return {
				list: [],
				banner: [],
				good: ['海外代购', '快捷发货', '全天服务', '优质精选'],
				place: '',
				search: {
					page: 1,
					limit: 10,
					name: '',
					load: 'more'
				},
				level: 0,
				height: 0,
				name: '',
				searchHistory: [],
				pointList: [],
				showNew: false,
				showEgg: false,
				showClose: false,
				showWine: false,
				menus: [
					{ id: 3, icon: '/static/mp/index_menu/3.webp', name: '加入北城', url: '/pages/user/qrcode' },
					{ id: 4, icon: '/static/mp/index_menu/4.webp', name: '活动·签到', url: '/pages/index/task' },
					{ id: 5, icon: '/static/mp/index_menu/5.webp', name: '在线客服', url: '/pages/index/web' },
				],
				nation: [],
				nationed: false
			}
		},
		async onLoad() {
			const obj = await this.$c.checkeLogin(1)
			if (obj && Object.keys(obj).length) {
				this.level = obj.level.id
				const index_pop = this.$c.getStorage('index_pop')
				if (!index_pop) this.getActivity()

				this.searchHistory = this.$c.getStorage('searchHistory') || []
				this.getBanner()
				this.getGoods()
				this.getPointList()
				// #ifdef MP
				this.getNation()
				// #endif
				this.$c.removeStorage('sellAccount')
			}
		},
		onShow() {
			this.$c.checkeLogin()
		},
		onReady() {
			this.$nextTick(() => {
				this.$nextTick(() => {
					this.$uGetRect('.title_box').then(res => {
						this.height = res.height
					})
				})
			})
		},
		onReachBottom() {
			this.getGoods()
		},
		methods: {
			onClose(event) {
				if(event == 'new') {
					this.showNew = false
					if (!this.showEgg) this.$c.setStorage('index_pop', true)
				} else if(event == 'egg') {
					this.showEgg = false
					this.$c.setStorage('index_pop', true)
				} else if(event == 'wine') {
					this.showWine = false
					if (!this.showEgg && !this.showNew) this.$c.setStorage('index_pop', true)
					setTimeout(() => {
						this.showClose = true
					}, 1200)
				}
			},
			async getActivity() {
				// const res1 = await this.$c.fetch(this.$api.event.tripPopup, { id: 1 })
				// if (res1) {
				// 	this.showWine = res1?.ok || true
				// }
				const res = await this.$c.fetch(this.$api.user.activityStatus)
				if (res) {
					// this.showWine = res.is_lucky_star
					this.showNew = res.is_ginseng
					this.showEgg = res.is_egg
					
					this.showClose = true
					// setTimeout(() => {
					// 	this.showClose = true
					// }, 1500)
				}
			},
			async getNation() {
				const res = await this.$c.fetch(this.$api.goods.nation)
				if (res) this.nation = res
				this.nationed = true
			},
			onSearch() {
				this.name = uni.$u.trim(this.name)
				if (!this.name) {
					this.$c.goto('/pages/goods/search')
				} else {
					if (this.searchHistory.indexOf(this.name) == -1) {
						this.searchHistory.push(this.name)
						this.$c.setStorage('searchHistory', this.searchHistory)
					}
					this.$c.goto('/pages/goods/searchResult?name=' + this.name)
				}
			},
			async getBanner() {
				const res = await this.$c.fetch(this.$api.config.images, {
					location: 0
				})
				if (res) this.banner = res
			},
			async getGoods() {
				if (this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.goods.goodsList, this.search)
				if (res) {
					this.list = [...this.list, ...res]
					this.search.load = res.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if (this.search.load != 'end') this.search.load = 'more'
			},
			async getPointList() {
				const res = await this.$c.fetch(this.$api.goods.goodsList, {
					page: 1,
					limit: 10,
					name: '',
					is_level_valid: 0,
					is_integral: 1
				})
				if (res) this.pointList = res.slice(0, 3)
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifdef MP */
	.bg {
		background-image: url('/static/mp/index/index_bg.webp');
		background-size: 100% auto;
		background-repeat: no-repeat;
		background-color: #f8f8f8;
	}
	/* #endif */
	/* #ifndef MP */
	.bg {
		background: linear-gradient(to bottom,  #519296 0,  #519296 50%, #E7F1FF 50%, #E7F1FF 100%)
	}
	.title_box {
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 10;background: #519296;
	}
	.list_bg {
		background: #E7F1FF;
	}
	/* #endif */
</style>