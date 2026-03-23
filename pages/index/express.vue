<template>
	<view class="page bg-page plr-20">
		<Title title="物流信息" fixed />
		<view v-if="info.number" class="bg-white plr-16 ptb-20 rounded-14 border-box mt-10">
			<text class="fs-12">单号</text>
			<text class="fs-12 ml-10">{{ info.number }}</text>
			<text class="mlr-8" style="color: #DFDFDF;">|</text>
			<text class="text-base fs-13" @click="$c.copy(info.number)">复制</text>
		</view>
		<view v-if="list.length" class="bg-white plr-16 ptb-20 rounded-14 border-box mt-10">
			<u-steps direction="column" dot>
				<u-steps-item v-for="(item, i) in list" :key="i" :title="`${item.AcceptTime} ${item.Location}`">
					<text class="slot-icon" slot="icon"></text>
					<text class="fs-10 lh-12 mt-5 text-info" slot="desc">{{ item.AcceptStation }}</text>
				</u-steps-item>
			</u-steps>
		</view>
		<view class="h-30"></view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: {
			Title
		},
		data() {
			return {
				info: {},
				list: [],
			}
		},
		onLoad() {
			const eventChannel = this.getOpenerEventChannel()
			eventChannel.on('pageData', (data) => {
			    if(data) {
					this.info = data
					this.getData(data)
				}
			})
		},
		methods: {
			async getData(data) {
				const res = await this.$c.getExpress(data.id , data.mode)
				if(Array.isArray(res) && res.length) {
					this.list = res.sort((a, b) => new Date(b.AcceptTime) - new Date(a.AcceptTime))
				}
			},
		}
	}
</script>

<style scoped lang="scss">
	.slot-icon {
		width: 7px;
		height: 7px;
		border: 1px solid #9F9F9F;
		border-radius: 50%;
	}
	::v-deep .u-steps-item__line {
		border-left: 1px dashed #9F9F9F !important;
		background: none !important;
		width: 0;
	}
	/* #ifndef MP */
	::v-deep .u-text__value--main {
		color: #1A7E84 !important;
		font-weight: 500 !important;
		font-size: 12px !important;
	}
	/* #endif */
	/* #ifdef MP */
	::v-deep .u-text__value--main {
		color: #EB5433 !important;
		font-weight: 500 !important;
		font-size: 12px !important;
	}
	/* #endif */
	::v-deep .u-text__value--content {
		color: #3D3D3D !important;
		font-weight: 500 !important;
		font-size: 12px !important;
	}
</style>