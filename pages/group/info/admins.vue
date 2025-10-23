<template>
	<view class="page bg-white">
		<Title title="群管理员" bgColor="#fff" fixed />
		<view class="plr-20 pt-10">
			<view class="">群管理员({{ admins.length }})</view>
			<view class="flex-between item-stretch" v-for="item in admins" :key="item.account_id">
				<view class="relative mtb-10">
					<u-avatar :src="item.avatar" size="42" default-url="/static/user/default.png" mode="aspectFill"></u-avatar>
					<view 
						v-if="item.role && (item.role.id == 1 || item.role.id == 2)" 
						:class="item.role.id == 1? 'group-owner' : 'group-admin'"
					>{{ item.role.value }}</view>
				</view>
				<view class="flex-1 flex-between ml-8 border-bottom">
					<text class="u-line-1">{{ item.name }}</text>
					<view v-if="role === 1 && item.role.id === 2" class="">
						<u-button
							class="w-47 h-20 fs-10"
							shape="circle"
							@click="onRemove(item)"
						>解除</u-button>
					</view>
				</view>
			</view>
			<view class="bg-page text-info rounded-8 fs-12 lh-16 ptb-11 plr-16 mt-50">
				群管理员拥有以下权限:<br>
				1、修改群资料<br>
				2、发表/修改群公告<br>
				3、@所有人<br>
				4、删除群成员(除群主）<br>
				5、群语音功能<br>
				6、设置进群方式，并可同意/拒绝进群申请置顶和撤群成员消息<br>
			</view>
			<view v-if="role === 1" class="mt-20">
				<u-button class="fw-7 lh-10 fs-14 bg-base text-white w-247 h-47 flex-center" shape="circle" text="添加管理员"
					@click="$c.goto('/pages/group/info/addAdmins')"></u-button>
			</view>
		</view>
		<u-modal :show="show" title="是否移除" content='移除后该成员将无管理权限？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="show = false" @confirm="doSubmit"></u-modal>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	import {
		teamInfo,
		memberInfo,
		updateTeamMemberRole
	} from '@/utils/nim.js'

	export default {
		components: {
			Title
		},
		data() {
			return {
				admins: [],
				show: false,
				doSubmit: null,
				team_id: null,
				account_id: [],
				role: 100
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
			this.onRoleInfo(info.team_id, this.$c.getStorage('profile').account)
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		}, 
		onShow() {
			this.getAdmins()
		},
		methods: {
			async getAdmins() {
				const res = await this.$c.fetch(this.$api.group.memberList, {
					team_id: this.team_id,
					page: 1,
					limit: 500,
					search: { name: '' }
				})
				if (res.list && res.list.length > 0) {
					this.admins = res.list.filter(m => m.role.id < 3)
				}
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
			onRemove(item) {
				this.account_id[0] = item.account_id
				this.show = true
			},
			async onSubmit() {
				this.show = false
				const res1 = await updateTeamMemberRole(this.account_id, 0)
				if(res1) {
					const res = await this.$c.fetch(this.$api.group.role, {
						team_id: this.team_id,
						account_id: this.account_id,
						role: 3
					})
					if (res) {
						this.getAdmins()
					}
				}
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

	.lv_box {
		width: 308px;
		height: 280px;
		border-radius: 20px;
		background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);
	}

	.disabled-textarea {
		background-color: #fff !important;
	}
</style>