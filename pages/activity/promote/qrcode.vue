<template>
	<view class="page" style="background: #FBDEB1;">
		<Title title="分享邀请" fixed />
		<view class="relative">
			<image :src="img(this.type + '.webp')" class="x-100 block" mode="widthFix" @load="show = true"></image>
			<view v-if="show" class="">
				<view class="plr-30 mt-10 absolute border-box x-100" style="top: 32%;">
					<view class="out_box">
						<view class="flex-center">
							<view class="qrbox i-148">
								<UQrcode v-show="!showQr" class="auto-x rounded-22" ref="qrcode" canvas-id="uqrcode"
									:value="link" size="148">
								</UQrcode>
							</view>
						</view>
						<view class="text-center lh-15 mt-10 text-info fs-12">
							扫描二维码<br/>
							参与全民体验，好礼+{{ this.num }}元免费领
						</view>
						<view class="text-center flex-center mt-15">
							<view class="relative">
								<image src="/static/user/code_box.webp" class="w-273 h-70 block"></image>
								<view class="full flex-center">
									<view class="">
										<view class="fw-7 fs-14">我的邀请码</view>
										<view class="flex-center" @click="$c.copy(profile.referral_code)">
											<text class="fw-7 fs-16"
												style="color: #EB5433;">{{ profile.referral_code }}</text>
											<image src="/static/user/copy.webp" class="i-15 ml-4"></image>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="flex-between absolute x-100" style="top: 89%">
					<button class="w-126 h-47 fw-7 text-white flex-center rounded-x fs-14"
						style="background: #FD6D01;border: 1.5px solid #FFFFFF;" @click="showQr = true">保存二维码</button>
					<button class="w-170 h-47 fw-7 text-white flex-center rounded-x fs-14"
						style="background: #E34C35;border: 1.5px solid #FFFFFF;" @click="$c.copy(link)">分享注册链接</button>
				</view>
			</view>
		</view>
		<u-popup :show="showQr" mode="center" bgColor="transparent" zIndex="20000" @close="showQr = false">
			<view class="">
				<view class="relative">
					<image :src="path" mode="widthFix"></image>
					<view class="text-info fs-12 mt-20 absolute left-0 x-100 bottom-20 text-center">如果保存无效请长按图片保存
					</view>
				</view>
				<button class="bg-base fw-7 fs-14 text-white w-169 h-47 mt-15 border-0 flex-center rounded-x"
					@click="onSave()">保存</button>
			</view>
		</u-popup>

		<Painter ref="painter" :board="poster" isCanvasToTempFilePath @success="path = $event" hidden />
	</view>
</template>

<script>
	// #ifdef MP
	import Painter from '@/pages/user/components/lime-painter/components/l-painter/l-painter.vue'
	import UQrcode from '@/pages/user/components/Sansnn-uQRCode/components/uqrcode/uqrcode.vue'
	// #endif

	// #ifdef H5
	import Painter from '@/uni_modules/lime-painter/components/l-painter/l-painter.vue'
	import UQrcode from '@/uni_modules/Sansnn-uQRCode/components/uqrcode/uqrcode.vue'
	// #endif

	export default {
		components: {
			Painter,
			UQrcode
		},
		data() {
			return {
				profile: this.$c.profile(),
				qrcode: this.$c.profile().share_url,
				link: this.$c.profile().share_url,
				path: '',
				showQr: false,
				show: false,
				type: '',
				num: 0
			}
		},
		computed: {
			poster() {
				return {
					css: {
						width: '376px',
						position: 'relative'
					},
					views: [
						{
							src: this.img(`post-${this.type}.webp`),
							type: 'image',
							css: {
								background: '#fff',
								objectFit: 'cover',
								width: '376px',
								height: '525px'
							}
						},
						{
							text: this.$c.profile().share_url,
							type: 'qrcode',
							css: {
								width: '146px',
								height: '146px',
								top: '317px',
								left: '115px',
								position: 'absolute'
							}
						}
					]
				}
			}
		},
		onLoad(p) {
			if (!['998', '2998'].includes(p.type)) {
				this.$c.toast('参数有误')
				this.$c.goBack()
				return
			}
			const nums = { 998: 2400, 2998: 7200 }
			this.type = p.type
			this.num = nums?.[this.type] || 0
			console.log(this.img(`post-${this.type}.webp`))
		},
		methods: {
			onSave() {
				this.$refs.painter.canvasToTempFilePathSync({
					fileType: "jpg",
					pathType: 'url',
					quality: 1,
					success: (res) => {
						// #ifdef H5
						// H5 端：自动触发下载
						const link = document.createElement('a')
						link.href = res.tempFilePath
						link.download = '我的二维码_' + new Date().toISOString().replace(/[:.-]/g, '') +
							'.jpg' //'image.jpg'
						link.click()
						// this.$c.toast('如果保存失败请长按图片保存')
						// #endif

						// #ifndef H5
						// 非 H5 端：保存到相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								this.$c.toast('保存成功')
							},
							fail: (err) => {
								console.error('save fail', err)
							}
						})
						// #endif
					},
				})
			},
			img(path, mode = 0, root = '/static/avtivity/promote/qrcode/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.out_box {
		box-sizing: border-box;
		background: linear-gradient(180deg, #FFE6DB 0%, #FFFFFF 100%);
		border-radius: 18px;
		padding: 30px 15px 20px;
		border: 2px solid #FFFFFF;
	}

	.qrbox {
		background: #FFFFFF;
		padding: 10px;
		border: 6px solid #E34C35;
		border-radius: 22px;
	}
</style>