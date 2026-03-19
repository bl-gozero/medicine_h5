<template>
	<view class="page bg-page flex-col">
		<Title :title="title[page]" />
		<view v-if="page === 0" class="plr-20">
			<view class="text-center pb-70 border-bottom">
				<view class="fs-16 fw-7 mt-85">填写对方北辰奖励账号</view>
				<view class="text-info mt-20">请确认对方账户信息，资金将实时到账</view>
			</view>
			<view class="ptb-20 flex-between border-bottom">
				<view class="">对方账户</view>
				<u-input v-model="form.to_account" placeholder="手机号/账号" placeholderClass="fs-14 text-info" border="none"
					class="flex-1 mlr-24"></u-input>
				<image src="/static/finance/account.webp" class="i-23"
					@click="$c.goto('/pages/group/myGroup?mode=select')"></image>
			</view>
			<button class="bg-base text-white fw-7 w-247 h-47 mt-70 flex-center rounded-x"
				@click="onCheck()">确认</button>
		</view>
		<view v-if="page === 1" class="flex-1 flex-col">
			<view class="plr-20">
				<view class="">对方账户</view>
				<view class="flex-start mt-20">
					<u-avatar :src="form.avatar" :defaultUrl="$c.userAvatar()" size="38"></u-avatar>
					<view class="ml-13 fs-16 fw-7">{{ form.to_account }}</view>
				</view>
			</view>
			<view class="mt-60 bg-white roundedTop-20 flex-1 plr-20 pt-27 amount">
				<view class="">转账金额</view>
				<view class="border-bottom flex-between ptb-15 mt-10">
					<text class="fs-20 fw-7">￥</text>
					<u-input v-model.number="form.amount" placeholder="请输入金额" placeholderClass="fs-14 text-info"
						type="number" border="none" :formatter="priceFormatter" class="flex-1 ml-10"
						customStyle="font-size: 28px;font-weight: 700;" clearable></u-input>
				</view>
				<view class="mt-15 text-info">当前账户奖励{{ profile.balance }}元</view>
				<button class="bg-base text-white fw-7 w-247 h-47 mt-70 flex-center rounded-x"
					@click="onCheck2()">确认</button>
				<payPassword v-model="form.password" :show.sync="showPassword" :amount="form.amount" @finish="doSubmit">
				</payPassword>
			</view>
		</view>
		<!-- <view v-if="page === 2" class="">
			<view class="mt-10 rounded-14 h-125 text-center pt-50">
				<view class="fs-28 fw-7">-{{ form.amount }}</view>
				<view class="text-info fs-12 mt-15">交易成功</view>
			</view>
			<view class="mt-12 rounded-14 plr-16 ptb-20">
				<view class="flex-between">
					<text>对方账户</text>
					<text class="text-info">{{ form.to_account }}</text>
				</view>
				<view class="flex-between mtb-20">
					<text>交易方式</text>
					<text class="text-info">奖励</text>
				</view>
				<view class="flex-between mtb-20">
					<text>时间</text>
					<text class="text-info">{{ this.$c.formatDateTime(new Date()) }}</text>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import payPassword from '../../components/payPassword.vue'
	import {
		checkFriend,
		sendMessage
	} from '../../utils/nim'

	export default {
		components: {
			Title,
			payPassword
		},
		data() {
			return {
				profile: this.$c.profile(),
				form: {
					avatar: '',
					to_account: '',
					password: '',
					amount: null
				},
				title: ['填写账号', '奖励转账', '账单详情'],
				page: 0,
				showPassword: false,
				doSubmit: null,
				to_nick: ''
			}
		},
		async onLoad(p) {
			if (p.to_account) {
				this.page = 1
				this.getAccountByIM(p.to_account)
			} else {
				this.$c.removeStorage('friendAccount')
			}
			this.profile = await this.$c.checkeLogin(1)
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const account = this.$c.getStorage('friendAccount')
			if (account.account) {
				this.form.to_account = account.account
				this.form.avatar = account.avatar
				this.onCheck(0)
			}
		},
		methods: {
			priceFormatter(value) {
				if (!value) return '';
				let match = value.toString().match(/^\d*(\.?\d{0,2})?/);
				return match ? match[0] : '';
			},
			onCheck2() {
				if (!this.form.amount) {
					this.$c.toast('请输入转账金额')
					return
				}
				this.form.password = ''
				this.showPassword = true
			},
			async onCheck(check = 1) {
				if (!this.form.to_account) {
					this.$c.toast('请输入手机号/账号')
					return
				}
				if (this.form.to_account == this.profile.account) {
					this.$c.toast('无法给自己转账')
					return
				}
				if (!check || await this.getAccount()) this.page = 1
			},
			async onSubmit() {
				if (this.form.to_account == this.profile.account) {
					this.$c.toast('无法给自己转账')
					return
				}
				const res = await this.$c.fetch(this.$api.finance.transfer, this.form)
				if (res) {
					await this.getInfos(this.form.amount)
					this.profile = await this.$c.getProfile()
					this.form.amount = null
					await this.$c.toast('转账成功')
					this.$c.goBack()
				}
			},
			async getInfos(amount) {
				const res = await this.$c.fetch(this.$api.group.searchUser, {
					name: this.form.to_account
				})
				// console.log(this.form.to_account, res)
				if (res) {
					// const res1 = await checkFriend([res.account_id])
					if (1 || res1 && res1[res.account_id]) {
						const text = `${this.profile.account}向${this.form.to_account}转账了${amount}元`
						const cid = this.$c.getCid(res.account_id, 1)
						sendMessage({
							type: 'hint',
							value: text
						}, cid)
					}
				}
			},
			async getAccount() {
				const res = await this.$c.fetch(this.$api.user.accountInfo, {
					account: this.form.to_account
				})
				if (res) {
					this.form.to_account = res.account
					this.form.avatar = res.avatar
					return true
				}
				return false
			},
			async getAccountByIM(account_id) {
				const res = await this.$c.fetch(this.$api.group.account_id_profile, {
					account_id: account_id
				})
				if (res) {
					this.form.to_account = res.account
					this.form.avatar = res.avatar
					this.onCheck(0)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.border-bottom {
		border-bottom: 1px solid #F0F0F0;
	}

	.amount {
		::v-deep .uni-input-input {
			font-size: 28px !important;
			font-weight: 700 !important;
		}
	}
</style>