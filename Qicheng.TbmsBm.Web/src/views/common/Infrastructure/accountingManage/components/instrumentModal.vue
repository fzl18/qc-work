<template>
  <div>
    <Modal v-model="isShowModal" :title="$t('期货权限-标准合约选择')" width="1100">
      <MultiSelect :data="privilegeData" returnKey="value" :originPrivilegeData="originPrivilegeData" @changeButtonStatus="selectOne" ref="multiSelect">
        <template slot="queryArea">
          <Form :model="query" label-position="right" ref="queryForm">
            <Row type="flex" :gutter="16">
              <Col :lg="6" :sm="6" :xs="24" class-name="margin-bottom-10">
                <Select
                  :placeholder="$t('作价市场')"
                  filterable
                  transfer
                  clearable
                  v-model="query.marketId"
                  @on-change="search"
                >
                  <Option
                    v-for="(item, index) in commonData.Exchanges"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                    >{{ item.text }}</Option
                  >
                </Select>
              </Col>
              <Col :lg="6" :sm="6" :xs="24" class-name="margin-bottom-10">
                <Select
                  :placeholder="$t('品类')"
                  filterable
                  clearable
                  transfer
                  v-model="query.commodityTypeId"
                  @on-change="search"
                >
                  <Option
                    v-for="(item, index) in commonData.CommodityTypes"
                    :label="item.text"
                    :value="item.value"
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
import MultiSelect from '@/components/multiSelectModal'
import { utils } from '@/utils/utils';
import api from '../api'

export default {
  components: {
    MultiSelect
  },
  data() {
    return {
      isShowModal: false,
      isSelectAll: false,
      query: {
        commodityTypeId: '',
        marketId: ''
      },
      selectArr: [],
      privilegeData: [],
      originPrivilegeData: [],
      commonData: {
        CommodityTypes: [],
        Exchanges: []
      }
    }
  },
  async beforeMount() { //dealWithAuths 用来处理权限的结构
    this.commonData = await api.getCommonData()
    let instrumentCategoryList = _.cloneDeep(_.map(this.commonData.InstrumentCategoryList, data => {
      data.isSelected = false
      data.showButton = true
      return data
    }))
    this.privilegeData = utils.dealWithAuths(instrumentCategoryList, this.commonData.Exchanges, 'exchangeId')
    this.originPrivilegeData = this.privilegeData //清除条件后还原的副本
  },
  methods: {
    setSelected(flag = false) { //全选方法，传入全选的状态，默认false
      let privilegeData = _.map(this.privilegeData,  function (r) {
        _.forEach(r.item, function (d) {
          d.isSelected = flag
        });
        return r
      })
      return privilegeData
    },
    selectOne({buttonItem}) { //单选
      buttonItem && (buttonItem.isSelected = !buttonItem.isSelected)
    },
    search() { //过滤条件
      if(this.query.marketId) { //仅有作价市场的过滤
        this.privilegeData = this.originPrivilegeData.filter(data => {
          if(!this.query.commodityTypeId) {
            data.item.forEach(d => d.showButton = true)
          }
          return this.query.marketId === data.exchangeId
        })
      }
      if(!this.query.marketId && !this.query.commodityTypeId) {
        this.privilegeData = this.originPrivilegeData.map(data => {
          this.privilegeData.forEach(item => {
            if(item.exchangeId === data.exchangeId) {
              data.item = item.item
            }
          })
          _.forEach(data.item, d => {
            d.showButton = true
          })
          return data
        })
      }
      if(this.query.commodityTypeId) {
        this.privilegeData = this.originPrivilegeData.map(data => {
          data.item.forEach(d => {
            d.showButton = d.wfCommodityTypeId === this.query.commodityTypeId
          })
          return data
        })
        this.privilegeData = this.privilegeData.filter(data => data.item.some(d => d.showButton === true))
        if(this.query.marketId) { //仅有作价市场的过滤
          this.privilegeData = this.privilegeData.filter(data => this.query.marketId === data.exchangeId)
        }
      }
      this.isSelectAll = true //切换条件确认是否全选
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
      this.$emit('getSelected', this.selectArr)
      this.isShowModal = false
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