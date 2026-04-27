<template>
	<view class="page bg-white plr-20">
		<view v-if="page == 1" class="">
			<Title title="企业资讯" bgColor="#fff" fixed />
			<view class="" v-for="item in list" :key="item.id" @click="onDetail(item)">
				<view class="ptb-25 flex-between fgap-10">
					<view class="flex-1">
						<view class="fw-5 fs-16 lh-15 u-line-2 flex-1">{{ item.name }}</view>
						<view class="fs-12 text-info mt-13 block">{{ item.created_at || '2026.09.09 09:14' }}</view>
					</view>
					<image :src="item.picture" class="w-116 h-81 rounded-6" mode="aspectFill"></image>
				</view>
				<view class="h-5" style="background: #F1F4F8;"></view>
			</view>
		</view>
		<view v-if="page == 2" class="">
			<Title title="资讯详情" bgColor="#fff" fixed />
			<view class="mt-20">
				<view class="fs-18 fw-5 lh-15">{{ news.name }}</view>
				<view class="fs-12 text-info mt-13 block pb-20 border-bottom">
					发布时间：{{ news.created_at || '2026.09.09 09:14' }}</view>
				<view class="mt-20">
					<u-parse :content="news.name"></u-parse>
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
				list: [],
				search: {
					page: 1,
					limit: 10,
					name: '',
					load: 'more'
				},
				page: 1,
				news: {}
			}
		},
		onLoad() {
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getList() {
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
			async getDetail() {},
			onDetail(item) {
				this.news = item
				this.page = 2
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
		}
	}
</script>

<style>
</style>