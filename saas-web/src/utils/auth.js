import store from "../store";
const TokenKey = "token";

export function getToken() {
  return localStorage.getItem(TokenKey);
}

export function setToken(token) {
  localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  localStorage.removeItem(TokenKey);
}

export function Opt(el, ref) {
  let sectionCode = ref.value[0].meta.sectionCode
  let operationCode = ref.value[1]
  let {userAuth} = store.getters.userInfo
  let pass = false
  if(store.getters.userInfo.isAdmin){
    pass = true
  }else{
    userAuth.sectionOperations.map(item => {
      if(item.qcSectionCode == sectionCode){
        let authList = item.operations.map( val => val.qcOperationCode )
        pass = authList.includes(operationCode) 
      }
    })
  }
  el.style.display = pass ? '' : 'none'
}