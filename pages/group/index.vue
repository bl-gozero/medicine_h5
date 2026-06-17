<template>
	<view class="page bg-page">
		<view class="title_bg pb-18 plr-20" :class="'pt-' + $c.barHeight()">
			<view class="flex-between">
				<text class="fw-7 fs-18">群聊</text>
				<view class="relative">
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
				</view>
			</view>
		</view>
		<view class="ptb-16 plr-20 bg-white">
			<view class="flex-between">
				<view class="text-center relative" v-for="(item, index) in navList" :key="index" @click="onNav(item)">
					<image :src="item.icon" class="i-39"></image>
					<view class="fs-12 mt-8">{{ item.name }}</view>
					<u-badge v-if="item.id === 4" :value="teamJoinCount.value + friendApplictionCount.value"
						:absolute="true" bgColor="#FF2A40" color="#fff" max="99" :offset="[-5, 5]"></u-badge>
				</view>
			</view>
			<view class="">
				<swiper class="h-90 mt-20" :interval="5000" :duration="500" circular indicator-dots autoplay>
					<swiper-item v-if="item.show" v-for="item in events" :key="item.id">
						<view @click="$c.goto(item.url)">
							<PlayImg :path="item.path" :interval="50" :length="20" type="webp" />
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
			<view class="lv_box sign_reward_box pt-75 border-box">
				<view class="lh-15 text-center">
					<view class="">需要成为合伙人</view>
					<view class="">才可以创建群聊哦~</view>
				</view>
				<button class="bg-black fw-7 fs-14 w-234 h-51 mt-80 text-white flex-center rounded-x"
					@click="showLv = false">知道了</button>
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
				<button class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white flex-center rounded-x"
					@click="toCreate()">支付99元并创建</button>
			</view>
		</u-popup>

		<u-modal :show="showNick" title="提示" content='您还未设置昵称' confirmText="去设置" confirmColor="#3D3D3D"
			cancelColor="#9F9F9F" showCancelButton @cancel="$c.goBack()"
			@confirm="$c.goto('/pages/user/baseInfo');showNick = false"></u-modal>
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue'
	import PlayImg from '../../components/PlayImgs.vue'
	import ConversationList from './components/conversation-list.vue'
 
	import {
		joinTeam,
		teamJoinCount,
		friendApplictionCount
	} from '@/utils/nim.js'

	export default {
		components: {
			TabBar,
			PlayImg,
			ConversationList
		},
		data() {
			return {
				teamJoinCount,
				friendApplictionCount,
				navList: [{
						id: 1,
						name: '发现群聊',
						icon: '/static/mp/group/find.webp',
						url: '/pages/group/find'
					},
					{
						id: 2,
						name: '创建群聊',
						icon: '/static/mp/group/create.webp',
						url: '/pages/group/create'
					},
					{
						id: 3,
						name: '通讯录',
						icon: '/static/mp/group/my_group.webp',
						url: '/pages/group/myGroup'
					},
					{
						id: 4,
						name: '申请信息',
						icon: '/static/mp/group/apply.webp',
						url: '/pages/group/apply'
					},
				],
				showOperation: false,
				showCreate: false,
				showLv: false,
				showPlus: false,
				profile: this.$c.profile(),
				search: {
					page: 1,
					limit: 10,
					load: 'more',
					search: {
						join_state: 0,
						name: '',
						is_preferred: 1
					}
				},
				list: [],
				groupList: [],
				showNew: false,
				showEgg: false,
				showNick: false,
				events: [
					// { id: 5, name: '视频', path: 'group_activity/video/1', url: '/pages/activity/video/index', show: true },
					{ id: 1, name: '人参', path: 'group_activity/new/1', url: '/pages/activity/newExclusive', show: true },
					// { id: 2, name: '酒',   path: 'group_activity/wine/1', url: '/pages/activity/wine', show: true },
					{ id: 3, name: '鸡蛋', path: 'group_activity/rice/1', url: '/pages/activity/egg', show: true },
					{ id: 4, name: '任务', path: 'group_activity/daily/3', url: '/pages/index/task', show: true },
				],
				team_id: null
			}
		},
		async onLoad() {
			const profile = await this.$c.checkeLogin(1)
			if (profile) {
				this.profile = profile
				this.$c.checkNim()
				this.onGroupCheck()
			}
		},
		async onShow() {
			this.profile = await this.$c.checkeLogin(1)
			this.showNick = this.profile.nickname? false : true
		},
		methods: {
			onNav(e) {
				if (e.id == 2 && this.profile.level.id < 4) {
					this.showLv = true
					return
				}
				this.$c.goto(e.url)
			},
			toCreate() {
				this.showCreate = false
				this.$c.goto('/pages/group/pay')
			},
			async onGroupCheck() {
				const res = await this.$c.fetch(this.$api.group.levelGroup)
				if (res) {
					const team = res.find(i => i.level_id == this.profile?.level?.id && i.medals == this.profile?.medals?.id)
					if (team && !team.is_join) {
						this.team_id = team.team_id
						this.onJoin()
					}
				}
			},
			async onJoin() {
				const res1 = await joinTeam(this.team_id, 1, '', false)
				if(res1) {
					const res = await this.$c.fetch(this.$api.group.join, { team_id: this.team_id })			
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title_bg {
		background: linear-gradient(180deg, #FBE5C5 0%, #fff 99%);
	}
	
	.tabbar {
		box-shadow: none;
	}

	.group .list_box {
		background: linear-gradient(180deg, #FFF2C9 4%, rgba(255, 242, 201, 0.34) 46%, rgba(255, 246, 216, 0) 98%);
	}

	.lv_box {
		width: 308px;
		height: 280px;
		border-radius: 20px;
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
	}
	.plus_box::after {
		content: "";
		position: absolute;
		top: -6px;
		/* 调整露出的高度 */
		right: 20px;
		/* 位置微调 */
		width: 14px;
		height: 14px;
		background: #4C4C4C;
		/* 和气泡框背景一致 */
		border-radius: 3px;
		/* 倒角柔和程度 */
		transform: rotate(45deg);
		box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.08);
		/* 轻微阴影更立体 */
		z-index: 1;
	}
	
	.plus_box > view:last-child {
		border-top: 1px solid #616161;
	}
</style>