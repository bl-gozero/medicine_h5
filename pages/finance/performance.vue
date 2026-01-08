<template>
	<view class="page bg-page flex-col">
		<Title title="团队业绩" />
		<view class="plr-20">
			<view class="plr-17 ptb-13 bg rounded-8">
				<view class="flex-between">
					<text>累计数据</text>
					<text class="text-info fs-12">数据更新于{{ today }}</text>
				</view>
				<view class="flex-between mt-15">
					<view class="rounded-8 pw-48 border-box">
						<view class="flex">
							<image src="/static/vip/data_3.png" class="i-17 block"></image>
							<text class="text-info fs-10 mtb-5 ml-8 lh-10">销售业绩（元）</text>
						</view>
						<view class="fs-16 fw-7 u-line-1 mt-3">{{ sales }}</view>
					</view>
					<view class="rounded-8 pw-48 border-box">
						<view class="flex">
							<image src="/static/vip/data_4.png" class="i-17 block"></image>
							<view class="text-info fs-10 mtb-5 ml-8 lh-10">绩效分红（元）</view>
						</view>
						<view class="fs-16 fw-7 u-line-1 mt-3">{{ bonus }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="flex-1 plr-20 mt-12 relative">
			<view class="absolute left-20 right-20 top-0 bottom-0 flex-col bg-white rounded-8 plr-16 list_box">
				<view class="flex-between ptb-17">
					<text>月绩效</text>
					<view class="" @click="showTimePicker = !showTimePicker">
						<text>{{year}}年</text>
						<image src="/static/finance/year.png" class="i-14 ml-4"></image>
					</view>
				</view>
				<view class="flex-1 relative">
					<scroll-view scroll-y class="full">
						<view v-if="list.length == 0" class="h-200 flex-center text-info">暂无数据</view>
						<view v-else class="flex-between ptb-13" v-for="(item, index) in list" :key="index">
							<view class="">
								<view class="">{{ item.month }}</view>
								<view class="fs-10 mt-5 text-info">{{ item.day_between }}</view>
							</view>
							<view class="flex-end">
								<view class="text-center">
									<view class="fw-7">{{ item.total_sales }}</view>
									<view class="fs-10 mt-5 text-info">销售业绩(元)</view>
								</view>
								<view class="line"></view>
								<view class="text-center">
									<view class="fw-7">{{ item.total_sales }}</view>
									<view class="fs-10 mt-5 text-info">平级回补业绩(元)</view>
								</view>
								<view class="line"></view>
								<view class="text-center">
									<view class="fw-7">{{ item.total_dividends }}</view>
									<view class="fs-10 mt-5 text-info">绩效分红(元)</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="">
			<u-picker
			    :columns="columns"
			    :show="showTimePicker"
				:confirmColor="$c.baseColor()"
			    @confirm="onConfirm"
			    @cancel="showTimePicker = false"
			></u-picker>
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
				today: new Date().toISOString().slice(0, 10),
				columns: [ Array.from({ length: 50 }, (_, i) => `${new Date().getFullYear() - i}`) ],
				showTimePicker: false,
				list: [],
				sales: 0,
				bonus: 0
				
			}
		},
		onLoad() {
			this.getPerformance()
		},
		methods: {
			async getPerformance() {
				const res = await this.$c.fetch(this.$api.finance.performanceList, { year: this.year })
				if(res) { 
					this.sales = res.total_sales || 0
					this.bonus = res.total_dividends || 0
					this.list = res.month || []
				}
			},
			onConfirm(e) {
				this.year = parseInt(e.value)
				this.list = []
				this.showTimePicker = false
				this.getPerformance()
			}
		}
	}
</script>

<style>
	.bg {
		background-image: url('/static/finance/performance.png');
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
	.line {
		width: 30px;
		height: 0px;
		transform: rotate(90deg);
		border-top: 1px solid #F5F5F5;
	}
</style>