<template>
	<view class="page bg plr-12" :class="'pt-' + $c.barHeight()">
		<view class="flex-between plr-8 fgap-10">
			<view class="flex-start" @click="$c.goBack()">
				<image src="/static/icon/back.png" class="i-24"></image>
				<image src="/static/common/mall_name.webp" class="w-84 h-21 ml-3"></image>
			</view>
			<view class="flex-1 bg-white rounded-x h-30 flex-between" style="max-width: 220px;">
				<u-search v-model="search.name" placeholder="输入名称" placeholderColor="#9F9F9F" searchIconColor="#9F9F9F"
					searchIconSize="19" bgColor="#fff" :showAction="false" height="28"></u-search>
				<button class="w-62 h-30 bg-base text-white fs-12 btn" @click="onSearch()">搜索</button>
			</view>
		</view>
		<view class="bg-white rounded-8 ptb-8 plr-15 mt-30 flex-between">
			<view class="relative flex-center" @click="onNation()">
				<text class="text-base fs-12 fw-5 mr-3">国家 - {{ nation }}</text>
				<u-icon name="arrow-down-fill" :color="$c.baseColor()" size="8"></u-icon>
				<view v-if="showItem" class="ship_box text-info fs-12">
					<view :class="search.goods_nation_id == item.id && 'text-base'" v-for="item in nations"
						:key="item.id" @click.stop="onItem(item)">{{ item.name }}</view>
				</view>
			</view>
		</view>
		<view v-if="list.length" class="">
			<view class="mt-10 bg-white rounded-8 flex-between" v-for="(item,index) in list" :key="item.id" @click="$c.goto('/pages/goods/detail?id=' + item.id)">
				<view class="i-103 flex-center">
					<image :src="item.picture" class="x-100 y-100 rounded-8 block" lazy-load
						mode="aspectFill"></image>
				</view>
				<view class="plr-10 ptb-15 border-box flex-1">
					<text class="u-line-1 fs-14 fw-5">{{ item.name }}</text>
					<view class="flex-start fgap-3 mt-10">
						<view class="fs-10 fw-3 p-3 rounded-4" style="color: #A9833E;background: #FCF3E1;">会员专享折扣</view>
						<view class="fs-10 fw-3 p-3 rounded-4" style="color: #C4736E;background: #FFE7E0;">购物金抵扣</view>
					</view>
					<view class="flex-between mt-25">
						<view class="plr-4 flex-center">
							<view v-if="profile.level.id > 2" class="x-100">
								<text class="text-danger fs-10 fw-7">￥</text>
								<text class="text-danger fw-7">{{ item.vip_price }}</text>
								<text class="ml-4 text-base fs-10 fw-4 line-through">￥{{ item.price }}</text>
							</view>
							<view v-else class="x-100">
								<text class="text-base fs-10 fw-7">￥</text>
								<text class="text-base fw-7">{{ item.price }}</text>
								<text class="ml-4 text-danger fs-10 fw-4 line-through">￥{{ item.vip_price }}</text>
							</view>
						</view>
						<view class="goods_cart"></view>
					</view>
				</view>
			</view>
		</view>
		<view v-else-if="search.load == 'loading'" class="h-200 flex-center">
			<u-loadmore status="loading" />
		</view>
		<view v-else class="h-200 flex-center text-info fs-12">暂无商品</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				profile: this.$c.profile(),
				search: {
					page: 1,
					limit: 10,
					name: '',
					is_level_valid: 0,
					is_integral: 2,
					goods_nation_id: 0,
					load: 'more'
				},
				list: [],
				searchHistory: [],
				showItem: false,
				nations: [
					{ id: 0, name: '不限' }
				],
				nav: 2
			}
		},
		computed: {
			nation() {
				return (this.nations.find(i => i.id == this.search.goods_nation_id) || {} )?.name
			}
		},
		async onLoad(p) {
			this.searchHistory = this.$c.getStorage('searchHistory') || []
			const profile = await this.$c.checkeLogin(1)
			if (profile) {
				this.profile = profile
				this.search.goods_nation_id = this.$c.safeId(p, 'goods_nation_id') || 0
				this.getGoods()
				this.getNation()
			}
		},
		onReachBottom() {
			this.getGoods()
		},
		methods: {
			onSearch() {
				this.search.name = uni.$u.trim(this.search.name)
				if (!this.search.name) {
					// this.$c.goto('/pages/goods/search')
				} else {
					if (this.searchHistory.indexOf(this.search.name) == -1) {
						this.searchHistory.push(this.search.name)
						this.$c.setStorage('searchHistory', this.searchHistory)
					}
					this.$c.goto('/pages/goods/searchResult?name=' + this.search.name)
				}
			},
			async getGoods() {
				if (this.search.load != 'more') return
				this.search.load = 'loading'
				const res = await this.$c.fetch(this.$api.goods.goodsList, this.search)
				if (res) {
					this.list = [...this.list, ...res]
					this.search.load = res.length >= this.search.limit ? 'more' : 'end'
					this.search.page++
				}
				if (this.search.load != 'end') this.search.load = 'more'
			},
			async getNation() {
				const res = await this.$c.fetch(this.$api.goods.nation)
				if (res) this.nations = [...this.nations, ...res]
			},
			onNation() {
				this.showItem = !this.showItem
			},
			onItem(item) {
				if (this.search.load == 'loading') return
				if (this.search.goods_nation_id != item.id) {
					this.search.goods_nation_id = item.id
					this.search.page = 1
					this.search.load = 'more'
					this.list = []
					this.getGoods()
				}
				this.showItem = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		background-color: #f8f8f8;
		background-image: url('/static/mp/goods/category_bg.webp');
		background-size: 100% auto;
		background-repeat: no-repeat;
	}
	
	.ship_box {
		position: absolute;
		z-index: 100;
		left: -10%;
		bottom: -10px;
		margin: 0 auto;
		transform: translateY(105%);
		width: 120%;
		background: #fff;
		text-align: center;
		border-radius: 4px;
		padding-bottom: 7px;
		transition: all 0.3s ease;
		box-shadow:
			0px 2px 6px rgba(0, 0, 0, 0.15),
			/* 下方阴影 */
			2px 0px 6px rgba(0, 0, 0, 0.1),
			/* 右侧阴影 */
			-2px 0px 6px rgba(0, 0, 0, 0.1);
			/* 左侧阴影 */
	}
	
	.ship_box>view {
		padding-top: 7px;
	}
</style>