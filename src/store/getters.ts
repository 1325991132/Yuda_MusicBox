/* eslint-disable */
// 登录状态
export const loginStatu: any = state => {
   const res_Statu = window.localStorage.getItem('loginStatu')
   if (res_Statu) {
      return state.loginStatu || JSON.parse(res_Statu)
   }
   return state.loginStatu
}

// 用户信息
export const userInfo: any = state => {
   const res_userInfo = window.localStorage.getItem('userInfo')
   if (res_userInfo) {
      return state.userInfo || JSON.parse(res_userInfo)
   }
   return state.userInfo
}

// 播放状态
export const playing: any = state => state.playing

// 当前播放的歌曲
export const currentSong: any = state => {
   return state.playList[state.currentIndex] || {}
}

// 播放列表
export const playList: any = state => state.playList

// 播放模式
export const mode: any = state => state.mode

// 当前播放索引
export const currentIndex: any = state => state.currentIndex

// 顺序列表
export const sequenceList: any = state => state.sequenceList

// 近期播放列表
export const historyList: any = state => state.historyList

// 喜欢列表
export const likeSongsList: any = state => state.likeSongs

// 获取用户设备类型
export const getUserDevice:any = state => state.userDevice