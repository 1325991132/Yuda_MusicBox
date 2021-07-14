// 登录状态
export const loginStatu = state => {
   const res_Statu = window.localStorage.getItem('loginStatu')
   if (res_Statu) {
      return state.loginStatu || JSON.parse(res_Statu)
   }
   return state.loginStatu
}

export const userInfo = state=>{
   const res_userInfo = window.localStorage.getItem('userInfo')
   if(res_userInfo){
      return state.userInfo || JSON.parse(res_userInfo)
   }
   return state.userInfo
}