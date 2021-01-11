<template>
  <div>
    <Table
      size="small"
      v-maxHeight
      border
      class="margin-bottom-10"
      :loading="false"
      :columns="listColumns"
      :data="item"
    ></Table>
  </div>
</template>
<script>
import { utils } from '@/utils/utils'
export default {
  props: {
    item: {
      type: Array,
      default: () => []
    },
    commonData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      listColumns: [
        {
          title: '基础值',
          key: 'fromUnitNumericValue',
          align: 'center',
          minWidth: 120
        },
        {
          title: '转换单位',
          key: 'fromUnitId',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.allUnits, row.fromUnitId)}</span>
          }
        },
        {
          title: '转换后值',
          key: 'toUnitNumericValue',
          align: 'center',
          minWidth: 120
        },
        {
          title: '转成单位',
          key: 'toUnitId',
          align: 'center',
          minWidth: 120,
          render: (h, {row}) => {
            return <span>{ utils.showText(this.commonData.allUnits, row.toUnitId)}</span>
          }
        },
        {
          title: '转换公式',
          key: 'ptlFactor',
          align: 'center',
          minWidth: 120,
          render: (h, { row }) => {
            // return h('span', '1' + utils.showText(this.commonData.allUnits, row.fromUnitId) + '=' + (utils.formatDecimal(row.toUnitNumericValue / row.fromUnitNumericValue, 4)) + utils.showText(this.commonData.allUnits, row.toUnitId))
            return h('span', '1' + utils.showText(this.commonData.allUnits, row.fromUnitId) + '=' + (row.toUnitNumericValue / row.fromUnitNumericValue) + utils.showText(this.commonData.allUnits, row.toUnitId))
          }
        },
        {
          title: '备注',
          key: 'note',
          align: 'center',
          minWidth: 120
        }
      ],
      list: []
    }
  }
}
</script>
