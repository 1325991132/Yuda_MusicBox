/* eslint-disable */
// 登录状态
export const loginStatu = state => {
   const res_Statu = window.localStorage.getItem('loginStatu')
   if (res_Statu) {
      return state.loginStatu || JSON.parse(res_Statu)
   }
   return state.loginStatu
}

// 用户信息
export const userInfo = state => {
   const res_userInfo = window.localStorage.getItem('userInfo')
   if (res_userInfo) {
      return state.userInfo || JSON.parse(res_userInfo)
   }
   return state.userInfo
}

// 播放状态
export const playing = state => state.playing

// 当前播放的歌曲
export const currentSong = state => {
   return state.playList[state.currentIndex] || {}
}

// 播放列表
export const playList = state => state.playList

// 播放模式
export const mode = state => state.mode

// 当前播放索引
export const currentIndex = state => state.currentIndex

// 顺序列表
export const sequenceList = state => state.sequenceList
