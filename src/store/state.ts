interface IState {
    loginStatu:null|boolean,
    userInfo:any
}

const state:IState= {
    // 是否登录
    loginStatu: null,
    // 用户信息
    userInfo: null,
}

export default state
