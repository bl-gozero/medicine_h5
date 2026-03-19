<template>
	<view class="page bg-page flex-col">
		<view v-if="link.length == 1" class="bg">
			<Title title="我邀请的好友" bgColor="transparent" isBack @back="onBack()" />
			<view class="minh-76 plr-20">
				<view v-if="nums.length > 0" class="relative mt-20">
					<image src="/static/user/level/sell_top.webp" class="pw-100 maxh-100 block" mode="widthFix"></image>
					<view class="full flex-start pl-11 pb-10">
						<view class="flex-start fgap-10 pw-100">
							<view class="w-60 text-center">
								<view class="fs-16 fw-7 u-line-1">{{ all.count }}</view>
								<view class="text_top_name">{{ all.level_name }}</view>
							</view>
							<view class="line w-1 h-43" style="background: rgba(169, 115, 67, 0.2;"></view>
							<view class="flex-1 overflow-hide">
								<u-scroll-list indicatorActiveColor="#B88854">
									<view class="nums text-center" v-for="item in nums">
										<view class="fs-16 fw-7 u-line-1">{{ item.count }}</view>
										<view class="text_top_name">{{ item.name }}</view>
									</view>
								</u-scroll-list>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-between mt-16 pb-13 plr-20">
				<text>我邀请的好友</text>
				<text class="fs-12" style="color: #A26527;">*可显示8层用户</text>
			</view>
		</view>
		<view v-else class="">
			<Title title="他邀请的好友" isBack @back="onBack()" />
		</view>
		<view v-if="link.length > 1" class="plr-20 pt-10 pb-20 text-info text-wrap">
			<text class="name" v-for="(item, index) in link" :key="item.id" :class="{ 'fw-7 text-black': index == link.length - 1 }">{{ item.account }}</text>
			<text>邀请的好友{{ list.length }}人</text>
		</view>
		<view class="flex-1 bg-white roundedTop-20 relative">
			<scroll-view scroll-y class="full plr-20">
				<view class="list_box">
					<view class="flex-between ptb-17 fs-12" v-for="(item, index) in list" :key="item.id" @click="onFriend(item)">
						<u-avatar :src="item.avatar" :defaultUrl="$c.userAvatar()" size="36" shape="circle"></u-avatar>
						<view class="flex-1 mlr-10">
							<view class="flex-between">
								<view class="flex-start">
									<text class="u-line-1 fs-14">{{ item.account }}</text>
									<view class="level flex-center ml-4" :style="item._style">{{ $c.calcLvName(item) }}</view>
								</view>
								<text class="num">他邀请的好友</text>
							</view>
							<view class="flex-between">
								<view class="text-info mt-5">{{ item.created_at }}</view>
								<text class="mt-5 num">{{ item.children_count }}人</text>
							</view>
						</view>
						<u-icon name="arrow-right" color="#7D7D7D"></u-icon>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	export default {
		components: {
			Title
		},
		data() {
			return {
				form: { level_id: 0, user_id: 0 },
				levels: [],
				nums: [],
				list: [],
				link: [{ id: 0, account: '我' }],
				height1: 0,
				height2: 0,
				status: 0,
				all: { level_name: '总数', count: 0 }
			}
		},
		onLoad() {
			this.getFriendList()
		},
		methods: {
			init() {
				this.levels = [{ id: 0, name: '全部', count: 0 }],
				this.nums = [
					{ code: 'regular_count', name: '普通用户', count: 0 },
					{ code: 'staff_count',name: '推广员', count: 0 },
					{ code: 'vip_count', name: 'VIP', count: 0 },
					{ code: 'partners_count', name: '合伙人', count: 0 },
					{ code: 'bronze_partners_count', name: '铜牌合伙人', count: 0 },
					{ code: 'silver_partners_count', name: '银牌合伙人', count: 0 },
					{ code: 'gold_partners_count', name: '金牌合伙人', count: 0 },
				],
				this.list = []
			},
			async getFriendList() {
				this.init() 
				const res = await this.$c.fetch(this.$api.user.friend, this.form)
				if(res) {
					this.list = res.user_list
					this.list = this.list.map(item => ({
						...item,
						_style: this.$c.calcLvBg(item)
					}))
					for (let key in res) {
						if (key != 'user_list') {
							const item = this.nums.find(item => item.code == key)
							if (item) item.count = res[key] || 0
							if (!['bronze_partners_count', 'gold_partners_count', 'silver_partners_count'].includes(key)) {
								this.all.count += res[key]
							}
						}
					}
				}
			},
			onSwitch(item) {
				if(this.form.level_id == item.id) return
				this.form.level_id = item.id
				this.getFriendList()
			},
			onFriend(item) {
				const len = 8
				if(this.link.length > len) {
					this.$c.toast(`目前仅支持查询${len}层内用户数据`)
					return
				}
				if(this.status) return
				this.form = { level_id: 0, user_id: item.id }
				this.link.push(item)
				this.getFriendList()
			},
			onBack() {
				if(this.link.length > 1) {
					this.link.pop()
					const item = this.link.at(-1)
					this.form = { level_id: 0, user_id: item.id }
					this.getFriendList()
				} else {
					this.$c.goBack()
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	::v-deep .u-tabs__wrapper__nav__item__text {
		font-size: 12px !important;
	}
	::v-deep .u-tabs__wrapper__nav__line {
		bottom: 0 !important;
	}
	.num {
		color: #646464;
	}
	.name:not(:first-child) {
		&::before {
			content: '>';
			color: #9F9F9F;
			font-size: 14px;
			margin: 0 3px;
		}
	}
	.bg {
		background: linear-gradient(180deg, #FFE2C0 5%, #FFF0DE 142px, rgba(255, 240, 222, 0) 226px);
	}
	.text_top_name {
		color: #AD987F;
		font-size: 12px;
		margin-top: 3px;
	}
	.nums {
		min-width: 60px;
		margin-right: 5px;
		display: inline-block;
	}
	::v-deep .u-scroll-list {
		padding-bottom: 0 !important;
	}
	::v-deep .u-scroll-list__indicator {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 6px;
	}
</style>