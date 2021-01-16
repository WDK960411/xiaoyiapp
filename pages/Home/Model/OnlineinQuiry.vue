<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">在线问诊</view>
		</view>
		<view class="main">
			<view class="doctor_info">
				<view class="doctors_photo">
					<image :src="doctor_info.avatar" class="photos"></image>
				</view>
				<view class="doctor_content">
					<view class="info_one">
						<view class="doctor_name">
							{{doctor_info.realName}}
						</view>
						<view class="doctor_rank">
							{{doctor_info.title}}
						</view>
					</view>
					<view class="info_two">
						<view class="doctor_department">
							{{doctor_info.subject}}
						</view>
						<view class="doctor_hospital">
							{{doctor_info.hospital}}
						</view>
					</view>
					<view class="info_three">
							擅长：{{doctor_info.goodAt}}
					</view>
				</view>
			</view>
			<view class="describe">
				<view class="area symptom">
					<view class="title">
						症状描述：
					</view>
					<textarea @blur="SymptomInfo" class="input_txt" v-model="symptom" placeholder="请输入症状描述" maxlength="200"/>
				</view>
				<view class="area duration">
					<view class="title">
						患病时长：
					</view>
					<textarea @blur="DurationInfo" class="input_txt" v-model="duration" placeholder="请输入患病时长" maxlength="70"/>
				</view>
				<view class="area drug">
					<view class="title">
						服药情况：
					</view>
					<textarea @blur="DrugInfo" class="input_txt" v-model="drug" placeholder="请输入服药情况" maxlength="70"/>
				</view>
			</view>
			<view class="inspect_photos">
				<view class="uplod_pic" @tap="chooseImage">
					上传图片
				</view>
				<view class="pic" v-if="show_pic" v-for="(item,index) in pic" :key="index">
					<view class="iconfont icon-chahao" @tap="delpic(item.id)"></view>
					<image :src="item.url" class="pics"></image>
				</view>
			</view>
			<view class="button">
				<button class="next_step" @tap="NextStep">下一步</button>
			</view>
			<uni-popup ref="popupa" type="dialog">
			    <uni-popup-dialog type="success" title="是否加载之前草稿" :duration="0" :before-close="true" @close="closea" @confirm="confirma"></uni-popup-dialog>
			</uni-popup>
			<uni-popup ref="popupb" type="dialog">
			    <uni-popup-dialog type="warn" title="是否保存当前草稿" :duration="0" :before-close="true" @close="closeb" @confirm="confirmb"></uni-popup-dialog>
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
				doctor_info:{
					// avatar:'',
					// realName: '王华林',
					// title: '主任医师',
					// subject:'儿科',
					// hospital:'山东省第五人民医院',
					// goodAt:'小儿哮喘，儿童厌食,小儿哮喘，儿童厌食,小儿哮喘，儿童厌食,小儿哮喘，儿童厌食,小儿哮喘，儿童厌食,小儿哮喘，儿童厌食'
				}, //医生简述
				symptom:"", //症状描述
				duration:"", //患病时长
				drug:"",//服药情况
				show_pic: false,
				pic:[],
				inquiryId:'',//问诊id
				token:'',
				doctor_id:''//医生id
				
			}
		},
		onLoad() {
			let that = this
			uni.getStorage({
			    key: 'doctor_info',
			    success: function (res) {
					that.doctor_info = res.data
			    }
			});
			uni.getStorage({
			    key: 'doctor_id',
			    success: function (res) {
			        that.doctor_id = res.data;
			    }
			});
			// this.doctor_info =  JSON.parse(localStorage.getItem("doctor_info")).data
			// this.doctor_id =  JSON.parse(localStorage.getItem("doctor_id")).data
			// console.log('token',this.token)
			const GetDraft = http('/yl/inquiry/draft', {
				option:{
					method: 'get'
				},
			    success: res => {
					switch(res.code) {
					    case 200:
						// console.log(res)
						if(res.data === null){
							
						} else {
							uni.setStorage({
								key: 'draft_info',
								data: res.data,
								success:(()=> {
								   this.$refs.popupa.open()
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
			
		},
		methods: {
			//返回
			getback(){
				if(this.symptom!==''||this.duration !==''||this.drug!==''||this.pic[0] ==='undefined'){
					this.$refs.popupb.open()
				} else{
					uni.redirectTo({
						url: './DoctorDetails'
					});
				}
			},
			confirma(done){
				done()
				let that = this
				uni.getStorage({
				    key: 'draft_info',
				    success: function (res) {
				        // console.log(res.data);
				        let draft = res.data;
						that.symptom = draft.contentMap.symptom
						that.duration = draft.contentMap.timeLength
						that.drug = draft.contentMap.medic
						that.inquiryId = draft.id
						if(draft.images !== ''){
							that.show_pic = true
							that.pic = draft.images
						}
				    }
				});
			},
			closea(done){
				done()
			},
			closeb(done){
				done()
				uni.redirectTo({
				    url: './DoctorDetails'
				});
			},
			confirmb(done){
				done()
				const SaveDraft = http('/yl/inquiry/save', {
					data:{
						doctorId:this.doctor_id,
						id:this.inquiryId,
						medic:this.drug,
						symptom:this.symptom,
						timeLength:this.duration
					},
				    success: res => {
						// console.log('保存草稿',res)
						switch(res.code) {
						    case 200:
							uni.redirectTo({
							    url: './DoctorDetails'
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
				
			},
			SymptomInfo: function (e) {
				this.symptom = e.detail.value
				// console.log('症状描述:',e.detail.value)
			},
			DurationInfo: function (e) {
				this.duration = e.detail.value
				// console.log('患病时长:',e.detail.value)
			},
			DrugInfo: function (e) {
				this.drug = e.detail.value
				// console.log('服药情况:',e.detail.value)
			},
			chooseImage() {
				var that = this;
				uni.chooseImage({
					count: 6,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						// console.log('res',res)
						let resimg = res
						uni.getStorage({
						    key: 'user_data',
						    success: function (res) {
						        let info = res.data;
						        // console.log('info',info);
								//图片的本地文件路径列表
								uni.uploadFile({
									url: 'https://test.xiaoyiyiliao.com:8000/yl/qiNiuFile/upload',   //服务器地址
									// url: 'http://192.168.0.215:8001/yl/qiNiuFile/upload', //梁林生地址1
									// url: 'http://192.168.0.177:8001/yl/qiNiuFile/upload', //王健联调地址2
									headers:{
										'Content-Type':'multipart/form-data'
									},
									filePath: resimg.tempFilePaths[0],
									name: 'file',
									formData:{
										"_token": info.token
									},
									success: function (res) {
										// console.log('上传图片',res)
										if(res.statusCode === 200){
											let url =  (JSON.parse(res.data).data)
											const SavePic = http('/yl/inquiry/save/image', {
												data:{
													imageUrl: url,
													inquiryId:that.inquiryId
												},
											    success: res => {
													// console.log('保存图片',res)
													that.show_pic = true
													let img = {}
													img.id = res.data.id
													img.url = url
													that.pic.push(img)
													that.inquiryId = res.data.inquiryId
												},
												fail: err => {
													uni.showToast({
														title: res.msg,
														icon: "none"
													});
												}
											})
											
										}
										// console.log('图片数据',that.pic)
									},
									fail: () => {}
								})
						    }
						});
						
					}
				});
			},
			delpic(id){
				const DelPic = http('/yl/inquiry/del/image/'+id, {
					option:{
						method: 'DELETE'
					},
				    success: res => {
						// console.log('删除图片',res)
						if(res.code === 200){
							var newpic = this.pic.filter( function (element, index) {
								if( id !== element.id){
								  return true;
								}else{
								  return false;
								}
							})
							this.pic = newpic
						} else {
							uni.showToast({
								title: res.msg,
								icon: "none"
							});
						}
						if(res.code === 403){
							uni.showToast({
								title: '登录过期,请重新登录',
								icon: "none"
							});
							uni.reLaunch({
								url: '../../login/login'
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
			},
			NextStep(){
				if(this.symptom === ''){
					uni.showToast({
						title: '请输入症状描述',
						icon: "none"
					});
				} else {
					const SaveDraft = http('/yl/inquiry/save', {
						data:{
							doctorId:this.doctor_id,
							id:this.inquiryId,
							medic:this.drug,
							symptom:this.symptom,
							timeLength:this.duration
						},
					    success: res => {
							// console.log('保存草稿',res)
							if(res.code === 200){
								uni.setStorage({
									key: 'inquiry_id',
									data: res.data.id,
									success:(()=> {
									   
									})
								});
								uni.redirectTo({
									url: './SelectPatient'
								});
							} else {
								uni.showToast({
									title: res.msg,
									icon: "none"
								});
							}
							if(res.code === 403){
								uni.showToast({
									title: '登录过期,请重新登录',
									icon: "none"
								});
								uni.reLaunch({
									url: '../../login/login'
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
				}
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
			.doctor_info{
				width: 100%;
				height: 160rpx;
				margin: 0 auto;
				position: relative;
				z-index: 995;
				border-radius: 10rpx;
				// border: 2rpx #00B26A solid;
				box-sizing: border-box;
				.doctors_photo{
					width: 140rpx;
					height: 140rpx;
					border: #ccc 2rpx solid;
					background-size: cover;
					// margin: 20rpx 15rpx;
					position: absolute;
					top: 10rpx;
					left: 10rpx;
					box-sizing: border-box;
					.photos{
						width: 135rpx;
						height:135rpx;
						background-size: cover;
					}
				}
				.doctor_content{
					width: 540rpx;
					height: 140rpx;
					box-sizing: border-box;
					position: absolute;
					top: 10rpx;
					left: 160rpx;
					.info_one{
						width: 80%;
						height: 35rpx;
						font-style: normal;
						font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
						float: left;
						.doctor_name{
							float: left;
							font-size: 26rpx;
							font-weight: 600;
							margin-right: 10rpx;
						}
						.doctor_rank{
							float: left;
							font-size: 22rpx;
							font-weight: 600;
						}
					}
					.info_two{
						width: 80%;
						height: 30rpx;
						font-style: normal;
						font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
						float: left;
						.doctor_department, .doctor_hospital{
							float: left;
							font-size: 24rpx;								
							font-weight: 600;
							margin-right: 20rpx;
							display: -webkit-box;
							-webkit-box-orient: vertical;    
							-webkit-line-clamp: 1;    
							overflow: hidden;
						}
					}
					.info_three{
						width: 100%;
						height: 60rpx;
						font-style: normal;
						font-family: 'Arial Negreta', 'Arial Normal', 'Arial', sans-serif;
						font-size: 22rpx;
						display: -webkit-box;    
						-webkit-box-orient: vertical;    
						-webkit-line-clamp: 2;    
						overflow: hidden;
						margin-top: 5rpx;
						float: left;
					}
				}
			}
			.describe{
				width: 100%;
				height: 415rpx;
				// border: 2rpx #3F536E solid;
				box-sizing: border-box;
				margin-top: 10rpx;
				border-radius: 10rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.area{
					width: 100%;
					height: 130rpx;
					border-bottom: 2rpx #eee solid;
					margin-top: 5rpx;
					border-radius: 6rpx;
					box-sizing: border-box;
					padding: 0rpx 10rpx;
					.title{
						width: 100%;
						height: 40rpx;
						font-size: 28rpx;
					}
					.input_txt{
						width: 100%;
						height: 80rpx;
						font-size: 20rpx;
					}
				}
			}
			.inspect_photos{
				width: 100%;
				height: 300rpx;
				border: 2rpx #aaa dashed;
				box-sizing: border-box;
				margin-top: 10rpx;
				border-radius: 10rpx;
				overflow:auto;
				padding: 10rpx;
				.uplod_pic{
					width: 125rpx;
					height: 125rpx;
					border: 2rpx #BEBEBE solid;
					border-radius: 10rpx;
					text-align: center;
					line-height: 125rpx;
					font-size: 28rpx;
					color: #BEBEBE;
					box-sizing: border-box;
					float: left;
					margin-right: 12rpx;
					margin-bottom: 12rpx;
				}
				.pic{
					width: 125rpx;
					height: 125rpx;
					border: 2rpx #BEBEBE solid;
					border-radius: 10rpx;
					box-sizing: border-box;
					float: left;
					margin-right: 12rpx;
					margin-bottom: 12rpx;
					position: relative;
					z-index: 98;
					.pics{
						width: 100%;
						height: 100%;
						background-size: cover;
						z-index: 99;
					}
					.icon-chahao{
						font-size: 26rpx;
						color: #FF3404;
						position: absolute;
						top: -10rpx;
						right: -10rpx;
						z-index: 100;
					}
				}
			}
			.button {
				width: 100%;
				height: 100rpx;
				margin-top: 20rpx;
				.next_step {
					width: 100%;
					height: 100rpx;
					background: #4f9da2;
					color: #fff;
					font-size: 36rpx;
				}
			}
		}
	}
</style>
