<template>
	<view class="page bg-white plr-20">
		<Title title="收到的进群申请" fixed bgColor="#fff" isBack @back="$c.goto('/pages/group/index')"></Title>
		<view class="mt-10 flex-start fs-16">
			<view class="" :class="type == 1 && 'nav_active'" @click="type = 1">群聊</view>
			<view class="ml-43" :class="type == 2 && 'nav_active'" @click="type = 2">好友</view>
		</view>
		<view v-if="type == 1" class="mt-10">
			<view v-if="!teamJoinList.list.length" class="flex-center h-300 text-info">暂无验证消息</view>
			<view v-else class="">
				<view v-if="item.actionType === 0" class="flex-between item-stretch" v-for="item in teamJoinList.list" :key="item.id">
					<!-- <view class="u-line-1 pw-100">{{ item }}</view> -->
					<view class="ptb-10">
						<u-avatar :src="$c.formatImgUrl(item.user? item.user.avatar : '')" size="44" :default-url="defaultAvatar"
							mode="aspectFill"></u-avatar>
					</view>
					<view class="border-bottom ml-8 flex-1 flex-between">
						<view class="flex-1">
							<view class="u-line-1">{{ item.user? item.user.name : '' }}</view>
							<view class="text-info fs-12 mt-6">申请加入群 {{ item.team? item.team.name : '' }}</view>
						</view>
						<view v-if="item.actionStatus === 0" class="flex-end ml-10">
							<button class="bg-white fs-10 lh-8 w-47 h-20 text-base flex-center border-1 plr-0 flex-center rounded-x"
								@click="doReject(item)">忽略</button>
							<button class="bg-base fs-10 lh-8 w-47 h-20 text-white flex-center border-1 plr-0 ml-10 flex-center rounded-x"
								@click="doPass(item)">同意</button>
						</view>
						<view v-else-if="item.actionStatus === 1" class="text-base fs-12">已通过</view>
						<view v-else-if="item.actionStatus === 2" class="text-danger fs-12">已拒绝</view>
						<view v-else-if="item.actionStatus === 3" class="text-info fs-12">已过期</view>
					</view>
				</view>
			</view>
		</view>
		<view v-else-if="type == 2" class="mt-10">
			<view v-if="!friendJoinList.list.length" class="flex-center h-300 text-info">暂无验证消息</view>
			<view v-else class="">
				<view class="flex-between item-stretch" v-for="item in friendJoinList.list" :key="item.id">
					<view class="ptb-10">
						<u-avatar :src="$c.formatImgUrl(item.user? item.user.avatar : '')" size="44" :default-url="defaultAvatar"
							mode="aspectFill"></u-avatar>
					</view>
					<view class="border-bottom ml-8 flex-1 flex-between">
						<view class="flex-1">
							<view class="u-line-1">{{ item.user? item.user.name : '' }}</view>
							<view class="text-info fs-12 mt-6">添加您为好友</view>
						</view>
						<view v-if="item.status === 0" class="flex-end ml-10">
							<button class="bg-white fs-10 lh-8 w-47 h-20 text-base flex-center border-1 plr-0 flex-center rounded-x"
								shape="circle" @click="doReject(item)">拒绝</button>
							<button class="bg-base fs-10 lh-8 w-47 h-20 text-white flex-center border-1 plr-0 ml-10 flex-center rounded-x"
								shape="circle" @click="doPass(item)">同意</button>
						</view>
						<view v-else-if="item.status === 1 || item.status === 4" class="text-base fs-12">已通过</view>
						<view v-else-if="item.status === 2" class="text-danger fs-12">已拒绝</view>
						<view v-else-if="item.status === 3" class="text-info fs-12">已过期</view>
					</view>
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
		friendJoinList,
		getTeamJoinList,
		acceptJoinApplication,
		rejectJoinApplication,
		clearAllTeamJoinActionInfo,
		teamUnreadCount,
		acceptAddApplication,
		rejectAddApplication,
		getFrienApplicaionList,
		frienUnreadCount,
		sendMessage
	} from '@/utils/nim.js'
	
	export default {
		components: {
			Title
		},
		data() {
			return {
				friendJoinList,
				teamJoinList,
				show: false,
				defaultAvatar: this.$c.userAvatar(),
				count: 0,
				doPass: null,
				doReject: null,
				type: 1
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
				if(this.type == 1) {
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
				} else if(this.type == 2) {
					const res = await acceptAddApplication(item)
					if(res) {
						await getFrienApplicaionList()
						await frienUnreadCount()
						setTimeout(() => {
							const text = '我已经同意了你的好友申请，现在开始聊天吧~'
							const cid = this.$c.getCid(item.applicantAccountId, 1)
							sendMessage({ type: 'text', value: text }, cid)
						}, 2000)
					}
				}
			},
			async onReject(item) {
				if(this.type == 1) {
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
				} else if(this.type == 2) {
					const res = await rejectAddApplication(item)
					if(res) {
						getFrienApplicaionList()
						frienUnreadCount()
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