<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: rgba(51,51,51,1);" @tap="getback"></view>
			<view class="txt">实名认证</view>
		</view>
		<!-- <view class="loading" v-if="load_show">
			识别中...
		</view> -->
		<view class="main">
			<view class="import_txt">
				<view class="lab name">
					<view class="txt">姓名</view>
					<input class="input name" @input="Inputnamea" v-model="namea"  placeholder="请输入真实姓名" />
				</view>
				<view class="lab card">
					<view class="txt">身份证号码</view>
					<input class="input card" @input="Inputcard" v-model="cardId" placeholder="请输入真实身份证号"/>
				</view>
			</view>
			<view class="title">
				快速认证
			</view>
			<view class="import_photos">
				<view class="head" @tap="chooseImage" v-if="certified === 0">
					<view class="head_title">
						点击上传身份证
					</view>
					<view class="iconfont icon-xiangji1"></view>
				</view>
				<view class="photos">
					<image :src="pic" class="card_photo" v-if="show"></image>
					<view class="iconfont icon-chahao delete" @tap="del" v-if="authentication_show"></view>
				</view>
			</view>
		</view>
		<view class="tag">
			<view class="iconfont icon-guanyu" style="color: #3C7FFC;"></view>
			【提示】：您可以手动输入身份证号进行实名认证或使用快速认证上传身份证相片，我们将自动提取身份证信息，经您核对后进行实名认证。实名认证用于后续医保报销，请如实填写。
		</view>
		<view class="button">
			<button class="submit" @tap="submit" v-if="certified === 0">提交</button>
			<button class="authentication" v-if="certified === 1">认证通过</button>
		</view>
	</view>
</template>

