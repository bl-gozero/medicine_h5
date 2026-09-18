<template>
	<view class="page plr-20 text-title fs-12" style="background: #120E0A;">
		<Title title="委托售卖详情" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
			:titleStyle="{ color: '#B88344' }"></Title>
		<view class="sell-box border-box ptb-16 pl-16 fs-12 mtb-15">
			<view class="flex-center pr-16 border-box">
				<image :src="img('cloud.webp')" class="w-67 h-16"></image>
				<view class="w-150 flex-center">
					<image :src="img('status.webp')" class="i-15"></image>
					<view class="text-color fs-16 fw-7 ml-3">{{ info.status_text }}</view>
				</view>
				<image :src="img('cloud.webp')" class="w-67 h-16" style="transform: rotate(180deg);"></image>
			</view>
			<view class="text-center mt-10" style="white-space: pre-line;">{{ info.text }}</view>
			<view class="mt-13 pt-10" style="border: 0.5px solid #BC8710;background: #201A13;">
				<u-scroll-list :indicator="false">
					<u-steps :current="info.status" activeColor="#B88344" inactiveColor="#796854">
						<u-steps-item v-for="i in status" :key="i.id">
							<image v-if="info.status == i.id" :src="img('status.webp')" class="i-20" slot="icon"></image>
							<image v-else-if="info.status > i.id" :src="img('check.webp')" class="i-16" slot="icon"></image>
							<text v-else class="i-12 rounded" style="border: 1px solid #796854;background: #201A13;" slot="icon"></text>
							<text class="fs-10" :class="i.id > info.status ? 'text-info' : 'text-title'" slot="title">{{ i.value }}</text>
						</u-steps-item>
					</u-steps>
				</u-scroll-list>
			</view>
		</view>
		<SellInfo submited />
	</view>
</template>

<script>
	import SellInfo from './components/SellInfo.vue'
	
	export default {
		components: {
			SellInfo
		},
		data() {
			return {
				info: {
					status: 1
				},
				status: [
					{ id: 0, value: '申请出售', text: '' },
					{ id: 1, value: '购买人匹配中', text: '您的申请已审核通过，正在匹配购买人，\n预计1-2个工作日' },
					{ id: 2, value: '待寄送', text: '成功匹配购买人，根据以下地址寄送到公司进行检测' },
					{ id: 3, value: '已寄送', text: '您已成功寄送，请等待公司签收' },
					{ id: 4, value: '公司签收检测中', text: '公司已签收，正在检测您的培育成果' },
					{ id: 5, value: '检测通过已寄出', text: '检测已通过，公司已邮寄给购买人，\n等待购买人收货' },
					{ id: 6, value: '购买人确认收货', text: '购买人已确认收货，请您等待结算' },
					{ id: 7, value: '已结算', text: '结算款项已到账，\n请您到商户端“我的余额”中查看' },
				]
			}
		},
		onLoad(p) {
			let id = this.$c.safeId(p)
			if (id) this.getInfo()
		},
		onShow() {},
		methods: {
			async getInfo() {
				this.info.text = this.status?.[this.info.status]?.text || ''
				this.info.status_text = this.status?.[this.info.status]?.value
			},
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
	
	.text-info {
		color: #796854;
	}
	
	image {
		display: block;
	}
	
	::v-deep .u-steps-item__wrapper {
		background-color: transparent !important;
	}
	
	::v-deep  .u-steps-item__line {
		border-top: 1px dashed #A86D16 !important;
		background: transparent !important;
	}
</style>