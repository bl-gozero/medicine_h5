<template>
	<view class="">
		<Title title="APP用户协议" :fixed="true" />
		<image :src="img" :class="`block pw-100 pt-${height}`" mode="widthFix"></image>
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
