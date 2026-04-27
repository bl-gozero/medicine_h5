<template>
	<view>
		<Title v-if="showTitle" :title="web.title" fixed></Title>
		<view class="relative" :style="{ minHeight: `calc(100vh - ${top}px)` }">
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
				top: 55,
				web: { title: '', src: '' },
				showTitle: true
			}
		},
		onLoad(p) {
			if(p.type == 'pay') {
				const web = this.$c.getStorage('web')
				if(web) {
					this.web = web
					if (web.showTitle === false) this.showTitle = false
				}
			} else {
				this.web = { title: '在线客服', src: this.$c.cs() }
				window.open(this.$c.cs(), '_blank')
				this.$c.goBack()
			}
		},
		methods: {
		}
	}
</script>

<style>

</style>
