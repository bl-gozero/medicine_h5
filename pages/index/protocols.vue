<template>
	<view class="page">
		<Title v-if="show" :title="title" fixed bgColor="#fff" />
		<view v-if="Array.isArray(img)" class="">
			<u--image :src="item.src" v-for="(item, index) in img" :key="index" width="100%" height="auto"
				bgColor="transparent" mode="widthFix" @click="onJump(item)">
				<template v-slot:loading>
					<view class="pt-100">
						<u-loading-icon color="#9F9F9F" class="mt-200"></u-loading-icon>
					</view>
				</template>
			</u--image>
		</view>
		<view v-else>
			<u--image :src="img" width="100%" height="auto" bgColor="transparent" mode="widthFix">
				<template v-slot:loading>
					<view class="pt-100">
						<u-loading-icon color="#9F9F9F" class="mt-200"></u-loading-icon>
					</view>
				</template>
			</u--image>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	export default {
		components: {
			Title
		},
		data() {
			return {
				img: '',
				title: '',
				show: true
			}
		},
		onLoad(p) {
			if (p.show == 2) this.show = false
			const type = parseInt(p.type)
			if (type) {
				this.title = this.getTitle(type)
				if (this.title) this.getImages(type)
			}
		},
		methods: {
			async getImages(e) {
				const res = await this.$c.fetch(this.$api.config.images, {
					location: e
				})
				if (res) this.img = res
			},
			onJump(item) {
				if (item.url) this.$c.goto(item.url)
			},
			getTitle(e) {
				switch (e) {
					case 1:
						return 'APP用户协议' // 商城
					case 2:
						return 'VIP专属权益说明'
					case 3:
						return '合伙人专属权益说明'
					case 4:
						return '商户服务介绍'
					case 5:
						return '商户合伙人计划'
					case 6:
						return '关于我们'
					case 7:
						return '旅游计划详情'
					case 8:
						return 'APP隐私政策' // 商城
					case 9:
						return 'APP隐私‘政策' // 商户
					case 10:
						return 'APP用户协议' // 商户
					case 11:
						return 'APP注销协议' // 商户
					case 12:
						return 'APP注销协议' // 商城
					default:
						return ''
				}
			}
		}
	}
</script>

<style>

</style>