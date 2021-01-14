import request from '@/common/request.js'

// 登录 —— 用户登陆
export function Login(data) {
	return request({
		headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/login',
		method: 'post',
		data: data
	})
}
// 登录 —— 重新获取验证码
export function Regain(data) {
	return request({
		headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/captcha/create',
		method: 'get',
		data: data
	})
}
// 注册 —— 获取验证码
export function getCode(data) {
	return request({
		headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/sms/sms/send',
		method: 'post',
		data: data
	})
}
// 注册 —— 注册
export function Register(data) {
	return request({
		headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/user/register',
		method: 'post',
		data: data
	})
}
// 忘记密码 —— 提交
export function ResetPassword(data) {
	return request({
		headers: {'Content-Type':'application/x-www-form-urlencoded'},
		url: '/yl/user/forgetPassword',
		method: 'post',
		data: data
	})
}