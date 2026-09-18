<template>
	<view class="page title-color" style="background: #120E0A;">
		<view class="relative">
			<image :src="img('scan-1.webp')" class="x-100" mode="widthFix"></image>
			<view class="full">
				<Title title="扫码录入" bgColor="transparent" leftIcon="/static/icon/back-gold.webp"
					:titleStyle="{ color: '#B88344' }"></Title>
			</view>
		</view>
		<view class="plr-20" style="margin-top: -140rpx;">
			<view class="relative">
				<image :src="img('scan-2.webp')" class="x-100" mode="widthFix" @click="openCameras()"></image>
				<!-- <view class="full border-box flex-center">
				</view> -->
			</view>
			<image :src="img('scan-3.webp')" class="x-100 mt-10" mode="widthFix"></image>
			<view class="relative mt-10">
				<image :src="img('scan-4.webp')" class="x-100" mode="widthFix"></image>
				<view class="full border-box">
					<view v-if="!logs.length" class="full flex-center" style="opacity: .6;">暂无记录</view>
					<scroll-view v-else scroll-y class="full" style="padding: 14% 5% 7%;" @scrolltolower="">
						<view class="flex-between ptb-10 fgap-8" v-for="i in logs" :key="i.id"
							style="border-bottom: 1px solid #342D24;">
							<image :src="img('scan-log.webp')" class="w-16 h-26"></image>
							<view class="flex-1">
								<view class="">{{ i.barcode }}</view>
								<view class="mt-8 fs-12" style="opacity: .6;">{{ i.created_at }}</view>
								<view v-if="i.remark && i.is_verify && i.is_verify.id == 3" class="flex-start mt-5" @click="onReason(i)">
									<text class="text-color">查看驳回理由</text>
									<image :src="img('arrow.webp')" class="w-7 h-11 ml-2"></image>
								</view>
							</view>
							<view class="flex-end">
								<image v-if="i.is_verify" :src="img('status-' + i.is_verify.id + '.webp')"
									class="w-68 h-19"></image>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<view class="h-20"></view>
		
		<u-popup :show="showBind" mode="center" bgColor="transparent" :closeOnClickOverlay="false"
			@close="showBind = false">
			<view class="relative title-color">
				<image :src="img('popup.webp')" class="w-337" mode="widthFix"></image>
				<view class="full border-box plr-20">
					<view class="text-center fs-18 fw-7 h-40 flex-center">发现培育成果</view>
					<view class="flex-between fgap-20 mt-36">
						<image :src="img('scan-goods.webp')" class="w-113 h-126"></image>
						<view class="self-start">
							<view class="fs-12" style="opacity: .6;">培育名称</view>
							<view class="fs-20 fw-7">酵岁菌（太岁）</view>
							<view class="fs-12 mt-20" style="opacity: .6;">培育编号</view>
							<view class="fs-14">{{ code }}</view>
						</view>
					</view>
					<!-- <view class="mt-18 text-color">请确认以上信息是否正确，确认后将绑定该培育成果，并开始记录培育过程。</view> -->
					<view class="mt-18 text-color">登记完成后，“激活功能”将于 9月15日起陆续开放，请留意系统通知。</view>
					<view class="flex-between mt-25">
						<image :src="img('cancel.webp')" class="w-146 h-44" @click="showBind = false"></image>
						<image :src="img('bind.webp')" class="w-146 h-44" @click="doSubmit"></image>
					</view>
				</view>
			</view>
		</u-popup>
		
		<u-popup :show="showReason" mode="center" bgColor="transparent" :closeOnClickOverlay="false"
			@close="showReason = false">
			<view class="relative title-color">
				<image :src="img('popup.webp')" class="w-337" mode="widthFix"></image>
				<view class="full border-box plr-16">
					<view class="text-center fs-18 fw-7 h-40 flex-center">驳回理由</view>
					<view class="pt-36 text-center">
						<view class="fs-20 fw-7">酵岁菌（太岁）</view>
						<view>{{ log.barcode }}</view>
					</view>
					<scroll-view scroll-y class="mt-25 h-107">
						<view class="text-color">{{ log.remark }}</view>
					</scroll-view>
					<view class="flex-center mt-30">
						<!-- <image :src="img('cancel.webp')" class="w-146 h-44" @click="showReason = false"></image> -->
						<image :src="img('btn-rebind.webp')" class="w-147 h-44" @click="onReBind()"></image>
					</view>
				</view>
			</view>
		</u-popup>
		
		<view class="sectionview flex-center" v-if="scan" @click="show=false">
			<mumu-one-code @success='handlerSuccess' definition :readers='["code_128_reader"]'></mumu-one-code>
		</view>
	</view>
</template>

<script>
	import MumuOneCode from '@/uni_modules/mumu-oneCode/components/mumu-oneCode/mumu-oneCode.vue'
	export default {
		components: {
			MumuOneCode
		},
		data() {
			return {
				scan: false,
				showBind: false,
				showReason: false,
				log: {},
				logs: [],
				code: '',
				doSubmit: null
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
		},
		methods: {
			async getList() {
				const res = await this.$c.fetch(this.$api.syt.scanList)
				if (res) {
					this.logs = res
				}
			},
			onReason(i) {
				this.log = i
				this.showReason = true
			},
			onReBind() {
				// this.doSubmit(this.log.picture)
				this.showReason = false
				uni.pageScrollTo({
					scrollTop: 0,
					duration: 300
				})
			},
			openCameras() {
				if (origin.indexOf('https') === -1) {
					return this.$c.toast('运行环境不支持')
				}
				this.code = ''
				this.scan = true
				
				// this.code = '111'
				// this.showBind = true
			},
			handlerSuccess(code) {
				this.code = code
				this.scan = false
				this.showBind = true
			},
			async onSubmit() {
				// this.$c.toast('准备提交')
				// this.showBind = false
				const res = await this.$c.fetch(this.$api.syt.scan, {
					barcode: this.code + ''
				})
				if (res) {
					this.showBind = false
					this.$c.toast('提交成功，请等待审核')
					this.getList()
				}
			},
			img(path, mode = 0, root = '/static/suiyuantang/junyang/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-color {
		color: #B88344;
	}
	
	.text-color {
		color: #E0B321;
	}
	
	image {
		display: block;
	}
	
	.sectionview {
		position: fixed;
		top: 0;
		left: 0rpx;
		width: 100%;
		height: 100vh;
		z-index: 99;
	}
</style>