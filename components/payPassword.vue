<template>
	<u-popup :show="show" mode="bottom" round="20" closeable @close="handleClose">
		<view class="plr-20 pt-50 pb-70 text-center">
			<view v-if="amount" class="">
				<view>需支付</view>
				
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ amount }}</text>
				</view>
			</view>

			<view class="mt-28 fw-7 text-left">请输入交易密码</view>

			<view class="mt-20">
				<u-code-input v-model="innerValue" :maxlength="6" :focus="true" :color="$c.baseColor()" borderColor="#EAEAEA"
					dot @finish="handleFinish"></u-code-input>
			</view>

			<!-- <view class="mt-30 text-right">
				<text class="text-info fs-14" @click="handleForget">忘记密码？</text>
			</view> -->
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'PayPasswordPopup',
		props: {
			value: { // 用于 v-model 绑定
				type: String,
				default: ''
			},
			show: {
				type: Boolean,
				default: false
			},
			amount: {
				type: [Number, String],
				default: 0
			},
		},
		data() {
			return {
				innerValue: this.value
			};
		},
		watch: {
			show(val) {
				if (!val) this.innerValue = '';
			},
			value(val) {
				this.innerValue = val;
			}
		},
		methods: {
			handleClose() {
				this.$emit('update:show', false);
			},
			handleFinish() {
				this.$emit('input', this.innerValue);
				this.$emit('finish', this.innerValue);
				this.handleClose();
				this.innerValue = '';
			},
			handleForget() {
				this.$emit('forget');
			}
		}
	};
</script>

<style scoped>
</style>