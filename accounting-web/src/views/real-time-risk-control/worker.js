/**
 * Fetch data via ws worker.
 */
import _ from 'lodash'

const webSocketState = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3
};
const requestType = {
  NONE: 0, // 无，用于心跳链接
  LOGIN_REQUEST: 1, // 登录
  SUBSCRIBE_ACCOUNT_REQUEST: 2, // 订阅账户
  FILL_REQUEST: 3, // 成交明细
  FILL_SUM_REQUEST: 4, // 成交汇总
  ACCOUNT_ORDER_REQUEST: 5 // 委托单（所有报单）
};
const responseType = {
  NONE: 0, // 无，通用，未定义的响应
  LOGIN_RESPONSE: 1, // 登录-响应
  SUBSCRIBE_ACCOUNT_RESPONSE: 2, // 订阅账户-响应
  FILL_RESPONSE: 3, // 成交明细-响应
  FILL_SUM_RESPONSE: 4, // 成交汇总-响应
  ACCOUNT_ORDER_RESPONSE: 5, // 委托单响应（所有报单）
  NOTIFY_ACCOUNTS: 500, // 利润中心-推送
  NOTIFY_AGENTS: 501, // 资金账户-推送
  NOTIFY_ACCOUNT_AGENT_POSITIONS: 502, // 利润中心持仓-账户-推送
  NOTIFY_ACCOUNT_POSITIONS: 503, // 利润中心持仓-法人-推送
  NOTIFY_AGENT_POSITIONS: 504, // 资金账户持仓-推送
  NOTIFY_ACCOUNT_AGENT_POSITION_SUMS: 505, // 利润中心账户总持仓-推送
  NOTIFY_ACCOUNT_POSITION_SUMS: 506, // 利润中心法人总持仓-推送
  NOTIFY_AGENT_POSITION_SUMS: 507, // 资金账户总持仓-推送
  NOTIFY_ACCOUNT_DETAILS: 508 // 利润中心明细-推送
};
const transferType = {
  NONE: 0, // 无
  NEW: 1, // 所有
  ADD: 2, // 添加
  DELETE: 3, // 删除
  UPDATE: 4 // 更新
};
const subscribeType = {
  ACCOUNT: 0, // 利润中心
  AGENT: 1 // 资金账户
};
const responseStatus = {
  SUCCESS: 1, // 成功
  FAIL: 0, // 失败
  EXPIRED: -1 // 过期
};
const requestModel = {
  RequestType: null,
  RequestCode: null, // 请求序列编号
  Data: {}
};
const responseModel = {
  ResponseType: null,
};
let ws;
let allAccountOutputs = []; // 全量的 ‘利润中心’ 数据
let allAgentOutputs = []; // 全量的 ‘资金账户’ 数据
let allActAgtPositionSumOutputs = []; // 全量的 ‘利润中心总持仓’ 数据
let allAgentPositionSumOutputs = []; // 全量的 ‘资金账户总持仓’ 数据
let allFillOutputs = []; // 全量的 ‘成交记录’ 数据
let allFillSumByAgentOutputs = []; // 全量的 ‘成交汇总-按账户’ 数据
let allAccountOrderOutputs = []; // 全量的 ‘委托单’ 数据
let allAccountOrAgentPositionOutputs = []; // 全量的 ‘持仓’ 数据
let allProfitDetailOutputs = []; // 全量的 ‘利润中心明细’ 数据
let allLocalAccountSequence = []; // 本地存储的利润中心序号数据，用于利润中心界面加载时的默认排序
let allLocalAgentSequence = []; // 本地存储的资金账户序号数据，用于资金账户界面加载时的默认排序

