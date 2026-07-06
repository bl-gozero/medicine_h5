<template>
	<view class="">
		<Qrcode />
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
				if (p.paying_mode) p.paying_mode = parseInt(p.paying_mode)
				if (p.pay_mode) p.pay_mode = parseInt(p.pay_mode)
				this.data = p
				let apis = { 
					order: this.$api.goods.orderPay, 
					recharge: this.$api.finance.recharge,
					team: this.$api.group.pay
				}
				p?.payType && apis[p.payType] && apis[p.payType](p, {
					jwt: p.token
				}).then(res => {
					this.$c.payJump(res)
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