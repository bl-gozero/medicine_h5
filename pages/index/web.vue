<template>
	<view>
		<Title :title="web.title" fixed></Title>
		<view :class="`top-${top}`" class="relative" :style="{ minHeight: `calc(100vh - ${top}px)` }">
			<web-view :webview-styles="webviewStyles" :src="web.src"></web-view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: { Title },
		data() {
			return {
				webviewStyles: {
					progress: {
						color: this.$c.baseColor()
					}
				},
				top: 0,
				web: { title: '', src: '' }
			}
		},
		onLoad(p) {
			if(p.type == 'pay') {
				const web = this.$c.getStorage('web')
				if(web) {
					this.web = web
				}
			} else {
				this.web = { title: '在线客服', src: this.$c.cs() }
			}
		},
		onReady() {
			this.$uGetRect('.title-bar').then(res => {
				this.top = res.height
			})
		},
		methods: {
		}
	}
</script>

<style>

</style>
