<template>
	<view class="page bg-page plr-20">
		<Title :isBlank="true"></Title>
		<view class="flex-between">
			<image src="/static/icon/back.png" class="i-24 mr-23" @click="$c.goBack()"></image>
			<u-search v-model="search.name" placeholder="输入账号搜索成员" bgColor="#fff" :showAction="false"></u-search>
			<u-button
				class="bg-base fs-12 text-white w-62 h-32 ml-12"
				shape="circle"
				text="搜索"
				@click="onSearch()"
			></u-button>
		</view>
		<view v-if="searchHistory.length > 0" class="mt-32">
			<view class="flex-between">
				<text class=" fs-16 fw-5">历史搜索</text>
				<image src="/static/icon/del.png" class="i-16" @click="onClear()"></image>
			</view>
			<view class="flex-start flex-wrap">
				<view class="history mt-13" v-for="(item, index) in searchHistory" :key="index" @click="onSearchItem(item)">{{ item }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue'
	export default {
		components: { Title },
		data() {
			return {
				search: { page: 1, limit: 10, name: '', load: 'more' },
				list: [],
				searchHistory: []
			}
		},
		onLoad() {
			this.searchHistory = this.$c.getStorage('searchMemberHistory') || []
		},
		onReachBottom() {
			this.getGoods()
		},
		methods: {
			onSearch() {
				this.search.name = uni.$u.trim(this.search.name)
				if(!this.search.name) return
				if(this.searchHistory.indexOf(this.search.name) == -1) {
					this.searchHistory.push(this.search.name)
					this.$c.setStorage('searchMemberHistory', this.searchHistory)
				}
				this.$c.goto(`/pages/user/sellSearchResult?account=${this.search.name}`)
			},
			onClear() {
				this.searchHistory = []
				this.$c.setStorage('searchMemberHistory', this.searchHistory)
			},
			onSearchItem(item) {
				this.$c.goto('/pages/user/sellSearchResult?account=' + item)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.history {
		box-sizing: border-box;
		border: 1px solid #EAEAEA;
		background: #fff;
		height: 32px;
		border-radius: 8px;
		font-size: 12px;
		padding: 7px 13px;
		text-align: center;
		margin-right: 10px;
	}
</style>
