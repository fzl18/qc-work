<template>
  <div id="columnDefsOfProfitCenterWarning" :class="themeName" style="height: 406px;margin-top:34px"></div>
</template>

<script>
  const sharedGridOptions = {
    rowData: [],
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
    deltaRowDataMode: true,
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
  const columnDefsOfProfitCenterWarning = [
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
        return `<div style='text-align: left;'>${param.value}</div>`
      }},
      { headerName: '消息内容', field: 'content',  cellRenderer: (param) => {
        return `<div style='text-align: left;'>${param.value}</div>`
      }},
      { headerName: '通知时间', field: 'generateTime',  cellRenderer: (param) => {
        return `<div style='text-align: left;'>${utils.formatDate(param.value, 'YYYY-MM-DD HH:mm:ss')}</div>`
      }}
  ];

  const HUBNAME = 'warningMessageHub';
  import api from './api';
  import { utils } from '@/utils/utils';
export default {
  data() {
    return {
       themeMode: true,
                // 异常信息
        accountOrAgentPositionOutputsGridOptions: {
          ...sharedGridOptions,
          columnDefs: columnDefsOfProfitCenterWarning
        },
        rowData : []
    }
  },
  async mounted() {
    const columnDefsOfProfitCenterWarningGridDiv = document.querySelector('#columnDefsOfProfitCenterWarning');
    new agGrid.Grid(columnDefsOfProfitCenterWarningGridDiv, this.accountOrAgentPositionOutputsGridOptions);
    this.startConnection()
    let ExceptionMessage = await api.GetRiskWarningExceptionMessage()
    this.accountOrAgentPositionOutputsGridOptions.api.updateRowData({add: ExceptionMessage});
    this._autoSizeAll()
  },
  computed: {
    themeName() {
      return this.themeMode ? 'ag-theme-balham' : 'ag-theme-balham-dark';
    }
  },
  methods: {
    _autoSizeAll: function () {
        var allColumnIds = [];
        this.accountOrAgentPositionOutputsGridOptions.columnApi.getAllColumns().forEach(function (column) {
            if(!column.pinned) {
                allColumnIds.push(column.colId);
            }
        });
        this.accountOrAgentPositionOutputsGridOptions.columnApi.autoSizeColumns(allColumnIds);
    },
    startConnection() {
      let url
      switch (process.env.NODE_ENV) {
        case 'development':
            url = Window.singalrUrl
            break
        case 'production':
            url = Window.releaseSingalrUrl
            break;
        case 'test':

            break;
    }
      let hub = $.hubConnection(url)
      let proxy = this.createHubProxy(hub) //需要先注册方法再连接
      hub.start().done((connection) =>{
          console.log('Now connected, connection ID=' + connection.id)
      }).fail(()=>{
          console.log('Could not connect');
      })
      hub.error(function (error) {
          console.log('SignalR error: ' + error)
      })
      hub.connectionSlow(function () {
          console.log('We are currently experiencing difficulties with the connection.')
      });
      hub.disconnected(function () {
          console.log('disconnected')
      });
        return proxy
    },
    createHubProxy(hub){
      let proxy = hub.createHubProxy(HUBNAME)
      proxy.on('receiveMessage', (data) => {
        data = JSON.parse(data)
        this.rowData = [...data, ...this.rowData]
        this.accountOrAgentPositionOutputsGridOptions.api.updateRowData({add: data, addIndex: 0 });
      })
      // 注册客户端方法
      // clientMethodSets.map((item)=>{
      //     proxy.on(item.name,item.method)
      // })
      return proxy
    }
  }
}
</script>
