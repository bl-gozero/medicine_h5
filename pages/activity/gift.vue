<template>
	<view>
		<view v-if="page == 1" class="page" style="background: #9EC1F7;">
			<Title title="礼品兑换" fixed bgColor="#fff" />
			<image :src="img('/static/avtivity/gift/top.webp')" class="pw-100 block" mode="widthFix"></image>
			<view class="flex-center" style="margin-top: -200rpx;">
				<view class="relative">
					<image :src="img('/static/avtivity/gift/part_1.webp')" class="w-375 h-345 block"></image>
					<view class="full border-box pt-83">
						<view class="flex-center">
							<view class="relative">
								<image :src="img('/static/avtivity/gift/code.webp')" class="w-302 h-128 block"></image>
								<view class="full border-box pt-52 pl-40">
									<view class="">
										<u-input v-model="code" placeholder="在此处填写兑换码" placeholderClass="placeholder"
											border="none" :customStyle="inputStyle" clearable></u-input>
									</view>
								</view>
							</view>
						</view>
						<view class="mt-20">
							<image v-if="done" :src="img('/static/avtivity/gift/btn_1.webp')"
								class="w-266 h-58 block auto-x"></image>
							<image v-else :src="img('/static/avtivity/gift/btn_0.webp')"
								class="w-266 h-58 block auto-x" @click="doSubmit"></image>
						</view>
						<view class="text-center mt-8">
							<text class="fs-14" style="color: #C17173;" @click="onLog()">查看兑换记录></text>
						</view>
					</view>
				</view>
			</view>
			<image :src="img('/static/avtivity/gift/part_2.png')" class="w-375 h-368 block auto-x mt-20"></image>
			<view class="h-50"></view>
		</view>

		<view v-if="page == 2" class="page bg-page plr-20">
			<Title title="购买记录" fixed bgColor="#F8F8F8" isBack @back="page = 1" />
			<view class="bg-white p-12 rounded-8 flex-between mt-10 fgap-10" v-for="item in logs" :key="item.id">
				<view class="fw-5 u-line-1">礼品</view>
				<view class="text-right text-info fs-12">
					<view class="">已领取</view>
					<view class="mt-8">{{ item.exchange_at }}</view>
				</view>
			</view>
		</view>

		<u-popup :show="show" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @close="show = false">
			<image :src="img(popups[done])" class="w-300 h-336 auto-x block" @click="show = false"></image>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'

	export default {
		components: {
			Title
		},
		data() {
			return {
				page: 1,
				done: 0,
				doSubmit: null,
				logs: [],
				code: '',
				show: false,
				popups: ['', '/static/avtivity/gift/ok.webp', '/static/avtivity/gift/done.webp'],
				loading: false,
				inputStyle: {
					backgroundColor: '#EFEFEF',
					borderRadius: '8px',
					width: '220px',
					height: '39px',
					padding: '0 14px',
					boxSizing: 'border-box'
				}
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getActivity()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async onSubmit() {
				if (!this.code) return this.$c.toast('请输入兑换码')
				if (this.loading) return
				this.loading = true
				const res = await this.$c.fetch(this.$api.event.gift, {
					code: this.code,
				})
				if (res) {
					this.done = 1
					this.show = true
				}
				this.loading = false
			},
			async onLog() {
				this.page = 2
				const res = await this.$c.fetch(this.$api.event.giftList)
				if (res) this.logs = res
			},
			async getActivity() {
				const res = await this.$c.fetch(this.$api.event.giftStatus)
				if (res?.ok) {
					this.done = 2
					this.show = true
				}
			},
			img(path) {
				return this.$c.img(path, 1)
			}
		}
	}
</script>

<style scoped lang="scss">
	.placeholder {
		color: #898989;
		font-size: 14px;
	}
</style>