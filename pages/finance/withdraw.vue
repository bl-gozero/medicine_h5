<template>
	<view class="page bg-page">
		<Title title="余额提现">
			<template v-slot:right>
			  <text class="text-base" @click="$c.goto('/pages/finance/withdrawList')">提现明细</text>
			</template>
		</Title>
		<view class="plr-20 pt-20">
			<view class="h-61 rounded-16 flex-between plr-16"
				style="background: linear-gradient(270deg, #92CBCE 4%, #DBEBEB 98%);">
				<text>提现金额</text>
				<text class="fs-18 fw-7" style="color: #064144;">￥{{ profile.balance }}</text>
			</view>
			<view class="mt-16 fw-7">充值金额</view>
			<view class="mt-20 rounded-8 bg-white flex-start h-56 plr-13">
				<text class="fw-7 fs-20 mr-10">￥</text>
				<u-input v-model="form.amount" placeholder="请输入想要提现的金额" placeholderClass="fs-14" type="number"
					border="none" :formatter="priceFormatter" clearable></u-input>
				<text class="text-base ml-10" @click="form.amount = profile.balance">全部提现</text>
			</view>
			<view class="mt-24 flex-between">
				<text class="fw-7">到账账户</text>
				<view class="flex-start" @click="$c.goto('/pages/user/bindCard')">
					<text class="fs-12 lh-8">账户绑定管理</text>
					<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
				</view>
			</view>
			<view class="list_box bg-white rounded-8 plr-14 mt-20">
				<view class="flex-between ptb-19" v-for="item in cardList" :key="item.id" 
					@click="form.card_holder_id = item.id;form.full_name = item.full_name;form.card_number = item.card_number">
					<view class="flex-start">
						<image :src="`/static/pay/icon/${item.category.id}.png`" class="i-18 mr-10"></image>
						<text>{{ item.category.value }}</text>
					</view>
					<u-icon v-if="form.card_holder_id == item.id" name="checkmark-circle-fill" :color="$c.baseColor()" size="20"></u-icon>
					<view v-else class="circle"></view>
				</view>
			</view>
			<button
				class="bg-base text-white fw-7 fs-14 w-247 h-47 flex-center mt-36 rounded-x"
				@click="check()">提现</button>
			<view class="mt-24 rounded-8 p-12 border-box fs-12 lh-15" style="background: #F0ECE1;color: #99935C;">
				<view class="flex-start">
					<u-icon name="bell-fill" size="12" color="#9D9762"></u-icon>
					<text class="fw-7 ml-5" style="color: #9D9762;">提现条件</text>
				</view>
				<view class="">1. 最低提现金额： 单次提现金额需满 ¥100方可申请提现。</view>
				<view class="">2. 提现方式： 提现支持绑定的微信、支付宝或银行卡账户，提现前请确保账户信息准确无误。</view>
				<view class="">3. 账时间： 提现申请将在1-3个工作日内处理完成，节假日顺延。</view>
			</view>
		</view>
		<view class="h-60"></view>
		
		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">向{{ form.full_name + form.card_number }}提现</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ form.amount }}</text>
				</view>
				<view class="mt-28 fw-7 text-left">请输入交易密码</view>
				<view class="mt-20">
					<u-code-input 
						v-model="form.password" 
						:maxlength="6" 
						:focus="true"
						:color="$c.baseColor()"
						borderColor="#EAEAEA"
						dot 
						@finish="doSubmit"></u-code-input>
				</view>
			</view>
		</u-popup>
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
				cardList: [],
				form: { amount: '', password: '', card_holder_id: '', full_name: '',  card_number: '' },
				showPassword: false
			}
		},
		onLoad() {
			this.getProfile()
			this.getCardList()
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
			async getCardList() {
				const res = await this.$c.fetch(this.$api.user.cardList, { category: 0 })
				if(res) this.cardList = res;
			},
			priceFormatter(value) {
				if (!value) return '';
				let match = value.toString().match(/^\d*(\.?\d{0,2})?/);
				return match ? match[0] : '';
			},
			check() {
				if(!this.form.amount) {
					this.$c.toast('请输入想要提现的金额')
					return
				}
				if(!this.form.card_holder_id) {
					this.$c.toast('请选择到账账户')
					return
				}
				this.form.password = ''
				this.showPassword = true
			},
			async onSubmit() {
				if(!this.form.amount) {
					this.$c.toast('请输入想要提现的金额')
					return
				}
				if(!this.form.card_holder_id) {
					this.$c.toast('请选择到账账户')
					return
				}
				const res = await this.$c.fetch(this.$api.finance.withdraw, this.form)
				if(res) {
					this.$c.toast('提交成功，请等待审核')
					this.form = { amount: '', pay_mode: '' }
				}
				this.showPassword = false
			},
		}
	}
</script>

<style lang="less" scoped>
	
</style>