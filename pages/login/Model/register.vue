<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: rgba(51,51,51,1);" @tap="getback"></view>
			<view class="txt">免费注册</view>
		</view>
		<view class="logo">
			<image class="logo" src="../../../static/img/xiaoyilogo.png" mode=""></image>
		</view>
		<view class="head-title">
			小医在诊用户注册
		</view>
		<view class="main">
			<view class="register_box">
				<view class="iconfont icon-shoujihao1"></view>
				<input class="input phone" @input="Inputphone" v-model="phone" placeholder="请输入手机号" />
			</view>
			<view class="register_box">
				<view class="iconfont icon-yanzhengma"></view>
				<input class="input verification_code" @input="Inputverification" v-model="phone_verification" type="text" placeholder="请输入验证码" />
				<view class="verification get" v-if="get_show" @tap="get">{{btn_value}}</view>
				<view class="verification time" v-if="time_show">
					{{time}}s后重新获取
				</view>
			</view>
			<view class="register_box">
				<view class="iconfont icon-zu"></view>
				<input class="input password" @input="Inputpassword" v-model="password" password type="text" placeholder="请输入密码" />
				<view class="iconfont icon-tishi1" @tap="tag"></view>
			</view>
			<view class="register_box">
				<view class="iconfont icon-zu"></view>
				<input class="input password2" @input="Inputpassword2" v-model="password2" password type="text" placeholder="请确认密码" />
			</view>
			<checkbox-group class="checked_box">
				<label>
					<checkbox class="checked_option" :checked="checked" color="#2F6DE0" @tap="change" />
					<view class="checked_txt" @tap="agreement">
						已查阅并同意《用户协议与隐私政策》的内容
					</view>
				</label>
			</checkbox-group>
		</view>
		<view class="button">
			<button class="register" @tap="register">注册</button>
		</view>
	</view>
</template>

