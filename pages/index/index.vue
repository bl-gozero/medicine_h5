<template>
	<view class="page flex-col" style="background: linear-gradient(to bottom,  #519296 0,  #519296 50%, #E7F1FF 50%, #E7F1FF 100%)">
		<view class="title_box fixed flex-between pb-15 plr-20 pw-100 border-box" :class="`pt-${$c.barHeight()}`" style="z-index: 10;background: #519296;">
			<image src="/static/common/logo.gif" class="w-73 h-32 mr-11"></image>
			<view class="flex-end">
				<!-- <view class="w-192 h-35 bg-white rounded-x plr-11 flex-start ptb-12 border-box">
					<u-icon name="search" color="#1A7E84" size="15"></u-icon>
					<text class="text-base fs-12 lh-14 fw-4 ml-7">输入药品名称</text>
				</view> -->
				<view class="w-192">
					<u-search v-model="name" placeholder="输入药品名称" :searchIconColor="$c.baseColor()" :placeholderColor="$c.baseColor()" bgColor="#fff" :showAction="false"></u-search>
				</view>
				<text class="fs-14 lh-14 fw-7 text-white ml-8" @click="onSearch()">搜索</text>
			</view>
		</view>
		<view :class="`h-${height}`"></view>
		<view class="plr-20 h-105">
			<u-swiper :list="banner" keyName="src" :height="105"></u-swiper>
		</view>
		<view class="flex-1 mt-14 roundedTop-20 pt-15 plr-20 pb-60 border-box" style="background: #E7F1FF;">
			<view class="relative mb-30">
				<image src="/static/index/point_box.webp" class="pw-100" mode="widthFix"></image>
				<view class="absolute pw-100 top-0 left-0">
					<PlayImg
						path="index_point/1"
						:interval="40"
						:length="50"
					/>
				</view>
				<view class="absolute ph-19 pw-50" style="top: 3%;right: 2%" @click="$c.goto('/pages/index/task')"></view>
				<view class="absolute left-0 right-0 bottom-0 flex-between plr-14 border-box" style="top: 28%">
					<view class="self-start" v-for="(item, index) in pointList" :key="item.id" @click="$c.goto(`/pages/point/goodsDetail?id=${item.id}`)">
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
			<view class="flex-between flex-wrap" style="gap: 10px;">
				<view 
					class="mt-10 bg-white rounded-12"
					style="width: calc((100% - 10px) / 2);"
					v-for="(item,index) in list" 
					:key="item.id" 
					@click="$c.goto('/pages/goods/detail?id=' + item.id)"
				>
					<view class="img-box flex-center">
						<image :src="item.picture" class="pw-100 ph-100 roundedTop-12 block" lazy-load mode="aspectFill"></image>
					</view>
					<view class="p-10 border-box">
						<text class="u-line-1 fs-14 fw-5 border-bo">{{ item.name }}</text>
						<view class="flex-between mt-18">
							<view class="price plr-4 flex-center">
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
							<image src="/static/index/cart.png" class="w-35 h-25"></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed right-0 bottom-75 w-56 h-69">
			<image src="/static/index/cs.png" class="w-56 h-69" @click="$c.goto('/pages/index/web')"></image>
		</view>
		<TabBar />
		
		<!-- new -->
		<u-popup 
			:show="showNew"
			mode="center"
			bgColor="transparent"
			overlayStyle="background: 'rgba(0, 0, 0, 0.6)'"
			:closeOnClickOverlay="false"
			@close="showNew == false"
		>
			<view class="text-center vw-100 relative">
				<PlayImg
					path="index_new/1/1"
					:interval="40"
					:length="25"
					:loop="false"
					path2="index_new/2/1"
					:interval2="40"
					:length2="50"
					:start2="25"
					type="webp"
				/>
				<view class="absolute left-0 right-0 auto-x pw-55 ph-9" style="bottom: 37%;" @click="$c.goto('/pages/activity/newExclusive')"></view>
				<image v-if="showClose" src="/static/icon/close.webp" class="i-52 mt-17 absolute left-0 right-0 auto-x" style="bottom: 26%;" @click="onCloseNew()"></image>
			</view>
		</u-popup>
		
		<!-- egg -->
		<u-popup 
			:show="!showNew && showEgg"
			mode="center"
			bgColor="transparent"
			overlayStyle="background: 'rgba(0, 0, 0, 0.6)'"
			@close="showEgg == false"
		>
			<view class="text-center vw-100 relative" >
				<PlayImg
					path="index_egg/1/1"
					:interval="40"
					:length="25"
					:loop="false"
					path2="index_egg/2/1"
					:interval2="40"
					:length2="25"
					:start2="25"
					type="webp"
				/>
				<view class="absolute left-0 right-0 auto-x pw-70 ph-15" style="bottom: 23%;" @click="showEgg = false;$c.goto('/pages/activity/egg')"></view>
				<image src="/static/icon/close.webp" class="i-52" style="margin-top: -10%;" @click="onCloseEgg()"></image>
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
				search: { page: 1, limit: 10, name: '', load: 'more' },
				level: 0,
				height: 0,
				name: '',
				searchHistory: [],
				pointList: [],
				showNew: false,
				showEgg: false,
				showClose: false
			}
		},
		onLoad() {
			const obj = this.$c.getStorage('profile')
			if (obj && Object.keys(obj).length > 0) {
				this.level = obj.level.id
				this.getProfile()
				const index_pop = this.$c.getStorage('index_pop')
				if(!index_pop) this.getActivity()
			}
			this.searchHistory = this.$c.getStorage('searchHistory') || []
			this.getBanner()
			this.getGoods()
			this.getPointList()
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title_box').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		onReachBottom() {
			this.getGoods()
		},
		methods: {
			onCloseNew() {
				this.showNew = false
				if(!this.showEgg) this.$c.setStorage('index_pop', true)
			},
			onCloseEgg() {
				this.showEgg = false
				this.$c.setStorage('index_pop', true)
			},
			async getActivity() {
				const res = await this.$c.fetch(this.$api.user.activityStatus)
				if (res) {
					this.showNew = res.is_ginseng
					this.showEgg = res.is_egg
					setTimeout(() => {
						this.showClose = true
					}, 1200)
				}
			},
			onSearch() {
				this.name = uni.$u.trim(this.name)
				if(!this.name) {
					this.$c.goto('/pages/goods/search')
				} else {
					if(this.searchHistory.indexOf(this.name) == -1) {
						this.searchHistory.push(this.name)
						this.$c.setStorage('searchHistory', this.searchHistory)
					}
					this.$c.goto('/pages/goods/searchResult?name=' + this.name)
				}
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.level = res.level.id
					this.$c.setStorage('profile', res)
				}
			},
			async getBanner() {
				const res = await this.$c.fetch(this.$api.config.images, { location: 0 })
				if(res) this.banner = res
			},
			async getGoods() {
				if(this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.goods.goodsList, this.search)
				if(res) {
					this.list = [...this.list, ...res]
					this.search.load = res.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if(this.search.load != 'end') this.search.load = 'more'
			},
			async getPointList() {
				const res = await this.$c.fetch(this.$api.goods.goodsList, {
					page: 1,
					limit: 10,
					name: '',
					is_level_valid: 0,
					is_integral: 1
				})
				if(res) this.pointList = res.slice(0, 3)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.price {
		width: 111px;
		height: 25px;
		background-image: url('/static/index/price.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
</style>
