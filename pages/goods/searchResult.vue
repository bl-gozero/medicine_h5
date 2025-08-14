<template>
	<view class="page bg-page plr-20">
		<view class="title_box fixed top-0 left-0 pw-100 pb-10 bg-page box" style="z-index: 100;">
			<Title :isBlank="true"></Title>
			<view class="flex-between plr-20 border-box">
				<image src="/static/icon/back.png" class="i-24 mr-23" @click="$c.goBack()"></image>
				<u-search v-model="search.name" placeholder="" bgColor="#fff" :showAction="false" @focus="$c.goBack()"></u-search>
			</view>
		</view>
		<view :class="`pt-${height}`">
			<view class="rounded-12 bg-white ptb-13 plr-16 border-box flex-between mb-12" v-for="item in list" :key="item.id" @click="$c.goto('/pages/goods/detail?id=' + item.id)">
				<image :src="item.picture" class="i-76 rounded-12" mode="aspectFill"></image>
				<view class="flex-1 ml-8">
					<view class="flex-between">
						<text class="u-line-1 fw-5">{{ item.name }}</text>
						<view class="ml-10">
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
					</view>
					<view class="text-right mt-33 mt-12">
						<image src="/static/index/cart.png" class="w-35 h-25"></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: { Title },
		data() {
			return {
				search: { page: 1, limit: 10, name: '', load: 'more' },
				list: [],
				level: this.$c.getStorage('profile')? this.$c.getStorage('profile').level.id : 0,
				height: 0
			}
		},
		onLoad(p) {
			if(p.name) {
				this.search.name = p.name
				this.getProfile()
				this.getGoods()
			}
		},
		onReady() {
			this.$uGetRect('.title_box').then(res => {
				this.height = res.height
			})
		},
		onReachBottom() {
			this.getGoods()
		},
		methods: {
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
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.level = res.level.id
					this.$c.setStorage('profile', res)
				}
			},
		}
	}
</script>

<style>
	
</style>
