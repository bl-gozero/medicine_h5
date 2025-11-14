<template>
	<view class="page flex-col">
		<view class="bg plr-20 pb-47" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between gap-20">
				<view class="flex-start" @click="$c.goBack()">
					<image src="/static/icon/back.png" class="i-24"></image>
					<text class="fs-18 lh-13">团队成员</text>
				</view>
				<view class="flex-1" style="max-width: 220px;">
					<u-search v-model="account" placeholder="输入账号搜索成员" bgColor="#fff" :showAction="true" animation @search="onSearch" @custom="onSearch"></u-search>
				</view>
			</view>
			<view class="minh-76">
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
		</view>
		<view class="flex-1 bg-white roundedTop-20 relative flex-col border-box" style="margin-top: -27px;">
			<view class="" style="margin-top: -10px;">
				<image src="/static/user/level/member_level.webp" class="w-134 h-42 auto-x block" ></image>
			</view>
			<view class="" style="margin-top: -7px;">
				<view class="flex-center">
					<u-icon name="play-left-fill" color="#AC7747" size="12" @click="onChangeLevel(0)"></u-icon>
					<image :src="`/static/user/level/${level}.webp`" class="w-49 h-46 mlr-20 block"></image>
					<u-icon name="play-right-fill" color="#AC7747" size="12" @click="onChangeLevel(1)"></u-icon>
				</view>
			</view>
			<view class="text-center fs-12" style="color: #AC7747;">“成员层级”将展示您8层内的用户数据详情</view>
			<view class="flex-1 relative">
				<swiper class="full" :current="level - 1" :duration="500" @change="onChange">
					<swiper-item v-for="i in levelMax" :key="i">
						<scroll-view class="full ptb-10 border-box" scroll-y>
							<view v-if="list.length === 0" class="h-200 flex-center text-info">{{ listStatus != 'load' ? '暂无下级' : '' }}</view>
							<view v-else class="plr-20 inline-block pw-100 border-box member_outbox" v-for="item in list" :key="item.id">
								<view class="member_box">
									<view class="flex-between item-stretch gap-15">
										<view class="self-start">
											<view class="relative">
												<u-avatar :src="item.avatar" :defaultUrl="$c.userAvatar()" size="36" mode="aspectFill"></u-avatar>
												<view class="flex-center w-36" style="margin-top: -3px;">
													<view class="level" :style="$c.calcLvBg(item)">{{ $c.calcLvName(item) }}</view>
												</view>
											</view>
										</view>
										<view class="flex-1 flex-between border-bottom border-box pt-5 pb-16">
											<view class="lh-10 flex-1">
												<view class="u-line-1">{{ item.account }}</view>
												<view class="fs-12 text-info mt-9">{{ item.created_at }}</view>
												<view v-if="item.p_account" class="fs-12 text-info mt-9">他的推荐人:{{ item.p_account }}</view>
											</view>
											<u-button class="btn-check" shape="circle" @click="$c.goto(`/pages/user/sellDetail?id=${item.id}`)">查看</u-button>
										</view>
									</view>
									<view class="flex-end mt-13 lh-10">
										<image src="/static/user/level/info.webp" class="i-12"></image>
										<text class="fs-12 mlr-2" style="color: #7F99C4;">当月销售(元)：</text>
										<text class="fs-16 fw-7" style="color: #1F67E3;">{{ item.sales }}</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		
		<!--  -->
		<view class="">
			<u-popup :show="showAction" mode="center" :overlayOpacity="0.8" :closeOnClickOverlay="false"
				bgColor="transparent" @close="showAction = false">
				<view class="text-center fs-16 text-white">
					<view class="">点击左键右键进行切换</view>
					<image src="/static/user/level/action.webp" class="w-181 h-91"></image>
					<u-divider text="或" :dashed="true" textColor="#989898" lineColor="#989898" textSize="16"></u-divider>
					<view class="">手指滑动屏幕切换</view>
					<image src="/static/user/level/action_2.webp" class="w-140 h-51 mt-20"></image>
					<view class="mt-100">两种方式查看各层级成员</view>
					<u-button class="bg-base text-white w-135 h-51 fs-16 fw-7 mt-35 border-0" shape="circle"
						@click="onCloseAction()">知道了</u-button>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: this.$c.profile(),
				showAction: false,
				account: '',
				level: 1,
				levelMax: 8,
				nums: [
					{ code: 'regular_count', name: '普通用户', count: 0 },
					{ code: 'staff_count',name: '推广员', count: 0 },
					{ code: 'vip_count', name: 'VIP', count: 0 },
					{ code: 'partners_count', name: '合伙人', count: 0 },
					{ code: 'bronze_partners_count', name: '铜牌合伙人', count: 0 },
					{ code: 'silver_partners_count', name: '银牌合伙人', count: 0 },
					{ code: 'gold_partners_count', name: '金牌合伙人', count: 0 },
				],
				list: [],
				page: 1,
				limit: 10,
				listStatus: 'more',
				all: { level_name: '总数', count: 0 }
			}
		},
		async onLoad() {
			const arr = this.$c.getStorage('seeAction') || []
			if(!arr.includes(this.profile.account)) this.showAction = true
			this.getNum()
			this.getList()
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			init() {
				this.page = 1
				this.list = []
				this.listStatus = 'more'
				this.getList()
			},
			async getList() {
				if(this.listStatus != 'more') return
				this.listStatus = 'load'
				const res = await this.$c.fetch(this.$api.user.teamList, {
					page: this.page,
					limit: this.limit,
					tiers: this.level,
					search: { account: '' }
				})
				if(res) {
					res.forEach(item => { item.level = { id: 4, value: '合伙人' }; item.medals = { id: 3, value: '金牌合伙人' } })
					this.list = [...this.list, ...res]
					this.listStatus = res.length < this.limit ? 'end' : 'more'
					this.page++
				}
				if(this.listStatus != 'end') this.listStatus = 'more'
			},
			onChangeLevel(n) {
				if(n) {
					this.level < 8 && this.level++
				} else {
					this.level > 1 && this.level--
				}
			},
			onChange(e) {
				this.level = e.detail.current + 1
				this.init()
			},
			onCloseAction() {
				const arr = this.$c.getStorage('seeAction') || []
				if(!arr.includes(this.profile.account)) {
					arr.push(this.profile.account)
					this.$c.setStorage('seeAction', arr)
				}
				this.showAction = false
			},
			onSearch(e) {
				this.account = uni.$u.trim(this.account)
				if(this.account) {
					if(this.account.length < 4) {
						this.$c.toast('请至少输入4个字符')
						return
					}
					const searchHistory = this.$c.getStorage('searchMemberHistory') || []
					if(searchHistory.indexOf(this.account) == -1) {
						searchHistory.push(this.account)
						this.$c.setStorage('searchMemberHistory', searchHistory)
					}
					this.$c.goto(`/pages/user/sellSearchResult?account=${this.account}`)
				} else {
					this.$c.goto(`/pages/user/sellSearch`)
				}
			},
			async getNum(list = []) {
				const res = await this.$c.fetch(this.$api.user.teamNum)
				if (res) {
					for (let key in res) {
						const item = this.nums.find(item => item.code == key)
						if (item) item.count = res[key] || 0
						if (!['bronze_partners_count', 'gold_partners_count', 'silver_partners_count'].includes(key)) {
							this.all.count += res[key]
						}
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		background: linear-gradient(180deg, #FFE2C0 5%, #FFF0DE 63%, rgba(255, 240, 222, 0) 100%);
	}
	.text_top_name {
		color: #AD987F;
		font-size: 12px;
		margin-top: 3px;
	}
	.member_box {
		background: #F7FAFF;
		border-radius: 8px;
		padding: 15px;
	}
	.member_outbox:not(:first-child) {
		margin-top: 10px;
	}
	.level {
		position: relative;
		z-index: 10;
	}
	.btn-check {
		background: linear-gradient(270deg, #72A3F7 0%, #1D66E2 100%);
		width: 56px;
		height: 23px;
		color: #fff;
		font-size: 12px;
	}
	.border-bottom {
		border-color: #E4E7EB;
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