<template>
	<view class="page bg-page plr-20">
		<Title title="添加好友" fixed></Title>
		<view class="">
			<u-search v-model="account" placeholder="请输入账号" @search="onSearch" @custom="onSearch"></u-search>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import { searchUser } from '@/utils/nim.js'
	
	export default {
		components: {
			Title
		},
		data() {
			return {
				account: ''
			}
		},
 		onLoad() {
			
		},
		methods: {
			async onSearch() {
				if(!this.account) {
					this.$c.toast('请输入账号')
					return false
				}
				const res = await searchUser(this.account)
				console.log(res)
				if (res) {
					
				}
			}
		}
	}
</script>

<style>
</style>