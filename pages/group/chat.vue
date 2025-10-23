<template>
	<view class="page bg-white flex-col">
		<Title :title="chatInfo.name" bgColor="#fff" @back="$c.goto('/pages/group/index')" @right="$c.goto('/pages/group/detail')">
			<template v-slot:right>
				<u-icon name="more-dot-fill" size="18" color="#676C74"></u-icon>
			</template>
		</Title>
		<!-- 消息列表 -->
		<ChatMessageList @reply="handleReply" />
	
		<!-- 输入框 -->
		<ChatInput :reply="reply" @unreply="reply = null" @send="handleSendMsg" />
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import ChatInput from './components/ChatInput.vue'
	import ChatMessageList from './components/ChatMessageList.vue'
	import { teamInfo, memberInfo, sendMessage, replyMessage } from '@/utils/nim.js'
	
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
				chatInfo: '',
				name: '',
				join_info: {},
				reply: null
			}
		},			
		async onLoad() {
			this.$c.checkeLogin()
			this.$c.checkNim()
			this.chatInfo = this.$c.getStorage('chatInfo')
			if(!this.chatInfo || Object.keys(this.chatInfo).length === 0) {
				this.$c.toast('参数有误')
				this.$c.goto('/pages/group/index')
				return
			}
		},
		methods: {
			onReceiveMsg(msg) {
			  this.msgs.push(msg)
			  // 可加滚动到底部逻辑
			},
			handleReply(message) {
			    this.reply = message;  // 保存被回复的消息
			},
			async handleSendMsg(e) {
				const reply = { ...this.reply }
				this.reply = null
			    reply.messageClientId? await replyMessage(e, reply) : await sendMessage(e)
			},
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