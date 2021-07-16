/* eslint-disable */
import * as types from './mutations-type'
import { playMode } from '@/common/playConfig'
import { saveSearch } from '@/common/cache'
import utils from '@/utils'

// 保存搜索历史
export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

function findIndex_in_random(list, song) {
    return list.findIndex((item) => {
        item.id === song.id
    })
}

// 选择播放
export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let random_list = utils.shuffle(list)
        commit(types.SET_PLAYLIST, random_list)
        index = findIndex_in_random(random_list, list(index))
    } else {
        commit(types.SET_PLAYLIST, list)
    }
    commit(types.SET_CURRENT_INDEX, index)
    commit(types.SET_PLAYING_STATE, true)
}

// 暂停播放
export const pausePlay = function({commit}){
    commit(types.SET_PLAYING_STATE,false)
}