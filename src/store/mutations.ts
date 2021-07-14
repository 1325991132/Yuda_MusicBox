import * as types from './mutations-type'


const mutations = {
    [types.SET_LOGINSTATU](state, loginStatu) {
        console.log('执行loginStatu', loginStatu)
        state.loginStatu = loginStatu
    },
    [types.SET_USERINFO](state,userInfo){
        console.log('执行SET_USERINFO',userInfo)
        state.userInfo = userInfo
    }
}

export default mutations