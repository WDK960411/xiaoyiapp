<template>
	<view class="content">
		<view class="top">
			<view class="iconfont icon-fanhui" style="color: #fff;" @tap="getback"></view>
			<view class="txt">患者修改</view>
		</view>
		<view class="main">
			<view class="patient">
				<view class="box name">
					<view class="title">
						真实姓名:
					</view>
					<input class="input_text uni-input" @input="InputName" v-model="name" placeholder="" />
				</view>
				<view class="box cardId">
					<view class="title">
						身份证号:
					</view>
					<input class="input_text uni-input"  @input="InputCardId" v-model="cardId" placeholder="" />
				</view>
				<view class="box birth">
					<view class="title">
						出生日期:
					</view>
					<view class="input_text select" @click="openDatetimePicker">
						{{birth ? birth: "请选择"}}
					</view>
					<simple-datetime-picker ref="myPicker" @submit="handleSubmit" :start-year="1900" :end-year="2030" color="#488ee9"></simple-datetime-picker>
				</view>
				<view class="box sex">
					<view class="title">
						性别:
					</view>
					<view class="input_text">
						<radio-group @change="radioChange">
							<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in items" :key="item.value">
								<view style="float: left;">
									<radio :value="item.value" :checked="index === current" />
								</view>
								<view style="float: left;margin-right: 30rpx;">{{item.sex}}</view>
							</label>
						</radio-group>
					</view>
				</view>
				<view class="box type">
					<view class="uni-form-item uni-column">
						<picker @change="bindPickerChange" :range="array">
							<label class="title">关系：</label>
							<label class="input_text">{{array[type]}}</label>
						</picker>
					</view>
				</view>
				<view class="box remark">
					<view class="title">
						备注:
					</view>
					<input class="input_text uni-input" @input="InputRemark" v-model="remark" placeholder="患者备注" />
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="del" @tap="del">删除患者</view>
			<view class="save" @tap="Save">保存修改</view>
		</view>
	</view>
</template>

<script>
	import simpleDatetimePicker from '@/components/buuug7-simple-datetime-picker/simple-datetime-picker'
	import http from '@/common/http.js'  //uni-app request封装
	export default {
		components: {
			simpleDatetimePicker
		},
		data() {
			return {
				id:'',
				name: '',
				cardId: '',
				birth: '',
				sex: 1,
				sextext: '男',
				type:'',
				remark:'',
				items: [
					{
						value: '1',
						sex: '男'
					},
					{
						value: '2',
						sex: '女'
					}
				],
				array:['本人','子女','父母','其他家人','朋友同事','其他'],
				current: 0
			}
		},
		onLoad() {
			let that = this
			this.id = JSON.parse(localStorage.getItem("patient_id")).data
			uni.getStorage({
			    key: 'patient_id',
			    success: function (res) {
			       that.id = res.data;
				   const GetPatient = http('/yl/patients/'+that.id, {
				   	option:{
				   		method: 'get'
				   	},
				       success: res => {
				   		switch(res.code) {
				   		    case 200:
				   			that.name = res.data.name
				   			that.cardId = res.data.cardId
				   			that.birth = res.data.birth
				   			that.current = res.data.sex-1
				   			that.type = res.data.type-1
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
				   				title: '网络异常',
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
			
		},
		methods: {
			//返回
			getback() {
				uni.redirectTo({
					url: './SelectPatient'
				});
			},
			//姓名
			InputName (event) {
				this.name = event.target.value
			},
			//身份证号
			InputCardId (event) {
				this.cardId = event.target.value
			},
			//备注
			InputRemark(){
				this.Remark = event.target.value
			},
			// 打开picker
			openDatetimePicker() {
				this.$refs.myPicker.show();
			},
			// 关闭picker
			closeDatetimePicker() {
				this.$refs.myPicker.hide();
			},
			// 出生日期
			handleSubmit(e) {
				this.birth = `${e.year}-${e.month}-${e.day}`;
			},
			//性别
			radioChange (evt) {
				this.sex = evt.target.value
				if(this.sex === 1){
					this.sextxt = '男'
				} 
				if(this.sex === 2){
					this.sextxt = '女'
				}
				for (let i = 0; i < this.items.length; i++) {
					if (this.items[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			//类型
			bindPickerChange: function(e) {	
				this.type = e.target.value
			},
			del(){
				const SavePatient = http('/yl/patients/'+this.id, {
					option:{
						method: 'DELETE'
					},
				    success: res => {
						switch(res.code) {
						    case 200:
							uni.showToast({
								title: '删除患者成功',
								icon: "none"
							});
							uni.redirectTo({
								url: './SelectPatient'
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
								title: '网络异常',
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
			//保存患者
			Save(){
				if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.cardId))) {
					uni.showToast({
						title: '身份证号输入有误',
						icon: "none"
					});
				} else  if(this.name === ''){
					uni.showToast({
						title: '请输入真实姓名',
						icon: "none"
					});
				} else if(this.birth === ''){
					uni.showToast({
						title: '请选择出生日期',
						icon: "none"
					});
				} else if(this.sex === ''){
					uni.showToast({
						title: '请选择性别',
						icon: "none"
					});
				} else if(this.type === '') {
					uni.showToast({
						title: '请选择患者关系',
						icon: "none"
					});
				} else{
					const SavePatient = http('/yl/patients/revise', {
						data:{
							id:this.id,
							name : this.name,
							cardId : this.cardId,
							birth : this.birth,
							sex : this.sex,
							type :this.type+1,
							remark:this.remark
						},
					    success: res => {
							switch(res.code) {
							    case 200:
								uni.showToast({
									title: '添加患者成功',
									icon: "none"
								});
								uni.redirectTo({
									url: './SelectPatient'
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
									title: '网络异常',
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
		}
	}
</script>

<style lang="scss">
	@import url("../../../static/iconfont/iconfont.css");

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.top {
			width: 100%;
			height: 125rpx;
			background: #4f9da2;
			position: relative;

			.iconfont {
				font-size: 40rpx;
				color: #fff;
				float: left;
				position: absolute;
				top: 55rpx;
				left: 15rpx;
			}

			.txt {
				font-size: 36rpx;
				font-family: PingFang SC;
				font-weight: bold;
				color: #fff;
				text-align: center;
				margin-top: 55rpx;
				margin-left: -15rpx;
			}
		}

		.main {
			width: 95%;
			margin-top: 20rpx;
			.patient {
				width: 100%;
				height: 400rpx;
				box-sizing: border-box;
				.box{
					width: 100%;
					height: 70rpx;
					line-height: 70rpx;
					border-bottom: 2rpx #B2B2B2 solid;
					box-sizing: border-box;
					margin-top: 15rpx;
					.title{
						width: 20%;
						height: 70rpx;
						float: left;
					}
					.input_text{
						width: 75%;
						height: 70rpx;
						float: left;
						margin-left: 4%;
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
			.del, .save{
				width: 45%;
				height: 70rpx;
				color: #fff;
				font-size: 30rpx;
				line-height: 70rpx;
				margin-top: 20rpx;
				text-align: center;
				border-radius: 50rpx;
			}
			.del{
				float: left;
				background: #F76260;
				
				margin-left: 2%;
			}
			.save{
				float: right;
				background: #00B26A;
				margin-right: 2%;
			}
		}
	}
</style>
