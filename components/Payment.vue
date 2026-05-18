<template>
	<view>
		<view v-if="cateList.length > 0" class="list_box">
			<view class="ptb-20" v-for="(item, index) in cateList" :key="index">
				<view class="flex-between" @click="selectPayCate(item, index)">
					<view class="flex-start">
						<image :src="item.icon" class="i-18 mr-8" />
						<text class="fs-14">{{ item.name }}</text>
					</view>
					<view class="flex-end">
						<text class="fs-10 text-info mr-6">{{ item.open ? '收起' : '展开' }}</text>
						<u-icon :name="item.open ? 'arrow-up' : 'arrow-down'" size="14" color="#7E7E7E"></u-icon>
					</view>
				</view>
				<view v-if="item.open" class="flex-between mt-30 pl-16" v-for="i in item.value" :key="i.id" @click="selectPayMode(i)">
					<view class="flex-start">
						<image :src="i.icon" class="i-15 mr-10" />
						<text class="fs-12">{{ i.value }}</text>
					</view>
					<image :src="$c.checkIcon(value.id === i.id)" class="i-18" />
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
	</view>
</template>

<script>
	export default {
		name: 'Payment',
		props: {
			value: {
				type: Object,
				default: () => ({})
			},
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
				yue: { cate: 1, id: 4, value: '奖励支付', is_password: true },
				errorInfo: {
					show: false,
					text: ''
				},
				allow: [],
				category: ''
				
			}
		},
		methods: {
			selectPayCate(item, index) {
				item.open = !item.open
			},
			selectPayMode(item) {
				let msg = ''
				if (!this.allow.includes(item.id)) {
					if (this.category == 'A')  msg = '当前第三方支付通道繁忙，建议使用北辰支付，更加便捷高效'
					if (this.category == 'B')  msg = '北辰支付通道繁忙，建议选择三方支付付款，体验更顺畅。'
				}
				if (msg) {
					this.errorInfo.text = msg
					this.errorInfo.show = true
					return
				}
				this.$emit('input', {
					id: item.id,
					is_password: item.is_password
				});
			},
			async getCateList() {
				let res = await this.$c.fetch(this.$api.config.payCategoryList2, { device: 2 })
				if (res) {
					this.allow = res.allow
					this.category = res.category
					if (res?.list?.length > 0) {
						this.cateList = res.list.map(i => ({ ...i, open: false }))
					} 
				}
				
			},
		},
		mounted() {
			if(this.list.length > 0) {
				this.cateList = this.list
			} else if(this.mode === 2) {
				if (this.$c.mode()) this.cateList = [this.yue]
			} else {
				this.getCateList()
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>