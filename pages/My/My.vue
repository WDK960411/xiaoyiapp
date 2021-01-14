<template>
	<view class="content">
		<view class="headtitle">我的</view>
		<view class="head"  @tap="modifieddata">
		<!-- <view class="head"  @tap="modifieddata" v-if="head_show"> -->
			<view class="imghead">
				<image class="img" :src="avatar" mode=""></image>
			</view>
			<view class="data">
				<view class="name">
					{{name}}
				</view>
				<view class="post">
					{{phone}}
				</view>
			</view>
			<image class="right" src="../../static/img/right.png" mode=""></image>
		</view>
		<!-- <view class="head_login" v-if="!head_show">亲，您还未登录</view> -->
		<view class="mymain">
			<ul class="option">
				<li class="list help" @tap="Info">
					<view class="iconfont icon-xiaoxi1" style="color: #3C7FFC;"></view>
					<view class="txt">消息（历史消息及未读所有消息）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
				<li class="list authentication" @tap="Authentication">
					<view class="iconfont icon-shimingrenzheng" style="color: #3C7FFC;"></view>
					<!-- <view class="txt" v-if="attestation === 0 || token === ''">实名认证（请实名认证）</view> -->
					<view class="txt" v-if="attestation === 0">实名认证（请实名认证）</view>
					<view class="txt" v-if="attestation === 1">实名认证（已实名认证）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
				<li class="list help" @tap="Order">
					<view class="iconfont icon-dingdan" style="color: #3C7FFC;"></view>
					<view class="txt">我的订单（已经支付服务订单记录）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
				<li class="list help" @tap="MyDoctor">
					<view class="iconfont icon-yisheng" style="color: #3C7FFC;"></view>
					<view class="txt">我的医生（曾咨询和交流过的医生）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
				<li class="list help" @tap="Collect">
					<view class="iconfont icon-shoucang" style="color: #3C7FFC;"></view>
					<view class="txt">我的收藏（我收藏的专家医生）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
				<li class="list help" @tap="Test">
					<view class="iconfont icon-jianyan" style="color: #3C7FFC;"></view>
					<view class="txt">我的检验（已检验和在途检验记录）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
				<li class="list help" @tap="Invoice">
					<view class="iconfont icon-icon_xinyong_xianxing_jijin-" style="color: #3C7FFC;"></view>
					<view class="txt">电子发票（已经支付的记录，可开具发票）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
				<li class="list help" @tap="Report">
					<view class="iconfont icon-bingli" style="color: #3C7FFC;"></view>
					<view class="txt">我的病例（包含多项病历记录）</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li>
<!-- 				<li class="list service" @tap="service">
					<view class="iconfont icon-htmal5icon31" style="color: #3C7FFC;"></view>
					<view class="txt">客服</view>
					<image class="you" src="../../static/img/you.png" mode=""></image>
				</li> -->
			</ul>
			<view class="exit" @tap="exit">
				退出
			</view>
<!-- 			<view class="exit" @tap="login" v-if="login_show">
				立即登录
			</view> -->
		</view>
	</view>
</template>

