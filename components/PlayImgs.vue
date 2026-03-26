<template>
	<view class="pw-100 text-center" style="z-index: 9;">
		<image v-if="height && width" :class="'h-' + height + ' w-' + width" :src="imgSrc"></image>
		<image v-else-if="height" :class="'h-' + height" mode="heightFix" :src="imgSrc"></image>
		<image v-else-if="imgClass || imgStyle" :class="imgClass" :style="imgStyle" :src="imgSrc" :mode="mode"></image>
		<image v-else class="pw-100" mode="widthFix" :src="imgSrc"></image>
	</view>
</template>

<script>
	export default {
		props: {
			loop: { type: Boolean, default: true },
			length: { type: Number, default: 0 },
			path: { type: String, default: '' },
			order: { type: Boolean, default: true },
			interval: { type: Number, default: 70 },
			status: { type: String, default: '' },
			type: { type: String, default: 'png' },
			width: { type: Number, default: 0 },
			imgClass: { type: String, default: '' },
			imgStyle: { type: String, default: '' },
			mode: { type: String, default: 'aspectFill' },
			height: { type: Number, default: 0 },
			stop: { type: Boolean, default: false },

			loop2: { type: Boolean, default: true },
			length2: { type: Number, default: 0 },
			path2: { type: String, default: '' },
			interval2: { type: Number, default: 70 },

			loopAll: { type: Boolean, default: false },
			start: { type: Number, default: 0 },
			start2: { type: Number, default: 0 }
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

				loadedCache: {},
				imagesLoaded: false,
				// #ifdef MP
				play: false
				// #endif
				// #ifndef MP
				play: false
				// #endif
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
				this.imagesLoaded = false;
				this.loadImages().then(() => {
					this.startAnimation();
				});
			},

			getImage(imgSrc) {
				if (this.play && !this.loadedCache[imgSrc]) {
					const img = new Image();
					img.src = imgSrc;
					this.loadedCache[imgSrc] = img;
				}
			},

			async loadImages() {

				if (this.imagesLoaded) return;
				
				const path = this.play ? 'anime' : 'anime_mp'

				// 第一段动画
				for (let i = 0; i < this.length; i++) {

					const tmpi = (this.start + i).toString().padStart(5, '0');

					const src = `/static/${path}/${this.path}_${tmpi}.${this.type}`;

					this.diceAnimationImages[i] = src;

					this.getImage(src);
				}

				// 第二段动画
				if (this.length2 > 0) {

					for (let i = 0; i < this.length2; i++) {

						const tmpi = (this.start2 + i).toString().padStart(5, '0');

						const src = `/static/${path}/${this.path2}_${tmpi}.${this.type}`;

						if (this.loopAll) {

							this.diceAnimationImages[this.length + i] = src;

						} else {

							this.diceAnimationImages2[i] = src;

						}

						this.getImage(src);
					}
				}

				this.imagesLoaded = true;
				
				let imgSrc = ''
				if (this.play) {
					if (this.diceAnimationImages.length > 0) {
						imgSrc = this.diceAnimationImages[0];
					}
				} else {
					if (this.loopAll) {
						imgSrc = this.diceAnimationImages[this.diceAnimationImages.length - 1];
					} else if (this.diceAnimationImages2.length > 0) {
						imgSrc = this.diceAnimationImages2[this.diceAnimationImages2.length - 1];
					} else {
						imgSrc = this.diceAnimationImages[this.diceAnimationImages.length - 1];
					}
				}
				if (imgSrc) this.imgSrc = this.$c.img(imgSrc)
				
				this.$emit('load', {
					length1: this.diceAnimationImages.length,
					length2: this.diceAnimationImages2.length
				});
			},

			startAnimation() {
				if (!this.play) return
				
				this.stopAnimation();

				if (!this.diceAnimationImages.length) return;

				this.timer = setInterval(() => {

					if (this.order) {

						const end = this.aniIndex1 >= this.diceAnimationImages.length - 1;

						if (!this.loop && end) {

							clearInterval(this.timer);

							if (this.diceAnimationImages2.length > 0) {

								this.startAnimation2();
							}

						} else {

							this.imgSrc = this.diceAnimationImages[this.aniIndex1];

							this.aniIndex1 = (this.aniIndex1 + 1) % this.diceAnimationImages.length;
						}

					} else {

						this.aniIndex1--;

						if (this.aniIndex1 < 0) {

							this.aniIndex1 = this.loop
								? this.diceAnimationImages.length - 1
								: 0;
						}

						this.imgSrc = this.diceAnimationImages[this.aniIndex1];
					}

				}, this.interval);
			},

			startAnimation2() {

				if (!this.diceAnimationImages2.length) return;

				this.aniIndex2 = 0;

				this.timer2 = setInterval(() => {

					this.imgSrc = this.diceAnimationImages2[this.aniIndex2];

					this.aniIndex2 = (this.aniIndex2 + 1) % this.diceAnimationImages2.length;

					if (!this.loop2 && this.aniIndex2 === 0) {

						clearInterval(this.timer2);
					}

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