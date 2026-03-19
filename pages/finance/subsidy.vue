<template>
	<view class="page bg-page flex-col" >
		<view class="" style="background: linear-gradient(to bottom, #C1E4E5 -1%, #f8f8f8 100%);">
			<Title title="购物金" bgColor="transparent" @right="onRule()">
				<template v-slot:right>
					<text>使用规则</text>
				</template>
			</Title>
			<view class=" plr-20 mt-10">
				<view class="flex-between item-stretch">
					<view class="">
						<view class="">当前购物金(元)</view>
						<view class="fs-28 fw-7">{{ profile.subsidy }}</view>
					</view>
					<view class="w-130" style="transform: translateY(-10%);">
						<PlayImg path="subsidy/3" :length="40" :interval="50" type="webp" />
					</view>
				</view>
				<view class="relative flex-between bg-white rounded-8 p-15" style="margin-top: -120rpx;z-index: 2;">
					<view class="fw-7">参与活动任务得购物金</view>
					<view class="">
						<button class="w-83 h-30 text-white fs-12 p-0 border-0 rounded-x flex-center" style="background: linear-gradient(270deg, #F59857 0%, #F3B36A 99%);line-height: 26px;"
							shape="circle" @click="$c.goto('/pages/index/task')">去任务中心</button>
					</view>
				</view>
				<view class="fs-16 mt-30">购物金明细</view>
			</view>
		</view>
		<view class="mt-20 plr-20 mt-10 flex-start">
			<view 
				class="w-58 h-25 flex-center bg-white mr-10 rounded-x" 
				:class="form.mode == item.id && 'text-base fw-7'" 
				v-for="item in navBar" 
				:key="item.id"
				@click="onNav(item.id)"
			>{{ item.name }}</view>
		</view>
		<view class="plr-20 mt-20">
			<view class="ptb-16 plr-16 roundedTop-14 time relative">
				<view class="flex-start" @click="showTimePicker = true">
					<text class="fs-16 fw-7 mr-4">{{ form.month }}</text>
					<u-icon name="arrow-down-fill" color="#3D3D3D" size="14"></u-icon>
				</view>
				<!-- <view class="mt-10 fs-12">
					<text v-if="form.mode != 2">收入：</text>
					<text v-if="form.mode != 2" class="fw-7 mr-32">{{ income }}</text>
					<text v-if="form.mode != 1">支出：</text>
					<text v-if="form.mode != 1" class="fw-7">{{ expense }}</text>
				</view>
				<image src="/static/finance/balance_log.png" class="absolute right-11 bottom-0 w-93 h-84"></image> -->
			</view>
		</view>
		<view class="flex-1 relative">
			<scroll-view scroll-y class="full plr-20" @scrolltolower="getList()">
				<view class="bg-white" v-for="(item, index) in list" :key="index">
					<view class="plr-11">
						<view class="border-bottom ptb-15">
							<view class="flex-between">
								<text>{{ item.type }}</text>
								<text class="fw-7">{{ item.amount }}</text>
							</view>
							<view class="text-info mt-6 fs-10">{{ item.created_at }}</view>
							<view class="text-info mt-6 fs-10">{{ item.remark }}</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		
		<u-popup :show="showInfo" mode="center" bgColor="transparent" :closeOnClickOverlay="false"
			@close="showInfo = false;">
			<view class="w-308 rounded-20 p-20 border-box bg-white" style="min-height: 257px;">
				<view class="text-black text-center fs-18 fw-7">购物金使用规则</view>
				<view class="lh-20 mt-20 text-black">
					1. 参与签到 、推荐好友等活动获得；<br />
					2. 不可转赠或提现；<br />
					3. 只用于购买商品时，部分或全部抵扣。
				</view>
				<button class="bg-base fs-16 flex-center text-white w-234 h-51 mt-34 flex-center rounded-x"
					@click="showInfo = false;">知道了</button>
			</view>
		</u-popup>
		
		<view class="">
			<u-datetime-picker
				:show="showTimePicker"
				:minDate="1735689600000"
				:confirmColor="$c.baseColor()"
				mode="year-month"
				@confirm="onConfirm"
				@cancel="showTimePicker = false">
			></u-datetime-picker>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	import PlayImg from '../../components/PlayImgs.vue'

	export default {
		components: {
			Title,
			PlayImg
		},
		data() {
			return {
				navBar: [{ id: 0, name: '全部' }, { id: 1, name: '已获取' }, { id: 2, name: '已消耗' }],
				form: { page: 1, limit: 10, mode: 0, month: new Date().toISOString().slice(0, 7), status: 'more' },
				list: [],
				income: 0,
				expense: 0,
				showTimePicker: false,
				profile: this.$c.profile(),
				showInfo: false
			}
		},
		async onLoad() {
			const profile = await this.$c.checkeLogin(1)
			if(profile) {
				this.profile = profile
				this.getList()
			}
			this.doAvatar = this.$c.onceRequest(this.onAvatarEdit)
		},
		methods: {
			onRule() {
				this.showInfo = true
			},
			async getList() {
				if(this.form.status != 'more') return
				this.form.status = 'loading'
				const res = await this.$c.fetch(this.$api.finance.subsidyList, this.form)
				if (res) {
					this.income = res.income
					this.expense = res.expenses
					this.form.status = res.month_data.length >= this.form.limit ? 'more' : 'end'
					if(res.month_data) {
						this.list = [...this.list, ...(res.month_data || [])]
						this.form.page++
					}
				}
				if(this.form.status != 'end') this.form.status = 'more'
			},
			onNav(i) {
				if(this.form.status == 'loading') return
				if(this.form.mode == i) return
				this.list = []
				this.form = {...this.form, ...{ page: 1, mode: i, status: 'more'}}
				this.getList()
			},
			onConfirm(e) {
				this.form = {...this.form, ...{ page: 1, month: uni.$u.date(e.value, 'yyyy-mm'),status: 'more'}}
				this.list = []
				this.showTimePicker = false
				this.getList()
			}
		}
	}
</script>

<style>
	.time {
	    background: linear-gradient(180deg, #FFFFFF 35%, #E7F7F5 100%);
	}
</style>