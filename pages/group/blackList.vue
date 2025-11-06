<template>
	<view class="page bg-white plr-20">
		<Title title="好友黑名单" bgColor="#fff" fixed></Title>
		<view class="mt-20">
			<view v-if="!blackList.list.length" class="flex-center h-300 text-info">暂无黑名单</view>
			<view
				v-else
				class="flex-between item-stretch"
				v-for="item in blackList.list"
				:key="item.id"
			>	
				<view class="ptb-10">
					<u-avatar :src="item.userProfile? item.userProfile.avatar : ''" :defaultUrl="$c.userAvatar()" size="42" mode="aspectFill"></u-avatar>
				</view>
				<view class="border-bottom ml-8 flex-between flex-1">
					<view class="u-line-1 flex-1">{{ item.userProfile? item.userProfile.name : '' }}</view>
					<u-button class="text-base border-1 fs-10 lh-8 w-47 h-20 ml-10"
						shape="circle" @click="onRemove(item)">移除</u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import { getBlockList, blackList, removeUserFromBlockList } from '../../utils/nim';
	
	export default {
		components: {
			Title
		},
		data() {
			return {
				blackList,
			}
		},
 		onLoad: function() {
			
		},
		async onShow() {
			await getBlockList()
		},
		methods: {
			async onRemove(item) {
				const res = await removeUserFromBlockList(item.accountId)
				if(res) {
					this.$c.toast('移除成功')
				} else {
					this.$c.toast('移除失败')
				}
			}
		}
	}
</script>

<style>
</style>