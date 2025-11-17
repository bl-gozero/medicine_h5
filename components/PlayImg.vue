<template>
	<div :class="['png-animation', customClass]" ref="container">
		<canvas v-show="canvasReady" :canvas-id="canvasId" :width="width" :height="height"
			:style="{ width: width + 'px', height: height + 'px', display: 'block' }">
		</canvas>
	</div>
</template>

<script>
	export default {
		name: 'PngAnimation',
		props: {
			canvasId: {
				type: String,
				default: 'animeCanvas'
			},
			paths: {
				type: Array,
				required: true
			},
			counts: {
				type: Array,
				required: true
			},
			loopModes: {
				type: Array,
				default: () => []
			},
			fpsModes: {
				type: Array,
				default: () => []
			},
			overallLoop: {
				type: Boolean,
				default: false
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
			},
			designWidth: {
				type: Number,
				default: 100
			},
			designHeight: {
				type: Number,
				default: 100
			},
			type: {
				type: String,
				default: 'webp'
			}
		},
		data() {
			return {
				frames: [],
				currentFrame: 0,
				currentSegment: 0,
				segmentStart: [],
				segmentLoaded: [],
				timer: null,
				loaded: false,
				canvasReady: false,
				width: 100,
				height: 100
			}
		},
		watch: {
			playing(val) {
				val ? this.play() : this.pause()
			}
		},
		mounted() {
			// 初始化 canvas 尺寸
			this.calculateSize()
			window.addEventListener('resize', this.calculateSize)

			this.segmentLoaded = Array(this.paths.length).fill(false)
			this.segmentStart[0] = 0
			this.preloadSegment(0).then(() => {
				this.loaded = true
				this.$nextTick(() => this.drawFirstFrame())
			})
		},
		beforeDestroy() {
			this.pause()
			window.removeEventListener('resize', this.calculateSize)
		},
		methods: {
			// ---------------------- 自适应父容器 ----------------------
			calculateSize() {
				this.$nextTick(() => {
					const container = this.$refs.container
					if (container) {
						const containerWidth = container.offsetWidth
						const ratio = containerWidth / this.designWidth
						this.width = containerWidth
						this.height = this.designHeight * ratio

						// canvas 已准备好则重绘当前帧
						if (this.canvasReady && this.frames.length) {
							const ctx = uni.createCanvasContext(this.canvasId, this)
							const src = this.frames[this.currentFrame]
							ctx.drawImage(src, 0, 0, this.width, this.height)
							ctx.draw()
						}
					}
				})
			},

			// ---------------------- 预加载 ----------------------
			async preloadSegment(index) {
				if (this.segmentLoaded[index]) return
				const path = this.paths[index]
				const count = this.counts[index]
				if (index > 0) this.segmentStart[index] = this.frames.length

				for (let i = 0; i < count; i++) {
					const num = String(i).padStart(5, '0')
					const src = `/static/anime/${path}_${num}.${this.type}`
					await this.loadImage(src)
				}
				this.segmentLoaded[index] = true
			},

			loadImage(src) {
				return new Promise(resolve => {
					const img = new Image()
					img.src = src
					img.onload = () => {
						this.frames.push(src) // H5直接存路径
						resolve(src)
					}
					img.onerror = () => resolve(null)
				})
			},

			// ---------------------- Canvas 绘制 ----------------------
			drawFirstFrame() {
				if (!this.frames.length) return
				const ctx = uni.createCanvasContext(this.canvasId, this)
				const src = this.frames[0]
				ctx.drawImage(src, 0, 0, this.width, this.height)
				ctx.draw(false, () => {
					this.canvasReady = true
					if (this.autoplay && this.playing) setTimeout(() => this.play(), 100)
				})
			},

			play() {
				if (!this.loaded || this.timer) return
				let lastTime = performance.now()
				const step = now => {
					const interval = 1000 / (this.fpsModes[this.currentSegment] || 24)
					if (now - lastTime >= interval) {
						this.drawFrame()
						lastTime = now
					}
					this.timer = requestAnimationFrame(step)
				}
				this.timer = requestAnimationFrame(step)
				this.$emit('update:playing', true)
			},

			pause() {
				if (!this.timer) return
				cancelAnimationFrame(this.timer)
				this.timer = null
				this.$emit('update:playing', false)
			},

			drawFrame() {
				if (!this.frames.length) return
				const ctx = uni.createCanvasContext(this.canvasId, this)
				const src = this.frames[this.currentFrame]
				if (!src) return

				ctx.drawImage(src, 0, 0, this.width, this.height)
				ctx.draw()

				this.currentFrame++

				const nextSegment = this.currentSegment + 1
				if (nextSegment < this.paths.length &&
					!this.segmentLoaded[nextSegment] &&
					this.currentFrame >= this.segmentStart[nextSegment] - 3) {
					this.preloadSegment(nextSegment)
				}

				const segmentEnd = this.segmentStart[nextSegment] || this.frames.length
				if (this.currentFrame >= segmentEnd) {
					const mode = this.loopModes[this.currentSegment] || 'once'
					if (mode === 'loop') this.currentFrame = this.segmentStart[this.currentSegment]
					else {
						if (nextSegment < this.paths.length) {
							this.currentSegment = nextSegment
							this.currentFrame = this.segmentStart[nextSegment]
						} else {
							if (this.overallLoop) {
								this.currentSegment = 0
								this.currentFrame = 0
							} else this.pause()
						}
					}
				}
			},

			reset() {
				this.currentFrame = 0
				this.currentSegment = 0
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
		display: block;
	}
</style>