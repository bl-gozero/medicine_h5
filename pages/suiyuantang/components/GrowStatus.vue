<template>
	<view class="fs-12">
		<view v-if="status == 1" class="flex-start status-box-1">
			<view class="i-6 status-1 rounded mt-3"></view>
			<view class="ml-2">培育中</view>
		</view>
		<view v-else-if="status == 2" class="flex-start status-box-2">
			<view class="i-6 status-2 rounded mt-3"></view>
			<view class="ml-2">周期达成</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'GrowStatus',
		props: {
			status: {
				type: Number,
				default: 0
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
	.status-1 {
		background: linear-gradient(156deg, #d9982d 13%, #a06718 93%);
	}
	
	.status-2 {
		background: #809533;
	}
	
	.status-box-1 {
		background: linear-gradient(90deg, #f7d85b6b 0%, #f7d85b0d 79%);
		border: 0.5px solid #796015;
		padding: 0 5px 2px;
		border-radius: 99px;
	}
	
	.status-box-2 {
		background: linear-gradient(90deg, #c5ff6140 0%, #b4f75b0d 79%);
		border: 0.5px solid #517915;
		padding: 0 5px 2px;
		border-radius: 99px;
	}
</style>