<template>
	<view class="page bg flex-col">
		<Title title="我的体验" bgColor="transparent" />
		<view class="relative mlr-20">
			<image :src="img('unsettled.webp')" class="x-100" mode="widthFix"></image>
			<view class="full flex-start pl-16 border-box">
				<view class="fs-20 fw-7 text-base">￥{{ unsettlement }}</view>
				<view class="fs-12" style="color: #AF8278;">（待结算）</view>
			</view>
		</view>
		<view class="plr-20 mt-13">
			<u-subsection :list="types" mode="button" :current="current" bgColor="#E4C8A8" activeColor="#985022"
				inactiveColor="#907657" fontSize="14" bold @change="onChange"></u-subsection>
		</view>
		<view v-if="current === 1" class="mt-10 plr-20 text-right" style="color: #6A310C;">共获得（元）：<text
				class="fw-7 fs-18">{{ total }}</text></view>
		<view class="flex-1 roundedTop-10 mt-10 mlr-20 relative" :class="current < 2 && 'bg-white'">
			<scroll-view scroll-y class="full" @scrolltolower="getList()">
				<view v-if="!list.length" class="full flex-center text-info">暂无数据</view>
				<view v-else-if="current === 0" class="flex-between border-box plr-16 fgap-8" v-for="(i, index) in list"
					:key="index">
					<u-avatar :src="i.avatar" size="42" :default-url="$c.userAvatar()"></u-avatar>
					<view class="flex-1 pt-16 pb-10 border-bottom">
						<view class="flex-between fgap-8">
							<view class="">{{ i.account }}</view>
							<view class="fw-7">任务：{{ i.amount }}</view>
						</view>
						<view class="text-right fs-10 text-info flex-between mt-2">
							<view class="">{{ i.trade_no }}</view>
							<view class="">{{ i.created_at }}</view>
						</view>
						<view v-if="i.status" class="flex-end mt-3 fs-10">
							<view v-if="i.status.id == 1" class="flex-end" style="color: #FF8F1F;" @click="onKnow()">
								<view class="">暂未收货</view>
								<image src="/static/finance/right.webp" class="i-12 ml-2"></image>
							</view>
							<view v-else class="" style="color: #606060;">{{ i.status.value }}</view>
						</view>
					</view>
				</view>
				<view v-else-if="current === 1" class="border-box plr-16 ptb-17 border-bottom" v-for="(i, index) in list"
					:key="index">
					<view class="flex-between">
						<view class="">{{ i.remark }}</view>
						<view class="fw-7">{{ i.amount }}</view>
					</view>
					<view class="fs-10 text-info">{{ i.created_at }}</view>
				</view>
				<view v-else-if="current === 2" class="">
					<view class="bg-white p-10 rounded-10 mb-10" v-for="i in list" :key="i.goods_category_id">
						<view class="flex-between fgap-15">
							<view class="i-73 bg-page flex-center border-box">
								<image :src="img('/index/' + i.amount +'.webp')" class="w-65"
									:style="{ transform: i.amount == 998 ? 'scale(1.5)' : 'scale(1.3)' }"
									mode="widthFix"></image>
							</view>
							<view class="flex-1">
								<view class="flex-between">
									<view class="fw-7 fs-16" style="color: #6A310C;">任务：{{ i.amount }}</view>
									<view v-if="i.is_return && i.is_return.id == 2" class="fs-12" style="color: #FF8F1F;">押金待返</view>
									<view v-else-if="i.is_return && i.is_return.id == 1" class="fs-12">押金已返</view>
								</view>
								<view class="text-info mt-5 pb-5">订单编号：{{ i.trade_no }}</view>
							</view>
						</view>
						<view class="text-right text-base mt-10">物流信息请到微信小程序【北辰乐购星选】</view>
					</view>
					<view class="h-10"></view>
				</view>
			</scroll-view>
		</view>
		<view class="">
			<Knows />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				types: ['任务记录', '权益记录', '领取记录'],
				list: [],
				total: 0,
				unsettlement: 0
			}
		},
		onLoad(p) {
			this.$c.checkeLogin()
			const type = this.$c.safeId(p, 'type')
			this.current = [1, 2, 3].includes(type) ? type - 1 : 0
			this.getList()
			this.getInfo()
		},
		methods: {
			onChange(e) {
				if (this.current == e) return
				this.current = e
				this.list = []
				this.getList()
			},
			async getList() {
				const apis = [
					this.$api.event.recruitUsers,
					this.$api.event.recruitBalance,
					this.$api.event.recruitJoin
				]
				const api = apis?.[this.current]
				if (!api) return
				const res = await this.$c.fetch(apis[this.current])
				if (res) {
					this.list = res.list || res
					if (this.current == 1) this.total = res.total || 0
				}
			},
			async getInfo () {
				const res = await this.$c.fetch(this.$api.event.recruitUnsettlement)
				if (res) this.unsettlement = res.total
			},
			onKnow() {
				this.$knows.show({
					bgStyle: 'background: linear-gradient(180deg, #ffefce 3%, #ffffff 49%);',
					bgClass: '',
					img: {
						src: '/static/know/finance.webp',
						class: ''
					},
					title: {
						text: '暂未结算',
						class: ''
					},
					text:'对方暂未确认收货，请待对方确认收货后，即可进行结算',
					buttons:[ ]
				})
			},
			img(path, root = '/static/avtivity/promote/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		},
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}

	.bg {
		background: linear-gradient(0deg, #e8e8e8 0%, #f1cb9e 100%);
	}
</style>