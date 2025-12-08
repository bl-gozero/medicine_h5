<template>
	<view class="page bg-page">
		<Title title="领取详情" fixed bgColor="#f8f8f8" />
		<view v-if="load" class="plr-20 mt-10">
			<view class="bg-white rounded-14 pt-40 pb-25 text-center">
				<view class="">
					<image v-if="event_id == 2" src="/static/avtivity/egg/egg.webp" class="w-115 h-73"></image>
					<image v-if="event_id == 1" src="/static/avtivity/new/goods.webp" class="i-84"></image>
				</view>
				<view class="mt-20 fs-16">领取成功</view>
			</view>
			<view class="bg-white rounded-14 ptb-20 plr-16 fs-12 mt-12">
				<view class="flex-between">
					<view class="">领取时间</view>
					<view class="ml-20 flex-1 text-info">{{ info.created_at }}</view>
				</view>
				<view class="flex-between mt-20">
					<view class="self-start">收件地址</view>
					<view class="ml-20 flex-1 text-info">
						<view class="">{{ info.address }}</view>
						<view class="">
							<text>{{ info.name }}</text>
							<text class="ml-10">{{ info.phone }}</text>
						</view>
					</view>
				</view>
				<view class="flex-between mt-20">
					<view class="self-start">物流信息</view>
					<view v-if="info.number" class="ml-20 flex-1 text-info">
						<view class="">
							<text>{{ info.number }}</text>
							<text class="mlr-5">|</text>
							<text style="color: #1575F6;" @click="$c.copy(info.number)">复制</text>
						</view>
						<view v-if="express.AcceptStation" class="lh-15 mt-15 fs-12 text-info">
							<view class="">{{ express.AcceptTime }}</view>
							<view class="mt-8" style="word-wrap: break-word;word-break: break-all;">{{ express.AcceptStation }}</view>
						</view>
					</view>
					<view v-else class="ml-20 flex-1 text-info">暂无</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: {
			Title
		},
		data() {
			return {
				info: {},
				event_id: 0,
				id: 1,
				load: false,
				express: {}
			}
		},
		onLoad(p) {
			this.event_id = p.event_id ? parseInt(p.event_id) : this.event_id
			this.id = p.id ? parseInt(p.id) : this.id
			this.getDetail()
		},
		methods: {
			async getDetail() {
				const res = await this.$c.fetch(this.$api.user.activityDetail, {
					id: this.id,
					event_id: this.event_id
				})
				if(res) { 
					this.info = res
					if(res.number) this.express = await this.$c.getExpress(res.id , 2)
					this.load = true
				}
			},
		}
	}
</script>

<style>

</style>