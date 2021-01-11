<template>
  <div>
    <Row :gutter="8" ref="test">
      <col span="24">
      <div style="height: 600px;">
        <div style="float: right; width: 455px; padding-left: 5px">
          <Tabs type="line" size="small">
            <TabPane label="资金账户总持仓">
              <div id="tradeAccountTotalHoldPosition" :class="themeName" style="height: 569px;"></div>
            </TabPane>
            <TabPane label="利润中心总持仓">
              <div id="profitCenterTotalHoldPosition" :class="themeName" style="height: 569px;"></div>
            </TabPane>
          </Tabs>
        </div>
        <div style="background: white">
          <Tabs type="line" size="small">
            <TabPane label="利润中心">
              <div id="profitCenter" :class="themeName" style="height: 250px;"></div>
              <div id="profitCenterGridBottom" :class="themeName" style="height: 48px;"></div>
              <div><p class="section-title">资金账户</p></div>
              <div id="tradeAccount" :class="themeName" style="height: 195px;"></div>
              <div id="tradeAccountGridBottom" :class="themeName" style="height: 48px;"></div>
            </TabPane>
          </Tabs>
        </div>
      </div>
      </col>
      <Col span="24">
        <div style="float: right; width: 455px; padding-left: 5px">
          <Tabs type="line" size="small">
            <TabPane label="异常信息">
              <exception-information/>
            </TabPane>
            <TabPane label="风险信息">
              <div class="margin-bottom-10">
                <Button size="small" @click="$refs.riskInformation.fresh()">刷新</Button>
              </div>
              <risk-information ref='riskInformation'/>
            </TabPane>
          </Tabs>
        </div>
        <Tabs type="line" size="small">
          <TabPane label="成交明细">
            <div class="margin-bottom-10">
              <Button size="small" @click="searchDealDetail">搜索</Button>
            </div>
            <div id="dealDetail" :class="themeName" style="height: 406px;"></div>
          </TabPane>
          <TabPane label="成交汇总">
            <div class="margin-bottom-10">
              <Button size="small" @click="searchDealSummary">搜索</Button>
            </div>
            <div id="dealSummaryOfAccount" :class="themeName" style="height: 406px;"></div>
          </TabPane>
          <TabPane label="所有报单">
            <div class="margin-bottom-10">
              <Button size="small" @click="searchAllBill">搜索</Button>
            </div>
            <div id="allBill" :class="themeName" style="height: 406px;"></div>
          </TabPane>
          <TabPane label="持仓">
            <div id="accountOrAgentPosition" :class="themeName" style="height: 392px;"></div>
            <div id="accountOrAgentPositionGridBottom" :class="themeName" style="height: 48px;"></div>
          </TabPane>
          <TabPane label="利润中心明细">
            <div id="profitDetail" :class="themeName" style="height: 392px;"></div>
            <div id="profitDetailGridBottom" :class="themeName" style="height: 48px;"></div>
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  </div>
</template>

