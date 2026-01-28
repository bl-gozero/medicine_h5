<template>
	<view class="pw-100 text-center" style="z-index: 9;">
		<image v-if="height && width" :class="'h-' + height + ' w-' + width" :src="imgSrc"></image>
		<image v-else-if="height" :class="'h-' + height" mode="heightFix" :src="imgSrc"></image>
		<image v-else-if="imgClass || imgStyle" :class="imgClass" :style="imgClass" :src="imgSrc" :mode="mode"></image>
		<image v-else class="pw-100" mode="widthFix" :src="imgSrc"></image>
	</view>
</template>

<script>
	export default {
		props: {
			loop: {
				type: Boolean,
				default: true
			},
			length: {
				type: Number,
				default: 0
			},
			path: {
				type: String,
				default: ''
			},
			order: {
				type: Boolean,
				default: true
			},
			interval: {
				type: Number,
				default: 70
			},
			status: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'png'
			},
			width: {
				type: Number,
				default: 0
			},
			imgClass: {
				String: '',
				default: ''
			},
			imgStyle: {
				String: '',
				default: ''
			},
			mode: {
				String: '',
				default: 'aspectFill'
			},
			height: {
				type: Number,
				default: 0
			},
			stop: {
				type: Boolean,
				default: false
			},
			loop2: {
				type: Boolean,
				default: true
			},
			length2: {
				type: Number,
				default: 0
			},
			path2: {
				type: String,
				default: ''
			},
			interval2: {
				type: Number,
				default: 70
			},
			loopAll: {
				type: Boolean,
				default: false
			},
			start: {
				type: Number,
				default: 0
			},
			start2: {
				type: Number,
				default: 0
			},
		},
		data() {
			return {
				timer: null,
				timer2: null,
				aniIndex1: 0,
				aniIndex2: 0,
				imgSrc: '',
				diceAnimationImages: [], // 第一段动画 src 列表
				diceAnimationImages2: [], // 第二段动画 src 列表
				loadedCache: {}, // 缓存 Image 对象
				imagesLoaded: false,
			};
		},
		watch: {
			status() {
				this.startAnimation();
			},
			stop(newVal) {
				newVal ? this.stopAnimation() : this.startAnimation();
			},
			path() {
				this.reloadAnimation();
			},
			length() {
				this.reloadAnimation();
			}
		},
		mounted() {
			this.loadImages().then(() => this.startAnimation());
		},
		beforeDestroy() {
			this.stopAnimation();
		},
		activated() {
			if (!this.stop) this.startAnimation();
		},
		deactivated() {
			this.stopAnimation();
		},
		methods: {
			reloadAnimation() {
				this.stopAnimation();
				this.imagesLoaded = false;
				this.loadImages().then(() => this.startAnimation());
			},

			// 预缓存 Image 对象到内存，播放时直接用，不走网络请求
			getImage(imgSrc) {
				if (!this.loadedCache[imgSrc]) {
					const img = new Image();
					img.src = imgSrc;
					this.loadedCache[imgSrc] = img;
				}
			},

			async loadImages() {
				if (this.imagesLoaded) return;

				// -------- 第一段动画 --------
				const key1 = `${this.path}_${this.start}_${this.length}`;
				if (!this.loadedCache[key1]) {
					for (let i = 0; i < this.length; i++) {
						const tmpi = (this.start + i).toString().padStart(5, '0');
						const src = `/static/anime/${this.path}_${tmpi}.${this.type}`;
						this.diceAnimationImages[i] = src;
						this.getImage(src);
					}
					this.loadedCache[key1] = this.diceAnimationImages.slice();
				} else {
					this.diceAnimationImages = this.loadedCache[key1].slice();
				}

				// -------- 第二段动画 --------
				const key2 = `${this.path2}_${this.start2}_${this.length2}`;
				if (this.length2 > 0) {
					if (!this.loadedCache[key2]) {
						for (let i = 0; i < this.length2; i++) {
							const tmpi = (this.start2 + i).toString().padStart(5, '0');
							const src = `/static/anime/${this.path2}_${tmpi}.${this.type}`;
							if (this.loopAll) {
								this.diceAnimationImages[this.length + i] = src;
							} else {
								this.diceAnimationImages2[i] = src;
							}
							this.getImage(src);
						}
						this.loadedCache[key2] = this.loopAll ? this.diceAnimationImages.slice(this.length) : this
							.diceAnimationImages2.slice();
					} else {
						if (this.loopAll) {
							for (let i = 0; i < this.length2; i++) {
								this.diceAnimationImages[this.length + i] = this.loadedCache[key2][i].src;
							}
						} else {
							this.diceAnimationImages2 = this.loadedCache[key2].slice().map(img => img.src);
						}
					}
				}

				// -------- 设置第一帧 --------
				if (this.diceAnimationImages.length > 0) {
					const firstImg = this.loadedCache[this.diceAnimationImages[0]];
					if (firstImg) this.imgSrc = firstImg.src;
				}

				this.imagesLoaded = true;
				this.$emit('load', {
					length1: this.diceAnimationImages.length,
					length2: this.diceAnimationImages2.length
				});
			},

			startAnimation() {
				this.stopAnimation();
				if (!this.diceAnimationImages.length) return;

				this.timer = setInterval(() => {
					if (this.order) {
						const end = this.aniIndex1 >= this.diceAnimationImages.length - 1;
						if (!this.loop && end) {
							clearInterval(this.timer);
							if (this.diceAnimationImages2.length > 0) this.startAnimation2();
						} else {
							const img = this.loadedCache[this.diceAnimationImages[this.aniIndex1]];
							if (img) this.imgSrc = img.src;
							this.aniIndex1 = (this.aniIndex1 + 1) % this.diceAnimationImages.length;
						}
					} else {
						this.aniIndex1--;
						if (this.aniIndex1 < 0) this.aniIndex1 = this.loop ? this.diceAnimationImages.length - 1 :
							0;
						const img = this.loadedCache[this.diceAnimationImages[this.aniIndex1]];
						if (img) this.imgSrc = img.src;
					}
				}, this.interval);
			},

			startAnimation2() {
				if (!this.diceAnimationImages2.length) return;
				this.aniIndex2 = 0;

				this.timer2 = setInterval(() => {
					const img = this.loadedCache[this.diceAnimationImages2[this.aniIndex2]];
					if (img) this.imgSrc = img.src;
					this.aniIndex2 = (this.aniIndex2 + 1) % this.diceAnimationImages2.length;
					if (!this.loop2 && this.aniIndex2 === 0) clearInterval(this.timer2);
				}, this.interval2);
			},

			stopAnimation() {
				clearInterval(this.timer);
				clearInterval(this.timer2);
				this.timer = null;
				this.timer2 = null;
			}
		}
	};
</script>

<style scoped lang="less">
	.animation-mask {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		border-radius: 30rpx;
		z-index: 999;
	}

	.msg {
		position: fixed;
		top: 50%;
		left: 50%;
		width: 90%;
		border-radius: 30rpx;
		z-index: 999;

		.msg_txt {
			text-align: center;
		}
	}
</style>