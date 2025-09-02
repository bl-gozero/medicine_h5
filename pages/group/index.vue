<template>
	<view class="page bg-page">
		<view class="title_bg pb-18 plr-20" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between">
				<text class="fw-7 fs-18">群聊</text>
			</view>
		</view>
		<view class="ptb-16 plr-30 flex-between bg-white">
			<view class="text-center" v-for="(item, index) in navList" :key="index" @click="onNav(item)">
				<image :src="item.icon" class="i-39"></image>
				<view class="fs-12 mt-8">{{ item.name }}</view>
			</view>
		</view>
		<view class="mt-10 list_box plr-20 ptb-10 bg-white">
			<view class="flex-between item-stretch ptb-6" v-for="item in list" :key="item.id">
				<view class="relative ">
					<image :src="item.icon" class="i-42 rounded" mode="aspectFill"></image>
					<view 
						v-if="item.role && item.role.id < 3" 
						class="absolute left-0 right-0 auto-x bottom-0 text-base fs-8 lh-8 w-28 h-13 flex-center rounded-4"
						style="background: #B3E5E8;"
					>{{ item.role.value }}</view>
				</view>
				<view class="flex-between ml-8 flex-1">
					<view class="u-line-1 flex-1">{{ item.name }}</view>
					<view 
						v-if="item.is_verify && item.is_verify == 2"
						class="text-white fs-12 lh-10 w-36 h-14 rounded-x flex-center ml-8"
						style="background: #9DC7CA;"
					>审核中</view>
				</view>
			</view>
		</view>
		<view class="h-70"></view>
		<TabBar />
		
		<!-- 群操作 -->
		<u-popup :show="showOperation" mode="bottom" round="20" @close="showOperation = false">
			<view class="plr-20 pt-5 pb-50">
				<view class="text-center">
					<view class="ptb-20 border-bottom">标为已读/未读</view>
					<view class="ptb-20 border-bottom">置顶聊天</view>
					<view class="ptb-20 text-danger border-bottom">删除并退出该群聊</view>
				</view>
				<u-button
					class="fw-7 fs-14 w-224 h-43 mt-20 border-0"
					style="background-color: #f8f8f8;"
					shape="circle"
					text="取消"
					@click="showOperation = false"
				></u-button>
			</view>
		</u-popup>
		
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
					@click="showCreate = false;$c.goto('/pages/group/pay')"
				></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import TabBar from '../../components/TabBar.vue'
	export default {
		components: {
			TabBar
		},
		data() {
			return {
				navList: [
					{ id: 1, name: '发现群聊', icon: '/static/group/find.png', url: '' },
					{ id: 2, name: '创建群聊', icon: '/static/group/create.png', url: '' },
					{ id: 3, name: '我的群聊', icon: '/static/group/my_group.png', url: '/pages/group/myGroup' },
					{ id: 4, name: '群的申请', icon: '/static/group/apply.png', url: '' },
				],
				showOperation: false,
				showCreate: false,
				showLv: false,
				profile: this.$c.getStorage('profile') || {},
				search: { page: 1, limit: 10, name: '', load: 'more', search: {
						join_state: 2,
						name: '',
						is_preferred: 2
					}
				},
				list: []
			}
		},
		onLoad() {
			this.getProfile()
			this.getList()
		},
		onShow() {
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			onNav(e) {
				if(e.id == 2) {
					if(this.profile.level.id >= 4) {
						this.showCreate = true
					} else {
						this.showLv = true
					}
				} else {
					this.$c.goto(e.url)
				}
			},
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.profile = res
					this.$c.setStorage('profile', res)
				}
			},
			async getList() {
				if(this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.group.groupList, this.search)
				if(res) {
					if(res.length > 0) this.list = [...this.list, ...res]
					this.search.load = res.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if(this.search.load != 'end') this.search.load = 'more'
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
</style>