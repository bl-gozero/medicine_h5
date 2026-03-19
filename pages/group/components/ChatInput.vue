<template>
	<view class="chat-input-wrapper">
		<view class="flex-between ptb-8 ptb-8 plr-6 border-box rounded-8" style="background: #F0F0F0;">
			<!-- 语音相关 -->
			<!-- <image :src="showRecord? '/static/chat/text.png' : '/static/chat/sound.png'" class="i-27" @click="showRecord = !showRecord"></image> -->
			<image src="/static/chat/more.png" class="i-27" @click="showFunc = !showFunc"></image>

			<!-- 输入框 -->
			<view class="flex-1 ml-10">
				<view v-if="teamInfo.chatBannedMode === 1" class="" style="color: #C0C4CC">群禁言中...</view>
				<u-input v-else-if="!showRecord" v-model="inputValue" placeholder="请输入您想说的..." border="none"
					@confirm="sendMessage"></u-input>
				<view v-else class="text-center flex-1 ml-10" @touchstart="startRecord" @touchend="stopRecord">按住说话
				</view>
				<view v-if="reply" class="flex-between mt-6 p-6 rounded-4" style="background: #E1E1E1;">
					<text class="text-10 text-info u-line-1 mr-10">回复 {{ reply.fromNick || reply.senderId }}
						{{ $c.formatMessage(reply) }}</text>
					<u-icon name="close-circle-fill" size="18" @click="clearRepay()"></u-icon>
				</view>
			</view>

			<!-- 表情 -->
			<!-- <view class="i-27 ml-10 flex-center" @click="toggleEmoji">😊</view> -->

			<!-- <image src="/static/chat/more.png" class="i-27 ml-10" @click="showFunc = !showFunc"></image> -->

			<button v-if="!showRecord" class="bg-base text-white fw-5 w-60 h-32 flex-center rounded-x"
				@click="sendMessage()">发送</button>
		</view>

		<!-- 表情面板 -->
		<view v-if="showEmoji" class="emoji-panel">
			<text v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)">{{ emoji }}</text>
		</view>

		<view v-if="showFunc" class="pb-16 func_box">
			<view class="mt-16" v-for="item in funcs" :key="item.id">
				<view v-if="item.type.includes(type)" class="text-center fs-12" @click="onFuncs(item)">
					<view class="i-63 rounded-12 flex-center" style="background: #F0F0F0;">
						<image :src="item.icon" class="i-30"></image>
					</view>
					<view class="mt-7">{{ item.name }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		teamInfo,
		friendInfo
	} from '@/utils/nim.js'

	export default {
		name: "ChatInput",
		props: {
			reply: {
				type: Object,
				default: null
			},
			type: {
				type: Number,
				default: null
			}
		},
		data() {
			return {
				teamInfo,
				inputValue: '',
				showEmoji: false,
				showFunc: false,
				showRecord: false,
				voiceStartTime: 0,
				recording: false,
				emojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊'],
				funcs: [{
						id: 1,
						name: '相册',
						icon: '/static/chat/picture.png',
						code: 'album',
						type: [1, 2]
					},
					{
						id: 2,
						name: '拍照',
						icon: '/static/chat/photo.png',
						code: 'camera',
						type: [1, 2]
					},
					{
						id: 3,
						name: '文件',
						icon: '/static/chat/file.png',
						code: 'file',
						type: [1, 2]
					},
					// { id: 4, name: '发起语音', icon: '/static/chat/phone.png', code: 'phone', type: [1] },
					{
						id: 5,
						name: '转账',
						icon: '/static/chat/transfer.webp',
						code: 'transfer',
						type: [1]
					},
				]
			}
		},
		methods: {
			onFuncs(item) {
				if (item.code == 'album') this.pickImage('album')
				if (item.code == 'camera') this.pickImage('camera')
				if (item.code == 'file') this.pickFile()
				if (item.code == 'phone') {}
				if (item.code == 'transfer') {
					this.$c.goto(`/pages/finance/transfer?to_account=${friendInfo.accountId}`)
					this.showFunc = false
				}
			},
			replyMsg(reply) {
				switch (reply.messageType) {
					case 0:
						return reply.text || ''
					case 1:
						return '[图片消息]'
					case 2:
						return '[语音消息]'
					case 3:
						return '[视频消息]'
					case 6:
						return '[文件消息]'
					default:
						return '消息'
				}
			},
			clearRepay() {
				this.$emit('unreply');
			},
			toggleEmoji() {
				this.showEmoji = !this.showEmoji
			},
			addEmoji(emoji) {
				this.inputValue += emoji
			},
			pickImage(sourseType) {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					sourseType: sourseType,
					success: res => {
						this.showFunc = false
						res.tempFilePaths.forEach(path => {
							this.$emit('send', {
								type: 'image',
								value: path
							})
						})
					}
				})
			},
			pickFile() {
				uni.chooseFile({
					count: 1,
					success: res => {
						this.showFunc = false
						const filePath = res?.tempFilePaths?.[0]
						const fileName = res?.tempFiles?.[0]?.name
						if (filePath && fileName) {
							this.$emit('send', {
								type: 'file',
								value: filePath,
								name: fileName
							})
						}
					}
				})
			},
			sendMessage() {
				this.showFunc = false
				if (!this.inputValue) return
				this.$emit('send', {
					type: 'text',
					value: this.inputValue
				})
				this.inputValue = ''
			},
			// 开始录音
			startRecord() {
				if (this.recording) return
				this.recording = true
				const recorder = uni.getRecorderManager()
				recorder.start({
					format: 'mp3'
				})
				recorder.onStop(res => {
					this.recording = false
					this.$emit('send', {
						type: 'audio',
						value: res.tempFilePath,
						duration: res.duration
					})
				})
			},
			// 停止录音
			stopRecord() {
				if (!this.recording) return
				const recorder = uni.getRecorderManager()
				recorder.stop()
			}
		}
	}
</script>

<style scoped lang="scss">
	.chat-input-wrapper {
		padding: 5px 20px 10px;
		background-color: #fff;
		box-sizing: border-box;
	}

	.send-btn {
		background-color: #1AAD19;
		color: #fff;
		padding: 6px 12px;
		border-radius: 20px;
	}

	.send-btn:disabled {
		background-color: #ccc;
	}

	.emoji-panel {
		flex-wrap: wrap;
		display: flex;
		padding: 10px;
		background-color: #fff;
	}

	.emoji-panel text {
		font-size: 20px;
		margin: 4px;
	}

	.func_box {
		display: grid;
		grid-template-columns: repeat(4, 63px);
		justify-content: space-between;
		row-gap: 10px;
	}

	::v-deep .uni-input-input {
		font-size: 14px !important;
	}
</style>