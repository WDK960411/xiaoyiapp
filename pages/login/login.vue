<template>
	<view class="content">
		<view class="logo">
			<image class="logo" src="../../static/img/xiaoyilogo.png" mode=""></image>
		</view>
		<view class="head-title">
			小医在诊用户登入
		</view>
		<view class="main">
			<view class="uni-form-item uni-column" >
				<view class="iconfont icon-shoujihao1"></view>
				<input class="input phone" @input="Inputphone" v-model="phone" type="number"  placeholder="请输入手机号" />
			</view>
			<view class="uni-form-item uni-column">
				<view class="iconfont icon-zu"></view>
				<input class="input password" @input="Inputpassword" v-model="password" password type="text" placeholder="请输入密码" />
			</view>
			<view class="uni-form-item uni-column"  v-if="show">
				<input class="input verification" @input="Inputverification"  v-model="verification" type="text" placeholder="请输入图形验证码" />
				<view class="verification_img" @tap="regain">
					<image :src="'data:image/png;base64,'+base64" mode="" class="img"></image>
				</view>
			</view>
			<checkbox-group class="operation">
				<label>
					<view class="txt register" style="float: left;" @tap="register">
						免费注册
					</view>
					<view class="txt reset_password" style="float: right;" @tap="reset_password">
						忘记密码
					</view>
				</label>
			</checkbox-group>
			<view class="button">
				<button  class="enter" @tap="enter">登录</button>
			</view>
		</view>
		<view class="cut_off_wire">
			<view class="cut_off_txt">
				第三方登录
			</view>
		</view>
		<view class="thirdparty">
			<view class="box wechat" @tap="gowechat">
				<image class="logo wechat_logo" src="../../static/img/wechat.png" mode=""></image>
				<span class="txt">微信登录</span>
			</view>
			<view class="box Alipay" @tap="goAlipay">
				<image class="logo Alipay_logo" src="../../static/img/Alipay.png" mode=""></image>
				<span class="txt" style="margin-top: 15rpx;">支付宝登录</span>
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	Login,
	// 	Regain
	// } from "@/api/login.js";
	import http from '@/common/http.js'  //uni-app request封装
	export default {
		components: {
			
		},
		onLoad() {

		},
		data() {
			return {
				// phone:'',
				// password:'',
				phone:'17606419601',//仅用于联调 手机号写死
				password:'wdk123456',//仅用于联调 密码写死
				base64: '',
				show:false,
				verification:'',
				uuid: '',
				type:2
			}
		},
		methods: {
			Inputphone:function(event) {
				this.phone = event.target.value
			},
			Inputpassword:function(event) {
				this.password = event.target.value
			},
			Inputverification:function(event) {
				this.verification = event.target.value
			},
			//免费注册
			register(){
				uni.reLaunch({
					url: './Model/register',
				});
			},
			//忘记密码
			reset_password(){
				uni.reLaunch({
					url: './Model/reset_password',
				});
			},
			//登入
			enter(){
				if(this.phone === ''&&this.password === ''){
					uni.showToast({
						title: '请输入手机号和密码',
						icon: "none"
					});
				}else{
					if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.phone))) {
						uni.showToast({
							title: '手机号输入有误',
							icon: "none"
						});
					} else {
						const requestTask = http('/yl/login', {
						    data: {
						        mobile: this.phone,
						        password:this.password,
						        type:this.type,
						        code:this.verification,
						        uuid:this.uuid
						    },
						    option: {
						        hideLoading: false, 
						        hideMsg: true, 
						        method: 'post' 
						    },
						    success: res => {
						        // console.log('res',res)
								switch(res.code) {
								    case 200:
								        uni.reLaunch({
								        	url: '../Home/home',
								        });
								        uni.setStorage({
								        	key: 'user_data',
								        	data: res.data,
								        	success:(()=> {
								        	   
								        	})
								        });
										uni.setStorage({
											key: '_token',
											data: res.data.token,
											success:(()=> {
											   
											})
										});
								        break;
								    case 1:
								        uni.showToast({
								        	title: '该手机尚未注册，请先注册',
								        	icon: "none"
								        });
										this.phone = '',
										this.password = ''
								        break;
									case 501:	
										uni.showToast({
											title: '手机号或密码输入错误',
											icon: "none"
										});
										this.show = true
										this.base64 = res.data.img
										this.uuid = res.data.uuid
										this.password = ''
										break;
									case 500:
										uni.showToast({
											title: res.msg,
											icon: "none"
										});
										this.verification = ''
										break;
								}
						    },
							fail: err => {
								console.log(err)
							}
						})
						// Login({
						// 	mobile: this.phone,
						// 	password:this.password,
						// 	type:this.type,
						// 	code:this.verification,
						// 	uuid:this.uuid
						// }).then(res => {
						// 	switch(res.code) {
						// 	    case 200:
						// 	        uni.reLaunch({
						// 	        	url: '../Home/index',
						// 	        });
						// 	        uni.setStorage({
						// 	        	key: 'user_data',
						// 	        	data: res.data,
						// 	        	success:(()=> {
							        	   
						// 	        	})
						// 	        });
						// 			uni.setStorage({
						// 				key: '_token',
						// 				data: res.data.token,
						// 				success:(()=> {
										   
						// 				})
						// 			});
						// 	        break;
						// 	    case 1:
						// 	        uni.showToast({
						// 	        	title: '该手机尚未注册，请先注册',
						// 	        	icon: "none"
						// 	        });
						// 			this.phone = '',
						// 			this.password = ''
						// 	        break;
						// 		case 501:	
						// 			uni.showToast({
						// 				title: '手机号或密码输入错误',
						// 				icon: "none"
						// 			});
						// 			this.show = true
						// 			this.base64 = res.data.img
						// 			this.uuid = res.data.uuid
						// 			this.password = ''
						// 			break;
						// 		case 500:
						// 			uni.showToast({
						// 				title: res.msg,
						// 				icon: "none"
						// 			});
						// 			this.verification = ''
						// 			break;
						// 	}
						// })
					}
				}

				//测试 - 无验证直接登入
				// uni.reLaunch({
				// 	url: '../Home/index',
				// });
			},
			//重新获取验证码
			regain(){
				// Regain({

				// }).then(res => {
				// 	if(res.code === 200){
				// 		this.base64 = res.data.img
				// 		this.uuid = res.data.uuid
				// 	}
				// })
				const Regain = http('/yl/captcha/create', {
					option: {
					    method: 'get' 
					},
				    success: res => {
						if(res.code === 200){
							this.base64 = res.data.img
							this.uuid = res.data.uuid
						}
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			
			//支付宝登录
			goAlipay(){ 
				uni.showToast({
					title: '暂未开发',
					icon: "none"
				}); 
			},
			gowechat(){
				uni.showToast({
					title: '暂未开发',
					icon: "none"
				});
			}
		}
	}
</script>

<style lang="scss">
	//字体图标
	@import url("../../static/iconfont/iconfont.css");
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.logo{
			width: 180rpx;
			height: 180rpx;
			margin-top: 40rpx;
		}
		.head-title{
			width: 310rpx;
			height: 120rpx;
			margin-top: 90rpx;
			font-weight: 600;
			font-size: 39rpx;
		}
		.main{
			margin-top: 10rpx;
			width: 650rpx;
			// height: 550rpx;
			position: relative;
			.operation{
				margin-top: 40rpx;
				.txt{
					font-size: 28rpx;
					margin-top: 6rpx;
					color:rgb(13,163,180);
					font-weight: 500;
				}
			}
			.icon-shoujihao1{
				width: 10%;
				height: 78rpx;
				line-height: 80rpx;
				position: absolute;
				top: 0rpx;
				left: 0rpx;
				font-size: 36rpx;
				background: #fff;
				color: #0A98D5;
				border-bottom: 2rpx solid rgba(213,217,225,1);
			}
			.icon-zu{
				width: 10%;
				height: 78rpx;
				line-height: 80rpx;
				position: absolute;
				top: 80rpx;
				left: 0rpx;
				font-size: 32rpx;
				background: #fff;
				color: #0A98D5;
				border-bottom: 2rpx solid rgba(213,217,225,1);
			}
			.input{
				height: 80rpx;
				border-bottom: 2rpx solid rgba(213,217,225,1);
				background-color: #FFF !important;
				padding-left: 70rpx;
				box-sizing: border-box;
				.uni-input-input{
					background-color: #FFF !important;
				}
			}
			.verification{
				width: 50%;
			}
			.verification_img{
				width: 45%;
				height: 81rpx;
				// background: rgba(213,217,225,1);
				float: right;
				margin-top: -81rpx;
				.img{
					width: 100%;
					height: 100%;
					background-size: cover;
				}
			}
			.button{
				margin-top: 150rpx;
				.enter{
					width: 640rpx;
					background:#169bd5;
					color: #fff;
					font-size: 36rpx;
				}
			}
		}
		.cut_off_wire{
			width: 60%;
			height: 2rpx;
			background: #333333;
			margin: 80rpx 0rpx 0rpx 0rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.cut_off_txt{
				width: 50%;
				height: 50rpx;
				background: #fff;
				text-align: center;
				font-size: 36rpx;
			}
		}
		.thirdparty{
			width: 600rpx;
			height: 250rpx;
			// margin-top: 10rpx ;
			.box{
				width: 40%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
			.wechat{
				float: left;
				margin-left: 8%;
				.wechat_logo{
					width: 130rpx;
					height: 130rpx;
					float: left;
				}
			}
			.Alipay{
				float: right;
				margin-right: 8%;
				.Alipay_logo{
					width: 105rpx;
					height: 105rpx;
					float: left;
				}
			}
		}
	}
</style>
