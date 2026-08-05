<template>
	<view class="page">
		<Title title="平台介绍" fixed bgColor="#fff" />
		<u--image :src="'/static/index/platform/' +  i + '.webp'" v-for="i in 6" width="100%" height="auto"
			bgColor="transparent" mode="widthFix">
			<template v-slot:loading>
				<view class="pt-100">
					<u-loading-icon color="#9F9F9F" class="mt-200"></u-loading-icon>
				</view>
			</template>
		</u--image>
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
			}
		},
		onLoad() {
		},
		methods: {
		}
	}
</script>

<style>

</style>