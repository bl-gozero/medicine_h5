<template>
	<view class="observe-logs full flex-col">
		<!-- 记录列表 -->
		<view class="flex-1 relative" style="min-height: 370rpx;">
			<scroll-view scroll-y class="full pt-10 border-box" @scrolltolower="">
				<view class="" style="min-height: 190px;">
					<view v-if="logs.length">
						<view v-for="(item, index) in logs" :key="item.id" class="flex-between fgap-8 mb-23">
							<!-- 时间轴 -->
							<view :class="index && 'step'">
								<image :src="img('step-img.webp')" class="i-40"></image>
							</view>
							<!-- 内容 -->
							<view class="flex-1 flex-between">
								<view>
									<view class="fs-14">完成了培育观察记录</view>
									<view class="opacity-6 fs-12">{{ item.created_at }}</view>
								</view>
								<!-- 预览 -->
								<image :src="img('btn-preview.webp')" class="w-75 h-24" @click="preview(item)"></image>
							</view>
						</view>
					</view>
					<!-- 空状态 -->
					<view v-else class="h-190 flex-center opacity-6">暂无记录</view>
				</view>
			</scroll-view>
		</view>
		<!-- 上传按钮 -->
		<view class="pb-20 pt-5">
			<image :src="img('btn-upload.webp')" class="w-228 h-44 auto-x" @click="handleUpload"></image>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ObserveLogs',
		props: {
			// 观察记录
			logs: {
				type: Array,
				default: () => []
			}
		},
		data() {
			return {
			}
		},
		methods: {
			preview(item) {
				if (!item?.picture?.length) return
				uni.previewImage({
					current: item.picture[0],
					urls: item.picture
				})
			},
			handleUpload() {
				this.$emit('upload')
			},
			img(path, root = '/static/suiyuantang/', mode = 0) {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}

	.step {
		position: relative;

		&::after {
			content: '';
			position: absolute;
			left: 50%;
			bottom: 100%;
			transform: translateX(-50%);
			width: 2px;
			height: 25px;
			background: repeating-linear-gradient(to bottom,
					#A86D16 0,
					#A86D16 4px,
					transparent 4px,
					transparent 8px);
		}
	}
</style>