<script>
  import Worker from 'worker-loader!./worker.js';
  import { utils } from '@/utils/utils';
  import exceptionInformation from './exceptionInformation';
  import riskInformation from './riskInformation';

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
      measureFour: {
        width: 150,
        aggFunc: 'sum',
        enableValue: true,
        cellClass: 'number',
        enableCellChangeFlash: true,
        valueFormatter: (params) => {
          return utils.formatAmount(params.value, { precision: 4 });
        },
      },
      measureFlash: {
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
    components: {
      appendPercent,
      moveAccountRowToTop,
      moveAgentRowToTop,
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
    'text-right': function () {
      return true;
    },
    'text-red': function (params) {
      return params.value > 0;
    },
    'text-green': function (params) {
      return params.value < 0;
    }
  };

  const textRightCellClass = {
    'text-right': function () {
      return true;
    }
  };

  const isBuyCellClass = {
    'text-red': function (params) {
      return ['买', '已断开'].includes(params.value);
    },
    'text-green': function (params) {
      return ['卖', '已连接', '已完成'].includes(params.value);
    },
    'text-yellow': function (params) {
      return ['未完成'].includes(params.value);
    }
  }

  const paddingRightClass = {
    'padding-right20': function () {
      return true;
    }
  }

  function appendPercent (params) {
    if ([null, undefined].includes(params.value)) {
      return '';
    }
    return (params.value * 100).toFixed() + '%';
  }

  function moveAccountRowToTop (params) {
    let btnDiv = document.createElement('div');
    btnDiv.innerHTML = '<a href="javascript:;" class="btn-simple">顶</a>';
    let btn = btnDiv.querySelectorAll('.btn-simple')[0];
    btn.addEventListener('click', () => {
      if ([null, undefined].includes(params.data)) {
        return;
      }
      // 1. 设置利润中心数据序号
      params.data.Sequence = ++accountMaxSequence;
      // 2. 本地存储当前设置的利润中心序号
      saveRowSequence(accountSequence, params.data.Key, params.data.Sequence);
      // 3. 通知利润中心数据按照Sequence倒序排序
      worker.postMessage({ type: 'sortAccount', RowData: params.data });
    });
    return btnDiv;
  }

  function moveAgentRowToTop (params) {
    let btnDiv = document.createElement('div');
    btnDiv.innerHTML = '<a href="javascript:;" class="btn-simple">顶</a>';
    let btn = btnDiv.querySelectorAll('.btn-simple')[0];
    btn.addEventListener('click', () => {
      if ([null, undefined].includes(params.data)) {
        return;
      }
      // 1. 设置资金账户数据序号
      params.data.Sequence = ++agentMaxSequence;
      // 2. 本地存储当前设置的资金账户序号
      saveRowSequence(agentSequence, params.data.Key, params.data.Sequence);
      // 3. 通知资金账户数据按照Sequence倒序排序
      worker.postMessage({ type: 'sortAgent', RowData: params.data });
    });
    return btnDiv;
  }

  function saveRowSequence (dataType, key, sequence) {
    if (dataType === null || dataType === undefined
      || key === null || key === undefined
      || sequence === null || sequence === undefined) {
      return;
    }
    let localSequence = localStorage.getItem(dataType);
    if (localSequence === null || localSequence === undefined) {
      localStorage.setItem(dataType, JSON.stringify([{ Key: key, Sequence: sequence }]));
    } else {
      let sequenceArray = JSON.parse(localSequence);
      let filterArray = sequenceArray.filter(i => !i.Key.includes(key));
      filterArray.push({ Key: key, Sequence: sequence });
      localStorage.setItem(dataType, JSON.stringify(filterArray));
    }
  }

  // 利润中心 - 列定义
  const columnDefsOfProfitCenter = [
    { headerName: '', field: 'ToTop', width: 30, cellRenderer: 'moveAccountRowToTop', pinned: 'left' },
    { headerName: '利润中心', field: 'AccountName', type: 'dimension', width: 180, pinned: 'left' },
    { headerName: '授权资金', field: 'Budget', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '可用资金', field: 'Available', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '保证金', field: 'UsedMarginByFuncCurrency', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '冻结保证金', field: 'FrozenMarginByFuncCurrency', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '止损线', field: 'StopLine', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '浮动盈亏', field: 'PostionPnLByTradeByFuncCurrency', type: 'measure', cellClassRules: colorCellClass, width: 120 },
    { headerName: '平仓盈亏', field: 'TodayCloseProfitByTradeByFuncCurrency', type: 'measure', cellClassRules: colorCellClass, width: 120 },
    { headerName: '历史平仓盈亏', field: 'HistoryCloseProfitByTradeByFuncCurrency', type: 'measure', cellClassRules: colorCellClass, width: 120 },
    { headerName: '总盈亏', field: 'TotalPnLByTradeByFuncCurrency', type: 'measure', cellClassRules: {...colorCellClass, ...paddingRightClass}, width: 120 }
  ];
  // 资金账户 - 列定义
  const columnDefsOfTradeAccount = [
    { headerName: '', field: 'ToTop', width: 30, cellRenderer: 'moveAgentRowToTop', pinned: 'left' },
    { headerName: '资金账户', field: 'AgentCode', type: 'dimension', width: 180, pinned: 'left' },
    { headerName: '账号', field: 'AccountId', type: 'dimension', width: 120, pinned: 'left' },
    { headerName: '币种', field: 'CurrencyID', type: 'dimension', width: 80, pinned: 'left' },
    { headerName: '动态权益', field: 'DynamicEquity', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '可用资金', field: 'Available', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '保证金', field: 'ExchangeMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '浮动盈亏', field: 'PositionProfit', type: 'measure', width: 120, cellClassRules: colorCellClass },
    { headerName: '平仓盈亏', field: 'CloseProfit', type: 'measure', width: 120, cellClassRules: colorCellClass },
    { headerName: '手续费', field: 'Commission', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '冻结保证金', field: 'FrozenMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '冻结手续费', field: 'FrozenCommission', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '结算准备金', field: 'Balance', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '风险度', field: 'RiskDegree', width: 100, cellRenderer: 'appendPercent', cellClassRules: textRightCellClass },
    { headerName: '持盈比例', field: 'ProfitRadio', cellClassRules: colorCellClass, cellRenderer: 'appendPercent', width: 120 },
    { headerName: '出入金', field: 'CashInAndOut', type: 'measure', width: 100, cellClassRules: colorCellClass },
    { headerName: '连接状态', field: 'ConnectionStatus', width: 100, cellClassRules: isBuyCellClass },
    { headerName: '上次结算准备金', field: 'PreBalance', type: 'measure', width: 140, cellClassRules: textRightCellClass },
    { headerName: '可取', field: 'WithdrawQuota', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '出金', field: 'Withdraw', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '入金', field: 'Deposit', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '法人', field: 'Corporation', width: 120 },
    { headerName: 'Balance', field: 'ForeignBalance', width: 130, cellClassRules: textRightCellClass },
    { headerName: 'TotalValue', field: 'TotalValue', width: 120, cellClassRules: textRightCellClass },
    { headerName: 'OTE', field: 'OTE', width: 120, cellClassRules: textRightCellClass },
    { headerName: 'MVO', field: 'MVO', width: 120, cellClassRules: textRightCellClass },
    { headerName: 'InitialMargin', field: 'InitialMargin', width: 120, cellClassRules: textRightCellClass },
    { headerName: 'CashExcess', field: 'CashExcess', width: 120, cellClassRules: { ...textRightCellClass, ...paddingRightClass } }
  ];
  // 资金账户总持仓 - 列定义
  const columnDefsOfTradeAccountTotalHoldPosition = [
    { headerName: '合约', field: 'InstrumentCode', cellRenderer: 'agGroupCellRenderer', width: 200 },
    { headerName: '方向', field: 'Direction', cellClassRules: isBuyCellClass, width: 64 },
    { headerName: '数量', field: 'TotalVolume', width: 70, cellClassRules: textRightCellClass },
    { headerName: '合约名', field: 'InstrumentName' }
  ];
  // 利润中心总持仓 - 列定义
  const columnDefsOfProfitCenterTotalHoldPosition = [
    { headerName: '合约', field: 'InstrumentCode', cellRenderer: 'agGroupCellRenderer', width: 200 },
    { headerName: '方向', field: 'Direction', cellClassRules: isBuyCellClass, width: 64 },
    { headerName: '数量', field: 'TotalVolume', width: 70, cellClassRules: textRightCellClass },
    { headerName: '合约名', field: 'InstrumentName' }
  ];
  // 成交明细 - 列定义
  const columnDefsOfDealDetail = [
    { headerName: '合约', field: 'InstrumentCode' },
    { headerName: '买卖', field: 'Direction', cellClassRules: isBuyCellClass, width: 70 },
    { headerName: '开平', field: 'OpenClosPosition', width: 70 },
    { headerName: '投保', field: 'HedgeType', width: 70 },
    { headerName: '成交价格', field: 'Price', type: 'dimension', cellClassRules: textRightCellClass },
    { headerName: '成交手数', field: 'Lots', cellClassRules: textRightCellClass },
    { headerName: '利润中心', field: 'AccountName' },
    { headerName: '策略', field: 'TradingStrategyName' },
    { headerName: '账户', field: 'AgentCode' },
    { headerName: '下单方式', field: 'OrderModeText' },
    { headerName: '下单员', field: 'TraderName' },
    { headerName: '成交时间', field: 'ExchangeTime' },
    { headerName: '系统时间', field: 'SystemTime' },
    { headerName: '委托单ID', field: 'AccountOrderId' },
    { headerName: '成交编号', field: 'Reference' },
    { headerName: '报单编号', field: 'OrderReference' },
    { headerName: '交易所', field: 'ExchangeName' }
  ];
  // 成交汇总-按账户 - 列定义
  const columnDefsOfAccountDealSummary = [
    { headerName: '合约', field: 'InstrumentCode' },
    { headerName: '买卖', field: 'Direction', cellClassRules: isBuyCellClass },
    { headerName: '开平', field: 'OpenClosePosition' },
    { headerName: '成交均价', field: 'Average', cellClassRules: textRightCellClass },
    { headerName: '成交手数', field: 'Lots', cellClassRules: textRightCellClass },
    { headerName: '交易所', field: 'ExchangeName' },
    { headerName: '下单员', field: 'TraderName' },
    { headerName: '投保', field: 'HedgeType' },
    { headerName: '利润中心', field: 'AccountName' },
    { headerName: '账户', field: 'AgentCode' },
    { headerName: '合约名', field: 'InstrumentName' }
  ];
  // 所有报单 - 列定义
  const columnDefsOfAllBill = [
    { headerName: '合约', field: 'InstrumentCode' },
    { headerName: '买卖', field: 'Direction', cellClassRules: isBuyCellClass, width: 70 },
    { headerName: '开平', field: 'OpenClosPosition', width: 70 },
    { headerName: '投保', field: 'HedgeType', width: 70 },
    { headerName: '手数', field: 'Lots', cellClassRules: textRightCellClass },
    { headerName: '未成交', field: 'DonotFilled', cellClassRules: textRightCellClass },
    { headerName: '报单价格', field: 'Price', type: 'dimension', cellClassRules: textRightCellClass },
    { headerName: '挂单状态', field: 'Status', cellClassRules: isBuyCellClass },
    { headerName: '利润中心', field: 'AccountId' },
    { headerName: '策略', field: 'TradingStrategyName' },
    { headerName: '账户', field: 'AgentId' },
    { headerName: '已成交', field: 'Filled', cellClassRules: textRightCellClass },
    { headerName: '已撤单', field: 'Canceled', cellClassRules: textRightCellClass },
    { headerName: '已拒绝', field: 'Rejected', cellClassRules: textRightCellClass },
    { headerName: '成交均价', field: 'Average', type: 'dimension', cellClassRules: textRightCellClass },
    { headerName: '下单类型', field: 'OrderType' },
    { headerName: '报单价格2', field: 'Price2', type: 'dimension', cellClassRules: textRightCellClass },
    { headerName: '移仓', field: 'IsSwapOrder', width: 70, cellClassRules: textRightCellClass },
    { headerName: '详细状态', field: 'DetailedStatus', cellClassRules: isBuyCellClass },
    { headerName: '报单时间', field: 'ExchangeTime' },
    { headerName: '最后成交时间', field: 'LastFilledTime' },
    { headerName: '最后更新时间', field: 'UpdateTime' },
    { headerName: '撤单时间', field: 'CancellationTime' },
    { headerName: '有效期', field: 'GoodTillDate' },
    { headerName: '交易所', field: 'ExchangeName' },
    { headerName: '下单员', field: 'TraderName' },
    { headerName: '报单编号', field: 'Reference' },
    { headerName: '报单ID', field: 'AccountOrderId' }
  ];
  // 持仓 - 列定义
  const columnDefsOfAccountHoldPosition = [
    { headerName: '账户', field: 'AgentCode', width: 150 },
    { headerName: '合约', field: 'InstrumentCode' },
    { headerName: '币种', field: 'CurrencyID', type: 'dimension', width: 80 },
    { headerName: '买卖', field: 'Direction', cellClassRules: isBuyCellClass, width: 70 },
    { headerName: '总仓', field: 'TotalLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
    { headerName: '昨仓', field: 'TotalHistoryLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
    { headerName: '今仓', field: 'TotalTodayLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
    { headerName: '投机', field: 'TotalSpeculationLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
    { headerName: '保值', field: 'TotalHedgeLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
    { headerName: '开仓均价', field: 'AverageByTradeText', cellClassRules: textRightCellClass },
    { headerName: '浮动盈亏', field: 'PostionPnLByTrade', type: 'dimension,measure', cellClassRules: colorCellClass },
    { headerName: '持仓均价', field: 'AverageByDateText', cellClassRules: textRightCellClass },
    { headerName: '持仓盈亏', field: 'PostionPnLByDate', type: 'dimension,measure', cellClassRules: colorCellClass },
    { headerName: '占用保证金', field: 'UsedMargin', type: 'measure', cellClassRules: textRightCellClass },
    { headerName: '市场持仓量', field: 'MarketPosition', type: 'measure', width: 110, cellClassRules: textRightCellClass },
    {
      headerName: '持仓占比',
      field: 'PositionRatio',
      cellRenderer: function (params) {
        if ([null, undefined].includes(params.value)) {
          return '';
        }
        if (params.value < 0.01) {
          return '<1%';
        }
        return (params.value * 100).toFixed() + '%';
      },
      width: 90
    },
    { headerName: '合约名', field: 'InstrumentName' },
    { headerName: '交易所', field: 'ExchangeName', width: 120 },
    { headerName: '浮动盈亏（本币）', field: 'PostionPnLByTradeByFuncCurrency', type: 'dimension,measure', cellClassRules: colorCellClass },
    { headerName: '占用保证金（本币）', field: 'UsedMarginByFuncCurrency', type: 'measure', cellClassRules: textRightCellClass },
    { headerName: '汇率', field: 'ExchangeRate', type: 'measureFour', cellClassRules: textRightCellClass },
  ];
  // 利润中心明细 - 列定义
  const columnDefsOfProfitDetail = [
    { headerName: '利润中心', field: 'AccountName', type: 'dimension', width: 120 },
    { headerName: '币种', field: 'CurrencyId', type: 'dimension', width: 80 },
    { headerName: '保证金', field: 'UsedMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '冻结保证金', field: 'FrozenMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '浮动盈亏', field: 'PostionPnLByTrade', type: 'dimension,measure', width: 120, cellClassRules: colorCellClass },
    { headerName: '平仓盈亏', field: 'TodayCloseProfitByTrade', type: 'dimension,measure', width: 120, cellClassRules: colorCellClass },
    { headerName: '历史平仓盈亏', field: 'HistoryCloseProfitByTrade', type: 'dimension,measure', cellClassRules: colorCellClass, width: 120 },
    { headerName: '总盈亏', field: 'TotalPnLByTrade', type: 'dimension,measure', cellClassRules: colorCellClass, width: 120 },
    { headerName: '权利金', field: 'CashIn', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '冻结权利金', field: 'FrozenCashIn', type: 'measure', width: 120, cellClassRules: textRightCellClass },
    { headerName: '保证金（本币）', field: 'UsedMarginByFuncCurrency', type: 'measure', width: 140, cellClassRules: textRightCellClass },
    { headerName: '冻结保证金（本币）', field: 'FrozenMarginByFuncCurrency', type: 'measure', width: 150, cellClassRules: textRightCellClass },
    { headerName: '浮动盈亏（本币）', field: 'PostionPnLByTradeByFuncCurrency', type: 'dimension,measure', cellClassRules: colorCellClass },
    { headerName: '平仓盈亏（本币）', field: 'TotalCloseProfitByTradeByFuncCurrency', type: 'dimension,measure', width: 140, cellClassRules: colorCellClass },
    { headerName: '历史平仓盈亏（本币）', field: 'HistoryCloseProfitByTradeByFuncCurrency', type: 'dimension,measure', cellClassRules: colorCellClass, width: 160 },
    { headerName: '总盈亏（本币）', field: 'TotalPnLByTradeByFuncCurrency', type: 'dimension,measure', cellClassRules: colorCellClass, width: 140 },
    { headerName: '权利金（本币）', field: 'CashInByFuncCurrency', type: 'measure', width: 140, cellClassRules: textRightCellClass },
    { headerName: '冻结权利金（本币）', field: 'FrozenCashInByFuncCurrency', type: 'measure', width: 150, cellClassRules: {...textRightCellClass, ...paddingRightClass} },
  ];

  let worker;
  let accountMaxSequence = 100;// 利润中心最大序号，用于置顶功能
  let agentMaxSequence = 100;// 资金账户最大序号，用于置顶功能
  const accountSequence = 'AccountSequence';// localStorage Key, 用于利润中心序号存取。
  const agentSequence = 'AgentSequence';// localStorage Key,用于资金账户序号存取。

  export default {
    name: 'RealTimeRiskControlList',
    components: { exceptionInformation, riskInformation },
    mounted () {
      // 利润中心
      const profitCenterGridDiv = document.querySelector('#profitCenter');
      // 利润中心合计
      const profitCenterGridBottomDiv = document.querySelector('#profitCenterGridBottom');
      // 资金账户
      const tradeAccountGridDivOfAgentPosition = document.querySelector('#tradeAccount');
      // 资金账户合计
      const tradeAccountGridBottomDivOfAgentPosition = document.querySelector('#tradeAccountGridBottom');

      // 资金账户总持仓
      const tradeAccountTotalHoldPositionGridDivOfAgentPosition = document.querySelector('#tradeAccountTotalHoldPosition');
      // 利润中心总持仓
      const profitCenterTotalHoldPositionGridDivOfAgentPosition = document.querySelector('#profitCenterTotalHoldPosition');

      // 成交明细
      const dealDetailGridDiv = document.querySelector('#dealDetail');
      // 成交汇总-按账户
      const dealDetailOfAccountGridDiv = document.querySelector('#dealSummaryOfAccount');
      // 所有报单
      const allBillGridDiv = document.querySelector('#allBill');
      // 持仓
      const accountOrAgentPositionGridDiv = document.querySelector('#accountOrAgentPosition');
      // 持仓合计
      const accountOrAgentPositionGridBottomDiv = document.querySelector('#accountOrAgentPositionGridBottom');

      // 利润中心明细
      const profitDetailGridDiv = document.querySelector('#profitDetail');
      // 利润中心明细合计
      const profitDetailGridBottomDiv = document.querySelector('#profitDetailGridBottom');
      // 利润中心合计
      new agGrid.Grid(profitCenterGridBottomDiv, this.profitCenterSummaryGridOptions);
      // 利润中心
      new agGrid.Grid(profitCenterGridDiv, this.profitCenterGridOptions);
      this.profitCenterSummaryGridOptions.alignedGrids.push(this.profitCenterGridOptions);
      this.profitCenterGridOptions.alignedGrids.push(this.profitCenterSummaryGridOptions);
      // 资金账户合计
      new agGrid.Grid(tradeAccountGridBottomDivOfAgentPosition, this.agentOutputsSummaryGridOptions);
      // 资金账户
      new agGrid.Grid(tradeAccountGridDivOfAgentPosition, this.agentOutputsGridOptions);
      this.agentOutputsSummaryGridOptions.alignedGrids.push(this.agentOutputsGridOptions);
      this.agentOutputsGridOptions.alignedGrids.push(this.agentOutputsSummaryGridOptions);

      // 资金账户总持仓
      new agGrid.Grid(tradeAccountTotalHoldPositionGridDivOfAgentPosition, this.agentPositionSumOutputsGridOptions);
      // 利润中心总持仓
      new agGrid.Grid(profitCenterTotalHoldPositionGridDivOfAgentPosition, this.actAgtPositionSumOutputsGridOptions);

      // 成交明细
      new agGrid.Grid(dealDetailGridDiv, this.fillOutputsGridOptions);

      // 成交汇总-按账户
      new agGrid.Grid(dealDetailOfAccountGridDiv, this.dealSummaryOfAccountGridOptions);

      // 所有报单
      new agGrid.Grid(allBillGridDiv, this.accountOrderOutputsGridOptions);

      // 持仓
      new agGrid.Grid(accountOrAgentPositionGridDiv, this.accountOrAgentPositionOutputsGridOptions);

      // 持仓合计
      new agGrid.Grid(accountOrAgentPositionGridBottomDiv, this.accountOrAgentPositionSummaryGridOptions);
      this.accountOrAgentPositionSummaryGridOptions.alignedGrids.push(this.accountOrAgentPositionOutputsGridOptions);
      this.accountOrAgentPositionOutputsGridOptions.alignedGrids.push(this.accountOrAgentPositionSummaryGridOptions);

      // 利润中心明细
      new agGrid.Grid(profitDetailGridDiv, this.profitDetailGridOptions);

      // 利润中心明细合计
      new agGrid.Grid(profitDetailGridBottomDiv, this.profitDetailSummaryGridOptions);
      this.profitDetailSummaryGridOptions.alignedGrids.push(this.profitDetailGridOptions);
      this.profitDetailGridOptions.alignedGrids.push(this.profitDetailSummaryGridOptions);

    },
    data () {
      let that = this;
      let accountRowIndex = -1;
      let agentRowIndex = -1;

      return {
        wsConnectStatus: false,
        themeMode: true,
        isAccount: true,

        // 利润中心合计 - GridOptions
        profitCenterSummaryGridOptions: {
          ...sharedGridOptions,
          columnDefs: [
            { field: 'ToTop', width: 30 },
            { headerName: '利润中心', field: 'AccountName', type: 'dimension', width: 180 },
            { headerName: '授权资金', field: 'Budget', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '可用资金', field: 'Available', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '保证金', field: 'UsedMarginByFuncCurrency', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '冻结保证金', field: 'FrozenMarginByFuncCurrency', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '止损线', field: 'StopLine', type: 'dimension', width: 120, cellClassRules: textRightCellClass },
            { headerName: '浮动盈亏', field: 'PostionPnLByTradeByFuncCurrency', type: 'measure', cellClassRules: colorCellClass, width: 120 },
            { headerName: '平仓盈亏', field: 'TodayCloseProfitByTradeByFuncCurrency', type: 'measure', cellClassRules: colorCellClass, width: 120 },
            { headerName: '历史平仓盈亏', field: 'HistoryCloseProfitByTradeByFuncCurrency', type: 'measure', cellClassRules: colorCellClass, width: 120 },
            { headerName: '总盈亏', field: 'TotalPnLByTradeByFuncCurrency', type: 'measure', cellClassRules: colorCellClass, width: 120 },
            { field: 'Sequence', width: 50, type: 'measure', hide: true }
          ],
          headerHeight: 0,
          rowHeight: 26,
          rowData: [
            {
              ToTop: null,
              AccountName: '合计',
              Budget: 0,
              Available: 0,
              UsedMarginByFuncCurrency: 0,
              FrozenMarginByFuncCurrency: 0,
              StopLine: '',
              PostionPnLByTradeByFuncCurrency: 0,
              TotalCloseProfitByTradeByFuncCurrency: 0,
              HistoryCloseProfitByTradeByFuncCurrency: 0,
              TotalPnLByTradeByFuncCurrency: 0
            }
          ],
          alignedGrids: []
        },
        // 利润中心 - GridOptions
        profitCenterGridOptions: {
          ...sharedGridOptions,
          suppressHorizontalScroll: true,
          alignedGrids: [],
          columnDefs: columnDefsOfProfitCenter,
          onRowClicked: function (event) {
            if (accountRowIndex == event.rowIndex) {
              return;
            }
            agentRowIndex = -1;
            accountRowIndex = event.rowIndex;
            // 获取持仓数据
            that.agentOutputsGridOptions.api.deselectAll();
            worker.postMessage({ type: 'clearPositionOutputs' });
            that.accountOrAgentPositionOutputsGridOptions.api.setRowData([]);
            worker.postMessage({
              type: 'subscribeAgentHoldPosition',
              AccountId: event.node.data.AccountId,
              CurrencyID: event.node.data.CurrencyID,
            });
            // 获取利润中心明细数据
            worker.postMessage({ type: 'clearProfitDetailOutputs' });
            that.profitDetailGridOptions.api.setRowData([]);
          }
        },
        // 资金账户合计 - GridOptions
        agentOutputsSummaryGridOptions: {
          ...sharedGridOptions,
          columnDefs: [
            { field: 'ToTop', width: 30 },
            { headerName: '资金账户', field: 'AgentCode', type: 'dimension', width: 180 },
            { headerName: '账号', field: 'AccountId', type: 'dimension', width: 120 },
            { headerName: '币种', field: 'CurrencyID', type: 'dimension', width: 80 },
            { headerName: '动态权益', field: 'DynamicEquity', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '可用资金', field: 'Available', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '保证金', field: 'ExchangeMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '浮动盈亏', field: 'PositionProfit', type: 'measure', width: 120, cellClassRules: colorCellClass },
            { headerName: '平仓盈亏', field: 'CloseProfit', type: 'measure', width: 120, cellClassRules: colorCellClass },
            { headerName: '手续费', field: 'Commission', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '冻结保证金', field: 'FrozenMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '冻结手续费', field: 'FrozenCommission', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '结算准备金', field: 'Balance', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '风险度', field: 'RiskDegree', width: 100, cellRenderer: 'appendPercent', cellClassRules: textRightCellClass },
            { headerName: '持盈比例', field: 'ProfitRadio', width: 120, cellRenderer: 'appendPercent', cellClassRules: colorCellClass },
            { headerName: '出入金', field: 'CashInAndOut', type: 'measure', width: 100, cellClassRules: colorCellClass },
            { headerName: '连接状态', field: 'ConnectionStatus', width: 100, cellClassRules: isBuyCellClass },
            { headerName: '上次结算准备金', field: 'PreBalance', type: 'measure', width: 140, cellClassRules: textRightCellClass },
            { headerName: '可取', field: 'WithdrawQuota', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '出金', field: 'Withdraw', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '入金', field: 'Deposit', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '法人', field: 'Corporation', width: 120 },
            { headerName: 'ForeignBalance', field: 'ForeignBalance', width: 130, cellClassRules: textRightCellClass },
            { headerName: 'TotalValue', field: 'TotalValue', width: 120, cellClassRules: textRightCellClass },
            { headerName: 'OTE', field: 'OTE', width: 120, cellClassRules: textRightCellClass },
            { headerName: 'MVO', field: 'MVO', width: 120, cellClassRules: textRightCellClass },
            { headerName: 'InitialMargin', field: 'InitialMargin', width: 120, cellClassRules: textRightCellClass },
            { headerName: 'CashExcess', field: 'CashExcess', width: 120, cellClassRules: {...textRightCellClass, ...paddingRightClass} }
          ],
          headerHeight: 0,
          rowHeight: 26,
          rowData: [
            {
              ToTop: null,
              AgentCode: '合计',
              AccountId: '',
              CurrencyID: '',
              DynamicEquity: 0,
              Available: 0,
              ExchangeMargin: 0,
              PositionProfit: 0,
              CloseProfit: 0,
              Commission: 0,
              FrozenMargin: 0,
              FrozenCommission: 0,
              Balance: 0,
              RiskDegree: 0,
              ProfitRadio: 0,
              CashInAndOut: 0,
              ConnectionStatus: '',
              PreBalance: 0,
              WithdrawQuota: 0,
              Withdraw: 0,
              Deposit: 0,
              Corporation: '',
              ForeignBalance: 0,
              TotalValue: 0,
              OTE: 0,
              MVO: 0,
              InitialMargin: 0,
              CashExcess: 0,
            }
          ],
          alignedGrids: []
        },
        // 资金账户 - GridOptions
        agentOutputsGridOptions: {
          ...sharedGridOptions,
          suppressHorizontalScroll: true,
          alignedGrids: [],
          columnDefs: columnDefsOfTradeAccount,
          onRowClicked: function (event) {
            if (agentRowIndex == event.rowIndex) {
              return;
            }
            accountRowIndex = -1;
            agentRowIndex = event.rowIndex;
            that.profitCenterGridOptions.api.deselectAll();
            worker.postMessage({ type: 'clearPositionOutputs' });
            that.accountOrAgentPositionOutputsGridOptions.api.setRowData([]);
            worker.postMessage({
              type: 'subscribeAccountHoldPositionAgentAndCorporation',
              AgentId: event.node.data.AgentId,
              AccountId: event.node.data.AccountId,
            });
          }
        },
        // 资金账户总持仓 - GridOptions
        agentPositionSumOutputsGridOptions: {
          ...sharedGridOptions,
          masterDetail: true,
          detailCellRendererParams: {
            detailGridOptions: {
              ...sharedGridOptions,
              rowData: [],
              deltaRowDataMode: false,
              getRowNodeId: function (data) {
                return data.Key;
              },
              gridAutoHeight: true,
              columnDefs: [
                { headerName: '账号', field: 'Agent', },
                { headerName: '方向', field: 'Direction', cellClassRules: isBuyCellClass, width: 64 },
                { headerName: '投保', field: 'HedgeType', width: 64 },
                { headerName: '数量', field: 'TotalVolume', type: 'dimension', width: 70, cellClassRules: textRightCellClass },
                { headerName: '合约名', field: 'InstrumentName' },
                { headerName: '法人', field: 'Corporation' }
              ]
            },
            getDetailRowData: function (params) {
              params.successCallback(params.data.Infos);
            }
          },
          columnDefs: columnDefsOfTradeAccountTotalHoldPosition,
          getRowHeight: function (params) {
            let isDetailRow = params.node.detail;
            if (isDetailRow) {
              if (params.data.Infos.length <= 1) {
                return 130;
              }
              return params.data.Infos.length * 28 + 80;
            } else {
              return 25;
            }
          }
        },
        // 利润中心总持仓 - GridOptions
        actAgtPositionSumOutputsGridOptions: {
          ...sharedGridOptions,
          masterDetail: true,
          detailCellRendererParams: {
            detailGridOptions: {
              ...sharedGridOptions,
              rowData: [],
              deltaRowDataMode: false,
              getRowNodeId: function (data) {
                return data.Key;
              },
              gridAutoHeight: true,
              columnDefs: [
                { headerName: '利润中心', field: 'Account' },
                { headerName: '方向', field: 'Direction', cellClassRules: isBuyCellClass, width: 64 },
                { headerName: '投保', field: 'HedgeType', width: 64 },
                { headerName: '数量', field: 'TotalVolume', type: 'dimension', width: 70, cellClassRules: textRightCellClass },
                { headerName: '合约名', field: 'InstrumentName' },
                { headerName: '资金账户', field: 'Agent' },
                { headerName: '法人', field: 'Corporation' }
              ]
            },
            getDetailRowData: function (params) {
              params.successCallback(params.data.Infos);
            }
          },
          columnDefs: columnDefsOfProfitCenterTotalHoldPosition,
          getRowHeight: function (params) {
            let isDetailRow = params.node.detail;
            if (isDetailRow) {
              if (params.data.Infos.length <= 1) {
                return 130;
              }
              return params.data.Infos.length * 28 + 80;
            } else {
              return 25;
            }
          }
        },
        // 成交明细 - GridOptions
        fillOutputsGridOptions: {
          ...sharedGridOptions,
          columnDefs: columnDefsOfDealDetail
        },
        // 成交汇总-按账户 - GridOptions
        dealSummaryOfAccountGridOptions: {
          ...sharedGridOptions,
          columnDefs: columnDefsOfAccountDealSummary
        },
        // 所有报单 - GridOptions
        accountOrderOutputsGridOptions: {
          ...sharedGridOptions,
          columnDefs: columnDefsOfAllBill
        },
        // 持仓 - GridOptions
        accountOrAgentPositionOutputsGridOptions: {
          ...sharedGridOptions,
          columnDefs: columnDefsOfAccountHoldPosition,
          suppressHorizontalScroll: true,
          alignedGrids: []
        },
        // 持仓合计
        accountOrAgentPositionSummaryGridOptions: {
          ...sharedGridOptions,
          columnDefs: [
              { headerName: '账户', field: 'AgentCode', type: 'dimension', width: 150 },
              { headerName: '合约', field: 'InstrumentCode', type: 'dimension' },
              { headerName: '币种', field: 'CurrencyID', type: 'dimension', width: 80 },
              { headerName: '买卖', field: 'Direction', cellClassRules: isBuyCellClass, width: 70 },
              { headerName: '总仓', field: 'TotalLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
              { headerName: '昨仓', field: 'TotalHistoryLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
              { headerName: '今仓', field: 'TotalTodayLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
              { headerName: '投机', field: 'TotalSpeculationLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
              { headerName: '保值', field: 'TotalHedgeLots', type: 'dimension,measureFlash', width: 90, cellClassRules: textRightCellClass },
              { headerName: '开仓均价', field: 'AverageByTrade', cellClassRules: textRightCellClass },
              { headerName: '浮动盈亏', field: 'PostionPnLByTrade', type: 'dimension,measure', cellClassRules: colorCellClass },
              { headerName: '持仓均价', field: 'AverageByDate', cellClassRules: textRightCellClass },
              { headerName: '持仓盈亏', field: 'PostionPnLByDate', type: 'dimension,measure', cellClassRules: colorCellClass },
              { headerName: '占用保证金', field: 'UsedMargin', type: 'measure', cellClassRules: textRightCellClass },
              { headerName: '市场持仓量', field: 'MarketPosition', type: 'measure', width: 110, cellClassRules: textRightCellClass },
              { headerName: '持仓占比', field: 'PositionRatio' },
              { headerName: '合约名', field: 'InstrumentName' },
              { headerName: '交易所', field: 'ExchangeName', width: 120 },
              { headerName: '浮动盈亏（本币）', field: 'PostionPnLByTradeByFuncCurrency', type: 'dimension,measure', cellClassRules: colorCellClass },
              { headerName: '占用保证金（本币）', field: 'UsedMarginByFuncCurrency', type: 'measure', cellClassRules: textRightCellClass },
              { headerName: '汇率', field: 'ExchangeRate', type: 'measureFour', cellClassRules: {...textRightCellClass, ...paddingRightClass} },
            ],
          headerHeight: 0,
          rowHeight: 26,
          rowData: [
            {
              AgentCode: '合计',
              InstrumentCode: '',
              CurrencyID: '',
              Direction: '',
              TotalLots: 0,
              TotalHistoryLots: 0,
              TotalTodayLots: 0,
              TotalSpeculationLots: 0,
              TotalHedgeLots: 0,
              AverageByTrade: '',
              PostionPnLByTrade: 0,
              Average: '',
              PositionProfit: 0,
              UsedMargin: 0,
              MarketPosition: 0,
              PositionRatio: '',
              InstrumentName: '',
              ExchangeName: '',
              PostionPnLByTradeByFuncCurrency: 0,
              UsedMarginByFuncCurrency: 0,
              ExchangeRate: ''
            }
          ],
          alignedGrids: []
        },
        // 利润中心明细 - GridOptions
        profitDetailGridOptions: {
          ...sharedGridOptions,
          columnDefs: columnDefsOfProfitDetail,
          suppressHorizontalScroll: true,
          alignedGrids: []
        },
        // 利润中心明细合计 - GridOptions
        profitDetailSummaryGridOptions: {
          ...sharedGridOptions,
          columnDefs: [
            { headerName: '利润中心', field: 'AccountName', type: 'dimension', width: 120 },
            { headerName: '币种', field: 'CurrencyId', type: 'dimension', width: 80 },
            { headerName: '保证金', field: 'UsedMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '冻结保证金', field: 'FrozenMargin', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '浮动盈亏', field: 'PostionPnLByTrade', type: 'dimension,measure', width: 120, cellClassRules: colorCellClass },
            { headerName: '平仓盈亏', field: 'TodayCloseProfitByTrade', type: 'dimension,measure', width: 120, cellClassRules: colorCellClass },
            { headerName: '历史平仓盈亏', field: 'HistoryCloseProfitByTrade', type: 'dimension,measure', cellClassRules: colorCellClass, width: 120 },
            { headerName: '总盈亏', field: 'TotalPnLByTrade', type: 'dimension,measure', cellClassRules: colorCellClass, width: 120 },
            { headerName: '权利金', field: 'CashIn', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '冻结权利金', field: 'FrozenCashIn', type: 'measure', width: 120, cellClassRules: textRightCellClass },
            { headerName: '保证金（本币）', field: 'UsedMarginByFuncCurrency', type: 'measure', width: 150, cellClassRules: textRightCellClass },
            { headerName: '冻结保证金（本币）', field: 'FrozenMarginByFuncCurrency', type: 'measure', width: 150, cellClassRules: textRightCellClass },
            { headerName: '浮动盈亏（本币）', field: 'PostionPnLByTradeByFuncCurrency', type: 'dimension,measure', width: 150, cellClassRules: colorCellClass },
            { headerName: '平仓盈亏（本币）', field: 'TotalCloseProfitByTradeByFuncCurrency', type: 'dimension,measure', width: 150, cellClassRules: colorCellClass },
            { headerName: '历史平仓盈亏（本币）', field: 'HistoryCloseProfitByTradeByFuncCurrency', type: 'dimension,measure', cellClassRules: colorCellClass, width: 150 },
            { headerName: '总盈亏（本币）', field: 'TotalPnLByTradeByFuncCurrency', type: 'dimension,measure', cellClassRules: colorCellClass, width: 150 },
            { headerName: '权利金（本币）', field: 'CashInByFuncCurrency', type: 'measure', width: 150, cellClassRules: textRightCellClass },
            { headerName: '冻结权利金（本币）', field: 'FrozenCashInByFuncCurrency', type: 'measure', width: 150, cellClassRules: {...textRightCellClass, ...paddingRightClass} }
          ],
          headerHeight: 0,
          rowHeight: 26,
          rowData: [
            {
              AccountName: '合计',
              CurrencyID: '',
              UsedMargin: 0,
              FrozenMargin: 0,
              PostionPnLByTrade: 0,
              TodayCloseProfitByTrade: 0,
              HistoryCloseProfitByTrade: 0,
              TotalPnLByTrade: 0,
              CashIn: 0,
              FrozenCashIn: 0,
              UsedMarginByFuncCurrency: 0,
              FrozenMarginByFuncCurrency: 0,
              PostionPnLByTradeByFuncCurrency: 0,
              TotalCloseProfitByTradeByFuncCurrency: 0,
              HistoryCloseProfitByTradeByFuncCurrency: 0,
              TotalPnLByTradeByFuncCurrency: 0,
              CashInByFuncCurrency: 0,
              FrozenCashInByFuncCurrency: 0
            }
          ],
          alignedGrids: []
        },
      };
    },
    created () {
      this.startWorker();
    },
    computed: {
      themeName () {
        return this.themeMode ? 'ag-theme-balham' : 'ag-theme-balham-dark';
      }
    },
    methods: {
      test () {
        this.startWorker();
      },

      startWorker () {
        worker = new Worker('./worker.js');
        worker.postMessage({ type: 'start', wsUrl: Window.wsUrl, singalrUrl: Window.singalrUrl });

        worker.onmessage = (e) => {
          switch (e.data.type) {
            case 'wsConnectSuccess':
              this.toggleWSConnectStatus();
              this.$Message.success(e.data.message);
              // 加载排序数据
              accountMaxSequence = this.getAndPostSequence(accountSequence, 'localAccountSequence');
              agentMaxSequence = this.getAndPostSequence(agentSequence, 'localAgentSequence');
              this.startRefresh();
              break;
            case 'loginSuccess':
              this.$Message.success(e.data.message);
              break;
            case 'setAccountOutputs':
              // 利润中心
              this.profitCenterGridOptions.api.setRowData(e.data.records);
              break;
            case 'updateAccountOutputs':
              // 利润中心
              this.profitCenterGridOptions.api.batchUpdateRowData({ update: e.data.records });
              break;
            case 'setAccountSumOutputs':
              // 利润中心合计
              this.profitCenterSummaryGridOptions.api.setRowData(e.data.records);
              break;
            case 'setAgentOutputs':
              // 资金账户
              this.agentOutputsGridOptions.api.setRowData(e.data.records);
              break;
            case 'updateAgentOutputs':
              // 资金账户
              this.agentOutputsGridOptions.api.batchUpdateRowData({ update: e.data.records });
              break;
            case 'setAgentSumOutputs':
              // 资金账户合计
              this.agentOutputsSummaryGridOptions.api.setRowData(e.data.records);
              break;
            case 'setAgentPositionSumOutputs':
              // 资金账户总持仓
              this.agentPositionSumOutputsGridOptions.api.setRowData(e.data.records);
              break;
            case 'updateAgentPositionSumOutputs':
              // 资金账户总持仓
              this.agentPositionSumOutputsGridOptions.api.batchUpdateRowData({ update: e.data.records });
              break;
            case 'setActAgtPositionSumOutputs':
              // 利润中心总持仓
              this.actAgtPositionSumOutputsGridOptions.api.setRowData(e.data.records);
              break;
            case 'updateActAgtPositionSumOutputs':
              // 利润中心总持仓
              this.actAgtPositionSumOutputsGridOptions.api.batchUpdateRowData({ update: e.data.records });
              break;
            case 'setFillOutputs':
              // 成交明细
              this.fillOutputsGridOptions.api.setRowData(e.data.records);
              break;
            case 'setFillSumBy':
              // 成交汇总
              if (e.data.records.length > 0) {
                e.data.records.forEach(item => {
                  console.log('Key --> ' + item.Key);
                });
              }
              this.dealSummaryOfAccountGridOptions.api.setRowData(e.data.records);
              break;
            case 'setAccountOrderOutputs':
              // 所有报单
              this.accountOrderOutputsGridOptions.api.setRowData(e.data.records);
              break;
            case 'setAccountOrAgentPositionOutputs':
              // 持仓
              this.accountOrAgentPositionOutputsGridOptions.api.setRowData(e.data.records);
              break;
            case 'updateAccountOrAgentPositionOutputs':
              // 持仓
              this.accountOrAgentPositionOutputsGridOptions.api.batchUpdateRowData({ update: e.data.records });
              break;
            case 'setPositionSumOutputs':
              // 持仓合计
              this.accountOrAgentPositionSummaryGridOptions.api.setRowData(e.data.records);
              break;
            case 'setProfitDetailOutputs':
              // 利润中心明细
              this.profitDetailGridOptions.api.setRowData(e.data.records);
              break;
            case 'upDateProfitDetailOutputs':
              // 利润中心明细
              this.profitDetailGridOptions.api.batchUpdateRowData({ update: e.data.records });
              break;
            case 'setProfitDetailSumOutputs':
              // 利润中心明细合计
              this.profitDetailSummaryGridOptions.api.setRowData(e.data.records);
              break;
            default:
              // eslint-disable-next-line no-console
              console.log('unrecognised😥 event type ' + e.type);
          }
        };
      },

      startRefresh () {
        worker.postMessage({ type: 'auth', token: window.localStorage.getItem('token') });
      },

      stopRefresh () {
        this.toggleWSConnectStatus();
        this.$Message.warning('WebSocket连接关闭');
        worker.postMessage({ type: 'stop' });
      },

      toggleWSConnectStatus () {
        this.wsConnectStatus = !this.wsConnectStatus;
      },

      searchDealDetail () {
        worker.postMessage({ type: 'dealDetail' });
      },

      searchDealSummary () {
        worker.postMessage({ type: 'dealSummary' });
      },

      searchAllBill () {
        worker.postMessage({ type: 'allBill' });
      },

      toggleFullScreen () {
        this.$refs['test'].$el.requestFullscreen();
      },

      getAndPostSequence (dataType, postType) {
        let maxSequence = 100;

        if (dataType === null || dataType === undefined
          || postType === null || postType === undefined) {
          return maxSequence;
        }

        let localSequence = localStorage.getItem(dataType);
        if (null != localSequence) {
          let sequenceArray = JSON.parse(localSequence);
          // 为了防止序号越界，此处重新初始化本地存储的序号数据
          let sortBySeq = _.orderBy(sequenceArray, ['Sequence'], ['asc']);
          sortBySeq.forEach(item => {
            item.Sequence = ++maxSequence;
          });
          localStorage.setItem(dataType, JSON.stringify(sortBySeq));
          worker.postMessage({ type: postType, Sequences: sequenceArray });
        }
        return maxSequence;
      },
    }
  };
</script>

<style>
  .text-green {
    color: #19be6b
  }

  .text-red {
    color: #ed4014
  }

  .text-yellow {
    color: #ff9900
  }

  .text-right {
    text-align: right;
  }
  .ag-theme-balham .ag-cell.padding-right20 {
    padding-right: 22px;
  }
</style>
<style scoped>
  .section-title {
    font-weight: bolder;
    padding: 5px 10px;
  }
  .ag-floating-top .ag-row-pinned.ag-row {
    background-color: #00e5ff;
  }
</style>
