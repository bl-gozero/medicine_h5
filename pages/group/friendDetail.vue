<template>
	<view class="page bg-page plr-20">
		<Title title="聊天设置" fixed />
		<view class=" plr-15 ptb-14 bg-white flex-between mt-12 rounded-8">
			<u-avatar :src="$c.formatImgUrl(friendInfo.avatar)" size="47" :default-url="$c.userAvatar()" mode="aspectFill"></u-avatar>
			<view class="flex-1 ml-9">
				<view class="">{{ friendInfo.name }}</view>
				<u--text mode="name" :text="account" format="encrypt"></u--text>
				<!-- <view class="mt-3">{{ account }}</view> -->
			</view>
		</view>
		<view class="plr-15 bg-white mt-12 rounded-8 list_box">
			<!-- <view class="flex-between ptb-18">
				<text>举报</text>
				<view class="flex-end flex-1 ml-20">
					<view class="fs-12 lh-8 text-info" @click="$c.goto('/pages/index/web')">联系客服</view>
					<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
				</view>
			</view> -->
			<view class="flex-between ptb-18" @click="onDeleteConversation()">
				<text>清空聊天记录</text>
				<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
			</view>
			<!-- <view class="flex-between ptb-18" @click="$c.goto('/pages/finance')">
				<text>查看交易记录</text>
				<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
			</view> -->
		</view>
		
		<view class="plr-15 bg-white mt-12 rounded-8 list_box">
			<view class="flex-between ptb-18">
				<text class="">加入黑名单</text>
				<u-switch 
					v-model="friendInfo.isBlocked"
					:activeColor="$c.baseColor()"
					inactiveColor="#DFDFDF"
					:activeValue="true"
					:inactiveValue="false"
					size="20"
					asyncChange
					@change="onBlack"
				></u-switch>
			</view>
		</view>
		
		<u-button
			class="bg-white pw-100 rounded-8 text-danger flex-center mt-30 border-0 ptb-18"
			text="删除好友"
			@click="showDelete = true"
		></u-button>
		
		<view class="h-20"></view>
		
		<u-modal :show="showDelete" title="提示" content='确定要删除该好友吗？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="showDelete = false" @confirm="onDelete()"></u-modal>
	</view> 
</template>

<script>
	import Title from '../../components/Title.vue'
	import { 
		friendInfo,
		getFriendInfo,
		addUserToBlockList,
		removeUserFromBlockList,
		deleteConversation,
		deleteFriend,
		clearConversations,
		clearHistoryMessage
	} from '@/utils/nim.js'
	
	export default {
		components: {
			Title
		},
		data() {
			return {
				friendInfo,
				showDelete: false,
				account: ''
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.$c.checkNim()
			this.getInfo()
		},
		methods: {
			async getInfo() {
				const res = await getFriendInfo()
				if(res) {
					// 获取好友账号
					this.getAccountByIM(friendInfo.accountId)
				} else {
					setTimeout(() => {
						this.$c.goto('/pages/group/index')
					}, 1500)
				}
			},
			async onDelete() {
				this.showDelete = false
				const res = await deleteFriend(friendInfo.accountId)
				if(res) {
					this.$c.toast('删除成功')
				} else {
					this.$c.toast('删除失败')
				}
			},
 			async onDeleteConversation() {
				// const cid = this.$c.getCid(friendInfo.accoundId, 1)
				const res = await clearHistoryMessage()
				if(res) this.$c.toast('清除成功')
			},
			async onBlack() {
				if(friendInfo.isBlocked) {
					const res1 = await removeUserFromBlockList(friendInfo.accountId)
					if(res1) this.getInfo()
				} else {
					const res2 = await addUserToBlockList(friendInfo.accountId)
					if(res2) this.getInfo()
				}
			},
			async getAccountByIM(account_id) {
				const res = await this.$c.fetch(this.$api.group.account_id_profile, { account_id: account_id })
				if(res) {
					this.account = res.account
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-textarea {
		padding: 0 !important;
	}
	.placeholderClass {
		font-size: 14px !important;
		color: #989898 !important;
	}
	::v-deep .u-textarea__field {
		font-size: 14px !important;
		color: #3d3d3d !important;
	}
	.lv_box {
		width: 308px;
		height: 280px;
		border-radius: 20px;		
		background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);
	}
</style>