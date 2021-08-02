let api_base_url = ''
// api_base_url = 'http://localhost:3000'

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  api_base_url = 'http://localhost:3000'
  // api_base_url = 'https://nicemusic-api.lxhcool.cn/'
} else if (process.env.NODE_ENV === 'production') {
  api_base_url = 'https://nicemusic-api.lxhcool.cn/'
}

export default { api_base_url }
