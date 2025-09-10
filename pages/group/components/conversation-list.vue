<template>
	<view class="plr-20 list_box">
		<view 
			v-for="item in conversations" 
			:key="item.conversationId" 
			class="flex-start ptb-20"
			@longpress="showAction(item)"
		>
			<!-- 群头像 -->
			<u-avatar :src="item.avatar" size="44" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
			
			<!-- 群名称 + 最后一条消息 -->
			<view class="info">
				<view>{{ item.name }}</view>
				<view v-if="item.lastMessage" class="text-info fs-12 mt-5">
				    {{ item.lastMessage.text ? item.lastMessage.text : '[非文本消息]' }}
				</view>
			</view>

			<!-- 未读数量 -->
			<view v-if="item.unreadCount > 0" class="unread">{{ item.unreadCount }}</view>
		</view>

		<!-- 操作弹窗 -->
	</view>
</template>

<script>
	import { initNIM, loginNIM } from '@/utils/nim.js'

	export default {
		data() {
			return {
				conversations: [],
				showSheet: false,
				actions: [
					{ name: '置顶' },
					{ name: '删除', color: 'red' }
				],
				currentItem: null // 长按的会话对象
			}
		},
		async created() {
			const nim = this.$c.getStorage('nim') || {}
			this.nim = initNIM({
				appkey: nim.appkey,
				account: nim.account,
				token: nim.token,
			})
			try { await loginNIM(nim.account, nim.token) } 
			catch (err) { console.error('登录失败', err); return }

			const conv = this.nim.V2NIMLocalConversationService
			conv.on("onConversationCreated", (c) => { console.log(c);this.updateConversations([c]) })
			conv.on("onConversationChanged", (list) => this.updateConversations(list))
			conv.on("onConversationDeleted", (ids) => {
				ids.forEach(id => {
					const idx = this.conversations.findIndex(i => i.conversationId === id)
					if (idx !== -1) this.conversations.splice(idx, 1)
				})
			})

			this.loadLocalConversations()
		},
		methods: {
			updateConversations(list) {
				list.forEach(c => {
					const idx = this.conversations.findIndex(item => item.conversationId === c.conversationId)
					if (idx !== -1) this.$set(this.conversations, idx, c)
					else this.conversations.unshift(c)
				})
				this.conversations.sort((a, b) => {
					const t1 = a.lastMessage ? a.lastMessage.timestamp : 0
					const t2 = b.lastMessage ? b.lastMessage.timestamp : 0
					return t2 - t1
				})
			},

			async loadLocalConversations() {
				try {
					let offset = 0, finished = false, allList = []
					while (!finished) {
						const res = await this.nim.V2NIMLocalConversationService.getConversationList(offset, 100)
						allList = [...allList, ...res.conversationList]
						offset = res.offset
						finished = res.finished
					}
					this.updateConversations(allList)
				} catch (err) { console.error('获取本地会话失败', err) }
			},
			showAction(item) {
				const that = this
				uni.showActionSheet({
					itemList: ['置顶', '删除'],
					success(res) {
						if (res.tapIndex === 0) {
							// 置顶逻辑
							const idx = that.conversations.findIndex(i => i.conversationId === item.conversationId)
							if (idx !== -1) {
								const topItem = that.conversations.splice(idx, 1)[0]
								that.conversations.unshift(topItem)
							}
						} else if (res.tapIndex === 1) {
							// 删除逻辑
							that.nim.V2NIMLocalConversationService.deleteConversation(item.conversationId)
							const idx = that.conversations.findIndex(i => i.conversationId === item.conversationId)
							if (idx !== -1) that.conversations.splice(idx, 1)
						}
					},
					fail(err) { }
				})
			}
		}
	}
</script>

<style scoped>
	.info { flex: 1; margin-left: 20rpx; }
	.unread { background: red; color: #fff; padding: 4rpx 8rpx; border-radius: 12rpx; font-size: 24rpx; }
</style>
