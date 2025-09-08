<template>
	<view class="page bg-white plr-20">
		<Title title="我的群聊" bgColor="#fff" fixed ph></Title>
		<view class="">
			<view class="flex-between item-stretch" v-for="item in list" :key="item.team_id">
				<view class="relative ptb-6">
					<u-avatar :src="item.icon" size="42" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
					<view 
						v-if="item.role && item.role.id < 3" 
						class="absolute left-0 right-0 auto-x bottom-0 text-base fs-8 lh-8 w-28 h-13 flex-center rounded-4"
						style="background: #B3E5E8;"
					>{{ item.role.value }}</view>
				</view>
				<view class="border-bottom flex-between ml-8 flex-1">
					<view class="u-line-1 flex-1">{{ item.name }}</view>
					<view 
						v-if="item.is_verify && item.is_verify == 2"
						class="text-white fs-12 lh-10 w-36 h-14 rounded-x flex-center ml-8"
						style="background: #9DC7CA;"
					>审核中</view>
				</view>
			</view>
		</view>
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
				list: []
			}
		},
		onLoad() {
			this.getList()
		},
		onShow() {
		},
		methods: {
			async getList() {
				const res = await this.$c.fetch(this.$api.group.myList)
				if(res) this.list = res
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>