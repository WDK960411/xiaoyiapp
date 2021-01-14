import request from '@/common/request.js'
// let info = JSON.parse(localStorage.getItem("user_data"))
//实名认证
export function Authentication(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded',_token:info.data.token},
		url: '/yl/user/saveUserRealInfo',
		method: 'post',
		data: data
	})
}
//删除图片图片
export function DeletePhoto(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded',_token:info.data.token},
		url: '/yl/user/delete/idCard',
		method: 'post',
		data: data
	})
}
//退出
export function Logout(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded',_token:info.data.token},
		url: '/yl/logout',
		method: 'get',
		data: data
	})
}
//获取用户认证信息
export function GetInfo(data) {
	return request({
		// headers: {'Content-Type':'application/x-www-form-urlencoded',_token:info.data.token},
		url: '/yl/user/getUserRealInfo'+'/'+data,
		method: 'get'
	})
}