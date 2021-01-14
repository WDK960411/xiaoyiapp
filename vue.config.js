const path = require('path')

module.exports = {
	devServer: {
		host: '0.0.0.0',
		port: 8080,
		open: true,
		proxy: {
			// detail: https://cli.vuejs.org/config/#devserver-proxy
			['/api']: {
				target: `https://test.xiaoyiyiliao.com:8000`, //服务器地址
				// target: `http://192.168.0.225:8001`, //联调后端地址1
				// target: `http://192.168.0.81:8001`, //联调后端地址2
				changeOrigin: true,
				pathRewrite: {
					['^' + '/api']: ''
				}
			}
		},
		disableHostCheck: true
	},
	lintOnSave: false, // 关闭格式检查
	productionSourceMap: false // 打包时不会生成 .map 文件，加快打包速度
}
