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
          <DatePicker
                  type="daterange"
                  confirm
                  placement="bottom-start"
                  placeholder="结算日期"
                  v-model="settlementDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" filterable clearable v-model="query.commodityTypeId">
            <Option
              v-for="(item, index) in commonData.commodityTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="收支类型" filterable clearable v-model="query.paymentTypeId">
            <Option
              v-for="(item, index) in commonData.paymentTypes"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="币种" filterable clearable v-model="query.currencyId">
            <Option
              v-for="(item, index) in commonData.currencies"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcOtherPaymentRecord')">添加</Button>
          <file-upload
            tempName="其他收支记录导入模板"
            action="OtherPaymentRecord/Preview"
            import="OtherPaymentRecord/Import"
            download="OtherPaymentRecord/Download"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_CreateAcOtherPaymentRecord')"
          ></file-upload>
          <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState" v-if="isShow('H_ExportAcOtherPaymentRecord')">导出</Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" class="margin-right-3" @click="onSearch">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table
        v-maxHeight
        size="small"
        border
        ref="table"
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="columns"
        :data="list"
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
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
export default {
  data() {
    return {
      commonData: {
        options: {},
        enums: {},
        strategies: [],
        accountStrategies: []
      },
      query: {
        tradingDateRange: [],
        settlementDateRange: []
      },
      list: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      settlementDateRange: [],
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
          title: "结算日期",
          key: "settlementDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.settlementDate));
          }
        },
        {
          title: "品类",
          key: "commodityTypeId",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.commodityTypes,
                params.row.commodityTypeId
              )
            );
          }
        },
        {
          title: "收支类型",
          key: "paymentTypeId",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.paymentTypes,
                params.row.paymentTypeId
              )
            );
          }
        },
        {
          title: "币种",
          key: "currencyId",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(this.commonData.currencies, params.row.currencyId)
            );
          }
        },
        {
          title: "含税金额",
          key: "amount",
          align: "center",
          minWidth: 150,
          render: (h, params) => h('format-cell', {
            props: {
              num: params.row.amount
            }
          })
        },
        {
          title: "不含税金额",
          key: "amountAfterTax",
          align: "center",
          minWidth: 150,
          render: (h, params) => h('format-cell', {
            props: {
              num: params.row.amountAfterTax
            }
          })
        },
        {
          title: "备注",
          key: "remark",
          align: "center",
          minWidth: 196
        },
        {
          title: "数据来源",
          key: "sourceTypeText",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              'span',
              {
                class:  params.row.sourceType !== 1 ? 'orange' : 'blue'
              },
              params.row.sourceTypeText
            )
          }
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
            if(params.row.sourceType === 2){
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
                      icon: "md-create"
                    },
                    style: {
                      marginRight: "3px",
                      display: this.isShow('H_UpdateAcOtherPaymentRecord') ? 'block' : 'none'
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
                      icon: "md-trash",
                    },
                    style: {
                      marginRight: "3px",
                      display: this.isShow('H_DeleteAcOtherPaymentRecord') ? 'block' : 'none'
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
        }
      ],
      importColumns: [
        {
          title: "交易日期",
          key: "tradeDate",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.tradeDate));
          }
        },
        {
          title: "利润中心",
          key: "accountingEntity",
          align: "center",
          minWidth: 150
        },
        {
          title: "策略",
          key: "strategyText",
          align: "center",
          minWidth: 150
        },
        {
          title: "法人",
          key: "corporation",
          align: "center",
          minWidth: 150
        },
        {
          title: "资金账户",
          key: "tradeAccount",
          align: "center",
          minWidth: 150
        },
        {
          title: "结算日期",
          key: "settlementDate",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.settlementDate));
          }
        },
        {
          title: "品类",
          key: "commodityType",
          align: "center",
          minWidth: 120
        },
        {
          title: "收支类型",
          key: "paymentType",
          align: "center",
          minWidth: 100
        },

        {
          title: "币种",
          key: "currency",
          align: "center",
          minWidth: 120
        },
        {
          title: "含税金额",
          key: "amount",
          align: "center",
          minWidth: 150,
          render: (h, params) => h('format-cell', {
            props: {
              num: params.row.amount
            }
          })
        },
        {
          title: "不含税金额",
          key: "amountAfterTax",
          align: "center",
          minWidth: 150,
          render: (h, params) => h('format-cell', {
            props: {
              num: params.row.amountAfterTax
            }
          })
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
    let commonData = await this.api.getCommonData("OtherPaymentRecord");
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
        name: "OtherPaymentRecordCreate"
      });
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      utils.saveQuery(this.query);
      if (this.query.settlementDateRange.length) {
        this.query.settlementDateBegin = this.query.settlementDateRange[0];
        this.query.settlementDateEnd = this.query.settlementDateRange[1];
      }
      if (this.query.tradingDateRange.length) {
        this.query.tradeDateBegin = this.query.tradingDateRange[0];
        this.query.tradeDateEnd = this.query.tradingDateRange[1];
      }
      let query = { ...this.query };
      query.isLocked = new Boolean(query.isLocked);
      query.isBuy =
        query.isBuy !== 0 && query.isBuy !== 1
          ? null
          : new Boolean(query.isBuy);
      query.isClose =
        query.isClose !== 0 && query.isClose !== 1
          ? null
          : new Boolean(query.isClose);
      query.isHistory =
        query.isHistory !== 0 && query.isHistory !== 1
          ? null
          : new Boolean(query.isHistory);
      let { list, pagination } = await api.list(query, this.pagination);
      this.pagination = pagination;
      this.list = list;
    },
    resetQuery() {
      this.query = {};
      this.query.tradingDateRange = [];
      this.query.settlementDateRange = [];
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
          await api.delete(params.row.acOtherPaymentRecordId);
          this.$Message.success(`删除成功!`);
          this.search();
        }
      });
    },
    onEdit(params) {
      this.$router.push({
        name: "OtherPaymentRecordEdit",
        query: { id: params.row.acOtherPaymentRecordId }
      });
    },
    imported() {
      this.search();
    },
    onExport() {
      this.LoadingExportState = true
      api.exportExcel(
        this.query,
        `其他收支记录${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
      ).then(()=>{
        this.LoadingExportState = false
      })
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>

