<template>
	<view :class="['png-animation', customClass]"
		:style="{ width: width + 'px', height: height + 'px', position: 'relative' }">

		<!-- 首帧占位图：在 canvas 准备前显示，防止闪烁 -->
		<image v-if="!canvasReady && images.length > 0" :src="images[0]"
			:style="{ width: width + 'px', height: height + 'px', position: 'absolute', top: 0, left: 0 }"
			mode="aspectFit" />

		<!-- 真正动画的 canvas -->
		<canvas v-show="canvasReady" :canvas-id="canvasId" :id="canvasId" :width="width" :height="height"
			:style="{ width: width + 'px', height: height + 'px', display: 'block' }"></canvas>
	</view>
</template>

<script>
	export default {
		name: 'PngAnimation',
		props: {
			canvasId: {
				type: String,
				default: 'animeCanvas'
			},
			path: {
				type: String,
				required: true
			}, // 例如 "sign/1_"
			count: {
				type: Number,
				required: true
			}, // 总帧数
			fps: {
				type: Number,
				default: 24
			},
			width: {
				type: Number,
				default: 300
			},
			height: {
				type: Number,
				default: 300
			},
			loop: {
				type: Boolean,
				default: true
			},
			autoplay: {
				type: Boolean,
				default: true
			},
			customClass: {
				type: String,
				default: ''
			},
			playing: {
				type: Boolean,
				default: true
			} // v-model 控制播放状态
		},
		data() {
			return {
				images: [],
				currentFrame: 0,
				timer: null,
				loaded: false,
				canvasReady: false,
				lastTime: 0
			}
		},
		watch: {
			playing(val) {
				val ? this.play() : this.pause()
			}
		},
		mounted() {
			this.preloadImages().then(() => {
				this.loaded = true
				this.$nextTick(() => {
					this.drawFirstFrame()
				})
			})
		},
		beforeDestroy() {
			this.pause()
		},
		methods: {
			// ✅ 图片预加载
			preloadImages() {
				const promises = []
				for (let i = 0; i < this.count; i++) {
					const num = String(i).padStart(5, '0')
					const src = `/static/anime/${this.path}${num}.png`
					promises.push(
						new Promise(resolve => {
							if (process.env.UNI_PLATFORM === 'h5') {
								const img = new Image()
								img.src = src
								img.onload = () => resolve(src)
								img.onerror = () => resolve(null)
							} else {
								uni.getImageInfo({
									src,
									success(res) {
										resolve(res.path)
									},
									fail() {
										resolve(null)
									}
								})
							}
						})
					)
				}
				return Promise.all(promises).then(imgs => {
					this.images = imgs.filter(Boolean)
				})
			},

			// ✅ 绘制首帧（不闪）
			drawFirstFrame() {
				if (!this.images.length) return
				const ctx = uni.createCanvasContext(this.canvasId, this)
				const src = this.images[0]
				ctx.drawImage(src, 0, 0, this.width, this.height)
				ctx.draw(false, () => {
					this.canvasReady = true
					if (this.autoplay && this.playing) {
						setTimeout(() => this.play(), 100)
					}
				})
			},

			// ✅ 播放动画
			play() {
				if (!this.loaded || this.timer) return

				if (process.env.UNI_PLATFORM === 'h5') {
					this.lastTime = performance.now()
					const step = now => {
						const interval = 1000 / this.fps
						if (now - this.lastTime >= interval) {
							this.drawFrame()
							this.lastTime = now
						}
						this.timer = requestAnimationFrame(step)
					}
					this.timer = requestAnimationFrame(step)
				} else {
					const frameTime = 1000 / this.fps
					this.timer = setInterval(this.drawFrame, frameTime)
				}

				this.$emit('update:playing', true)
			},

			// ✅ 暂停
			pause() {
				if (this.timer) {
					if (process.env.UNI_PLATFORM === 'h5') {
						cancelAnimationFrame(this.timer)
					} else {
						clearInterval(this.timer)
					}
					this.timer = null
					this.$emit('update:playing', false)
				}
			},

			// ✅ 绘制每一帧
			drawFrame() {
				if (!this.images.length) return
				const ctx = uni.createCanvasContext(this.canvasId, this)
				const src = this.images[this.currentFrame]
				if (src) {
					ctx.clearRect(0, 0, this.width, this.height)
					ctx.drawImage(src, 0, 0, this.width, this.height)
				}
				ctx.draw()
				this.currentFrame++
				if (this.currentFrame >= this.images.length) {
					if (this.loop) this.currentFrame = 0
					else this.pause()
				}
			},

			// ✅ 重置动画
			reset() {
				this.currentFrame = 0
				const ctx = uni.createCanvasContext(this.canvasId, this)
				ctx.clearRect(0, 0, this.width, this.height)
				ctx.draw()
			}
		}
	}
</script>

<style scoped>
	canvas {
		background: transparent;
	}
</style>