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
					@click="onSwitch"
				></u-tabs>
			</view>
		</view>
		<view :class="link.length == 1? `h-${height1}` : `h-${height2}`"></view>
		<view v-if="link.length > 1" class="plr-20 pt-10 pb-20 flex-start text-info">
			<view class="flex-start" v-for="(item, index) in link" :key="item.id">
				<u-icon v-if="index > 0" name="arrow-right" color="#9F9F9F" size="14"></u-icon>
				<text :class="index == link.length - 1? 'fw-7' : ''">{{ item.account }}</text>
			</view>
			<text>邀请的好友{{ list.length }}人</text>
		</view>
		<view class="flex-1 bg-white plr-20">
			<view class="list_box">
				<view class="flex-between ptb-17 fs-12" v-for="(item, index) in list" :key="item.id" @click="onFriend(item)">
					<image src="/static/user/avatar.png" class="i-36 rounded"></image>
					<view class="flex-1 mlr-10">
						<view class="flex-between">
							<view class="flex-start">
								<text class="u-line-1 fs-14">{{ item.account }}</text>
								<view class="level flex-center ml-4" :style="getBg(item.level.id) ">{{ item.level.value }}</view>
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
				levels: [{ id: 0, name: '全部' }],
				list: [],
				link: [{ id: 0, account: '我' }],
				height1: 0,
				height2: 0,
				status: 0,
			}
		},
		onLoad() {
			this.getLevelList()
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
			async getLevelList() {
				const res = await this.$c.fetch(this.$api.config.levelList)
				if(res) this.levels = [...this.levels, ...res]
			},
			async getFriendList() {
				const res = await this.$c.fetch(this.$api.user.friend, this.form)
				if(res) this.list = res
			},
			onSwitch(item) {
				if(this.form.level_id == item.id) return
				this.form.level_id = item.id
				this.list = []
				this.getFriendList()
			},
			getBg(id) {
				switch(id) {
					case 3: return 'background: #B08E3E;color: #fff'
					case 4: return 'background: #30304C;color: #fff'
					default: return 'background: #D8D8D8'
				}
			},
			onFriend(item) {
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
	.level {
		width: 45px;
		height: 14px;
		border-radius: 3px;
		font-size: 10px;
		line-height: 10px;
		margin-left: 4px;
	}
	.num {
		color: #646464;
	}
	
	
</style>