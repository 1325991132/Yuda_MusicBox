const mutations = {
    SET_LOGINSTATU(state, loginStatu) {
        console.log('执行loginStatu', loginStatu)
        state.loginStatu = loginStatu
    }
}

export default mutations