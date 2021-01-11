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
            placeholder="作价日期"
            v-model="query.pricingDateRange"
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
          <Select placeholder="贸易类型" filterable clearable v-model="query.tradeType">
            <Option
              v-for="(item, index) in commonData.simpleTradeType"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
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
          <Select placeholder="品种" filterable clearable v-model="query.commodityId">
            <Option
              v-for="(item, index) in commonData.commodities"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="物料" filterable clearable v-model="query.materialId">
            <Option
              v-for="(item, index) in commonData.materials"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input placeholder="合同编号" type="text" v-model="query.contractCode" />
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
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="作价单位" filterable clearable v-model="query.unitId">
            <Option
              v-for="(item, index) in commonData.units"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="方向" filterable clearable v-model="query.isBuy">
            <Option
              v-for="(item, index) in [{text: '销售', value: 0},{text: '采购', value: 1}]"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="操作类型" filterable clearable v-model="query.tradePricingCategory">
            <Option
              v-for="(item, index) in commonData.tradePricingCategory"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="数据来源" filterable clearable v-model="query.sourceType">
            <Option
              v-for="(item, index) in commonData.tradePricingSourceType"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}</Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="作价市场" filterable clearable v-model="query.marketId">
            <Option
              v-for="(item, index) in commonData.exchanges"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <InstrumentSelect
            :allDate="true"
            :filterQuery="instrumentQuery"
            v-model="query.instrumentId"
          ></InstrumentSelect>
        </Col>
      </Row>
     </qc-collapse>

      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcSpotTradeRecord')">添加</Button>
          <file-upload
            tempName="现货交易记录导入模板"
            action="tradePricing/Preview"
            import="tradePricing/Import"
            download="tradePricing/Download"
            :columns="importColumns"
            @imported="imported"
            v-if="isShow('H_CreateAcSpotTradeRecord')"
          ></file-upload>
          <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState" v-if="isShow('H_ExportAcSpotTradeRecord')" class="margin-right-3">导出</Button>
          <template v-if="selectList.length">
            <!-- <Button type="warning" icon="md-create" class="margin-right-3" @click="editMore" v-if="isShow('H_SearchAcSpotTradeRecord')">批量编辑</Button> -->
            <Poptip
                confirm
                title="确认批量删除?"
                @on-ok="delMore">
                <Button type="error" icon="md-trash" class="margin-right-3" v-if="isShow('H_DeleteAcSpotTradeRecord')">批量删除</Button>
            </Poptip>
          </template>
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
        @on-selection-change="tableSelectHandle"
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
<!--    <Modal-->
<!--        v-model="isEditMore"-->
<!--        title="批量编辑"-->
<!--        @on-ok="editMoreOk"-->
<!--        @on-cancel="isEditMore = false"-->
<!--        width="70%"-->
<!--    >-->
<!--        <div>-->
<!--          <manage ref="manage" :editMore="true" />-->
<!--        </div>-->
<!--    </Modal>-->
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
// import manage from "./manage";
export default {
  // components:{manage},
  data() {
    return {
      commonData: {
        options: {},
        enums: {},
        accountStrategies: [],
        strategies: [],
        commodityTypes: []
      },
      query: {
        pricingDateRange: [],
        tradingStrategyId: '',
        marketId: ''
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
          type: 'selection',
          width: 60,
          fixed: "left",
          align: 'center',
        },
        {
          title: "作价日期",
          key: "pricingDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.pricingDate));
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
          title: "方向",
          key: "isBuy",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              typeof params.row.isBuy === "boolean"
                ? params.row.isBuy
                  ? "采购"
                  : "销售"
                : ""
            );
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
          title: "品种",
          key: "commodityId",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.commodities,
                params.row.commodityId
              )
            );
          }
        },
        {
          title: "物料",
          key: "materialId",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(this.commonData.materials, params.row.materialId)
            );
          }
        },
        {
          title: "作价重量",
          key: "pricingCargoQuantity",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return <format-cell fixed={4}>{params.row.pricingCargoQuantity}</format-cell>
          }
        },
        {
          title: "作价重量单位",
          key: "unitId",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(this.commonData.units, params.row.unitId)
            );
          }
        },
        {
          title: "作价币种",
          key: "currencyId",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(this.commonData.currencies, params.row.currencyId)
            );
          }
        },
        {
          title: "基价",
          key: "basePrice",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.basePrice}</format-cell>
          }
        },
        {
          title: "升贴水",
          key: "priceDiff",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return <format-cell>{params.row.priceDiff}</format-cell>
          }
        },
        {
          title: "作价方式",
          key: "tradePricingType",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.tradePricingType,
                params.row.tradePricingType
              )
            );
          }
        },
        {
          title: "贸易类型",
          key: "tradeType",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return h(
              "span",
              utils.showText(
                this.commonData.simpleTradeType,
                params.row.tradeType
              )
            );
          }
        },
        {
          title: "税率",
          key: "taxRate",
          align: "center",
          minWidth: 80,
          render: (h, params) => {
            return <format-cell>{params.row.taxRate}</format-cell>
          }
        },
        {
          title: "客户",
          key: "customer",
          align: "center",
          minWidth: 150
        },
        {
          title: "备注",
          key: "notes",
          align: "center",
          minWidth: 150,
        },
        {
          title: "作价市场",
          key: "exchangeText",
          align: "center",
          minWidth: 100,
        },
        {
          title: "具体合约",
          key: "instrumentText",
          align: "center",
          minWidth: 100,
        },
        {
          title: "结算价",
          key: "settlementPrice",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.settlementPrice}</format-cell>
          }
        },
        {
          title: "作价金额",
          key: "pricingAmount",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return <format-cell>{params.row.pricingAmount}</format-cell>
          }
        },
        {
          title: "合同编号",
          key: "contractCode",
          align: "center",
          minWidth: 150
        },

        {
          title: "操作类型",
          key: "tradePricingCategory",
          align: "center",
          minWidth: 150,
          render: (h, param) => h(
            'span',
            utils.showText(
              this.commonData.tradePricingCategory,
              param.row.tradePricingCategory
            )
          )
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
          title: "更新者",
          key: "creatorId",
          align: "center",
          minWidth: 80,
          render: (h, param) => h(
            'span',
            utils.showText(
              this.commonData.users,
              param.row.creatorId
            )
          )
        },
        {
          title: "更新时间",
          key: "lastManipulateTime",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "span",
              utils.formatDate(
                params.row.lastManipulateTime,
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
                        display: this.isShow('H_UpdateAcSpotTradeRecord') ? "block" : "none"
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
                        display: this.isShow('H_DeleteAcSpotTradeRecord') ? "block" : "none"
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
            }else{
              return null
            }
          }
        }
      ],
      importColumns: [
        {
          title: "作价日期",
          key: "pricingDate",
          align: "center",
          minWidth: 100,
          render: (h, params) => {
            return h("span", utils.formatDate(params.row.pricingDate));
          }
        },
        {
          title: "利润中心",
          key: "accountingEntityText",
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
          title: "法人",
          key: "corporationText",
          align: "center",
          minWidth: 120
        },
        {
          title: "方向",
          key: "isBuyText",
          align: "center",
          minWidth: 80
        },
        {
          title: "品类",
          key: "commodityType",
          align: "center",
          minWidth: 80
        },
        {
          title: "品种",
          key: "commodity",
          align: "center",
          minWidth: 80
        },
        {
          title: "物料",
          key: "materialText",
          align: "center",
          minWidth: 80
        },
        {
          title: "作价重量",
          key: "pricingCargoQuantity",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.pricingCargoQuantity < 0 ? "red" : ""
                }
              },
              utils.formatNum(params.row.pricingCargoQuantity)
            );
          }
        },
        {
          title: "作价重量单位",
          key: "unitText",
          align: "center",
          minWidth: 90
        },
        {
          title: "作价币种",
          key: "currencyText",
          align: "center",
          minWidth: 90
        },
        {
          title: "基价",
          key: "basePrice",
          align: "center",
          minWidth: 150,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.basePrice < 0 ? "red" : ""
                }
              },
              utils.formatNum(params.row.basePrice)
            );
          }
        },
        {
          title: "升贴水",
          key: "priceDiff",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.priceDiff < 0 ? "red" : ""
                }
              },
              utils.formatNum(params.row.priceDiff)
            );
          }
        },
        {
          title: "作价方式",
          key: "tradePricingTypeText",
          align: "center",
          minWidth: 90
        },
        {
          title: "贸易类型",
          key: "tradeTypeText",
          align: "center",
          minWidth: 80
        },
        {
          title: "税率",
          key: "taxRate",
          align: "center",
          minWidth: 90,
          render: (h, params) => {
            return h(
              "span",
              {
                style: {
                  color: params.row.taxRate < 0 ? "red" : ""
                }
              },
              utils.formatNum(params.row.taxRate)
            );
          }
        },
        {
          title: "客户",
          key: "customer",
          align: "center",
          minWidth: 150
        },
        {
          title: "备注",
          key: "notes",
          align: "center",
          minWidth: 150,
        },
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
    },

    instrumentQuery () {
      const exchangeText = utils.showText(this.commonData.exchanges, this.query.marketId);
      const commodityTypeObj = this.commonData.commodityTypes.find(val => val.value === this.query.commodityTypeId);
      const commodityTypeText = commodityTypeObj ? commodityTypeObj.text : '';
      return [{
        key: 'marketId',
        text: '交易所',
        id: this.query.marketId,
        code: `${this.query.marketId ? exchangeText : ''}`,
        required: false
      }, {
        key: 'commodityTypeId',
        text: '品类',
        id: this.query.commodityTypeId,
        code: `${this.query.commodityTypeId ? commodityTypeText : ''}`,
        required: false
      }];
    },
  },
  async created() {
    this.query = utils.saveQuery(this.query, 'get');
    let commonData = this.$store.state.cachedCommonData['tradepricing_getcommondata'];
    if(!commonData) {
      commonData = await this.api.getCommonData("TradePricing");
    }
    let accountStrategies = [];
    _.forEach(commonData.accountStrategies, o => {
      accountStrategies.push(...o.tradingStrategies);
    });
    commonData.strategies = _.sortBy(_.uniqBy(accountStrategies, 'tradingStrategyId'), o => o.tradingStrategyId);
    this.commonData = commonData;
  },
  mounted() {
    if(this.$route.params.row) {
      let params = this.$route.params.row
      this.query.accountingEntityId = params.accountingEntityId
      this.query.tradingStrategyId = params.tradingStrategyId
      this.query.corporationId = params.corporationId
      this.query.contractCode = params.contractCode
      this.query.commodityTypeId = params.commodityTypeId
      this.query.isBuy = params.isBuy + ''
      this.query.tradePricingCategory = 1 //常规
    }
    this.search();
  },
  methods: {
    onAdd() {
      this.$router.push({
        name: "SpotTradeRecordCreate"
      });
    },
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      this.selectList = []
      utils.saveQuery(this.query);
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
      query.isUnpriced = false;
      if (this.query.pricingDateRange.length) {
        query.pricingDateBegin = this.query.pricingDateRange[0];
        query.pricingDateEnd = this.query.pricingDateRange[1];
      }
      delete query.pricingDateRange
      let { list, pagination } = await api.list(query, this.pagination);
      this.pagination = pagination;
      let newList = list.map(val=> { return  {...val,_disabled: val.sourceType ==1 ? true : false}})
      this.list = newList;
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
        content: `<p>确认删除该条数据？</p>`,
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          await api.delete(params.row.wfTradePricingId);
          this.$Message.success(`删除成功!`);
          this.search();
        }
      });
    },
    onEdit(params) {
      this.$router.push({
        name: "SpotTradeRecordEdit",
        query: { id: params.row.wfTradePricingId }
      });
    },
    imported() {
      this.search();
    },
    tableSelectHandle(selection) {
      this.selectList = selection.map( val => val.wfTradePricingId)
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
          totalAmount: null,
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
    onExport() {
       this.LoadingExportState = true
      let query = { ...this.query };
      if (query.pricingDateRange.length) {
        query.pricingDateBegin = query.pricingDateRange[0];
        query.pricingDateEnd = query.pricingDateRange[1];
      }
      delete query.pricingDateRange
      query.isUnpriced = false;
       api.exportExcel(
          query,
        `现货交易记录${utils.formatDate(new Date(), "YYYYMMDDHHmmss")}`
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

<style>
.ivu-table .blue{
  color: blue
}
.ivu-table .orange{
  color: orange
}
</style>
