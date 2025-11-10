<template>
	<view class="page bg-white plr-20">
		<view class="title_box fixed top-0 left-0 pw-100 pb-10 bg-white plr-10 border-box" style="z-index: 100;">
			<Title :isBlank="true"></Title>
			<view class="flex-between">
				<image src="/static/icon/back.png" class="i-24 mr-23" @click="$c.goBack()"></image>
				<u-search v-model="search.search.account" placeholder="输入账号搜索成员" bgColor="#F8F8F8" :showAction="false" @search="init()"></u-search>
				<u-button
					class="bg-base fs-12 text-white w-62 h-32 ml-12"
					shape="circle"
					text="搜索"
					@click="init()"
				></u-button>
			</view>
		</view>
		<view class="pt-70">
			<view v-if="search.search.account && search.load != 'loading' && list.length === 0" class="h-300 flex-center text-info">未搜索到相关下级信息</view>
			<view v-else-if="list.length" class="member_box" v-for="item in list" :key="item.id">
				<view class="flex-between item-stretch gap-10">
					<view class="ptb-12">
						<view class="relative">
							<u-avatar :src="item.avatar" :defaultUrl="$c.userAvatar()" size="36" mode="aspectFill"></u-avatar>
							<view :class="['level', item.level ? `bg-${item.level.id}` : '']">{{ item.level ? item.level.value : '' }}</view>
						</view>
					</view>
					<view class="flex-1 flex-between border-bottom">
						<view class="lh-10 flex-1">
							<view class="u-line-1">{{ item.account }}</view>
							<view class="fs-12 text-info mt-9">{{ item.created_at }}</view>
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
		<view class="h-50"></view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: { Title },
		data() {
			return {
				search: { page: 1, limit: 10, tiers: 1, search: { account: '' }, load: 'more' },
				list: [],
			}
		},
		onLoad(p) {
			this.$c.checkeLogin()
			if(p.account) {
				this.search.search.account = p.account
				this.init()
			}
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			init() {
				if(this.search.search.account.length < 4) {
					this.$c.toast('请至少输入4个字符')
					return
				}
				if(this.search.load == 'load') return
				this.list = []
				this.search.page = 1
				this.search.load = 'more'
				this.getList()
			},
			async getList() {
				if(!this.search.search.account) return
				if(this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.user.teamList, this.search)
				if(res) {
					this.list = [...this.list, ...res]
					this.search.load = res.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if(this.search.load != 'end') this.search.load = 'more'
			},
		}
	}
</script>

<style lang="scss" scoped>
	.member_box {
		background: #F7FAFF;
		border-radius: 8px;
		padding: 15px;
	}
	.member_box:not(:first-child) {
		margin-top: 10px;
	}
	.level {
		font-size: 10px;
		width: 45px;
		height: 14px;
		line-height: 14px;
		text-align: center;
		border-radius: 4px;
		position: relative;
		margin-top: -3px;
		transform: translateX(-5px);
		z-index: 10;
	}
	.bg-1 {
		background: #D8D8D8;
	}
	.bg-2 {
		background: #E5E0D2;
	}
	.bg-3 {
		background: #B08E3E;
		color: #fff;
	}
	.bg-4 {
		background: #30304C;
		color: #fff;
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
</style>
