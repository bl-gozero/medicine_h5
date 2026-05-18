<template>
	<view class="plr-20 ptb-20 page">
		<view class="fs-18 fw-5 text-center">{{ title }}</view>
		<view v-for="(item, index) in list" :key="index">
			<view class="title">{{ item.title }}</view>
			<view v-for="(sub, subIndex) in item.children" :key="subIndex">
				<view v-if="sub.subtitle" class="sub-title" :class="sub.titleClass ? sub.titleClass : ''">{{ sub.subtitle }}</view>
				<view class="content" :class="sub.contentClass ? sub.contentClass : ''" v-for="(text, textIndex) in sub.content" :key="textIndex">{{ text }}</view>
				<view v-if="sub.table" class="table">
					<!-- 表头 -->
					<view class="tr th">
						<view class="td" v-for="(name, nameIndex) in sub.table.names" :key="nameIndex"
						>{{ name }}</view>
					</view>
				
					<!-- 数据 -->
					<view class="tr" v-for="(i, itemIndex) in sub.table.items" :key="itemIndex">
						<view class="td" :class="isLink(itext) && 'link'" v-for="(itext, itextIndex) in i" :key="itextIndex"
						 @click="onLink(itext)"> {{ itext }} </view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="title" class="mt-30 content text-right" style="text-indent: 0%;">
			<view class="">开发者：沈阳北之辰电子商务有限公司</view>
			<view class="">联系方式：beichen0888@gmail.com</view>
		</view>
	</view>
</template>

<script>
	import mallPrivacyPolicy from '@/utils/protocols/mallPrivacyPolicy.js'
	import mallUserAgreement from '@/utils/protocols/mallUserAgreement.js'
	import merchantUserAgreement from '@/utils/protocols/merchantUserAgreement.js'
	import merchantPrivacyPolicy from '@/utils/protocols/merchantPrivacyPolicy.js'
	
	export default {
		data() {
			return {
				title: '',
				list: []
			}
		},
		onLoad(e) {
			const map = {
				1: mallUserAgreement,
				8: mallPrivacyPolicy,
				9: merchantPrivacyPolicy,
				10: merchantUserAgreement
			}
	
			const data = map[e.type]
	
			if (data) {
				this.title = data.title
				this.list = data.list
			}
		},
		methods: {
			isLink(e) {
				return e.indexOf('http') > -1 ? true : false
			},
			onLink(e) {
				if (this.isLink(e)) window.location.href = e
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		font-size: 14px;
		font-weight: 500;
		margin: 30px 0 20px;
	}
	.sub-title {
		font-weight: 500;
		font-size: 12px;
		line-height: 20px;
	}
	.content {
		font-size: 12px;
		line-height: 20px;
		text-indent: 2em;
		color: rgba(61, 61, 61, 0.8);
	}
	.table {
		margin-top: 20rpx;
		border-top: 1rpx solid #e5e5e5;
		border-left: 1rpx solid #e5e5e5;
	}
	
	.tr {
		display: flex;
	}
	
	.th {
		background: #C6C6C6;
		color: #3D3D3D;
		text-align: center;
	}
	
	.td {
		flex: 1;
		padding: 16rpx 10rpx;
		font-size: 22rpx;
		line-height: 32rpx;
		color: #3D3D3D;
		border-right: 1rpx solid #e5e5e5;
		border-bottom: 1rpx solid #e5e5e5;
		word-break: break-all;
		box-sizing: border-box;
	}
	
	.link {
		color: #4d7fff;
	}
</style>