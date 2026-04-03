<template>
	<u-popup :show="show" mode="bottom" :round="20" closeable @close="handleClose" @open="getAddressList">
		<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
			<!-- 标题 -->
			<view class="fs-18 fw-5 text-center">{{ title1 }}</view>

			<!-- 地址选择 -->
			<view class="flex-between ptb-30 fs-12" @click="$c.goto('/pages/user/address?from=address')">
				<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>

				<view v-if="address.district" class="flex-1 ml-8 mr-20">
					<view>{{ address.district + address.address }}</view>
					<view class="mt-15">
						<text class="text-info">{{ address.name }}</text>
						<text class="text-info ml-20">{{ address.phone }}</text>
					</view>
				</view>

				<view v-else class="flex-1 ml-8 mr-20 text-info">
					请添加收货地址
				</view>

				<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start"></u-icon>
			</view>

			<view class="h-10 bg-page"></view>

			<!-- 商品部分 -->
			<view class="mt-20 fw-5">{{ title2 }}</view>

			<!-- 自定义插槽 goods -->
			<slot name="goods" :order="order">
				<!-- 默认渲染 -->
				<scroll-view scroll-y class="h-170 mt-20">
					<view class="flex-between mb-20" v-for="(i, index) in order" :key="index">
						<image :src="i.picture" class="i-76 rounded-12" mode="aspectFill"></image>
						<view class="ml-9 flex-1">
							<view class="flex-between">
								<text class="u-line-1 fw-5">{{ i.goods_name }}</text>
							</view>
							<view class="mt-10 fs-12 text-info">{{ i.goods_sku_name }}</view>
							<view class="flex-end mt-10 fs-12 text-info">
								<text>×{{ i.quantity }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</slot>

			<!-- 提交按钮 -->
			<button class="btn-submit bg-base mt-40 rounded-x flex-center" @click="handleFinish">确认地址并领取</button>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'AddressPicker',
		props: {
			show: {
				type: Boolean,
				default: false,
			},
			title1: {
				type: String,
				default: '确认收货地址',
			},
			title2: {
				type: String,
				default: '领取商品',
			},
			order: {
				type: Array,
				default: () => [],
			},
			address_id: {
				type: [String, Number],
				default: null,
			},
		},
		data() {
			return {
				addressList: [],
				address: {}, // 当前选中的地址对象
			};
		},
		watch: {
			address_id: {
				immediate: true,
				handler(val) {
					if (val && this.addressList.length) {
						const found = this.addressList.find(i => i.id == val);
						if (found) this.address = found;
					}
				},
			},
		},
		methods: {
			handleClose() {
				this.$emit('update:show', false);
			},
			async getAddressList() {
				try {
					// 模拟请求地址列表（请替换为真实接口）
					const res = await this.$api.users.getAddressList();
					this.addressList = res || [];

					if (!this.addressList.length) {
						this.address = {};
						return;
					}

					if (this.address_id) {
						const match = this.addressList.find(i => i.id == this.address_id);
						if (match) {
							this.address = match;
							return;
						}
					}

					this.address =
						this.addressList.find(i => i.is_default === 1) ||
						this.addressList[0];

					this.$emit('update:address_id', this.address.id);
				} catch (err) {
					console.error('获取地址列表失败', err);
				}
			},
			handleFinish() {
				if (!this.address.id) {
					return uni.$u.toast('请先选择收货地址');
				}
				this.$emit('update:address_id', this.address.id);
				this.$emit('finish', this.address);
				this.handleClose();
			},
		},
	};
</script>

<style lang="scss" scoped>
</style>