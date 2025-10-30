<template>
	<view class="page bg-white plr-20">
		<Title title="收到的进群申请" fixed bgColor="#fff" @back="$c.goto('/pages/group/index')" @right="show = true">
			<!-- <template v-slot:right>
				<text class="text-info fs-12" style="text-wrap: nowrap;">全部清除</text>
			</template> -->
		</Title>
		<!-- <view class="mt-10">待处理</view> -->
		<view class="mt-10">
			<view v-if="item.actionType === 0" class="flex-between item-stretch" v-for="item in teamJoinList.list" :key="item.id">
				<!-- <view class="u-line-1 pw-100">{{ item }}</view> -->
				<view class="ptb-10">
					<u-avatar :src="item.user? item.user.avatar : ''" size="44" :default-url="defaultAvatar"
						mode="aspectFill"></u-avatar>
				</view>
				<view class="border-bottom ml-8 flex-1 flex-between">
					<view class="flex-1">
						<view class="u-line-1">{{ item.user? item.user.name : '' }}</view>
						<view class="text-info fs-12 mt-6">申请加入群 {{ item.team? item.team.name : '' }}</view>
					</view>
					<view v-if="item.actionStatus === 0" class="flex-end ml-10">
						<u-button class="bg-white fs-10 lh-8 w-47 h-20 text-base flex-center border-1 plr-0"
							shape="circle" @click="doReject(item)">忽略</u-button>
						<u-button class="bg-base fs-10 lh-8 w-47 h-20 text-white flex-center border-1 ml-10"
							shape="circle" @click="doPass(item)">同意</u-button>
					</view>
					<view v-else-if="item.actionStatus === 1" class="text-base fs-12">已通过</view>
					<view v-else-if="item.actionStatus === 2" class="text-danger fs-12">已拒绝</view>
					<view v-else-if="item.actionStatus === 3" class="text-info fs-12">已过期</view>
				</view>
			</view>
		</view>
		<u-modal :show="show" title="提示" content='确定要清空所有入群申请记录吗？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="show = false" @confirm="onDeleteAll()"></u-modal>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import {
		teamJoinList,
		getTeamJoinList,
		acceptJoinApplication,
		rejectJoinApplication,
		clearAllTeamJoinActionInfo,
		teamUnreadCount
	} from '@/utils/nim.js'
	
	export default {
		components: {
			Title
		},
		data() {
			return {
				teamJoinList,
				show: false,
				defaultAvatar: this.$c.userAvatar(),
				count: 0,
				doPass: null,
				doReject: null
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.$c.checkNim()
			this.doPass = this.$c.onceRequest(this.onPass)
			this.doReject = this.$c.onceRequest(this.onReject)
		},
		onShow() {},
		methods: {
			async onDeleteAll() {
				this.show = false
				const res = await clearAllTeamJoinActionInfo()
			},
			async onPass(item) {
				const res1 = await acceptJoinApplication(item.teamId, item.teamType, item.operatorAccountId)
				if(res1) {
					const res = await this.$c.fetch(this.$api.group.pass, {
						team_id: parseInt(item.teamId),
						account_id: item.operatorAccountId
					})
					if(res) { 
						this.$c.toast('操作成功')
					}
				}
			},
			async onReject(item) {
				const res1 = await rejectJoinApplication(item.teamId, item.teamType, item.operatorAccountId)
				if(res1) {
					const res = await this.$c.fetch(this.$api.group.reject, {
						team_id: parseInt(item.teamId),
						account_id: item.operatorAccountId
					})
					if(res) { 
						this.$c.toast('操作成功')
						await getTeamJoinList()
						await teamUnreadCount()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top_box {
		background: linear-gradient(180deg, #CDEAEB 0%, #FFFFFF 120px);
	}
</style>