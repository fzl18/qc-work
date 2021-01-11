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
              placeholder="生效日期"
              v-model="query.effectiveDateRange"
            ></DatePicker>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="法人" filterable clearable v-model="query.corporationId">
              <Option
                v-for="(item, index) in commonData.corporations"
                :label="item.shortText"
                :value="item.value"
                :key="index"
              >{{item.value}} - {{item.shortText}}</Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
              <Option
                v-for="(item, index) in tradeAccountsComputed"
                :label="item.text"
                :value="item.value"
                :key="index"
              >{{item.value}} - {{item.text}}</Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="标准合约" filterable clearable v-model="query.instrumentCategoryId">
              <Option
                v-for="(item, index) in commonData.instrumentCategories"
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
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcMarginRate')">添加</Button>
          <file-upload
            tempName="外汇交易记录导入模板"
            action="AcMarginRateConfig/Preview"
            import="AcMarginRateConfig/Import"
            download="AcMarginRateConfig/Download"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_ImportAcMarginRate')"
          ></file-upload>
          <Button type="info" icon="ios-cloud-download-outline"  @click="onExport" :loading="LoadingExportState" v-if="isShow('H_ExportAcMarginRate')">导出</Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
          <!-- 保证金率配置-导出 H_ExportAcForexTradeRecord -->
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table
        size="small"
        border
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="columns"
        :data="list"
        @on-selection-change="tableSelectHandle"
        v-maxHeight
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
// import manage from "./manage"
export default {
  // components:{manage},
  data() {
    return {
      commonData: {
        options: {},
        enums: {},
        tradeAccounts: []
      },
      query: {
        effectiveDateRange: []
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
          title: "生效日期",
          key: "tradeDate",
          align: "center",
          width: 150,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.effectiveDate));
          }
        },
        {
          title: "资金账户",
          key: "tradeAccountId",
          align: "center",
          minWidth: 150,
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
          title: "标准合约",
          key: "instrumentCategoryQctKey",
          align: "center",
          minWidth: 120
        },
        {
          title: "具体合约",
          key: "instrumentCode",
          align: "center",
          minWidth: 140
        },
        {
          title: "保证金比率",
          key: "price",
          align: "center",
          width: 80,
          render: (h, params) => {
            return <format-cell fixed={false}>{params.row.marginRatioByMoney}</format-cell>
          }
        },
        {
          title: "每手保证金",
          key: "counterAmount",
          align: "center",
          width: 140,
          render: (h, params) =>
            <format-cell fixed={false}>{params.row.marginRatioByVolume}</format-cell>
        },
        {
          title: "法人",
          key: "corporationName",
          minWidth: 100,
          align: "center"
        },
        {
          title: "更新人",
          key: "lastManipulationBy",
          align: "center",
          width: 80,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.userinfo,
                params.row.lastManipulationBy
              )
            );
          }
        },
        {
          title: "更新时间",
          key: "lastManipulationTime",
          align: "center",
          width: 150,
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
                      display: this.isShow('H_UpdateAcMarginRate') ? 'block' : 'none'
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
                      display: this.isShow('H_DeleteAcMarginRate') ? 'block' : 'none'
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
          title: "生效日期",
          key: "effectiveDate",
          align: "center",
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.effectiveDate));
          }
        },
        {
          title: "资金账户",
          key: "tradeAccountName",
          align: "center",
          width: 150
        },
        {
          title: "标准合约",
          key: "instrumentCategoryQctKey",
          align: "center",
          width: 120
        },
        {
          title: "具体合约",
          key: "instrumentQctKey",
          align: "center",
          width: 140
        },
        {
          title: "保证金比率",
          key: "marginRatioByMoney",
          align: "center"
        },
        {
          title: "每手保证金",
          key: "marginRatioByVolume",
          align: "center",
          width: 140
        }
      ]
    };
  },
  computed: {
    tradeAccountsComputed: function() {
      if(this.query.corporationId) {
        return this.commonData.tradeAccounts.filter(d => d.corporationId === this.query.corporationId)
      } else {
        return []
      }
    }
  },
  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await this.api.getCommonData("AcMarginRateConfig");
    this.search();
  },
  methods: {
    onAdd() {
      this.$router.push({
        name: "AcMarginRateConfigurationCreate"
      });
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      utils.saveQuery(this.query);
      let query = { ...this.query };
      if (this.query.effectiveDateRange.length == 2) {
        query.effectiveDateStart = utils.formatDate(this.query.effectiveDateRange[0]);
        query.effectiveDateEnd = utils.formatDate(this.query.effectiveDateRange[1]);
        delete query.effectiveDateRange
      }
      let { list, pagination } = await api.list(query, this.pagination);
      this.pagination = pagination;
      this.list = list;
    },
    resetQuery() {
      this.query = {};
      this.query.effectiveDateRange = [];
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
          await api.delete(params.row.acMarginRateId);
          this.$Message.success(`删除成功!`);
          this.search();
        }
      });
    },
    onEdit(params) {
      this.$router.push({
        name: "AcMarginRateConfigurationCreate",
        query: { id: params.row.acMarginRateId }
      });
    },
    imported() {
      this.search();
    },
    onExport() {
      this.LoadingExportState = true
      if(this.query.effectiveDateRange.length > 1){
        this.query.effectiveDateStart = utils.formatDate(this.query.effectiveDateRange[0]);
        this.query.effectiveDateEnd = utils.formatDate(this.query.effectiveDateRange[1]);
      }
      this.query.effectiveDateRange = null
      api.exportExcel(
        this.query,
        `保证金率配置${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
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
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>
