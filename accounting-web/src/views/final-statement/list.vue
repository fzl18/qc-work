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
            placeholder="结算日期"
            v-model="query.statementDateRange"
          ></DatePicker>
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
          <Select placeholder="资金账户" title="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option v-for="(item, index) in commonData.tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="账户类型" title="账户类型" filterable clearable v-model="query.accountType">
            <Option v-for="(item, index) in commonData.accountType"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <statement-file-upload
            tempName="现货交易记录导入模板"
            action="AcStatementRecord/Preview"
            import="AcStatementRecord/Import"
            download="AcStatementRecord/DownLoadTemple"
            @imported="imported"
            v-if="isShow('H_ImportStatementRecord')"
          ></statement-file-upload>
          <Button type="success" icon=""  v-if="isShow('H_CreateSettlementPrice')" @click="settlementReference" class="margin-right-3">结算价引用</Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table
        size="small"
        border
        v-maxHeight
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
        show-sizer
        :current="pagination.currentPage"
        :total="pagination.totalCount"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></QcPage>
    </div>
    <!-- 批量编辑 -->
    <settlement-reference ref='settlementReference' :commonData='commonData'/>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
import settlementReference from "./settlement-reference";
import statementFileUpload from './statement-file-upload'
export default {
  components:{settlementReference, statementFileUpload},
  data() {
    return {
      commonData: {
        options: {},
        enums: {},
        accountStrategies: [],
        strategies: []
      },
      query: {
        statementDateRange: [],
        statementDateBegin: '',
        statementDateEnd: '',
        corporationId: '',
        tradeAccountId: ''
      },
      list: [],
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      isEditMore:false,
      selectList:[],
      LoadingExportState: false,
      columns: [
        {
          title: "结算单日期",
          key: "statementDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.statementDate));
          }
        },
        {
          title: "法人",
          key: "corporationName",
          align: "center",
          minWidth: 120
        },
         {
          title: "资金账户",
          key: "tradeAccountName",
          align: "center",
          minWidth: 120
        },
        {
          title: "账户号",
          key: "account",
          align: "center",
          minWidth: 120
        },
        {
          title: "账户类型",
          key: "accountType",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return <div> {utils.showText(this.commonData.accountType,params.row.accountType)}</div>;
          }
        },
        {
          title: "结算币种",
          key: "currencyName",
          align: "center",
          minWidth: 80
        },
        {
          title: "当日结存",
          key: "currentBalanceAmount",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.currentBalanceAmount}</format-cell>
          }
        },
        {
          title: "客户权益",
          key: "customerEquity",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.customerEquity}</format-cell>
          }
        },
        {
          title: "可用资金",
          key: "availableFunds",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.availableFunds}</format-cell>
          }
        },
        {
          title: "账户风险度",
          key: "accountRiskValue",
          align: "center",
          minWidth: 150,
          render: (h, params) => {

            return <div  style='text-align:right'> {params.row.accountRiskValue?utils.formatNum(params.row.accountRiskValue)+'%' :''} </div>;
          }
        },
        {
          title: "平仓盈亏",
          key: "closePnL",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.closePnL}</format-cell>
          }
        },
        {
          title: "浮动盈亏",
          key: "floatingPnL",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.floatingPnL}</format-cell>
          }
        },
        {
          title: "更新人",
          key: "lastManipulationName",
          align: "center",
          minWidth: 80,
        },
        {
          title: "更新时间",
          key: "lastManipulationTime",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "span",
              utils.formatDate(
                params.row.lastManipulationTime,
                "YYYY-MM-DD HH:mm:ss"
              )
            );
          }
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
                    content: "查看",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      size: "small",
                      icon: "md-eye"
                    },
                    style: {
                      marginRight: "3px",
                      display: this.isShow('H_SearchStatementRecord') ? "block" : "none"
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
                      display: this.isShow('H_DeleteStatementRecord') ? "block" : "none"
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
      ]
    };
  },
  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await api.getCommonData();
    this.search();
    // this.$router.push('/final-statement/info')
  },
  methods: {
    settlementReference() {
      this.$refs.settlementReference.show()
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      utils.saveQuery(this.query);
      this.query.statementDateBegin = this.utils.formatDate(this.query.statementDateRange[0])
      this.query.statementDateEnd = this.utils.formatDate(this.query.statementDateRange[1])
      let { dtos, pagination } = await api.list(this.query, this.pagination);
      this.pagination = pagination;
      this.list = dtos;
    },
    resetQuery() {
      this.query = {};
      this.query.pricingDateRange = []
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
        content: `您确认需要删除资金账户：${params.row.tradeAccountName}(${params.row.account}){${utils.formatDate(params.row.statementDate)}}的结算单数据吗？`,
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          await api.delete(params.row.acStatementRecordId);
          this.$Message.success(`删除成功!`);
          this.search();
        }
      });
    },
    onEdit(params) {
      this.$router.push('/final-statement/info/'+ params.row.acStatementRecordId)
    },
    imported() {
      this.search();
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>

<style>
.ivu-table .blue{
  color: blue
}
.ivu-table .orange{
  color: orange
}
</style>
