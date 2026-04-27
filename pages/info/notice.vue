<template>
	<view class="">
		<view v-if="page == 1" class="page bg-page plr-20">
			<Title title="消息中心" fixed @right="onClear()">
				<template v-slot:right>
					<view class="i-24 flex-center">
						<image src="/static/icon/clear.webp" class="i-16"></image>
					</view>
				</template>
			</Title>
			<view class="plr-15 rounded-8 bg-white mt-10" v-for="item in list" :key="item.id">
				<view class="flex-between ptb-13 border-bottom">
					<view class="flex-start lh-10">
						<image src="/static/icon/notice_title.webp" class="i-18 block mr-5"></image>
						<text class="fs-12">消息通知</text>
					</view>
					<view class="flex-end" @click="onMore(item)">
						<text class="fs-12 text-info mr-5">{{ item.created_at || '2026.09.09 09:14' }}</text>
						<u-icon name="more-dot-fill" color="#D0D0D0" size="12"></u-icon>
					</view>
				</view>
				<view class="pt-13 pb-16 border-bottom">
					<view class="flex-start lh-10">
						<view class="i-6 rounded bg-danger mr-4"></view>
						<view class="flex-1 u-line-1 fw-5">{{ item.title || item.name }}</view>
					</view>
					<view class="u-line-2 mt-16 fs-12 lh-12" style="color: #808080;">平台以商品交易为基础，围绕用户服务与商户经营，构建集“消费体验、用户增长、运营支持”为一体的综合服...</view>
				</view>
				<view class="ptb-13 flex-between lh-10" @click="onDetail(item)">
					<view class="">查看详情</view>
					<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
				</view>
			</view>
			<view class="h-10"></view>
		</view>
		<view v-if="page == 2" class="page bg-white plr-20">
			<Title title="消息详情" bgColor="#fff" fixed />
			<view class="mt-20">
				<view class="fs-18 fw-5 lh-15">{{ news.title || news.name }}</view>
				<view class="fs-12 text-info mt-13 block pb-15 border-bottom">
					发布时间：{{ news.created_at || '2026.09.09 09:14' }}</view>
				<view class="mt-20">
					<u-parse :content="news.name"></u-parse>
				</view>
			</view>
		</view>
		
		<u-popup :show="show" mode="bottom" round="20" closeable @close="show = false">
			<view class="plr-20 pt-40 pb-100 text-center fs-14">
				<view class="ptb-20 border-bottom" @click="onRead()">标为已读</view>
				<view class="ptb-20 text-danger border-bottom" @click="onDelete();showDeleteConfirm = true">删除此条消息</view>
			</view>
		</u-popup>
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
				news: {},
				show: false
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
				this.onRead()
			},
			onClear() {
				this.$c.toast('操作成功')
			},
			onMore(item) {
				this.news = item
				this.show = true
			},
			async onRead() {
				this.$c.toast('操作成功')
			},
			async onDelete() {
				this.$c.toast('操作成功')
			}
		}
	}
</script>

<style>
</style>