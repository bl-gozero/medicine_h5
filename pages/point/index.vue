<template>
	<view class="page bg">
		<Title title="积分商城" bgColor="transparent" @back="$c.goto('/pages/index/index')" />
		<view class="mt-10 plr-20 relative" style="z-index: 2;">
			<view class="absolute right-0 i-135">
				<!-- <image src="/static/point/index-top.webp" class=""></image> -->
				<PlayImg path="point/top/1" :length="40" :interval="50" type="webp" />
			</view>
			<view class="">当前积分</view>
			<view class="mt-10 fs-28 fw-7">{{ profile.integral }}</view>
			<view class="mt-15 flex-start">
				<view class=""><u-button class="bg-white rounded-4 w-80 h-28" text="积分明细" @click="$c.goto('/pages/point/list')"></u-button></view>
				<view class=""><u-button class="bg-base rounded-4 text-white w-80 h-28 ml-15" text="兑换记录" @click="$c.goto('/pages/point/order')"></u-button></view>
			</view>
			<view v-if="tasks.length > 0" class="bg-white rounded-12 ptb-20 plr-16 mt-20 relative" style="z-index: 5;box-shadow: 0px 0px 15px 0px rgba(216, 216, 216, 0.13);">
				<view class="flex-between">
					<text class="fs-16 fw-7">做任务赚积分</text>
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
				<view v-if="index < 2" class="mt-24 flex-between" v-for="(item, index) in tasks" :key="item.id">
					<image :src="`/static/task/${item.id}.webp`" class="i-24 self-start"></image>
					<view class="ml-3 mr-30 flex-1">
						<view class="fw-5">{{ item.name }}</view>
						<view class="text-info mt-5 fs-10">{{ item.intor }}</view>
					</view>
					<view class="w-70">
						<u-button v-if="item.number >= item.count" class="btn btn-1" shape="circle">今日完成</u-button>
						<u-button v-else-if="item.id == 1" class="btn" shape="circle" @click="doSign">立即签到</u-button>
						<u-button v-else class="btn" shape="circle" @click="$c.goto('/pages/index/index')">去完成</u-button>
						<!-- <u-button v-else class="btn" shape="circle">去完成</u-button> -->
					</view>
				</view>
				<view class="text-center mt-24">
					<view class="" @click="$c.goto('/pages/index/task')">
						<text class="text-info fs-12 lh-10">查看全部任务</text>
						<image src="/static/icon/right_bg.webp" class="i-11 ml-4"></image>
					</view>
				</view>
			</view>
			<!-- <image src="/static/point/title.webp" class="w-101 h-42 "></image> -->
			<view class="w-101 h-42 mt-20">
				<PlayImg path="point/title/3" :length="40" :interval="50" />
			</view>
			<view class="flex-between flex-wrap mt-20" style="gap: 10px;">
				<view 
					class="bg-white rounded-14"
					style="width: calc((100% - 10px) / 2);"
					v-for="item in list" 
					:key="item.id" 
					@click="$c.goto(`/pages/point/goodsDetail?id=${item.id}`)"
				>
					<view class="img-box flex-center">
						<image :src="item.picture" class="pw-100 ph-100 roundedTop-14" mode="aspectFill"></image>
					</view>
					<view class="plr-10 pt-14 pb-18">
						<view class="fs-16 u-line-1">{{ item.name }}</view>
						<view class="text-base mt-10">
							<text class="fs-18 fw-5">{{ item.price }}</text>
							<text class="fs-12">积分</text>
						</view>
					</view>
				</view>
			</view>
			<view class="h-50"></view>
		</view>
		
		<u-popup :show="showReward" mode="center" bgColor="transparent" @close="showReward = false;">
			<view class="w-308 h-280 sign_reward_box rounded-20 text-center">
				<image src="/static/user/sign_reward.png" class="w-113 h-107" style="margin-top: -53px;"></image>
				<view class="fw-7 fs-18 mt-20 text-base">签到成功</view>
				<view class="mt-9 fs-12" style="color: #8B9E9F;">真棒！请保持每天签到哦！</view>
				<view class="fs-16 mt-10">恭喜您获得<text class="fs-36 fw-7 text-danger">{{ reward }}</text>元</text></view>
				<button
					class="bg-black bold fs-16 flex-center text-white w-234 h-51 rounded-x mt-20"
					@click="showReward = false;"
				>知道了</button>
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
				list: [],
				tasks: [],
				search: { page: 1, limit: 10, name: '', load: 'more', is_integral: 1 },
				doSign: null,
				point_1: 0,
				showReward: false,
				reward: 0
 			}
		},
		async onLoad() {
			this.profile = await this.$c.checkeLogin(1)
			this.getTask()
			this.getPoint()
			this.getList()
			this.doSign = this.$c.onceRequest(this.onSign)
		},
		onShow() {
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getList() {
				if(this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.goods.goodsList, this.search)
				if(res) {
					this.list = [...this.list, ...res]
					this.search.load = res.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if(this.search.load != 'end') this.search.load = 'more'
			},
			async getTask() {
				const res = await this.$c.fetch(this.$api.config.task)
				if(res) this.tasks = res
			},
			async onSign() {
				const res = await this.$c.fetch(this.$api.user.signIn)
				if(res) {
					this.reward = res.amount
					this.showReward = true
					this.getTask()
					this.profile = await this.$c.getProfile()
				}
			},
			async getPoint() {
				const res = await this.$c.fetch(this.$api.config.config, {
					id: [7]
				})
				if(res) {
					const point_1 = res.find(item => item.id == 7)
					if(point_1) this.point_1 = point_1.value
				}
			},
		}
	}
</script>

<style>
	.bg {
		background: linear-gradient(to bottom, #E0F0F1 0, #EDF3F4 300px, #f8f8f8 310px, #f8f8f8 100%);
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
</style>