function createWS(url) {
  ws = new WebSocket(url);

  ws.onopen = function (event) {
    postMessage({
      type: 'wsConnectSuccess',
      message: '连接成功'
    });
  };

  ws.onmessage = function (event) {
    // 接收服务端数据入口
    let res = JSON.parse(event.data);
    let isAllData = res.Data && (res.Data.TransferType === transferType.NEW);
    let isADD = res.Data && (res.Data.TransferType === transferType.ADD);
    let isUpdate = res.Data && (res.Data.TransferType === transferType.UPDATE);
    let isDelete = res.Data && (res.Data.TransferType === transferType.DELETE);
    if (res.Status === responseStatus.SUCCESS) {
      switch (res.ResponseType) {
        case responseType.LOGIN_RESPONSE:
          postMessage({
            type: 'loginSuccess',
            message: res.Message
          });
          break;
        case responseType.NOTIFY_ACCOUNTS:
          // 利润中心
          if (isAllData) {
            allAccountOutputs = sortDatasBySequenceList(res.Data.AccountOutputs, allLocalAccountSequence);
            postMessage({
              type: 'setAccountOutputs',
              records: allAccountOutputs
            });
            sumAccountOutputs(allAccountOutputs);
          }
          if (isADD) {
            allAccountOutputs = sortDatasBySequenceList([ ...allAccountOutputs, ...res.Data.AccountOutputs ], allLocalAccountSequence);
            postMessage({
              type: 'setAccountOutputs',
              records: allAccountOutputs
            });
            sumAccountOutputs(allAccountOutputs);
          }
          if (isUpdate) {
            let deletedKeys = res.Data.AccountOutputs.map(t => t.Key);
            let filterDatas = allAccountOutputs.filter(item => !deletedKeys.includes(item.Key));
            allAccountOutputs = [ ...filterDatas, ...res.Data.AccountOutputs ];
            postMessage({
              type: 'updateAccountOutputs',
              records: res.Data.AccountOutputs
            });
            sumAccountOutputs(allAccountOutputs);
          }
          if (isDelete) {
            let deletedKeys = res.Data.AccountOutputs.map(t => t.Key);
            allAccountOutputs = allAccountOutputs.filter(item => !deletedKeys.includes(item.Key));
            postMessage({
              type: 'setAccountOutputs',
              records: allAccountOutputs
            });
            sumAccountOutputs(allAccountOutputs);
          }
          break;
        case responseType.FILL_RESPONSE:
          // 成交记录
          allFillOutputs = res.Data.FillOutputs;
          postMessage({
            type: 'setFillOutputs',
            records: allFillOutputs
          });
          break;
        case responseType.FILL_SUM_RESPONSE:
          // 成交汇总
          allFillSumByAgentOutputs = res.Data.FillSumByAgent.FillSumOutputs;
          postMessage({
            type: 'setFillSumBy',
            records: allFillSumByAgentOutputs,
          });
          break;
        case responseType.ACCOUNT_ORDER_RESPONSE:
          // 委托单
          allAccountOrderOutputs = res.Data.AccountOrderOutputs;
          postMessage({
            type: 'setAccountOrderOutputs',
            records: allAccountOrderOutputs
          });
          break;
        case responseType.NOTIFY_AGENTS:
          // 资金账户
          if (isAllData) {
            allAgentOutputs = sortDatasBySequenceList(res.Data.AgentOutputs, allLocalAgentSequence);
            postMessage({
              type: 'setAgentOutputs',
              records: allAgentOutputs
            });
            sumAgentOutputs(allAgentOutputs);
          }
          if (isADD) {
            allAgentOutputs = sortDatasBySequenceList([ ...allAgentOutputs, ...res.Data.AgentOutputs], allLocalAgentSequence);
            postMessage({
              type: 'setAgentOutputs',
              records: allAgentOutputs
            });
            sumAgentOutputs(allAgentOutputs);
          }
          if (isUpdate) {
            let deletedKeys = res.Data.AgentOutputs.map(t => t.Key);
            let filterDatas = allAgentOutputs.filter(item => !deletedKeys.includes(item.Key));
            allAgentOutputs = [ ...filterDatas, ...res.Data.AgentOutputs ];
            postMessage({
              type: 'updateAgentOutputs',
              records: res.Data.AgentOutputs
            });
            sumAgentOutputs(allAgentOutputs);
          }
          if (isDelete) {
            let deletedKeys = res.Data.AgentOutputs.map(t => t.Key);
            allAgentOutputs = allAgentOutputs.filter(item => !deletedKeys.includes(item.Key));
            postMessage({
              type: 'setAgentOutputs',
              records: allAgentOutputs
            });
            sumAgentOutputs(allAgentOutputs);
          }
          break;
        case responseType.NOTIFY_AGENT_POSITION_SUMS:
          // 资金账户总持仓
          if (isAllData) {
            allAgentPositionSumOutputs = res.Data.AgentPositionSumOutputs;
            postMessage({
              type: 'setAgentPositionSumOutputs',
              records: allAgentPositionSumOutputs
            });
          }
          if (isADD) {
            allAgentPositionSumOutputs = [ ...allAgentPositionSumOutputs, ...res.Data.AgentPositionSumOutputs ];
            postMessage({
              type: 'setAgentPositionSumOutputs',
              records: allAgentPositionSumOutputs
            });
          }
          if (isUpdate) {
            let deletedKeys = res.Data.AgentPositionSumOutputs.map(t => t.Key);
            let filterDatas = allAgentPositionSumOutputs.filter(item => !deletedKeys.includes(item.Key));
            allAgentPositionSumOutputs = [ ...filterDatas, ...res.Data.AgentPositionSumOutputs ];
            postMessage({
              type: 'updateAgentPositionSumOutputs',
              records: res.Data.AgentPositionSumOutputs
            });
          }
          if (isDelete) {
            let deletedKeys = res.Data.AgentPositionSumOutputs.map(t => t.Key);
            allAgentPositionSumOutputs = allAgentPositionSumOutputs.filter(item => !deletedKeys.includes(item.Key));
            postMessage({
              type: 'setAgentPositionSumOutputs',
              records: allAgentPositionSumOutputs
            });
          }
          break;
        case responseType.NOTIFY_ACCOUNT_AGENT_POSITION_SUMS:
          // 利润中心总持仓
          if (isAllData) {
            allActAgtPositionSumOutputs = res.Data.ActAgtPositionSumOutputs;
            postMessage({
              type: 'setActAgtPositionSumOutputs',
              records: allActAgtPositionSumOutputs
            });
          }
          if (isADD) {
            allActAgtPositionSumOutputs = [ ...allActAgtPositionSumOutputs, ...res.Data.ActAgtPositionSumOutputs ];
            postMessage({
              type: 'setActAgtPositionSumOutputs',
              records: allActAgtPositionSumOutputs
            });
          }
          if (isUpdate) {
            let deletedKeys = res.Data.ActAgtPositionSumOutputs.map(t => t.Key);
            let filterDatas = allActAgtPositionSumOutputs.filter(item => !deletedKeys.includes(item.Key));
            allActAgtPositionSumOutputs = [ ...filterDatas, ...res.Data.ActAgtPositionSumOutputs ];
            postMessage({
              type: 'updateActAgtPositionSumOutputs',
              records: res.Data.ActAgtPositionSumOutputs
            });
          }
          if (isDelete) {
            let deletedKeys = res.Data.ActAgtPositionSumOutputs.map(t => t.Key);
            allActAgtPositionSumOutputs = allActAgtPositionSumOutputs.filter(item => !deletedKeys.includes(item.Key));
            postMessage({
              type: 'setActAgtPositionSumOutputs',
              records: allActAgtPositionSumOutputs
            });
          }
          break;
        case responseType.NOTIFY_ACCOUNT_AGENT_POSITIONS:
        // 持仓 - 利润中心
        if (isAllData) {
          allAccountOrAgentPositionOutputs = res.Data.AccountAgentPositionOutputs;
          postMessage({
            type: 'setAccountOrAgentPositionOutputs',
            records: allAccountOrAgentPositionOutputs
          });
          sumPosition(allAccountOrAgentPositionOutputs)
        }
        if (isADD) {
          allAccountOrAgentPositionOutputs = [ ...allAccountOrAgentPositionOutputs, ...res.Data.AccountAgentPositionOutputs ];
          postMessage({
            type: 'setAccountOrAgentPositionOutputs',
            records: allAccountOrAgentPositionOutputs
          });
          sumPosition(allAccountOrAgentPositionOutputs)
        }
        if (isUpdate) {
          if (allAccountOrAgentPositionOutputs.length == 0) {
            return;
          }
          let deletedKeys = res.Data.AccountAgentPositionOutputs.map(t => t.Key);
          let filterDatas = allAccountOrAgentPositionOutputs.filter(item => !deletedKeys.includes(item.Key));
          allAccountOrAgentPositionOutputs = [ ...filterDatas, ...res.Data.AccountAgentPositionOutputs ];
          postMessage({
            type: 'updateAccountOrAgentPositionOutputs',
            records: res.Data.AccountAgentPositionOutputs
          });
          sumPosition(allAccountOrAgentPositionOutputs)
        }
        if (isDelete) {
          if (allAccountOrAgentPositionOutputs.length == 0) {
            return;
          }
          let deletedKeys = res.Data.AccountAgentPositionOutputs.map(t => t.Key);
          allAccountOrAgentPositionOutputs = allAccountOrAgentPositionOutputs.filter(item => !deletedKeys.includes(item.Key));
          postMessage({
            type: 'setAccountOrAgentPositionOutputs',
            records: allAccountOrAgentPositionOutputs
          });
          sumPosition(allAccountOrAgentPositionOutputs)
        }
        break;
        case responseType.NOTIFY_AGENT_POSITIONS:
          // 持仓 - 资金账户
          if (isAllData) {
            allAccountOrAgentPositionOutputs = res.Data.AgentPositionOutputs;
            postMessage({
              type: 'setAccountOrAgentPositionOutputs',
              records: allAccountOrAgentPositionOutputs
            });
            sumPosition(allAccountOrAgentPositionOutputs)
          }
          if (isADD) {
            allAccountOrAgentPositionOutputs = [ ...allAccountOrAgentPositionOutputs, ...res.Data.AgentPositionOutputs ];
            postMessage({
              type: 'setAccountOrAgentPositionOutputs',
              records: allAccountOrAgentPositionOutputs
            });
            sumPosition(allAccountOrAgentPositionOutputs)
          }
          if (isUpdate) {
            if (allAccountOrAgentPositionOutputs.length == 0) {
              return;
            }
            let deletedKeys = res.Data.AgentPositionOutputs.map(t => t.Key);
            let filterDatas = allAccountOrAgentPositionOutputs.filter(item => !deletedKeys.includes(item.Key));
            allAccountOrAgentPositionOutputs = [ ...filterDatas, ...res.Data.AgentPositionOutputs ];
            postMessage({
              type: 'updateAccountOrAgentPositionOutputs',
              records: res.Data.AgentPositionOutputs
            });
            sumPosition(allAccountOrAgentPositionOutputs)
          }
          if (isDelete) {
            if (allAccountOrAgentPositionOutputs.length == 0) {
              return;
            }
            let deletedKeys = res.Data.AgentPositionOutputs.map(t => t.Key);
            allAccountOrAgentPositionOutputs = allAccountOrAgentPositionOutputs.filter(item => !deletedKeys.includes(item.Key));
            postMessage({
              type: 'setAccountOrAgentPositionOutputs',
              records: allAccountOrAgentPositionOutputs
            });
            sumPosition(allAccountOrAgentPositionOutputs)
          }
          break;
        case responseType.NOTIFY_ACCOUNT_DETAILS:
          //利润中心明细
          if (isAllData) {
            allProfitDetailOutputs = res.Data.DetailOutputs;
            postMessage({
              type: 'setProfitDetailOutputs',
              records: allProfitDetailOutputs
            });
            sumProfitDetail(allProfitDetailOutputs)
          }
          if (isADD) {
            allProfitDetailOutputs = [ ...allProfitDetailOutputs, ...res.Data.DetailOutputs ];
            postMessage({
              type: 'setProfitDetailOutputs',
              records: allProfitDetailOutputs
            });
            sumProfitDetail(allProfitDetailOutputs)
          }
          if (isUpdate) {
            if (allProfitDetailOutputs.length == 0) {
              return;
            }
            let deletedKeys = res.Data.DetailOutputs.map(t => t.Key);
            let filterDatas = allProfitDetailOutputs.filter(item => !deletedKeys.includes(item.Key));
            allProfitDetailOutputs = [ ...filterDatas, ...res.Data.DetailOutputs ];
            postMessage({
              type: 'upDateProfitDetailOutputs',
              records: res.Data.DetailOutputs
            });
            sumProfitDetail(allProfitDetailOutputs)
          }
          if (isDelete) {
            if (allProfitDetailOutputs.length == 0) {
              return;
            }
            let deletedKeys = res.Data.AgentPositionOutputs.map(t => t.Key);
            allProfitDetailOutputs = allProfitDetailOutputs.filter(item => !deletedKeys.includes(item.Key));
            postMessage({
              type: 'setProfitDetailOutputs',
              records: allProfitDetailOutputs
            });
            sumProfitDetail(allProfitDetailOutputs)
          }
          break;
        default:
          // eslint-disable-next-line no-console
          console.log('unrecognised response type ' + event.type, res.ResponseType);
      }
    }
  };

  ws.onclose = function () {
    if (ws && ws.readyState === webSocketState.OPEN) {
      ws.close();
    } else {
      if (ws) {
        ws = null;
      }
    }
  };

  ws.onerror = function () {
    if (ws.readyState === webSocketState.OPEN) {
      ws.close();
    } else {
      ws = null;
    }
  };
}

