/* eslint-disable */
import storage from 'good-storage'

const SEARCH_KEY = '_search_'
const SEARCH_MAX = 15
const HISTORY_KEY = '_history_'
const HISTORY_MAX = 50

// 插入一条历史
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare)
    if (index === 0) return
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.maxLen > maxLen) {
        arr.pop()
    }
}

// 删除一条历史
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

// 存储一条
export const saveSearch = (query) => {
    let search_list = storage.get(SEARCH_KEY, [])
    insertArray(search_list, query, item => {
        item === query
    }, SEARCH_MAX)
    storage.set(SEARCH_KEY, search_list)
    return search_list
}

// 查询历史
export const getSearch = () => {
    return storage.get(SEARCH_KEY, [])
}

// 删除单个历史
export const deleteSearch = (query) => {
    let search_list = storage.get(SEARCH_KEY, [])
    deleteFromArray(search_list, item => {
        item === query
    })
    storage.set(SEARCH_KEY, search_list)
    return search_list
}

// 清空搜索历史
export const clearSearch = () => {
    storage.remove(SEARCH_KEY)
    return []
}

// 添加最近播放列表
export const saveHistory = (song) => {
    let songs = storage.get(HISTORY_KEY, [])
    insertArray(songs, song, item => {
        return song.id === item.id
    }, HISTORY_MAX)

    storage.set(HISTORY_KEY, songs)
    return songs
}

// 删除最近播放列表
export const deleteHistory = (song) => {
    let songs = storage.get(HISTORY_KEY, [])
    deleteFromArray(songs, item => {
        return song.id === item.id
    })
    storage.set(HISTORY_KEY, songs)
    return songs
}


// 清空最近播放列表
export const clearHistory = () => {
    storage.remove(HISTORY_KEY)
    return []
}
