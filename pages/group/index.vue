<template>
	<view class="page bg-page">
		<view class="title_bg pb-18 plr-20" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between">
				<text class="fw-7 fs-18">群聊</text>
				<!-- <view class="relative">
					<image src="/static/icon/circle-plus.webp" class="i-23" @click="showPlus = !showPlus"></image>
					<view v-if="showPlus" class="plus_box plr-10 text-white fs-16">
						<view class="flex-center ptb-15" @click="showPlus = false;$c.goto('/pages/group/addFriend')">
							<image src="/static/group/plus.webp" class="i-26 mr-8"></image>
							<text class="">添加好友</text>
						</view>
						<view class="flex-center ptb-15" @click="showPlus = false;$c.goto('/pages/group/blackList')">
							<image src="/static/group/black.webp" class="i-26 mr-8"></image>
							<text class="">好友黑名单</text>
						</view>
					</view>
				</view> -->
			</view>
		</view>
		<view class="ptb-16 plr-20 bg-white">
			<view class="flex-between">
				<view class="text-center relative" v-for="(item, index) in navList" :key="index" @click="onNav(item)">
					<image :src="item.icon" class="i-39"></image>
					<view class="fs-12 mt-8">{{ item.name }}</view>
					<u-badge
						v-if="item.id === 4"
						:value="teamJoinCount.value"
						:absolute="true"
						bgColor="#FF2A40"
						color="#fff"
						max="99"
						:offset="[-5, 5]"
					></u-badge>
				</view>
			</view>
			<view class="">
				<swiper 
					class="h-90 mt-20" 
					:interval="5000"
					:duration="500"
					circular
					indicator-dots
					autoplay
				>
					<swiper-item v-if="showNew">
						<view class="swiper-item flex-between fs-12 relative mt-20" @click="$c.goto('/pages/activity/newExclusive')">
							<image src="/static/avtivity/new/goods.webp" class="i-25 rounded-8"></image>
							<text>价值135元朝鲜山参</text>
							<text class="text-orange">免费领取</text>
							<text class="text-orange fs-20 fw-7">0元</text>
							<view class="line"></view>
							<text class="fw-5">倒计时</text>
							<view class="text-orange plr-4 ptb-6 rounded-6 fw-7" style="background: #FBE4DC;">去领取</view>
							<view class="new">新用户专享</view>
						</view>
					</swiper-item>
					<swiper-item v-if="showEgg">
						<view class="swiper-item flex-between fs-12 relative mt-20" @click="$c.goto('/pages/activity/egg')">
							<image src="/static/avtivity/egg/egg.webp" class="w-24 h-13"></image>
							<text>购买一次商品</text>
							<text class="text-orange">免费领取鸡蛋</text>
							<text class="text-orange fs-20 fw-7">12箱</text>
							<view class="line"></view>
							<text class="fw-5">已领取</text>
							<view class="text-orange plr-4 ptb-6 rounded-6 fw-7" style="background: #FBE4DC;">去领取</view>
							<view class="new">月月领百冠山初生蛋</view>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="swiper-item flex-between fs-12 relative mt-20" @click="$c.goto('/pages/index/task')">
							<image src="/static/task/1.webp" class="i-24 rounded-8"></image>
							<text>完成每日任务获取积分</text>
							<text class="text-orange fs-20 fw-7">换好礼</text>
							<view class="line"></view>
							<view class="text-orange plr-4 ptb-6 rounded-6 fw-5" style="background: #FBE4DC;">去任务中心</view>
							<view class="new">每日任务</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>	
			
		<ConversationList />

		<view class="h-70"></view>
		<TabBar />
		
		<!-- 等级 -->
		<u-popup :show="showLv" mode="center" round="20" @close="showLv = false">
			<view class="lv_box pt-75 border-box">
				<view class="lh-15 text-center">
					<view class="">需要成为合伙人</view>	
					<view class="">才可以创建群聊哦~</view>
				</view>
				<u-button
					class="bg-black fw-7 fs-14 w-234 h-51 mt-80 text-white"
					shape="circle"
					text="知道了"
					@click="showLv = false"
				></u-button>
			</view>
		</u-popup>
		
		<!-- 创建 -->
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
					@click="toCreate()"
				></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue'
	import ConversationList from './components/conversation-list.vue'
	import { teamJoinCount } from '@/utils/nim.js'
	
	export default {
		components: {
			TabBar,
			ConversationList
		},
		data() {
			return {
				teamJoinCount,
				navList: [
					{ id: 1, name: '发现群聊', icon: '/static/group/find.png', url: '/pages/group/find' },
					{ id: 2, name: '创建群聊', icon: '/static/group/create.png', url: '/pages/group/create' },
					{ id: 3, name: '通讯录', icon: '/static/group/my_group.png', url: '/pages/group/myGroup' },
					{ id: 4, name: '群的申请', icon: '/static/group/apply.png', url: '/pages/group/apply' },
				],
				showOperation: false,
				showCreate: false,
				showLv: false,
				showPlus: false,
				profile: this.$c.getStorage('profile') || {},
				search: { page: 1, limit: 10, load: 'more', search: {
						join_state: 0,
						name: '',
						is_preferred: 1
					}
				},
				list: [],
				groupList: [],
				showNew: false,
				showEgg: false
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.$c.checkNim()
			this.getProfile()
			this.getActivity()
		},
		onShow() {
			// this.updateUnreadCount()
		},
		methods: {
			// async updateUnreadCount() {
			// 	this.unreadCount = await teamUnreadCount(this.$nim)
			// },
			async getActivity() {
				const res = await this.$c.fetch(this.$api.user.activityStatus)
				if (res) {
					this.showNew = res.is_ginseng
					this.showEgg = res.is_egg
				}
			},
			onNav(e) {
				if(e.id == 2 && this.profile.level.id < 4) {
					this.showLv = true
					return
				}
				this.$c.goto(e.url)
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.profile = res
					this.$c.setStorage('profile', res)
				}
			},
			toCreate() {
				this.showCreate = false
				this.$c.goto('/pages/group/pay')
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
	
	.lv_box {
		width: 308px;
		height: 280px;
		border-radius: 20px;		
		background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);
	}
	
	.swiper-item {
		border: 1px solid #F6BE97;
		background: #FEF6F1;
		padding: 4px 6px;
		border-radius: 8px;
	}
	
	.line {
		width: 1px;
		height: 22.5px;
		background: #FFC4A4;
	}
	
	.new {
		height: 18px;
		/* transform: rotate(180deg); */
		border-radius: 8px 8px 8px 0px;
		background: linear-gradient(180deg, rgba(255, 18, 1, 0.8) 0%, rgba(255, 68, 31, 0.8) 100%);
		color: #FFFFFF;
		font-size: 10px;
		position: absolute;
		left: 0;
		transform: translateY(-125%);
		line-height: 18px;
		text-align: center;
		padding: 0 9px 0 6px;
	}
	
	.plus_box {
		position: absolute;
		width: 130px;
		background: #4C4C4C;
		right: 0;
		bottom: 0;
		transform: translate(15px, 107%);
		z-index: 10;
		border-radius: 10px;
		transition: all 0.3s ease;
		
		&::after {
			content: "";
			position: absolute;
			top: -6px;              /* 调整露出的高度 */
			right: 20px;            /* 位置微调 */
			width: 14px;
			height: 14px;
			background: #4C4C4C;    /* 和气泡框背景一致 */
			border-radius: 3px;     /* 倒角柔和程度 */
			transform: rotate(45deg);
			box-shadow: -1px -1px 2px rgba(0,0,0,0.08); /* 轻微阴影更立体 */
			z-index: 1;
			// border-left: 10px solid transparent;
			// border-right: 10px solid transparent;
			// border-bottom: 10px solid #4C4C4C; /* 内层：跟对话框背景相同 */
			// clip-path: path('M2,12 Q0,2 10,2 L12,2 Q22,2 20,12 Z');
		}
		
		& > :last-child {
			border-top: 1px solid #616161;
		}
	}
</style>