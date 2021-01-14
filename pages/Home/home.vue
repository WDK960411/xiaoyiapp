<template>
	<view class="content">
		<view class="head_top">
			<view class="headtitle">小医在诊</view>
			<view class="headfunction">
				<view class="head_location">
						<!-- 三级联动 -->
						<pick-regions :defaultRegion="defaultRegionCode"  @getRegion="handleGetRegion">
							<image src="../../static/img/Home/icon_pic/region.png" class="region" v-if="show"></image>
							<view class="text">
								{{regionName}}
							</view>
							<image src="../../static/img/Home/icon_pic/down.png" class="down" v-if="down"></image>
						</pick-regions>
				</view>
				<view class="head_search"  @tap="seach">
				   <image src="../../static/img/Home/icon_pic/seach.png" class="seach_pic"></image>
				   <view class="search_txt">
						搜索医院、医生、疾病
				   </view>
				</view>
				<view class="information_box">
					<view class="iconfont icon-tishi head_information" @tap="information"></view>
					<view class="information_quantity"  v-if="!(list.length === 0)">{{list.length}}</view>
				</view>
			</view>
		</view>
		<view class="more"></view>
		<view class="main">
			<view class="advertise">
				<uni-swiper-dot :info="banner" :current="current" field="content" :mode="mode" :dotsStyles="dotsStyles">
				    <swiper class="swiper-box" @change="change" autoplay="true" loop="true" interval="2000">
				        <swiper-item v-for="(item ,index) in banner" :key="index">
							<image :src="item.url" class="advertise_pic"></image>
				        </swiper-item>
				    </swiper>
				</uni-swiper-dot>
			</view>
			<view class="subfield_advisory bg">
				<view class="module inquiry" @tap="inquiry_seach">
					<view class="iconfont icon-wenzhen" style="color: #f2cb51;"></view>
					<!-- <image src="../../static/img/Home/icon_pic/inquiry.png" class="icon_pic pic1"></image> -->
					<view class="module_title">问诊</view>
				</view>
				<view class="module consult" @tap="consult_seach">
					<view class="iconfont icon-yisheng" style="color: #ff7445;"></view>
					<!-- <image src="../../static/img/Home/icon_pic/consult.png" class="icon_pic pic2"></image> -->
					<view class="module_title">咨询</view>
				</view>
				<view class="module high-end" @tap="service">
					<view class="iconfont icon-yiliao" style="color: #009f72;"></view>
					<!-- <image src="../../static/img/Home/icon_pic/high_end.png" class="icon_pic pic3"></image> -->
					<view class="module_title">高端就医</view>
				</view>
			</view>
			<view class="announcement_top">
				<view class="title">
					公告
				</view>
				<image src="../../static/img/Home/icon_pic/sign.png" class="sign"></image>
				<view class="more">
					更多
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
									<!-- <view class="type uni-flex-item justify-align-center uni-flex">{{ item.type }}</view>
									<view class="time uni-flex-item justify-align-center uni-flex">{{ item.time}}</view>
									<view class="news uni-flex-item justify-align-center uni-flex">{{ item.news }}</view> -->
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="announcement_down">
			</view>
			<view class="subfield_outpatient bg">
				<view class="outpatient_title">
					专科门诊
				</view>
				<view class="outpatient_count">
					累计服务 <span class="nub">{{count}}</span>人次
				</view>
				<view class="department">	
					<view class="department_code" v-for="(item, index) in department" :key="item.id">
						<!-- <image :src="item.pic" class="department_pic"></image> -->
						<view :class="item.icon" class="department_icon iconfont"></view>
						<view class="department_name">
							{{item.name}}
						</view>
					</view>
				</view>
				<view class="all">
					<view class="all_box">
						<image src="../../static/img/Home/icon_pic/all.png" class="all_pic"></image>
						<view class="all_name">
							所有
						</view>
					</view>
				</view>
			</view>
			<view class="subfield_doctors" v-for="(item,index) in doctors" :key="item.id">
				<view class="doctors_top" v-if="index===0">
					<view class="doctors_title">
						专家名医
					</view>
					<view class="doctors_more" @tap="seach">
						更多
					</view>
				</view>
				<view class="doctors_top_show" v-if="index!==0"></view>
				<image src="../../static/img/Home/icon_pic/favorite.png" class="favorite"></image>
				<!-- <image src="../../static/img/Home/icon_pic/favorite.png" class="favorite" v-if="favorite=== 1" @tap="favoritea"></image>
				<image src="../../static/img/Home/icon_pic/favorite_active.png" class="favorite active" v-if="favorite=== 0" @tap="favoriteb"></image> -->
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
			<!-- <view class="footer"></view> -->
		</view>
	</view>
