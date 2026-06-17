<template>
	<view class="">
		<view v-if="page == 1">
			<view v-if="search.classify == 2" class="page bg-white plr-20">
				<Title title="企业资讯" bgColor="#fff" fixed />
				<view class="" v-for="item in list" :key="item.id" @click="onDetail(item)">
					<view class="ptb-25 flex-between fgap-10">
						<view class="flex-1">
							<view class="fw-5 fs-16 lh-15 u-line-2 flex-1 h-48">{{ item.title }}</view>
							<view class="fs-12 text-info mt-13 block">{{ item.publish_at }}</view>
						</view>
						<image :src="item.image_src" class="w-116 h-81 rounded-6 bg-page" mode="aspectFill"></image>
					</view>
					<view class="h-5" style="background: #F1F4F8;"></view>
				</view>
			</view>
			<view v-else-if="search.classify == 1" class="page bg-page plr-20">
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
							<text class="fs-12 text-info mr-5">{{ item.publish_at }}</text>
							<u-icon name="more-dot-fill" color="#D0D0D0" size="12"></u-icon>
						</view>
					</view>
					<view class="pt-13 pb-16 border-bottom">
						<view class="flex-start lh-10">
							<view :class="!item.reading_at ? 'i-6 rounded bg-danger mr-4' : 'i-6' "></view>
							<view class="flex-1 u-line-1 fw-5">{{ item.title }}</view>
						</view>
						<view class="u-line-2 mt-16 fs-12 lh-12" style="color: #808080;">{{ item.context }}</view>
					</view>
					<view class="ptb-13 flex-between lh-10" @click="onDetail(item)">
						<view class="">查看详情</view>
						<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
					</view>
				</view>
				<view class="h-10"></view>
			</view>
		</view>
		<view v-if="page == 2" class="page bg-white plr-20">
			<Title :title="search.classify == 2 ? '资讯详情' : '消息详情'" bgColor="#fff" fixed isBack @back="page = 1" />
			<view class="mt-20">
				<view class="fs-18 fw-5 lh-15">{{ news.title }}</view>
				<view class="fs-12 text-info mt-13 block pb-15 border-bottom">
					发布时间：{{ news.publish_at }}</view>
				<view class="mt-20">
					<u-parse :content="news.context"></u-parse>
				</view>
			</view>
		</view>
		
		<u-popup :show="show" mode="bottom" round="20" closeable @close="show = false">
			<view class="plr-20 pt-40 pb-100 text-center fs-14">
				<view class="ptb-20 border-bottom" @click="getDetail(1)">标为已读</view>
				<!-- <view class="ptb-20 text-danger border-bottom" @click="onDelete();showDeleteConfirm = true">删除此条消息</view> -->
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
					classify: 1,
					load: 'more'
				},
				page: 1,
				news: {},
				show: false
			}
		},
		onLoad(p) {
			if (p.classify == 2) this.search.classify = 2
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getList() {
				if (this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.config.message, this.search)
				if (res?.list) {
					const list = res.list
					this.list = [...this.list, ...list]
					this.search.load = list.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if (this.search.load != 'end') this.search.load = 'more'
			},
			async getDetail(read = 0) {
				const res = await this.$c.fetch(this.$api.config.messageDetail, { id: this.news.id })
				if (res) {
					this.news = res
					const news = this.list.find(i => i.id == this.news.id)
					if (news) news.reading_at = 1
					if (read) {
						this.$c.toast('操作成功')
						this.show = false
					}
				}
			},
			onDetail(item) {
				this.news = item
				this.page = 2
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
				this.getDetail()
			},
			async onClear() {
				const res = await this.$c.fetch(this.$api.config.messageReadAll)
				if (res) {
					this.list.forEach(item => {
						if (!item.reading_at) {
							this.$set(item, 'reading_at', 1)
						}
					})
					this.$c.toast('操作成功')
				}
			},
			onMore(item) {
				this.news = item
				this.show = true
			},
			async onDelete() {
				this.$c.toast('操作成功')
			}
		}
	}
</script>

<style>
</style>