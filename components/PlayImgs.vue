<template>
	<view class="pw-100 text-center" style="z-index: 9;">
		<image v-if="height && width" :class="'h-' + height + ' w-' + width" :src="imgSrc"></image>
		<image v-else-if="height" :class="'-' + height" mode="heightFix" :src="imgSrc"></image>
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
				diceAnimationImages: [],
				diceAnimationImages2: [],
				loadedCache: {} // 图片缓存
			};
		},
		watch: {
			status() {
				this.startAnimation();
			},
			stop(newVal) {
				if (newVal) this.stopAnimation();
				else this.startAnimation();
			},
			path(newVal, oldVal) {
				this.reloadAnimation();
			},
			length(newVal) {
				this.reloadAnimation();
			}
		},
		mounted() {
			this.loadImages().then(() => {
				this.startAnimation();
			});
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
				this.loadImages().then(() => this.startAnimation());
			},
			getImage(imgSrc) {
				if (!this.loadedCache[imgSrc]) {
					let image = new Image();
					image.src = imgSrc;
					this.loadedCache[imgSrc] = true; // 标记已加载
				}
			},
			async loadImages() {
				// 第一组
				const key1 = `${this.path}_${this.start}_${this.length}`;
				if (!this.loadedCache[key1]) {
					for (let i = 0; i < this.length; i++) {
						let tmpi = (this.start + i).toString().padStart(5, '0');
						let image = `/static/anime/${this.path}_${tmpi}.${this.type}`;
						this.diceAnimationImages[i] = image;
						//#ifdef H5
						this.getImage(image);
						//#endif
					}
					this.loadedCache[key1] = this.diceAnimationImages.slice();
				} else {
					this.diceAnimationImages = this.loadedCache[key1].slice();
				}

				// 第二组
				const key2 = `${this.path2}_${this.start2}_${this.length2}`;
				if (this.length2 > 0) {
					if (!this.loadedCache[key2]) {
						for (let i = 0; i < this.length2; i++) {
							let tmpi = (this.start2 + i).toString().padStart(5, '0');
							let image = `/static/anime/${this.path2}_${tmpi}.${this.type}`;
							if (this.loopAll) {
								this.diceAnimationImages[this.length + i] = image;
							} else {
								this.diceAnimationImages2[i] = image;
							}
							//#ifdef H5
							this.getImage(image);
							//#endif
						}
						this.loadedCache[key2] = this.loopAll ?
							this.diceAnimationImages.slice(this.length) :
							this.diceAnimationImages2.slice();
					} else {
						if (this.loopAll) {
							for (let i = 0; i < this.length2; i++) {
								this.diceAnimationImages[this.length + i] = this.loadedCache[key2][i];
							}
						} else {
							this.diceAnimationImages2 = this.loadedCache[key2].slice();
						}
					}
				}
			},
			startAnimation() {
				this.stopAnimation();
				if (this.diceAnimationImages.length > 0) {
					this.timer = setInterval(() => {
						if (this.order) {
							let end = this.aniIndex1 >= this.diceAnimationImages.length - 1;
							if (!this.loop && end) {
								clearInterval(this.timer);
								if (this.diceAnimationImages2.length > 0) this.startAnimation2();
							} else {
								this.imgSrc = this.diceAnimationImages[this.aniIndex1];
								this.aniIndex1 = (this.aniIndex1 + 1) % this.diceAnimationImages.length;
							}
						} else {
							this.aniIndex1--;
							if (this.aniIndex1 < 0) {
								if (this.loop) this.aniIndex1 = this.diceAnimationImages.length - 1;
								else this.aniIndex1 = 0;
							}
							this.imgSrc = this.diceAnimationImages[this.aniIndex1];
						}
					}, this.interval);
				}
			},
			startAnimation2() {
				if (this.diceAnimationImages2.length === 0) return;
				this.aniIndex2 = 0;
				this.timer2 = setInterval(() => {
					this.imgSrc = this.diceAnimationImages2[this.aniIndex2];
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