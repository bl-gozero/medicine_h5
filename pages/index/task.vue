<template>
	<view class="page bg-page">
		<Title title="任务中心" bgColor="transparent" />
		<view class="bg"></view>
		<view class="pt-10 mlr-20 relative" style="z-index: 2;">
			<view class="absolute top-20 right-0 w-179 h-118" style="transform: translateY(-30%);">
				<!-- <image src="/static/index/task_top.webp" class="pw-100 h-ph-100"></image> -->
				<PlayImg path="task/top/1" :length="40" :interval="50" type="webp" />
			</view>
			<view class="" @click="$c.goto('/pages/point/index')">
				<view class="">
					<text>当前积分</text>
					<image src="/static/icon/right_bg.webp" class="i-11 ml-3"></image>
				</view>
				<view class="mt-5 fs-28 fw-7">{{ profile.integral }}</view>
			</view>
			<view class="bg-white rounded-12 ptb-20 plr-16 mt-20 relative"
				style="z-index: 5;box-shadow: 0px 0px 15px 0px rgba(216, 216, 216, 0.13);">
				<text class="fs-16 fw-7">活动任务</text>
				<view class="flex-between">
					<view class="mt-25 text-center" v-for="(item, index) in list" :key="item.id">
						<view class="flex-center">
							<view class="relative">
								<image :src="item.img" class="i-70 block"></image>
								<!-- <view v-if="item.is_new" class="new">新用户专享</view> -->
								<view v-if="item.is_new" class="new">
									<PlayImg path="task/new/22" :length="40" :interval="50" type="webp" />
								</view>
							</view>
						</view>
						<view class="mt-3 mb-10 fs-10">{{ item.name }}</view>
						<u-button class="btn btn-2" shape="circle" @click="$c.goto(item.url)">{{ item.text }}</u-button>
					</view>
				</view>
			</view>
			<view class="bg-white rounded-12 ptb-20 plr-16 mt-20 relative"
				style="z-index: 5;box-shadow: 0px 0px 15px 0px rgba(216, 216, 216, 0.13);">
				<view class="flex-between">
					<view class="flex-start">
						<text class="fs-16 fw-7">做任务赚积分</text>
						<image src="/static/icon/info.webp" class="i-17 ml-5" @click="showInfo = true"></image>
					</view>
					<view v-if="point_1" class="all h-20 rounded-x flex-start plr-5">
						<view class="relative">
							<image src="/static/point/coin.webp" class="w-17 h-18"></image>
							<view class="absolute top-0 right-0 pw-100" style="transform: translate(20%, -5%);">
								<PlayImg path="task/star/2" :length="40" :interval="50" />
							</view>
						</view>
						<text class="fs-12 lh-10">完成全部可得 {{ point_1 }} 积分</text>
					</view>
				</view>
				<view class="mt-24 flex-between" v-for="(item, index) in tasks" :key="item.id">
					<image :src="`/static/task/${item.id}.webp`" class="i-24 self-start"></image>
					<view class="ml-3 mr-30 flex-1">
						<view class="fw-5">{{ item.name }}</view>
						<view class="text-info mt-5 fs-10">{{ item.intor }}</view>
					</view>
					<view class="w-70">
						<u-button v-if="item.number >= item.count" class="btn btn-1" shape="circle">今日完成</u-button>
						<u-button v-else-if="item.id == 1" class="btn" shape="circle" @click="doSign">立即签到</u-button>
						<u-button v-else class="btn" shape="circle" @click="onTask(item)">去完成</u-button>
						<!-- <u-button v-else class="btn" shape="circle">去完成</u-button> -->
					</view>
				</view>
			</view>
			<view class="bg-white rounded-12 ptb-20 plr-16 mt-20 relative"
				style="z-index: 5;box-shadow: 0px 0px 15px 0px rgba(216, 216, 216, 0.13);">
				<view class="flex-between">
					<text class="fs-16 fw-7">其他积分任务</text>
				</view>
				<view class="mt-24 flex-between item-stretch">
					<image src="/static/task/invite.webp" class="i-24"></image>
					<view class="ml-3 mr-30 flex-1">
						<view class="fw-5">邀请好友</view>
						<view v-if="point_2" class="all h-20 rounded-x flex-start plr-5 mt-6">
							<image src="/static/point/coin.webp" class="w-17 h-18"></image>
							<text class="fs-10 lh-10">推荐好友1人 ，额外获得 {{ point_2 }} 积分</text>
						</view>
						<view class="text-info mt-5 fs-10">邀请好友注册并完成首次登录，您将获得丰厚奖励！推荐越多，赚得越多！</view>
					</view>
					<view class="w-70">
						<u-button class="btn" shape="circle" @click="$c.goto('/pages/user/qrcode')">去邀请</u-button>
					</view>
				</view>
			</view>
		</view>
		<view class="h-60"></view>

		<!-- 提示弹窗 -->
		<u-popup :show="showInfo" mode="center" bgColor="transparent" :closeOnClickOverlay="false"
			@close="showInfo = false;">
			<view class="w-308 h-303 rounded-20 p-25 border-box bg-white">
				<view class="fs-18 text-center">温馨提示</view>
				<view class="lh-20 mt-20">
					1. 积分每日结算并在次日到账；<br />
					2. 每日任务将在次日0点重置；<br />
					3. 请确保任务完成后APP已联网以便正确记录进度<br />
				</view>
				<u-button class="bg-base bold fs-16 flex-center text-white w-234 h-51 mt-34" shape="circle"
					@click="showInfo = false;">知道了</u-button>
			</view>
		</u-popup>

		<!-- 签到弹窗 -->
		<u-popup :show="showReward" mode="center" bgColor="transparent" @close="showReward = false;">
			<view class="w-308 h-280 sign_reward_box rounded-20 text-center">
				<image src="/static/user/sign_reward.png" class="w-113 h-107" style="margin-top: -53px;"></image>
				<view class="fw-7 fs-18 mt-20 text-base">签到成功</view>
				<view class="mt-9 fs-12" style="color: #8B9E9F;">真棒！请保持每天签到哦！</view>
				<view class="fs-16 mt-10">恭喜您获得<text class="fs-36 fw-7 text-danger">{{ reward }}</text>元</text></view>
				<button class="bg-black bold fs-16 flex-center text-white w-234 h-51 rounded-x mt-20"
					@click="showReward = false;">知道了</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import PlayImg from '../../components/PlayImgs.vue'

	export default {
		components: {
			Title,
			PlayImg
		},
		data() {
			return {
				profile: this.$c.profile(),
				list: [{
						id: 1,
						name: '135元北朝鲜山参',
						img: '/static/task/task_new.webp',
						text: '免费领',
						url: '/pages/activity/newExclusive',
						is_new: true
					},
					{
						id: 2,
						name: '每月领一箱礼品',
						img: '/static/task/egg_rice.webp',
						text: '做任务',
						url: '/pages/activity/egg',
						is_new: false
					},
					{
						id: 3,
						name: '邀好友得现金',
						img: '/static/task/task_invite.webp',
						text: '去邀请',
						url: '/pages/user/qrcode',
						is_new: false
					},
				],
				tasks: [],
				doSign: null,
				reward: 0,
				showReward: false,
				showInfo: false,
				point_1: 0,
				point_2: 0
			}
		},
		async onLoad() {
			this.profile = await this.$c.checkeLogin(1)
			this.getTask()
			this.getPoint()
			this.doSign = this.$c.onceRequest(this.onSign)
		},
		onShow() {},
		methods: {
			async getTask() {
				const res = await this.$c.fetch(this.$api.config.task)
				if (res) {
					res.forEach(item => {
						if (item.id === 3 && !/\d/.test(item.intor)) {
							item.intor = '每天畅聊3分钟超过10次发言'
						}
					});
					this.tasks = res
					const sign = res.find(i => i.id == 1)
					if (sign && sign.count > sign.number) this.onSign()
				}
			},
			async getPoint() {
				const res = await this.$c.fetch(this.$api.config.config, {
					id: [7, 8]
				})
				if (res) {
					const point_1 = res.find(item => item.id == 7)
					if (point_1) this.point_1 = point_1.value
					const point_2 = res.find(item => item.id == 8)
					if (point_2) this.point_2 = point_2.value
				}
			},
			async onSign() {
				const res = await this.$c.fetch(this.$api.user.signIn)
				if (res) {
					this.reward = res.amount
					this.showReward = true
					this.getTask()
					this.profile = await this.$c.getProfile()
				}
			},
			onTask(item) {
				if (item.id == 1) {
					this.doSign()
				} else if (item.id == 2) {
					this.$c.goto('/pages/index/index')
				} else if (item.id == 3) {
					this.$c.goto('/pages/group/index')
				} else {

				}
			}
		}
	}
</script>

<style>
	.bg {
		background: linear-gradient(238deg, #F0CEBC 5%, #F9EBDB 40%, #FCFFEE 89%, #F8F8F8 90%, #F8F8F8 100%);
		height: 300px;
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
	}

	.all {
		background: #FAF0E8;
		color: #E28456;
	}

	.btn {
		width: 70px;
		height: 30px;
		background: linear-gradient(270deg, #F59857 0%, #F3B36A 99%);
		box-shadow: 0px 4px 4px 0px rgba(244, 125, 41, 0.27);
		font-size: 12px;
		color: #fff;
		border-radius: 999px;
		padding: 0;
		border: 0;
	}

	.btn-1 {
		background: #CBCBCB;
		box-shadow: none;
	}

	.btn-2 {
		width: 59px;
		height: 25px;
	}

	.new {
		width: 59px;
		/* height: 18px; */
		/* border-radius: 8px 8px 8px 0px; */
		/* background: linear-gradient(180deg, rgba(255, 18, 1, 0.8) 0%, rgba(255, 68, 31, 0.8) 100%); */
		color: #FFFFFF;
		font-size: 10px;
		position: absolute;
		left: 0;
		bottom: 55px;
		line-height: 18px;
		text-align: center;
	}
</style>