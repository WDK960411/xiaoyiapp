<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">高端就医</view>
		</view>
		<view class="main">
			<view class="service call_service">
				
			</view>
			<view class="service online_service">
				
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		components:{

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
			margin-top: 20rpx;
			
		}
	}
</style>
