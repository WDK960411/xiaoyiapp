// const baseUrl = 'https://test.xiaoyiyiliao.com:8000' //服务器地址
// const baseUrl = 'http://192.168.0.177:8001' //王健后端联调地址1
const baseUrl = 'http://192.168.0.215:8001' //梁林生联调地址2

const showToast = (title) => {
    uni.showToast({
        title: title,
        icon: 'none'
    })
}

const http = (url, obj) => {
    let option = obj.option || {}
    let hideLoading = option.hideLoading || false 
    let hideMsg = option.hideMsg || false 
    let data = obj.data || {} 
	const token = uni.getStorageSync('_token')
    if (!hideLoading) {
        uni.showLoading({
            title: '加载中...',
            mask: true
        })
    }
    return uni.request({
        url: baseUrl + url,
        method: option.method || 'POST', 
        header: {
            '_token': token,
			'Content-Type':option.ContentType || 'application/x-www-form-urlencoded'
        },
        data: data,
        success: res => { 
			// 接口调用成功的回调函数
            if (!hideLoading) uni.hideLoading()
            if (res.statusCode === 200) {
                let result = res.data
				if (obj.success) obj.success(result)
				return
            } else if(res.statusCode === 403){
				if (obj.fail) obj.fail('登录过期请重新登录')
				return
			}
        },
        fail: (err) => { 
			// 接口调用失败的回调函数
            if (!hideLoading) uni.hideLoading()
            if (err.errMsg != 'request:fail abort') {
                showToast('连接超时，请检查您的网络。')
                if (obj.fail) obj.fail('连接超时，请检查您的网络。')
            }
        }
    })
}
export default http