<template>
	<u-popup :show="visible" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @close="close">
		<view class="popup-box" :style="bg">
			<image v-if="imgObj.src" :src="imgObj.src" :class="['popup-img', imgObj.class]" mode="heightFix" />
			<view v-if="title.text" :class="['popup-title', title.class]" v-html="title.text"></view>
			<view v-if="text.text" :class="['popup-text flex-1', text.class]" v-html="text.text"></view>
			<view class="popup-buttons">
				<view class="" v-for="(btn, i) in buttons" :key="i">
					<u-button  :class="['popup-btn', btn.class]" :style="btn.style"
						shape="circle" @click="clickBtn(i)">
						{{ btn.text }}
					</u-button>
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
				bg: "",
				buttons: [],
				imgObj: {},
				title: {},
				text: {},
				_resolve: null
			};
		},

		methods: {
			open(options = {}) {
				this.bg = options.bg || "background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);";
				if (typeof options.img === "string") {
					this.imgObj = {
						src: options.img,
						class: ""
					};
				} else if (typeof options.img === "object") {
					this.imgObj = {
						src: options.img.src || "",
						class: options.img.class || ""
					};
				} else {
					this.imgObj = {
						src: "",
						class: ""
					};
				}
				
				if (typeof options.title === "string") {
					this.title = {
						text: options.title,
						class: ""
					};
				} else if (typeof options.title === "object") {
					this.title = {
						text: options.title.text || "",
						class: options.title.class || ""
					};
				} else {
					this.title = {
						text: "",
						class: ""
					};
				}
				
				if (typeof options.text === "string") {
					this.text = {
						text: options.text,
						class: ""
					};
				} else if (typeof options.text === "object") {
					this.text = {
						text: options.text.text || "",
						class: options.text.class || ""
					};
				} else {
					this.text = {
						text: "",
						class: ""
					};
				}

				/** 按钮写法兼容多种格式 */
				this.buttons = (options.buttons || ["知道了"]).map(btn => {
					if (typeof btn === "string") {
						return {
							text: btn,
							class: "bg-black bold fs-16 text-white w-234 h-51",
							style: ""
						};
					}
					return {
						text: btn.text || "按钮",
						class: btn.class || "",
						style: btn.style || ""
					};
				});

				this.visible = true;

				return new Promise(resolve => {
					this._resolve = resolve;
				});
			},

			clickBtn(index) {
				this.visible = false;
				this._resolve && this._resolve(index);
			},

			close() {
				this.visible = false;
			}
		}
	};
</script>

<style>
	.popup-box {
		width: 310px;
		min-height: 280px;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding-bottom: 26px;
	}

	.popup-img {
		height: 100px;
		margin: -50px auto 0;
	}

	.popup-title {
		font-size: 18px;
		font-weight: bold;
		line-height: 28px;
		color: #1A7E84;
	}

	.popup-text {
		line-height: 28px;
		font-size: 14px;
		padding: 20px;
	}
	
	.popup-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
</style>