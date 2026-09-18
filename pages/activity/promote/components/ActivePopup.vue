<template>
	<u-popup :show="showActive" mode="bottom" bgColor="transparent" closeable @close="closePopup">
		<view class="roundedTop-14 active-popup">
			<view class="text-center fs-18 fw-5 pt-20">填写订单编号</view>
			<view class="plr-20 pb-20 mt-30">
				<view class="fs-14 fw-7 mb-16">小程序付款后</view>
				<u-input v-model="code" placeholder="请输入订单编号" placeholderClass="text-info fs-14 fw-7" border="none"
					clearable :customStyle="{ background: '#EAEAEA', borderRadius: '8px', padding: '13px 16px' }" />
			</view>
			<view class="bg-page h-6"></view>
			<view class="p-20 pb-30">
				<image :src="img('/static/avtivity/promote/active.webp')" class="x-100" mode="widthFix" />
				<button class="x-100 h-41 btn text-white fs-14 fw-7 mt-60"
					style="background: linear-gradient(270deg, #eb5433 0%, #e76225 100%);" @click="submitActive">提交并激活任务
				</button>
			</view>
		</view>
	</u-popup>
</template>
<script>
	export default {
		name: 'ActivePopup',
		props: {
			showActive: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				code: '',
				loading: false
			}
		},
		methods: {
			closePopup() {
				this.code = ''
				this.$emit('update:showActive', false)
				this.$emit('close')
			},
			async submitActive() {
				if (this.loading) return
				const code = (this.code || '').trim()
				if (!code) {
					uni.showToast({
						title: '请输入订单编号',
						icon: 'none'
					})
					return
				}
				this.loading = true
				const res = await this.$c.fetch(this.$api.event.recruitCode, {
					trade_no: code
				})
				if (res) {
					this.$emit('submit', this.code)
					this.closePopup()
				}
				this.loading = false
			},
			img(path, root = '/static/avtivity/promote/index/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.active-popup {
		background: linear-gradient(180deg, #ffd294 0%, #ffffff 61px);
		overflow: hidden;
	}
</style>