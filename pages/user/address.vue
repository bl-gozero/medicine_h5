<template>
	<view class="page bg-page lh-10">
		<view v-if="page == 1" class="">
			<Title title="地址列表" :fixed="true" />
			<view v-if="load" class="plr-20" :class="`pt-${height}`" style="color: #343434;">
				<view class="bg-white plr-14 rounded-8 mt-15" v-for="item in list" :key="item.id">
					<view class="ptb-15 border-bottom flex-between">
						<view class="mr-20">
							<view class="fs-16 fw-7 u-line-1">{{ item.district }}</view>
							<view class="mtb-10 fw-7">{{ item.address }}</view>
							<view class="text-info">
								<text>{{ item.name }}</text>
								<text class="ml-6">{{ item.phone }}</text>
							</view>
						</view>
						<view class="text-center" @click="onPage(item)">
							<image src="/static/icon/edit.png" class="i-15"></image>
							<view class="mt-7 text-info">编辑</view>
						</view>
					</view>
					<view class="ptb-15 flex-between">
						<view class="flex-start">
							<u-icon v-if="item.is_default" name="checkmark-circle-fill" :color="$c.baseColor()" size="20"></u-icon>
							<view v-else class="circle" @click="onDefault(item)"></view>
							<text class="ml-5 text-info">默认地址</text>
						</view>
						<view class="flex-start">
							<u-icon name="trash" size="18" color="#797979"></u-icon>
							<text class="ml-5 text-info" @click="doDelete(id)">删除</text>
						</view>
					</view>
				</view>
				<view class="h-130"></view>
			</view>
			<view class="fixed left-0 bottom-0 pw-100 bg-page pt-20 pb-40">
				<u-button
					class="bg-base fw-7 fs-14 text-white w-247 h-47"
					shape="circle"
					icon="plus"
					iconColor="#fff"
					text="添加地址"
					@click="onPage()"
				></u-button>
			</view>
		</view>
		<view v-else>
			<Title title="添加地址" :fixed="true" @back="page = 1" />
			<view class="plr-20" :class="`pt-${height}`">
				<view class="bg-white rounded-8 plr-14">
					<view class="ptb-18 border-bottom flex-between">
						<text class="mr-20">联系人</text>
						<u-input 
							v-model="form.name" 
							placeholder="请填写联系人姓名"
							placeholderClass="text-info fs-14"
							inputAlign="right"
							border="none"
						></u-input>
					</view>
					<view class="ptb-18 flex-between">
						<text class="mr-20">手机号码</text>
						<u-input
							v-model="form.phone" 
							placeholder="请填写联系人手机号码"
							placeholderClass="text-info fs-14"
							inputAlign="right"
							border="none"
						></u-input>
					</view>
				</view>
				<view class="bg-white rounded-8 plr-14 mt-11">
					<view class="ptb-18 border-bottom flex-between">
						<text class="mr-20">省市区</text>
						<RegionPicker
							v-model="form.district" 
							placeholder="请填写省市区街道"
						></RegionPicker>
					</view>
					<view class="ptb-18 flex-between">
						<text class="mr-20">详细地址</text>
						<u-input
							v-model="form.address" 
							placeholder="请输入详细地址"
							placeholderClass="text-info fs-14"
							inputAlign="right"
							border="none"
						></u-input>
					</view>
				</view>
				<view class="bg-white rounded-8 plr-14 mt-11">
					<view class="ptb-18 flex-between">
						<text class="mr-20">设为默认地址</text>
						<u-switch 
							v-model="form.is_default"
							:activeColor="$c.baseColor()"
							inactiveColor="#DFDFDF"
							:activeValue="1"
							:inactiveValue="0"
						></u-switch>
					</view>
				</view>
			</view>
			<view class="mt-40">
				<u-button
					class="bg-base fw-7 fs-14 text-white w-224 h-43"
					shape="circle"
					text="确定添加"
					@click="doAdd"
				></u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import Title from '../../components/Title.vue';
import form from '../../uni_modules/uview-ui/libs/config/props/form';
	import RegionPicker from '@/components/RegionPicker.vue'
	
	export default {
		components: {
			Title,
			RegionPicker
		},
		data() {
			return {
				page: 1,
				height: 0,
				list: [],
				doAdd: null,
				doDelete: null,
				load: false,
				form: { id: 0, name: '', phone: '', district: '', address: '', is_default: 0 },
			}
		},
		onLoad() {
			this.getList()
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
			async getList() {
				const res = await this.$c.fetch(this.$api.user.addressList)
				if(res) { this.list = res;this.load = true; }
			},
			async onBind() {
				if(!this.form.name) {
					this.$c.toast('请填写联系人姓名')
					return
				}
				if(!this.form.phone) {
					this.$c.toast('请填写联系人手机号码')
					return
				}
				if(!this.form.district) {
					this.$c.toast('请填写省市区街道')
					return
				}
				if(!this.form.address) {
					this.$c.toast('请输入详细地址')
					return
				}
				const api = this.form.id ? this.$api.user.addressEdit : this.$api.user.addressAdd
				const res = await this.$c.fetch(api, this.form)
				if(res) {
					this.$c.toast(this.form.id? '编辑成功' :'添加成功')
					this.getList()
					setTimeout(() => { this.page = 1 }, 1000)
				}
			},
			async onDefault(item) {
				if(item.is_default) return
				item.is_default = 1
				const res = await this.$c.fetch(this.$api.user.addressEdit, item)
				if(res) this.getList()
			},
			onPage(item = null) {
				this.form = { name: '', phone: '', district: '', address: '', is_default: 0 }
				if(item) {
					this.form = {...this.form, ...item }
				}
				this.page = 2
			},
			async onDelete(id) {
				const res = await this.$c.fetch(this.$api.user.addressDelete, { id: id })
				if(res) {
					this.$c.toast('删除成功')
					this.getList()
				}
			}
		}
	}
</script>

<style lang="less" scoped>

</style>