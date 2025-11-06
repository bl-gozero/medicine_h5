<template>
	<view class="page bg-white plr-20">
		<Title title="通讯录" bgColor="#fff" fixed ph></Title>
		<view class="mt-10 mb-20 flex-start fs-16">
			<view class="" :class="type == 1 && 'nav_active'" @click="type = 1">群聊</view>
			<view class="ml-43" :class="type == 2 && 'nav_active'" @click="type = 2">好友</view>
		</view>
		<view v-if="type == 1" class="">
			<view v-if="!list.length && !payList.length" class="flex-center h-300 text-info">尚未加入群组</view>
			<view v-if="payList.length > 0" class="">
				<view class="flex-between item-stretch" v-for="item in payList" :key="item.id" @click="group = item;showOperation = true">
					<view class="ptb-10">
						<view class="relative">
							<u-avatar :src="item.icon" size="42" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
							<view 
								v-if="item.role && item.role.id < 3" 
								:class="item.role.id == 1? 'group-owner' : 'group-admin'"
							>{{ item.role.value }}</view>
						</view>
					</view>
					<view class="border-bottom flex-between ml-8 flex-1">
						<view class="u-line-1 flex-1 mr-8">{{ item.name }}</view>
						<view
							v-if="item.is_payment && item.is_payment.id == 2"
							class="bg-base text-white fs-12 lh-8 fw-5 w-53 h-21 rounded-x flex-center plr-0"
							shape="circle"
						>{{ item.is_payment.value }}</view>
					</view>
				</view>
			</view>
			<view class="">
				<view 
					v-if="item.is_payment && item.is_payment.id == 1" 
					class="flex-between item-stretch"
					v-for="item in list"
					:key="item.id"
					@click="onGroup(item)"
				>
					<view class="ptb-10">
						<view class="relative">
							<u-avatar :src="item.icon" size="42" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
							<view 
								v-if="item.role && item.role.id < 3" 
								:class="item.role.id == 1? 'group-owner' : 'group-admin'"
							>{{ item.role.value }}</view>
						</view>
					</view>
					<view class="border-bottom flex-between ml-8 flex-1">
						<view class="u-line-1 flex-1">{{ item.name }}</view>
						<view 
							v-if="item.is_verify && item.is_verify.id == 1"
							class="text-white fs-12 lh-8 w-53 h-21 rounded-x flex-center ml-8"
							style="background: #D6D6D6;"
						>审核中</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="type == 2" class="">
			<view v-if="!friendList.list.length" class="flex-center h-300 text-info">尚未添加好友</view>
			<view
				v-else
				v-for="item in friendList.list"
				:key="item.id"
				@click="onFriend(item)"
			>
				<view v-if="!item.isBlocked" class="flex-between item-stretch">
					<view class="ptb-10">
						<u-avatar :src="item.userProfile? item.userProfile.avatar : ''" :defaultUrl="$c.userAvatar()" size="42" mode="aspectFill"></u-avatar>
					</view>
					<view class="border-bottom ml-8 flex-start flex-1">
						<view class="u-line-1 flex-1">{{ item.userProfile? item.userProfile.name : '' }}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 群操作 -->
		<u-popup :show="showOperation" mode="bottom" round="20" @close="showOperation = false">
			<view class="plr-20 pt-5 pb-50">
				<view class="text-center">
					<view 
						class="ptb-20 border-bottom" 
						@click="$c.goto(`/pages/group/pay?id=${group.id}`);showOperation = false"
					>去支付</view>
					<view class="ptb-20 text-danger border-bottom" @click="doDelete">删除</view>
				</view>
				<u-button
					class="fw-7 fs-14 w-224 h-43 mt-20 border-0"
					style="background-color: #f8f8f8;"
					shape="circle"
					text="取消"
					@click="showOperation = false"
				></u-button>
			</view>
		</u-popup>
		
		<!-- 好友操作 -->
		<u-popup :show="showOperation2" mode="bottom" round="20" @close="showOperation = false">
			<view class="plr-20 pt-5 pb-50">
				<view class="text-center">
					<view class="ptb-20 border-bottom" @click="onFriendChat()">进入聊天</view>
					<view class="ptb-20 border-bottom" @click="onFriendBlack()">加入黑名单</view>
					<view class="ptb-20 text-danger border-bottom" @click="onClose();showDeleteConfirm = true">删除</view>
				</view>
				<u-button
					class="fw-7 fs-14 w-224 h-43 mt-40 border-0"
					style="background-color: #f8f8f8;"
					shape="circle"
					text="取消"
					@click="showOperation2 = false"
				></u-button>
			</view>
		</u-popup>
		
		<u-modal :show="showDeleteConfirm" title="提示" content='确定要删除该好友吗？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showDeleteConfirm = false" @confirm="onFriendDelete()"></u-modal>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import { 
		friendList,
		getFriendList,
		deleteFriend,
		addUserToBlockList
	} from '../../utils/nim'
	
	export default {
		components: {
			Title
		},
		data() {
			return {
				friendList,
				list: [],
				payList: [],
				group: {},
				showOperation: false,
				showDeleteConfirm: false,
				doDelete: null,
				type: 1,
				showOperation2: false,
				friend: {},
				mode: ''
			}
		},
		onLoad(p) {
			if(p?.mode == 'select') {
				this.mode = p.mode
				this.type = 2
			}
			this.$c.checkeLogin()
			this.doDelete = this.$c.onceRequest(this.onDelete)
		},
		async onShow() {
			this.getPayList()
			this.getList()
			await getFriendList()
		},
		methods: {
			async getList() {
				const res = await this.$c.fetch(this.$api.group.myList)
				if(res) this.list = res
			},
			async getPayList() {
				const res = await this.$c.fetch(this.$api.group.payingList)
				if(res) this.payList = res
			},
			async onDelete() {
				this.showOperation = false
				this.showOperation2 = false
				if(this.type == 1) {
					const res = await this.$c.fetch(this.$api.group.payDelete, { id: this.group.id })
					if(res) {
						this.getPayList()
						this.getList()
					}
				} else if(type == 2) {
					const res = await deleteFriend(friend.accountId)
					if(res) await getFriendList()
				}
				
			},
			onGroup(item) {
				if(item.is_payment.id == 1 && item.is_verify.id == 2) {
					item.conversationId = this.$c.getCid(item.team_id, 2)
					this.$c.goChat(item)
				}
			},
			onClose() {
				this.showOperation = false
				this.showOperation2 = false
				this.showDeleteConfirm = false
			},
			async onFriend(item) {
				if(this.mode == 'select') {
					const res = await this.$c.fetch(this.$api.group.account_id_profile, { account_id: item.accountId })
					if(res) {
						this.$c.setStorage('friendAccount', res)
						this.$c.goBack()
					}
				}
				this.friend = item 
				this.showOperation2 = true
			},
			onFriendChat() {
				this.onClose()
				this.friend.conversationId = this.$c.getCid(this.friend.accountId, 1)
				this.$c.goChat(this.friend)
			},
			async onFriendBlack() {
				this.onClose()
				const res = await addUserToBlockList(this.friend.accountId)
				if(res) {
					this.$c.toast('操作成功')
				} else {
					this.$c.toast('操作失败')
				}
			},
			async onFriendDelete() {
				this.onClose()
				const res = await deleteFriend(this.friend.accountId)
				if(res) {
					this.$c.toast('删除成功')
				} else {
					this.$c.toast('删除失败')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>