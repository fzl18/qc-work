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
              title="结算日期"
              v-model="query.settlementDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="法人" title="法人" filterable clearable v-model="query.corporationId">
            <Option v-for="(item, index) in commonData.corporations"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" title="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
                v-for="(item, index) in tradeAccounts"
                :label="item.text"
                :value="item.value"
                :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="权益类型" title="权益类型" filterable clearable v-model="query.equityTypeId">
            <Option
                v-for="(item, index) in commonData.allEquityTypes"
                :label="item.text"
                :value="item.value"
                :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="品类" title="品类" filterable clearable v-model="query.commodityTypeId">
            <Option v-for="(item, index) in commonData.commodityTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="业务类型" title="业务类型" filterable clearable v-model="query.businessTypeId">
            <Option
              v-for="(item, index) in commonData.businessType"
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
            placement="bottom-start"
            placeholder="发生日期"
            title="发生日期"
            v-model="query.happenedDateRange"
          ></DatePicker>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select
            placeholder="数据来源"
            title="数据来源"
            filterable
            clearable
            v-model="query.sourceType">
            <Option
              v-for="(item, index) in commonData.sourceType"
              :label="item.text"
              :value="item.value"
              :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
      </Row>
      </qc-collapse>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcStatementTaEquityRecord')">添加</Button>
          <file-upload
              tempName="结算单权益记录导入模板"
              action="ac-statement-ta-equity-records/preview"
              import="ac-statement-ta-equity-records/import"
              download="ac-statement-ta-equity-records/download-template"
              :columns="importColumns"
              @imported="imported"
              v-if="isShow('H_CreateAcStatementTaEquityRecord')"
          ></file-upload>
          <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState"
                  v-if="isShow('H_ExportAcStatementTaEquityRecord')">导出
          </Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="resetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
        </Col>
      </Row>
    </div>
    <Table
        size="small"
        border
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="columns"
        :data="list"
        v-maxHeight
    ></Table>
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
</template>
<script>
  import { utils } from '@/utils/utils';
  import api from './api';

  export default {
    data() {
      return {
        commonData: {
          options: {},
          enums: {},
          businessType: [],
          tradeAccounts: []
        },
        query: {
          settlementDateRange: [],
          happenedDateRange: [],
          settlementDateBegin: '',
          settlementDateEnd: '',
          happenedDateBegin: '',
          happenedDateEnd: '',
          equityTypeId: '',
          tradeAccountId: '',
          corporationId: '',
          commodityTypeId: '',
          businessTypeId: '',
          sourceType: ''
        },
        defaultQuery: {
          settlementDateRange: [],
          happenedDateRange: [],
          settlementDateBegin: '',
          settlementDateEnd: '',
          happenedDateBegin: '',
          happenedDateEnd: '',
          equityTypeId: '',
          tradeAccountId: '',
          corporationId: '',
          commodityTypeId: '',
          businessTypeId: '',
          sourceType: ''
        },
        list: [],
        tableLoading: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        LoadingExportState: false,
        columns: [
          {
            title: '结算日期',
            key: 'settlementDate',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.formatDate(param.row.settlementDate))
          },
          {
            title: '发生日期',
            key: 'happenedDate',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.formatDate(param.row.happenedDate))
          },
          {
            title: '资金账户',
            key: 'tradeAccountId',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.showText(this.commonData.tradeAccounts, param.row.tradeAccountId))
          },
          {
            title: '权益类型',
            key: 'equityTypeId',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.showText(this.commonData.allEquityTypes, param.row.equityTypeId))
          },
          {
            title: '品类',
            key: 'commodityTypeId',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.showText(this.commonData.commodityTypes, param.row.commodityTypeId))
          },
          {
            title: '交易所',
            key: 'exchageId',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.showText(this.commonData.allExchanges, param.row.exchageId))
          },
          {
            title: '业务类型',
            key: 'businessTypeId',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.showText(this.commonData.businessType, param.row.businessTypeId))
          },
          {
            title: '金额',
            key: 'amount',
            align: 'right',
            minWidth: 100,
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.amount
              }
            })
          },
          {
            title: '备注',
            key: 'remark',
            minWidth: 120,
            align: 'center'
          },          
          {
            title: '法人',
            key: 'corporation',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '币种',
            key: 'currency',
            align: 'center',
            minWidth: 100
          },
          {
            title: '数据来源',
            key: 'sourceType',
            minWidth: 100,
            align: 'center',
            render: (h, param) => {
              return h(
                'span',
                {
                  class: param.row.sourceType !== 1 ? 'orange' : 'blue'
                },
                utils.showText(
                  this.commonData.sourceType,
                  param.row.sourceType
                )
              );
            }
          },
          {
            title: '更新人',
            key: 'lastManipulatorId',
            align: 'center',
            minWidth: 100,
            render: (h, param) => h('span', utils.showText(this.commonData.users, param.row.lastManipulatorId))
          },
          {
            title: '更新时间',
            key: 'lastManipulationTime',
            align: 'center',
            minWidth: 125,
            render: (h, param) => h('span', utils.formatDate(param.row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (h, param) => {
              return h('div', [
                h(
                  'Tooltip',
                  {
                    props: {
                      content: '编辑',
                      placement: 'top',
                      transfer: true
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        size: 'small',
                        icon: 'md-create'
                      },
                      style: {
                        marginRight: '3px',
                        display: this.isShow('H_UpdateAcStatementTaEquityRecord') && param.row.sourceType === 2  ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onEdit(param.row);
                        }
                      }
                    })
                  ]
                ),
                h(
                  'Tooltip',
                  {
                    props: {
                      content: '删除',
                      placement: 'top',
                      transfer: true
                    }
                  },
                  [
                    h('Button', {
                      props: {
                        size: 'small',
                        icon: 'md-trash'
                      },
                      style: {
                        display: this.isShow('H_DeleteAcStatementTaEquityRecord') && param.row.sourceType === 2  ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onDelete(param.row);
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
            title: '结算日期',
            key: 'settlementDate',
            align: 'center',
            minWidth: 90,
            render: (h, param) => h('span', utils.formatDate(param.row.settlementDate))
          },
          {
            title: '发生日期',
            key: 'happenedDate',
            align: 'center',
            minWidth: 90,
            render: (h, param) => h('span', utils.formatDate(param.row.happenedDate))
          },
          {
            title: '资金账户',
            key: 'ptlTradeAccountText',
            minWidth: 90,
            align: 'center'
          },
          {
            title: '权益类型',
            key: 'ptlEquityTypeText',
            minWidth: 90,
            align: 'center'
          },
          {
            title: '品类',
            key: 'commodityTypeText',
            minWidth: 90,
            align: 'center'
          },
          {
            title: '交易所',
            key: 'exchangeText',
            minWidth: 90,
            align: 'center'
          },
          {
            title: '业务类型',
            key: 'businessTypeText',
            minWidth: 90,
            align: 'center'
          },
          {
            title: '金额',
            key: 'amount',
            align: 'right',
            minWidth: 90,
            render: (h, param) => h('format-cell', {
              props: {
                num: param.row.amount
              }
            })
          },
          {
            title: '备注',
            key: 'remark',
            minWidth: 120,
            align: 'center'
          },
        ]
      };
    },
    async created() {
      this.query = utils.saveQuery(this.query, 'get');
      this.commonData = await api.getCommonData();
    },
    mounted() {
      let query = this.$route.query
      if(Object.keys(query).length) {
        this.query.tradeAccountId = query.tradeAccountId * 1
        this.query.settlementDateRange[0] = query.reportDate
        this.query.settlementDateRange[1] = query.reportDate
      }
      this.search();
    },
    computed : {
      tradeAccounts () {
        return this.query.corporationId ? this.commonData.tradeAccounts.filter(o => o.corporationId === this.query.corporationId) : this.commonData.tradeAccounts
      }
    },
    methods: {
      onAdd() {
        this.$router.push({
          name: 'StatementEquityRecordCreate'
        });
      },

      onSearch() {
        this.pagination.currentPage = 1;
        this.search();
      },

      async search() {
        this.list = [];
        utils.saveQuery(this.query);
        this.manageDateRange();
        let query = { ...this.query, settlementDateRange: null, happenedDateRange: null };
        let { list, pagination } = await api.list(query, this.pagination);
        this.pagination = pagination;
        this.list = list;
      },

      manageDateRange() {
        this.query.settlementDateBegin = this.query.settlementDateRange[0];
        this.query.settlementDateEnd = this.query.settlementDateRange[1];
        this.query.happenedDateBegin = this.query.happenedDateRange[0];
        this.query.happenedDateEnd = this.query.happenedDateRange[1];
      },

      resetQuery() {
        this.query = _.assign({}, this.defaultQuery);
        this.query.settlementDateRange = [];
        this.query.happenedDateRange = [];
      },

      onPageChange(page) {
        this.pagination.currentPage = page;
        this.search();
      },

      onPageSizeChange(pageSize) {
        this.pagination.pageSize = pageSize;
        this.search();
      },

      onDelete(param) {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>确认删除资金账户下的权益数据？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove();
            await api.delete(param.id).then(res => {
              if (res && res.message) {
                this.$Message.error(res.message);
              } else {
                this.$Message.success('删除成功');
              }
              this.search();
            })
              .catch(() => {});
          }
        });
      },

      onEdit(param) {
        this.$router.push({
          name: 'StatementEquityRecordEdit',
          query: { id: param.id }
        });
      },

      imported() {
        this.search();
      },

      onExport() {
        this.manageDateRange();
        this.LoadingExportState = true;
        const query = Object.assign({}, this.query);
        query.settlementDateRange = utils.dateRangeToKebabCase(query.settlementDateRange);
        query.happenedDateRange = utils.dateRangeToKebabCase(query.happenedDateRange);
        api.exportExcel(
          query,
          `结算单权益记录${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },

      isShow(permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>
