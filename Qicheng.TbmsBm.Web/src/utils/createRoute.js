import main from '@/views/main'
import Index from '@/index.vue';
const RouterSort =(subRoutsModule)=> {
  const modules = subRoutsModule.keys().reduce((modules, modulePath) => {
    const value = subRoutsModule(modulePath)
    if(modulePath.indexOf('moduleRouter') !=-1) {
      value.default.component = Index
    } else {
      value.default ? value.default.component = main : ''
    }
    value.default && modules.push(value.default)
    return modules
  }, [])
  return modules.sort((pre, next) => pre.index - next.index)
}
export default RouterSort
