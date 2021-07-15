interface IState {
    loginStatu:null|boolean,
    userInfo:any,
    searchHistory:Array<string>
}

const state:IState= {
    // 是否登录
    loginStatu: null,
    // 用户信息
    userInfo: null,
    // 历史搜索
    searchHistory:[]
}

export default state
