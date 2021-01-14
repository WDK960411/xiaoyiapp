<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: rgba(51,51,51,1);" @tap="getback"></view>
			<view class="txt">修改资料</view>
			<view class="save" @tap="save">保存</view>
		</view>
		<view class="main">
			<ul class="option">
				<li class="list"  style="height: 220rpx;">
					<view class="title profile" style="line-height: 220rpx;">头像</view>
					<image class="headimg" :src="this.data.headimg" mode=""></image>
				</li>
				<li class="list">
					<view class="title name">姓名</view>
					<input class="uni-input input" @input="onname"  :value="this.data.name"/>
				</li>
				<li class="list">
					<view class="title phone">手机号</view>
					<input class="uni-input input" @input="onphone"  :value="this.data.phone"/>
				</li>
			</ul>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				data:{
					headimg:'',
					name: '',
					phone:'',
					img:'../../../static/img/head_portrait.png'
				}
			}
		},
		onLoad() {
			let that = this
			uni.getStorage({
			    key: 'user_data',
			    success:((res)=> {
					if(res.data.user.avatar !== null){
						that.data.headimg = res.data.user.avatar
					}else{
						that.data.headimg = that.data.img
					}
					that.data.name = res.data.user.nickName
					that.data.phone = res.data.user.mobile
			    })
			});
		},
		methods: {
			//返回
			getback(){
				uni.switchTab({
				    url: '../My'
				});
			},
			//保存
			save(){
				uni.showModal({
				    title: '提示',
				    content: '确定保存吗？',
				    success: function (res) {
				        if (res.confirm) {
				           uni.redirectTo({
				               url: '../My'
				           });
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			onname: function(event) {
				this.name = event.target.value

			},
			onpost: function(event) {
				this.post = event.target.value
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
			border-bottom: 2rpx solid #eee;
			.iconfont{
				font-size: 40rpx;
				color: rgba(51,51,51,1);
				float: left;
				margin-top: 55rpx;
			}
			.txt{
				font-size:36rpx;
				font-family:PingFang SC;
				font-weight:bold;
				color:rgba(51,51,51,1);
				text-align: center;
				margin-top: 55rpx;
			}
			.save{
				font-size:32rpx;
				font-family:PingFang SC;
				font-weight:500;
				color:rgba(47,109,224,1);
				float: right;
				margin-right: 15rpx;
				margin-top: -40rpx;
			}
		}
		.main{
			width: 690rpx;
			height: 550rpx;
			.option{
				width:690rpx;
				list-style: none;
				padding: 0;
				.list{
					height: 100rpx;
					border-bottom: 2rpx solid rgba(228,228,228,1);
					.title{
						width: 100rpx;
						line-height: 100rpx;
						float: left;
					}
					.input{
						float: right;
						width: 250rpx;
						height: 100rpx;
						text-align: right;
					}
				}
				.headimg{
					width: 150rpx;
					height: 150rpx;
					border: 4rpx solid #FFF;
					border-radius:50%;
					overflow: hidden;
					float: right;
					margin-top: 45rpx;
					margin-left: 50rpx;
				}
			}
		}
	}
</style>
