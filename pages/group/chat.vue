<template>
	<view class="page bg-white flex-col">
		<Title :title="title" bgColor="#fff" isBack @back="$c.goto('/pages/group/index')" @right="onDetail()">
			<template v-slot:right>
				<u-icon name="more-dot-fill" size="18" color="#676C74"></u-icon>
			</template>
		</Title>
		<!-- 消息列表 -->
		<ChatMessageList @reply="handleReply" />
	
		<!-- 输入框 -->
		<ChatInput :reply="reply" :type="mode" @unreply="reply = null" @send="handleSendMsg" />
		
		<!-- 语音通话弹窗 -->
		<view v-if="voiceVisible" class="voice-box flex-col align-center justify-center text-center plr-20 border-box">
			<u-avatar :src="$c.formatImgUrl(friendInfo.avatar)" size="100" :default-url="$c.userAvatar()" class="auto-x"></u-avatar>
			<view class="nickname mt-50">{{ friendInfo.name }}</view>
			<view class="status-text mt-20">{{ voiceStatus }}</view>
					
			<view class="flex justify-center mt-50">
				<button type="error" class="w-247 flex-center rounded-x" size="large" @click="endVoiceCall">挂断</button>
			</view>
		</view>
		
		<view class="">
			<u-modal :show="showNick" title="提示" content='您还未设置昵称' confirmText="去设置" confirmColor="#3D3D3D" cancelColor="#9F9F9F"
				showCancelButton @cancel="$c.goBack()" @confirm="$c.goto('/pages/user/baseInfo');showNick = false"></u-modal>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import ChatInput from './components/ChatInput.vue'
	import ChatMessageList from './components/ChatMessageList.vue'
	import { teamInfo, memberInfo, sendMessage, replyMessage, getMessageList, friendInfo, getUserInfo, clearUnreadCountByIds, getFriendList } from '@/utils/nim.js'
	
	export default {
		components: {
			Title,
			ChatInput,
			ChatMessageList
		},
		data() {
			return {
				teamInfo,
				memberInfo,
				friendInfo,
				chatInfo: '',
				name: '',
				join_info: {},
				reply: null,
				mode: null,
				title: '',
				voiceVisible: false,
				voiceStatus: '正在呼叫...',
				profile: this.$c.profile(),
				showNick: false
			}
		},			
		async onLoad() {
			this.$c.checkNim()
			const id = this.$c.getStorage('conversationId')
			if(!id) {
				this.$c.goto('/pages/group/index')
				return
			}
			this.mode = parseInt(this.$c.getCidInfo(id, 1))
			if(this.mode == 1) {
				const accountId = this.$c.getCidInfo(id, 2)
				await getUserInfo([accountId], 2)
				this.title = friendInfo.name
			} else {
				this.chatInfo = this.$c.getStorage('chatInfo')
				this.title = this.chatInfo.name
				if(!this.chatInfo || Object.keys(this.chatInfo).length === 0) {
					this.$c.toast('参数有误')
					this.$c.goto('/pages/group/index')
					return
				}
			}
			this.getList()
		},
		async onShow() {
			this.profile = await this.$c.checkeLogin(1)
			if(!this.profile.nickname) this.showNick = true
		},
		methods: {
			onDetail() {
				this.mode == 1? this.$c.goto('/pages/group/friendDetail') :  this.$c.goto('/pages/group/detail')
			},
			onReceiveMsg(msg) {
			  this.msgs.push(msg)
			  // 可加滚动到底部逻辑
			},
			handleReply(message) {
			    this.reply = message;  // 保存被回复的消息
			},
			async getList() {
			 	const res = await getMessageList()
				if(res) {
					await clearUnreadCountByIds()
				} else {
					setTimeout(() => {
						this.$c.goto('/pages/group/index')
					}, 1500)
				}
			},
			async handleSendMsg(e) {
				const reply = { ...this.reply }
				this.reply = null
			    const res = reply.messageClientId? await replyMessage(e, reply) : await sendMessage(e)
				if(res && ['text', 'audio'].includes(e.type)) this.onTask()
			},
			onTask() {
				this.$c.fetch(this.$api.config.taskFinish, { id: 3 })
			},
			endVoiceCall() {
				
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
	.voice-box {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: #232323;
		z-index: 999;
		.avatar {
			width: 80px;
			height: 80px;
			border-radius: 50%;
			margin-bottom: 10px;
		}
		.nickname {
			font-size: 16px;
			font-weight: 600;
			margin-bottom: 4px;
		}
		.status-text {
			font-size: 14px;
			color: #888;
		}
	}
</style>