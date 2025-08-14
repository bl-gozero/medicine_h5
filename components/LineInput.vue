<template>
	<view class="underline-box">
		<u-input class="underline-input" v-model="innerValue"
			:type="isPassword ? (showPwd ? 'text' : 'password') : type" :placeholder="placeholder"
			:placeholderClass="placeholderClass" :maxlength="maxlength" :formatter="safeFormatter" :border="border"
			:clearable="clearable" @focus="isFocused = true" @blur="isFocused = false">
			<template slot="suffix">
				<image v-if="isPassword" :src="showPwd ? hide : see" class="i-24" @click="togglePwd" />
				<template v-else>
					<slot name="suffix"></slot>
				</template>
			</template>
		</u-input>

		<!-- 下划线 -->
		<view v-if="showLine" class="underline" :style="{ backgroundColor: isFocused ? activeColor : lineColor }" />
	</view>
</template>

<script>
	export default {
		name: "LineInput",
		props: {
			value: String, // v-model 值
			type: {
				type: String,
				default: "text"
			},
			placeholder: String,
			placeholderClass: String,
			border: {
				type: String,
				default: "none"
			},
			clearable: {
				type: Boolean,
				default: true
			},
			showLine: {
				type: Boolean,
				default: false
			},
			lineColor: {
				type: String,
				default: "#E4E4E4"
			},
			activeColor: {
				type: String,
				default: "#1A7E84"
			},
			maxlength: {
				type: Number,
				default: -1
			},
			formatter: {
				type: [Function, String],
				default: null
			}
		},
		data() {
			return {
				innerValue: this.value,
				isFocused: false,
				showPwd: false, // 密码显示/隐藏
				hide: '/static/icon/hide.png',
				see: '/static/icon/see.png'
			};
		},
		computed: {
			isPassword() {
				return this.type === "password";
			},
			safeFormatter() {
				if (typeof this.formatter === 'function') {
					return this.formatter;
				}
				if (typeof this.formatter === 'string') {
					switch (this.formatter) {
						case 'number':
							return val => val.replace(/[^\d]/g, '');
						case 'trim':
							return val => val.trim();
						default:
							return val => val;
					}
				}
				return val => val;
			}
		},
		watch: {
			value(val) {
				this.innerValue = val;
			},
			innerValue(val) {
				this.$emit("input", val);
			}
		},
		methods: {
			togglePwd() {
				this.showPwd = !this.showPwd;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.underline-box {
		position: relative;
		padding: 12px 0 5px;

		.underline {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 1px;
			width: 100%;
			transition: background-color 0.3s;
		}
	}
</style>