<template>
	<view class="page bg-page">
		<Title title="创建群聊" />
		<view class="plr-20">
			<view class="bg-white plr-15 ptb-14 flex-between rounded-8 mt-12" @click="chooseAvatar()">
				<text class="">群头像</text>
				<view class="flex-start">
					<u-avatar :src="form.icon" size="39" default-url="/static/group/default.png" class="mr-9"
						mode="aspectFill"></u-avatar>
					<u-icon name="arrow-right" size="14" color="#7d7d7d"></u-icon>
				</view>
			</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<text class="">群名称</text>
				<view class="mt-12">
					<u--textarea v-model="form.name" placeholder="请输入群名称" placeholderClass="placeholderClass"
						border="none" :maxlength="24" height="40" count clearable></u--textarea>
				</view>
			</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<text class="">群介绍</text>
				<view class="mt-12">
					<u--textarea v-model="form.intro" placeholder="请输入群介绍" placeholderClass="placeholderClass"
						border="none" :maxlength="50" count clearable></u--textarea>
				</view>
			</view>
			<view class="bg-white plr-15 ptb-14 rounded-8 mt-12">
				<view class="flex-between">
					<text class="mr-20">公开设置</text>
					<u-switch v-model="form.team_category" :activeColor="$c.baseColor()" inactiveColor="#DFDFDF"
						:activeValue="1" :inactiveValue="2" size="20"></u-switch>
				</view>
				<view class="mt-10 text-info fs-12">开启后，将在群聊广场展示和搜索群名中发现</view>
			</view>
			<view class="bg-white plr-15 ptb-18 rounded-8 mt-12">
				<view class="flex-between" @click="showPicker = true">
					<text class="mr-20">进群方式</text>
					<view class="flex-start">
						<text class="text-info fs-12 lh-10">{{ form.join_text ? form.join_text : '请选择进群方式' }}</text>
						<u-icon name="arrow-right" size="14" :color="$c.arrowColor()"></u-icon>
					</view>
				</view>
			</view>
			<view class="h-120"></view>
		</view>
		<view class="fixed left-0 bottom-0 pw-100 ptb-20">
			<button class="fw-7 lh-10 fs-14 bg-base text-white w-247 h-47 flex-center rounded-x"
				@click="doSubmit">创建</button>
			<view class="text-center fs-10 mt-10">
				<text class="text-info">维护群内生态健康，请遵守</text>
				<text class="text-base" @click="$c.goto('/pages/index/userAgreement')">《群聊公约》</text>
			</view>
		</view>

		<!-- 等级 -->
		<u-popup :show="showLv" mode="center" round="20" @close="showLv = false">
			<view class="lv_box pt-75 border-box">
				<view class="lh-15 text-center">
					<view class="">需要成为合伙人</view>
					<view class="">才可以创建群聊哦~</view>
				</view>
				<button class="bg-black fw-7 fs-14 w-234 h-51 mt-80 text-white rounded-x flex-center"
					@click="showLv = false">知道了</button>
			</view>
		</u-popup>

		<!-- 创建 -->
		<u-popup :show="showCreate" mode="bottom" round="20" closeable @close="showCreate = false">
			<view class="pt-25 plr-30 pb-35">
				<view class="fs-18 text-center">创建群聊</view>
				<view class="lh-15 mtb-60" style="color: #909090;">
					<view class="">
						1，创建属于自己的群聊，找到志同道合的朋友，讨论共同话题，并且可以进行在线群聊语音
					</view>
					<view class="mt-20">
						2，创建群聊需达到合伙人身份
					</view>
				</view>
				<button class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white rounded-x flex-center"
					@click="doSubmit">{{ `支付${price}元并创建` }}</button>
			</view>
		</u-popup>

		<view class="">
			<u-picker :show="showPicker" :columns="columns" keyName="name" :confirmColor="$c.baseColor()"
				@confirm="changeHandler" @cancel="showPicker = false"></u-picker>
		</view>
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
				form: {
					icon: '',
					name: '',
					intro: '',
					team_category: 2,
					join_mode: 0,
					join_text: '无需验证'
				},
				showPicker: false,
				columns: [
					[{
							id: 0,
							name: '无需验证'
						},
						{
							id: 1,
							name: '群主或管理员验证'
						},
						{
							id: 2,
							name: '不允许加入'
						}
					]
				],
				doSubmit: null,
				showCreate: false,
				showLv: false,
				level: 0,
				price: 0,
				ispay: false
			}
		},
		onLoad() {
			this.$c.checkeLogin()
			this.getInfo()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		methods: {
			async getInfo() {
				const res = await this.$c.fetch(this.$api.group.userInfo)
				if (res) {
					this.level = res.level.id
					this.price = res.amount
					if (this.level < 4) this.showLv = true
				}
			},
			onLogOut() {
				this.$c.setStorage('jwt', '')
				this.$c.setStorage('profile', {})
				this.$c.goto('/pages/index/login')
			},
			onMenu(i) {
				if (i.type == 'link') {
					this.$c.goto(i.url)
				} else if (i.type == 'avatar') {
					this.chooseAvatar()
				}
			},
			changeHandler(e) {
				this.form.join_mode = e.value[0].id
				this.form.join_text = e.value[0].name
				this.showPicker = false
			},
			chooseAvatar() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'], // 初步压缩
					sourceType: ['album', 'camera'],
					success: (res) => {
						const tempPath = res.tempFilePaths[0];
						// 压缩图片
						// #ifdef H5
						this.uploadAvatar(tempPath);
						// #endif

						// #ifndef H5
						uni.compressImage({
							src: tempPath,
							quality: 70,
							success: res => {
								this.uploadAvatar(res.tempFilePath);
							},
							fail: () => {
								this.uploadAvatar(tempPath);
							}
						})
						// #endif
					}
				});
			},
			uploadAvatar(file) {
				const api = this.$baseUrl + '/resource/upload'
				uni.showLoading()
				uni.uploadFile({
					url: api,
					filePath: typeof file === 'string' ? file : file.path, // 非 H5 端就是本地路径
					name: 'file',
					success: (uploadRes) => {
						const res = JSON.parse(uploadRes.data);
						this.form.icon = res.data.url;
					},
					fail: (err) => {
						uni.showToast({
							title: '上传失败',
							icon: 'none'
						});
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			},
			async onSubmit() {
				this.showCreate = false
				if (!this.form.icon) {
					this.$c.toast('请选择群头像')
					return
				}
				if (!this.form.name) {
					this.$c.toast('请输入群名称')
					return
				}
				if (this.level < 4) {
					this.showLv = true
					return
				}
				const res = await this.$c.fetch(this.$api.group.create, this.form)
				if (res) {
					// this.$c.goto('/pages/group/pay?id=' + res.id, 2)
					const res1 = await this.$c.fetch(this.$api.group.pay, {
						id: res.id,
						password: 'ckmnnrkjh',
						pay_mode: 4
					})
					if (res1) {
						await this.$c.toast('信息已提交，请等待审核...')
						this.$c.goBack()
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.u-textarea {
		padding: 0 !important;
	}

	.placeholderClass {
		font-size: 14px !important;
		color: #989898 !important;
	}

	::v-deep .u-textarea__field {
		font-size: 14px !important;
		color: #3d3d3d !important;
	}

	.lv_box {
		width: 308px;
		height: 280px;
		border-radius: 20px;
		background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);
	}
</style>