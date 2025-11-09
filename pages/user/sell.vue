<template>
	<view class="page flex-col">
		<view class="bg plr-20 pb-47" :class="`pt-${$c.barHeight()}`">
			<view class="flex-between gap-20">
				<view class="flex-start" @click="$c.goBack()">
					<image src="/static/icon/back.png" class="i-24"></image>
					<text class="fs-18 lh-13">团队成员</text>
				</view>
				<view class="flex-1" style="max-width: 220px;">
					<u-search v-model="account" placeholder="输入账号搜索成员" bgColor="#fff" :showAction="true" animation @search="onSearch"></u-search>
				</view>
			</view>
			<view class="relative mt-20">
				<image src="/static/user/level/sell_top.webp" class="pw-100 maxh-100 block" mode="widthFix"></image>
				<view class="full flex-between gap-10 text-center plr-11">
					<view class="flex-1">
						<view class="fs-16 fw-7 u-line-1">0</view>
						<view class="text_top_name">总人数</view>
					</view>
					<view class="flex-1">
						<view class="fs-16 fw-7 u-line-1">0</view>
						<view class="text_top_name">普通用户</view>
					</view>
					<view class="flex-1">
						<view class="fs-16 fw-7 u-line-1">0</view>
						<view class="text_top_name">推广员</view>
					</view>
					<view class="flex-1">
						<view class="fs-16 fw-7 u-line-1">0</view>
						<view class="text_top_name">VIP</view>
					</view>
					<view class="flex-1">
						<view class="fs-16 fw-7 u-line-1">0</view>
						<view class="text_top_name">合伙人</view>
					</view>
				</view>
			</view>
		</view>
		<view class="flex-1 bg-white roundedTop-20 relative flex-col" style="margin-top: -27px;">
			<view class="" style="top: -10px;">
				<image src="/static/user/level/member_level.webp" class="w-134 h-42 auto-x block" ></image>
			</view>
			<view class="" style="margin-top: -7px;">
				<view class="flex-center">
					<u-icon name="play-left-fill" color="#AC7747" size="12" @click="level > 1 && level--"></u-icon>
					<image :src="`/static/user/level/${level}.webp`" class="w-49 h-46 mlr-20 block"></image>
					<u-icon name="play-right-fill" color="#AC7747" size="12" @click="level < 8 && level++"></u-icon>
				</view>
			</view>
			<view class="flex-1 relative">
				<swiper class="full" :current="level - 1" :duration="500" @change="onChange">
					<swiper-item v-for="i in levelMax" :key="i">
						<scroll-view class="full ptb-10" scroll-y>
							<view class="plr-20 inline-block pw-100 border-box member_outbox" v-for="i in 8" :key="i">
								<view class="member_box">
									<view class="flex-between item-stretch gap-10">
										<view class="ptb-12">
											<view class="relative">
												<u-avatar src="" :defaultUrl="$c.userAvatar()" size="36" mode="aspectFill"></u-avatar>
												<view class="level bg-1">推广员</view>
											</view>
										</view>
										<view class="flex-1 flex-between border-bottom">
											<view class="lh-10 flex-1">
												<view class="u-line-1">13696968989</view>
												<view class="fs-12 text-info mt-9">2023.03.23 12:09</view>
											</view>
											<u-button class="btn-check" shape="circle" @click="$c.goto('/pages/user/sellDetail')">查看</u-button>
										</view>
									</view>
									<view class="flex-end mt-13 lh-10">
										<image src="/static/user/level/info.webp" class="i-12"></image>
										<text class="fs-12 mlr-2" style="color: #7F99C4;">当月销售(元)：</text>
										<text class="fs-16 fw-7" style="color: #1F67E3;">1231231</text>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		
		<!--  -->
		<view class="">
			<u-popup :show="showAction" mode="center" :overlayOpacity="0.8" :closeOnClickOverlay="false"
				bgColor="transparent" @close="showAction = false">
				<view class="text-center fs-16 text-white">
					<view class="">点击左键右键进行切换</view>
					<image src="/static/user/level/action.webp" class="w-181 h-91"></image>
					<u-divider text="或" :dashed="true" textColor="#989898" lineColor="#989898" textSize="16"></u-divider>
					<view class="">手指滑动屏幕切换</view>
					<image src="/static/user/level/action_2.webp" class="w-140 h-51 mt-20"></image>
					<view class="mt-100">两种方式查看各层级成员</view>
					<u-button class="bg-base text-white w-135 h-51 fs-16 fw-7 mt-35 border-0" shape="circle"
						@click="onCloseAction()">知道了</u-button>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: this.$c.profile(),
				showAction: false,
				account: '',
				level: 1,
				levelMax: 8
			}
		},
		onLoad() {
			const arr = this.$c.getStorage('seeAction') || []
			if(!arr.includes(this.profile.account)) this.showAction = true
		},
		methods: {
			onCloseAction() {
				const arr = this.$c.getStorage('seeAction') || []
				if(!arr.includes(this.profile.account)) {
					arr.push(this.profile.account)
					this.$c.setStorage('seeAction', arr)
				}
				this.showAction = false
			},
			onChange(e) {
		 		this.level = e.detail.current + 1
			},
			onSearch() {
				if(this.account) {
					this.$c.goto(`/pages/user/sellSearchResult?account=${this.account}`)
				} else {
					this.$c.goto(`/pages/user/sellSearch`)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		background: linear-gradient(180deg, #FFE2C0 5%, #FFF0DE 63%, rgba(255, 240, 222, 0) 100%);
	}
	.text_top_name {
		color: #AD987F;
		font-size: 12px;
		margin-top: 8px;
	}
	.member_box {
		background: #F7FAFF;
		border-radius: 8px;
		padding: 15px;
	}
	.member_outbox:not(:first-child) {
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
	.scroll-view_H {
		white-space: nowrap;
		width: 100%;
	}
</style>