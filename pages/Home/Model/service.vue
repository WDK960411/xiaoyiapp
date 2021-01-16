<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">高端就医</view>
		</view>
		<view class="main">
			<view class="service call_service" @tap="call_phone">
				<view class="service_title">
					电话客服
				</view>
				<view class="service_txt">
					电话咨询，便捷高效
				</view>
			</view>
			<view class="service online_service" @tap="online_service">
				<view class="service_title">
					在线客服
				</view>
				<view class="service_txt">
					在家排队，挂号无忧
				</view>
			</view>
			<uni-popup ref="service" type="dialog">
			    <uni-popup-dialog type="info" title="客服电话: 4006997118" :duration="0" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import http from '@/common/http.js'  //uni-app request封装
	export default {
		components:{
			uniPopup,
			uniPopupMessage,
			uniPopupDialog
		},
		data() {
			return {

			}
		},
		onLoad() {
			
		},
		methods: {
			//返回
			getback(){
				uni.switchTab({
				    url: '../home'
				});
			},
			call_phone(){
				this.$refs.service.open()
			},
			online_service(){
				uni.showToast({
					title: '暂未开放',
					icon: "none",
					duration:1500
				});
			},
			confirm(done){
				done()
				uni.makePhoneCall({
				    phoneNumber: '4006997118' 
				});
			},
			close(done){
				done()
			},
		}
	}
</script>

<style lang="scss">
	@import url("../../../static/iconfont/iconfont.css");
	.content{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.top{
			width: 100%;
			height: 125rpx;
			background: #4f9da2;
			position: relative;
			.iconfont{
				font-size: 40rpx;
				color: #fff;
				float: left;
				position: absolute;
				top: 55rpx;
				left: 15rpx;
			}
			.txt{
				font-size:36rpx;
				font-family:PingFang SC;
				font-weight:bold;
				color:#fff;
				text-align: center;
				margin-top: 55rpx;
				margin-left: -15rpx;
			}
		}
		.head_top{
			width: 100%;
			height: 120rpx;
			background: #4f9da2;
			.search{
				margin-left: 25rpx;
				.uni-searchbar{
					width: 90%;
					height: 50rpx;
					background: #4f9da2;
				}
			}
		}
		.main{
			width: 95%;
			height: 300rpx;
			margin-top: 20rpx;
			// border: 2rpx #007AFF solid;
			box-sizing: border-box;
			.service{
				width: 330rpx;
				height: 220rpx;
				box-sizing: border-box;
				float: left;
				margin-top: 40rpx;
				margin-left: 17rpx;
				color: #fff;
				border-radius: 10rpx;
				.service_title{
					width: 300rpx;
					height: 60rpx;
					font-size: 34rpx;
					text-align: left;
					font-weight: 600;
					margin-top: 50rpx;
					margin-left: 25rpx;
				}
				.service_txt{
					width: 300rpx;
					height: 60rpx;
					font-size: 30rpx;
					text-align: left;
					margin-left: 25rpx;
				}
			}
			.call_service{
				background: #007AFF;
			}
			.online_service{
				background: #1AAD19;
			}
		}
	}
</style>
