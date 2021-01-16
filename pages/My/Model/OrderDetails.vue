<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">订单详情</view>
		</view>
		<view class="main">
			<view class="detail_list">
				<view class="list_item orderNo">
					订单编号：{{order.orderNo}}
				</view>
				<view class="list_item createTime">
					<!-- 下单时间：{{order.createTime|Time}} -->
					下单时间：{{order.createTime}}
				</view>
				<view class="list_item amount">
					支付金额：{{order.amount}}
				</view>
				<view class="list_item payType">
					支付方式：{{order.payType|payType}}
				</view>
				<view class="list_item orderType">
					订单状态：{{order.status|status}}
				</view>
			</view>
		</view>
		<view class="footer" v-if="order.status === 2||order.status === 0">
			<view class="price">
				<view class="price_left">
					支付金额：
				</view>
				<view class="price_right">
					￥{{order.amount}}
				</view>
			</view>
			<view class="pay" @tap="continuepay" v-if="order.status === 2">继续支付</view>
			<view class="pay" @tap="pay" v-if="order.status === 0">立即支付</view>
		</view>
	</view>
</template>

<script>
	import http from '@/common/http.js' //uni-app request封装
	export default {
		components:{

		},
		data() {
			return {
				order:{}
			}
		},
		onLoad() {
			let that = this
			uni.getStorage({
			    key: 'order_id',
			    success: function (res) {
					const Order = http('/order/order/'+res.data, {
						option: {
							method : 'get',
						},
						success: res => {
							// console.log(res)
							that.order = res.data
							console.log('订单',that.order)
							console.log('订单',that.order.status)
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
			
		},
		filters:{
			status:function(status){
				switch (status) {
					case 0:
						return  status = '未付款'
					break;
					case 1:
						return status = '已付款'
					break;
					case 2:
						return status = '待付款'
					break;
					case 3:
						return  status = '已退款'
					break;
					case 4:
						return status = '退款中'
					break;
					case 5:
						return status = '已取消'
					break;
					case 6:
						return status = '已完成'
					break;
				}
			},
			// Time:function(time){
			// 	return time.slice(0,10)+'-'+time.slice(11,19)
			// },
			payType:function(type){
				switch (type) {
					case 0:
						return  type = '支付宝'
					break;
					case 1:
						return type = '微信'
					break;
				}
			}
		},
		methods: {
			//返回
			getback(){
				uni.reLaunch({
				    url: './Myorder'
				});
			},
			continuepay(){
				const Order = http('/yl/pay/againPay', {
					data: {
						orderNo : this.order.orderNo,
					},
					success: res => {
						console.log(res)
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
					},
					fail: err => {
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
					}
				})
			},
			pa(){
				
			}
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
		.main{
			width: 95%;
			margin-top: 20rpx;
			.detail_list{
				width: 100%;
				height: 900rpx;
				// border: 2rpx #007AFF solid;
				box-sizing: border-box;
				margin-top: 20rpx;
				.list_item{
					width: 100%;
					height: 70rpx;
					line-height: 70rpx;
					padding: 0rpx 10rpx;
					border-bottom: 2rpx #F2F2F2 dashed;
					box-sizing: border-box;
					font-size: 28rpx;
					color: #333333;
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
