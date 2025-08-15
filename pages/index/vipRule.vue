<template>
	<view class="page bg-page">
		<Title title="详细规则" :fixed="true" />
		<view :class="`pt-${height}`">
			<view class="relative">
				<image :src="navImg[value - 2]" class="pw-100" mode="widthFix"></image>
				<view class="full flex-between">
					<view class="pw-50 ph-100" @click="onSwitch(2)"></view>
					<view class="pw-50 ph-100" @click="onSwitch(3)"></view>
				</view>
			</view>
			<u--image v-if="rule" :src="rule" width="100%" height="auto" bgColor="transparent" mode="widthFix">
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
				value: 2,
				height: 0,
				rule: '',
				navImg: ['/static/index/rule_vip.png', '/static/index/rule_partner.png']
			}
		},
		onLoad() {
			this.getUrl()
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title-bar').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		methods: {
			onSwitch(n) {
				if(this.value == n) return
				this.value = n
				this.getUrl()
			},
			async getUrl() {
				this.rule = ''
				const res = await this.$c.fetch(this.$api.config.images, { location: this.value })
				if(res) this.rule = res[0].src
			},
		}
	}
</script>

<style>

</style>