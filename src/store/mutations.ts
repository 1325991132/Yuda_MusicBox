import * as types from './mutations-type'

const mutations = {
    [types.SET_LOGINSTATU](state, loginStatu) {
        console.log('执行loginStatu', loginStatu)
        state.loginStatu = loginStatu
    },
    [types.SET_USERINFO](state,userInfo){
        console.log('执行SET_USERINFO',userInfo)
        state.userInfo = userInfo
    },
    [types.SET_SEARCH_HISTORY](state,history){
        state.searchHistory = history
    }
}

export default mutations