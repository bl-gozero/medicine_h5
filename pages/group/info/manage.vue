<template>
	<view class="page bg-page">
		<Title title="群管理" />
		<view class="plr-20 pt-10">
			<view class="fs-12 pl-15">进群设置</view>
			<view class="bg-white plr-15 ptb-18 rounded-8 mt-12">
				<view class="flex-between" @click="onShowPicer()">
					<text class="mr-20">进群方式</text>
					<view class="flex-start">
						<text class="text-info fs-12 lh-8">
							{{ teamInfo.joinMode >= 0 && columns[0][teamInfo.joinMode] ? columns[0][teamInfo.joinMode].value : '请选择进群方式' }}
						</text>
						<u-icon name="arrow-right" size="14" :color="$c.arrowColor()"></u-icon>
					</view>
				</view>
			</view>
			
			<view class="fs-12 pl-15 mt-20">功能设置</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<view class="flex-between">
					<text class="mr-20">公开设置</text>
					<u-switch 
						v-model="teamCate"
						:activeColor="$c.baseColor()"
						inactiveColor="#DFDFDF"
						:activeValue="1"
						:inactiveValue="2"
						size="20"
						:disabled="memberInfo.memberRole === 0"
						asyncChange
						@change="onCate"
					></u-switch>
				</view>
				<view class="mt-10 text-info fs-12">开启后，将在群聊广场展示和搜索群名中发现</view>
			</view>
			
			<view v-if="memberInfo.memberRole === 1" class="">
				<view class="fs-12 pl-15 mt-20">权限管理</view>
				<view class="bg-white plr-15 ptb-18 rounded-8 mt-12">
					<view class="flex-between" @click="$c.goto('/pages/group/info/admins')">
						<text class="mr-20">群管理员</text>
						<view class="flex-start">
							<text class="text-info fs-12 lh-8">{{ admin }}人</text>
							<u-icon name="arrow-right" size="14" :color="$c.arrowColor()"></u-icon>
						</view>
					</view>
				</view>
			</view>
		</view>		
		<view class="">
			<u-picker 
				:show="showPicker" 
				:columns="columns"
				keyName="value" 
				:confirmColor="$c.baseColor()"
				@confirm="onJoinMode"
				@cancel="showPicker = false"
			></u-picker>
		</view>
	</view>
</template>

<script>
	import Title from '@/components/Title.vue'
	import { updateTeamInfo, teamInfo, memberInfo } from '@/utils/nim.js'

	export default {
		components: {
			Title
		},
		data() {
			return {
				teamInfo,
				memberInfo,
				teamCate: 2,
				doSubmit: null,
				show: false,
				role: 100,
				columns: [
					[{ id: 0, value:'无需验证' },
					{ id: 1, value:'群主或管理员验证' },
					{ id: 2, value:'不允许加入' }]
				],
				showPicker: false,
				doJoinMode: null,
				team_id: null,
				admin: 0
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
			// this.onRoleInfo(info.team_id, this.$c.getStorage('profile').account)
		}, 
		onShow() {
			this.groupInfo()
			if(this.memberInfo.memberRole === 1) this.getAdmins()
		},
		methods: {
			onShowPicer() {
				if(this.memberInfo.memberRole > 0) this.showPicker = true
			},
			async groupInfo() {
				const res = await this.$c.fetch(this.$api.group.groupInfo, {
					team_id: this.team_id,
				})
				if (res) {
					this.teamCate = res.team_category.id
				}
			},
			async getAdmins() {
				const res = await this.$c.fetch(this.$api.group.memberList, {
					team_id: this.team_id,
					page: 1,
					limit: 500,
					search: { name: '' }
				})
				if (res.list && res.list.length > 0) {
					const admin = res.list.filter(m => m.role.id === 2)
					this.admin = admin.length
				}
			},
			async onCate(e) {
				const res = await this.$c.fetch(this.$api.group.category, {
					team_id: this.team_id,
					team_category: e
				})
				if (res) {
					this.teamCate = e
				}
			},
			async onJoinMode(e) {
				this.showPicker = false
				const res1 = updateTeamInfo(teamInfo.teamId, teamInfo.teamType, { joinMode: e.value[0].id })
				if(res1) {
					const res2 = await this.$c.fetch(this.$api.group.joinMode, {
						team_id: this.team_id,
						join_mode: e.value[0].id
					})
					if(res2) {
						this.joinMode = e.value[0]
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