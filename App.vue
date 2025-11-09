<script>
	import { nimReady } from '@/utils/nim.js'
	
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			if(!this.$nim) this.onInitNIM()
		},
		onHide: function() {
		},
		methods: {
			async onInitNIM() {
				// console.log('初始化')
				const res = await this.$c.fetch(this.$api.group.config)
				if(res) {
					let nim = this.$c.getStorage('nimInfo') || {}
					this.$c.setStorage('nimInfo',  {...nim, appkey: res.app_key })
					const pages = getCurrentPages()
					const currentPage = pages[pages.length - 1]
					const current = '/' + currentPage.route
					const arr = ['/pages/index/launch', '/pages/index/login', '/pages/index/index', '/pages/index/index', '/pages/index/register', '/pages/web/register']
					const aotuLogin = arr.indexOf(current) > -1? false : true
					await nimReady(aotuLogin)
				}
			}
		}
	}
</script>

<style lang="scss">
	@import '@/utils/style.scss';
	@import "@/uni_modules/uview-ui/index.scss";
	
	.page {
		min-height: 100vh;
		font-size: 14px;
		// line-height: 1;
		color: $color-black;
	}
	
	.btn-black {
		color: #3D3D3D !important;
	}
	
	.btn-submit {
		width: 247px !important;
		height: 47px !important;
		font-weight: 700 !important;
		color: #fff !important;
	}
	
	.sign_reward_box {
		background: linear-gradient(180deg, #DFFFEE 0%, #FFFFFF 100%);
	}
	
	.bg-address {
		background: linear-gradient(180deg, #CDEAEB 2%, #FFFFFF 32px);
	}
	
	.img-box {
		width: 100%;
		aspect-ratio: 1 / 1;
		overflow: hidden;
	}
	
	.icon_info {
		width: 18px;
		height: 18px;
		background-image: url('/static/icon/info.webp');
		background-size: 100% 100%;
		display: inline-block;
	}
	
	.nav_active {
		position: relative;
		&::after {
			content: '';
			display: block;
			width: 10px;
			height: 2px;
			background: #1A7E84;
			position: absolute;
			bottom: -4px;
			left: 0;
			right: 0;
			margin: auto;
			border-radius: 2px;
		}
	}
	
	.more_box {
		width: 99px;
		height: 64px;
		background: #fff;
		border-radius: 12px;
		position: relative;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	
		/* 小三角形 */
		&::before {
			content: '';
			position: absolute;
			top: -10px;
			left: 20px;
			width: 0;
			height: 0;
			border-left: 10px solid transparent;
			border-right: 10px solid transparent;
			border-bottom: 10px solid #fff;
			// filter: drop-shadow(0 2px 2px rgba(0,0,0,0.15)); 
		}
	}
		
	.group-owner { 
		background: #B3E5E8 ; 
		color: $color-base;
		position: absolute;
		left: 0;
		right: 0;
		bottom: -3px;
		margin-left: auto;
		margin-right: auto;
		font-size: 8px;
		line-height: .8;
		width: 28px;
		height: 13px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
	}
	
	.group-admin {
		background: #FFF3D3 ; 
		color: #844A1A;
		position: absolute;
		left: 0;
		right: 0;
		bottom: -3px;
		margin-left: auto;
		margin-right: auto;
		font-size: 8px;
		line-height: .8;
		width: 28px;
		height: 13px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
	}
	
	.u-text__value {
		line-height: 1;
		align-items: center;
	}
	// 密码
	.u-code-input {
		width: 100%;
		justify-content: space-between;
	}
	::v-deep .u-code-input__item {
		width: 43px !important;
		height: 56px !important;
		border-radius: 8px;
		background: #EAEAEA;
	}
	
	// 步进器
	::v-deep .u-number-box {
		border: .5px solid #E1E1E1;
		border-radius: 4px;
	}
	::v-deep .u-number-box__minus {
		border-right: .5px solid #E1E1E1;
		width: 16px !important;
		height: 20px !important;
	}
	::v-deep .u-number-box__plus {
		border-left: .5px solid #E1E1E1;
		width: 16px !important;
		height: 20px !important;
	}
	::v-deep .uni-input-input {
		font-size: 12px;
		color: #3d3d3d;
		font-weight: 400;
	}
	::v-deep .u-number-box__input {
		height: 20px !important;
	}
	::v-deep .u-modal__content__text {
		text-align: center;
	}
	
	//确认
	::v-deep .u-modal__title {
		color: #3D3D3D !important;
	}
	::v-deep .u-modal__content__text {
		color: #3D3D3D !important;
	}
	
	::v-deep .u-count-down__text {
		color: #9f9f9f;
	}
	
	.uni-modal__title {
		font-size: 16px !important; /* 标题字体 */
		font-weight: bold !important;
	}
	
	uni-modal .uni-modal__bd {
		color: $color-black;
		
		padding: 12px 25px 25px 25px;
	}
	
	uni-modal .uni-modal__ft {
		font-size: 16px !important; /* 内容字体 */
	}
</style>
