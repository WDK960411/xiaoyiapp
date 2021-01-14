<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">选择患者</view>
		</view>
		<view class="main">
			<view class="header_title">
				请选择患者信息
			</view>
			<view class="header_txt">
				确保医生诊断准确，信息仅咨询医生可见
			</view>
			<view class="select_patient" @tap="addpatient">
				添加患者
			</view>
			<view class="patients_content" v-if="patient_show">
				<view class="patient_info" v-for="(item,index) in patient_info" :key="item.id" >
					<view class="choose_header">
						<!-- <view class="choose_box choose" @tap="choosepatient(item.id)" v-if="choose_show">
							选择
						</view>
						<view class="choose_box choose_active" @tap="activepatient(item.id)" v-if="active_show">
							选中
						</view> -->
						<radio-group @change="radioChange(item.id)" class="choose_box">
							<label class="uni-list-cell uni-list-cell-pd">
								<view style="float: left;">
									<radio :checked="index === current" />
								</view>
							</label>
						</radio-group>
						<view class="choose_box edit" @tap="editpatient(item.id)" v-if="item.id!==12">
							编辑
						</view>
					</view>
					<view class="info patient_name">
						患者姓名：&nbsp;{{item.name}}
					</view>
					<view class="info patient_birth">
						出生日期：&nbsp;{{item.birth}}
					</view>
					<view class="info patient_sex">
						患者性别：&nbsp;{{item.sex | sex}}
					</view>
					<view class="info patient_sex">
						患者关系：&nbsp;{{item.type | type}}
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<button class="next_step" @tap="NextStep()">下一步</button>
		</view>
	</view>
</template>

<script>
	import http from '@/common/http.js'  //uni-app request封装
	export default {
		components:{
			
		},
		data() {
			return {
				patient_show: false,
				choose_show: true,
				active_show: false,
				patient_id: 12,
				current: 0,
				patient_info:[
					// {
					// 	id:'8',
					// 	name: '张三',
					// 	birth: '1996-04-11',
					// 	cardId:'370112199604116414',
					// 	sex: '男'
					// }
				]
			}
		},
		filters: {
			sex: function(value){
				if ( value === 1 ) return '男'
				if ( value === 2 ) return '女'
			},
			type:function(value){
				if ( value === 1 ) return '本人'
				if ( value === 2 ) return '子女'
				if ( value === 3 ) return '父母'
				if ( value === 4) return '其他家人'
				if ( value === 5) return '朋友同事'
				if ( value === 6) return '其他'
			}
		},
		onLoad() {
			const GetPatient = http('/yl/patients/getPatients', {
				option:{
					method: 'get'
				},
			    success: res => {
					switch(res.code) {
					    case 200:
						this.patient_show = true
						this.patient_info = res.data
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
		},
		methods: {
			//返回
			getback(){
				uni.redirectTo({
				    url: './OnlineinQuiry'
				});
			},
			//添加患者
			addpatient(){
				uni.redirectTo({
				    url: './AddPatient'
				});
			},
			//编辑患者
			editpatient(id){
				let patient_id = id
				uni.setStorage({
					key: 'patient_id',
					data: patient_id,
					success:(()=> {
					   
					})
				});
				uni.redirectTo({
				    url: './EditPatient'
				});
			},
			radioChange (id) {
				this.patient_id = id
				for (let i = 0; i < this.patient_info.length; i++) {
					if (this.patient_info[i].id === id) {
						this.current = i;
						break;
					}
				}
			},
			//下一步
			NextStep(){
				let that = this
				uni.getStorage({
				    key: 'inquiry_id',
				    success: function (res) {
				        // console.log(res.data);
				        let inquiryid = res.data;
						if(that.patient_id === ''){
							uni.showToast({
								title: '请选择患者',
								icon: "none"
							});
						} else {
							const GoPay = http('/yl/inquiry/set/patient', {
								data:{
									inquiryId:inquiryid,
									patientId:that.patient_id
								},
							    success: res => {
									switch(res.code) {
									    case 200:
										uni.redirectTo({
										    url: './InquiryPay'
										});
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
			.header_title{
				height: 40rpx;
				font-size: 32rpx;
				font-family:PingFang SC;
				font-weight: 600;
				color:#000;
				text-align: left;
			}
			.header_txt{
				height: 30rpx;
				font-size: 24rpx;
				font-family:PingFang SC;
				color:#BEBEBE;
				text-align: left;
				margin-top: 10rpx;
			}
			.select_patient{
				width: 100%;
				height: 80rpx;
				font-size: 28rpx;
				font-family:PingFang SC;
				color:#fff;
				text-align: center;
				margin-top: 10rpx;
				line-height: 80rpx;
				background: #1AAD19;
				border-radius: 10rpx;
				margin-top: 40rpx;
			}
			.patients_content{
				width: 95%;
				height: 820rpx;
				margin-top: 20rpx;
				overflow: auto;
				box-sizing: border-box;
				position: fixed;
				top: 340rpx;
				overflow: auto;
				.patient_info{
					width: 100%;
					height: 220rpx;
					border: 3rpx #00B26A solid;
					border-radius: 10rpx;
					margin-top: 10rpx;
					box-sizing: border-box;
					padding: 15rpx;
					position: relative;
					.choose_header{
						width: 160rpx;
						height: 50rpx;
						// border: 2rpx #09BB07 solid;
						box-sizing: border-box;
						position: absolute;
						top: 10rpx;
						right: 15rpx;
						.choose_box{
							width: 75rpx;
							height: 50rpx;
							text-align: center;
							line-height: 50rpx;
							font-size: 28rpx;
							float: left;
							box-sizing: border-box;
						}
						.edit{
							color: #00B26A;
						}
						.choose{
							color: #F0AD4E;
						}
						.choose_active{
							color: #FF3333;
						}
					}
					.info{
						height: 30rpx;
						line-height: 30rpx;
						font-size: 32rpx;
						font-family: PingFang SC;
						text-align: left;
						margin-top: 15rpx;
						color: #555555;
					}
				}
			}
		}
		.footer{
			width: 100%;
			height: 140rpx;
			position: fixed;
			bottom: 0rpx;
			border-top: 2rpx #eee solid;
			.next_step{
				width: 100%;
				height: 80rpx;
				background: #4f9da2;
				color: #fff;
				font-size: 30rpx;
				line-height: 80rpx;
				border-radius: 50rpx;
				margin-top: 10rpx;
			}
		}
	}
</style>
