<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">支付</view>
		</view>
		<view class="main">
			<view class="doctor_info">
				<view class="doctors_photo">
					<image :src="doctor_info.avatar" class="photos"></image>
				</view>
				<view class="doctor_content">
					<view class="info_one">
						<view class="doctor_name">
							{{doctor_info.realName}}
						</view>
						<view class="doctor_rank">
							{{doctor_info.title}}
						</view>
					</view>
					<view class="info_two">
						<view class="doctor_department">
							{{doctor_info.subject}}
						</view>
						<view class="doctor_hospital">
							{{doctor_info.hospital}}
						</view>
					</view>
					<view class="info_three">
						擅长：{{doctor_info.goodAt}}
					</view>
				</view>
			</view>
			<view class="describe">
				<view class="describe_info">
					<view class="title">
						症状描述：
					</view>
					<view class="txt">
						{{symptom}}
					</view>
				</view>
				<view class="describe_info">
					<view class="title">
						患病时长：
					</view>
					<view class="txt">
						{{duration}}
					</view>
				</view>
				<view class="describe_info">
					<view class="title">
						服药情况：
					</view>
					<view class="txt">
						{{drug}}
					</view>
				</view>
			</view>
			<view class="tag">
				<view class="tag_title">
					权益保障
				</view>
				<view class="tag_txt">
					医生超过48小时未回复将自动退款
				</view>
			</view>
			<checkbox-group class="checked_box">
				<label>
					<checkbox class="checked_option" :checked="checked" color="#2F6DE0" @tap="change" />
					<view class="checked_txt" @tap="agreement">
						我确认遵守问诊协议
					</view>
				</label>
			</checkbox-group>
		</view>
		<view class="footer">
			<view class="price">
				<view class="price_left">
					本次问诊：
				</view>
				<view class="price_right">
					￥{{price}}
				</view>
			</view>
			<view class="pay" @tap="pay">立即支付</view>
		</view>
	</view>
</template>

