<template>
  <Modal
    class="closePositionModal"
    v-model="isShowAddModal"
    :title="$t('选择利润中心')"
    width="900"
  >
    <Tree :data="allAccountingEntities" ref="tree" show-checkbox @on-check-change="onCheck"></Tree>
    <div slot="footer" class="foot">
      <div>
        <p v-if="strategeNames">{{ $t("已选择策略列表") }}：{{strategeNames}}</p>
        <p>{{ $t("已选择利润中心列表") }}：{{checkNames}}</p>
      </div>
      <div>
        <Button @click="isShowAddModal = !isShowAddModal">{{$t("取消")}}</Button>
        <Button type="primary" @click="onSave">{{ $t("保存") }}</Button>
      </div>
      
    </div>
  </Modal>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums';
import api from './api';
export default {
  props:{
    checkedList: {
      type: Array,
      default: () => []  
    },
    commonData: {}
  },
  data() {
    return {
      profitCenterList: [],
      isShowAddModal: false,
      strategeNames: '',
      checkNames: '',
      allAccountingEntities: []
    };
  },
  mounted(){
    
  },
  methods: {
    onShow() {
      this.checkNames = ''
      this.onCheck()
      let {allAccountingEntities} = this.commonData
      this.allAccountingEntities = [{title:'所有利润中心',expand:true,children:this.toTree(allAccountingEntities)}]
      this.isShowAddModal = true;
      let names = []
      this.checkedList.map(val=>{
        names.push(val.name) 
      })
      this.strategeNames = names.join(', ')

      //请求数据填充
    },
    onSave() {
      this.isShowAddModal = false;
      this.$emit("getChecked", this.$refs.tree.getCheckedNodes());
    },
    onCheck() {
      let name = ''
      this.$refs.tree.getCheckedNodes().map(val=>{
        name += val.title + ', '
      })
      this.checkNames = name
    },
    toTree(arr) {
      let cloneData = JSON.parse(JSON.stringify(arr))
      return cloneData.filter(father => {
        father.title = father.text
        father.expand = true
        father.disableCheckbox = father.isDisabled
        let branchArr = cloneData.filter(child => father.value == child.parentId); 
        branchArr.length > 0 ? father.children = branchArr : '' 
        return father.parentId == null; 
      });
    }
  },
};
</script>

<style lang="less" scoped>
.foot{
  display: flex;
  justify-content: space-between;
  div:first-child{
    text-align: left;
    width: 70%;
    line-height: 25px;
  }
}
</style>