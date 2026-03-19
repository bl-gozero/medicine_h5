<template>
	<view class="page bg-page">
		<Title title="领取详情" fixed bgColor="#f8f8f8" />
		<view v-if="load" class="plr-20 mt-10">
			<view class="bg-white rounded-14 pt-40 pb-25 text-center">
				<view class="">
					<!-- <image v-if="info.commodity && info.commodity.id" src="/static/avtivity/egg/egg.webp" class="w-115 h-73"></image>
					<image v-if="event_id == 1" src="/static/avtivity/new/goods.webp" class="i-84"></image> -->
					<image v-if="info.goods" :src="info.goods.img" :class="info.goods.class"></image>
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
					<view class="">物流信息</view>
					<view v-if="info.number" class="mlr-20 flex-1 text-info">
						<view class="flex-between">
							<view class="flex-1 self-start">
								<text class="">{{ info.number }}</text>
								<text class="mlr-5">|</text>
								<text style="color: #1575F6;" @click="$c.copy(info.number)">复制</text>
							</view>
						</view>
					</view>
					<view v-else class="ml-20 flex-1 text-info">暂无</view>
					<button v-if="info.number" class="w-52 h-23 bg-base text-white fs-12 m-0 ml-10 p-0 rounded-x flex-center"
						@click="$c.goto('/pages/index/express', 1, { id: info.id, mode: 2, number: info.number })">查询</button>
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
				express: {},
				items: [{
						id: 1,
						event_id: 1,
						name: '北朝鲜山参',
						img: '/static/avtivity/new/goods.webp',
						class: 'i-84'
					},
					{
						id: 2,
						event_id: 2,
						name: '北辰优选初生鸡蛋',
						img: '/static/avtivity/egg/img_egg.webp',
						class: 'w-121 h-63'
					},
					{
						id: 3,
						event_id: 2,
						name: '北辰优选东北大米',
						img: '/static/avtivity/egg/img_rice.webp',
						class: 'w-109 h-87'
					},
					{
						id: 4,
						event_id: 2,
						name: '满婷内衣洗专用洗衣液',
						img: '/static/avtivity/egg/img_ld.webp',
						class: 'w-76 h-102'
					},
					{
						id: 5,
						event_id: 3,
						name: '人参鹿鞭酒',
						img: '/static/avtivity/wine/wine.webp',
						class: 'w-86 h-83'
					},
				],
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
				if (res) {
					this.info = res
					this.info.goods = res.commodity ? this.items.find(i => i.id == res.commodity.id) : this.items.find(
						i => i.event_id == this.event_id)
					// if(res.number) this.express = await this.$c.getExpress(res.id , 2)
					this.load = true
				}
			},
		}
	}
</script>

<style>

</style>