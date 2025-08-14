<template>
	<view class="">
		<Title title="APP用户协议" :fixed="true" />
		<image :src="img" class="pw-100" mode="widthFix"></image>
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
				img: ''
			}
		},
		onLoad() {
			this.getImages()
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
