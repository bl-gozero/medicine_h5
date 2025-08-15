<template>
	<view class="page bg-page">
		<Title title="提现明细" :fixed="true" />
		<view class="plr-20" :class="`pt-${height + 20}`">
			<view class="bg-white list_box rounded-8">
				<view class="plr-16" v-for="(item, index) in list" :key="item.id">
					<view class="flex-between ptb-16">
						<image :src="`/static/pay/icon/${item.category.id}.png`" clss="i-18 mr-6"></image>
						<view class="flex-1">
							<view class="flex-between">
								<text class="">到{{ item.category.value }}({{ item.card_number }})</text>
								<text class="fw-7">{{ item.amount }}</text>
							</view>
							<view class="flex-between text-info fs-10 mt-7">
								<text class="">{{ item.category.created_at }}</text>
								<view class="">
									<button
										class="bg-base-change fw-7 fs-8 text-white w-41 h-16 rounded-x plr-0 mr-13"
										@click="doSubmit(index, item)"
									>更新状态</button>
									<text class="fw-7" :style="{color: getColor(item.status.id)}">{{ item.status.value }}</text>
								</view>
							</view>
						</view>
					</view>
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
				height: 0,
				list: [],
				form: { page: 1, limit: 15, status: 'more' },
				doSubmit: null
			}
		},
		onLoad() {
			this.getList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onReady() {
			this.$uGetRect('.title_box').then(res => {
				this.height = res.height
			})
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getList() {
				if(this.form.status != 'more')
				this.form.status = 'loading'
				const res = await this.$c.fetch(this.$api.finance.withdrawList, this.form)
				if (res) {
					this.list = [...this.list, ...(res.month_data || [])]
					this.form.status = res.length > this.form.limit ? 'more' : 'end'
					this.form.page++
				}
				if(this.form.status != 'end') this.form.status = 'more'
			},
			async onSubmit(id) {
				const res = await this.$c.fetch(this.$api.finance.withdrawCheck, { id: id })
				if(res) {
					this.$c.toast('更新成功')
					this.form = { amount: '', pay_mode: '' }
				}
				this.showPassword = false
			},
			getColor(id) {
				switch(id) {
					case 1: return '#FF8F1F'
					case 2: return '#FF8F1F'
					case 3: return '#5DAF59'
					case 4: return '#9F9F9F'
					default: return '#9F9F9F'
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.u-code-input {
		width: 100%;
		justify-content: space-between;
	}
	::v-deep .u-code-input__item {
		width: 43px !important;
		height: 56px !important;
		border-radius: 8px;
		background: #EAEAEA;
	}
</style>