<template>
	<view class="page bg-page plr-20">
		<Title title="群聊设置" fixed />
		<view class="list_box plr-15 bg-white mt-12 rounded-8">
			<view class="ptb-14 flex-between" @click="$c.goto('/pages/group/info/baseInfo')">
				<u-avatar :src="$c.formatImgUrl(teamInfo.avatar)" size="47" :default-url="$c.groupAvatar()" class="" mode="aspectFill"></u-avatar>
				<view class="flex-1 mlr-9">
					<view class="u-line-1">{{ teamInfo.name }}</view>
					<view class="text-info fs-12 mt-9">{{ teamInfo.intro }}</view>
				</view>
				<image v-if="memberInfo.memberRole === 1" src="/static/icon/edit.png" class="i-15"></image>
			</view>
			<view class="ptb-18">
				<view class="flex-between">
					<text>群成员({{ teamInfo.memberCount }})</text>
					<view class="flex-start" @click="$c.goto('/pages/group/info/member')">
						<text class="text-info">全部</text>
						<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
					</view>
				</view>
				<view class="">
					<u-grid col="5">
						<u-grid-item
							v-for="(item, index) in members"
							:key="item.account_id"
						>
							<view class="pt-14 text-center">
								<view class="relative flex-center">
									<u-avatar :src="item.avatar" size="42" :default-url="$c.userAvatar()" mode="aspectFill"></u-avatar>
									<view 
										v-if="item.role && (item.role.id == 1 || item.role.id == 2)" 
										:class="item.role.id == 1? 'group-owner' : 'group-admin'"
									>{{ item.role.value }}</view>
								</view>
								<text class="u-line-1 text-info fs-10 mt-7">{{ item.name }}</text>
							</view>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
			<view class="ptb-14">
				<view class="flex-between" @click="$c.goto('/pages/group/info/qrcode')">
					<text>群二维码</text>
					<view class="flex-start">
						<image src="/static/icon/qr.png" class="i-12"></image>
						<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
					</view>
				</view>
				<view class="mt-10 text-info fs-12">可保存到相册分享给朋友</view>
			</view>
		</view>
		<view class="plr-15 bg-white mt-12 rounded-8 list_box">
			<view class="flex-between ptb-18" @click="$c.goto('/pages/group/info/announcement')">
				<text>群公告</text>
				<view class="flex-end flex-1 ml-20">
					<view class="fs-12 text-info u-line-1">{{ teamInfo.announcement || '未设置' }}</view>
					<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
				</view>
			</view>
			<view v-if="memberInfo.memberRole === 1" class="flex-between ptb-18" @click="$c.goto('/pages/group/info/manage')">
				<text>群管理</text>
				<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
			</view>
			<view v-model="typeof teamInfo.stickTop === 'boolean'" class="flex-between ptb-18">
				<text>置顶聊天</text>
				<u-switch
					v-model="teamInfo.stickTop"
					:activeColor="$c.baseColor()"
					inactiveColor="#DFDFDF"
					:activeValue="true"
					:inactiveValue="false"
					size="20"
					asyncChange
					@change="pinConversation"
				></u-switch>
			</view>
			<view  v-if="memberInfo.memberRole > 0 && (teamInfo.chatBannedMode == 1 || teamInfo.chatBannedMode == 0)" class="flex-between ptb-18">
				<text>群禁言</text>
				<u-switch
					v-model="teamInfo.chatBannedMode"
					:activeColor="$c.baseColor()"
					inactiveColor="#DFDFDF"
					:activeValue="1"
					:inactiveValue="0"
					size="20"
					asyncChange
					@change="onMute"
				></u-switch>
			</view>
		</view>
		
		<view class="plr-15 bg-white mt-12 rounded-8 list_box">
			<view class="flex-between ptb-18">
				<text>举报</text>
				<view class="flex-end flex-1 ml-20">
					<view class="fs-12 lh-8 text-info" @click="$c.goto('/pages/index/web')">联系客服</view>
					<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
				</view>
			</view>
			<view class="flex-between ptb-18" @click="onClearConversation()">
				<text>清空聊天记录</text>
				<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
			</view>
		</view>
		
		<u-button
			v-if="memberInfo.memberRole === 1"
			class="bg-white pw-100 re rounded-8 text-danger flex-center mt-11 border-0 ptb-18"
			text="解散群聊"
			@click="showDelete = true"
		></u-button>
		<u-button
			v-else
			class="bg-white pw-100 re rounded-8 text-danger flex-center mt-11 border-0 ptb-18"
			text="删除并退出"
			@click="showQuit = true"
		></u-button>
		
		<view class="h-20"></view>
		
		<u-modal :show="showQuit" title="退出群聊" content='是否确定退出该群聊？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="showQuit = false" @confirm="doQuit"></u-modal>
		
		<u-modal :show="showDelete" title="解散群聊" content='是否确定解散该群聊？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="showDelete = false" @confirm="doDelete"></u-modal>
	</view> 
