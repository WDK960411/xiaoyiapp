<template>
	<view class="content">
		<view class="headtitle">资讯</view>
		<view class="main">
			
		</view>
	</view>
</template>

<script>
	export default {
		components:{
			
		},
		data() {
			return {
				datas:[]
			}
		},
		onLoad() {
	
		},
		methods: {
			//点击进入消息详情
			infoparticulars(e){
				uni.navigateTo({
				    url: './Model/InfoParticulars'
				});
				console.log(e);
				console.log(e.currentTarget.id);
			},
		}
	}
</script>

<style lang="scss">
	@import url("../../static/iconfont/iconfont.css");
	.content {
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
		.main{
			width: 660rpx;
			margin-top: 100rpx;
		}
		
	}
</style>
