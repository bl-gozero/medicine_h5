<template>
	<view class="promote-share-progress">
		<!-- 分享进度图片 -->
		<image :src="imageSrc" class="w-92 h-30 block mb-5" :class="center && 'auto-x'" mode="aspectFit"></image>

		<!-- 说明文字 -->
		<view class="fs-12 fw-5" :class="center && 'text-center'" style="color: #763524;">

			<!-- 未领取商品 -->
			<view v-if="!promote.status">
				<text class="text-base">先领取商品</text>
				<text>完成对应分享任务后解锁相应活动权益</text>
			</view>

			<!-- 已领取，分享人数未达到要求 -->
			<view v-else-if="promote.count < promote.max">
				<text>只差</text>
				<text class="text-base fw-7 fs-16">
					{{ remainNum }}
				</text>
				<text>人即可获得押金返还+</text>
				<text class="text-base fw-7 fs-16">
					{{ promote.num }}元
				</text>
				<text>广告佣金</text>
			</view>

			<!-- 已达到分享要求 -->
			<view v-else>
				<text>
					已分享{{ promote.max }}人，
					<text class="text-base">押金已返还</text>
					+
					<text class="fw-7 fs-16 text-base">
						{{ promote.num }}元
					</text>
					广告佣金已解锁
					<br />
					继续分享可获得更多佣金收益+
				</text>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		name: 'ShareProgress',
		props: {
			promote: {
				type: Object,
				default: () => ({
					status: 0,
					num: 0,
					count: 0,
					max: 2
				})
			},
			center: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			// 还需要分享的人数
			remainNum() {
				return Math.max(this.promote.max - this.promote.count, 0)
			},
			// 分享进度图片
			imageSrc() {
				if (!this.promote.status) {
					return this.img('share-0.webp')
				}
				if (this.promote.count >= this.promote.max) {
					return this.img('share-3.webp')
				}
				// 剩余人数
				const remain = this.promote.max - this.promote.count
				return this.img(`share-${remain == 2 ? 1 : 2}.webp`)
			}
		},
		methods: {
			img(path, root = '/static/avtivity/promote/index/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>