<template>
  <view :class="['png-animation', customClass]" ref="container">
    <canvas 
      v-show="canvasReady" 
      :canvas-id="canvasId" 
      :width="width" 
      :height="height"
      :style="{ width: width + 'px', height: height + 'px', display: 'block' }">
    </canvas>
  </view>
</template>

<script>
export default {
  name: 'PngAnimation',
  props: {
    canvasId: { type: String, default: 'animeCanvas' },
    paths: { type: Array, required: true },          // 每段路径
    counts: { type: Array, required: true },         // 每段帧数
    loopModes: { type: Array, default: () => [] },   // 每段循环模式 'once' | 'loop'
    fpsModes: { type: Array, default: () => [] },    // 每段 FPS
    overallLoop: { type: Boolean, default: false },  // 是否整体循环
    autoplay: { type: Boolean, default: true },
    customClass: { type: String, default: '' },
    playing: { type: Boolean, default: true },
    designWidth: { type: Number, default: 100 },     // 设计稿宽度
    designHeight: { type: Number, default: 100 }     // 设计稿高度
  },
  data() {
    return {
      frames: [],                // 每帧 H5: 字符串路径 / 小程序: { path }
      currentFrame: 0,
      currentSegment: 0,
      segmentStart: [],
      segmentLoaded: [],
      timer: null,
      loaded: false,
      canvasReady: false,
      width: 200,   // 初始化 width
      height: 30   // 初始化 height
    }
  },
  watch: {
    playing(val) { val ? this.play() : this.pause() }
  },
  mounted() {
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
        const src = `/static/anime/${path}_${num}.png`
        const img = await this.loadImage(src)
        if (img) this.frames.push(img)
      }
      this.segmentLoaded[index] = true
    },

    loadImage(src) {
      return new Promise(resolve => {
        if (process.env.UNI_PLATFORM === 'h5') {
          // H5 直接使用字符串路径
          resolve(src)
        } else {
          uni.getImageInfo({
            src,
            success(res) { resolve({ path: res.path }) },
            fail() { resolve(null) }
          })
        }
      })
    },

    // ---------------------- Canvas 绘制 ----------------------
    drawFirstFrame() {
      if (!this.frames.length) return
      const ctx = uni.createCanvasContext(this.canvasId, this)
      const src = this.frames[0]
      if (process.env.UNI_PLATFORM === 'h5') ctx.drawImage(src, 0, 0, this.width, this.height)
      else ctx.drawImage(src.path, 0, 0, this.width, this.height)
      ctx.draw(false, () => {
        this.canvasReady = true
        if (this.autoplay && this.playing) setTimeout(() => this.play(), 100)
      })
    },

    play() {
      if (!this.loaded || this.timer) return
      if (process.env.UNI_PLATFORM === 'h5') {
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
      if (!src) return

      if (process.env.UNI_PLATFORM === 'h5') {
        ctx.drawImage(src, 0, 0, this.width, this.height)
      } else {
        ctx.drawImage(src.path, 0, 0, this.width, this.height)
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

      // 当前段结束逻辑
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
canvas { background: transparent; }
</style>
