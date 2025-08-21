<template>
	<view class="">
		<Title title="APP用户协议" :fixed="true" />
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
				height: 0
			}
		},
		onLoad() {
			this.getImages()
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title-bar').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		methods: {
			async getImages() {
				const res = await this.$c.fetch(this.$api.config.images, { location: 1 })
				if(res) this.img = res[0].src
			}
		}
	}
</script>

<style>
	
</style>
