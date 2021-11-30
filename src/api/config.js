let api_base_url = ''
// api_base_url = 'http://localhost:3000'
// 公网 192.27.157.96:3000

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  api_base_url = 'http://localhost:3000'
} else if (process.env.NODE_ENV === 'production') {
  api_base_url = 'https://www.qyd123.cn:3000/'
}

export default { api_base_url }
