<template>
	<view class="content">
		<view class="header">
			<view class="top">
				<view class="iconfont icon-fanhui" style="color: rgba(51,51,51,1);" @tap="getback"></view>
				<view class="txt">个人诊室</view>
			</view>
		</view>
		<uni-popup ref="popup" type="dialog" class="dialogshow">
		    <uni-popup-dialog type="error" title="您还未登录,是否登录" :duration="0" :before-close="true" @close="close" @confirm="confirm">
				
			</uni-popup-dialog>
		</uni-popup>
		<view class="main">
			<view class="subfield_doctors" >
				<view class="doctors_content">
					<image src="../../../static/img/Home/icon_pic/favorite.png" class="favorite" v-if="favorite=== false" @tap="favoritea"></image>
					<image src="../../../static/img/Home/icon_pic/favorite_active.png" class="favorite active" v-if="favorite=== true" @tap="favoriteb"></image>
					<view class="doctors_photo">
						<image :src="avatar" class="photos"></image>
					</view>
					<view class="doctors_info">
						<view class="info_one">
							<view class="doctor_name">
								{{realName}}
							</view>
							<view class="doctor_rank">
								{{title}}
							</view>
						</view>
						<view class="info_two">
							<view class="doctor_department">
								{{subject}}
							</view>
							<view class="doctor_hospital">
								{{hospital}}
							</view>
						</view>
						<view class="info_three">
							<view class="doctor_score">
								<span class="txt">{{score}}</span> 分
							</view>
							<view class="doctor_count">
								<span class="txt">{{serviceCount}}</span>次服务
							</view>
						</view>
						<view class="info_four">
								擅长：{{goodAt}}
						</view>
					</view>
					<!-- <view class="doctors_tag">
						<view class="tag" v-for="(tag,idx) in item.label" :key="tag">{{tag}}</view>
					</view> -->
				</view>
			</view>
			<view class="introduce bg">
				<view class="introduce_top">
					<view class="introduce_title">
						简介：
					</view>
					<view class="introduce_more">
						查看详情
					</view>
				</view>
				<view class="synopsis">
					{{intro}}
				</view>
			</view>
			<view class="announcement_top">
				<view class="title">
					医生公告:
				</view>
				<!-- <image src="../../../static/img/Home/icon_pic/sign.png" class="sign"></image> -->
				<view class="more">
					查看所有
				</view>
			</view>
			<view class="subfield_announcement">
				<view class="list uni-flex uni-column">
					<view class="wrap-item">
						<view class="lis uni-flex uni-column" :animation="animationData">
							<view class="uni-flex uni-column" v-for="(item, index) in list" :key="item.id">
								<view class="swiper-item item_title uni-flex list_item">
									<view class="type uni-flex-item justify-align-center uni-flex">{{ item.tag }}</view>
									<view class="time uni-flex-item justify-align-center uni-flex">{{ item.createTime.slice(5,10)}}</view>
									<view class="news uni-flex-item justify-align-center uni-flex">{{ item.title }}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="announcement_down">
			</view>
			<view class="interaction">
				<view class="interaction_top">
					<view class="top_title">
						图文问诊:
					</view>
					<view class="top_more">
						查看所有
					</view>
				</view>
				<view class="interaction_content">
					暂无数据
				</view>
			</view>
			<view class="evaluate">
				<view class="evaluate_top">
					<view class="top_title">
						评价:
					</view>
					<view class="top_more">
						查看所有
					</view>
				</view>
				<view class="evaluate_content">
					暂无数据
				</view>
			</view>
			<view class="down">
				
			</view>
		</view>
		<view class="footer">
			<view class="footer_box online" @tap="inquiry">
				<view class="iconfont icon-zaixiankefu"></view>
				<view class="title">
					<view class="title_txt">
						问诊
					</view> 
					<view class="price">
						￥{{price}}
					</view>
				</view>
			</view>
			<view class="footer_box booked" @tap="booked">
				<view class="iconfont icon-shipin"></view>
				<view class="title">视频问诊</view>
			</view>
			<view class="footer_box shop" @tap="shop">
				<view class="iconfont icon-mall" style="font-size: 50rpx;"></view>
				<view class="title">商城</view>
			</view>
		</view>
	</view>
