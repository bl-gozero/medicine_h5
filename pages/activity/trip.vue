<template>
	<view>
		<view v-if="page == 1" class="page" style="background: #47969B;">
			<Title title="椰风海韵活动" fixed bgColor="#fff" />
			<image src="/static/avtivity/trip/top.webp" class="pw-100 block" mode="widthFix"></image>
			<view class="relative">
				<image src="/static/avtivity/trip/part_1.webp" class="pw-100 block" mode="widthFix"></image>
				<view class="absolute top-0 flex-center auto-x">
					<view class="fs-16 p-7 lh-10 rounded-4 "
						style="background: linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%);color: #0E5A29;"
						@click="$c.goto('/pages/index/protocols?type=7')"
					>查看详细旅游计划 >></view>
				</view>
			</view>
			<view class="relative">
				<image src="/static/avtivity/trip/part_2.webp" class="pw-100 block" mode="widthFix"></image>
				<view class="full pt-50">
					<view class="flex-center">
						<view class="w-343 part relative pb-10">
							<image src="/static/avtivity/trip/titile_1.webp" class="w-132 h-121 absolute" style="top: -35px;left: -10px;"></image>
							<view class="relative flex-center mt-70">
								<image src="/static/avtivity/trip/bg_line.webp" class="w-327 h-74"></image>
								<view class="full border-box pl-36 pr-40 pt-33">
									<view class="relative">
										<u-line-progress :percentage="process" :showText="false" activeColor="#fff" inactiveColor="#2C6775" 
											:height="6"></u-line-progress>
										<view class="percent text-center" :style="{left: `${item.left}%`}" v-for="item in items" :key="item.id">
											<image :src="`/static/avtivity/trip/${item.id}.webp`" class="i-52"></image>
											<view class="mt-10 mb-14">
												<image src="/static/avtivity/trip/point.webp" class="i-27"></image>
											</view>
											<view class="flex-center">
												<view class="num w-30">{{ item.num }}盒</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="fs-14 mt-30 flex-center">
								<text class="fw-3" style="color: #2C6775;">已购买数量</text>
								<text class="fw-7 ml-2" style="color: #2C6775;">{{ stat.pur_quan }}盒</text>
								<image src="/static/avtivity/trip/buy.webp" class="w-73 h-48 ml-4" @click="$c.goto('/pages/goods/detail?id=28')"></image>
							</view>
							<view class="flex-center fs-12" style="color: #83ACB6;">
								<view class="" @click="onLog()">活动购买记录>></view>
							</view>
							<view class="flex-center mt-25">
								<image v-if="!stat.pur_quan" src="/static/avtivity/trip/btn_0.webp" class="w-282 h-78"></image>
								<image v-else-if="stat.quota && stat.record_num === 0" src="/static/avtivity/trip/btn_1.webp" class="w-282 h-78" @click="onInfo()"></image>
								<image v-else-if="stat.quota > stat.record_num" src="/static/avtivity/trip/btn_2.webp" class="w-282 h-78" @click="onInfo()"></image>
								<image v-else-if="stat.quota == stat.record_num" src="/static/avtivity/trip/btn_3.webp" class="w-282 h-78" @click="onInfo()"></image>
							</view>
							<view v-if="stat.end_time" class="fs-12 text-center" style="color: #B3882B;">申请截止日期: {{ stat.end_time }}</view>
						</view>
					</view>
					<view class="flex-center mt-40">
						<view class="w-343 part relative pt-25 pb-20">
							<view class="relative flex-center">
								<image src="/static/avtivity/trip/bg_line.webp" class="w-327 h-74"></image>
								<view class="full border-box pl-36 pr-40 pt-33">
									<view class="relative">
										<u-line-progress :percentage="process2" :showText="false" activeColor="#fff" inactiveColor="#2C6775" 
											:height="6"></u-line-progress>
										<view class="percent text-center" :style="{left: `${item.left}%`}" v-for="item in items" :key="item.id">
											<image :src="`/static/avtivity/trip/${item.id}.webp`" class="i-52"></image>
											<view class="mt-10 mb-14">
												<image src="/static/avtivity/trip/point.webp" class="i-27"></image>
											</view>
											<view class="flex-center">
												<view class="num" style="text-wrap: nowrap;">{{ item.text }}</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="text-center mt-30">
								<text style="color: #8A8A8A;font-weight: 350;">您当前等级推广员</text>
								<text style="color: #5A5A5A;font-weight: 700;">{{ $c.calcLvName(profile) }}</text>
							</view>
							<image src="/static/avtivity/trip/cs.webp" class="w-56 h-69 absolute" 
								style="right: -12px;bottom: -26px;" @click="$c.goto('/pages/index/web')"></image>
						</view>
					</view>
					<view class="text-center fw-3 mt-25" style="color: #0F4B43;">活动最终参与资格以主办方审核结果为准</view>
				</view>
			</view>
		</view>
		
		<view v-if="page == 2" class="page" style="background: #fff;">
			<Title title="旅游计划详情" fixed bgColor="#fff" @back="page = 1" />
			<u-image :src="`/static/avtivity/trip/detail.webp`" width="100%" height="auto"
				bgColor="transparent" mode="widthFix">
			  <template v-slot:loading>
			    <view class="ptb-50 pw-100" style="background: #fff;">
					<u-loading-icon color="#9F9F9F" class=""></u-loading-icon>
				</view>
			  </template>
			  <template v-slot:error>
			    <view class="ptb-10 pw-100 flex-center" style="background: #fff;">
					<u-icon name="info-circle" color="#9F9F9F"></u-icon>
				</view>
			  </template>
			</u-image>
		</view>
		
		<view v-if="page == 3" class="page bg-page plr-20">
			<Title title="购买记录" fixed bgColor="#F8F8F8" @back="page = 1" />
			<view class="bg-white p-12 rounded-8 flex-between mt-10 fgap-10" v-for="item in logs" :key="item.id">
				<view class="fw-5 u-line-1">购买指定商品</view>
				<view class="text-right text-info fs-12">
					<view class="">{{ item.quantity }}份</view>
					<view class="mt-8">{{ item.date }}</view>
				</view>
			</view>
		</view>
		
		<!-- registe -->
		<view v-if="page == 4" class="page bg-page plr-20">
			<Title title="报名" fixed bgColor="#F8F8F8" @back="page = 1" />
			<view class="flex-start mt-20">
				<image src="/static/avtivity/trip/user.webp" class="i-17"></image>
				<view class="fs-16 fw-5 ml-3">本人</view>
			</view>
			<view v-if="info1.done" class="bg-white p-16 rounded-14 mt-20 flex-between">
				<text>{{ info1.name }} {{ info1.mobile }}</text>
				<text>{{ info1.identity }}</text>
			</view>
			<view v-else class="bg-white plr-16 rounded-14 mt-20 list_box">
				<view class="flex-between fgap-25 ptb-17">
					<view class="w-63">姓名</view>
					<u-input v-model="info1.name" placeholder="请输入真实姓名" placeholderClass="fs-14 text-info"
						border="none"></u-input>
				</view>
				<view class="flex-between fgap-25 ptb-17">
					<view class="w-63">身份证号</view>
					<u-input v-model="info1.identity" placeholder="请输入身份证号" placeholderClass="fs-14 text-info"
						border="none"></u-input>
				</view>
				<view class="flex-between fgap-25 ptb-17">
					<view class="w-63">手机号</view>
					<u-input v-model="info1.mobile" placeholder="请输入手机号" placeholderClass="fs-14 text-info"
						border="none"></u-input>
				</view>
			</view>
			
			<view  v-if="stat.quota == 2" class="">
				<view class="flex-start mt-30">
					<image src="/static/avtivity/trip/user.webp" class="i-17"></image>
					<view class="fs-16 fw-5 ml-3">同行人</view>
				</view>
				<view v-if="info2.done" class="bg-white p-16 rounded-14 mt-20 flex-between">
					<text>{{ info2.name }} {{ info2.mobile }}</text>
					<text>{{ info2.identity }}</text>
				</view>
				<view v-else class="bg-white plr-16 rounded-14 mt-20 list_box">
					<view class="flex-between fgap-25 ptb-17">
						<view class="w-63">姓名</view>
						<u-input v-model="info2.name" placeholder="请输入真实姓名" placeholderClass="fs-14 text-info"
							border="none"></u-input>
					</view>
					<view class="flex-between fgap-25 ptb-17">
						<view class="w-63">身份证号</view>
						<u-input v-model="info2.identity" placeholder="请输入身份证号" placeholderClass="fs-14 text-info"
							border="none"></u-input>
					</view>
					<view class="flex-between fgap-25 ptb-17">
						<view class="w-63">手机号</view>
						<u-input v-model="info2.mobile" placeholder="请输入手机号" placeholderClass="fs-14 text-info"
							border="none"></u-input>
					</view>
				</view>
			</view>
			<view v-if="stat.quota > stat.record_num" class="absolute bottom-30 left-0 pw-100">
				<u-button class="fs-14 fw-7 bg-base text-white w-247 h-47" shape="circle" @click="doSubmit">提交</u-button>
			</view>
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
				page: 1,
				done: false,
				doSubmit: null,
				load: false,
				event_id: 1,
				profile: this.$c.profile(),
				logs: [],
				items: [
					{ id: 1, num: 15, text: '合伙人', left: 50 },
					{ id: 2, num: 30, text: '铜牌及以上', left: 100 },
				],
				info1: { name: '', identity: '', mobile: '', is_vassal: 2, done: false },
				info2: { name: '', identity: '', mobile: '', is_vassal: 1, done: false },
				stat: { quota: 0, record_num: 0, pur_quan: 0 }
			}
		},
		computed: {
			process() {
				return Math.ceil(this.stat.pur_quan * 100 / 30)
			},
			process2() {
				let level = this.$c.calcLv(this.profile) || 1
				let arr = [0, 12.5, 25, 37.5, 50]
				return level <= 4 ? arr[level] : 100
			}
		},
		async onLoad() {
			this.$c.removeStorage('address')
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
			const profile = await this.$c.checkeLogin(1)
			if (profile) {
				this.profile = profile
				this.getActivity()
			}
		},
		methods: {
			async onInfo() {
				const res = await this.$c.fetch(this.$api.event.tripInfo, {
					id: this.event_id,
				})
				if (res.length) {
					const info1 = res.find(i => i.is_vassal?.id == 2)
					if (info1) {
						this.info1 = { ...this.info1, ...info1, done: true }
					}
					const info2 = res.find(i => i.is_vassal?.id == 1)
					if (info2) {
						this.info2 = { ...this.info2, ...info2, done: true }
					}
				}
				this.page = 4
			},
			onSubmit() {
				if (this.stat.quota == 1 && this.stat.record_num == 0 && this.check(this.info1)) {
					this.toSubmit(this.info1)
				}
				if (this.stat.quota == 2 && this.stat.record_num == 0 && this.check(this.info1) && this.check(this.info2)) {
					this.toSubmit(this.info1, 0)
					this.toSubmit(this.info2)
				}
				if (this.stat.quota == 2 && this.stat.record_num == 1 && this.check(this.info2)) {
					this.toSubmit(this.info2)
				}
			},
			check(info) {
				let name = info.is_vassal == 1 ? '同行人' : '本人'
				if (!info.name) {
					this.$c.toast(`请输入${name}真实姓名`)
					return false
				}
				if (!info.identity) {
					this.$c.toast(`请输入${name}身份证号`)
					return false
				}
				if (!info.mobile) {
					this.$c.toast(`请输入${name}(机号)`)
					return false
				}
				return true
			},
			async toSubmit(info, show = 1) {
				const res = await this.$c.fetch(this.$api.event.tripAdd, {
					id: this.event_id,
					...info
				})
				if(res && show) {
					this.onKnow()
					this.getActivity()
				}
			},
			onKnow() {
				this.$know({
					bg: 'background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);',
					img: "/static/avtivity/trip/know.webp",
					title: "提交成功",
					text: {
						text: "您已提交成功，请联系在线客服领取旅游资料及相关说明",
						class: "text-center"
					},
					buttons: [
						{ text: '取消', class: 'bold fs-16 w-135 h-51' },
						{ text: '联系客服', class: 'bold fs-16 w-135 h-51 bg-base text-white' }
					]
				}).then(i => {
					i === 0 && (this.page = 1)
					i === 1 && this.$c.goto('/pages/index/web')
				})
			},
			async onLog() {
				this.page = 3
				const res = await this.$c.fetch(this.$api.event.tripBuy, { id: this.event_id })
				if(res) this.logs = res
			},
			async getActivity() {
				const res = await this.$c.fetch(this.$api.event.tripStat, { id: this.event_id })
				if (res) this.stat = res
			}
		}
	}
</script>

<style scoped lang="scss">
	.part {
		background: #E8F1E8;
		border-radius: 12px;
		box-shadow: 2px 2px 2px 0px #42BD6C;;
	}
	.process {
		background: #fff;
		position: relative;
		transition: all 1s ease;
	}
	.percent {
		position: absolute;
		transform: translate(-50%, -65%);
	}
	.num {
		border-radius: 3px;
		border: 1px solid #C6E1CF;
		background: #31889C;
		font-weight: 700;
		font-size: 12px;
		color: #fff;
		text-align: center;
		height: 16px;
		line-height: 16px;
	}
	.bg {
		background: linear-gradient(180deg, #CDEAEB 2%, #FFFFFF 32px);
	}
</style>