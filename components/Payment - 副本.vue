<template>
	<view>
		<view class="mt-20 fs-14 fw-7">支付方式</view>
		<view class="mt-15">
			<view class="flex-between ptb-13" v-for="item in cateList" :key="item.id" @click="selectPayMode(item.id)">
				<view class="flex-start">
					<image :src="`/static/pay/icon/${item.id}.png`" class="i-18 mr-10" />
					<text>{{ item.value }}</text>
				</view>
				<image :src="$c.checkIcon(payingMode === item.id)" class="i-18" />
			</view>
		</view>
		<u-modal 
			:show="show"
			title="提示"
			content='网页端支付正在维护，请在APP端进行付款或充值等操作。'
			showCancelButton
			confirmText="去下载"
			@cancel="show = false"
			@confirm="show = false;$c.goto('/pages/web/download');"
		></u-modal>
	</view>
</template>

<script>
	export default {
		name: 'Payment',
		props: {
			modelValue: Number,
			mode: {
				type: Number,
				default: 1, // 0不含奖励，1包含奖励, 2只有奖励
			},
			list: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				cateList: [],
				show: false,
				payingMode: this.modelValue
			}
		},
		watch: {
			modelValue(val) {
				this.payingMode = val
			}
		},
		methods: {
			selectPayMode(id) {
				if(![3, 4].includes(id)) {
					this.show = true
					return
				}
				this.payingMode = id
				this.$emit('input', id);
			},
			// async getCateList() {
			// 	let res = await this.$c.fetch(this.$api.config.payCategoryList)
			// 	if (res) {
			// 		// if(!res.find(i => i.id == 3)) res = [...res, ...[{ id: 3, value: '银联' }]]
			// 		this.cateList = this.mode? [...this.cateList, ...res] : res
			// 	} 
			// },
			async getCateList() {
				const res = [{ id: 3, value: '聚合支付'  }]
				this.cateList = this.mode? [...this.cateList, ...res] : res
			}
		},
		mounted() {
			if(this.list.length > 0) {
				this.cateList = this.list
			} else if(this.mode === 2) {
				if (this.$c.mode()) this.cateList = [{ id: 4, value: '奖励支付' }]
			} else {
				if(this.mode === 1 && this.$c.mode()) this.cateList = [{ id: 4, value: '奖励支付' }]
				this.getCateList()
			}
			
		}
	}
</script>

<style lang="scss" scoped>

</style>