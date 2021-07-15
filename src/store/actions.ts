import * as types from './mutations-type'
import { saveSearch } from '@/common/cache'

// 保存搜索历史
export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}