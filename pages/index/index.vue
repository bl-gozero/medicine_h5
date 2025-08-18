<template>
	<view class="page flex-col" style="background: #519296;">
		<view class="title_box fixed flex-between pb-15 plr-20 pw-100 border-box" :class="`pt-${$c.barHeight()}`" style="z-index: 10;background: #519296;">
			<image src="/static/common/logo.png" class="w-73 h-25 mr-11"></image>
			<view class="flex-end" @click="$c.goto('/pages/goods/search')">
				<view class="w-192 h-35 bg-white rounded-x plr-11 flex-start ptb-12 border-box">
					<u-icon name="search" color="#1A7E84" size="15"></u-icon>
					<text class="text-base fs-12 lh-14 fw-4 ml-7">输入药品名称</text>
				</view>
				<text class="fs-14 lh-14 fw-7 text-white ml-8">搜索</text>
			</view>
		</view>
		<view class="plr-20" :class="`pt-${height}`">
			<u-swiper :list="banner" keyName="src" :height="105"></u-swiper>
		</view>
		<view class="flex-1 mt-14 rounded-20 pt-15 plr-20" style="background: #E7F1FF;">
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
			<view class="flex-between flex-wrap">
				<view class="w-158 mt-10 bg-white rounded-12" v-for="(item,index) in list" :key="item.id" @click="$c.goto('/pages/goods/detail?id=' + item.id)">
					<image :src="item.picture" class="i-158 roundedTop-12 block" lazy-load mode="aspectFill"></image>
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
									<text class="text-danger fs-10 fw-7">￥</text>
									<text class="text-danger fw-7">{{ item.price }}</text>
								</view>
							</view>
							<image src="/static/index/cart.png" class="w-35 h-25"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="h-70"></view>
		</view>
		<view class="fixed right-0 bottom-75 w-56 h-69">
			<image src="/static/index/cs.png" class="w-56 h-69" @click="$c.goto('/pages/index/web')"></image>
		</view>
		<TabBar />
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue';
	export default {
		components: {
			TabBar
		},
		data() {
			return {
				list: [],
				banner: [],
				good: ['海外代购', '快捷发货', '全天服务', '优质精选'],
				place: '',
				search: { page: 1, limit: 10, name: '', load: 'more' },
				level: this.$c.getStorage('profile')? this.$c.getStorage('profile').level.id : 0,
				height: 0
			}
		},
		onLoad() {
			this.getProfile()
			this.getBanner()
			this.getGoods()
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title_box').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		methods: {
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
