<template>
	<view class="page text-title" style="background: #120E0A;">
		<Title title="我的培育" fixed bgColor="#120E0A" leftIcon="/static/icon/back-gold.webp"
			:titleStyle="{ color: '#B88344' }"></Title>
		<view class="relative mlr-20 auto-x border-box">
			<image :src="img('grow/1.webp')" class="x-100" mode="widthFix"></image>
			<view class="fs-12 opacity-6 absolute" style="top: 5%;right: 20px;">查看全部</view>
			<view class="absolute x-100" style="top: 32%;">
				<view class="flex-between">
					<view class="flex-1">
						
					</view>
					<view class="flex-1 flex-center">
						<view class="">
							<view class="flex-start">
								<view class="i-10 status-1 rounded"></view>
								<view class="w-82 flex-between ml-3">
									<view class="">培育中</view>
									<view class="">3份</view>
								</view>
							</view>
							<view class="flex-start mt-15">
								<view class="i-10 status-2 rounded"></view>
								<view class="w-82 flex-between ml-3">
									<view class="">周期达成</view>
									<view class="">2份</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="x-50 text-center">我的培育：5份</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
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
	
	.status-1 {
		background: linear-gradient(156deg, #d9982d 13%, #a06718 93%);
	}
	.status-2 {
		background: #809533;
	}
</style>