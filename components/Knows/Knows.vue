<template>
	<u-popup :show="visible" mode="center" bgColor="transparent" :closeOnClickOverlay="closeOnClickOverlay" @close="handleClose">
		<view class="popup-box sign_reward_box" :class="bgClass" :style="bgStyle">
			<image v-if="imgObj.src" :src="imgObj.src" :class="['popup-img', imgObj.class]" mode="heightFix" />
			<view v-if="title.text" :class="['popup-title', title.class]">{{ title.text }}</view>
			<view v-if="text.text" :class="['popup-text flex-1', text.class]" v-html="text.text"></view>
			<view class="popup-buttons">
				<view class="flex-1" v-for="(btn,index) in buttons" :key="index">
					<button :class="['popup-btn rounded-x flex-center border-0', btn.class]" :style="btn.style"
						@click="clickBtn(index)">
						{{ btn.text }}
					</button>
				</view>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				visible: false,
				bgStyle: '',
				bgClass: '',
				buttons: [],
				imgObj: {},
				title: {},
				text: {},
				closeOnClickOverlay: false
			}
		},
		mounted() {
			uni.$on('global-popup-show', this.open)
			uni.$on('global-popup-close', this.handleClose)
		},
		beforeDestroy() {
			uni.$off('global-popup-show', this.open)
			uni.$off('global-popup-close', this.handleClose)
		},
		methods: {
			open(options = {}) {
				this.bgStyle = options.bgStyle || ''
				this.bgClass = options.bgClass || ''
				// 图片
				if (typeof options.img === "string") {
					this.imgObj = {
						src: options.img,
						class: ""
					}
				} else {
					this.imgObj = Object.assign({
						src: "",
						class: ""
					}, options.img)
				}

				// 标题
				if (typeof options.title === "string") {
					this.title = {
						text: options.title,
						class: ""
					}
				} else {
					this.title = Object.assign({
						text: "",
						class: ""
					}, options.title)
				}

				// 内容
				if (typeof options.text === "string") {
					this.text = {
						text: options.text,
						class: ""
					}
				} else {
					this.text = Object.assign({
						text: "",
						class: ""
					}, options.text)
				}

				// 按钮
				this.buttons = (options.buttons || []).map(btn => {
					if (typeof btn === "string") {

						return {
							text: btn,
							class: "bg-black bold fs-16 text-white w-234 h-51",
							style: "",
							click: null
						}

					}
					return {
						text: btn.text || "",
						class: btn.class || "",
						style: btn.style || "",
						click: btn.click || null
					}
				})
				this.closeOnClickOverlay = options.closeOnClickOverlay || false
				this.visible = true
			},
			clickBtn(index) {
				const btn = this.buttons[index]
				this.visible = false
				if (btn && typeof btn.click === 'function') {
					btn.click()
				}
			},

			handleClose() {
				this.visible = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.popup-box {
		min-height: 230px;
	}
	.popup-buttons {
		padding: 0 20px;
	}
	.popup-btn {
		font-size: 14px;
		height: 40px;
	}
</style>