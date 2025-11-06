<template>
	<view class="chat-list relative">
		<scroll-view class="absolute top-0 left-0 right-0 bottom-0 plr-20 border-box" scroll-y :scroll-top="scrollTop"
			:scroll-with-animation="true">
			<view :id="`msg-${index}`" v-for="(item, index) in messages" :key="item.messageClientId || index">
				<!-- 通知类消息居中显示 -->
				<view v-if="item.messageType == 5" class="">
					<view 
						class="fs-12 text-center pb-20"
						style="color: #A7A7A7;"
						v-for="i in renderNotice(item)"
					>{{ i }}</view>
				</view>
				<!-- <view v-else-if="item.messageType == 10 && item.text.indexOf('转账') > -1" class="">
					<view 
						class="fs-12 text-center pb-20"
						style="color: #A7A7A7;"
					>{{ item.isSelf? `你向${friendInfo.name}${item.text}` : `${item.fromNick}向你${item.text}` }}</view>
				</view> -->
				<view v-else-if="item.messageType == 10 && item.text" class="">
					<view 
						class="fs-12 text-center pb-20"
						style="color: #A7A7A7;"
					>{{ item.text }}</view>
				</view>
				<view v-else-if="item.revokeType === 2" class="fs-12 text-center pb-20" style="color: #A7A7A7;">
					<text>{{ item.isSelf ? '你' : (item.fromNick || item.senderId) }}{{ item.postscript }}</text>
					<!-- <text v-if="item.messageType === 0 && item.isSelf" class="text-primary ml-10" @click="onRevokeEdit(item)">重新编辑</text> -->
				</view>
				<view v-else class="">
					<!-- 时间分割 -->
					<view v-if="isTimeGap(index)" class="time-divider pb-20">
						<text>{{ $c.formatTime(item.createTime) }}</text>
					</view>

					<!-- 消息气泡 -->
					<view class="" :class="['message-item pb-20', item.isSelf ? 'self' : 'other']">
						<u-avatar v-if="!item.isSelf" :src="item.avatar" size="28"
							:default-url="$c.userAvatar()" @click="onAvatar(item)"></u-avatar>
						<view class="plr-5 relative" style="max-width: 70%;" @longpress="tipItem = item;showTips = true">
							<view v-if="!item.isSelf" class="fs-12 lh-13 pb-3 text-info">{{ item.fromNick }}</view>
							<!-- 文字类消息 -->
							<view v-if="item.messageType === 0" class="bubble">
								<text>{{ item.text }}</text>
							</view>
							<view v-if="item.messageType === 1" class="">
								<u-image :src="item.attachment.url" width="100" height="auto" bgColor="transparent"
									mode="widthFix">
									<template v-slot:loading>
										<view class="pt-100">
											<u-loading-icon color="#9F9F9F" class="mt-200"></u-loading-icon>
										</view>
									</template>
								</u-image>
							</view>
							<!-- 语音信息 -->
							<view v-if="item.messageType === 2" class="bubble" @click="playAudio(item)">
								<view :class="`flex-between w-${voiceWidth(item)}`">
									<text v-if="item.isSelf"
										class="">{{ item.attachment ? parseInt(item.attachment.duration / 1000) : 0 }}''</text>
									<view class="flex-center" :class="item.messageClientId === playingId && 'playing'">
										<image
											:src="item.isSelf? '/static/chat/voice_white.png' : '/static/chat/voice_black.png' "
											style="width: 10.72px;height: 13.96px;"></image>
									</view>
									<text v-if="!item.isSelf"
										class="">{{ item.attachment ? parseInt(item.attachment.duration / 1000) : 0 }}''</text>
								</view>
							</view>
							<view v-if="item.messageType === 3" class="w-230">
								<video style="max-width: 70%;" :src="item.attachment.url"
									:poster="item.attachment.cover || '/static/chat/video_placeholder.png'"
									:controls="true" :width="item.attachment.width"
									:height="item.attachment.height"></video>
							</view>
							<!-- 文件消息 -->
							<view v-if="item.messageType === 6" class="bubble w-230 flex-between"
								style="background-color: #F0F0F0;color: #3d3d3d;" @click="onOpenFile(item)">
								<view class="flex-1">
									<view class="u-line-1">{{ item.attachment? item.attachment.name : '未知文件' }}</view>
									<view class="fs-12 text-info lh-13">{{ fileSize(item) }}</view>
								</view>
								<image src="/static/chat/list_file.png" class="i-23  ml-8"></image>
							</view>
							
							<!-- 回复信息 -->
							<view v-if="item.threadReply" 
								class="flex-between mt-6 fs-10 reply" style="background: #E1E1E1;"
							>{{ formatReplyInfo(item) }}</view>
							
							<!-- TOOLTIP -->
							<view v-if="tipItem.messageClientId === item.messageClientId && showTips" class="zb_tooltip__mask" @click="tipItem = {}"></view>
							<view 
								v-if="tipItem.messageClientId === item.messageClientId  && showTips"
								class="absolute flex-between p-16 border-box text-white fs-10 top-0 rounded-8 tooltip"
								:class="!item.isSelf? 'left-0' : 'right-0'"
								style="background: #4C4C4C;transform: translateY(-105%);z-index: 10;text-wrap: nowrap;"
							>
								<view v-if="item.messageType === 0" class="text-center" @click="showTips = false;$c.copy(item.text)">
									<image src="/static/chat/tip_copy.png" class="i-16"></image>
									<view class="">复制</view>
								</view>
								<view class="text-center" @click="handleReply(item)">
									<image src="/static/chat/tip_reply.png" class="i-16"></image>
									<view class="">回复</view>
								</view>
								<view class="text-center" @click="showTips = false;showDelete = true;">
									<image src="/static/chat/tip_delete.png" class="i-16"></image>
									<view class="">删除</view>
								</view>
								<view v-if="item.isSelf && item.sendingState === 1" class="text-center" @click="showTips = false;showRevoke = true;">
									<image src="/static/chat/tip_undo.png" class="i-16"></image>
									<view class="">撤销</view>
								</view>
								<!-- <view class="text-center">
									<image src="/static/chat/tip_top.png" class="i-16"></image>
									<view class="">置顶</view>
								</view>
								<view class="text-center">
									<image src="/static/chat/tip_top.png" class="i-16"></image>
									<view class="">取消置顶</view>
								</view> -->
							</view>
						</view>
						<u-avatar v-if="item.isSelf" :src="item.avatar" size="28"
							:default-url="$c.userAvatar()"></u-avatar>
					</view>
				</view>
			</view>
		</scroll-view>
		
		<u-modal :show="showDelete" title="删除" content='删除此消息' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="showDelete = false" @confirm="onDeleteMessage()"></u-modal>
			
		<u-modal :show="showRevoke" title="撤回" content='撤回此消息' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
					@cancel="showRevoke = false" @confirm="onRevokeMessage()"></u-modal>	
			
		<!-- 预览 -->
		<u-popup :show="showPicture" mode="center" bgColor="#000" closeable="" @close="showPicture = false">
			<view class="pt-25 plr-30 pb-35">

			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		messageList,
		teamInfo,
		memberInfo,
		deleteMessage,
		revokeMessage,
		friendInfo
	} from '@/utils/nim.js'

	export default {
		name: "ChatMessageList",
		props: {

		},
		data() {
			return {
				teamInfo,
				friendInfo,
				memberInfo,
				messageList,
				scrollTop: 99999,
				showPicture: false,
				audio: null, // 播放器实例
				playingId: null ,// 正在播放的消息ID
				tipItem: {},
				showTips: false,
				showDelete: false,
				showRevoke: false
			}
		},
		computed: {
			messages() {
				return this.messageList.list.slice().sort((a, b) => a.createTime - b.createTime)
			}
		},
		watch: {
			messages: {
				handler() {
					this.scrollToBottom()
				},
				deep: true
			}
		},
		methods: {
			onAvatar(item) {
				if(item.conversationType == 1) this.$c.goto('/pages/group/friendDetail')
			},
			formatReplyInfo(item) {
				if(item.threadReply && item.threadReply.messageClientId) {
					const reply = this.messages.find(i => i.messageClientId === item.threadReply.messageClientId)
					if(reply) return `回复 ${reply.fromNick || reply.senderId} ${ this.$c.formatMessage(reply) }`
				}
				return ''
			},
			handleReply(message) {
				this.showTips = false
				this.$emit('reply', message);
			},
			async onDeleteMessage() {
				this.showDelete = false
				const res = await deleteMessage(this.tipItem)
				if(!res) this.$c.toast('删除失败')
			},
			async onRevokeMessage() {
				this.showRevoke = false
				const res = await revokeMessage(this.tipItem)
				if(!res) this.$c.toast('撤回失败')
			},
			voiceWidth(item) {
				const max = 230
				const min = 40
				const temp = item.attachment && item.attachment.duration ? item.attachment.duration : 0
				const w = parseInt(temp * (max - min) / 1000 / 60) + min
				return w > max ? max : w
			},
			onOpenFile(item) {
				uni.downloadFile({
					url: item.attachment.url,
					success: function(res) {
						var filePath = res.tempFilePath;
						uni.openDocument({
							filePath: filePath,
							showMenu: true,
							success: function(res) {
								console.log('打开文档成功');
							}
						});
					}
				});
			},
			fileSize(item) {
				let size = ''
				if (item.attachment.size < 1024) size = item.attachment.size + 'B'
				else if (item.attachment.size < 1024 * 1024) size = parseFloat((item.attachment.size / 1024).toFixed(2)) +
					'KB'
				else if (item.attachment.size < 1024 * 1024 * 1024) size = parseFloat((item.attachment.size / 1024 / 1024)
					.toFixed(2)) + 'MB'
				else if (item.attachment.size < 1024 * 1024 * 1024 * 1024) size = parseFloat((item.attachment.size / 1024 /
					1024 / 1024).toFixed(2)) + 'GB'
				return size
			},
			onShowFile(item) {

			},
			isTimeGap(index) {
				if (index === 0) return true
				const prev = this.messages[index - 1]
				const curr = this.messages[index]
				return curr.createTime - prev.createTime > 5 * 60 * 1000 // 5分钟间隔显示时间
			},
			renderNotice(item) {
				if (item.messageType !== 5) return ''

				const att = item.attachment || {}

				// 尝试解析 raw
				let data = {}
				try {
					data = typeof att.raw === 'string' ? JSON.parse(att.raw).data || {} : att.raw.data || {}
				} catch (e) {
					console.error('解析 attachment.raw 失败', e)
				}

				// 发送者昵称
				const from = item.isSelf ? '你' : (item.fromNick || item.senderId)

				// 获取 targetIds 昵称
				const getTargetNames = () => {
					const uinfos = data.uinfos || []
					return att.targetIds?.map(id => {
						const u = uinfos.find(u => u['1'] === id)
						return u ? u['3'] || id : id
					})?.join('、') || ''
				}

				const notices = []
				const t = att.updatedTeamInfo || {}
				if (att.targetIds && att.targetIds.length) {
					if (att.type === 0) {
						notices.push(`${from} 邀请 ${getTargetNames()} 加入群聊`)
					} else if (att.type === 1) {
						notices.push(`${getTargetNames()} 被移出群聊`)
					} else if (att.type === 4) {
						notices.push(`${from} 将 ${getTargetNames()} 移出群聊`)
					} else if (att.type === 5) {
						notices.push(!t.joinMode ? `${getTargetNames()} 加入群聊` : `${getTargetNames()} 的入群申请已通过`)
					} else if (att.type === 6) {
						notices.push(`${getTargetNames()} 被管理员禁言`)
					} else if (att.type === 7) {
						notices.push(`${getTargetNames()} 被任命为管理员`)
					}
					if ('chatBanned' in att) notices.push(att.chatBanned ? `${getTargetNames()} 被管理员禁言` :
						`${getTargetNames()} 被管理员解除禁言`)
				} else if(att.type === 2) {
					notices.push(`${from} 退出群聊`)
				} else {
					// 处理群资料更新，只关注用户可操作字段
					const fields = []
					if ('name' in t) fields.push(`${from} 更新群名称为“${t.name}”`)
					if ('announcement' in t) fields.push(`${from} 更新了群公告`)
					if ('intro' in t) fields.push(`${from} 更新了群介绍`)
					if ('avatar' in t) fields.push(`${from} 更新了群头像`)
					if ('chatBannedMode' in t) fields.push(t.chatBannedMode === 1 ? '群禁言已开启' : '群禁言已关闭')
					if ('joinMode' in t) fields.push(t.joinMode === 1 ? `${from} 开启了入群审核` : `${from} 关闭了入群审核`)
					if ('agreeMode' in t) fields.push(t.agreeMode === 1 ? `${from} 开启了入群审核` : `${from} 关闭了入群审核`)
					if (fields.length === 1) {
						notices.push(fields[0])
					} else if (fields.length > 1) {
						notices.push(`${from} 更新了群资料`)
					}
				}
				
				if(!notices.length) {
					switch (att.type) {
						case 1:
							notices.push(`${from} 加入了群聊`)
							break
						case 2:
							notices.push(`${from} 退出了群聊`)
							break
						case 5:
							notices.push(`${from} 解散了群聊`)
							break
						default:
							
					}
				}
				
				return notices
			},
			scrollToBottom() {
				// this.$nextTick(() => {
				//   setTimeout(() => {
				//     if (this.messages.length > 0) {
				//       this.lastId = `msg-${this.messages.length - 1}`
				//     }
				//   }, 500) // 给渲染一点时间
				// })
				this.scrollTop += 9999999
				const timer = setTimeout(() => {
					this.scrollTop += 1
					clearTimeout(timer)
				}, 500)
			},
			playAudio(msg) {
				if (!msg.attachment || !msg.attachment.url) return

				// 如果正在播同一个，点一下就停止
				if (this.playingId === msg.messageClientId) {
					this.audio && this.audio.stop()
					this.playingId = null
					return
				}

				// 停止上一个
				if (this.audio) {
					this.audio.stop()
					this.audio.destroy()
				}

				// 创建播放器
				this.audio = uni.createInnerAudioContext()
				this.audio.src = msg.attachment.url
				this.audio.autoplay = true
				this.playingId = msg.messageClientId

				// 监听事件
				this.audio.onPlay(() => {
					console.log('开始播放', msg.attachment.url)
				})
				this.audio.onEnded(() => {
					console.log('播放结束')
					this.playingId = null
				})
				this.audio.onError(err => {
					console.error('播放失败', err)
					this.playingId = null
				})
			}
		},
		beforeDestroy() {
			// 页面销毁时释放播放器
			if (this.audio) {
				this.audio.destroy()
				this.audio = null
			}
		}
	}
