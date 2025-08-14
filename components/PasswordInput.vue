<template>
	<div class="password-input">
		<u--input v-model="innerValue" :placeholder="placeholder" :placeholderClass="placeholderClass"
			:type="isVisible ? 'text' : 'password'" border="none" clearable @input="$emit('input', $event)">
			<template slot="suffix">
				<image :src="isVisible? hide : see" class="i-24" @click="toggleVisibility"></image>
			</template>
		</u--input>
	</div>
</template>

<script>
	export default {
		name: 'PasswordInput',
		props: {
			value: {
				type: String,
				default: ''
			},
			placeholder: {
				type: String,
				default: ''
			},
			placeholderClass: {
				type: String,
				default: 'text-info fs-14 fw-5'
			}
		},
		data() {
			return {
				isVisible: false,
				hide: '/static/icon/hide.png',
				see: '/static/icon/see.png',
			};
		},
		computed: {
			innerValue: {
				get() {
					return this.value;
				},
				set(val) {
					this.$emit('input', val);
				}
			}
		},
		methods: {
			toggleVisibility() {
				this.isVisible = !this.isVisible;
			}
		}
	};
</script>

<style scoped>
</style>