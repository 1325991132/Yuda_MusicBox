import { playMode } from '@/common/playConfig'

interface IState {
    loginStatu: null | boolean,
    userInfo: any,
    searchHistory: Array<string>,
    sequenceList: Array<any>,
    playList: Array<any>,
    mode: number,
    currentIndex: number,
    playing: boolean,
    singer: any,
    historyList: Array<any>,
    likeSongs:Array<any>,
    userDevice:string
}

const state: IState = {
    // 是否登录
    loginStatu: null,
    // 用户信息
    userInfo: null,
    // 历史搜索
    searchHistory: [],
    // 顺序列表
    sequenceList: [],
    // 播放列表
    playList: [],
    // 播放模式
    mode: playMode.sequence,
    // 播放索引
    currentIndex: -1,
    // 播放状态
    playing: false,
    // 歌手信息
    singer: {},
    // 历史播放列表
    historyList: [],
    // 喜欢的音乐列表
    likeSongs:[],
    // 用户使用设备
    userDevice:"window"
}

export default state