</script>

<style scoped lang="scss">
	.chat-list {
		flex: 1;
		padding: 10px;
	}

	.time-divider {
		text-align: center;
		color: #C0C3C6;
		font-size: 12px;
	}

	.message-item {
		display: flex;
		align-items: flex-start;
		margin-bottom: 8px;
	}

	.message-item.self {
		justify-content: flex-end;
	}

	.message-item.other {
		justify-content: flex-start;
	}

	.bubble {
		padding: 5px 8px 8px;
		border-radius: 2px 10px 10px 10px;
		background-color: #F0F0F0;
		box-sizing: border-box;
		line-height: 1.5;
	}
	
	.reply {
		padding: 5px 8px 8px;
		border-radius: 8px;
		background-color: #F0F0F0;
		box-sizing: border-box;
		line-height: 1.5;
	}

	.message-item.self .bubble {
		background-color: #1DAFB8;
		border-radius: 10px 2px 10px 10px;
		color: #fff;
	}

	.playing image {
		animation: voiceAnim 1s infinite;
	}

	@keyframes voiceAnim {
		0% {
			transform: scale(1);
			opacity: 0.3;
		}

		50% {
			transform: scale(0.5);
			opacity: 1;
		}

		100% {
			transform: scale(1);
			opacity: 0.3;
		}
	}
	
	.zb_tooltip__mask {
	    position: fixed;
	    top: 0;
	    left: 0;
	    width: 100vw;
	    height: 100vh;
	    overflow: hidden;
	    background-color: rgba(255, 255, 255, 0);
	    z-index: 8;
	}
	
	.tooltip>*:not(:first-child) {
		margin-left: 20px;
	}
</style>