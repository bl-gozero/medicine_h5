<template>
	<view class="page bg-page">
		<view v-if="page == 1" class="">
			<Title title="账户绑定管理" :fixed="true" />
			<view class="page bg-white border-box" :class="`pt-${height}`">
				<view v-if="load" class="">
					<view v-if="list.length == 0" class="pt-100 text-center">
						<image src="/static/pay/card/empty.png" class="w-160 h-98"></image>
						<view class="fs-12 mt-39">您还未绑定任何账户，请新增绑定账户</view>
					</view>
					<view v-else class="plr-20">
						<view class="mt-17" v-for="item in list" :key="item.id">
							<view class="flex-between">
								<view class="flex-start">
									<image :src="`/static/pay/icon/${item.category.id}.png`" class="i-18 mr-10"></image>
									<text>{{ item.category.value }}</text>
								</view>
								<view class="text-base" @click="onShowPassword(item.id)">解绑</view>
							</view>
							<view class="flex-center">
								<view class="relative">
									<image :src="`/static/pay/card/${item.category.id}.png`" class="w-278 h-159"></image>
									<view class="full border-box plr-40 pt-32 text-white">
										<view class="flex-between">
											<text class="fs-16 fw-9">{{ item.category.value }}</text>
											<text>{{ item.category.value }}</text>
										</view>
										<view class="mt-8 fs-12 fw-7">{{ item.name }}</view>
										<view class="mt-30 fs-12 fw-7">{{ item.name }}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="h-120"></view>
				</view>
			</view>
			<view class="fixed left-0 bottom-0 pw-100 bg-white pt-20 pb-40">
				<u-button
					class="bg-base fw-7 fs-14 text-white w-247 h-47"
					shape="circle"
					icon="plus"
					iconColor="#fff"
					text="新增绑定账户"
					@click="showCate = true"
				></u-button>
			</view>
		</view>
		<view v-else>
			<Title :title="(form.category == 3? '' : '绑定') + form.value" :fixed="true" @back="page = 1" />
			<view class="plr-20" :class="`pt-${height}`">
				<view class="">
					<view class="mt-10">{{ form.category == 3? '持卡人' : '姓名' }}</view>
					<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
						<LineInput
							v-model="form.name"
							type="text"
							:placeholder="form.category == 3? '请输入持卡人真实姓名' : `请输入使用${form.value}真实姓名`"
							placeholderClass="text-info fs-14"
						/>
					</view>
				</view>
				<view v-if="form.category == 3" class="mt-13">
					<view class="mt-10">银行</view>
					<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
						<LineInput
							v-model="form.full_name"
							type="text"
							placeholder="请选择开户行"
							placeholderClass="text-info fs-14"
						/>
					</view>
				</view>
				<view class="mt-13">
					<view class="mt-10">{{ form.category == 3? '卡号' : `${form.value}手机号` }}</view>
					<view class="mt-7 bg-white rounded-8 pb-7 plr-16">
						<LineInput
							v-model="form.card_number"
							type="text"
							:placeholder="form.category == 3? '请输入银行卡号' : `请输入${form.value}手机号`"
							placeholderClass="text-info fs-14"
						/>
					</view>
				</view>
			</view>
			<view class="mt-40">
				<u-button
					class="bg-base fw-7 fs-14 text-white w-224 h-43"
					shape="circle"
					text="绑定"
					@click="doAdd"
				></u-button>
			</view>
		</view>
		
		<!-- 添加类型 -->
		<u-popup :show="showCate" mode="bottom" round="20" closeable @close="showCate = false">
			<view class="p-20">
				<view class="text-center fs-18">选择账户</view>
				<view class="mt-50">
					<view class="ptb-20 flex-center border-bottom" v-for="item in cateList" :key="item.id" @click="onCate(item)">
						<image :src="`/static/pay/icon/${item.id}.png`" class="i-18 mr-10"></image>
						<text>{{ item.value }}</text>
					</view>
				</view>
				<view class="h-40"></view>
			</view>
		</u-popup>
	
		<!-- 密码 -->
		<u-popup :show="showPassword" mode="bottom" round="20" closeable @close="showPassword = false">
			<view class="p-20">
				<view class="text-center fs-18">解绑</view>
				<view class="mt-40 pb-7 border-bottom">
					<LineInput
						v-model="delForm.password"
						type="password"
						placeholder="请输入交易密码"
						placeholderClass="text-info fs-14 fw-7"
					/>
				</view>
				<u-button
					class="bg-base fw-7 fs-14 text-white w-224 h-43 mt-60"
					shape="circle"
					text="解绑"
					@click="doDelete"
				></u-button>
				<view class="h-30"></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
	import LineInput from '@/components/LineInput.vue'
	
	export default {
		components: {
			Title,
			LineInput
		},
		data() {
			return {
				page: 1,
				height: 0,
				category: 0,
				list: [],
				doAdd: null,
				doDelete: null,
				load: false,
				showCate: false,
				showPassword: false,
				cate: {},
				cateList: [
					{ id: 1, value: '支付宝' },
					{ id: 2, value: '微信' },
					{ id: 3, value: '银行卡' },
				],
				form: { name: '', card_number: '', full_name: '', category: 0 },
				delForm: { id: 0, password: '' }
			}
		},
		onLoad() {
			this.getCardList()
			this.getCateList()
			this.doAdd = this.$c.onceRequest(this.onBind)
			this.doDelete = this.$c.onceRequest(this.onDelete)
		},
		onReady() {
			setTimeout(() => {
				this.$uGetRect('.title-bar').then(res => {
					this.height = res.height
				})
			}, 100)
		},
		methods: {
			onShowCateList() {
				this.form = { name: '', card_number: '', full_name: '', category: 0, value: '' }
			},
			onCate(item) {
				this.form.category = item.id
				this.form.value = item.value
				this.showCate = false;
				this.page = 2
			},
			async getCardList() {
				const res = await this.$c.fetch(this.$api.user.cardList, { category: this.category })
				if(res) { this.list = res;this.load = true; }
			},
			async getCateList () {
				const res = await this.$c.fetch(this.$api.config.payCategoryList)
				if(res) this.cateList = res
			},
			async onBind() {
				const res = await this.$c.fetch(this.$api.user.cardBind, this.form)
				if(res) {
					this.$c.toast('绑定成功')
					this.getCardList()
					setTimeout(() => {
						this.page = 1
					}, 1000)
				}
			},
			onShowPassword(id) {
				this.delForm.id = id
				this.delForm.password = ''
				this.showPassword = true
			},
			async onDelete(id) {
				this.showPassword = false
				const res = await this.$c.fetch(this.$api.user.cardDelete, this.delForm)
				if(res) {
					this.$c.toast('解绑成功')
					this.getCardList()
				}
			}
		}
	}
</script>

<style lang="less" scoped>

</style>