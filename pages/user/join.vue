<template>
	<view class="page" style="background: #E9EAEA;">
		<Title title="加入北辰代购" :fixed="true" />
		<view>
			<image src="/static/join/top.jpg" class="pw-100 block" mode="widthFix"></image>
			<view class="plr-8">
				<view class="box text-center">
					<image src="/static/join/title_1.png" class="w-181 h-21"></image>
					<view class="inner_box text-left mt-20 lh-14 fw-3">
						<view class="flex-start">
							<view class="dot"></view>
							<text class="title">现金红包奖励</text>
						</view>
						<view class="mt-11">
							每邀请1位好友注册成功后，可获得
							<text class="money">3元</text>
							现金,最高可获得
							<text class="money">30元</text>
						</view>
						<image src="/static/join/step_1.png" class="pw-100 mt-17" mode="widthFix"></image>
						<view class="flex-start mt-27">
							<view class="dot"></view>
							<text class="title">现金红包奖励</text>
						</view>
						<view class="mt-11">
							购买1单指定商品成功后， 获得三级分销佣金权限，可永久返佣金
							<text class="money">返佣金</text>
						</view>
						<image src="/static/join/step_2.png" class="pw-100 mt-21" mode="widthFix"></image>
						<view class="text-center mt-20">
							<image src="/static/join/share.png" class="w-242 h-56" @click="onShare()"></image>
						</view>
						<view class="line_text mt-10" @click="$c.goto('/pages/user/team')">查看已邀请成功的好友</view>
						<!-- #ifdef H5 -->
						<view class="flex-evenly mt-25 fw-4 fs-12" style="text-wrap: nowrap;">
							<view class="text-center self-start w-80">
								<view class="qrbox auto-x">
									<UQrcode :text="downloadUrl" :size="59" :qrId="'code1'" />
								</view>
								<view class="mt-6 flex-center">APP下载地址</view>
							</view>
							<view class="text-center w-80">
								<view class="qrbox auto-x">
									<UQrcode :text="profile.referral_code" :size="59" :qrId="'code2'" />
								</view>
								<view class="mt-6 flex-center">我的邀请码</view>
								<view class="flex-center" @click="$c.copy(profile.referral_code)">
									<text class="fs-10">{{ profile.referral_code }}</text>
									<view class="w-10 ml-3">
										<image src="/static/icon/copy.png" class="w-10 h-9"></image>
									</view>
								</view>
							</view>
						</view>
						<!-- #endif -->
					</view>
				</view>
			</view>
			<view class="plr-8 mt-8">
				<view class="box text-center">
					<image src="/static/join/title_1.png" class="w-181 h-21"></image>
					<view class="inner_box text-left mt-20 lh-14 fw-3">
						<view class="flex-start">
							<view class="dot"></view>
							<text class="title">成为VIP</text>
						</view>
						<view class="mt-11">
							购买指定1单商品后再邀请3人，每人消费1单指定商品后，您可升级VIP，VIP身份可获得
							<text class="money">高团队佣金、折扣购买、分销佣金、产品优惠</text>
						</view>
						<view class="flex-start mt-27">
							<view class="dot"></view>
							<text class="title">成为合伙人</text>
						</view>
						<view class="mt-11">
							成为VIP后再邀请5位好友成为VIP后，您可升级为合伙人，合伙人身份可获得
							<text class="money">更高团队佣金、折扣购买、分销佣金、产品优惠、永久月度绩效分红</text>
						</view>
						<view class="mt-20 flex-between">
							<image src="/static/join/gobuy.webp" class="w-146 h-56"
								@click="$c.goto('/pages/index/index')"></image>
							<image src="/static/join/btn_share.png" class="w-146 h-56" @click="onShare()"></image>
						</view>
					</view>
				</view>
			</view>
			<view class="line_text mt-10" style="color: #6A3B1D;" @click="$c.goto('/pages/index/vipRule')">点击了解详细规则
			</view>
			<image src="/static/join/bottom.png" class="pw-100 block" mode="widthFix"></image>
		</view>

		<u-popup :show="showQr" mode="center" bgColor="transparent" @close="showQr = false">
			<view class="">
				<view class="relative">
					<image :src="path" mode="widthFix"></image>
					<view class="text-info fs-12 mt-20 absolute left-0 pw-100 bottom-20 text-center">如果保存无效请长按图片保存</view>
				</view>
				<u-button class="bg-base fw-7 fs-14 text-white w-169 h-47 mt-15 border-0" shape="circle"
					text="保存" @click="onSave()"></u-button>
			</view>
		</u-popup>
		
		<!-- <image :src="path" mode="widthFix" @click="onSave()"></image> -->
		<l-painter ref="painter" :board="poster" isCanvasToTempFilePath @success="path = $event" hidden />
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	import UQrcode from '@/components/u-qrcode.vue'
	export default {
		components: {
			Title,
			UQrcode
		},
		data() {
			return {
				profile: this.$c.getStorage('profile') || {},
				downloadUrl: this.$c.url('dl'),
				height: 0,
				qrcode: '',
				showQr: false,
				showBtn: false,
				path: '',
				poster: {
					css: {
						width: "376px",
						position: "relative"
					},
					views: [
						{
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
		onLoad() {
			this.qrcode = this.$c.profile().share_url
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
			},
			onShare() {
				this.showBtn = true
				this.showQr = true
			},
			async onSave1() {
				try {
					const url = this.qrcode
					const res = await fetch(url, {
						method: "GET"
					});
					const blob = await res.blob()
					const a = document.createElement("a")
					a.href = URL.createObjectURL(blob)
					a.download = "share.png"
					document.body.appendChild(a)
					a.click()
					document.body.removeChild(a)
					URL.revokeObjectURL(a.href)
				} catch (err) {
					console.error("下载失败", err)
				}
			},
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
						link.download = link.download = '我的二维码_' +  new Date().toISOString().replace(/[:.-]/g, '') + '.jpg' //'image.jpg'
						link.click()
						// #endif
			
						// #ifndef H5
						// 非 H5 端：保存到相册
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: () => {
								console.log('save success')
								this.$c.toast('保存成功')
								this.showQr = false
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

<style lang="less" scoped>
	.box {
		background: #2D6EAF;
		border-radius: 22px;
		padding: 19px 5px 7px;
		box-sizing: border-box;
		box-shadow: 0px 4px 15px 0px rgba(22, 65, 105, 0.35);
	}

	.inner_box {
		background: #FFF9ED;
		border-radius: 20px;
		padding: 24px;
		box-sizing: border-box;
		box-shadow: inset 0px 4px 30px 0px rgba(249, 160, 47, 0.28);
	}

	.dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #2D6EB0;
	}

	.title {
		font-family: Alibaba PuHuiTi 2.0;
		font-size: 20px;
		font-weight: 900;
		line-height: 1;
		text-align: center;
		letter-spacing: 0em;
		margin-left: 6px;

		font-variation-settings: "opsz" auto;
		font-feature-settings: "kern" on;
		background: linear-gradient(180deg, #449FFB 40%, #1E79D4 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		text-fill-color: transparent;
	}

	.money {
		color: #F76231;
		font-weight: 900;
	}

	.line_text {
		font-family: Alibaba PuHuiTi 2.0;
		font-size: 14px;
		font-weight: normal;
		line-height: 16px;
		letter-spacing: 0em;
		text-decoration: underline;
		text-underline-offset: 3px;
		font-variation-settings: "opsz" auto;
		font-feature-settings: "kern" on;
		color: #F76231;
		text-align: center;
	}

	.qrbox {
		width: 59px;
		height: 59px;
		border-radius: 4px;
		border: 3px solid #F76333;
		display: block;
	}
</style>