</template>

<script>
	// import {
	// 	DoctorDetails,
	// 	GetAnimation
	// } from "@/api/home.js";
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
				id:'',
				avatar:'',
				realName:'',
				title:'',
				subject:'',
				hospital:'',
				score:'',
				serviceCount:'',
				goodAt:'',
				favorite: false,
				scrollHeight: 0, //向上滚动距离
				height: 0, //.lis高度（滚动框高度）
				animationData: {}, //动画对象
				price: '', //问诊价格
				list: [],
				intro:''
			}
		},
		onLoad() {
			let that = this
			uni.getStorage({
			    key: 'doctor_id',
			    success: function (res) {
			        that.id = res.data
					const DoctorDetails = http('/yl/doctor/get', {
					    data: {
					        id:that.id
					    },
					    success: res => {
							if(res.code === 200){
								that.avatar = res.data.avatar
								that.realName = res.data.realName
								that.title = res.data.title
								that.subject = res.data.subject
								that.hospital = res.data.hospital
								that.score = res.data.score
								that.serviceCount = res.data.serviceCount
								that.goodAt = res.data.goodAt
								that.intro = res.data.brief
							}
							if(res.code === 403){
								uni.showToast({
									title: res.msg,
									icon: "none"
								});
							}
						},
						fail: err => {
							uni.showToast({
								title: res.msg,
								icon: "none"
							});
						}
					})
					const GetAnimation = http('/yl/annos/list', {
						data:{
							userId: that.id,
							type: 1
						},
					    success: res => {
							that.list = res.data.list
							if(res.code === 403){
								uni.showToast({
									title: res.msg,
									icon: "none"
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
					const Price = http('/yl/goods/get/doctor', {
						data:{
							doctorId: that.id,
							type: 1
						},
					    success: res => {
							switch(res.code) {
							    case 200:
								if(res.data!== null){
									that.price = res.data.price
									uni.setStorage({
										key: 'doctor_price',
										data: res.data.price,
										success:(()=> {
										   
										})
									});
								}
								break;
								case 403:
								uni.showToast({
									title: '登录过期，请重新登录',
									icon: "none"
								});
								uni.reLaunch({
									url: '../../login/login'
								});
								break;
								case 500:
								uni.showToast({
									title: res.msg,
									icon: "none"
								});
								break;
							}	
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
			// DoctorDetails({
			// 	id:this.id
			// }).then(res => {
			// 	// console.log(res.data)
			// 	if(res.code === 200){
			// 		this.avatar = res.data.avatar
			// 		this.realName = res.data.realName
			// 		this.title = res.data.title
			// 		this.subject = res.data.subject
			// 		this.hospital = res.data.hospital
			// 		this.score = res.data.score
			// 		this.serviceCount = res.data.serviceCount
			// 		this.goodAt = res.data.goodAt
			// 		this.intro = res.data.brief
			// 	}
			// })
			
		},
		mounted() {
			this.prizeScroll();
		},
		methods: {
			//公告
			getHeight(Class) {
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(Class).boundingClientRect(data => {
					this.height = data[0].height;
				}).exec();
			},
			prizeScroll() {
				let speed = 80;
				let animation = uni.createAnimation({
					duration: this.getHeight('.lis') / speed,
					timingFunction: 'linear',
					delay: 0
				});
				this.animation = animation;
				setInterval(() => {
					if (this.scrollHeight >= this.height) {
						animation.translateY(0).step();
						this.scrollHeight = 0;
						this.animationData = animation.export();
					} else {
						this.scrollHeight = this.scrollHeight + 1;
						animation.translateY(-this.scrollHeight).step();
						this.animationData = animation.export();
					}
				}, speed);
			},
			favoritea(){
				this.favorite = true
			},
			favoriteb(){
				this.favorite = false
			},
			//返回
			getback(){
				uni.switchTab({
				    url: '../home'
				});
			},
			confirm(done){
				done()
				let that = this
				uni.reLaunch({
				    url: '../../login/login'
				});
			},
			close(done){
				done()
			},
			//在线问诊
			inquiry(){
				let that = this
				uni.getStorage({
				    key: '_token',
				    success: function (res) {
						let doctor_info = {}
						doctor_info.avatar = that.avatar
						doctor_info.realName= that.realName
						doctor_info.title= that.title
						doctor_info.subject= that.subject
						doctor_info.hospital= that.hospital
						doctor_info.goodAt= that.goodAt
						// console.log('医生信息',doctor_info)
						uni.setStorage({
							key: 'doctor_info',
							data: doctor_info,
							success:(()=> {
								
							})
						});
						uni.redirectTo({
						    url: './OnlineinQuiry'
						});
				    },
					fail:function(err){
						that.$refs.popup.open()
					}
				});
			},
			booked(){
				uni.showToast({
					title: '暂未开放',
					icon: "none",
					duration:1500
				});
			},
			shop(){
				uni.showToast({
					title: '暂未开放',
					icon: "none",
					duration:1500
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
		background: #f2f2f2;
		.header{
			width: 100%;
			height: 125rpx;
			.top{
				width: 100%;
				height: 125rpx;
				background: #fff;
				border-bottom: 2rpx solid #eee;
				box-sizing: border-box;
				position: fixed;
				top: 0rpx;
				z-index: 999;
				.iconfont{
					font-size: 40rpx;
					color: rgba(51,51,51,1);
					float: left;
					position: absolute;
					top: 55rpx;
					left: 15rpx;
				}
				.txt{
					font-size:36rpx;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(51,51,51,1);
					text-align: center;
					margin-top: 55rpx;
				}
			}
		}
		.dialogshow{
			z-index: 1000;
		}
		.main{
			width: 95%;
			margin: 10rpx auto;
			z-index: 998;
			.bg{
				width: 100%;
				background: #fff;
				border-radius: 20rpx;
				margin-top: 15rpx;
			}
			.subfield_doctors{
				height: 280rpx;
				width: 100%;
				background: #fff;
				border-radius: 20rpx 20rpx 0rpx 0rpx;
				.doctors_content{
					width: 95%;
					height: 280rpx;
					margin: 0 auto;
					position: relative;
					z-index: 995;
					border-radius: 10rpx;
					.favorite{
						width: 36rpx;
						height: 36rpx;
						background-size: cover;
						position: absolute;
						top: 25rpx;
						right: 20rpx;
						z-index: 996;
					}
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
			.introduce{
				width: 100%;
				height: 260rpx;
				background: #fff;
				border-radius: 0rpx 0rpx 20rpx 20rpx;
				.introduce_top{
					width: 100%;
					height: 50rpx;
					margin-top: 10rpx;
					.introduce_title{
						width: 100rpx;
						height: 40rpx;
						font-size: 26rpx;
						color: #000;
						font-weight: 600;
						margin: 10rpx 17rpx;
						float: left;
						text-align: center;
					}
					.introduce_more{
						width: 130rpx;
						height: 40rpx;
						float: right;
						margin-top: 10rpx;
						margin-right: 10rpx;
						font-size: 26rpx;
						color: #169bd5;
						text-align: center;
					}
				}
				.synopsis{
					width: 91%;
					height: 186rpx;
					font-size: 28rpx;
					text-align: left;
					margin: 0 auto;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 5;
					-webkit-box-orient: vertical;
				}
			}
			.announcement_top{
				width: 100%;
				height: 70rpx;
				background: #fff;
				border-radius: 10rpx 10rpx 0 0;
				margin-top: 15rpx;
				.title{
					width: 120rpx;
					height: 40rpx;
					font-size: 26rpx;
					color: #000;
					font-weight: 600;
					margin: 10rpx 17rpx;
					float: left;
					text-align: center;
				}
				// .sign{
				// 	width: 30rpx;
				// 	height: 30rpx;
				// 	float: left;
				// 	margin-top: 10rpx;
				// }
				.more{
					width: 120rpx;
					height: 40rpx;
					float: right;
					margin-top: 10rpx;
					margin-right: 10rpx;
					font-size: 26rpx;
					color: #169bd5;
					text-align: center;
				}
			}
			.subfield_announcement{
				width: 100%;
				background: #fff;
				height: 80rpx;
				z-index: 996;
				box-sizing: border-box;
				overflow: hidden;
				.list{
					z-index: 995;
					margin-left: 30rpx;
					width: 80%;
					.type{
						width: 20%;
						height: 40rpx;
						font-size: 26rpx;
						color: #169bd5;
						float: left;
					}
					.time{
						width: 20%;
						height: 40rpx;
						font-size: 26rpx;
						color: #169bd5;
						float: left;
					}
					.news{
						width: 50%;
						height: 40rpx;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						font-size: 26rpx;
						color: #169bd5;
					}
				}
			}
			.announcement_down{
				width: 100%;
				height: 20rpx;
				background: #fff;
				border-radius: 0 0 10rpx 10rpx;
			}
			.interaction{
				width: 100%;
				height: 300rpx;
				background: #fff;
				border-radius: 15rpx;
				margin-top: 20rpx;
				position: relative;
				.interaction_top{
					width: 100%;
					height: 40rpx;
					position: relative;
					top: 10rpx;
					.top_title{
						width: 120rpx;
						height: 40rpx;
						font-size: 26rpx;
						color: #000;
						font-weight: 600;
						float: left;
						margin-left: 20rpx;
					}
					.top_more{
						width: 120rpx;
						height: 40rpx;
						font-size: 26rpx;
						color: #169bd5;
						float: right;
					}
				}
				.interaction_content{
					width: 100%;
					height: 235rpx;
					// background: #09BB07;
					margin-top: 15rpx;
					text-align: center;
					line-height: 235rpx;
					font-size: 40rpx;
					color: #8F8F94;
				}
			}
			.evaluate{
				width: 100%;
				height: 300rpx;
				background: #fff;
				border-radius: 15rpx;
				margin-top: 20rpx;
				position: relative;
				.evaluate_top{
					width: 100%;
					height: 40rpx;
					position: relative;
					top: 10rpx;
					.top_title{
						width: 120rpx;
						height: 40rpx;
						font-size: 26rpx;
						color: #000;
						font-weight: 600;
						float: left;
						margin-left: 20rpx;
					}
					.top_more{
						width: 120rpx;
						height: 40rpx;
						font-size: 26rpx;
						color: #169bd5;
						float: right;
					}
				}
				.evaluate_content{
					width: 100%;
					height: 235rpx;
					// background: #09BB07;
					margin-top: 15rpx;
					text-align: center;
					line-height: 235rpx;
					font-size: 40rpx;
					color: #8F8F94;
				}
			}
			.down{
				width: 100%;
				height: 112rpx;
				background: #eee;
			}
		}
		.footer{
			width: 100%;
			height: 120rpx;
			background: #fff;
			border-top: #eee solid 2rpx;
			position: fixed;
			bottom: 0rpx;
			z-index: 999;
			.footer_box{
				width: 33.33%;
				height: 100%;
				// border-right:  #eee solid 2rpx;
				float: left;
				.iconfont{
					width: 100%;
					height: 80rpx;
					font-size: 70rpx;
					line-height: 80rpx;
					color: #1296db;
					text-align: center;
				}
				.title{
					width: 100%;
					height: 40rpx;
					font-size: 26rpx;
					text-align: center;
					line-height: 40rpx;
					position: relative;
					.title_txt{
						width: 60rpx;
						height: 100%;
						font-size: 26rpx;
						position: absolute;
						top: 0rpx;
						left: 60rpx;
					}
					.price{
						width: 90rpx;
						height: 100%;
						font-size: 26rpx;
						color: #1AAD19;
						position: absolute;
						top: 0rpx;
						right: 60rpx;
					}
				}
			}
			.booked{
				border-left:  #eee solid 2rpx;
				border-right:  #eee solid 2rpx;
				box-sizing: border-box;
			}
		}
	}
</style>
