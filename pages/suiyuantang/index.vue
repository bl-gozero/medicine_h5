<template>
	<view class="page" style="background: #1C2D27;">
		<Title title="了解岁元堂" bgColor="#1C2D27" leftIcon="/static/icon/back-white.webp" titleClass="text-white"></Title>
		<view class="relative">
			<image :src="img('navbar.webp')" class="x-100" mode="widthFix"></image>
			<view class="full flex-center fgap-13" style="padding-left: 10%;">
				<view class="navs" :class="nav == index + 1 && 'navs-active'" v-for="(item, index) in navList"
					:key="index" @click="nav = index + 1">{{ item }}</view>
			</view>
		</view>
		<view class="relative">
			<image :src="img('top.webp')" class="x-100" mode="widthFix"></image>
			<view class="absolute bottom-10 x-100 border-box plr-10">
				<view class="relative">
					<image :src="img('bar-' + nav + '.webp')" class="x-100" mode="widthFix"></image>
					<view class="full flex-between fgap-10">
						<view class="flex-1 y-100" v-for="i in 3" :key="i" @click="onBar(i)"></view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="nav == 1" class="">
			<image :src="img('1/1.webp')" class="x-100" mode="widthFix"></image>
			<view class="relative">
				<image :src="img('1/2.webp')" class="x-100" mode="widthFix"></image>
				<view class="full flex-center flex-wrap border-box" style="gap: 15% 30%;padding: 5% 1% 8%;">
					<view class="x-32 y-36" v-for="i in 4" :key="i" @click="page = 1"></view>
				</view>
			</view>
			<view class="relative">
				<image :src="img('1/3.webp')" class="x-100" mode="widthFix"></image>
				<view class="absolute x-100 y-77" style="top: 20%;">
					<u-swiper :list="ecoValue" previousMargin="27%" nextMargin="27%" circular 
						:autoplay="false" radius="0" height="100%" bgColor="transparent" @click="onEcoValue"></u-swiper>
				</view>
			</view>
			<image :src="img('1/4.webp')" class="x-100" mode="widthFix"></image>
			<view class="">
				<!-- <u-scroll-list style="margin: 2% 0 2%;">
					<view class="platform text-nowrap inline-block" :class="platform == index && 'platform-active'"
						v-for="(item, index) in platforms" :key="index" @click="platform = index">{{ item }}</view>
				</u-scroll-list> -->
				<scroll-view scroll-x :show-scrollbar="false" style="width: 100%; white-space: nowrap;min-height: 430rpx;margin-top: 2%;">
					<image :src="img('platform-' + (platform + 1) + '.webp')" style="width: 105%; display: inline-block;margin: 0 5%;" 
						mode="widthFix" @click="page = 3"></image>
				</scroll-view>
			</view>
			<image :src="img('1/6.webp')" class="x-100" mode="widthFix"></image>
			<view class="relative">
				<image :src="img('1/7.webp')" class="x-100" mode="widthFix"></image>
				<view class="absolute x-88 auto-x y-20" style="top: 79%">
					<u-scroll-list>
						<view class="hezuo text-nowrap inline-block" style="margin-left: 7%;" :class="rule == index && 'text-white underline'"
							v-for="(item, index) in rules" :key="index" @click="rule = index">{{ item }}</view>
					</u-scroll-list>
					<image :src="img('1/7-' + (rule + 1) + '.webp')" class="x-100" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view v-else-if="nav == 2" class="">
			<image :src="img('2/1.webp')" class="x-100" mode="widthFix"></image>
			<view class="relative">
				<image :src="img('2/2-'+ advantage + '.webp')" class="x-100" mode="widthFix"></image>
				<view class="full border-box" style="padding-top: 30%;">
					<view class="x-27 y-9" style="margin-bottom: 2%;" v-for="i in 5" :key="i" @click="advantage = i"></view>
				</view>
			</view>
			<image :src="img('2/3.webp')" class="x-100" mode="widthFix"></image>
			<view class="relative">
				<image :src="img('2/4.webp')" class="x-100" mode="widthFix"></image>
				<image :src="img('2/4-' + point + '.webp')" class="absolute x-90" style="left: 3%;top: 20%;" mode="widthFix"></image>
				<view v-for="(item, index) in points" :key="index" class="absolute x-40 y-8"
					:style="{ right: item.right, top: item.top }" @click="point = index + 1"></view>
			</view>
			<image :src="img('2/5.webp')" class="x-100" mode="widthFix"></image>
		</view>
		<view v-else-if="nav == 3" class="">
			<image :src="img('3/1.webp')" class="x-100" mode="widthFix"></image>
			<image :src="img('3/2.webp')" class="x-100" mode="widthFix"></image>
			<view class="relative">
				<image :src="img('3/3.webp')" class="x-100" mode="widthFix"></image>
				<view class="absolute border-box x-100" style="top: 15%">
					<view class="relative x-84 auto-x">
						<image :src="img('3/3-' + culture + '.webp')" class="x-100" mode="widthFix"></image>
						<view class="absolute flex-center x-100 y-30" style="top: 2%;gap: 4.5%;min-height: 80px;">
							<view class="y-100 x-9" v-for="i in 6" :key="i" @click="onCulture(i)"></view>
						</view>
					</view>
				</view>
			</view>
			<image :src="img('3/4.webp')" class="x-100" mode="widthFix"></image>
			<view class="relative">
				<image :src="img('3/5.webp')" class="x-100" mode="widthFix"></image>
				<view class="absolute x-86 auto-x" style="top: 28%;">
					<image :src="img('3/hezuo.webp')" class="x-100" mode="widthFix"></image>
					<u-scroll-list style="margin: 5% 0 0;">
						<view class="hezuo text-nowrap inline-block" :class="hezuo == index && 'text-white underline'"
							v-for="(item, index) in hezuos" :key="index" @click="hezuo = index">{{ item }}</view>
					</u-scroll-list>
					<image :src="img('3/h-' + (hezuo + 1) + '.webp')" class="x-100" mode="widthFix"></image>
					<image :src="img('3/title-quanyi.webp')" class="w-112 h-32 mt-20 auto-x"></image>
					<u-scroll-list style="margin: 5% 0 0;">
						<view class="hezuo text-nowrap inline-block" :class="hezuo1 == index && 'text-white underline'"
							v-for="(item, index) in hezuos1" :key="index" @click="hezuo1 = index">{{ item }}</view>
					</u-scroll-list>
					<image :src="img('3/q-' + (hezuo1 + 1) + '.webp')" class="x-100" mode="widthFix"></image>
				</view>
			</view>
		</view>

		<view v-if="page" class="page fixed x-100 top-0 left-0 flex-col" style="background: #1C2D27;">
			<Title :title="pages[page].title" bgColor="#1C2D27" leftIcon="/static/icon/back-white.webp" 
				isBack titleClass="text-white" @back="page = 0;platform = 0;"></Title>
			<!-- <view  v-if="page == 3" class="">
				<u-scroll-list style="margin: 2% 0 1%;">
					<view class="platform text-nowrap inline-block" :class="platform == index && 'platform-active'"
						v-for="(item, index) in platforms" :key="index" @click="platform = index">{{ item }}</view>
				</u-scroll-list>
			</view> -->
			<view class="flex-1 relative">
				<scroll-view scroll-y class="full">
					<image v-if="platform < 1" :src="img(pages[page].img)" class="x-100" mode="widthFix"></image>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 0,
				nav: 1,
				navList: ['太岁生态', '创业孵化', '岁元堂馆'],
				culture: 1,
				hezuos: ['门店合作', '创业合作', '产品合作', '项目合作', '城市合作'],
				hezuo: 0,
				hezuos1: ['品牌赋能权益', '产品供应权益', '创业培训权益', '市场运营权益', '数字平台权益', '资源共享权益', '优先发展权益'],
				hezuo1: 0,
				advantage: 1,
				points: [
					{ right: '9%', top: '21%' },
					{ right: '14%', top: '35%' },
					{ right: '24%', top: '50%' },
					{ right: '38%', top: '64%' },
					{ right: '50%', top: '79%' }
				],
				point: 5,
				ecoValue: [
					'/static/suiyuantang/1/3-1.webp',
					'/static/suiyuantang/1/3-2.webp',
					'/static/suiyuantang/1/3-3.webp',
					'/static/suiyuantang/1/3-4.webp',
					'/static/suiyuantang/1/3-5.webp',
					'/static/suiyuantang/1/3-6.webp',
				],
				rules: ['用户义务', '包销协议', '服务内容', '服务期限', '服务原则'],
				rule: 0,
				pages: [
					{},
					{ title: '太岁种类', img: 'category.webp' },
					{ title: '太岁生态菌价值', img: 'ecoValue.webp' },
					{ title: '岁元堂·生命微生物平台', img: 'breedingBase.webp' }
				],
				platforms: ['养殖基地', '实景展示', '环境展示', '透明化管理', '生态共建·共享未来'],
				platform: 0
			}
		},
		onLoad() {},
		methods: {
			onBar(i) {
				if (i === 2) return
				this.nav += i === 1 ? i : i - 1
				if (this.nav > 3) {
					this.nav -= 3
				}
			},
			onCulture(i) {
				if (this.culture == i) return
				this.culture = i
			},
			onEcoValue(e) {
				this.page = 2
			},
			img(path, mode = 0, root = '/static/suiyuantang/') {
				if (path && !/^(https?:)?\/\//.test(path) && !path.startsWith('/static')) {
					path = root + path
				}
				return this.$c.img(path, mode)
			}
		},
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}

	.navs {
		color: #898D6B;
		font-size: 12px;
		position: relative;
	}

	.navs-active {
		color: #E8C082;
		font-weight: 700;

		&::after {
			content: '';
			width: 49px;
			height: 7.5px;
			position: absolute;
			bottom: -11px;
			left: 50%;
			transform: translateX(-50%);
			background-image: url('/static/suiyuyantang/nav-line.webp');
			background-size: 100% 100%;
		}
	}

	.hezuo {
		font-size: 12px;
		color: rgba(254, 255, 255, 0.5);
		margin-left: 5%;
		padding-bottom: 3px;
	}
	
	.platform {
		font-weight: bold;
		font-size: 32rpx;
		background: #325243;
		color: #C9C8B3;
		padding: 2px 11px 4px 9px;
		position: relative;
		clip-path: polygon(
			0 0,
			100% 0,
			calc(100% - 6px) 50%,
			100% 100%,
			0 100%
		);
		&:first-child {
			margin-left: 8%;
		}
		&:first-child::before {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			width: 4px;
			height: 4px;
			background: #1F2E28; // 改成页面背景色
			border-radius: 0 0 100% 0;
		}
		&:first-child::after,&:first-child::before {
			content: '';
			position: absolute;
			left: 0;
			width: 4px;
			height: 4px;
			background: #1F2E28;
		}
		&:first-child::before {
			top: 0;
			border-radius: 0 0 100% 0;
		}
		&:first-child::after {
			bottom: 0;
			border-radius: 0 100% 0 0;
		}
		&:not(:first-child) {
			clip-path: polygon(
				6px 0,
				100% 0,
				calc(100% - 6px) 50%,
				100% 100%,
				6px 100%,
				0 50%
			);
			margin-left: 5px;
		}
	}
	
	.platform-active {
		background: linear-gradient(180deg, #e6e2c9 2%, #a19271 98%);
		color: #2E281A;
	}

	::v-deep .u-scroll-list__indicator {
		display: none !important;
	}
</style>