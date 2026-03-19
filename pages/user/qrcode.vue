<template>
	<view class="page" style="background: #4F87D6;">
		<Title title="我的二维码" fixed bgColor="#4F87D6" />
		<view class="">
			<image src="/static/user/qr_top.webp" class="pw-100 block" mode="widthFix"></image>
		</view>
		<view class="plr-20 mt-10">
			<view class="out_box">
				<view class="flex-center">
					<view  class="qrbox i-148">
						<uqrcode v-show="!showQr" class="auto-x rounded-22" ref="qrcode" canvas-id="uqrcode" :value="link" size="148">
						</uqrcode>
					</view>
				</view>
				<view class="text-center lh-15 mt-10 text-info fs-12">
					扫描二维码<br />
					可在注册APP时填写下方邀请码
				</view>
				<view class="text-center flex-center mt-15">
					<view class="relative">
						<image src="/static/user/code_box.webp" class="w-273 h-70 block"></image>
						<view class="full flex-center">
							<view class="">
								<view class="fw-7 fs-14">我的邀请码</view>
								<view class="flex-center" @click="$c.copy(profile.referral_code)">
									<text class="fw-7 fs-16 text-base">{{ profile.referral_code }}</text>
									<image src="/static/user/copy.webp" class="i-15 ml-4"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="flex-between mt-15">
					<button class="w-126 h-47 fw-7 text-white flex-center rounded-x fs-14" style="background: #F36E25;"
						@click="showQr = true">保存二维码</button>
					<button class="w-170 h-47 fw-7 bg-base text-white flex-center rounded-x fs-14"
						@click="$c.copy(link)">分享注册链接</button>
				</view>
			</view>
		</view>
		<view class="h-40"></view>

		<u-popup :show="showQr" mode="center" bgColor="transparent" zIndex="20000" @close="showQr = false">
			<view class="">
				<view class="relative">
					<image :src="path" mode="widthFix"></image>
					<view class="text-info fs-12 mt-20 absolute left-0 pw-100 bottom-20 text-center">如果保存无效请长按图片保存
					</view>
				</view>
				<button class="bg-base fw-7 fs-14 text-white w-169 h-47 mt-15 border-0 flex-center rounded-x"
					@click="onSave()">保存</button>
			</view>
		</u-popup>

		<!-- <image :src="path" mode="widthFix" @click="onSave()"></image> -->
		<l-painter ref="painter" :board="poster" isCanvasToTempFilePath @success="path = $event" hidden />
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
				profile: this.$c.profile(),
				qrcode: this.$c.profile().share_url,
				link: this.$c.profile().share_url,
				path: '',
				showQr: false,
				poster: {
					css: {
						width: "376px",
						position: "relative"
					},
					views: [{
							src: "/static/user/poster.webp",
							type: "image",
							css: {
								background: "#fff",
								objectFit: "cover",
								width: "376px",
								height: "525px",
							}
						},
						{
							text: this.$c.profile().share_url,
							type: "qrcode",
							css: {
								width: "146px",
								height: "146px",
								top: "317px",
								left: "115px",
								position: "absolute"
							}
						}
					]
				}
			}
		},
		onLoad() {},
		methods: {
			onSave() {
				this.$refs.painter.canvasToTempFilePathSync({
					fileType: "jpg",
					pathType: 'url',
					quality: 1,
					success: (res) => {
						console.log(res.tempFilePath);

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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.out_box {
		box-sizing: border-box;
		background: linear-gradient(180deg, #DBEAFF 0%, #FFFFFF 100%);
		border-radius: 18px;
		padding: 30px 15px 20px;
	}

	.qrbox {
		background: #FFFFFF;
		padding: 10px;
		border: 6px solid #1A7E84;
		border-radius: 22px;
	}
</style>