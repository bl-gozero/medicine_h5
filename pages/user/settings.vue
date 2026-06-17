<template>
	<view class="page bg-page">
		<Title title="设置" />
		<view class="plr-20">
			<view class="menu_box bg-white plr-15 rounded-8 mt-12" v-for="(item, index) in list" :key="index">
				<view class="menu ptb-14 flex-between" v-for="(i, j) in item" :key="j" @click="onMenu(i)">
					<text class="">{{ i.name }}</text>
					<view class="flex-end">
						<text v-if="i.type == 'account'" class="text-info">{{ profile.account }}</text>
						<u-avatar v-else-if="i.type == 'avatar'" :src="profile.avatar" size="55" :default-url="$c.userAvatar()" class="mr-10"></u-avatar>
						<u-icon v-if="i.url" name="arrow-right" size="12" color="#7D7D7D"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="fixed bottom-45 left-0 right-0 ">
			<button class="btn border-0" style="border: 1px solid #F0F0F0 !important;"
				@click="$c.goto('/pages/user/accounts')">切换账号</button>
			<button class="btn text-base border-1 mt-8"
				@click="onLogOut()">退出登录</button>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import { logoutNIM } from '@/utils/nim.js'

	export default {
		components: {
			Title
		},
		data() {
			return {
				profile: this.$c.profile() || {},
				list: [
					[{
							name: '我的信息',
							type: 'link',
							url: '/pages/user/baseInfo'
						},
						{
							name: '账号',
							type: 'account'
						},
						{
							name: '我的二维码',
							type: 'link',
							url: '/pages/user/qrcode'
						}
					],
					[{
							name: '更改登录密码',
							type: 'link',
							url: '/pages/user/loginPassword'
						},
						// #ifndef MP
						{
							name: '更改交易密码',
							type: 'link',
							url: '/pages/user/payPassword'
						},
						{
							name: '忘记交易密码',
							type: 'link',
							url: '/pages/user/forgotPassword'
						}
						// #endif
					],
					[{
							name: '账户绑定管理',
							type: 'link',
							url: '/pages/user/bindCard'
						},
						{
							name: '地址管理',
							type: 'link',
							url: '/pages/user/address'
						}
					]
				],
				avatar: ''
			}
		},
		onLoad() {
			this.$c.checkeLogin()
		},
		onShow() {
			this.profile = this.$c.profile()
		},
		methods: {
			onLogOut() {
				logoutNIM()
			},
			onMenu(i) {
				this.$c.goto(i.url)
			}
		}
	}
</script>

<style>
	.menu_box>*:not(:last-child) {
		border-bottom: 1px solid #F5F5F5;
	}
	.btn {
		font-weight: 700;
		width: 247px;
		height: 47px;
		font-size: 14px;
		background: #fff;
	}
</style>