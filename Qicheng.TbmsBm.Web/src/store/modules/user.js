import {api} from '@/api/api'
const state = {
  userPermission: []
}
let newPermission = []
const mutations = {
  setUserPermission(state, list) {
    newPermission = list.map(item => {item = item.toLowerCase(); return item})
    state.userPermission = list
  }
}

const actions = {
  async getUserPermissions({ dispatch, commit, state }) {
    let res = await  api.getUserPermissions()
    commit('setUserPermission', res)
    return res
  }
}
const getters = {
  getPermission: () => newPermission,
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
