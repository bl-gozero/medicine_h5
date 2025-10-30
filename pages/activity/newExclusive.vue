<template>
	<view class="bg-white">
		<Title title="新手福利活动" fixed bgColor="#fff" />
		<image src="/static/avtivity/new/goods.webp" class="pw-100 block" mode="widthFix"></image>
		<view class="price-box flex-between h-65 plr-20">
			<view class="fs-12 fw-4" style="color: #F7E7CD;">
				<text>新手价</text>
				<text class="fs-10">￥</text>
				<text class="fs-24 fw-7">0</text>
				<text class="ml-13 line-through">原价￥135</text>
			</view>
			<view class="bg-white plr-3 ptb-1 fw-5 rounded-4 fs-12">新手福利只限一次</view>
		</view>
		<view class="p-20">价值135元的北朝鲜山参 福利领取 你有一份免费北朝鲜山参领取资格</view>
		<view class="h-10 bg-page"></view>
		<view class="ptb-18 text-center">商品详情</view>
		<u--image src="/static/avtivity/new/detail.webp"  width="100%" height="auto" bgColor="transparent" mode="widthFix">
		  <template v-slot:loading>
		    <u-loading-icon color="#9F9F9F" class="mtb-100"></u-loading-icon>
		  </template>
		</u--image>
		<u-button
			v-if="done === 1"
			class="fs-16 btn bg-base-change"
			shape="circle"
			@click="showAddress = true"
		>领取福利</u-button>
		<u-button
			v-else-if="done === 2"
			class="fs-14 btn"
			style="background: #739A9C;"
			shape="circle"
			@click="onDetail()"
		>已领取   查看领取详情</u-button>
		<view class="h-20"></view>
		
		<u-popup :show="showAddress" mode="bottom" bgColor="transparent" closeable @close="showAddress = false">
			<view class="pt-14 pb-30 plr-20 bg-address lh-10 roundedTop-20">
				<view class="fs-16 text-center">收货地址</view>
				<view class="flex-between ptb-30 border-bottom">
					<image src="/static/avtivity/new/goods.webp" class="i-76 rounded-8"></image>
					<view class="flex-1 ml-8 self-start">
						<view class="">北朝鲜山参</view>
						<view class="text-info fs-12 mt-30">0元</view>
					</view>
				</view>
				<view class="flex-between ptb-25 border-bottom" @click="$c.goto('/pages/user/address?from=address')">
					<image src="/static/goods/place.png" class="w-12 h-14 self-start"></image>
					<view v-if="address.district" class="">
						<view class="">{{ address.district + address.address }}</view>
						<view class="mt-15 fs-12">
							<text class="text-info">{{ address.name }}</text>
							<text class="text-info ml-20">{{ address.phone }}</text>
						</view>
					</view>
					<view class="flex-1 ml-8 mr-20 text-info">请添加收货地址</view>
					<u-icon name="arrow-right" size="14" color="#7D7D7D" class="self-start"></u-icon>
				</view>
				<u-button class="btn-submit bg-base mt-80" shape="circle" text="确认地址并领取" @click="doSubmit"></u-button>
			</view>
		</u-popup>
		
		<u-popup :show="showDone" mode="center" bgColor="transparent" :closeOnClickOverlay="false" @close="showDone = false">
			<view class="w-336 text-center">
				<image src="/static/avtivity/new/done.webp" class="w-336 h-364"></image>
				<image src="/static/icon/close.webp" class="i-52 mt-25" @click="showDone = false"></image>
			</view>
		</u-popup>
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
				done: 0,
				event_id: 1,
				showAddress: false,
				address: {},
				showDone: false
			}
		},
		onLoad() {
			this.$c.removeStorage('address')
			this.getActivity()
			this.addressList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			const address = this.$c.getStorage('address')
			if(address) this.address = address
		},
		methods: {
			async addressList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.address = res.length > 0? res[0] : {} }
			},
			async getActivity() {
				const res = await this.$c.fetch(this.$api.user.activity, { id: this.event_id })
				if (res) {
					this.done = res.is_participate ? 2 : 1 
					if(this.done === 2) this.showDone = true
				}
			},
			async onSubmit() {
				this.showAddress = false
				const res = await this.$c.fetch(this.$api.user.activityAddress, {
					id: this.event_id,
					address_id: this.address.id
				})
				if(res) {
					this.$c.toast('提交成功')
					this.getActivity()
				}
			},
			onDetail() {
				this.$c.goto(`/pages/activity/detail?event_id=${this.event_id}`)
			}
		}
	}
</script>

<style>
	.price-box {
		background: linear-gradient(90deg, #6C5B47 0%, #312323 100%);
	}
	.btn {
		width: 260px;
		height: 45px;
		font-weight: 700;
		margin-top: 10px;
		color: #fff;
	}
	.bg-address {
		background: linear-gradient(180deg, #CDEAEB 2%, #FFFFFF 32px);
	}
</style>