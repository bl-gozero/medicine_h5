<template>
	<view class="page bg-page flex-col">
		<view v-if="link.length == 1" class="bg">
			<Title title="邀请商户列表" bgColor="transparent" isBack @back="onBack()" />
			<view class="minh-76 plr-20">
				<view v-if="nums.length > 0" class="relative mt-20">
					<image src="/static/user/level/sell_top.webp" class="pw-100 maxh-100 block" mode="widthFix"></image>
					<view class="full flex-start pl-11 pb-5">
						<view class="flex-start fgap-10 pw-100">
							<view class="w-60 text-center">
								<view class="fs-16 fw-7 u-line-1">{{ all.count }}</view>
								<view class="text_top_name">{{ all.level_name }}</view>
							</view>
							<view class="line w-1 h-43" style="background: rgba(169, 115, 67, 0.2);"></view>
							<view class="flex-1 overflow-hide">
								<u-scroll-list indicatorActiveColor="#B88854">
									<view class="nums text-center" v-for="(item, index) in nums" @click="onPartner(index, item)">
										<view class="fs-16 fw-7 u-line-1">{{ item.count }}</view>
										<view class="text_top_name">
											<view class="">{{ item.name }}</view>
											<view class="">{{ item.sub }}</view>
										</view>
									</view>
								</u-scroll-list>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-between mt-16 pb-13 plr-20">
				<text>我邀请的商户</text>
				<text class="fs-12" style="color: #A26527;">*可显示8层用户</text>
			</view>
		</view>
		<view v-else class="">
			<Title title="他邀请的商户" isBack @back="onBack()" />
		</view>
		<view v-if="link.length > 1" class="plr-20 pt-10 pb-20 text-info text-wrap">
			<text class="name" v-for="(item, index) in link" :key="item.id" :class="{ 'fw-7 text-black': index == link.length - 1 }">{{ item.account }}</text>
			<text>邀请的商户{{ list.length }}人</text>
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
								<text class="num">他邀请的商户</text>
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
		
		<view class="">
			<u-popup :show="showTeam" mode="center" :closeOnClickOverlay="false" round="20" bgColor="tranparent" @close="showTeam = false">
				<view class="w-308 h-406 rounded-20 border-box plr-10" style="background: linear-gradient(180deg, #CFDEFF 0%, #FFFFFF 48%);">
					<image :src="img(medals.value + '_0.webp')" class="w-185 h-62 block auto-x" style="margin-top: -26px;"></image>
					<scroll-view class="rounded-14 mt-6 h-271 border-box ptb-5 plr-20 relative" style="background: linear-gradient(180deg, #FFFFFF 0%, #F1F6FF 100%);" scroll-y>
						<view v-if="medals.list.length" class="">
							<view class="flex-start mt-15">
								<image :src="img(medals.value + '_1.webp')" class="w-28 h-23 block"></image>
								<text>大区{{ medals.name }}：{{ medals.list[0].count }}</text>
							</view>
							<view class="mt-20">
								<view class="flex-between">
									<text>{{ medals.list[0].account }}下团队总{{ medals.name }}</text>
									<text class="fw-5">{{ medals.list[0].count }}</text>
								</view>
							</view>
							<view v-if="medals.list.length > 1" class="mt-25">
								<view class="flex-start mt-15">
									<image :src="img(medals.value + '_2.webp')" class="w-28 h-23 block"></image>
									<text>小区{{ medals.name }}：{{ medals.smallTotal }}</text>
								</view>
								<view v-if="index" class="mt-20 flex-between" v-for="(item, index) in medals.list" :key="item.id">
									<text>{{ item.account }}下团队总{{ medals.name }}</text>
									<text class="fw-5">{{ item.count }}</text>
								</view>
							</view>
						</view>
						<view v-else class="text-info flex-center full">暂无数据</view>
					</scroll-view>
					<button class="bg-black text-white w-234 h-51 fs-16 fw-7 mt-22 border-0 flex-center rounded-x"
						@click="showTeam = false">知道了</button>
				</view>
			</u-popup>
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
				all: { level_name: '总数', count: 0 },
				showTeam: false,
				medals: {
					value: 4,
					name: '合伙人',
					smallTotal: 0,
					list: []
				}
			}
		},
		onLoad() {
			this.getNums()
			this.getFriendList()
		},
		methods: {
			init() {
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
					// for (let key in res) {
					// 	if (key != 'user_list') {
					// 		const item = this.nums.find(item => item.code == key)
					// 		if (item) {
					// 			item.count = res[key] || 0
					// 			if (item.needSum) {
					// 				this.all.count += item.count
					// 			}
					// 		}
					// 	}
					// }
				}
			},
			async getNums() {
				this.levels = [{ id: 0, name: '全部', count: 0 }],
				this.nums = [
					{ code: 'regular_count', name: '普通用户', count: 0, needSum: true },
					{ code: 'staff_count',name: '销售员', count: 0, needSum: true },
					{ code: 'vip_count', name: 'VIP', count: 0, needSum: true },
					{ code: 'partner_count', name: '合伙人', count: 0 },
					{ code: 'partner_bronze_count', name: '铜牌合伙人', count: 0 },
					{ code: 'partner_silver_count', name: '银牌合伙人', count: 0 },
					// { code: 'big_none_count', name: '合伙人', count: 0, needSum: true, sub: '大区' },
					// { code: 'small_none_count', name: '合伙人', count: 0, needSum: true, sub: '小区' },
					// { code: 'big_bronze_count', name: '铜牌合伙人', count: 0, needSum: false, sub: '大区' },
					// { code: 'small_bronze_count', name: '银牌合伙人', count: 0, needSum: false, sub: '小区' },
					// { code: 'big_silver_count', name: '银牌合伙人', count: 0, needSum: false, sub: '大区' },
					// { code: 'small_silver_count', name: '银牌合伙人', count: 0, needSum: false, sub: '小区' },
					{ code: 'partner_gold_count', name: '金牌合伙人', count: 0, needSum: false, },
				]
				const res = await this.$c.fetch(this.$api.user.teamNum)
				if (res) {
					for (let key in res) {
						const item = this.nums.find(item => item.code == key)
						if (item) {
							item.count = res[key] || 0
							if (item.needSum) {
								this.all.count += item.count
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
			},
			async onPartner(index, item) {
				if (index < 3 || index == 6) return
				this.medals.list = []
				this.medals.value = index + 1
				this.medals.name = item.name
				if(1 || item.count) {
					const res = await this.$c.fetch(this.$api.user.partnerNum, {
						medals: this.medals.value - 3
					})
					if (res.length) {
						this.medals.list = res
						this.medals.smallTotal = res.slice(1).reduce((sum, cur) => sum + (cur.count || 0), 0);
					}
				}
				this.showTeam = true
			},
			img(path, root = '/static/user/teamNum/') {
				if (!/^(https?:)?\/\//.test(path)) path = root + path
				return this.$c.img(path, 1)
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
		bottom: 8px;
	}
	.text_top_name {
		color: #AD987F;
		font-size: 12px;
		line-height: 15px;
		margin-top: 3px;
		height: 20px;
	}
</style>