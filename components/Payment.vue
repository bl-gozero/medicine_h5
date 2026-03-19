<template>
	<view>
		<view v-if="cateList.length > 0" class="list_box">
			<view class="ptb-20" v-for="(item, index) in cateList" :key="index">
				<view v-if="index == 0 && item.value.length == 1" class="flex-between" @click="selectPayCate(item, index)">
					<view class="flex-start">
						<image :src="iconItem[item.value[0].value] || defaultIcon" class="i-18 mr-8" />
						<text class="fs-14">{{ item.value[0].value }}</text>
					</view>
					<image :src="$c.checkIcon(payingMode === item.value[0].id)" class="i-18" />
				</view>
				<view v-else class="flex-between" @click="selectPayCate(item, index)">
					<view class="flex-start">
						<image :src="iconCate[item.name] || defaultIcon" class="i-18 mr-8" />
						<text class="fs-14">{{ item.name }}</text>
					</view>
					<view class="flex-end">
						<text class="fs-10 text-info mr-6">{{ item.open ? '收起' : '展开' }}</text>
						<u-icon :name="item.open ? 'arrow-up' : 'arrow-down'" size="18" color="#7E7E7E"></u-icon>
					</view>
				</view>
				<view v-if="item.open" class="flex-between mt-30 pl-16" v-for="i in item.value" :key="i.id" @click="selectPayMode(i.id)">
					<view class="flex-start">
						<image :src="iconItem[i.value] || defaultIcon" class="i-15 mr-10" />
						<text class="fs-12">{{ i.value }}</text>
					</view>
					<image :src="$c.checkIcon(payingMode === i.id)" class="i-18" />
				</view>
			</view>
		</view>
		
		<u-popup :show="errorInfo.show" mode="center" bgColor="transparent" @close="errorInfo.show = false;">
			<view class="popup-box" style="background: #fff;min-height: 257px;box-shadow: 0px -6px 20px 0px rgba(0, 0, 0, 0.3);">
				<view class="popup-title mt-20 text-black">支付提示</view>
				<view class="popup-text flex-1">{{ errorInfo.text }}</view>
				<view class="popup-buttons">
					<view class="">
						<button class="bg-base bold fs-16 text-white w-234 h-51 flex-center rounded-x"
							@click="errorInfo.show = false;">知道了</button>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-modal 
			:show="show"
			title="提示"
			content='网页端支付正在维护，请在APP端进行付款或充值等操作。'
			showCancelButton
			confirmText="去下载"
			@cancel="show = false"
			@confirm="show = false;$c.goto('/pages/web/download');"
		></u-modal>
	</view>
</template>

<script>
	export default {
		name: 'Payment',
		props: {
			modelValue: Number,
			mode: {
				type: Number,
				default: 1, // 0不含奖励，1包含奖励, 2只有奖励
			},
			list: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
				cateList: [],
				show: false,
				payingMode: this.modelValue,
				yue: { cate: 1, id: 4, value: '奖励支付' },
				iconCate: { '奖励支付': '/static/pay/cate/1.png', '北辰支付': '/static/pay/cate/2.png', '三方支付': '/static/pay/cate/3.png' },
				iconItem: { "支付宝": '/static/pay/icon/1.png', "微信": '/static/pay/icon/2.png', "银联": '/static/pay/icon/3.png', "聚合支付": '/static/pay/icon/3.png', '奖励支付': '/static/pay/cate/1.png', },
				defaultIcon: '/static/pay/icon/3.png',
				profile: this.$c.profile(),
				errorInfo: {
					show: false,
					text: ''
				}
				
			}
		},
		watch: {
			modelValue(val) {
				this.payingMode = val
			}
		},
		methods: {
			selectPayCate(item, index) {
				if (index > 0) {
					item.open = !item.open
				} else {
					this.selectPayMode(item?.value[0]?.id)
				}
			},
			selectPayMode(id) {
				const profile = this.$c.profile()
				let msg = ''
				if (profile.category == 'A' && [5, 6, 7].includes(id)) {
					msg = '当前第三方支付通道繁忙，建议使用北辰支付，更加便捷高效'
				}
				if (profile.category == 'B' && [1, 2, 3].includes(id)) {
					msg = '北辰支付通道繁忙，建议选择三方支付付款，体验更顺畅。'
				}
				if (msg) {
					this.errorInfo.text = msg
					this.errorInfo.show = true
					return
				}
				this.payingMode = id
				this.$emit('input', this.payingMode);
			},
			async getCateList() {
				let res = await this.$c.fetch(this.$api.config.payCategoryList2, { device: 2 })
				if (res?.list?.length > 0) {
					this.cateList = res.list.map(i => ({ ...i, open: false }))
				} 
			},
		},
		mounted() {
			if(this.list.length > 0) {
				this.cateList = this.list
			} else if(this.mode === 2) {
				if (this.$c.mode()) this.cateList = [this.yue]
			} else {
				// if(this.mode === 1 && this.$c.mode()) this.cateList = [this.yue]
				this.getCateList()
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>