<script>
	// import {
	// 	Logout
	// } from "@/api/my.js";
	import http from '@/common/http.js'  //uni-app request封装
	export default {
		components:{
			
		},
		data() {
			return {
				avatar:'',
				name:'',
				phone: '',
				attestation: '',
				through:'', // token是否有效
				// head_show: false,
				// token:'',
				// exit_show: false,
				// login_show: true,
				img:'../../static/img/head_portrait.png'
			}
		},
		onLoad() {
			let that = this
			//获取token
			uni.getStorage({
			    key: '_token',
			    success: function (res) {
					that.token = res.data
			    },
				fail:function(err){
					uni.reLaunch({
						url: '../login/login'
					});
				}
			});
			//获取用户数据
			uni.getStorage({
			    key: 'user_data',
			    success:((res)=> {
					that.head_show = true
					if(res.data.user.avatar === null){
						that.avatar = that.img
					}else{
						that.avatar = res.data.user.avatar
					}
					that.name = res.data.user.nickName
					that.phone = res.data.user.mobile.slice(0,3)+'****'+res.data.user.mobile.slice(7,11)
					that.attestation = res.data.userInfo.certified
			    })
			});
		},
		methods: {
			//修改资料
			modifieddata(){
				uni.redirectTo({
					url: './Model/ModifiedData'
				});
			},
			//消息
			Info(){
				uni.showToast({
					title: '消息',
					icon: "none"
				});
			},
			Authentication(){
				uni.redirectTo({
					url: './Model/Authentication'
				});
			},
			MyDoctor(){
				uni.showToast({
					title: '我的医生',
					icon: "none"
				});
			},
			Collect(){
				uni.showToast({
					title: '我的收藏',
					icon: "none"
				});
			},
			Test(){
				uni.showToast({
					title: '我的检验',
					icon: "none"
				});
			},
			Invoice(){
				uni.showToast({
					title: '我的发票',
					icon: "none"
				});
			},
			Report(){
				uni.showToast({
					title: '我的病例',
					icon: "none"
				});
			},
			Order(){
				uni.redirectTo({
					url: './Model/Myorder'
				});
			},
			//退出
			exit(){
				const Logout = http('/yl/logout', {
					option: {
					    method: 'get' 
					},
				    success: res => {
						if(res.code === 200){
							uni.clearStorage();
							uni.reLaunch({
								url: '../Home/home'
							});
						}
						if(res.code === 500){
							uni.clearStorage();
							uni.reLaunch({
								url: '../Home/home'
							});
						}
					},
					fail: err => {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import url("../../static/iconfont/iconfont.css");
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.headtitle{
			width:100rpx;
			height:46rpx;
			font-size:48rpx;
			font-family:PingFang SC;
			font-weight:bold;
			color:rgba(51,51,51,1);
			position: relative;
			top: 60rpx;
			left: -280rpx;
		}
		.head_login{
			width: 650rpx;
			height: 160rpx;
			border-radius:10px;
			margin-top: 120rpx;
			text-align: center;
			line-height: 160rpx;
			border: 4rpx rgba(47,109,224,1) solid;
		}
		.head{
			width: 650rpx;
			height: 260rpx;
			background:linear-gradient(90deg,rgba(47,109,224,1) 0%,rgba(28,84,188,1) 100%);
			border-radius:10px;
			margin-top: 120rpx;
			.imghead{
				width: 150rpx;
				height: 150rpx;
				border: 4rpx solid #FFF;
				border-radius:50%;
				overflow: hidden;
				float: left;
				margin-top: 45rpx;
				margin-left: 50rpx;
				.img{
					width: 150rpx;
					height: 150rpx;
				}
			}
			.data{
				float: left;
				color:rgba(255,255,255,1);
				margin-top: 50rpx;
				margin-left: 40rpx;
				.name{
					font-size:48rpx;
				}
				.post{
					font-size:28rpx;
					margin-top: 45rpx;
					font-family:PingFang SC;
				}
			}
			.right{
				float: right;
				width: 40rpx;
				height: 40rpx;
				margin-top: 100rpx;
				margin-right: 20rpx;
			}
		}
		.mymain{
			margin-top: 10rpx;
			width: 660rpx;
			height: 640rpx;
			.option{
				width:660rpx;
				list-style: none;
				padding: 0;
				.list{
					height: 80rpx;
					.iconfont{
						font-size: 36rpx;
						float: left;
						margin-top: 30rpx;
					}
					.txt{
						font-size:28rpx;
						font-family:PingFang SC;
						font-weight:500;
						color:rgba(51,51,51,1);
						float: left;
						margin-top: 30rpx;
						margin-left: 19rpx;
					}
					.you{
						float: right;
						width: 40rpx;
						height: 40rpx;
						margin-top: 35rpx;
					}
				}
				
			}
			.exit{
				width:660rpx;
				height:90rpx;
				background:rgba(255,255,255,1);
				border:1rpx solid rgba(47,109,224,1);
				border-radius:10rpx;
				font-size:36rpx;
				font-family:PingFang SC;
				font-weight:bold;
				color:rgba(47,109,224,1);
				margin-top: 30rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
			}
		}
	}
</style>