function loadLocalAccountSequence(datas) {
  if (datas === null || datas === undefined) {
    return;
  }
  // 初始化本地存储的利润中心序号数据
  allLocalAccountSequence = datas;
}

function loadLocalAgentSequence(datas) {
  if (datas === null || datas === undefined) {
    return;
  }
  // 初始化本地存储的资金账户序号数据
  allLocalAgentSequence = datas;
}

function sortDatasBySequenceList(datas, sequenceList) {
  // 根据序列数据（sequenceList）排序数据（datas）
  if (datas === null || datas === undefined) {
    return [];
  }

  if (sequenceList === null || sequenceList === undefined) {
    return datas;
  }

  let newDatas = [];
  datas.forEach(item => {
    let query = _.find(sequenceList, ['Key', item.Key]);
    if (null === query || undefined === query) {
       newDatas.push(item);
    } else {
      item.Sequence = query.Sequence;
      newDatas.push(item);
    }
  });

  return newDatas.sort((a, b) => b.Sequence - a.Sequence);
}

function sortNewData(datas, newData) {
  // 数据（datas）中新增加一条数据（newData），然后排序数据（datas）
  if (datas === null || datas === undefined) {
    return [];
  }

  if (newData === null || newData === undefined) {
    return datas;
  }

  let filterDatas = datas.filter(a => !newData.Key.includes(a.Key));
  filterDatas.push(newData);
  return filterDatas.sort((a, b) => b.Sequence - a.Sequence);
}

