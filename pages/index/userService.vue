<template>
	<view class="">
		<Title title="商户服务介绍" :fixed="true" />
		<view>
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
			}
		},
		onLoad() {
			this.getImages()
		},
		methods: {
			async getImages() {
				const res = await this.$c.fetch(this.$api.config.images, { location: 4 })
				if(res) this.img = res[0].src
			}
		}
	}
</script>

<style>
	
</style>
