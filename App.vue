<script>
	import {
		nimReady
	} from '@/utils/nim.js'

	export default {
		onLaunch: function() {
		},
		onShow: function() {
			this.onInitNIM()
		},
		onHide: function() {},
		methods: {
			async onInitNIM() {
				const res = await this.$c.fetch(this.$api.group.config)
				if (res?.endpoint) this.$c.setStorage('endpoint', res.endpoint)
				if (res?.app_key && !this.$nim) {
					let nim = this.$c.getStorage('nimInfo') || {}
					this.$c.setStorage('nimInfo', {
						...nim,
						appkey: res.app_key
					})
					this.$c.checkNim()
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
		color: $color-black;
	}
	
	.btn {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		padding: 0;
		font-size: 14px;
	}

	.btn-black {
		color: #3D3D3D !important;
	}

	.btn-submit {
		width: 247px !important;
		height: 47px !important;
		font-weight: 700 !important;
		color: #fff !important;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		padding: 0;
	}
	
	.sku_name {
		background: #F5F5F5;
		padding: 10px;
		border-radius: 4px;
	}
	
	.goods_price_box {
		width: 111px;
		height: 25px;
		background-image: url('/static/mp/index/price.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.goods_cart {
		width: 35px;
		height: 25px;
		background-image: url('/static/mp/index/cart.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}
	.text-base.line-through {
		color: #F4A418 !important;
	}
	.text-welcome {
		color: #AA9264;
	}
	.text-login {
		color: #57482C;
	}
	.bg-address {
		background: linear-gradient(180deg, #FBE2C0 2%, #FFFFFF 32px);
	}
	.sku_name_1 {
		border: 1px solid #EB5433;
		color: #EB5433;
		background: #FFF1EF;
	}
	.message-item.self .bubble {
		background-color: #FFE1CC;
		border-radius: 10px 2px 10px 10px;
		color: #3D3D3D;
	}
	.order_detail_bg {
		background: linear-gradient(180deg, #FFDFA8 0%, rgba(255, 255, 255, 0) 100%);
	}
	.order_detail_text {
		border-radius: 14px;
		background: linear-gradient(to top, #FFDFD5 0%, rgba(255, 255, 255, 1) 10px, rgba(255, 255, 255, 1) 100%);
		box-sizing: border-box;
		border: 1px solid #FFFFFF;
		backdrop-filter: blur(10px);
		padding: 18px;
		color: #745646;
	}
	.login-bg {
		background-image: url('/static/mp/login/bg.webp');
		// background-color: linear-gradient(270deg, #92CBCE 4%, #DBEBEB 98%);
		background-repeat: no-repeat;
		background-size: 100% auto;
	}
	.time_bg {
	    background: linear-gradient(180deg, #FFFFFF 35%, #FBE2C0 99%);
	}
	.bg-audit {
		background: #ECB4A8;
	}
	.sign_reward_box {
		background: linear-gradient(180deg, #FFEFCE 3%, #FFFFFF 49%);
	}
	.icon-car {
		background-image: url('/static/mp/order/car.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 18px;
		height: 18px;
	}
	.icon-address {
		background-image: url('/static/mp/order/address.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 18px;
		height: 18px;
	}
	.icon-trip-user {
		background-image: url('/static/icon/trip_user_mp.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 17px;
		height: 17px;
	}
	
	.login-left {
		background-image: url('/static/mp/login/1.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #958B8A;
	}
	
	.login-right {
		background-image: url('/static/mp/login/2.webp');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		color: #958B8A;
	}

	.icon_info {
		width: 18px;
		height: 18px;
		background-image: url('/static/icon/info.webp');
		background-size: 100% 100%;
		display: inline-block;
	}

	.more_box {
		width: 99px;
		height: 64px;
		background: #fff;
		border-radius: 12px;
		position: relative;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}
	
	/* 小三角形 */
	.more_box::before {
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

	.group-owner {
		background: #B3E5E8;
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
		background: #FFF3D3;
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

	.level {
		min-width: 45px;
		height: 14px;
		line-height: 14px;
		border-radius: 3px;
		font-size: 10px;
		padding: 0 2px;
		// box-sizing: border-box;
		text-align: center;
	}
	
	.store-count-detail {
		background: #B5C0D4;
		border-radius: 3px 8px 3px 3px;
		padding: 3px;
		position: absolute;
		top: 0;
		right: 0;
	}

	.u-text__value {
		line-height: 1;
		align-items: center;
	}
	
	.popup-box {
		width: 310px;
		min-height: 280px;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		padding-bottom: 26px;
	}
	
	.popup-img {
		height: 100px;
		margin: -50px auto 0;
	}
	
	.popup-title {
		font-size: 18px;
		font-weight: bold;
		line-height: 28px;
		color: #1A7E84;
	}
	
	.popup-text {
		line-height: 28px;
		font-size: 14px;
		padding: 20px;
	}
	
	.popup-buttons {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
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
		font-size: 16px !important;
		/* 标题字体 */
		font-weight: bold !important;
	}

	uni-modal .uni-modal__bd {
		color: $color-black;

		padding: 12px 25px 25px 25px;
	}

	uni-modal .uni-modal__ft {
		font-size: 16px !important;
		/* 内容字体 */
	}
	
	.u-image__loading, .u-image__error {
	    background-color: transparent !important;
	}
</style>