</template>

<script>
	import Title from '../../components/Title.vue'
	import { 
		teamInfo, 
		setTopConversations, 
		setTeamMute, 
		clearHistoryMessage, 
		memberInfo, 
		leaveTeam,
		deleteConversation,
		dismissTeam
	} from '@/utils/nim.js'
	
	export default {
		components: {
			Title
		},
		data() {
			return {
				teamInfo,
				memberInfo,
				memberSearch: { page: 1, limit: 10, team_id: null, search: { name: '' } },
				members: [],
				doDelete: null,
				doQuit: null,
				showDelete: false,
				showQuit: false,
				info: teamInfo
			}
		},
		watch: {
			teamInfo(newValue) {
			    this.info = newValue;
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.$c.checkNim()
			const info = this.$c.getStorage('chatInfo') || {}
			if(!info || Object.keys(info).length === 0 || !info.team_id) {
				this.$c.toast('参数有误')
				this.$c.goto('/pages/group/index')
				return
			}
			this.memberSearch.team_id = info.team_id
			this.doDelete = this.$c.onceRequest(this.onDelete)
			this.doQuit = this.$c.onceRequest(this.onQuit)
			// this.onRoleInfo(info.team_id, this.$c.getStorage('profile').account)
			this.getMembers()
		},
		methods: {
			async getMembers() {
				const res = await this.$c.fetch(this.$api.group.memberList, this.memberSearch)
				if(res) {
					this.members = res.list
				} 
			},
			async pinConversation(e) {
				const nimInfo = this.$c.getStorage('nimInfo')
				if(!nimInfo.account) {
					this.$c.toast('操作失败')
					return
				}
				const id = `${nimInfo.account}|2|${this.info.teamId}`
				const res = await setTopConversations(id)
				if(res) this.teamInfo.stickTop = e
			},
			async onMute(e) {
				const res = await setTeamMute(this.info, e)
				if(res) this.teamInfo.chatBannedMode = e
			},
			async onDelete() {
				this.showDelete = false
				const team_id = parseInt(this.teamInfo.teamId)
				if(!team_id) return
				this.onDeleteConversation()
				const res = await this.$c.fetch(this.$api.group.teamDelete, { team_id: team_id })
				if(res) {
					this.$c.removeStorage('chatInfo')
					setTimeout(() => {
						this.$c.goto('/pages/group/index')
					}, 1500)
				}
			},
			async onQuit() {
				this.showQuit = false
				const team_id = parseInt(this.teamInfo.teamId)
				if(!team_id) return
				this.onDeleteConversation()
				const res1 = await leaveTeam() 
				if(res1) {
					const res = await this.$c.fetch(this.$api.group.quit, { team_id: team_id })
					if(res) {
						this.$c.removeStorage('chatInfo')
						this.$c.toast('退出成功')
						setTimeout(() => {
							this.$c.goto('/pages/group/index')
						}, 1500)
					}
				}
			},
			async onDeleteConversation() {
				const cid = this.$c.getStorage('conversationId')
				if(cid) await deleteConversation(cid)
			},
 			async onClearConversation() {
				const res = await clearHistoryMessage()
				if(res) this.$c.toast('清除成功')
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