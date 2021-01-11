<template>
  <div>
    <div>
      <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-start"
            placeholder="交易日期"
            v-model="query.tradingDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="利润中心" filterable clearable v-model="query.accountingEntityId">
            <Option
              v-for="(item, index) in commonData.accountingEntities"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="策略" filterable clearable v-model="query.tradingStrategyId">
            <Option
              v-for="(item, index) in accountStrategies"
              :label="item.name"
              :value="item.tradingStrategyId"
              :key="index"
            >{{item.tradingStrategyId}} - {{item.name}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" filterable clearable v-model="query.corporationId">
            <Option
              v-for="(item, index) in commonData.corporations"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
              v-for="(item, index) in commonData.tradeAccounts"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="外汇" filterable clearable v-model="query.wfCurrencyPairId">
            <Option
              v-for="(item, index) in commonData.currencyPairs"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <DatePicker
            type="daterange"
            confirm
            placement="bottom-end"
            placeholder="合约日期"
            v-model="query.contractDateRange"
          ></DatePicker>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <!-- <Button type="success" icon="md-refresh" class="margin-right-3" @click="getFutureRecord" v-if="isShow('H_CreateAcFutureTradeRecord')">获取</Button> -->
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcForexTradeRecord')">添加</Button>
          <!-- 外汇交易记录-新增 H_CreateAcForexTradeRecord -->
          <file-upload
            tempName="外汇交易记录导入模板"
            action="AcForexTradeRecord/Preview"
            import="AcForexTradeRecord/Import"
            download="AcForexTradeRecord/Download"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_CreateAcForexTradeRecord')"
          ></file-upload>
          <Button type="info" icon="ios-cloud-download-outline"  @click="onExport" :loading="LoadingExportState" v-if="isShow('H_ExportAcForexTradeRecord')">导出</Button>
          <!-- 外汇交易记录-编辑 H_UpdateAcForexTradeRecord -->
          <template v-if="selectList.length > 0">
            <Button type="warning" icon="md-create" class="margin-right-3" @click="editMore" v-if="isShow('H_UpdateAcForexTradeRecord')">批量编辑</Button>
            <!-- 外汇交易记录-编辑 H_UpdateAcForexTradeRecord -->
            <Poptip
                confirm
                title="确认批量删除?"
                @on-ok="delMore">
                <Button type="error" icon="md-trash" class="margin-right-3" v-if="isShow('H_DeleteAcForexTradeRecord')">批量删除</Button>
            </Poptip>
          </template>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
          <!-- 外汇交易记录-导出 H_ExportAcForexTradeRecord -->
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table
        v-maxHeight
        size="small"
        border
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="columns"
        :data="list"
        @on-selection-change="tableSelectHandle"
      ></Table>
    </div>
    <div>
      <QcPage
        size="small"
        show-total
        show-elevator
        show-sizer
        :current="pagination.currentPage"
        :total="pagination.totalCount"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></QcPage>
    </div>
    <!-- 批量编辑 -->
    <Modal
        v-model="isEditMore"
        title="批量编辑"
        @on-ok="editMoreOk"
        @on-cancel="isEditMore = false"
        width="70%"
    >
        <div>
          <manage ref="manage" :editMore="true" />
        </div>
    </Modal>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
import manage from "./manage"
export default {
  components:{manage},
  data() {
    return {
      commonData: {
        options: {},
        enums: {},
        accountStrategies: [],
        strategies: []
      },
      query: {
        tradingDateRange: [],
        contractDateRange: []
      },
      list: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      selectList:[],
      isEditMore: false,
      LoadingExportState: false,
      columns: [
        {
          title: "交易日期",
          key: "tradeDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.tradeDate));
          }
        },
        {
          title: "利润中心",
          key: "accountingEntityId",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.accountingEntities,
                params.row.accountingEntityId
              )
            );
          }
        },
        {
          title: "策略",
          key: "tradingStrategyId",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.strategies,
                params.row.tradingStrategyId,
                'name',
                'tradingStrategyId'
              )
            );
          }
        },
        {
          title: "资金账户",
          key: "tradeAccountId",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.tradeAccounts,
                params.row.tradeAccountId
              )
            );
          }
        },
        {
          title: "基础币种",
          key: "",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.currencyPairs,
                params.row.wfCurrencyPairId
              ).split('/')[0]
            );
          }
        },
        {
          title: "目标币种",
          key: "",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.currencyPairs,
                params.row.wfCurrencyPairId
              ).split('/')[1]
            );
          }
        },
        {
          title: "合约日期",
          key: "contractDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.contractDate));
          }
        },
        {
          title: '成交数量',
          key: 'baseAmount',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                fixed: 0,
                num: params.row.baseAmount
              }
            });
          }
        },
        {
          title: '成交价格',
          key: 'price',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                num: params.row.price
              }
            });
          }
        },
        {
          title: "方向",
          key: "isBuy",
          align: "center",
          minWidth: 80,
          render: (h, params) =>
            h(
              "span",
              typeof params.row.isBuy === "boolean"
                ? params.row.isBuy
                  ? "买"
                  : "卖"
                : ""
            )
        },
        {
          title: "开/平",
          key: "isClose",
          align: "center",
          minWidth: 80,
          render: (h, params) =>
            h(
              "span",
              typeof params.row.isClose === "boolean"
                ? params.row.isClose
                  ? "平"
                  : "开"
                : ""
            )
        },
        {
          title: "是否虚拟",
          key: "isVirtual",
          align: "center",
          minWidth: 80,
          render: (h, params) =>
            h(
              "span",
              typeof params.row.isVirtual === "boolean"
                ? params.row.isVirtual
                  ? "是"
                  : "否"
                : ""
            )
        },
        {
          title: "业务员",
          key: "trader",
          minWidth: 80,
          align: "center"
        },
        {
          title: "下单员",
          key: "operator",
          minWidth: 80,
          align: "center"
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 150,
          align: "center"
        },
        {
          title: "法人",
          key: "corporationId",
          align: "center",
          minWidth: 120,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.corporations,
                params.row.corporationId
              )
            );
          }
        },
        {
          title: "外汇",
          key: "wfCurrencyPairId",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.currencyPairs,
                params.row.wfCurrencyPairId
              )
            );
          }
        },
        {
          title: '成交金额',
          key: 'counterAmount',
          align: 'center',
          minWidth: 150,
          render: (h, params) =>
            h('format-cell', {
              props: {
                num: params.row.counterAmount
              }
            })
        },
        {
          title: "更新人",
          key: "lastManipulationBy",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.users,
                params.row.lastManipulationBy
              )
            );
          }
        },
        {
          title: "更新时间",
          key: "lastManipulationTime",
          align: "center",
          minWidth: 150,
          render: (h, params) =>
            h(
              "span",
              utils.formatDate(
                params.row.lastManipulationTime,
                "YYYY-MM-DD HH:mm:ss"
              )
            )
        },
        {
          title: "操作",
          align: "center",
          width: 100,
          fixed: "right",
          render: (h, params) => {
            return h("div", [
              h(
                "Tooltip",
                {
                  props: {
                    content: "编辑",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      size: "small",
                      icon: "md-create",

                    },
                    style: {
                      marginRight: "3px",
                      display: this.isShow('H_UpdateAcForexTradeRecord') ? 'block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.onEdit(params);
                      }
                    }
                  })
                ]
              ),
              h(
                "Tooltip",
                {
                  props: {
                    content: "删除",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      size: "small",
                      icon: "md-trash"
                    },
                    style: {
                      marginRight: "3px",
                      display: this.isShow('H_DeleteAcForexTradeRecord') ? 'block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.onDelete(params);
                      }
                    }
                  })
                ]
              )
            ]);
          }
        }
      ],
      importColumns: [
        {
          title: "交易日期",
          key: "tradeDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.tradeDate));
          }
        },
        {
          title: "利润中心",
          key: "accountingEntity",
          align: "center",
          minWidth: 120
        },
        {
          title: "策略",
          key: "strategyText",
          align: "center",
          minWidth: 120
        },
        {
          title: "资金账户",
          key: "tradeAccount",
          align: "center",
          minWidth: 120
        },
        {
          title: "基础币种",
          key: "baseCurrency",
          align: "center",
          minWidth: 80
        },
        {
          title: "目标币种",
          key: "counterCurrency",
          align: "center",
          minWidth: 80
        },
        
        {
          title: "合约日期",
          key: "contractDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.contractDate));
          }
        },
        {
          title: '成交数量',
          key: 'baseAmount',
          align: 'center',
          minWidth: 120,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                fixed: 0,
                num: params.row.baseAmount
              }
            });
          }
        },
        {
          title: '成交价格',
          key: 'price',
          align: 'center',
          minWidth: 150,
          render: (h, params) => {
            return h('format-cell', {
              props: {
                num: params.row.price
              }
            });
          }
        },
        {
          title: "方向",
          key: "isBuy",
          align: "center",
          minWidth: 80
        },
        {
          title: "开/平",
          key: "isClose",
          align: "center",
          minWidth: 80
        },
        {
          title: "是否虚拟",
          key: "isVirtual",
          align: "center",
          minWidth: 80
        },
        {
          title: "业务员",
          key: "trader",
          align: "center",
          minWidth: 80
        },
        {
          title: "下单员",
          key: "operator",
          align: "center",
          minWidth: 80
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 240,
          align: "center"
        }
      ]
    };
  },
  computed: {
    accountStrategies() {
      if (this.query.accountingEntityId) {
        const obj = this.commonData.accountStrategies.find(o => o.accountEntityId === this.query.accountingEntityId)
        return obj ? obj.tradingStrategies : []
      }
      return this.commonData.strategies
    }
  },
  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    let commonData = this.$store.state.cachedCommonData['acforextraderecord_getcommondata'];
    if (!commonData) {
      commonData = await this.api.getCommonData('AcForexTradeRecord');
    }
    let accountStrategies = [];
    _.forEach(commonData.accountStrategies, o => {
      accountStrategies.push(...o.tradingStrategies);
    });
    commonData.strategies = _.sortBy(_.uniqBy(accountStrategies, 'tradingStrategyId'), o => o.tradingStrategyId);
    this.commonData = commonData;
    this.search();
  },
  methods: {
    onAdd() {
      this.$router.push({
        name: "foreignExchangeTradeRecordCreate"
      });
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      utils.saveQuery(this.query);
      if (this.query.tradingDateRange.length) {
        this.query.tradeDateQueryStart = this.query.tradingDateRange[0] ;
        this.query.tradeDateQueryEnd = this.query.tradingDateRange[1];
      }
      if (this.query.contractDateRange.length) {
        this.query.contractDateQueryStart = this.query.contractDateRange[0];
        this.query.contractDateQueryEnd = this.query.contractDateRange[1];
      }
      let query = { ...this.query };
      query.isVirtual =
        typeof query.isVirtual === "number"
          ? new Boolean(query.isVirtual)
          : null;
      query.isBuy =
        typeof query.isBuy === "number" ? new Boolean(query.isBuy) : null;
        let { list, pagination } = await api.list(query, this.pagination);
        this.pagination = pagination;
        this.list = list;
    },
    resetQuery() {
      this.query = {};
      this.query.tradingDateRange = []
      this.query.contractDateRange = []
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    },
    onDelete(params) {
      this.$Modal.confirm({
        title: "删除",
        content: `<p>确认删除该条数据？</p>`,
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          await api.delete(params.row.acForexTradeRecordId);
          this.$Message.success(`删除成功!`);
          this.search();
        }
      });
    },
    onEdit(params) {
      this.$router.push({
        name: "foreignExchangeTradeRecordEdit",
        query: { id: params.row.acForexTradeRecordId }
      });
    },
    imported() {
      this.search();
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `外汇交易记录${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
      ).then(()=>{
        this.LoadingExportState = false
      })
    },
    async getFutureRecord(){
      let { list, pagination } = await api.getFutureRecord();
      this.pagination = pagination;
      this.list = list;
    },
    tableSelectHandle(selection) {
      this.selectList = selection.map( val => val.acForexTradeRecordId)
    },
    editMore() {
      if(this.selectList.length){
        this.isEditMore = true
      }else{
        this.$Message.info({
          content: '未有选中行！'
        })
      }
    },
    editMoreOk() {
      let params = {...this.$refs.manage.item, objectIds:this.selectList}
      api.multModify(params).then(()=>{
        this.$Message.success({
          content: "批量修改成功！"
        })
        this.search()
        this.$refs.manage.item = {
          volume: null,
          price: null,
          counterAmount: null,
          commission: null,
          tradeDate: null
        }
      })
    },
    delMore() {
      if(this.selectList.length){
        api.multDelete(this.selectList).then(()=>{
          this.$Message.info({
            content: '批量删除成功！'
          })
          this.search()
        })
      }else{
        this.$Message.info({
          content: '未有选中行！'
        })
      }
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>
