/* eslint-disable */
import api from './instance'

/**
 * @method 手机登录
 * @params phone 用户id
 */
export const login = (phone, password) =>
  api.get(`/login/cellphone?phone=${phone}&password=${password}`, {
    withCredentials: true
  })

/**
* @method 验证码登录
* @params phone 用户id captcha 验证码
*/
export const captchalogin = (phone, password) =>
  api.get(`/login/cellphone?phone=${phone}&captcha=${password}`, {
    withCredentials: true
  })

/**
 * @method 获取验证码
 * @params phone 用户id
 */
export const getCtcode = (phone) =>
  api.get(`/captcha/sent?phone=${phone}`, {
    withCredentials: true
  })


/**
 * @method 验证验证码
 * @params phone 用户id
 */
export const checkCtcode = (phone, captcha) =>
  api.get(`/captcha/verify?phone=${phone}&captcha=${captcha}`, {
    withCredentials: true
  })



/**
 * @method 获取用户详情
 * @params uid 用户id
 */
export const getUserDetail = uid => api.get(`/user/detail?uid=${uid}`, {})

/**
 * @method 获取用户播放记录
 * @params uid 用户 id
 * @params type : type=1 时只返回 weekData, type=0 时返回 allData
 */

export const getUserRecord = (uid, type) =>
  api.get(`/user/record?uid=${uid}&type=${type}`, {})

/**
 * @method 获取用户歌单
 * @params uid 用户 id
 */

export const getUserArtist = uid => api.get(`/user/playlist?uid=${uid}`, {})


/**
 * @method 获取用户关注列表
 * @params uid 用户 id
 * @params limit 返回数量
 * @params offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
export const getUserFollows = (uid, limit = 30, offset = 0) => api.get(`/user/follows?uid=${uid}&limit=${limit}&offset=${offset}`, {})


/**
 * @method 获取用户粉丝列表
 * @params uid 用户 id
 * @params limit 返回数量
 * @params offset 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 */
 export const getUserFolloweds = (uid, limit = 30, offset = 0) => api.get(`/user/followeds?uid=${uid}&limit=${limit}&offset=${offset}`, {})


/**
* @method 获取喜欢列表
*/
export const getLikeList = uid => api.get(`/likelist?uid=${uid}`, {})