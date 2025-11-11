<template>
	<view class="">
		<!-- 置顶 -->
		<view class=" bg-white mt-10">
			<view class="fs-12 fw-7 pt-10 flex-start zd_bg plr-20" style="color: #F98D19;">
				<image src="/static/group/setTop.png" style="width: 8.06px;height: 8.74px;"></image>
				<text class="ml-4">置顶</text>
			</view>
			<view class="plr-20 list_box" style="margin-top: -8px;">
				<!-- 官方群 -->
				<view v-for="item in officials" :key="item.team_id" class="">
					<view v-if="!pinned_ids.includes(item.team_id + '')" class="flex-start ptb-16"
						@click="onOfficial(item)">
						<!-- 群头像 -->
						<u-avatar :src="$c.formatImgUrl(item.icon)" size="44" :default-url="$c.groupAvatar()"
							mode="aspectFill"></u-avatar>
							
						<!-- 群名称 + 信息 -->
						<view class="info mr-30">
							<view>{{ item.name }}</view>
							<view class="text-info fs-12 mt-5 u-line-1">
								{{ item.intro }}
							</view>
						</view>
							
						<view v-if="item.join_state && item.join_state.id == 2"
							class="text-info fs-12 lh-10 w-53 h-21 rounded-x flex-center"
							style="border: 0.5px solid #9F9F9F;">{{ item.join_state.value }}</view>
						<view v-else-if="item.join_state && item.join_state.id == 1"
							class="text-white fs-12 lh-10 w-53 h-21 rounded-x flex-center" style="background: #9DC7CA;">
							{{ item.join_state.value }}</view>
						<view v-else class="text-white bg-base fs-12 lh-10 w-53 h-21 rounded-x flex-center">加入</view>
					</view>
				</view>
				
				<view v-for="item in pinnedConversations" :key="item.conversationId" class="flex-start ptb-16"
					@longpress="showAction(item)" @click="$c.goChat(item)">
					<!-- 群头像 -->
					<u-avatar :src="$c.formatImgUrl(item.avatar)" size="44"
						:default-url="item.type == 1? $c.userAvatar() : $c.groupAvatar()" mode="aspectFill"></u-avatar>
				
					<!-- 群名称 + 最后一条消息 -->
					<view class="info">
						<view>{{ item.name }}</view>
						<view v-if="item.lastMessage" class="text-info fs-12 mt-5 u-line-1">
							{{ formatMessage(item.lastMessage) }}
						</view>
					</view>
				
					<!-- 未读数量 -->
					<!-- <view v-if="item.unreadCount > 0" class="unread">{{ item.unreadCount }}</view> -->
					<view class="self-start text-info fs-12">{{ $c.formatTime(item.createTime) }}</view>
				</view>
			</view>
		</view>

		<view class="plr-20 bg-white list_box mt-10">
			<view v-for="item in normalConversations" :key="item.conversationId" class="flex-start ptb-16"
				@longpress="showAction(item)" @click="$c.goChat(item)">
				<!-- 群头像 -->
				<view class="relative">
					<u-avatar :src="$c.formatImgUrl(item.avatar)" size="44"
						:default-url="item.type == 1? $c.userAvatar() : $c.groupAvatar()" mode="aspectFill"></u-avatar>
					<u-badge :value="item.unreadCount" :absolute="true" bgColor="#FF2A40" color="#fff" max="99"
						:offset="[-5, 0]"></u-badge>
				</view>

				<!-- 群名称 + 最后一条消息 -->
				<view class="info">
					<view>{{ item.name }}</view>
					<view v-if="item.lastMessage" class="text-info fs-12 mt-5 u-line-1">
						{{ formatMessage(item.lastMessage) }}
					</view>
				</view>

				<!-- 未读数量 -->
				<!-- <view v-if="item.unreadCount > 0" class="unread">{{ item.unreadCount }}</view> -->
				<view class="self-start text-info fs-12">{{ $c.formatTime(item.createTime) }}</view>
			</view>
		</view>

		<!-- 群操作 -->
		<u-popup :show="showOperation" mode="center" round="20" @close="showOperation = false">
			<view class="w-200 plr-20">
				<view class="text-center">
					<view
						v-if="!target.stickTop && !isOfficial(target.conversationId)"
						class="ptb-20 border-bottom" @click="pinConversation(target.conversationId)">置顶</view>
					<view class="ptb-20 text-danger border-bottom" @click="deleteConversation(target)">删除</view>
				</view>
			</view>
		</u-popup>

		<!-- 加入 -->
		<u-popup :show="showJoin" mode="bottom" round="20" closeable @close="showJoin = false">
			<view class="p-20 pb-30">
				<view class="flex-center">
					<u-avatar :src="group.icon" size="58" default-url="/static/group/default.png"
						mode="aspectFill"></u-avatar>
				</view>
				<view class="text-center ptb-15 border-bottom fs-16 fw-6">{{ group.name }}({{ group.member_count }})
				</view>
				<view class="fs-12 text-info mtb-15">群介绍</view>
				<view class="">{{ group.intro }}</view>
				<u-button v-if="group.join_state && group.join_state.id == 2"
					class="fw-7 fs-14 w-224 h-43 mt-20 text-danger mt-70 border-0" style="background: #f8f8f8;"
					shape="circle" text="退出该群聊" @click="doQuit"></u-button>
				<u-button v-else-if="group.join_state && group.join_state.id == 1"
					class="fw-7 fs-14 w-224 h-43 mt-20 text-white mt-70" style="background: #9DC7CA;" shape="circle"
					:text="group.join_state.value"></u-button>
				<u-button v-else class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white mt-70" shape="circle" text="申请加入"
					@click="doJoin"></u-button>
				<view class="text-center fs-10 mt-10">
					<text class="text-info">维护群内生态健康，请遵守</text>
					<text class="text-base" @click="$c.goto('/pages/index/userAgreement')">《群聊公约》</text>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		globalConversations,
		setTopConversations,
		joinTeam
	} from '@/utils/nim.js'

	export default {
		data() {
			return {
				defaultAvatar: this.$c.groupAvatar(),
				pinnedIds: uni.getStorageSync('pinnedIds') || [], // 持久化置顶ID
				showOperation: false,
				target: {},
				official_list: [],
				group: {},
				showJoin: false,
				doJoin: null
			}
		},
		computed: {
			conversations() {
				return globalConversations.list
			},
			officials() {
				return this.official_list
					.filter(item => !this.pinned_ids.includes(item.team_id + '')) || []
			},
			official_ids() {
				return (this.official_list || []).map(item => item.team_id + '')
			},
			pinned_ids() {
				return this.pinnedConversations.map(item => this.$c.getCidInfo(item.conversationId, 2))
			},
			pinnedConversations() {
				return this.conversations
					.filter(c => c.stickTop || this.isOfficial(c.conversationId))
					.sort((a, b) => {
						const aOfficial = this.isOfficial(a.conversationId)
						const bOfficial = this.isOfficial(b.conversationId)

						// 1️⃣ 官方的始终排最前
						if (aOfficial && !bOfficial) return -1
						if (!aOfficial && bOfficial) return 1

						// 2️⃣ 其次按时间排序（最新在前）
						return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0)
					})
			},
			normalConversations() {
				return this.conversations
					.filter(c => !c.stickTop && !this.isOfficial(c.conversationId))
					.sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))
			}
		},
		created() {
			this.doJoin = this.$c.onceRequest(this.onJoin)
			this.getOfficialList()
		},
		methods: {
			isOfficial(cid) {
				return this.official_ids.includes(this.$c.getCidInfo(cid, 2))
			},
			
			// 显示操作菜单
			showAction(item) {
				this.showOperation = true
				this.target = item
			},

			// 置顶会话
			pinConversation(id) {
				this.showOperation = false
				setTopConversations(id)
			},

			// 官方群
			async getOfficialList() {
				const res = await this.$c.fetch(this.$api.group.groupList, {
					page: 1,
					limit: 20,
					search: {
						join_state: 0,
						is_preferred: 0,
						is_official: 1
					}
				})
				if (res) this.official_list = res
			},

			onOfficial(item) {
				if (item?.join_state?.id == 2) {
					item.conversationId = this.$c.getCid(item.team_id, 2)
					this.$c.goChat(item)
				} else {
					this.group = item
					this.showJoin = true
				}
			},

			async onJoin() {
				this.showJoin = false
				const res1 = await joinTeam(this.group.team_id, 1)
				if (res1) {
					const res = await this.$c.fetch(this.$api.group.join, {
						team_id: this.group.team_id
					})
					if (res) {
						this.updateInfo()
					}
				}
			},

			async updateInfo() {
				const res = await this.$c.fetch(this.$api.group.join_info, {
					team_id: this.group.team_id
				})
				if (res) {
					this.official_list = this.official_list.map(item => {
						if (item.team_id === this.group.team_id) {
							return {
								...item,
								...res
							} // 举例更新状态
						}
						return item
					})
				}
			},

			// 删除会话
			async deleteConversation(item) {
				this.showOperation = false
				try {
					await this.$nim.V2NIMLocalConversationService.deleteConversation(item.conversationId)
					const idx = this.conversations.findIndex(i => i.conversationId === item.conversationId)
					if (idx !== -1) this.conversations.splice(idx, 1)
					const pinIdx = this.pinnedIds.indexOf(item.conversationId)
					if (pinIdx !== -1) this.pinnedIds.splice(pinIdx, 1)
					uni.setStorageSync('pinnedIds', this.pinnedIds)
				} catch (err) {
					console.error('删除会话失败', err)
				}
			},

			formatMessage(msg) {
				if (!msg) return ''
				switch (msg.messageType) {
					case 0:
						return msg.text || ''
					case 1:
						return '[图片消息]'
					case 2:
						return '[语音消息]'
					case 3:
						return '[视频消息]'
					case 4:
						return '[位置消息]'
					case 5:
						return '[通知消息]'
					case 6:
						return '[文件消息]'
					case 7:
						return '[音视频通话]'
					case 10:
						return '[提示消息]'
					case 100:
						return '[自定义消息]'
					default:
						return '[未知消息]'
				}
			},
		}
	}
</script>

<style scoped>
	.info {
		flex: 1;
		margin-left: 20rpx;
	}

	.unread {
		background: red;
		color: #fff;
		padding: 2%;
		border-radius: 50%;
		font-size: 24rpx;
	}

	.zd_bg {
		background: linear-gradient(180deg, #FFF2C9 1.5px, rgba(255, 242, 201, 0.34) 16px, rgba(255, 246, 216, 0) 28px);
	}
</style>