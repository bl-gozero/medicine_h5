<template>
	<view class="page bg-page">
		<Title title="余额充值" />
		<view class="plr-20 pt-20">
			<view class="h-61 rounded-16 flex-between plr-16"
				style="background: linear-gradient(270deg, #92CBCE 4%, #DBEBEB 98%);">
				<text>钱包余额</text>
				<text class="fs-18 fw-7" style="color: #064144;">￥{{ profile.balance }}</text>
			</view>
			<view class="mt-16 fw-7">充值金额</view>
			<view class="mt-20 rounded-8 bg-white flex-start h-56 plr-13">
				<text class="fw-7 fs-20 mr-10">￥</text>
				<u-input v-model="form.amount" placeholder="请输入想要充值的金额" placeholderClass="fs-14" type="number"
					border="none" :formatter="priceFormatter" clearable></u-input>
			</view>
			<view class="mt-20 fw-7">选择支付方式</view>
			<view class="list_box bg-white rounded-8 plr-14 mt-20">
				<view class="flex-between ptb-19" v-for="item in cateList" :key="item.id" @click="form.pay_mode = item.id">
					<view class="flex-start">
						<image :src="`/static/pay/icon/${item.id}.png`" class="i-18 mr-10"></image>
						<text>{{ item.value }}</text>
					</view>
					<u-icon v-if="form.pay_mode == item.id" name="checkmark-circle-fill" :color="$c.baseColor()" size="20"></u-icon>
					<view v-else class="circle"></view>
				</view>
			</view>
		</view>
		<button
			class="bg-base text-white fw-7 fs-14 w-247 h-47 flex-center mt-36 rounded-x"
			@click="doSubmit">立即充值</button>
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
				profile: this.$c.getStorage('profile') || {},
				doSubmit: null,
				cateList: [],
				form: { amount: '', pay_mode: '' }
			}
		},
		onLoad() {
			this.getProfile()
			this.getCateList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if (res) {
					this.profile = res
					this.$c.setStorage('profile', res)
				}
			},
			async getCateList() {
				const res = await this.$c.fetch(this.$api.config.payCategoryList)
				if (res) this.cateList = res
			},
			priceFormatter(value) {
				if (!value) return '';
				let match = value.toString().match(/^\d*(\.?\d{0,2})?/);
				return match ? match[0] : '';
			},
			async onSubmit() {
				if(!this.form.amount) {
					this.$c.toast('请输入想要充值的金额')
					return
				}
				if(!this.form.pay_mode) {
					this.$c.toast('请选择支付方式')
					return
				}
				const res = await this.$c.fetch(this.$api.finance.recharge, this.form)
				if(res) {
					this.$c.toast('充值成功')
					this.form = { amount: '', pay_mode: '' }
				}
			},
		}
	}
</script>

<style>

</style>