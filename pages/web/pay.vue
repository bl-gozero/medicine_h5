<template>
	<view class="">
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: {}
			}
		},
		onLoad(p) {
			this.onPay(p)
		},
		onShow() {},
		methods: {
			onPay(p) {
				if (p.id) p.id = parseInt(p.id)
				if (p.amount) p.amount = parseFloat(p.amount)
				p.paying_mode = 3
				p.pay_mode = 3
				this.data = p
				let apis = { 
					order: this.$api.goods.orderPay, 
					recharge: this.$api.finance.recharge,
					team: this.$api.group.pay
				}
				p?.payType && apis[p.payType] && apis[p.payType](p, {
					jwt: p.token
				}).then(res => {
					this.$c.quickPay(res.jump_url, false)
				}).catch(err => {
				})
			},
			safeNumber(num) {
				const id = Number(num)
				return Number.isInteger(id) && id > 0 ? id : null
			},
		}
	}
</script>

<style lang="scss" scoped>

</style>