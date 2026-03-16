<template>
	<view class="">
		<Title :title="title" fixed />
		<view v-if="Array.isArray(img)" class="">
			<u--image :src="item.src" v-for="(item, index) in img" :key="index" width="100%" height="auto" bgColor="transparent" mode="widthFix">
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
				title: ''
			}
		},
		onLoad(p) {
			const type = parseInt(p.type)
			if(type) { 
				this.title = this.getTitle(type)
			 	if(this.title) this.getImages(type)
			}
		},
		methods: {
			async getImages(e) { 
				const res = await this.$c.fetch(this.$api.config.images, { location: e })
				if(res) this.img = res
			},
			getTitle(e) {
				switch(e) {
					case 1: return 'APP用户协议'
					case 2: return 'VIP专属权益说明'
					case 3: return '合伙人专属权益说明'
					case 4: return '会员服务介绍'
					case 5: return '合伙人计划'
					case 6: return '关于我们'
					case 7: return '旅游计划详情'
					default: return ''
				}
			}
		}
	}
</script>

<style>
	
</style>
