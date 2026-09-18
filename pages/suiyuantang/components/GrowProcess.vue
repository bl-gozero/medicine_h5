<template>
	<view class="flex-between">
		<view class="flex-between" :class="i == 6 ? iconClass : 'flex-1'" v-for="i in 6" :key="i">
			<image :src="img('sell-' + (nums >= i ? 1 : 0) + '.webp')" :class="iconClass"></image>
			<view v-if="i < 6" class="flex-1" :style="lineStyle"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'GrowProcess',
		props: {
			num: {
				type: Number,
				default: 0
			},
			isTiny: {
				type: Boolean,
				default: false
			},
			iconClass: {
				type: String,
				default: 'i-16'
			},
			lineStyle: {
				type: String,
				default: 'border-top: 3px dashed #A86D16;'
			}
		},
		computed: {
			nums() {
				return this.num + 1
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
</style>