function sumAccountOutputs(list) {
  // 利润中心合计
  let rowData = {
    ToTop: null,
    AccountName: '合计',
    Budget: 0,
    Available: 0,
    UsedMarginByFuncCurrency: 0,
    FrozenMarginByFuncCurrency: 0,
    StopLine: '',
    PostionPnLByTradeByFuncCurrency: 0,
    TodayCloseProfitByTradeByFuncCurrency: 0,
    HistoryCloseProfitByTradeByFuncCurrency: 0,
    TotalPnLByTradeByFuncCurrency: 0
  };
  if(list instanceof Array) {
    list.forEach(item => {
      rowData.Budget += item.Budget;
      rowData.Available += item.Available;
      rowData.UsedMarginByFuncCurrency += item.UsedMarginByFuncCurrency;
      rowData.FrozenMarginByFuncCurrency += item.FrozenMarginByFuncCurrency;
      rowData.PostionPnLByTradeByFuncCurrency += item.PostionPnLByTradeByFuncCurrency;
      rowData.TodayCloseProfitByTradeByFuncCurrency += item.TodayCloseProfitByTradeByFuncCurrency;
      rowData.HistoryCloseProfitByTradeByFuncCurrency += item.HistoryCloseProfitByTradeByFuncCurrency;
      rowData.TotalPnLByTradeByFuncCurrency += item.TotalPnLByTradeByFuncCurrency;
    });
  }
  postMessage({
    type: 'setAccountSumOutputs',
    records: [rowData]
  });
}

