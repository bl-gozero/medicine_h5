<template>
	<view class="relative">
		<image v-if="showIcon" :src="img('grow/box-info.webp')" class="x-100" mode="widthFix"></image>
		<image v-else :src="img('grow/box-info-s.webp')" class="x-100" mode="widthFix"></image>
		<view class="full flex-center text-center plr-8 border-box">
			<view v-for="(item, index) in list" :key="index" class="flex-center" :class="index == 0 ? 'w-80' : 'flex-1'">
				<view class="flex-1 flex-center">
					<view class="">
						<view class="fs-10 opacity-6 u-line-1">{{ item.label }}</view>
						<view class="fw-7 mtb-10">{{ item.value }}</view>
						<image v-if="showIcon" :src="img(item.icon)" class="i-20 auto-x"></image>
					</view>
				</view>
				<view v-if="index < list.length - 1" class="line mlr-8"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'GrowInfo',
		props: {
			info: {
				type: Object,
				default: {}
			},
			showIcon: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			list() {
				return [{
						label: '培育开始',
						value: this.$c.formatDate(this.info.start_time, '/') || '-',
						icon: 'grow/date.webp'
					},
					{
						label: '已累计',
						value: `${this.info.day}天`,
						icon: 'grow/days.webp'
					},
					{
						label: '当前周期',
						value: `第${this.info.cycle}次`,
						icon: 'grow/times.webp'
					},
					{
						label: '距离周期达成',
						value: `${this.info.surplus_day}天`,
						icon: 'grow/countdown.webp'
					}
				]
			}
		},
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

<style scoped>
	.line {
		height: 36px;
		width: 0;
		border-left: 0.5px solid transparent;
		border-image: linear-gradient(180deg,
				#bc871000 0%,
				#bc8710 17%,
				#bc8710 80%,
				#bc871000 100%) 1;
	}
</style>