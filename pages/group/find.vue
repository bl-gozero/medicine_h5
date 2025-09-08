<template>
	<view class="page plr-20 bg">
		<view class="flex-between" :class="`pt-${$c.barHeight()}`">
			<image src="/static/icon/back.png" class="i-24 mr-10" @click="$c.goto('/pages/group/index')"></image>
			<u-search v-model="search.search.name" placeholder="搜索你想找的群聊" bgColor="#fff" :showAction="false" class="flex-1"></u-search>
			<view class="flex-end ml-15" @click="onGroupCreate()">
				<image src="/static/goods/create.png" class="i-25 mr-7"></image>
				<text>创建</text>
			</view>
		</view>
		<view class="mt-15 fs-18 lh-15">Hi欢迎来到群聊广场</view>
		<view class="mt-6 fs-12 text-info">寻找你感兴趣的群聊：</view>
		<view class="mt-27 flex-between">
			<view class="p-15 border-box flex-1 top_group">
				<view class="fw-6">我们是官方群聊</view>
				<view class=""></view>
				<view class="mt-20 fs-10 lh-12 text-info">这里可以教大家怎么做团队，怎样提升业绩</view>
			</view>
			<view class="p-15 border-box ml-13 flex-1 top_group">
				<view class="fw-6">提高团队业绩</view>
				<view class=""></view>
				<view class="mt-20 fs-10 lh-12 text-info">这里可以教大家怎么做团队，怎样提升业绩</view>
			</view>
		</view>
		<u-tabs
			class="mt-40"
			:list="tabs"
			keyName="name"
			:lineColor="$c.baseColor()"
			lineWidth="10"
			lineHeight="2"
			activeStyle="color: #3d3d3d !important;font-weight: 700;font-size: 12px;"
			inactiveStyle="color: #9F9F9F !important;font-size: 12px;"
			itemStyle="height: 28px;"
			@click="onSwitch"
		></u-tabs>
		<view class="list_box">
			<view class="flex-between ptb-20" v-for="item in list" :key="item.team_id">
				<view class="relative ">
					<u-avatar :src="item.icon" size="42" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
					<view 
						v-if="item.role && (item.role.id == 1 || item.role.id == 2)" 
						class="absolute left-0 right-0 auto-x bottom-0 text-base fs-8 lh-8 w-28 h-13 flex-center rounded-4"
						style="background: #B3E5E8;"
					>{{ item.role.value }}</view>
				</view>
				<view class="flex-1 ml-10 mr-30">
					<view class="u-line-1">{{ item.name }}({{ item.member_count }})</view>
					<view class="u-line-1 mt-6 fs-12 text-info">{{ item.intro }}</view>
				</view>
				<view
					v-if="item.join_state && item.join_state.id == 2"
					class="text-info fs-12 lh-10 w-53 h-21 rounded-x flex-center"
					style="border: 0.5px solid #9F9F9F;"
				>{{ item.join_state.value }}</view>
				<view
					v-else-if="item.join_state && item.join_state.id == 1"
					class="text-white fs-12 lh-10 w-53 h-21 rounded-x flex-center"
					style="background: #9DC7CA;"
				>{{ item.join_state.value }}</view>
				<view
					v-else
					class="text-white bg-base fs-12 lh-10 w-53 h-21 rounded-x flex-center"
					@click="group = item;showJoin = true"
				>加入</view>
			</view>
		</view>
		
		<!-- 加入 -->
		<u-popup :show="showJoin" mode="bottom" round="20" closeable @close="showJoin = false">
			<view class="p-20 pb-30">
				<view class="flex-center">
					<u-avatar :src="group.icon" size="58" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
				</view>
				<view class="text-center ptb-15 border-bottom fs-16 fw-6">{{ group.name }}({{ group.member_count }})</view>
				<view class="fs-12 text-info mtb-15">群介绍</view>
				<view class="">{{ group.intro }}</view>
				<u-button
					class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white mt-70"
					shape="circle"
					text="申请加入"
					@click="onJoin()"
				></u-button>
				<view class="text-center fs-10 mt-10">
					<text class="text-info">维护群内生态健康，请遵守</text>
					<text class="text-base" @click="$c.goto('/pages/index/userAgreement')">《群聊公约》</text>
				</view>
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
					@click="toCreate()"
				></u-button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: {
			Title
		},
		data() {
			return {
				search: { page: 1, limit: 10, load: 'more', search: {
						join_state: 0,
						name: '',
						is_preferred: 1
					}
				},
				switcher: 1,
				list: [],
				tabs: [{ id: 1, name: '推荐' }, { id: 2, name: '审核中' }],
				showJoin: false,
				group: {},
				doJoin: null,
				showCreate: false,
				showLv: false,
				profile: this.$c.getStorage('profile') || {},
			}
		},
		onLoad() {
			this.getList()
			this.getProfile()
			this.doJoin = this.$c.onceRequest(this.onJoin)
		},
		onShow() {
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				if(res) {
					this.profile = res
					this.$c.setStorage('profile', res)
				}
			},
			onSwitch(item) {
				if(this.switcher == item.id) return
				this.switcher = item.id
				if(item.id == 1) {
					this.search = { page: 1, limit: 10, load: 'more', search: {
							join_state: 0,
							name: '',
							is_preferred: 1
						}
					}
				} else if(item.id == 2) {
					this.search = { page: 1, limit: 10, load: 'more', search: {
							join_state: 1,
							name: '',
							is_preferred: 1
						}
					}
				}
				this.list = []
				this.getList()
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
			},
			async onJoin() {
				this.showJoin = false
				const res = await this.$c.fetch(this.$api.group.join, { team_id: this.group.team_id })
				if(res) {
					this.$c.toast('已提交申请，请等待审核')
					this.list = this.list.map(item => {
						if (item.team_id === this.group.team_id) {
							return { ...item, join_state: { id: 1, value: '审核中' } } // 举例更新状态
						}
						return item
					})
				}
			},
			onGroupCreate() {
				this.$c.goto('/pages/group/create')
				// if(this.profile.level.id >= 4) {
				// 	this.showCreate = true
				// } else {
				// 	this.showLv = true
				// }
			},
			toCreate() {
				this.showCreate = false
				this.$c.goto('/pages/group/pay')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		background: linear-gradient(180deg, #A4D9D7 0%, rgba(216, 216, 216, 0) 211px, #fff 100%);
	}
	.top_group {
		background: #FFFFFF;
		box-shadow: 0px 4px 6px 0px rgba(152, 152, 152, 0.18);
		border-radius: 10px;
	}
	.lv_box {
		width: 308px;
		height: 280px;
		border-radius: 20px;		
		background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);
	}
</style>