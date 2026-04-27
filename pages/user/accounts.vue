<template>
	<view class="page bg-page plr-20">
		<Title title="账号管理" fixed @right="onEditAccounts()">
			<template v-slot:right>
				<view>{{ isEdit ? '退出' : '编辑' }}</view>
			</template>
		</Title>
		<view class="bg-white plr-15 border-box rounded-8 mt-10">
			<view class="flex-between fgap-13 ptb-12 border-bottom" v-for="(item, index) in accounts"
				@click="onAccounts(item, index)">
				<u-avatar :src="item.avatar" size="32" :default-url="$c.userAvatar()"></u-avatar>
				<view class="flex-1">
					<view class="u-line-1">{{ item.nickname || '账号' + (index + 1) }}</view>
					<view class="text-info fs-12">{{ item.account }}</view>
				</view>
				
				<u-icon v-if="item.account == profile.account" name="checkbox-mark" size="16"
					:color="$c.baseColor()"></u-icon>
				<u-icon v-else-if="isEdit" name="minus-circle-fill" size="16" color="#FF441F"></u-icon>
			</view>
			<view class="flex-between ptb-12" @click="$c.goto('/pages/index/login')">
				<view class="flex-start fgap-13">
					<view class="i-32 flex-center rounded" style="background: #EEEEEE;">
						<u-icon name="plus" size="14" color="#A5A5A5"></u-icon>
					</view>
					<text>添加账号或注册登录</text>
				</view>
				<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
			</view>
		</view>
		<view class="bg-white plr-15 border-box rounded-8 mt-10">
			<view class="flex-between ptb-12" @click="$c.goto('/pages/user/delete')">
				<view class="flex-start fgap-13">
					<view class="i-32 flex-center rounded" style="background: #EEEEEE;">
						<u-icon name="man-delete" size="20" color="#A5A5A5"></u-icon>
					</view>
					<view class="">
						<view>注销当前账号</view>
						<view class="text-info fs-12">注销成功后无法恢复，请谨慎操作</view>
					</view>
				</view>
				<u-icon name="arrow-right" size="12" color="#7D7D7D"></u-icon>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
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
				accounts: [],
				isEdit: false
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.accounts = this.$c.getStorage('accounts') || []
		},
		methods: {
			async onAccounts(item, index) {
				if (item.account == this.profile.account) return
				if (this.isEdit) {
					this.accounts.splice(index, 1)
					this.$c.setStorage('accounts', this.accounts)
				} else {
					if (!item.jwt) {
						await this.$c.toast('登录已失效，需重新登录')
						this.$c.goto('/pages/index/login')
						return
					}
					this.$c.setStorage('jwt', item.jwt)
					this.profile = item
					this.profile = await this.$c.getProfile()
					this.$c.toast('切换成功')
				}
			},
			onEditAccounts() {
				this.isEdit = !this.isEdit
			}
		}
	}
</script>

<style>
	.menu_box>*:not(:last-child) {
		border-bottom: 1px solid #F5F5F5;
	}

	.btn {
		height: 52px;
		font-size: 14px;
		background: #fff;
		border-radius: 8px !important;
	}
</style>