<template>
	<view :class="['png-animation', customClass]">
		<!-- 控制面板 -->
		<view v-if="0" class="control-panel">
			<view v-for="(path, index) in paths" :key="index" class="segment-control">
				<text>段 {{ index + 1 }}: {{ path }} ({{ counts[index] }} 帧)</text>

				<!-- 循环开关 -->
				<switch :checked="loopModes[index]==='loop'" @change="toggleLoop(index)" />
				<text>{{ loopModes[index]==='loop' ? '循环' : '一次' }}</text>

				<!-- FPS 输入 -->
				<text>FPS:</text>
				<input type="number" :value="fpsModes[index]" @input="updateFps(index, $event)" style="width:50px" />
			</view>

			<!-- 整体循环 -->
			<view class="overall-control">
				<text>整体循环</text>
				<switch :checked="overallLoop" @change="toggleOverallLoop" />
			</view>
		</view>

		<!-- 首帧占位图 -->
		<!-- <image v-if="!canvasReady && frames.length > 0" :src="frames[0]"
			:style="{ width: width + 'px', height: height + 'px', position: 'absolute', top: 0, left: 0 }"
			mode="aspectFit" /> -->

		<!-- Canvas 动画 -->
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
			}, // 每段循环模式 'once' | 'loop'
			fpsModes: {
				type: Array,
				default: () => []
			}, // 每段 FPS
			overallLoop: {
				type: Boolean,
				default: false
			},
			width: {
				type: Number,
				default: 300
			},
			height: {
				type: Number,
				default: 300
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
				lastTime: 0
			}
		},
		watch: {
			playing(val) {
				val ? this.play() : this.pause()
			}
		},
		mounted() {
			// 初始化
			this.segmentLoaded = Array(this.paths.length).fill(false)
			this.segmentStart[0] = 0
			this.preloadSegment(0).then(() => {
				this.loaded = true
				this.$nextTick(() => this.drawFirstFrame())
			})
		},
		beforeDestroy() {
			this.pause()
		},
		methods: {
			// ---------------------- 控制面板操作 ----------------------
			toggleLoop(index) {
				this.$set(this.loopModes, index, this.loopModes[index] === 'loop' ? 'once' : 'loop')
			},
			toggleOverallLoop() {
				this.overallLoop = !this.overallLoop
			},
			updateFps(index, e) {
				let val = parseInt(e.target.value)
				if (isNaN(val) || val <= 0) val = 1
				this.$set(this.fpsModes, index, val)
			},

			// ---------------------- 帧加载 ----------------------
			async preloadSegment(index) {
				if (this.segmentLoaded[index]) return
				const path = this.paths[index]
				const count = this.counts[index]
				if (index > 0) this.segmentStart[index] = this.frames.length

				for (let i = 0; i < count; i++) {
					const num = String(i).padStart(5, '0')
					const src = `/static/anime/${path}_${num}.png`
					const loadedSrc = await this.loadImage(src)
					if (loadedSrc) this.frames.push(loadedSrc)
				}
				this.segmentLoaded[index] = true
			},
			loadImage(src) {
				return new Promise(resolve => {
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
			},

			// ---------------------- Canvas 绘制 ----------------------
			drawFirstFrame() {
				if (!this.frames.length) return
				const ctx = uni.createCanvasContext(this.canvasId, this)
				ctx.drawImage(this.frames[0], 0, 0, this.width, this.height)
				ctx.draw(false, () => {
					this.canvasReady = true
					if (this.autoplay && this.playing) setTimeout(() => this.play(), 100)
				})
			},

			play() {
				if (!this.loaded || this.timer) return
				if (process.env.UNI_PLATFORM === 'h5') {
					this.lastTime = performance.now()
					const step = now => {
						const interval = 1000 / (this.fpsModes[this.currentSegment] || 24)
						if (now - this.lastTime >= interval) {
							this.drawFrame()
							this.lastTime = now
						}
						this.timer = requestAnimationFrame(step)
					}
					this.timer = requestAnimationFrame(step)
				} else {
					const frameTime = 1000 / (this.fpsModes[this.currentSegment] || 24)
					this.timer = setInterval(this.drawFrame, frameTime)
				}
				this.$emit('update:playing', true)
			},

			pause() {
				if (!this.timer) return
				if (process.env.UNI_PLATFORM === 'h5') cancelAnimationFrame(this.timer)
				else clearInterval(this.timer)
				this.timer = null
				this.$emit('update:playing', false)
			},

			async drawFrame() {
				if (!this.frames.length) return
				const ctx = uni.createCanvasContext(this.canvasId, this)
				const src = this.frames[this.currentFrame]
				if (src) {
					ctx.clearRect(0, 0, this.width, this.height)
					ctx.drawImage(src, 0, 0, this.width, this.height)
				}
				ctx.draw()

				this.currentFrame++

				// 异步加载下一段
				const nextSegment = this.currentSegment + 1
				if (nextSegment < this.paths.length &&
					!this.segmentLoaded[nextSegment] &&
					this.currentFrame >= this.segmentStart[nextSegment] - 3) {
					this.preloadSegment(nextSegment)
				}

				// 当前段结束
				const segmentEnd = this.segmentStart[nextSegment] || this.frames.length
				if (this.currentFrame >= segmentEnd) {
					const mode = this.loopModes[this.currentSegment] || 'once'
					if (mode === 'loop') {
						this.currentFrame = this.segmentStart[this.currentSegment]
					} else {
						if (nextSegment < this.paths.length) {
							this.currentSegment = nextSegment
							this.currentFrame = this.segmentStart[nextSegment]
						} else {
							if (this.overallLoop) {
								this.currentSegment = 0
								this.currentFrame = 0
							} else {
								this.pause()
							}
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
	}

	.control-panel {
		margin-bottom: 20px;
	}

	.segment-control,
	.overall-control {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	.segment-control text,
	.overall-control text {
		margin-right: 5px;
	}

	.segment-control input {
		margin-left: 5px;
	}
</style>