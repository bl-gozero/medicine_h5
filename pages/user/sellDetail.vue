<template>
	<view class="page bg-page flex-col">
		<Title title="他的销售数据" fixed>
			<template v-slot:right>
				<view class="lh-10 fs-12" @click="$c.goto(`/pages/finance/sell?account=${info.account}`)">历史数据</view>
			</template>
		</Title>
		<view v-if="info.account" class="flex-1 mt-50 bg-white roundedTop-20 plr-20">
			<view class="flex-center" style="margin-top: -23px;">
				<u-avatar :src="info.avatar" :defaultUrl="$c.userAvatar()" size="46" mode="aspectFill"></u-avatar>
			</view>
			<view class="mt-8 text-center fs-16">{{ info.account }}</view>
			<view class="mt-10 text-center fs-12 text-info">他的推荐人:{{ info.p_account }}</view>
			<view class="info_box roundedTop-8 plr-10 pr-14 flex-between gap-10 ptb-15 relative mt-20 mb-30">
				<view class="absolute top-0 right-0 ph-100 p-4 border-box">
					<image src="/static/user/level/detail.webp" class="ph-100" mode="heightFix"></image>
				</view>
				<image v-if="info.level" :src="`/static/user/level/lv-${$c.calcLv(info)}.webp`" class="w-43 h-44"></image>
				<view class="flex-1">
					<view class="flex-between fs-16 text-white gap-20">
						<view>所属{{ info.tiers }}层</view>
						<view class="u-line-1 flex-1 text-right">{{ info.spending }}</view>
					</view>
					<view class="flex-between fs-12 mt-8" style="color: rgba(255, 255, 255, 0.7);">
						<text>注册:{{ info.created_at }}</text>
						<text>个人消费总金额</text>
					</view>
				</view>
			</view>
			<view class="flex-between mt-33 flex-wrap fgap-20">
				<view class="data_bg rounded-8 p-12 border-box">
					<image src="/static/vip/ri.webp" class="icon"></image>
					<view class="text-info fs-12 mt-6">今日总销售（元）</view>
					<view class="fs-16 fw-7 u-line-1">{{ info.day_sales || 0 }}</view>
				</view>
				<view class="data_bg rounded-8 p-12 border-box">
					<image src="/static/vip/zhou.webp" class="icon"></image>
					<view class="text-info fs-12 mt-6">本周总销售（元）</view>
					<view class="fs-16 fw-7 u-line-1">{{ info.week_sales || 0 }}</view>
				</view>
				<view class="data_bg rounded-8 p-12 border-box">
					<image src="/static/vip/yue.webp" class="icon"></image>
					<view class="text-info fs-12 mt-6">当月总销售（元）</view>
					<view class="fs-16 fw-7 u-line-1">{{ info.month_sales || 0 }}</view>
				</view>
				<view class="data_bg rounded-8 p-12 border-box">
					<image src="/static/vip/lei.webp" class="icon"></image>
					<view class="text-info fs-12 mt-6">累计总销售（元）</view>
					<view class="fs-16 fw-7 u-line-1">{{ info.total_sales || 0 }}</view>
				</view>
				<view class="data_bg rounded-8 p-12 border-box icon">
					<image src="/static/vip/cun.webp" class="icon"></image>
					<view class="text-info fs-12 mt-6">存储产品总数量（件）</view>
					<view class="fs-16 fw-7 u-line-1">{{ info.save_count || 0 }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	export default {
		components: {
			Title
		},
		data() {
			return {
				profile: this.$c.profile(),
				info: {},
			}
		},
		onLoad(p) {
			const id = Number(p?.id)
			if (Number.isInteger(id) && id > 0) this.getInfo(id)
		},
		methods: {
			async getInfo(id) {
				const res = await this.$c.fetch(this.$api.user.sellInfo, { id: id })
				if(res) this.info = res
			},
		}
	}
</script>

<style lang="scss" scoped>
	.data_bg {
		background: #F3F4FB;
		position: relative;
		width: calc(50% - 10px);
		
		.icon {
			position: absolute;
			left: 12px;
			top: 0;
			transform: translateY(-50%);
			width: 23px;
			height: 23px;
		}
	}
	.info_box {
		background: linear-gradient(90deg, #77A6F8 0%, #1B65E2 100%);
	}
</style>