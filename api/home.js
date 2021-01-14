import request from '@/common/request.js'
//轮播图
export function GetAdvertise(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/slide/list',
		method: 'post',
		data: data
	})
}
//公告
export function GetAnimation(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/annos/list',
		method: 'post',
		data: data
	})
}
//专科门诊
export function GetDepartment(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/discipline/list',
		method: 'post',
		data: data
	})
}
//专家名医
export function GetDoctor(data) {
	// let info = JSON.parse(localStorage.getItem("user_data"))
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded',_token:info.data.token},
		url: '/yl/doctor/list',
		method: 'post',
		data: data
	})
}
//医生信息
export function DoctorDetails(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/doctor/get',
		method: 'post',
		data: data
	})
}