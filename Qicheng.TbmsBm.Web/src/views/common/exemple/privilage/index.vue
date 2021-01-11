<template>
  <div>
    <p>需要在父组件里手动更新查询条件，并传入新的datalist</p>
    <p>点击按钮时子组件向父组件通过$emit方法changeButtonStatus回传了{buttonItem,mouduleIndex,buttonIndex}</p>
    <p>buttonItem：点击按钮的信息，可直接修改isSelected状态</p>
    <p>mouduleIndex: 模块的Index</p>
    <p>buttonIndex: 按钮的Index</p>
    <Button @click="choose">选择</Button>
    <Modal v-model="isShowModal" title="选择合约" width="1100">
      <MultiSelect :data="privilegeData" :originPrivilegeData="originPrivilegeData" @changeButtonStatus="selectOne" ref="multiSelect">
        <template slot="queryArea">
          <Form :model="query" label-position="right" ref="queryForm">
            <Row type="flex" :gutter="16">
              <Col :lg="6" :sm="6" :xs="24" class-name="margin-bottom-10">
                <DatePicker
                  type="daterange"
                  confirm
                  transfer
                  placement="bottom-start"
                  placeholder="请选择日期范围"
                  v-model="query.accountingDateRange"
                ></DatePicker>
              </Col>
              <Col :lg="6" :sm="6" :xs="24" class-name="margin-bottom-10">
                <Select
                  placeholder="利润中心"
                  filterable
                  transfer
                  multiple
                  v-model="query.category"
                  @on-change="search"
                >
                  <Option
                    v-for="(item, index) in originPrivilegeData"
                    :label="item.text"
                    :value="item.category"
                    :key="index"
                    >{{ item.text }}</Option
                  >
                </Select>
              </Col>
              <Col :lg="6" :sm="6" :xs="24" class-name="margin-bottom-10">
                <Button
                  type="primary"
                  icon="md-search"
                  @click="search"
                  class="margin-right-3"
                  >搜索</Button
                >
                <Checkbox v-model="isSelectAll" @on-change="selectAll">全选</Checkbox>
              </Col>
            </Row>
          </Form>
        </template>
      </MultiSelect>
      <div slot="footer">
        <Button @click="isShowModal = false">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
/*global _ _*/
import {privilegeDataJson, PrivilegeCategory} from './data'
import MultiSelect from './components/multiSelectModal'
import { utils } from '@/utils/utils';
export default {
  components: {
    MultiSelect
  },
  data() {
    return {
      isSelectAll: false,
      isShowModal: false,
      query: {
        category: []
      },
      privilegeDataJson,
      PrivilegeCategory,
      selectArr: [],
      privilegeData: [],
      originPrivilegeData: [],
      commonData: {
        accountingEntities: []
      }
    }
  },
  beforeMount() { //dealWithAuths 用来处理权限的结构
    let arr = JSON.parse(this.privilegeDataJson)
    arr.forEach(data => data.isSelected = false)
    this.privilegeData = utils.dealWithAuths(arr, JSON.parse(this.PrivilegeCategory))
    // this.privilegeData = this.setSelected()
    this.originPrivilegeData = this.privilegeData //清除条件后还原的副本
  },
  methods: {
    choose() {
      this.isShowModal = true
    },

    //！修改参数可直接复用的方法
    setSelected(flag = false) { //全选方法，传入全选的状态，默认false
      let privilegeData = _.map(this.privilegeData,  function (r) {
        _.forEach(r.item, function (d) {
          d.isSelected = flag
        });
        return r
      })
      return privilegeData
    },
    selectOne({buttonItem, caculIsSelectAll}) { //单选
      if(buttonItem) {
        buttonItem.isSelected = !buttonItem.isSelected
      }
      this.isSelectAll = caculIsSelectAll
    },
    search() { //过滤条件
      if(this.query.category.length) {
        // this.privilegeData = this.originPrivilegeData.filter(data => data.category === this.query.category)
        this.privilegeData = this.originPrivilegeData.filter(data => this.query.category.indexOf(data.category) !== -1)
        this.isSelectAll = true
        this.privilegeData.forEach(data => {
          if(!data.isSelected) {
            this.isSelectAll = false
          }
        })
      } else {
        this.privilegeData = this.originPrivilegeData.map(data => {
          this.privilegeData.forEach(item => {
            if(item.category === data.category) {
              data.item = item.item
            }
          })
          return data
        })
      }
      this.isSelectAll = true
      this.privilegeData.forEach(data => {
        data.item.forEach(d => {
          if(!d.isSelected) {
            this.isSelectAll = false
          }
        })
      })
    },
    onSave() { //从子组件获取已选中的内容id数组
      this.selectArr =  this.$refs['multiSelect'].getAllSelected()
      this.$Message.success(this.selectArr.join('___'))
    },
    selectAll() {
      this.privilegeData = this.setSelected(this.isSelectAll)
    }
  }
}
</script>

<style lang="less" scoped>
p {
  font-size: 22px;
}

</style>
