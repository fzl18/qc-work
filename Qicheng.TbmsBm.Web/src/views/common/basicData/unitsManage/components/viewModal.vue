<template>
  <div>
    <Modal :title="$t('查看单位关联配置')" v-model="show" width="70%">
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('单位')"
              filterable
              clearable
              transfer
              v-model="query.unitId"
            >
              <Option
                v-for="(item, index) in commonData.allUnits"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{ item.text }}</Option>
            </Select>
          </Col>
        </Row>
      </Form>
      <Row type="flex" justify="end" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" icon="md-search" @click="onSearch"
          >{{$t('搜索')}}</Button
          >
        </Col>
      </Row>
      <Row :gutter="4">
        <Col :span="12" class-name="margin-bottom-10">
          当前已配置单位转换关系
          <Table
            size="small"
            border
            height="400"
            :loading="tableLoading"
            :columns="leftColumns"
            :data="leftList"
          ></Table>
        </Col>
        <Col :span="12" class-name="margin-bottom-10">
          未配置的单位转换关系
          <Table
            size="small"
            border
            height="400"
            :loading="tableLoading"
            :columns="rightColumns"
            :data="rightList"
          ></Table>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="default" @click="show=!show">{{$t('返回')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from '../api'
import { utils } from '@/utils/utils'
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
    commonData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      tableLoading: false,
      query: {
        unitId: ''
      },
      leftColumns: [
        {
          title: '转换公式',
          key: 'toUnitId',
          minWidth: 100,
          render: (h, { row }) => {
            // return h('span', '1' + utils.showText(this.commonData.allUnits, row.fromUnitId) + '=' + (utils.formatDecimal(row.toUnitNumericValue / row.fromUnitNumericValue, 4)) + utils.showText(this.commonData.allUnits, row.toUnitId))
            return h('span', '1' + utils.showText(this.commonData.allUnits, row.fromUnitId) + '=' + (row.toUnitNumericValue / row.fromUnitNumericValue) + utils.showText(this.commonData.allUnits, row.toUnitId))
          }
        },
        {
          title: '备注',
          key: 'note',
          minWidth: 100
        }
      ],
      leftList: [],
      rightColumns: [
        {
          title: '转换单位',
          key: 'fromUnitId',
          minWidth: 100,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.allUnits, row.fromUnitId)}</span>
          }
        },
        {
          title: '转成单位',
          key: 'toUnitId',
          minWidth: 100,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.allUnits, row.toUnitId)}</span>
          }
        }
      ],
      rightList: []
    }
  },
  methods: {
    cancel() {
      this.$emit('changeModalStatus', false)
    },
    toggleShow () {
      this.show = !this.show
      this.onSearch()
    },
    async onSearch () {
      this.tableLoading = true
      const conversionData = await api.getViewUnitConversionByUnitId(this.query)
      const conversionUnconfigured = await api.listUnitConversionUnconfigured(this.query)
      this.leftList = conversionData.data
      this.rightList = conversionUnconfigured.list
      this.tableLoading = false
    }
  }
}
</script>