function sumAgentOutputs(list) {
  // 资金账户合计
  let rowData = {
      niToTopl: null,
      AgentCode: '合计',
      AccountId: '',
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
    };
    if(list instanceof Array) {
      list.forEach(item => {
        rowData.DynamicEquity += item.DynamicEquity;
        rowData.Available += item.Available;
        rowData.ExchangeMargin += item.ExchangeMargin;
        rowData.PositionProfit += item.PositionProfit;
        rowData.CloseProfit += item.CloseProfit;
        rowData.Commission += item.Commission;
        rowData.FrozenMargin += item.FrozenMargin;
        rowData.FrozenCommission += item.FrozenCommission;
        rowData.Balance += item.Balance;
        rowData.CashInAndOut += item.CashInAndOut;
        rowData.PreBalance += item.PreBalance;
        rowData.WithdrawQuota += item.WithdrawQuota;
        rowData.Withdraw += item.Withdraw;
        rowData.Deposit += item.Deposit;
      });
    }
    postMessage({
      type: 'setAgentSumOutputs',
      records: [rowData]
    });
}

function sumPosition(list) {
  // 持仓合计
  let rowData = {
    AgentCode: '合计',
    InstrumentCode: '',
    CurrencyID: '',
    Direction: '',
    TotalLots: 0,
    TotalHistoryLots: 0,
    TotalTodayLots: 0,
    TotalSpeculationLots: 0,
    TotalHedgeLots: 0,
    AverageByTradeText: '',
    PostionPnLByTrade: 0,
    AverageByDateText: '',
    PostionPnLByDate: 0,
    UsedMargin: 0,
    MarketPosition: 0,
    PositionRatio: '',
    InstrumentName: '',
    ExchangeName: '',
    PostionPnLByTradeByFuncCurrency: 0,
    UsedMarginByFuncCurrency: 0,
    ExchangeRate: ''
  };
  if (list instanceof Array) {
    list.forEach(item => {
      rowData.TotalLots += item.TotalLots;
      rowData.TotalHistoryLots += item.TotalHistoryLots;
      rowData.TotalTodayLots += item.TotalTodayLots;
      rowData.TotalSpeculationLots += item.TotalSpeculationLots;
      rowData.TotalHedgeLots += item.TotalHedgeLots;
      rowData.PostionPnLByTrade += item.PostionPnLByTrade;
      rowData.PostionPnLByDate += item.PostionPnLByDate;
      rowData.UsedMargin += item.UsedMargin;
      rowData.MarketPosition += item.MarketPosition;
      rowData.PostionPnLByTradeByFuncCurrency += item.PostionPnLByTradeByFuncCurrency;
      rowData.UsedMarginByFuncCurrency += item.UsedMarginByFuncCurrency;
    });
  }
  postMessage({
    type: 'setPositionSumOutputs',
    records: [rowData]
  });
}

