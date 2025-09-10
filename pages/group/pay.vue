<template>
	<view class="page bg-white">
		<view class="top_box pb-45">
			<Title title="提交订单" bgColor="transparent"></Title>
			<view class="mt-64 text-center">
				<view class="fw-7 text-base">
					<text class="fs-16">￥</text>
					<text class="fs-36">{{ price }}</text>
				</view>
				<view class="mt-13 text-info">创建群聊会费</view>
			</view>
		</view>
		<view class="h-10 bg-page"></view>
		<view class="plr-20">
			<view class="mt-20 fs-14 fw-7">支付方式</view>
			<view class="mt-15">
				<view class="flex-between ptb-13" v-for="item in cateList" :key="item.id" @click="form.pay_mode = item.id">
					<view class="flex-start">
						<image :src="`/static/pay/icon/${item.id}.png`" class="i-18 mr-10"></image>
						<text>{{ item.value }}</text>
					</view>
					<u-icon v-if="form.pay_mode == item.id" name="checkmark-circle-fill" :color="$c.baseColor()" size="20"></u-icon>
					<view v-else class="circle"></view>
				</view>
			</view>
		</view>
		<view class="absolute left-0 bottom-25 pw-100">
			<u-button
				class="bg-base fw-7 fs-14 w-224 h-43 mt-20 text-white"
				shape="circle"
				:text="`立即支付￥${ price }`"
				@click="onCheck()"
			></u-button>
		</view>
		
		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="plr-20 pt-50 pb-70 text-center">
				<view class="">需支付</view>
				<view class="fw-7 pb-36 mt-20" style="border-bottom: 1px solid #F6F6F6;">
					<text class="fs-20">￥</text>
					<text class="fs-28">{{ price }}</text>
				</view>
				<view class="mt-28 fw-7 text-left">请输入交易密码</view>
				<view class="mt-20">
					<u-code-input 
						v-model="form.password" 
						:maxlength="6" 
						:focus="true"
						:color="$c.baseColor()"
						borderColor="#EAEAEA"
						dot 
						@finish="doSubmit"></u-code-input>
				</view>
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
				cateList: [{ id: 4, value: '余额' }],
				price: '',
				id: 0,
				doSubmit: null,
				showPassword: false,
				form: { id: null, password: '', pay_mode: 0}
			}
		},
		onLoad(p) {
			if (p.id) this.form.id = parseInt(p.id)
			this.getInfo()
			this.getCateList()
			this.doSubmit = this.$c.onceRequest(this.onSubmit)
		},
		onShow() {
			
		},
		methods: {
			async getInfo() {
				const res = await this.$c.fetch(this.$api.group.userInfo)
				if (res) {
					this.price = res.amount
				}
			},
			async getCateList() {
				const res = await this.$c.fetch(this.$api.config.payCategoryList)
				if (res) this.cateList = [...this.cateList, ...res]
			},	
			onCheck() {
				if(!this.form.pay_mode) {
					this.$c.toast('请选择支付方式')
					return
				}
				this.form.password = ''
				this.showPassword = true
			},
			async onSubmit() {
				this.showPassword = false
				const res = await this.$c.fetch(this.$api.group.pay, this.form)
				if (res) {
					if(res.jump_url) {
						this.$c.setStorage('web', { title: '支付', src: res.jump_url })
						this.$c.goto('/pages/index/web?type=pay')
					} else {
						this.$c.goBack()
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top_box {
		background: linear-gradient(180deg, #CDEAEB 0%, #FFFFFF 120px);
	}
</style>