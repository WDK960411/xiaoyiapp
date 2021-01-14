<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">{{title}}</view>
		</view>
		<view class="head_top">
			<view class="search">
				<uni-search-bar :radius="100" @confirm="search" placeholder="请输入医院、医生、疾病..." @input="inputValue"></uni-search-bar>
			</view>
		</view>
		<view class="main">
			<view class="subfield_doctors" v-for="(item,index) in doctors" :key="item.id">
				<view class="doctors_top_show" v-if="index!==0"></view>
				<view class="doctors_content" @tap="detail(item.id)">
					<view class="doctors_photo">
						<image :src="item.avatar" class="photos"></image>
					</view>
					<view class="doctors_info">
						<view class="info_one">
							<view class="doctor_name">
								{{item.realName}}
							</view>
							<view class="doctor_rank">
								{{item.title}}
							</view>
						</view>
						<view class="info_two">
							<view class="doctor_department">
								{{item.subject}}
							</view>
							<view class="doctor_hospital">
								{{item.hospital}}
							</view>
						</view>
						<view class="info_three">
							<view class="doctor_score">
								<span class="txt">{{item.score}}</span> 分
							</view>
							<view class="doctor_count">
								<span class="txt">{{item.serviceCount}}</span>次服务
							</view>
						</view>
						<view class="info_four">
								擅长：{{item.goodAt}}
						</view>
					</view>
					<!-- <view class="doctors_tag">
						<view class="tag" v-for="(tag,idx) in item.label" :key="tag">{{tag}}</view>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import http from '@/common/http.js' //uni-app request封装
	export default {
		components:{
			uniSearchBar
		},
		data() {
			return {
				title:'',
				doctors:[]
			}
		},
		onLoad() {
			let that = this
			uni.getStorage({
			    key: 'head_title',
			    success: function (res) {
			        that.title = res.data
			    }
			});
			const DoctorList = http('/yl/doctor/list', {
				data: {
					limit : 10,
					page: 1
				},
				success: res => {
					// console.log(res)
					that.doctors = res.data.list
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			})
		},
		methods: {
			//返回
			getback(){
				uni.switchTab({
				    url: '../home'
				});
			},
			//hui'che
			search(value){
				// console.log('search',value)
			},
			inputValue(value){
				let that = this
				// console.log('input',value)
				const DoctorList = http('/yl/doctor/list', {
					data: {
						query: value.value,
						limit : 10,
						page: 1
					},
					success: res => {
						// console.log(res)
						that.doctors = res.data.list
						// console.log(that.doctors)
					},
					fail: err => {
						uni.showToast({
							title: res.msg,
							icon: "none"
						});
					}
				})
				
			},
			detail(id){
				uni.setStorage({
					key: 'doctor_id',
					data: id,
					success:(()=> {
					   
					})
				});
				uni.redirectTo({
					url: './DoctorDetails'
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
			.subfield_doctors{
				height: 280rpx;
				width: 100%;
				background: #fff;
				border-radius: 20rpx 20rpx 0rpx 0rpx;
				margin-top: 10rpx;
				position: relative;
				.doctors_top{
					width: 100%;
					height: 60rpx;
					margin-top: 10rpx;
					.doctors_title{
						width: 120rpx;
						height: 40rpx;
						font-size: 26rpx;
						color: #333;
						font-weight: 600;
						margin: 10rpx 17rpx;
						float: left;
						text-align: center;
					}
					.doctors_more{
						width: 100rpx;
						height: 40rpx;
						float: right;
						margin-top: 10rpx;
						margin-right: 10rpx;
						font-size: 26rpx;
						color: #169bd5;
						text-align: center;
					}
				}
				.doctors_top_show{
					width: 100%;
					height: 35rpx;
				}
				.favorite{
					width: 36rpx;
					height: 36rpx;
					background-size: cover;
					position: absolute;
					top: 70rpx;
					right: 40rpx;
					z-index: 996;
				}
				.doctors_content{
					width: 95%;
					height: 280rpx;
					margin: 0 auto;
					position: relative;
					z-index: 995;
					border-radius: 10rpx;
					border-bottom: 2rpx #eee dashed;
					.doctors_photo{
						width: 235rpx;
						height: 235rpx;
						border: #ccc 18rpx solid;
						background-size: cover;
						// margin: 20rpx 15rpx;
						position: absolute;
						top: 20rpx;
						left: 10rpx;
						box-sizing: border-box;
						.photos{
							width: 200rpx;
							height: 200rpx;
							background-size: cover;
						}
					}
					.doctors_info{
						width: 420rpx;
						height: 235rpx;
						// border: #007AFF solid 2rpx;
						box-sizing: border-box;
						position: absolute;
						top: 20rpx;
						left: 260rpx;
						.info_one{
							width: 80%;
							height: 50rpx;
							margin-top: 5rpx;
							font-style: normal;
							font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
							.doctor_name{
								float: left;
								font-size: 36rpx;
								font-weight: 700;
								margin-right: 20rpx;
							}
							.doctor_rank{
								float: left;
								font-size: 20rpx;
								font-weight: 600;
								margin-top: 10rpx;
							}
						}
						.info_two{
							width: 80%;
							height: 40rpx;
							font-style: normal;
							font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
							margin-top: 10rpx;
							.doctor_department, .doctor_hospital{
								float: left;
								font-size: 26rpx;								
								font-weight: 700;
								margin-right: 20rpx;
								display: -webkit-box;
								-webkit-box-orient: vertical;    
								-webkit-line-clamp: 1;    
								overflow: hidden;
							}
						}
						.info_three{
							width: 80%;
							height: 40rpx;
							font-style: normal;
							font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
							margin-top: 5rpx;
							.doctor_score, .doctor_count{
								float: left;
								font-size: 28rpx;
								margin-right: 20rpx;
								.txt{
									color: red;
									font-size: 26rpx;
									margin-right: 5rpx;
								}
							}
						}
						.info_four{
							width: 100%;
							height: 80rpx;
							font-style: normal;
							font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
							font-size: 28rpx;
							display: -webkit-box;    
							-webkit-box-orient: vertical;    
							-webkit-line-clamp: 2;    
							overflow: hidden;
							margin-top: 5rpx;
						}
					}
					.doctors_tag{
						width: 95%;
						height: 50rpx;
						position: relative;
						top: 255rpx;
						left: 2.5%;
						display: -webkit-box;
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 1;    
						overflow: hidden;
						.tag{
							width: 140rpx;
							height: 40rpx;
							display: inline-block;
							border: #D9001B solid 3rpx;
							float: left;
							margin-top: 5rpx;
							margin-right: 10rpx;
							text-align: center;
							line-height: 40rpx;
							font-size: 24rpx;
							color: #D9001B;
						}
					}
				}
			}
		}
	}
</style>