<script>
	// import {
	// 	Authentication,
	// 	DeletePhoto,
	// 	GetInfo
	// } from "@/api/my.js";
	
	import http from "@/common/http.js";
	export default {
		data() {
			return {
				namea: '',
				cardId: '',
				pic: '',
				nub: '',
				show: false,
				authentication_show: false,
				certified:''
			}
		},
		onLoad() {
			const Logout = http('/yl/token/check', {
				option: {
				    method: 'get' 
				},
			    success: res => {
					if(res.code === 200){
						
					}else{
						uni.reLaunch({
							url: '../../login/login'
						});
					}
				},
				fail: err => {
					console.log(err)
				}
			})
			let that = this
			const GetInfo = http('/yl/user/getUserRealInfo/2', {
				option: {
					method : 'get',
				},
			    success: res => {
					if(res.code === 200){
						that.show = true
						that.authentication_show = true
						that.namea = res.data.real_name
						that.cardId = res.data.card_id
						that.pic = res.data.url
						// let userinfo =  JSON.parse(localStorage.getItem("user_data"))
						uni.getStorage({
						    key: 'user_data',
						    success: function (res) {
								let userdata =  res.data;
								that.certified = userdata.userInfo.certified
								if(that.certified === 0){
									that.submit_show = true
									that.authentication_show = false
								} else if(that.certified === 1){
									that.authentication_show = false
								}
							}
						});
						
						
					} else if(res.code === 500){
						uni.getStorage({
						    key: 'user_data',
						    success: function (res) {
						        // console.log(res.data);
								let userinfo =  res.data;
								that.certified = userinfo.userInfo.certified
								that.authentication_show = false
							}
						});	
					}
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
					uni.reLaunch({
						url: '../../login/login'
					});
				}
			})
		},
		methods: {
			//返回
			getback() {
				uni.switchTab({
					url: '../My'
				});
			},
			Inputname: function(event) {
				this.namea = event.target.value
			},
			Inputcard: function(event) {
				this.cardId = event.target.value
			},
			chooseImage() {
				var that = this;
				uni.chooseImage({
					count: 6,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						let resa = res
						uni.getStorage({
						    key: 'user_data',
						    success: function (res) {
								let info =  res;
								//图片的本地文件路径列表
								uni.uploadFile({
									// url: 'https://test.xiaoyiyiliao.com:8000/yl/user/upload/idCard',   //服务器地址
									// url: 'http://192.168.0.177:8001/yl/user/upload/idCard', //王健联调地址1
									url: 'http://192.168.0.215:8001/yl/user/upload/idCard', //梁林生联调地址2
									headers:{
										'Content-Type':'multipart/form-data'
									},
									filePath: resa.tempFilePaths[0],
									name: 'idCardImg',
									formData:{
										"_token": info.data.token,
										'test': 'test'
									},
									success: function (res) {
										let data = JSON.parse(res.data)
										that.authentication_show = true
										that.show = true
										if(data.code === 200){
											that.namea = data.data['姓名']
											that.cardId = data.data['公民身份号码']
											that.pic = data.url
											that.nub = true
										}
										if(data.code === 500){
											uni.showToast({
												title: data.msg,
												icon: "none"
											});
											that.nub = false
											that.pic = data.url
											if(data.msg === '重复上传身份证图片!'){
												that.nub = true
											}
										}
									},
									fail: () => {}
								})
							}
						});	
					}
				});
			},
			del(){
				// DeletePhoto({
				// 	filePath: this.pic
				// }).then(res => {
				// 	this.namea = ''
				// 	this.cardId = ''
				// 	this.pic = ''
				// 	this.show = false
				// 	this.authentication_show = false
				// })
				const DeletePhoto = http('/yl/user/delete/idCard', {
				    data: {
				        filePath: this.pic
				    },
				    success: res => {
						this.namea = ''
						this.cardId = ''
						this.pic = ''
						this.show = false
						this.authentication_show = false
					},
					fail: err => {
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
						uni.reLaunch({
							url: '../../login/login'
						});
					}
				})
			},
			
			submit() {
				let that = this
				const Authentication = http('/yl/user/saveUserRealInfo', {
				    data: {
				        realName: that.namea,
				        userType: 2,
				        cardId: that.cardId
				    },
				    success: res => {
						if(res.code === 200){
							uni.removeStorage('user_data');
							uni.setStorage({
								key: 'user_data',
								data: res.data, //原来是currentUser现在换成data统一数据在data中
								success:(()=> {
									uni.getStorage({
									    key: 'user_data',
									    success: function (res) {
									        let userinfo = res;
											that.certified = userinfo.data.userInfo.certified
											that.authentication_show = false
											that.show = true
											that.certified = 1
									    }
									});
								})
							});
						}
					},
					fail: err => {
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
						uni.reLaunch({
							url: '../../login/login'
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import url("../../../static/iconfont/iconfont.css");
	.content {
		width: 100%;
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
				top: 55rpx;
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
		.loading{
			width: 100%;
			height: 100%;
			background: #eee;
			text-align: center;
			line-height: 650rpx;
			font-size: 40rpx;
			position: absolute;
			color: #C8C7CC;
			z-index: 10000;
		}
		.main {
			width: 90%;
			height: 650rpx;
			margin-top: 20rpx;
			border: #eee dashed 2rpx;
			border-radius: 15rpx;
			.import_txt {
				width: 95%;
				height: 170rpx;
				margin: 10rpx auto;

				.lab {
					width: 100%;
					height: 70rpx;
					border-bottom: 2rpx solid rgba(213, 217, 225, 1);

					.txt {
						width: 30%;
						height: 60rpx;
						float: left;
						line-height: 60rpx;
						text-align: left;
						font-size: 28rpx;
						font-weight: 600;
						font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
					}
					.input {
						width: 70%;
						height: 60rpx;
						float: left;
						background-color: #FFF !important;
						font-size: 24rpx;
						.uni-input-input {
							background-color: #FFF !important;
						}
					}
				}
			}

			.title {
				font-size: 36rpx;
				margin-left: 20rpx;
				font-weight: 600;
			}

			.import_photos {
				width: 95%;
				height: 60%;
				border: #eee solid 2rpx;
				border-radius: 15rpx;
				margin: 10rpx auto;
				.head {
					width: 90%;
					height: 40rpx;
					line-height: 40rpx;
					margin: 10rpx auto;
					.head_title {
						font-size: 30rpx;
						color: #B2B2B2;
						float: left;
						margin-right: 20rpx;
					}
					.iconfont {
						float: left;
						font-size: 38rpx;
						color: #B2B2B2;
					}
				}
				.photos{
					width: 90%;
					height: 300rpx;
					margin:  5rpx auto;
					// background: #09BB07;
					position: relative;
					.card_photo{
						width: 92%;
						height: 90%;
						background-size: cover;
						// background: #007AFF;
						margin-top: 20rpx;
						margin-left: 20rpx;
					}
					.delete{
						font-size: 40rpx;
						color: #FF3333;
						position: absolute;
						top: 5rpx;
						right: 10rpx;
					}
				}
			}
		}

		.tag {
			width: 90%;
			font-size: 24rpx;
			color: #8F8F94;
			margin-top: 15rpx;

			.iconfont {
				float: left;
				font-size: 30rpx;
				font-weight: 600;
			}
		}

		.button {
			width: 100%;
			height: 150rpx;
			margin-top: 20rpx;
			.submit {
				width: 680rpx;
				background: #169bd5;
				color: #fff;
				font-size: 36rpx;
			}
			.authentication{
				width: 680rpx;
				background: #1AAD19;
				color: #fff;
				font-size: 36rpx;
			}
		}
	}
</style>
