<template>
	<view class="steps relative">
		<!-- 背景 -->
		<image :src="img('steps.webp')" class="steps"></image>
		<!-- 价格 -->
		<image :src="img(promote.price + '.webp')" class="price" mode="widthFix"></image>
		<!-- 第一步 -->
		<image :src="img('step-1.webp')" class="step-1" mode="widthFix"></image>
		<!-- 第一步：商品 -->
		<view class="absolute flex-center x-100" style="top: 51px;">
			<view class="goods-box border-box">
				<u-scroll-list class="plr-5" :indicator="false">
					<view class="goods mr-4 mtb-3" v-for="item in goods" :key="item.id" @click="onGoods(item)">
						<view class="border-box p-3">
							<image :src="img(item.picture)" class="i-73" mode="aspectFill"></image>
						</view>
						<view class="text-center fs-10 fw-5 plr-5 border-box u-line-1"> {{ item.name }}</view>
					</view>
				</u-scroll-list>
				<image v-if="!promote.status" :src="img('btn-get.webp')" class="w-228 h-30 auto-x " @click="onActive()"></image>
				<image v-else :src="img('btn-log.webp')" class="w-228 h-30 auto-x" @click="$c.goto('/pages/activity/promote/log?type=3')"></image>
			</view>
		</view>
		<!-- 第二步 -->
		<view class="absolute flex-center x-100" style="top: 215px;">
			<view class="relative">
				<!-- 第二步背景 -->
				<image :src="img('step-2.webp')" class="step-2"></image>
				<view class="full border-box pt-66">
					<view class="flex-between border-box plr-10">
						<!-- 左侧分享进度 -->
						<image v-if="!promote.status || promote.count < 1" :src="img(promote.num + '-0.webp')" class="w-93 h-84"></image>
						<image v-else :src="img(promote.num + '-1.webp')" class="w-93 h-84"></image>
						<!-- <image v-else :src="img(promote.max + '-2.webp')" class="w-93 h-84"></image> -->
						<!-- 预计收益 -->
						<view class="text-center">
							<view class="fw-5 fs-12" style="color: #763524;">{{ promote.amount < promote.income ? '即将解锁（元）' : '总收益（元）' }}</view>
							<image v-if="promote.amount < promote.income" :src="img(promote.income + '.webp')" class="w-108 h-39 mt-5"></image>
							<view v-else class="fs-28 fw-7 gradient-text">{{ promote.amount }}</view>
						</view>
						<!-- 分享按钮 -->
						<ShareButton :promote="promote" />
					</view>
					<!-- 分享说明 -->
					<ShareProgress :promote="promote" center></ShareProgress>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import ShareProgress from './ShareProgress.vue'
	import ShareButton from './ShareButton.vue'

	export default {
		name: 'PromoteSteps',
		components: {
			ShareProgress,
			ShareButton
		},
		props: {
			promote: {
				type: Object,
				default: () => ({
					status: 0,
					count: 0,
					num: 0,
					max: 2,
					price: '',
					income: ''
				})
			},
			goods: {
				type: Array,
				default: () => []
			}
		},
		computed: {
			// 分享按钮图片
			shareButton() {
				if (!this.promote.status) {
					return this.img('btn-share-0.webp')
				}
				if (this.promote.num >= this.promote.max) {
					return this.img('btn-share-3.webp')
				}
				const remain = this.promote.max - this.promote.num
				return this.img(`btn-share-${remain}.webp`)
			}
		},
		methods: {
			onGoods (item) {
				if (this.promote.status) return
				this.$c.goto(`/pages/activity/promote/goods?id=${item.id}`)
			},
			onActive() {
				this.$emit('active')
			},
			img(path, mode = 0, root = '/static/avtivity/promote/index/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>
<style lang="scss" scoped>
	.steps {
		width: 375px;
		height: 486px;
	}

	.step-1 {
		width: 153px;
		position: absolute;
		top: -17px;
		right: 25px;
		transform: scale(1.3);
	}

	.step-2 {
		width: 343px;
		height: 252px;
	}

	.price {
		position: absolute;
		top: -34px;
		left: 25px;
		width: 152px;
		transform: scale(1.5);
	}

	.goods-box {
		width: 343px;
		height: 155px;
		border-radius: 10px 10px 11px 11px;
		background: linear-gradient(180deg, #fdf1d800 0%, #fdf1d8 14%, #fdd689 100%);
	}

	.goods {
		width: 80px;
		height: 98px;
		background: linear-gradient(180deg, #ffffff 0%, #fbe8ce 100%);
		border-radius: 6px;
		box-shadow: 0px 0px 2px 0px #EA903C;
	}

	.btns {
		width: 67px;
		height: 20px;
		margin: 5px auto 0;
		line-height: 18px;
		text-align: center;
		font-size: 11px;
		font-weight: 500;
		color: #fff;
	}

	.btn-1 {
		background-image: url('/static/avtivity/promote/index/btn-1.webp');
		background-size: 100% 100%;
	}

	.btn-2 {
		background-image: url('/static/avtivity/promote/index/btn-2.webp');
		background-size: 100% 100%;
	}

	.btn-3 {
		background-image: url('/static/avtivity/promote/index/btn-3.webp');
		background-size: 100% 100%;
	}
	
	.gradient-text {
		background: linear-gradient(180deg, #fd6e09 0%, #fa3201 100%);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
	}

	image {
		display: block;
	}
</style>