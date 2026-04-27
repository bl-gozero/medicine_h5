<template>
	<view class="page bg-white">
		<view class="top_box pb-45">
			<Title title="提交订单" bgColor="transparent"></Title>
			<view class="mt-64 text-center">
				<view class="fw-7 text-base">
					<text class="fs-16">￥</text>
					<text class="fs-36">{{ price }}</text>
				</view>
				<view class="mt-13 text-info">创建群聊会费</view>
			</view>
		</view>
		<view class="h-10 bg-page"></view>
		<view class="plr-20">
			<Payment v-model="paying_mode"></Payment>
		</view>
		<view class="absolute left-0 bottom-25 pw-100">
			<button class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white flex-center rounded-x"
				@click="onCheck()">{{ `立即支付￥${ price }` }}</button>
		</view>

		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">需支付</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ price }}</text>
				</view>
				<view class="mt-28 fw-7 text-left">请输入交易密码</view>
				<view class="mt-20">
					<u-code-input v-model="form.password" :maxlength="6" :focus="true" :color="$c.baseColor()"
						borderColor="#EAEAEA" dot @finish="doSubmit"></u-code-input>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import Payment from '../../components/Payment.vue'

	export default {
		components: {
			Title,
			Payment
		},
		data() {
			return {
				cateList: [{
					id: 4,
					value: '奖励'
				}],
				price: '',
				id: 0,
				doSubmit: null,
				showPassword: false,
				form: {
					id: null,
					password: '',
					pay_mode: 0
				},
				paying_mode: {
					id: null,
					is_password: false
				},
			}
		},
		onLoad(p) {
			this.$c.checkeLogin()
			if (p.id) this.form.id = parseInt(p.id)
			this.getInfo()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {

		},
		methods: {
			async getInfo() {
				const res = await this.$c.fetch(this.$api.group.userInfo)
				if (res) {
					this.price = res.amount
				}
			},
			async getCateList() {
				const res = await this.$c.fetch(this.$api.config.payCategoryList)
				if (res) this.cateList = [...this.cateList, ...res]
			},
			onCheck() {
				if (!this.paying_mode) {
					this.$c.toast('请选择支付方式')
					return
				}
				this.form.pay_mode = this.paying_mode.id
				this.form.password = ''
				if (this.paying_mode.is_password) {
					return this.showPassword = true
				}
				this.doSubmit()
			},
			async onSubmit() {
				this.showPassword = false
				const res = await this.$c.fetch(this.$api.group.pay, this.form)
				if (res) {
					this.$c.payJump(res)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top_box {
		background: linear-gradient(180deg, #CDEAEB 0%, #FFFFFF 120px);
	}
</style>