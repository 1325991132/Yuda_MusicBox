// 登录状态
export const loginStatu = state => {
    let res_Statu = window.localStorage.getItem('loginStatu')
    if(res_Statu){
       return state.loginStatu || JSON.parse(res_Statu)
    }
    return state.loginStatu
  }