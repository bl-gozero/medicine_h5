<template>
	<view class="page bg-page">
		<view class="title_bg pb-18 plr-20" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between">
				<text class="fw-7 fs-18">群聊</text>
			</view>
		</view>
		<view class="ptb-16 plr-30 flex-between bg-white">
			<view class="text-center" v-for="(item, index) in navList" :key="index" @click="onNav(item)">
				<image :src="item.icon" class="i-39"></image>
				<view class="fs-12 mt-8">{{ item.name }}</view>
			</view>
		</view>
		<view class="mt-10 list_box plr-20">
			
		</view>
		<TabBar />
		
		<!-- 群操作 -->
		<u-popup :show="showOperation" mode="bottom" round="20" @close="showOperation = false">
			<view class="plr-20 pt-5 pb-50">
				<view class="text-center">
					<view class="ptb-20 border-bottom">标为已读/未读</view>
					<view class="ptb-20 border-bottom">置顶聊天</view>
					<view class="ptb-20 text-danger border-bottom">删除并退出该群聊</view>
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
		
		<u-popup :show="showCreate" mode="bottom" round="20" closeable @close="showCreate = false">
			<view class="pt-25 plr-30 pb-35">
				<view class="fs-18 text-center">创建群聊</view>
				<view class="lh-15 mtb-60" style="color: #909090;">
					<view class="">
						1，创建属于自己的群聊，找到志同道合的朋友，讨论共同话题，并且可以进行在线群聊语音
					</view>	
					<view class="mt-20">
						2，创建群聊需达到合伙人身份
					</view>
				</view>
				<u-button
					class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white"
					shape="circle"
					text="支付99元并创建"
					@click="showCreate = false;$c.goto('/pages/group/pay')"
				></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue'
	export default {
		components: {
			TabBar
		},
		data() {
			return {
				navList: [
					{ id: 1, name: '发现群聊', icon: '/static/group/find.png', url: '' },
					{ id: 2, name: '创建群聊', icon: '/static/group/create.png', url: '' },
					{ id: 3, name: '我的群聊', icon: '/static/group/my_group.png', url: '' },
					{ id: 4, name: '群的申请', icon: '/static/group/apply.png', url: '' },
				],
				showOperation: false,
				showCreate: false
			}
		},
		onLoad() {
		},
		onShow() {
		},
		methods: {
			onNav(e) {
				if(e.id == 2) {
					this.showCreate = true
				} else {
					this.$c.goto(item.url)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title_bg {
		background: linear-gradient(180deg, #95C6C8 0%, #fff 99%);
	}

	.tabbar {
		box-shadow: none;
	}
	
	.group {
		.list_box {
			background: linear-gradient(180deg, #FFF2C9 4%, rgba(255, 242, 201, 0.34) 46%, rgba(255, 246, 216, 0) 98%);
		}
	}
</style>