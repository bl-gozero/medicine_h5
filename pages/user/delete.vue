<template>
	<view class="page bg-page plr-20 border-box">
		<Title title="注销" fixed />
		<view class="mt-10 ffw-7">当前账号</view>
		<view class="mt-17 flex-start">
			<u-avatar :src="profile.avatar" size="38" :default-url="$c.userAvatar()"></u-avatar>
			<text class="fs-16 ml-10">{{ profile.account }}</text>
			<text v-if="status == 2" class="text-danger fs-12">（该账号处于冷静期）</text>
		</view>
		<view class="mt-25 fw-7">注销后，您将放弃如下服务和权益</view>
		<image :src="$c.img('/static/user/delete.webp')" class="pw-100 mt-10" mode="widthFix"></image>
		<view class="absolute left-0 right-0 bottom-30 plr-20 flex-between fgap-10">
			<button v-if="status == 2" class="btn" @click="onCancel()">撤回注销</button>
			<button v-else class="btn" @click="onShowDelete(1)">申请注销</button>
			<button class="btn" @click="onShowDelete(2)">快速注销</button>
		</view>
		
		<u-popup :show="showConfirm" mode="center" round="20" @close="showConfirm = false;">
			<view class="p-20 border-box popup-box">
				<view class="popup-title text-black">{{ mode == 1 ? '申请注销' : '快速注销' }}</view>
				<view v-if="mode == 1" class="popup-text flex-1 text-left">
					1、请按照注销协议进行注销；<br/>
					2、申请注销后，该账号会出处于7日冷静期，部分功能会受到限制，冷静期内，您可申请撤回注销；<br/>
					3、注销成功后将无法恢复账户及相关数据，且所有资产和权益将清零。<br/>
				</view>
				<view v-if="mode == 2" class="popup-text flex-1 text-left">
					1、请按照注销协议进行注销；<br/>
					2、注销成功后将无法恢复账户及相关数据，且所有资产和权益将清零。该操作不可撤销，请谨慎操作。
				</view>
				<view class="mt-10 mb-27 flex-center">
					<u-checkbox-group v-model="agreed">
						<u-checkbox name="agreed" size="16" :activeColor="$c.baseColor()" :inactiveColor="$c.baseColor()" />
					</u-checkbox-group>
					<text class="fs-10">
						<text>阅读并同意</text>
						<text class="text-base" @click="$c.goto('/pages/index/protocols?type=12')">《用户注销协议》</text>
					</text>
				</view>
				<view class="popup-buttons">
					<view class="">
						<button class="bold fs-16 w-135 h-51 flex-center text-black rounded-x bg-white"
							style="border: 1px solid #D8D8D8;" @click="onDelete()">确认注销</button>
					</view>
					<view class="">
						<button class="bold fs-16 w-135 h-51 bg-base text-white flex-center rounded-x"
							@click="showConfirm = false;">暂时取消</button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import toast from '../../uni_modules/uview-ui/libs/config/props/toast'
import Title from '@/components/Title.vue'
	import {
		logoutNIM
	} from '@/utils/nim.js'

	export default {
		components: {
			Title
		},
		data() {
			return {
				profile: this.$c.profile(),
				agreed: [],
				showConfirm: false,
				status: 1,
				mode: 1,
				accounts: [],
				accountIndex: null,
				doSubmit: null
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getUserInfo()
			this.doSubmit = this.$c.onceRequest(this.onDelete)
		},
		methods: {
			onShowDelete(n) {
				this.mode = n
				this.agreed = []
				this.showConfirm = true
			},
			async onDelete() {
				if (!this.agreed.includes('agreed')) {
					this.$c.toast('阅读并同意《用户注销协议》')
					return
				}
				this.status = 2
				this.showConfirm = false
				if (this.mode == 1) {
					uni.showLoading()
					this.accounts[this.accountIndex].deleted_at = Date.now() + 7 * 24 * 60 * 60 * 1000 // 七天后
					this.$c.setStorage('accounts', this.accounts)
					setTimeout(() => {
						uni.hideLoading()
						this.$c.toast('申请成功，您的账号已进入冷静期')
					}, 1000)
				} else if (this.mode == 2) {
					const res = await this.$c.fetch(this.$api.user.deleteAccount)
					if (res) {
						this.$c.toast('注销成功')
						this.accounts.splice(this.accountIndex, 1)
						this.$c.setStorage('accounts', this.accounts)
						this.$c.removeStorage('jwt')
						this.$c.goto('/pages/index/login', 3)
					}
				}
			},
			onCancel() {
				uni.showLoading()
				this.status = 1
				this.accounts[this.accountIndex].deleted_at = null
				this.$c.setStorage('accounts', this.accounts)
				setTimeout(() => {
					uni.hideLoading()
					this.$c.toast('撤回成功')
				}, 1000)
			},
			getUserInfo() {
				this.accounts = this.$c.getStorage('accounts') || []
				this.accountIndex = this.accounts.findIndex(i => i.id === this.profile.id)
				if (this.accountIndex > -1) {
					const account = this.accounts[this.accountIndex]
					if (account?.deleted_at && account.deleted_at > Date.now()) this.status = 2
				}
			}
		}
	}
</script>

<style>
	.btn {
		height: 52px;
		font-size: 14px;
		background: #fff;
		border-radius: 8px !important;
		border: 1px solid #D8D8D8;
		flex: 1;
	}
</style>