<script>
	import http from '@/common/http.js' //uni-app request封装
	export default {
		components: {

		},
		data() {
			return {
				doctor_info: [],
				symptom: '',
				duration: '',
				drug: '',
				checked: false,
				pay_show: true,
				again_show: false,
				price: '',
				doctor_id: '', //医生id
				inquiryId: '' //问诊id
			}
		},
		onLoad() {
			let that = this
			uni.getStorage({
				key: 'doctor_info',
				success: function(res) {
					// console.log(res.data);
					that.doctor_info = res.data;
				}
			});
			uni.getStorage({
				key: 'doctor_id',
				success: function(res) {
					// console.log(res.data);
					that.doctor_id = res.data;
				}
			});
			uni.getStorage({
				key: 'inquiry_id',
				success: function(res) {
					// console.log(res.data);
					that.inquiryId = res.data;
				}
			});
			uni.getStorage({
				key: 'doctor_price',
				success: function(res) {
					// console.log(res.data);
					that.price = res.data;
				}
			});
			const GetDraft = http('/yl/inquiry/draft', {
				option:{
					method: 'get'
				},
			    success: res => {
					switch(res.code) {
					    case 200:
						// console.log(res)
						if(res.data === null){
							
						} else {
							that.symptom = res.data.contentMap.symptom 
							that.duration = res.data.contentMap.timeLength 
							that.drug = res.data.contentMap.medic 
						}
						break;
						case 403:
						uni.showToast({
							title: '登录过期，请重新登录',
							icon: "none"
						});
						uni.reLaunch({
							url: '../../login/login'
						});
						break;
						case 500:
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
						break;
					}	
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			})
		},
		methods: {
			//返回
			getback() {
				uni.redirectTo({
					url: './SelectPatient'
				});
			},
			change() {
				this.checked = !this.checked
			},
			agreement() {
				uni.redirectTo({
					url: './user_agreement'
				});
			},
			pay() {
				if (this.checked !== true) {
					uni.showToast({
						title: '请勾选问诊协议',
						icon: "none"
					});
				} else {
					const Pay = http('/yl/order/createInquiryOrder', {
						data: {
							id: this.inquiryId,
							inquiryPrice: this.price,
							CPEType: 'patient',
							payType: 1
						},
						success: res => {
							switch (res.code) {
								case 200:
									let orderInfo = {
										'appid': res.data.appId,
										'noncestr': res.data.nonceStr,
										'package': res.data.packageValue,
										'partnerid': res.data.partnerId,
										'prepayid': res.data.prepayId,
										'sign': res.data.sign,
										'timestamp': res.data.timeStamp
									}
									uni.requestPayment({
										provider: 'wxpay',
										signType: 'MD5',
										orderInfo: orderInfo, //微信、支付宝订单数据
										success: function(res) {
											console.log('success:' + JSON.stringify(res));
										},
										fail: function(err) {
											console.log('fail:' + JSON.stringify(err));
											const WaivePay = http('/yl/pay/giveUpPay', {
												data: {
													prepayId: orderInfo.prepayid
												},
												success: res => {
													uni.reLaunch({
														url: '../../My/Model/Myorder'
													});
												},
												fail: err => {
													uni.showToast({
														title: res.msg,
														icon: "none"
													});
												}
											})
										}
									});
									break;
								case 403:
									uni.showToast({
										title: '登录过期，请重新登录',
										icon: "none"
									});
									uni.reLaunch({
										url: '../../login/login'
									});
									break;
								case 500:
									uni.showToast({
										title: res.msg,
										icon: "none"
									});
									// this.pay_show = false
									// this.again_show = true
									break;
							}
						},
						fail: err => {
							uni.showToast({
								title: res.msg,
								icon: "none"
							});
						}
					})
				}

			},
			cancelpay() {
				uni.redirectTo({
					url: './SelectPatient'
				});
			},
			continuepay() {
				// if (this.checked !== true) {
				// 	uni.showToast({
				// 		title: '请勾选问诊协议',
				// 		icon: "none"
				// 	});
				// } else {
				// 	const Pay = http('/order/order/createInquiryOrder', {
				// 		data: {
				// 			id: this.inquiryId,
				// 			inquiryPrice: this.price,
				// 			CPEType: 'patient',
				// 			payType: 1
				// 		},
				// 		success: res => {
				// 			switch (res.code) {
				// 				case 200:
				// 					uni.showToast({
				// 						title: res.data,
				// 						icon: "none"
				// 					});
				// 					let orderInfo = {
				// 						'appid': res.data.appId,
				// 						'noncestr': res.data.nonceStr,
				// 						'package': res.data.packageValue,
				// 						'partnerid': res.data.partnerId,
				// 						'prepayid': res.data.prepayId,
				// 						'sign': res.data.sign,
				// 						'timestamp': res.data.timeStamp
				// 					}
				// 					uni.requestPayment({
				// 						provider: 'wxpay',
				// 						signType: 'MD5',
				// 						orderInfo: orderInfo, //微信、支付宝订单数据
				// 						success: function(res) {
				// 							alert('success:' + JSON.stringify(res));
				// 						},
				// 						fail: function(err) {
				// 							uni.showToast({
				// 								title: JSON.stringify(err),
				// 								icon: "none"
				// 							});
				// 							console.log('fail:' + JSON.stringify(err))
				// 							alert('fail:' + JSON.stringify(err));
				// 						}
				// 					});
				// 					break;
				// 				case 403:
				// 					uni.showToast({
				// 						title: '登录过期，请重新登录',
				// 						icon: "none"
				// 					});
				// 					uni.reLaunch({
				// 						url: '../../login/login'
				// 					});
				// 					break;
				// 				case 500:
				// 					uni.showToast({
				// 						title: res.msg,
				// 						icon: "none"
				// 					});
				// 					this.pay_show = false
				// 					this.again_show = true
				// 					break;
				// 			}
				// 		},
				// 		fail: err => {
				// 			uni.showToast({
				// 				title: res.msg,
				// 				icon: "none"
				// 			});
				// 		}
				// 	})
				// }
			}
		}
	}
</script>

<style lang="scss">
	@import url("../../../static/iconfont/iconfont.css");

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.top {
			width: 100%;
			height: 125rpx;
			background: #4f9da2;
			position: relative;

			.iconfont {
				font-size: 40rpx;
				color: #fff;
				float: left;
				position: absolute;
				top: 55rpx;
				left: 15rpx;
			}

			.txt {
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #fff;
				text-align: center;
				margin-top: 55rpx;
				margin-left: -15rpx;
			}
		}

		.main {
			width: 95%;
			margin-top: 20rpx;
			.doctor_info{
				width: 100%;
				height: 160rpx;
				margin: 0 auto;
				position: relative;
				z-index: 995;
				border-radius: 10rpx;
				// border: 2rpx #00B26A solid;
				box-sizing: border-box;
				.doctors_photo{
					width: 140rpx;
					height: 140rpx;
					border: #ccc 2rpx solid;
					background-size: cover;
					// margin: 20rpx 15rpx;
					position: absolute;
					top: 10rpx;
					left: 10rpx;
					box-sizing: border-box;
					.photos{
						width: 135rpx;
						height:135rpx;
						background-size: cover;
					}
				}
				.doctor_content{
					width: 540rpx;
					height: 140rpx;
					box-sizing: border-box;
					position: absolute;
					top: 10rpx;
					left: 160rpx;
					.info_one{
						width: 80%;
						height: 35rpx;
						font-style: normal;
						font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
						float: left;
						.doctor_name{
							float: left;
							font-size: 26rpx;
							font-weight: 600;
							margin-right: 10rpx;
						}
						.doctor_rank{
							float: left;
							font-size: 22rpx;
							font-weight: 600;
						}
					}
					.info_two{
						width: 80%;
						height: 30rpx;
						font-style: normal;
						font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
						float: left;
						.doctor_department, .doctor_hospital{
							float: left;
							font-size: 24rpx;								
							font-weight: 600;
							margin-right: 20rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;    
							-webkit-line-clamp: 1;    
							overflow: hidden;
						}
					}
					.info_three{
						width: 100%;
						height: 60rpx;
						font-style: normal;
						font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
						font-size: 22rpx;
						display: -webkit-box;    
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 2;    
						overflow: hidden;
						margin-top: 5rpx;
						float: left;
					}
				}
			}
			

			.describe {
				width: 100%;
				height: 380rpx;
				// border-bottom: 3rpx #BEBEBE solid;
				// border-left: 3rpx #BEBEBE solid;
				// border-right: 3rpx #BEBEBE solid;
				// border-radius: 0rpx 0rpx 10rpx 10rpx;
				box-sizing: border-box;
				// margin-top: 10rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 10rpx;

				.describe_info {
					width: 100%;
					height: 120rpx;

					.title {
						width: 100%;
						height: 40rpx;
						font-size: 28rpx;
						font-weight: 600;
					}

					.txt {
						width: 100%;
						height: 70rpx;
						font-size: 22rpx;
						margin-top: 10rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						color: #888;
					}
				}
			}

			.tag {
				width: 100%;
				height: 80rpx;
				margin-top: 10rpx;
				border-bottom: 2rpx #BEBEBE solid;
				padding: 0rpx 10rpx;
				box-sizing: border-box;
				margin-top: 20rpx;

				.tag_title {
					width: 20%;
					height: 80rpx;
					font-size: 28rpx;
					line-height: 80rpx;
					text-align: left;
					float: left;
					font-weight: 600;
				}

				.tag_txt {
					width: 80%;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 22rpx;
					text-align: right;
					float: left;
					color: #6D6D72;
				}
			}

			.checked_box {
				margin-top: 20rpx;

				.checked_option {
					transform: scale(0.7);
					float: left;
					color: rgba(47, 109, 224, 1);
				}

				.checked_txt {
					font-size: 28rpx;
					float: left;
					margin-top: 6rpx;
					color: #4f9da2;
					font-weight: 500;
				}
			}
		}

		.footer {
			width: 100%;
			height: 130rpx;
			position: fixed;
			bottom: 0rpx;
			border-top: 2rpx #eee solid;

			.price {
				width: 40%;
				height: 80rpx;
				line-height: 80rpx;
				float: left;
				margin-top: 10rpx;

				.price_left {
					width: 50%;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 28rpx;
					text-align: center;
					float: left;
					color: #8F8F94;
				}

				.price_right {
					width: 50%;
					height: 80rpx;
					line-height: 80rpx;
					font-size: 30rpx;
					text-align: center;
					color: #09BB07;
					float: left;
					font-weight: 600;
				}
			}

			.pay {
				width: 60%;
				height: 80rpx;
				// background: #4f9da2;
				background: #04BE02;
				color: #fff;
				font-size: 30rpx;
				line-height: 80rpx;
				border-radius: 50rpx;
				margin-top: 10rpx;
				float: right;
				border-style: none;
				text-align: center;
			}
		}
	}
</style>
