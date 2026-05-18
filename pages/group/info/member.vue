<template>
	<view class="page bg-white">
		<Title title="群成员" bgColor="#fff" fixed />
		<view class="plr-20 pt-10">
			<u-search v-model="form.search.name" placeholder="搜索" bgColor="#f8f8f8" :showAction="false" class="flex-1"
				@change="onSearch"></u-search>
			<view class="mt-17 mb-10">
				<u-tabs :list="navList" keyName="name" :lineColor="$c.baseColor()" lineWidth="10" lineHeight="2"
					activeStyle="color: #3d3d3d !important;font-weight: 700;" inactiveStyle="color: #9F9F9F !important;"
					itemStyle="height: 28px;" @click="onSwitch"></u-tabs>
			</view>
			<view class="">
				<view v-show="nav == 1 || (item.chat_banned && item.chat_banned.id == 1)"
					class="flex-between item-stretch" v-for="item in list" :key="item.account_id">
					<view class="relative mtb-10">
						<u-avatar :src="item.avatar" size="42" :default-url="$c.userAvatar()"
							mode="aspectFill"></u-avatar>
						<view v-if="item.role && (item.role.id == 1 || item.role.id == 2)"
							:class="item.role.id == 1? 'group-owner' : 'group-admin'">{{ item.role.value }}</view>
					</view>
					<view class="flex-1 flex-between border-bottom ml-8">
						<view class="">{{ item.name }}</view>
						<view v-if="memberInfo.memberRole > 0" class="flex-end">
							<button class="w-47 h-20 fs-10 plr-0 text-danger border-danger ml-8  flex-center rounded-x"
								@click="onShowRemove(item)">移除</button>

							<button v-if="item.chat_banned.id == 1" class="w-47 h-20 fs-10 plr-0 ml-8  flex-center rounded-x border-plain" plain
								@click="doBanned(item)">解除禁言</button>

							<button v-if="item.chat_banned.id == 2"
								class="w-47 h-20 fs-10 plr-0 border-1 text-base ml-8 flex-center rounded-x"
								@click="doBanned(item)">禁言</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-modal :show="show" title="是否移除" content='移除后该成员将离开当前群聊？' confirmColor="#3D3D3D" cancelColor="#9F9F9F"
			showCancelButton @cancel="show = false" @confirm="doRemove"></u-modal>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	import {
		teamInfo,
		setMemberBanned,
		memberInfo,
		kickMember
	} from '../../../utils/nim'

	export default {
		components: {
			Title
		},
		data() {
			return {
				teamInfo,
				memberInfo,
				list: [],
				show: false,
				doRemove: null,
				doBanned: null,
				team_id: null,
				form: {
					status: 'more',
					team_id: null,
					page: 1,
					limit: 10,
					search: {
						name: ''
					}
				},
				account: {},
				nav: 1
			}
		},
		computed: {
			bannedList() {
				return this.list.filter(item => item.chat_banned.id === 1)
			},
			navList() {
				// const bannedList = this.list.filter(item => item.chat_banned.id === 1)
				const banned = this.bannedList.length
				return [{
					id: 1,
					name: `全部(${teamInfo.memberCount || 0})`
				}, {
					id: 2,
					name: `已禁言(${banned})`
				}]
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.$c.checkNim()
			const info = this.$c.getStorage('chatInfo') || {}
			if (!info || Object.keys(info).length === 0 || !info.team_id) {
				this.$c.toast('参数有误')
				this.$c.goto('/pages/group/index')
				return
			}
			this.team_id = info.team_id
			this.form.team_id = info.team_id
			// this.onRoleInfo(info.team_id, this.$c.getStorage('profile').account)
			this.doRemove = this.$c.onceRequest(this.onRemove)
			this.doBanned = this.$c.onceRequest(this.onBanned)
			this.getList()
		},
		onShow() {

		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getList() {
				if (this.form.status != 'more') return
				this.form.status = 'loading'
				const res = await this.$c.fetch(this.$api.group.memberList, this.form)
				if (res) {
					res.list.map(item => item.isSele = false)
					this.list = [...this.list, ...(res.list || [])]
					this.form.status = res.list.length >= this.form.limit ? 'more' : 'end'
					this.form.page++
				}
				this.form.status = this.form.status == 'end' ? 'end' : 'more'
			},
			onSearch(e) {
				if (this.form.status == 'loading') return
				this.form = {
					...this.form,
					page: 1,
					status: 'more',
					search: {
						name: e
					}
				}
				this.list = []
				this.getList()
			},
			async onRoleInfo(team_id, name) {
				const res = await this.$c.fetch(this.$api.group.memberList, {
					team_id: this.team_id,
					page: 1,
					limit: 10,
					search: {
						name: name
					}
				})
				if (res.list && res.list.length > 0) this.role = res.list[0].role.id
			},
			onShowRemove(item) {
				this.account = item
				this.show = true
			},
			async onRemove(item) {
				this.show = false
				const res1 = await kickMember([this.account.account_id])
				if (res1) {
					const res = await this.$c.fetch(this.$api.group.remove, {
						team_id: this.team_id,
						account_id: this.account.account_id,
					})
					if (res) {
						this.list = this.list
							.filter(item => item.account_id != this.account.account_id)
					}
				}
			},
			async onBanned(item) {
				const status = item.chat_banned.id === 1 ? false : true
				const res1 = await setMemberBanned(teamInfo.teamId, teamInfo.teamType, item.account_id, status)
				if (res1) {
					const chat_banned = item.chat_banned.id === 1 ? 2 : 1
					const res = await this.$c.fetch(this.$api.group.banned, {
						team_id: this.team_id,
						account_id: item.account_id,
						chat_banned: chat_banned
					})
					if (res) {
						this.list
							.filter(i => i.account_id === item.account_id)
							.map(i => {
								i.chat_banned = chat_banned == 1 ? {
									id: 1,
									value: '是'
								} : {
									id: 2,
									value: '否'
								}
							})
					}
				}
			},
			onSwitch(e) {
				this.nav = e.id
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-textarea {
		padding: 0 !important;
	}

	.placeholderClass {
		font-size: 14px !important;
		color: #989898 !important;
	}

	::v-deep .u-textarea__field {
		font-size: 14px !important;
		color: #3d3d3d !important;
	}

	.disabled-textarea {
		background-color: #fff !important;
	}
</style>