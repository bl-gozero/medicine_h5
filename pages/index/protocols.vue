<template>
	<view class="">
		<Title :title="title" :fixed="true" />
		<view :class="`pt-${height}`">
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
				height: 0,
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
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title-bar').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		methods: {
			async getImages(e) { 
				const res = await this.$c.fetch(this.$api.config.images, { location: e })
				if(res) this.img = res[0].src
			},
			getTitle(e) {
				switch(e) {
					case 1: return 'APP用户协议'
					case 2: return 'VIP专属权益说明'
					case 3: return '合伙人专属权益说明'
					case 4: return '会员服务介绍'
					default: return ''
				}
			}
		}
	}
</script>

<style>
	
</style>
