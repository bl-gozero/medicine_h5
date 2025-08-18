<script>
	export default {
		onLaunch: function() {
		},
		onShow: function() {
		},
		onHide: function() {
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
	::v-deep .uni-input-input {
		font-size: 12px;
		color: #3d3d3d;
		font-weight: 400;
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
</style>
