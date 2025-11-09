<template>
	<view class="page bg-white">
		<Title title="添加群管理员" bgColor="#fff" fixed @right="doSubmit">
			<template v-slot:right>
				<text v-if="account_id.length > 0" class="text-primary">确定</text>
			</template>
		</Title>
		<view class="plr-20 pt-10">
			<u-search 
				v-model="form.search.name"
				placeholder="搜索"
				bgColor="#f8f8f8"
				:showAction="false"
				class="flex-1"
				@change="onSearch"
			></u-search>
			<view class="mt-10">
				<view class="flex-between item-stretch" v-for="item in list" :key="item.account_id" @click="onSelect(item)">
					<view class="relative mtb-10">
						<u-avatar :src="item.avatar" size="42" :default-url="$c.userAvatar()" mode="aspectFill"></u-avatar>
						<view 
							v-if="item.role && (item.role.id == 1 || item.role.id == 2)" 
							:class="item.role.id == 1? 'group-owner' : 'group-admin'"
						>{{ item.role.value }}</view>
					</view>
					<view class="flex-1 flex-between border-bottom ml-8">
						<view class="">{{ item.name }}</view>
						<u-icon 
							v-if="item.role && (item.role.id == 1 || item.role.id == 2)"
							name="checkmark-circle-fill"
							color="#94CFD3"
							size="20"
						></u-icon>
						<u-icon 
							v-else-if="item.isSele"
							name="checkmark-circle-fill"
							:color="$c.baseColor()"
							size="20"
						></u-icon>
						<view v-else class="circle"></view>
					</view>
				</view>
			</view>
		</view>
		<u-modal :show="show" title="是否移除" content='移除后该成员将无管理权限？' confirmColor="#3D3D3D" cancelColor="#9F9F9F" showCancelButton
			@cancel="show = false" @confirm="doSubmit"></u-modal>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	import { updateTeamMemberRole, teamInfo, memberInfo } from '@/utils/nim.js'

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
				doSubmit: null,
				team_id: null,
				role: 100,
				form: {  status: 'more', team_id: null, page: 1, limit: 10, search: { name: '' } }
			}
		},
		computed: {
			account_id() {
				return this.list
						.filter(item => item.isSele === true)
						.map(item => item.account_id)
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
			this.onRoleInfo(info.team_id, this.$c.getStorage('profile').account)
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
			this.getList()
		}, 
		onShow() {
			
		},
		onReachBottom() {
			this.getList()
		},
		methods: {
			async getList() { 
				if(this.form.status != 'more') return
				this.form.status = 'loading'
				const res = await this.$c.fetch(this.$api.group.memberList, this.form)
				if (res) {
					res.list.map(item => item.isSele = false)
					this.list = [...this.list, ...(res.list || [])]
					this.form.status = res.list.length >= this.form.limit? 'more' : 'end'
					this.form.page++
				}
				this.form.status = this.form.status == 'end'? 'end' : 'more'
			},
			onSearch(e) {
				if(this.form.status == 'loading') return
				this.form = {...this.form, page: 1, status: 'more', search: {name: e}}
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
				if (res.list && res.list.length > 0) { 
					this.role = res.list[0].role.id
					if(this.role != 1) {
						this.$c.toast('无访问权限')
						setTimeout(() => {
							this.$c.goto('/pages/group/index')
						}, 1500)
					}
				}
			},
			onSelect(item) {
				if(item.role && (item.role.id == 1 || item.role.id == 2)) return
				item.isSele = !item.isSele
			},
			async onSubmit() {
				this.show = false
				if(this.account_id.length == 0) {
					this.$c.toast('请选择成为管理员的群成员')
					return
				}
				const res1 = await updateTeamMemberRole(this.account_id, 2)
				if(res1) {
					const res = await this.$c.fetch(this.$api.group.role, {
						team_id: this.team_id,
						account_id: this.account_id,
						role: 2
					})
					if (res) {
						this.$c.toast('添加成功')
						this.list
							.filter(item => item.isSele === true)
							.map(item => {
								item.role = { id: 2, value: '管理员' }
								item.isSele =false
							})
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