<template>
	<view class="page plr-20" style="background: #120E0A;">
		<Title title="我的委托售卖" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
			:titleStyle="{ color: '#B88344' }"></Title>
		<view class="flex-center text-search w-263 h-32 bg-search rounded-x auto-x plr-10 mb-20">
			<view class="fs-12 fw-7">培育编码</view>
			<view class="line h-19 mlr-5" style="border-color: rgba(117, 61, 5, 0.53);"></view>
			<u-input v-model="code" placeholder="请输入" placeholderClass="fw-7 fs-12 text-search" border="none"
				suffixIcon="search" suffixIconStyle="color: #753D05"></u-input>
		</view>
		<view v-if="list.length" class="">
			<view class="item mt-10 fs-12" v-for="i in list" :key="i.id" @click="$c.goto('/pages/suiyuantang/sellDetail?id=' + i.id)">
				<view class="flex-between">
					<view class="relative">
						<image :src="img('bg-code.webp')" class="w-195 h-35"></image>
						<view class="full text-code pt-7 plr-5 u-line-1">培育编号:{{ i.code }}</view>
					</view>
					<view class="flex-end pr-14">
						<image :src="img('status.webp')" class="i-15"></image>
						<text class="text-color ml-3">待寄送</text>
					</view>
				</view>
				<view class="plr-14 pb-14 pt-3 text-title">
					<view class="" style="opacity: .6;">结算价格</view>
					<view class="fs-20 fw-7">￥4000.00</view>
					<view class="flex-between mt-13 text-center ptb-7" style="border: 0.5px solid #BC8710;background: #201A13;">
						<view class="flex-center x-30">
							<view class="">
								<view class="flex-center">
									<image :src="img('money.webp')" class="i-13"></image>
									<view class="fs-10 ml-2" style="opacity: .6;">结算价格</view>
								</view>
								<view class="mt-3 u-line-1">¥5,000.00/个</view>
							</view>
						</view>
						<view class="line"></view>
						<view class="flex-center x-25">
							<view class="">
								<view class="flex-center">
									<image :src="img('num.webp')" class="i-13"></image>
									<view class="fs-10 ml-2" style="opacity: .6;">出售数量</view>
								</view>
								<view class="mt-3">1个</view>
							</view>
						</view>
						<view class="line"></view>
						<view class="flex-center flex-1">
							<view class="">
								<view class="flex-center">
									<image :src="img('time.webp')" class="i-13"></image>
									<view class="fs-10 ml-2" style="opacity: .6;">出售时间</view>
								</view>
								<view class="mt-3 u-line-1">2026-08-25 10:30:00</view>
							</view>
						</view>
					</view>
					<view class="flex-between mt-13">
						<view class="flex-start">
							<image :src="img('buyer.webp')" class="i-21"></image>
							<view class="">购买人：13090907878</view>
						</view>
						<button v-if="1" class="btns flex-center m-0">去寄送</button>
						<button v-else class="btns flex-center m-0">查看物流</button>
					</view>
				</view>
			</view>
		</view>
		<view v-else class="h-200 flex-center">暂无数据</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				code: '',
				list: []
			}
		},
		onLoad(p) {
			if (p.code) this.code = p.code
		},
		onShow() {},
		methods: {
			img(path, root = '/static/suiyuantang/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.text-title {
		color: #B88344;
	}

	.text-color {
		color: #E0B321;
	}

	image {
		display: block;
	}

	.text-search {
		color: #753D05 !important;
	}

	.bg-search {
		background: linear-gradient(90deg, #dfc079 0%, #e4aa56 100%);
		box-shadow: inset 0px 1px 2px 0px rgba(0, 0, 0, 0.47);
	}

	::v-deep .uni-input-input {
		font-size: 12px !important;
		color: #753D05 !important;
		font-weight: 700 !important;
	}

	.item {
		position: relative;
		border: 1px solid #BC8710;
		padding: 3px;
		&::after {
			content: '';
			position: absolute;
			inset: 3px;
			border: 0.5px solid #BC8710;
			pointer-events: none;
		}
	}

	.text-code {
		background: linear-gradient(180deg, #eaae51 0%, #ba823d 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
		text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
		font-size: 12px;
		font-weight: bold;
	}
	
	.line {
		height: 36px;
		width: 0;
		border-left: 0.5px solid transparent;
		border-image: linear-gradient(
			180deg,
			#bc871000 0%,
			#bc8710 17%,
			#bc8710 80%,
			#bc871000 100%
		) 1;
	}
	
	.btns {
		width: 67px;
		height: 22px;
		border-radius: 4px;
		background: linear-gradient(90deg, #c08a41 0%, #5f3916 100%);
		border: 0.5px solid #A78133;
		box-shadow: inset 0px 1px 2px 0px rgba(0, 0, 0, 0.47);
		text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.3);
		color: #120E0A;
		font-weight: bold;
		font-size: 12px;
	}
</style>