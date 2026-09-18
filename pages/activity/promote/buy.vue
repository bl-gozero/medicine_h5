<template>
	<view class="page bg">
		<Title title="领取商品" bgColor="transparent" />
		<view class="flex-center">
			<image :src="img('step-1.webp')" class="step"></image>
		</view>
		<view class="plr-20 mt-28">
			<view class="fw-7">领取以下商品</view>
			<view class="mt-10 rounded-14 plr-15 ptb-12 bg-white">
				<view class="flex-between fgap-10 mb-10" v-for="i in goods" :key="i.goods_sku_id"  @click="$c.goto('/pages/activity/promote/goods?id=48')">
					<image v-if="i.goods_sku_id" :src="$c.checkIcon(skuID == i.goods_sku_id)" class="i-18"></image>
					<view class="flex-1 flex-between fgap-8">
						<image :src="i.picture" class="i-60 rounded-12 bg-page" mode="aspectFill"></image>
						<view class="flex-1">
							<view class="fs-14 fw-5 u-line-1">{{ i.goods_name }}</view>
							<view class="fs-12 text-info">{{ i.goods_sku_name }}</view>
							<view class="fs-12 text-info text-right">×{{ i.quantity }}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="flex-between mt-16">
				<view class="fw-7">领取以下商品</view>
				<view class="">
					<button v-if="0" class="w-89 h-29 btn text-white bg-base fs-14">查看物流</button>
					<image v-else :src="img('goods-get-0.webp')" class="w-87 h-28"></image>
				</view>
			</view>
			<view v-if="0" class="mt-14 rounded-14 plr-16 pt-10 pb-18 bg-white">
				<view class="flex-between fs-12 mt-10" @click="onAddress()">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start mt-3"></image>
					<view v-if="address.address" class="flex-1 ml-8 mr-20">
						<view class="fw-5">{{ address.district + address.address }}</view>
						<view class="mt-10" style="color: rgba(61, 61, 61, 0.8);">
							<text class="">{{ address.name }}</text>
							<text class="ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<view v-else class="flex-1 ml-8 mr-20 text-info mb-20">点我添加地址</view>
					<u-icon name="arrow-right" size="14" color="#F07328" class="self-start mt-3"></u-icon>
				</view>
				<view class="fs-12 text-gold mt-14">*请填写并确认
					<text class="fw-7">详细地址及联系方式</text>等，后续平台会为店铺进行依序发货。</view>
			</view>
			<view v-else class="mt-14 rounded-14 plr-16 ptb-18 bg-white">
				<view class="flex-between fgap-7">
					<image :src="img('shop.webp')" class="i-15 self-start"></image>
					<view class="flex-1">
						<view class="fw-5 fs-14">岁元堂门店地址名称1号店</view>
						<view class="text-info fs-12">
							<view class="mtb-10">地址：湖北省 武汉市 某某区 某某街道 某某街详细地址</view>
							<view class="">电话：13365659656</view>
						</view>
					</view>
				</view>
				<view class="flex-start fgap-7 mt-15">
					<image :src="img('user.webp')" class="i-15 self-start mt-3"></image>
					<view class="fs-14">张三  18888888888</view>
				</view>
				<view class="fs-12 text-gold mt-23">*请到此地址
					<text class="fw-7">到店取货</text>，完成登记后系统记录已取货。</view>
			</view>
		</view>
		<view class="h-70"></view>
		<view class="fixed x-100 h-70 bottom-0">
			<button v-if="1" class="w-247 h-47 btn text-white bg-base fs-14 fw-7">去完成体验任务</button>
			<button v-else class="w-247 h-47 btn text-white bg-base fs-14 fw-7" @click="$c.goto('/pages/finance/balance')">我的钱包</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				goods: [
					{ id: 1, goods_name: '养生礼盒(精...', picture: '1.webp', status: 0 }
				],
				address: {},
			}
		},
		onLoad() {
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if (address) this.address = address
		},
		methods: {
			onAddress() {
				this.$c.goto('/pages/user/address?from=address')
			},
			img(path, mode = 0, root = '/static/avtivity/promote/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		},
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}
	.bg {
		background: linear-gradient(180deg, #ffdfa8 0%, #F8F8F8 250px, #F8F8F8 250px, #F8F8F8 100%);
	}
	.step {
		width: 303px;
		height: 39px;
	}
</style>