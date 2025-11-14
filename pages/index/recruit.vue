<template>
	<view class="page">
		<Title title="招募计划" fixed bgColor="#fff" />
		<view class="relative">
			<image src="/static/index/recruit/1.webp" class="pw-100" mode="widthFix"></image>
			<view class="absolute right-20 bottom-20">
				<view v-if="status" class="w-175 h-40 rounded-x flex-center fs-13 fw-5 lh-10">您已提交</view>
				<image v-else-if="status === false" src="/static/index/recruit/btn-1.webp" class="w-175 h-40" @click="doSubmit"></image>
			</view>
		</view>
		<image src="/static/index/recruit/2.webp" class="pw-100" mode="widthFix"></image>
		<image src="/static/index/recruit/3.webp" class="pw-100" mode="widthFix"></image>
		<image src="/static/index/recruit/4.webp" class="pw-100" mode="widthFix"></image>
		<view class="flex-center ptb-20">
			<view v-if="status" class="w-251 h-40 rounded-x flex-center fs-13 fw-5 lh-10">您已提交</view>
			<image v-else-if="status === false" src="/static/index/recruit/btn-2.webp" class="w-251 h-40" @click="doSubmit"></image>
		</view>
		
		<u-popup :show="showFail" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @close="showFail = false;">
			<view class="w-308 h-280 sign_reward_box rounded-20 text-center">
				<image src="/static/index/recruit/info.webp" class="i-101 auto-x" style="margin-top: -50px;"></image>
				<view class="mt-35" style="line-height: 24px;">
					很抱歉<br />
					申请开设展馆需要达到<br />
					银牌合伙人资格哦~<br />
				</view>
				<button
					class="bg-base bold fs-16 flex-center text-white w-234 h-51 rounded-x mt-33"
					@click="showFail = false;"
				>知道了</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	import request from '../../utils/request';
	export default {
		components: {
			Title
		},
		data() {
			return {
				status: 0,
				doSubmit: null,
				showFail: false
			}
		},
		onLoad() {
			this.checkStatus()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async checkStatus() { 
				const res = await this.$c.fetch(this.$api.user.isRecruit)
				if(res) this.status = res.ok
			},
			async onSubmit() {
				this.$api.user.recruit({}, { showErr: false })
					.then(() => this.status = true)
					.catch((err) => {
						if(err.message == '未满足条件') {
							this.showFail = true
						} else if(err.code == 1) {
							this.$c.toast(err.message)
						} else {
							this.$c.toast('请稍后再试')
						}
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}
	.done {
		background: #B8BFD0;
		color: #656D72;
	}
</style>
