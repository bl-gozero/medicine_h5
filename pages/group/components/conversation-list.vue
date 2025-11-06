<template>
	<view class="">
		<view v-if="pinnedConversations.length > 0" class=" bg-white mt-10">
			<view class="fs-12 fw-7 pt-10 flex-start zd_bg plr-20" style="color: #F98D19;">
				<image src="/static/group/setTop.png" style="width: 8.06px;height: 8.74px;"></image>
				<text class="ml-4">置顶</text>
			</view>
			<view class="list_box plr-20" style="margin-top: -8px;">
				<view v-for="item in pinnedConversations" :key="item.conversationId" class="flex-start ptb-16"
					@longpress="showAction(item)" @click="$c.goChat(item)">
					<!-- 群头像 -->
					<u-avatar :src="item.avatar" size="44" :default-url="item.type == 1? $c.userAvatar() : $c.groupAvatar()"
						mode="aspectFill"></u-avatar>

					<!-- 群名称 + 最后一条消息 -->
					<view class="info">
						<view>{{ item.name }}</view>
						<view v-if="item.lastMessage" class="text-info fs-12 mt-5 u-line-1">
							{{ formatMessage(item.lastMessage) }}
						</view>
					</view>

					<!-- 未读数量 -->
					<!-- <view v-if="item.unreadCount > 0" class="unread">{{ item.unreadCount }}</view> -->
					<view class="">{{ $c.formatTime(item.createTime) }}</view>
				</view>
			</view>
		</view>
		<view class="plr-20 bg-white list_box mt-10">
			<view v-for="item in normalConversations" :key="item.conversationId" class="flex-start ptb-16"
				@longpress="showAction(item)" @click="$c.goChat(item)">
				<!-- 群头像 -->
				<view class="relative">
					<u-avatar :src="item.avatar" size="44" :default-url="item.type == 1? $c.userAvatar() : $c.groupAvatar()"
						mode="aspectFill"></u-avatar>
						<u-badge
							:value="item.unreadCount"
							:absolute="true"
							bgColor="#FF2A40"
							color="#fff"
							max="99"
							:offset="[-5, 0]"
						></u-badge>
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
					<view class="ptb-20 border-bottom" @click="pinConversation(target.conversationId)">置顶</view>
					<view class="ptb-20 text-danger border-bottom" @click="deleteConversation(target)">删除</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		globalConversations,
		setTopConversations
	} from '@/utils/nim.js'

	export default {
		data() {
			return {
				defaultAvatar: this.$c.groupAvatar(),
				pinnedIds: uni.getStorageSync('pinnedIds') || [], // 持久化置顶ID
				showOperation: false,
				target: {}
			}
		},
		computed: {
			conversations() {
				return globalConversations.list
			},
			pinnedConversations() {
				return this.conversations
					.filter(c => c.stickTop)
					// .filter(c => this.pinnedIds.includes(c.conversationId))
					.sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))
			},
			normalConversations() {
				return this.conversations
					.filter(c => !c.stickTop)
					.sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0))
			}
		},
		methods: {
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