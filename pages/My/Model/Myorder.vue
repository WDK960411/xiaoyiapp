<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">我的订单</view>
		</view>
		<view class="main">
			<view class="title">
				<view @tap="tap(item.status)" v-for="(item,index) in list" :key="index" :class="[current==item.status?'active':'']" :current="current">{{item.title}}</view>
			</view>
			<swiper class="tap-label">
				<swiper-item >
					<view class="order_content" v-for="(item,index) in order" :key="item.id">
						<view class="content_left">
							<view class="left_item order_nub">
								订单号：{{item.orderNo}}
							</view>
							<view class="left_item order_price">
								金额：{{item.amount}}
							</view>
							<view class="left_item time">
								<!-- 时间：{{item.createTime|createTime}} -->
								时间：{{item.createTime}}
							</view>
							<view class="left_item remark">
								备注：{{item.remark}}
							</view>
						</view>
						<view class="content_right">
							<view class="right_item order_status" style="color: #F76260;" v-if="item.status ===0">
								{{item.status|status}}
							</view>
							<view class="right_item order_status" style="color: #007AFF;" v-if="item.status ===1">
								{{item.status|status}}
							</view>
							<view class="right_item order_status" style="color: #DD524D;" v-if="item.status ===2">
								{{item.status|status}}
							</view>
							<view class="right_item order_status" style="color: #F0AD4E;" v-if="item.status ===3">
								{{item.status|status}}
							</view>
							<view class="right_item order_status" style="color: #3F536E;" v-if="item.status ===4">
								{{item.status|status}}
							</view>
							<view class="right_item order_status" style="color: #576B95;" v-if="item.status ===5">
								{{item.status|status}}
							</view>
							<view class="right_item order_status" style="color: #09BB07;" v-if="item.status ===6">
								{{item.status|status}}
							</view>
							<view class="right_item order_detail" style="color: #0A98D5;" @tap="OrderDetail(item.id)">
								查看订单
							</view>
							<!-- <view class="right_item paytime" style="color: #BEBEBE;" v-if="item.status ===2">
								支付剩余：
							</view> -->
						</view>
					</view>
				</swiper-item>
			</swiper>
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
				current: -1, // -1：全部，1：已付款，2：待付款，6：已完成
				list: [
					{
						status: -1,
						title: "全部",
						name: "全部订单",
					},
					{
						status: 6,
						title: "已完成",
						name: "已完成订单"
					},
					{
						status: 1,
						title: "已付款",
						name: "已付款订单"
					},
					{
						status: 2,
						title: "待付款",
						name: "待付款订单"
					},
				],
				order:[],
				orderList:[]
			}
		},
		onLoad() {
			let that = this
			const GetOrder = http('/order/order/getList', {
				data:{
					page: 1,
					limit:1000
				},
			    success: res => {
					// console.log(res)
					that.orderList = res.data.list
					that.order = that.orderList
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			})
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
			// createTime:function(time){
			// 	return time.slice(0,10)+'-'+time.slice(11,19)
			// }
		},
		methods: {
			//返回
			getback(){
				uni.switchTab({
				    url: '../My'
				});
			},
			tap(status) {
				this.current = status
				switch (status) {
					case -1:
						this.order = this.orderList
					break;
					case 6:
						this.order = this.orderList
						let newordera = this.order.filter(item => item.status === 6)
						this.order = newordera
					break;
					case 1:
						this.order = this.orderList
						let neworderb = this.order.filter(item => item.status === 1)
						this.order = neworderb
					break;
					case 2:
						this.order = this.orderList
						let neworderc = this.order.filter(item => item.status === 2)
						this.order = neworderc
					break;
				}
			},
			//查看订单
			OrderDetail(id){
				// console.log(id)
				uni.setStorage({
				    key: 'order_id',
				    data: id,
				    success: function () {
				        uni.reLaunch({
				            url: './OrderDetails'
				        });
				    }
				});
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
			.title {
				background-color: #FFFFFF;
				display: flex;
				border-bottom: 1px solid #DDDDDD;
				width: 100%;
				box-sizing: border-box;
				height: 80upx;
				font-size: 30upx;
				line-height: 80upx;
				text-align: center;
				view {
					height: 80upx;
					line-height: 80upx;
					padding: 0;
					display: block;
					width: 50%;
					border-radius: 0;
					border: none;
					&:after {
						border: none;
						border-radius: 0;
					}
				}
			}
			.active {
				background: #2cdbab;
				color: #FFFFFF;
			}
			.content {
				background: #F8F8F8;
			}
			.tap-label {
				// margin-top: 20upx;
				height: 1100rpx;
				width: 100%;
				position: fixed;
				top: 230rpx;
				overflow: auto;
				swiper-item {
					width: 100%;
					height: 100%;
					overflow: auto;
					.order_content{
						width: 95%;
						height: 200rpx;
						// border: 2rpx #00B26A solid;
						background: #f9f9f9;
						border-radius: 10rpx;
						box-sizing: border-box;
						position: relative;
						margin-top: 10rpx;
						.content_left{
							width: 60%;
							height: 200rpx;
							float: left;
							// border: 2rpx #488EE9 solid;
							box-sizing: border-box;
							.left_item{
								width: 100%;
								height: 48rpx;
								// border: 2rpx #E80080 solid;
								box-sizing: border-box;
								float: left;
								position: relative !important;
								// margin-top: 1%;
								font-size: 20rpx;
								line-height: 48rpx;
								text-align: left;
								display: -webkit-box;
								-webkit-box-orient: vertical;    
								-webkit-line-clamp: 1;    
								overflow: hidden;
								padding-left: 10rpx;
							}
						}
						.content_right{
							width: 40%;
							height: 200rpx;
							float: right;
							// border: 2rpx #8A6DE9 solid;
							box-sizing: border-box;
							.right_item{
								width: 60%;
								height: 66rpx;
								// border: 2rpx #F0AD4E solid;
								line-height: 66rpx;
								box-sizing: border-box;
								position: relative !important;
								text-align: center;
								// padding-top: 10rpx;
								font-size: 28rpx;
								font-weight: 600;
								float: right;
							}
							.paytime{
								width: 100% !important;
								font-size: 20rpx !important;
								font-weight: 500 !important;
							}
						}
					}
				}
			}
			
			swiper {
				display: flex;
				flex: 1 1 auto;
			}
			
			swiper :first-child {
				position: absolute;
			}
		}
	}
</style>
