<template>
	<view class="page bg-page plr-20">
		<Title title="添加好友" fixed></Title>
		<view class="mt-10">
			<u-search v-model="name" placeholder="请输入账号/昵称" @search="onSearch" @custom="onSearch"></u-search>
		</view>
		<view v-if="searched" class="mt-30">
			<view v-if="info.name" class="flex-between">
				<u-avatar :src="info.avatar" size="44" mode="aspectFill"></u-avatar>
				<view class="flex-1 mlr-10">{{ info.name }}</view>
				<view class="">
					<view v-if="added" class="h-30 text-info fs-12 flex-end">{{ added == 1? '等待对方验证' : '已添加' }}</view>
					<button v-else class="bg-base fs-10 w-68 h-25 text-white plr-0 flex-center rounded-x"
						@click="onAdd()">添加好友</button>
				</view>
			</view>
			<view v-else class="text-info text-center h-300 flex-center">未找到用户</view>
		</view>

		<u-modal v-model="show" title="请输入信息" show-cancel-button confirm-text="确定" cancel-text="取消" @confirm="onConfirm"
			@cancel="show = false">
			<view style="padding: 20px;">
				<u-input v-model="msg" placeholder="你好，我是。。。" border="surround"></u-input>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import {
		addFriend,
		checkFriend
	} from '../../utils/nim'

	export default {
		components: {
			Title
		},
		data() {
			return {
				name: '',
				msg: '',
				info: {},
				searched: false,
				added: 0, // 0 可添加 1 待确认 2 已添加
				show: false
			}
		},
		onLoad() {

		},
		methods: {
			async onSearch() {
				if (!this.name) {
					this.$c.toast('请输入账号')
					return false
				}
				this.info = {}
				this.searched = false
				this.added = 0
				const res = await this.$c.fetch(this.$api.group.searchUser, {
					name: this.name
				})
				if (res) {
					this.info = res
					this.check()
					this.searched = true
				}
			},
			async check() {
				const res = await checkFriend([this.info.account_id])
				if (res && res[this.info.account_id]) this.added = 2
			},
			async onAdd() {
				const res = await addFriend(this.info.account_id)
				if (res) {
					this.added = 1
					this.$c.toast('提交成功，等待对方验证')
				}
			}
		}
	}
</script>

<style>
</style>