<template>
	<view class="page bg-page flex-col">
		<Title title="销售数据" />
		<view class="plr-20">
			<view class="plr-17 mt-10  ptb-13 bg rounded-8 flex-col flex-between fgap-15">
				<view class="flex-between fgap-10 pw-100">
					<view class="u-line-1">{{ account }}</view>
					<view class="flex-end" @click="init(1)">
						<image src="/static/vip/refresh.webp" class="i-11 mr-4"></image>
						<text class="text-info fs-12 u-line-1">数据更新于{{ now }}</text>
					</view>
				</view>
				<view class="flex-between lh-10 fgap-10 pw-100">
					<view class="rounded-8 flex-1 border-box">
						<view class="flex-start">
							<image src="/static/vip/lei.webp" class="i-19 block"></image>
							<text class="text-info fs-12 ml-3">销售业绩（元）</text>
						</view>
						<view class="fs-16 fw-7 u-line-1 mt-5">{{ sales }}</view>
					</view>
					<view class="rounded-8 flex-1 border-box">
						<view class="flex-start">
							<image src="/static/vip/cun.webp" class="i-19 block"></image>
							<view class="text-info fs-12 ml-3 ">绩效分红（元）</view>
						</view>
						<view class="fs-16 fw-7 u-line-1 mt-5">{{ store }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="flex-1 plr-20 mt-12 relative">
			<view class="absolute left-20 right-20 top-0 bottom-0 flex-col bg-white rounded-8 plr-16 list_box">
				<view class="flex-center ptb-17 fgap-30">
					<view v-for="item in types" :key="item.id" :class="type == item.id && 'active'" @click="onType(item.id)" >每{{ item.value }}</view>
				</view>
				<view class="flex-1 relative">
					<scroll-view scroll-y class="full" @scrolltolower="getData()">
						<view v-if="list.length == 0" class="h-200 flex-center text-info">{{ load == 'loading'? '' : '暂无数据' }}</view>
						<view v-else class="flex-between ptb-13" v-for="(item, index) in list" :key="index">
							<view class="">
								<view class="">{{ item.date }}</view>
								<view class="fs-10 mt-5 text-info">{{ item.year }}</view>
							</view>
							<view class="text-right">
								<view class="fw-7">{{ item.sales }}</view>
								<view class="fs-10 mt-5 text-info">{{ types[type]? types[type].value : '' }}总销售(元)</view>
							</view>
						</view>
					</scroll-view>
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
				year: new Date().getFullYear(),
				list: [],
				sales: 0,
				store: 0,
				profile: this.$c.profile(),
				account: '',
				now: this.$c.formatDateTime(),
				type: 0,
				types: [
					{ id: 0, value: '日' },
					{ id: 1, value: '周' },
					{ id: 2, value: '月' }
				],
				page: 1,
				limit: 10,
				load: 'more',
				id: 0
			}
		},
		onLoad(p) {
			this.$c.checkeLogin()
			const sellAccount = this.$c.getStorage('sellAccount') || { id: 0, account: this.profile.account }
			this.id = sellAccount.id
			this.account = sellAccount.account
			this.getData()
		},
		onReachBottom() {
			this.getData()
		},
		methods: {
			onType(n) {
				if(this.load == 'loading') return
				if(this.type == n) return
				this.type = n
				this.init()
			},
			init(n = null) {
				this.list = []
				this.page = 1
				this.load = 'more'
				this.getData(n)
			},
			async getData(n = null) {
				if(this.load != 'more') return
				this.load = 'loading'
				const res = await this.$c.fetch(this.$api.finance.sellList, { 
					page: this.page,
					limit: this.limit,
					type: this.type + 1,
					id: this.id
				}, { loading: !!n })
				if(res) {
					if(n) this.$c.toast('刷新成功')
					this.sales = res.total_sales || 0
					this.store = res.save_count || 0
					if(res.data) {
						this.list = [...this.list, ...(res.data || [])]
						this.load = res.data.length >= this.limit ? 'more' : 'end'
						this.page++
					}
				}
				this.load = !res?.data || this.load == 'end' ? 'end' : 'more'
			}
		}
	}
</script>

<style>
	.bg {
		background-image: url('/static/finance/sell.webp');
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
	.line {
		width: 30px;
		height: 0px;
		transform: rotate(90deg);
		border-top: 1px solid #F5F5F5;
	}
	.active {
		position: relative;
		font-weight: 700;
		color: #1C77FE;
		
	}
	.active::after {
		content: '';
		display: block;
		width: 10px;
		height: 2px;
		background: #1C77FE;
		position: absolute;
		bottom: -4px;
		left: 0;
		right: 0;
		margin: auto;
		border-radius: 2px;
	}
</style>