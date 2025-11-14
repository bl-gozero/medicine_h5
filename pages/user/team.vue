<template>
	<view class="page bg-page flex-col">
		<view class="title_box fixed top-0 left-0 pw-100 bg-page" style="z-index: 10;">
			<Title :title="link.length == 1? '我邀请的好友':'他邀请的好友'" @back="onBack()" />
			<view v-if="link.length == 1" class="bg-white roundedTop-20 pt-10 pb-15 plr-20">
				<u-tabs
					:list="levels"
					keyName="name"
					:lineColor="$c.baseColor()"
					lineWidth="10"
					lineHeight="2"
					activeStyle="color: #3d3d3d !important;font-weight: 700;"
					inactiveStyle="color: #9F9F9F !important;"
					itemStyle="height: 24px;"
					@click=""
				></u-tabs>
			</view>
		</view>
		<view :class="link.length == 1? `h-${height1}` : `h-${height2}`"></view>
		<view v-if="link.length > 1" class="plr-20 pt-10 pb-20 text-info text-wrap">
			<text class="name" v-for="(item, index) in link" :key="item.id" :class="{ 'fw-7 text-black': index == link.length - 1 }">{{ item.account }}</text>
			<text>邀请的好友{{ list.length }}人</text>
		</view>
		<view class="flex-1 bg-white plr-20">
			<view class="list_box">
				<view class="flex-between ptb-17 fs-12" v-for="(item, index) in list" :key="item.id" @click="onFriend(item)">
					<u-avatar :src="item.avatar" :defaultUrl="$c.userAvatar()" size="36" shape="circle"></u-avatar>
					<view class="flex-1 mlr-10">
						<view class="flex-between">
							<view class="flex-start">
								<text class="u-line-1 fs-14">{{ item.account }}</text>
								<view class="level flex-center ml-4" :style="$c.calcLvBg(item)">{{ $c.calcLvName(item) }}</view>
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
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title_box').then(res => {
					this.height1 = res.height
				})
				this.$uGetRect('.title-bar').then(res => {
					this.height2 = res.height
				})
			}, 100)
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
					for (let key in res) {
						if (key != 'user_list') {
							const item = this.nums.find(item => item.code == key)
							if (item) item.count = res[key] || 0
							if (!['bronze_partners_count', 'gold_partners_count', 'silver_partners_count'].includes(key)) {
								this.levels[0].count += res[key]
							}
						}
					}
					this.levels = [...this.levels, ...this.nums]
					this.levels.forEach(item => { item.name = `${item.name}(${item.count})` })
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
</style>