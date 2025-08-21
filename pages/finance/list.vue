<template>
	<view class="page bg-page">
		<view class="top_box fixed top-0 left-0 pw-100 bg-page" style="z-index: 10;">
			<Title title="账单明细" />
			<view class="mt-20 plr-20 mt-10 flex-start">
				<view 
					class="w-58 h-25 flex-center bg-white mr-10 rounded-x" 
					:class="form.mode == item.id && 'text-base fw-7'" 
					v-for="item in navBar" 
					:key="item.id"
					@click="onNav(item.id)"
				>{{ item.name }}</view>
			</view>
			<view class="plr-20 mt-20">
				<view class="ptb-16 plr-16 roundedTop-14 time relative">
					<view class="flex-start" @click="showTimePicker = true">
						<text class="fs-16 fw-7 mr-4">{{ form.month }}</text>
						<u-icon name="arrow-down-fill" color="#3D3D3D" size="14"></u-icon>
					</view>
					<view class="mt-10 fs-12">
						<text v-if="form.mode != 2">收入：</text>
						<text v-if="form.mode != 2" class="fw-7 mr-32">{{ income }}</text>
						<text>支出：</text>
						<text v-if="form.mode != 1" class="fw-7">{{ expense }}</text>
					</view>
					<image src="/static/finance/balance_log.png" class="absolute right-11 bottom-0 w-93 h-84"></image>
				</view>
			</view>
		</view>
		<view :class="`h-${height}`"></view>
		<view class="plr-20">
			<view class="bg-white">
				<view class="" v-for="(item, index) in list" :key="index">
					<view class="plr-11">
						<view class="border-bottom ptb-15">
							<view class="flex-between">
								<text>{{ item.type }}</text>
								<text class="fw-7">{{ item.amount }}</text>
							</view>
							<view class="text-info mt-6 fs-10">{{ item.created_at }}</view>
							<view class="text-info mt-6 fs-10">{{ item.remark }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="">
			<u-datetime-picker
				:show="showTimePicker"
				:minDate="1735689600000"
				:confirmColor="$c.baseColor()"
				mode="year-month"
				@confirm="onConfirm"
				@cancel="showTimePicker = false">
			></u-datetime-picker>
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
				navBar: [{ id: 0, name: '全部' }, { id: 1, name: '收入' }, { id: 2, name: '支出' }],
				form: { page: 1, limit: 10, mode: 0, month: new Date().toISOString().slice(0, 7), status: 'more' },
				list: [],
				income: 0,
				expense: 0,
				showTimePicker: false,
				height: 0
			}
		},
		onLoad() {
			this.getList()
			this.doAvatar = this.$c.onceRequest(this.onAvatarEdit)
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.top_box').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getList() {
				if(this.form.status != 'more') return
				this.form.status = 'loading'
				const res = await this.$c.fetch(this.$api.finance.balanceList, this.form)
				if (res) {
					this.income = res.income
					this.expense = res.expenses
					this.form.status = res.month_data.length >= this.form.limit ? 'more' : 'end'
					if(res.month_data) {
						this.list = [...this.list, ...(res.month_data || [])]
						this.form.page++
					}
				}
				console.log(this.form)
				if(this.form.status != 'end') this.form.status = 'more'
			},
			onNav(i) {
				if(this.form.status == 'loading') return
				if(this.form.mode == i) return
				this.list = []
				this.form = {...this.form, ...{ page: 1, mode: i, status: 'more'}}
				this.getList()
			},
			onConfirm(e) {
				this.form = {...this.form, ...{ page: 1, month: uni.$u.date(e.value, 'yyyy-mm'),status: 'more'}}
				this.list = []
				this.showTimePicker = false
				this.getList()
			}
		}
	}
</script>

<style>
	.time {
	    background: linear-gradient(180deg, #FFFFFF 35%, #E7F7F5 100%);
	}
</style>