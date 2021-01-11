<template>
<div style="position: relative">
  <div id="columnDefsOfProfitCenterDanger" :class="themeName" style="height: 406px;margin-top: 10px"></div>
   <Spin fix v-show="loading">
      <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
      <div>Loading</div>
    </Spin>
</div>
</template>
<script>
  const sharedGridOptions = {
    rowData: null,
    defaultColDef: {
      width: 120,
      sortable: true,
    },
    columnDefs: [],
    suppressAggFuncInHeader: true,
    columnTypes: {
      measure: {
        width: 150,
        aggFunc: 'sum',
        enableValue: true,
        cellClass: 'number',
        enableCellChangeFlash: true,
        valueFormatter: (params) => {
          return utils.formatAmount(params.value);
        },
      },
      measureFlash:{
        width: 120,
        aggFunc: 'sum',
        enableValue: true,
        cellClass: 'number',
        enableCellChangeFlash: true,
      },
      dimension: {
        enableRowGroup: true,
        enablePivot: true,
        cellRender: function (params) {
          if (params.value === null) {
            return '';
          }
          return params.value.toFixed();
        }
      }
    },
    animateRows: true,
    // deltaRowDataMode: true,
    enableColResize: true,
    enableFilter: true,
    enableSorting: true,
    enableRangeSelection: true,
    pivotPanelShow: 'always',
    toolPanelSuppressSideButtons: true,
    toolPanelSuppressRowGroups: true,
    toolPanelSuppressValues: true,
    toolPanelSuppressPivots: true,
    toolPanelSuppressPivotMode: true,
    toolPanelSuppressColumnFilter: true,
    toolPanelSuppressColumnSelectAll: true,
    toolPanelSuppressColumnExpandAll: true,
    autoGroupColumnDef: {
      width: 200
    },
    components: {
     
    },
    getRowNodeId: function (data) {
      return data.Key;
    },
    localeText: {
      pivotMode: '透视',
      columns: '操作',
      sum: '和',
      filterOoo: '过滤',
      equals: '等于',
      notEqual: '不等于',
      lessThan: '小于',
      greaterThan: '大于',
      contains: '包含',
      notContains: '不包含',
      startsWith: '开始于',
      endsWith: '结束于',
      pinColumn: '固定列',
      pinLeft: '固定到左侧',
      pinRight: '固定到右侧',
      noPin: '取消固定',
      valueAggregation: 'laValue Agg',
      autosizeThiscolumn: '调整此列',
      autosizeAllColumns: '调整所有列',
      resetColumns: '重置列',
      groupBy: '分组',
      toolPanel: '操作面板',
      copy: '复制',
      paste: '粘贴',
      copyWithHeaders: '复制（含表头）',
      export: '导出',
      csvExport: '导出 CSV',
      excelExport: '导出 Excel',
      groups: '分组（行）',
      rowGroupColumnsEmptyMessage: '拖至此处分组',
      values: '聚合（列）',
      average: '平均',
      count: '数量',
      min: '最小值',
      max: '最大值',
      first: '第一个',
      last: '最后一个',
      to: '到',
      of: '共',
      group: '分类',
      expandAll: '展开全部',
      collapseAll: '收起全部',
      noRowsToShow: '暂无数据',
      valueColumnsEmptyMessage: '拖至此处聚合',
      pivotColumnsEmptyMessage: '拖至此处透视',
    }
  };
  const colorCellClass = {
    'text-red': function (params) {
      return params.value > 0 || [ '买', '已断开' ].includes(params.value);
    },
    'text-green': function (params) {
      return params.value < 0 || [ '卖', '已连接', '已完成' ].includes(params.value);
    },
    'text-yellow': function (params) {
      return [ '未完成' ].includes(params.value);
    }
  };
 const columnDefsOfProfitCenterDanger = [
    { headerName: '风险等级', field: 'riskLevelText', cellRenderer: (param) => {
        if(param.data.earlyWarningLevel ==1) {
          return `<div style='color:orange;; text-align: left;'>${param.value}</div>`
        }
        if(param.data.earlyWarningLevel ==4) {
          return `<div style='color:red; text-align: left;'>${param.value}</div>`
        }
        return `<div style='text-align: left;'>${param.value}</div>`
      }},
      { headerName: '消息类别', field: 'messageTypeText',  cellRenderer: (param) => {
        // if(param.data.earlyWarningLevel ==1) {
        //   return `<div style='color:orange;; text-align: left;'>${param.value}</div>`
        // }
        // if(param.data.earlyWarningLevel ==4) {
        //   return `<div style='color:red; text-align: left;'>${param.value}</div>`
        // }
        return `<div style='text-align: left;'>${param.value}</div>`
      }},
      { headerName: '消息内容', field: 'content',  cellRenderer: (param) => {
        // if(param.data.earlyWarningLevel ==1) {
        //   return `<div style='color:orange;; text-align: left;'>${param.value}</div>`
        // }
        // if(param.data.earlyWarningLevel ==4) {
        //   return `<div style='color:red; text-align: left;'>${param.value}</div>`
        // }
        return `<div style='text-align: left;'>${param.value}</div>`
      }},
      { headerName: '通知时间', field: 'generateTime',  cellRenderer: (param) => {
        // if(param.data.earlyWarningLevel ==1) {
        //   return `<div style='color:orange;; text-align: left;'>${utils.formatDate(param.value, 'YYYY-MM-DD HH:mm:ss')}</div>`
        // }
        // if(param.data.earlyWarningLevel ==4) {
        //   return `<div style='color:red; text-align: left;'>${utils.formatDate(param.value, 'YYYY-MM-DD HH:mm:ss')}</div>`
        // }
        return `<div style='text-align: left;'>${utils.formatDate(param.value, 'YYYY-MM-DD HH:mm:ss')}</div>`
      }}
  ];
  import api from './api'
  import { utils } from '@/utils/utils';
export default {
  data() {
    return {
       themeMode: true,
                // 异常信息
        columnDefsOfProfitCenterDangerOptions: {
          ...sharedGridOptions,
          columnDefs: columnDefsOfProfitCenterDanger
        },
        loading: false
    }
  },
  async mounted() {
     const columnDefsOfProfitCenterDangerGridDiv = document.querySelector('#columnDefsOfProfitCenterDanger');
      new agGrid.Grid(columnDefsOfProfitCenterDangerGridDiv, this.columnDefsOfProfitCenterDangerOptions);
    this.fresh()
  },
   computed: {
      themeName() {
        return this.themeMode ? 'ag-theme-balham' : 'ag-theme-balham-dark';
      }
    },
    methods: {
       _autoSizeAll: function () {
          var allColumnIds = [];
          this.columnDefsOfProfitCenterDangerOptions.columnApi.getAllColumns().forEach(function (column) {
              if(!column.pinned) {
                  allColumnIds.push(column.colId);
              }
          });
          this.columnDefsOfProfitCenterDangerOptions.columnApi.autoSizeColumns(allColumnIds);
      },
      async fresh() {
        this.loading = true
        let ExceptionMessage = await api.GetRiskWarningMessage()
        this.loading = false
        this.columnDefsOfProfitCenterDangerOptions.api.setRowData(ExceptionMessage);
        this._autoSizeAll()
      }
    }
}
</script>