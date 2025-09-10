<template>
	<view class="page bg-white plr-20">
		<Title title="我的群聊" bgColor="#fff" fixed ph></Title>
		<view v-if="payList.length > 0" class="">
			<view class="flex-between item-stretch" v-for="item in payList" :key="item.id" @click="group = item;showOperation = true">
				<view class="ptb-10">
					<view class="relative">
						<u-avatar :src="item.icon" size="42" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
						<view 
							v-if="item.role && item.role.id < 3" 
							class="absolute left-0 right-0 auto-x bottom-0 text-base fs-8 lh-8 w-28 h-13 flex-center rounded-4"
							style="background: #B3E5E8;"
						>{{ item.role.value }}</view>
					</view>
				</view>
				<view class="border-bottom flex-between ml-8 flex-1">
					<view class="u-line-1 flex-1 mr-8">{{ item.name }}</view>
					<view
						v-if="item.is_payment && item.is_payment.id == 2"
						class="bg-base text-white fs-12 lh-8 fw-5 w-53 h-21 rounded-x flex-center plr-0"
						shape="circle"
					>{{ item.is_payment.value }}</view>
				</view>
			</view>
		</view>
		<view class="">
			<view 
				v-if="item.is_payment && item.is_payment.id == 1" 
				class="flex-between item-stretch"
				v-for="item in list"
				:key="item.id"
				@click="onGroup(item)"
			>
				<view class="ptb-10">
					<view class="relative">
						<u-avatar :src="item.icon" size="42" default-url="/static/group/default.png" mode="aspectFill"></u-avatar>
						<view 
							v-if="item.role && item.role.id < 3" 
							class="absolute left-0 right-0 auto-x bottom-0 text-base fs-8 lh-8 w-28 h-13 flex-center rounded-4"
							style="background: #B3E5E8;"
						>{{ item.role.value }}</view>
					</view>
				</view>
				<view class="border-bottom flex-between ml-8 flex-1">
					<view class="u-line-1 flex-1">{{ item.name }}</view>
					<view 
						v-if="item.is_verify && item.is_verify.id == 1"
						class="text-white fs-12 lh-8 w-53 h-21 rounded-x flex-center ml-8"
						style="background: #D6D6D6;"
					>审核中</view>
				</view>
			</view>
		</view>
		
		<!-- 群操作 -->
		<u-popup :show="showOperation" mode="bottom" round="20" @close="showOperation = false">
			<view class="plr-20 pt-5 pb-50">
				<view class="text-center">
					<view 
						class="ptb-20 border-bottom" 
						@click="$c.goto(`/pages/group/pay?id=${group.id}`);showOperation = false"
					>去支付</view>
					<view class="ptb-20 text-danger border-bottom" @click="doDelete">删除</view>
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
				list: [],
				payList: [],
				group: {},
				showOperation: false,
				doDelete: null
			}
		},
		onLoad() {
			this.doDelete = this.$c.onceRequest(this.onDelete)
		},
		onShow() {
			this.getPayList()
			this.getList()
		},
		methods: {
			async getList() {
				const res = await this.$c.fetch(this.$api.group.myList)
				if(res) this.list = res
			},
			async getPayList() {
				const res = await this.$c.fetch(this.$api.group.payingList)
				if(res) this.payList = res
			},
			async onDelete() {
				this.showOperation = false
				const res = await this.$c.fetch(this.$api.group.payDelete, { id: this.group.id })
				if(res) {
					this.getPayList()
					this.getList()
				}
			},
			onGroup(item) {
				if(item.is_payment.id == 1 && item.is_verify.id == 2) {
					this.$c.goto('/pages/group/chat')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>