function sumProfitDetail(list) {
  // 利润中心明细合计
  let rowData = {
    AccountName: '合计',
    CurrencyID: '',
    CashIn: 0,
    CashInByFuncCurrency: 0,
    CombinFrozen: 0,
    CurrencyId: "",
    FrozenCashIn: 0,
    FrozenCashInByFuncCurrency: 0,
    FrozenMargin: 0,
    FrozenMarginByFuncCurrency: 0,
    HistoryCloseProfitByTrade: 0,
    HistoryCloseProfitByTradeByFuncCurrency: 0,
    Key: "",
    LastUpdateTimeTicks: 0,
    PostionPnLByDate: 0,
    PostionPnLByTrade: 0,
    PostionPnLByTradeByFuncCurrency: 0,
    TodayCloseProfitByTrade: 0,
    TotalCloseProfitByTrade: 0,
    TotalCloseProfitByTradeByFuncCurrency: 0,
    TotalPnLByTrade: 0,
    TotalPnLByTradeByFuncCurrency: 0,
    UsedMargin: 0,
    UsedMarginByFuncCurrency: 0
  };
  if (list instanceof Array) {
    list.forEach(item => {
      rowData.CashIn += item.CashIn;
      rowData.CashInByFuncCurrency += item.CashInByFuncCurrency;
      rowData.CombinFrozen += item.CombinFrozen;
      rowData.FrozenCashIn += item.FrozenCashIn;
      rowData.FrozenCashInByFuncCurrency += item.FrozenCashInByFuncCurrency;
      rowData.FrozenMargin += item.FrozenMargin;
      rowData.FrozenMarginByFuncCurrency += item.FrozenMarginByFuncCurrency;
      rowData.HistoryCloseProfitByTrade += item.HistoryCloseProfitByTrade;
      rowData.HistoryCloseProfitByTradeByFuncCurrency += item.HistoryCloseProfitByTradeByFuncCurrency;
      rowData.LastUpdateTimeTicks += item.LastUpdateTimeTicks;
      rowData.PostionPnLByDate += item.PostionPnLByDate;
      rowData.PostionPnLByTrade += item.PostionPnLByTrade;
      rowData.PostionPnLByTradeByFuncCurrency += item.PostionPnLByTradeByFuncCurrency;
      rowData.TodayCloseProfitByTrade += item.TodayCloseProfitByTrade;
      rowData.TotalCloseProfitByTrade += item.TotalCloseProfitByTrade;
      rowData.TotalCloseProfitByTradeByFuncCurrency += item.TotalCloseProfitByTradeByFuncCurrency;
      rowData.TotalPnLByTrade += item.TotalPnLByTrade;
      rowData.TotalPnLByTradeByFuncCurrency += item.TotalPnLByTradeByFuncCurrency;
      rowData.UsedMargin += item.UsedMargin;
      rowData.UsedMarginByFuncCurrency += item.UsedMarginByFuncCurrency;
    });
  }
  postMessage({
    type: 'setProfitDetailSumOutputs',
    records: [rowData]
  });
}