<script>
	// import {
	// 	getCode,
	// 	Register
	// } from "@/api/login.js";
	import http from '@/common/http.js'  //uni-app request封装
	export default {
		components: {

		},
		onLoad() {

		},
		data() {
			return {
				phone: '',
				password: '',
				password2: '',
				phone_verification: '',
				btn_value: '获取验证码',
				checked: false,
				get_show: true,
				time_show: false,
				time: '',
				type: 2
			}
		},
		methods: {
			//返回上一页
			getback() {
				uni.navigateTo({
					url: '../login'
				});
			},
			Inputphone: function(event) {
				this.phone = event.target.value
			},
			Inputpassword: function(event) {
				this.password = event.target.value
			},
			Inputpassword2: function(event) {
				this.password2 = event.target.value
			},
			Inputverification: function(event) {
				this.phone_verification = event.target.value
			},
			//用户协议
			change() {
				this.checked = !this.checked
			},
			agreement() {
				uni.redirectTo({
					url: './user_agreement'
				});
			},
			tag(){
				uni.showToast({
					title: '密码格式：英文字母加数字组合大于6位',
					icon: "none",
					duration: 2500
				});
			},
			//获取验证码
			get() {
				if (this.phone === '') {
					uni.showToast({
						title: '请输入手机号码',
						icon: "none"
					});
				} else {
					// getCode({
					// 	phone : this.phone,
					// }).then(res => {
					// 	// console.log(res)
					// })
					const getCode = http('/yl/sms/reg', {
					    data: {
					        phone : this.phone,
							type: 2
					    },
					    success: res => {
							if(res.code === 200){
								this.get_show = false
								this.time_show = true
								this.time = 60
								let timer = setInterval(() => {
									this.time--;
									if (this.time < 1) {
										clearInterval(timer);
										this.time = 0
										this.get_show = true
										this.time_show = false
										this.btn_txt = '重新获取'
									}
								}, 1000)
							}
							if(res.code === 500){
								uni.showToast({
									title: '此手机号已经注册',
									icon: "none"
								});
							}
						},
						fail: err => {
							
						}
					})
				}
			},
			//注册
			register() {
				if (this.checked === false) {
					uni.showToast({
						title: '请先阅读并勾选用户协议',
						icon: "none"
					});
				} else {
					if (this.phone === '') {
						uni.showToast({
							title: '请输入手机号',
							icon: "none"
						});
					} else {
						if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))) {
							uni.showToast({
								title: '手机号输入有误',
								icon: "none"
							});
						} else {
							if (this.password === '') {
								uni.showToast({
									title: '请输入密码',
									icon: "none"
								});
							} else{
								if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,}$/.test(this.password))) {
									uni.showToast({
										title: '密码格式不正确',
										icon: "none"
									});
									this.password = '',
									this.password2 = ''
								} else {
									if (this.password !== this.password2) {
										uni.showToast({
											title: '两次密码输入不一致',
											icon: "none"
										});
										this.password = '',
										this.password2 = ''
									} else {
										if(this.phone_verification === ''){
											uni.showToast({
												title: '请输入正确验证码',
												icon: "none"
											});
											this.phone_verification = ''
										}else{
											const Register = http('/yl/user/register', {
											    data: {
											        mobile: this.phone,
											        password:this.password,
											        code:this.phone_verification,
											        userType:this.type
											    },
											    success: res => {
													switch(res.code) {
														case 200:
														uni.showToast({
															title: '恭喜您注册成功',
															icon: "none"
														});
														uni.reLaunch({
															url: '../login'
														});
														this.phone = '',
														this.password = '',
														this.password2 = '',
														this.phone_verification = ''
														break;
														case 500:
															uni.showToast({
																title: res.msg,
																icon: "none"
															});
															this.password = '',
															this.password2 = '',
															this.phone_verification = ''
														break;
													}
												},
												fail: err => {
													console.log(err)
												}
											})
										}
									}
								}
							}
						}
					}
				}
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
			border-bottom: 2rpx solid #eee;
			position: relative;
			.iconfont {
				font-size: 40rpx;
				color: rgba(51, 51, 51, 1);
				float: left;
				position: absolute;
				top: 60rpx;
				left: 15rpx;
			}

			.txt {
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: rgba(51, 51, 51, 1);
				text-align: center;
				margin-top: 55rpx;
				margin-left: -15rpx;
			}
		}

		.logo {
			width: 180rpx;
			height: 180rpx;
			margin-top: 10rpx;
		}

		.head-title {
			width: 310rpx;
			height: 120rpx;
			margin-top: 30rpx;
			font-weight: 600;
			font-size: 39rpx;
		}

		.main {
			width: 650rpx;
			.register_box{
				width: 100%;
				height: 85rpx;
				border-bottom: 2rpx solid rgba(213, 217, 225, 1);
				box-sizing: border-box;
				position: relative;
				.input {
					height: 80rpx;
					background-color: #FFF !important;
					padding-left: 70rpx;
					box-sizing: border-box;
					.uni-input-input {
						background-color: #FFF !important;
					}
				}
				.icon-shoujihao1, .icon-yanzhengma, .icon-zu{
					width: 10%;
					height: 84rpx;
					line-height: 80rpx;
					position: absolute;
					top: 0rpx;
					left: 0rpx;
					font-size: 36rpx;
					background: #fff;
					color: #0A98D5;
					border-bottom: 2rpx solid rgba(213,217,225,1);
					box-sizing: border-box;
				}
				// .icon-yanzhengma{
				// 	width: 10%;
				// 	height: 84rpx;
				// 	line-height: 80rpx;
				// 	position: absolute;
				// 	top: 0rpx;
				// 	left: 0rpx;
				// 	font-size: 36rpx;
				// 	background: #fff;
				// 	color: #0A98D5;
				// 	border-bottom: 2rpx solid rgba(213,217,225,1);
				// 	box-sizing: border-box;
				// }
				// .icon-zu{
				// 	width: 10%;
				// 	height: 84rpx;
				// 	line-height: 80rpx;
				// 	position: absolute;
				// 	top: 0rpx;
				// 	left: 0rpx;
				// 	font-size: 32rpx;
				// 	background: #fff;
				// 	color: #0A98D5;
				// 	border-bottom: 2rpx solid rgba(213,217,225,1);
				// 	box-sizing: border-box;
				// }
				.icon-tishi1{
					font-size: 36rpx;
					position: absolute;
					top: 25rpx;
					right: 5rpx;
					color: #007AFF;
				}
				.verification_code {
					width: 65%;
				}
				
				.verification {
					width: 34%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: right;
					float: right;
					margin-top: -81rpx;
				}
				
				.get {
					font-size: 30rpx;
					color: #4f9da2;
				}
				
				.time {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
					border: 2rpx solid rgba(213, 217, 225, 1);
					box-sizing: border-box;
					border-radius: 10rpx;
					color: rgba(155, 217, 225, 1);
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
					color: #169bd5;
					font-weight: 500;
				}
			}
		}

		.button {
			margin-top: 100rpx;

			.register {
				width: 640rpx;
				background: #169bd5;
				color: #fff;
				font-size: 36rpx;
			}
		}
	}
</style>
