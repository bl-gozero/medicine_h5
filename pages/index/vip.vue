<template>
	<view class="page bg-page">
		<Title title="我的二维码" :fixed="true" />
		<view :class="`pt-${height}`">
			<u--image :src="qrcode" width="100%" height="auto" bgColor="transparent" mode="widthFix">
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
				qrcode: '',
				height: 0
			}
		},
		onLoad() {
			const profile = this.$c.getStorage('profile') || this.getProfile()
			if(profile) this.qrcode = this.$baseUrl + '/user/qrcode?referral_code=' +  profile.referral_code
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title-bar').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		methods: {
			async getProfile() {
				const res = await this.$c.fetch(this.$api.user.getProfile)
				return res
			}
		}
	}
</script>

<style>

</style>