function doAuth(token) {
  // 验证用户权限
  if (!ws) {
    return;
  }

  ws.send(JSON.stringify({
    RequestType: requestType.LOGIN_REQUEST,
    RequestCode: '',
    Data: {
      token
    }
  }));
}

function doSubscribeAgentHoldPosition(AccountId, CurrencyID) {
  // 订阅该 “利润中心” 下的 “持仓” 信息。
  if (!ws) {
    return;
  }

  ws.send(JSON.stringify({
    RequestType: requestType.SUBSCRIBE_ACCOUNT_REQUEST,
    RequestCode: '',
    Data: {
      SubscribeType: subscribeType.ACCOUNT,
      Account: {
        AccountId: AccountId,
        CurrencyID: CurrencyID
      }
    }
  }));
}

function doSubscribeAccountHoldPositionAgentAndCorporation(AgentId, AccountId) {
  // 订阅该 “资金账户” 下的 “持仓” 信息。
  if (!ws) {
    return;
  }

  ws.send(JSON.stringify({
    RequestType: requestType.SUBSCRIBE_ACCOUNT_REQUEST,
    RequestCode: '',
    Data: {
      SubscribeType: subscribeType.AGENT,
      Agent: {
        AgentId: AgentId,
        AccountId: AccountId
      }
    }
  }));
}

function getDealDetail() {
  // 获取 “成交明细” 数据
  if (!ws) {
    return;
  }

  ws.send(JSON.stringify({
    RequestType: requestType.FILL_REQUEST,
    RequestCode: '',
    Data: {}
  }));
}

function getDealSummary() {
  // 获取 “成交汇总” 数据
  if (!ws) {
    return;
  }

  ws.send(JSON.stringify({
    RequestType: requestType.FILL_SUM_REQUEST,
    RequestCode: '',
    Data: {}
  }));
}

function getAllBill() {
  // 获取 “委托单” 数据
  if (!ws) {
    return;
  }

  ws.send(JSON.stringify({
    RequestType: requestType.ACCOUNT_ORDER_REQUEST,
    RequestCode: '',
    Data: {}
  }));
}

// register worker event type
self.addEventListener('message', function (e) {
  switch (e.data.type) {
    case 'start':
      createWS(e.data.wsUrl);
      break;
    case 'auth':
      doAuth(e.data.token);
      break;
    case 'subscribeAgentHoldPosition':
      doSubscribeAgentHoldPosition(e.data.AccountId, e.data.CurrencyID);
      break;
    case 'subscribeAccountHoldPositionAgentAndCorporation':
      doSubscribeAccountHoldPositionAgentAndCorporation(e.data.AgentId, e.data.AccountId);
      break;
    case 'dealDetail':
      getDealDetail();
      break;
    case 'dealSummary':
      getDealSummary();
      break;
    case 'allBill':
      getAllBill();
      break;
    case 'stop':
      if (ws) {
        ws.close();
      }
      break;
    case 'sortAccount':
      allAccountOutputs = sortNewData(allAccountOutputs, e.data.RowData);
      postMessage({ type: 'setAccountOutputs', records: allAccountOutputs });
      break;
    case 'sortAgent':
      allAgentOutputs = sortNewData(allAgentOutputs, e.data.RowData);
      postMessage({ type: 'setAgentOutputs', records: allAgentOutputs });
      break;
    case 'localAccountSequence':
      loadLocalAccountSequence(e.data.Sequences);
      break;
    case 'localAgentSequence':
      loadLocalAgentSequence(e.data.Sequences);
      break;
    case 'clearPositionOutputs':
      sumPosition([]);
      allAccountOrAgentPositionOutputs = [];
      break;
    case 'clearProfitDetailOutputs':
      sumProfitDetail([]);
      allProfitDetailOutputs = [];
      break;
    default:
      console.log('unknown message type: ' + e.data);
      break;
  }
});