</template>

<script>
	import uniSwiperDot from "@/components/uni-swiper-dot/uni-swiper-dot.vue"
	import pickRegions from '@/components/pick-regions/pick-regions.vue'
	// import {
	// 	GetAdvertise,
	// 	GetAnimation,
	// 	GetDepartment,
	// 	GetDoctor
	// } from "@/api/home.js";
	
	import http from '@/common/http.js'  //uni-app request封装
	export default {
		components:{
			uniSwiperDot,
			pickRegions
		},
		onLoad() {
			//原request请求
			// //轮播图
			// GetAdvertise({
			// 	userTypes:this.type
			// }).then(res => {
			// 	this.banner = res.data
			// })
			// //公告
			// GetAnimation({
				
			// }).then(res => {
			// 	this.list = res.data.list
			// })
			// //专科门诊
			// GetDepartment({
				
			// }).then(res => {
			// 	this.department = res.data
			// })
			// //专家名医
			// GetDoctor({
				
			// }).then(res => {
			// 	this.doctors = res.data.list
			// })
			
			//uni.request请求
			// 轮播图
			const GetAdvertise = http('/yl/slide/list', {
			    data: {
			        userTypes:this.type
			    },
			    success: res => {
					this.banner = res.data
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
					uni.navigateTo({
						url: '../login'
					});
				}
			})
			// 公告
			const GetAnimation = http('/yl/annos/list', {
			    success: res => {
					this.list = res.data.list
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			})
			// 专科门诊
			const GetDepartment = http('/yl/discipline/list', {
			    success: res => {
					this.department = res.data
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			})
			// 专家名医
			const GetDoctor = http('/yl/doctor/list', {
			    success: res => {
					this.doctors = res.data.list
				},
				fail: err => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
				}
			})
			//获取当前
			uni.getLocation({
			    type: 'wgs84',
			    success: function (res) {
			        console.log('当前位置的经度：' + res.longitude);
			        console.log('当前位置的纬度：' + res.latitude);
			    }
			});
			uni.getStorage({
			    key: 'region',
			    success: function (res) {
					this.show = false
					this.region = res.data
					this.down = true
			    }
			});
		},
		data() {
			return {
				banner: [], //轮播图
				list: [],//公告
				favorite: 1, //收藏
				department: [], //科室
				doctors:[], //医生列表
				scrollHeight: 0, //向上滚动距离
				height: 0, //.lis高度（滚动框高度）
				animationData: {}, //动画对象
				dotsStyles:{
					color:'#fff',
					backgroundColor:'#fff',
					border:'#fff',
				},
				current: 0,
				mode: 'round',
				show: true,
				down: false,
				type: 2,
				region:[],
				// defaultRegion:['山东省','济南市','市中区'],
				// defaultRegionCode:'370103',
				defaultRegion:['山东省','济南市'],
				defaultRegionCode:'3701',
				count: '123456'
			}
		},
		
		mounted() {
			this.prizeScroll();
		},
		computed:{
			//定位展示
			regionName(){
				// 转为字符串
				this.region.map(item=>item.name).join(' ')
				this.region = this.region.map(item=>item.name)[1]
				if(this.region !== undefined){
					uni.setStorage({
						key: 'region',
						data: this.region.slice(0,2),
						success:(()=> {
						   
						})
					});
					return this.region.slice(0,2)
				}else{
					return 
				}
			}
		},
		methods: {
			//公告
			getHeight(Class) {
				let query = uni.createSelectorQuery().in(this);
				query.selectAll(Class).boundingClientRect(data => {
					this.height = data[0].height;
				}).exec();
			},
			//定位
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
			change(e) {
				this.current = e.detail.current;
			},
			seach(){
				uni.setStorage({
				    key: 'head_title',
					data: '搜索',
				    success: function (res) {
						uni.redirectTo({
							url: './Model/search'
						});
					}
				});
			},
			inquiry_seach(){
				uni.setStorage({
				    key: 'head_title',
					data: '问诊',
				    success: function (res) {
						uni.redirectTo({
							url: './Model/search'
						});
					}
				});
			},
			consult_seach(){
				uni.setStorage({
				    key: 'head_title',
					data: '咨询',
				    success: function (res) {
						uni.redirectTo({
							url: './Model/search'
						});
					}
				});
			},
			service(){
				uni.redirectTo({
					url: './Model/service'
				});
			},
			// 获取选择的地区
			handleGetRegion(region){
				this.show = false
				this.region = region
				this.down = true
			},
			information(){
				uni.redirectTo({
					url: './Model/InformationDetails'
				});
			},
			detail(id){
				uni.setStorage({
					key: 'doctor_id',
					data: id,
					success:(()=> {
					   
					})
				});
				uni.redirectTo({
					url: './Model/DoctorDetails'
				});
			},
			// favoritea(){
			// 	this.favorite = 0
			// },
			// favoriteb(){
			// 	this.favorite = 1
			// }
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
		background: #f2f2f2;
		margin-top: 40rpx;
		.iconfont {
		  font-family: "iconfont" !important;
		  font-size: 16px;
		  font-style: normal;
		  -webkit-font-smoothing: antialiased;
		  -moz-osx-font-smoothing: grayscale;
		}
		.head_top{
			width: 100%;
			height: 190rpx;
			background: #4f9da2;
			position: fixed;
			top: 0rpx;
			z-index: 999;
			.headtitle{
				width:150rpx;
				height:46rpx;
				font-size:32rpx;
				font-family:PingFang SC;
				font-weight:bold;
				color:#fff;
				position: relative;
				top: 60rpx;
				left: 300rpx;
			}
			.headfunction{
				position: relative;
				top: 70rpx;
				.head_location{
					width: 95rpx;
					height: 60rpx;
					font-size: 26rpx;
					color: #333333;
					float: left;
					margin-right: 10rpx;
					text-align: center;
					line-height: 60rpx;
					margin-left: 10rpx;
					.region{
						width: 35rpx;
						height: 35rpx;
						background-size: cover;
						position: absolute;
						top: 10rpx;
						left: 35rpx;
					}
					.text{
						width: 50rpx;
						float: left;
						font-size: 22rpx;
						margin-right: 5rpx;
						color: #d3da41;
						font-weight: 600;
						margin-top: -10rpx;
					}

					.down{
						width: 25rpx;
						height: 25rpx;
						background-size: cover;
						float: left;
						margin-top: 10rpx;
						margin-left: 10rpx;
					}
				}
				.head_search{
					width: 70%;
					height: 60rpx;
					background: #fff;
					border-radius: 30rpx;
					float: left;
					.seach_pic{
						width: 40rpx;
						height: 40rpx;
						background-size: cover;
						float: left;
						margin-left: 100rpx;
						margin-top: 10rpx;
						margin-right: 20rpx;
					}
					.search_txt{
						height: 25rpx;
						font-size: 26rpx;
						float: left;
						margin-top: 10rpx;
					}
				}
				.information_box{
					position: relative;
					.information_quantity{
						width: 35rpx;
						height: 35rpx;
						position: absolute;
						top: -5rpx;
						right: 5rpx;
						background: #FF3333;
						border-radius: 50%;
						color: #fff;
						line-height: 35rpx;
						text-align: center;
						font-size: 16rpx;
					}
					.head_information{
						width: 100rpx;
						height: 60rpx;
						font-size: 50rpx;
						float: right;
						color: #f4ea2a;
						text-align: center;
						line-height: 60rpx;
						position: absolute;
						top: 0rpx;
						right: 0rpx;
					}
				}
				
			}
			
		}
		.more{
			height: 150rpx;
		}
		.main{
			width: 97%;
			z-index: 998;
			.bg{
				width: 100%;
				background: #fff;
				border-radius: 20rpx;
				margin-top: 15rpx;
			}
			.advertise{
				width: 100%;
				border-radius: 15rpx;
				margin-top: 15rpx;
				.advertise_pic{
					width: 100%;
					height: 100%;
					background-size: cover;
					border-radius: 15rpx;
				}
			}
			.subfield_advisory{
				height: 200rpx;
				.module{
					width: 30%;
					height: 95%;
					// background: #0077AA;
					margin-left: 2.3%;
					float: left;
					margin-top: 0.6%;
					border-radius: 10rpx;
					.iconfont{
						width: 65%;
						height: 65%;
						color: #000;
						font-size: 90rpx;
						margin-left: 17%;
						text-align: center;
						// line-height: 65%;
						// background-size: cover;
					}
					// .icon_pic{
					// 	width: 65%;
					// 	height: 65%;
					// 	color: #fff;
					// 	margin-left: 17%;
					// 	background-size: cover;
					// }
					// .pic3{
					// 	width: 50%;
					// 	height: 50%;
					// 	margin-top: 10rpx;
					// 	margin-left: 55rpx;
					// 	margin-bottom: 17rpx;
					// }
					.module_title{
						text-align: center;
					}
				}
			}
			.announcement_top{
				width: 100%;
				height: 70rpx;
				background: #fff;
				border-radius: 10rpx 10rpx 0 0;
				margin-top: 15rpx;
				.title{
					width: 80rpx;
					height: 40rpx;
					font-size: 26rpx;
					color: #169bd5;
					margin: 10rpx 17rpx;
					float: left;
					text-align: center;
				}
				.sign{
					width: 30rpx;
					height: 30rpx;
					float: left;
					margin-top: 10rpx;
				}
				.more{
					width: 100rpx;
					height: 40rpx;
					float: right;
					margin-top: 10rpx;
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
			.subfield_outpatient{
				height: 200rpx;
				margin-bottom: 35rpx;
				.outpatient_title{
					width: 120rpx;
					height: 40rpx;
					font-size: 26rpx;
					letter-spacing: normal;
					font-weight: 600;
					float: left;
					color: #333;
					margin-top: 10rpx;
					margin-left: 10rpx;
					text-align: center;
					line-height: 40rpx;
				}
				.outpatient_count{
					width: 250rpx;
					height: 40rpx;
					font-size: 18rpx;
					float: left;
					color: #333;
					margin-top: 10rpx;
					margin-left: 20rpx;
					text-align: center;
					line-height: 40rpx;
					.nub{
						color: red;
					}
				}
				.department{
					width: 75%;
					height: 120rpx;
					float: left;
					margin-left: 10rpx;
					margin-top: 20rpx;
					overflow: hidden;
					.department_code{
						width: 16%;
						height: 120rpx;
						float: left;
						margin-left: 0.5%;
						.department_icon{
							width: 95%;
							height: 70rpx;
							// background-size: cover;
							font-size: 62rpx;
							text-align: center;
							color: #1296db;
						}
						.department_name{
							width: 95%;
							height: 40rpx;
							font-size: 26rpx;
							text-align: center;
							line-height: 40rpx;
							color: #1296db;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
						}
					}
				}
				.all{
					width: 20%;
					height: 140rpx;
					margin-left: 20rpx;
					float: left;
					.all_box{
						width: 95%;
						height: 120rpx;
						float: left;
						margin-top: 30rpx;
						.all_pic{
							width: 60rpx;
							height: 60rpx;
							background-size: cover;
							margin-left: 36rpx;
						}
						.all_name{
							width: 95%;
							height: 40rpx;
							font-size: 26rpx;
							text-align: center;
							line-height: 40rpx;
							color: #1296db;
						}
					}
				}
			}
			.subfield_doctors{
				height: 340rpx;
				width: 100%;
				background: #fff;
				border-radius: 20rpx 20rpx 0rpx 0rpx;
				margin-top: -20rpx;
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
					height: 260rpx;
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
			.footer{
				width: 100%;
				height: 100rpx;
			}
		}
	}
</style>
