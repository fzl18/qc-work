<template>
  <div>
    <div>
      <qc-collapse>
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <DatePicker type="daterange"
                        placement="bottom-start"
                        placeholder="生效日期"
                        v-model="query.accountingDateRange"
            />
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="交易所" filterable clearable v-model="query.exchangeId">
              <Option v-for="(item, index) in commonData.exchanges"
                      :label="item.text"
                      :value="item.value"
                      :key="index"
              >{{item.value}} - {{item.text}}
              </Option>
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select placeholder="标准合约" filterable clearable v-model="query.instrumentCategoryId">
              <Option v-for="(item, index) in instrumentCategories"
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
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcInterSpreadMarginRate')">添加</Button>
          <file-upload
              tempName="导入模板"
              action="AcInterSpreadMarginRate/Preview"
              import="AcInterSpreadMarginRate/Import"
              download="AcInterSpreadMarginRate/DownLoadTemple"
              :columns="importColumns"
              @imported="search"
              v-if="isShow('H_ImportAcInterSpreadMarginRate')"
          />
           <Button type="info" icon="ios-cloud-download-outline"
                  v-if="isShow('H_ExportAcInterSpreadMarginRate')"
                  :loading="isExporting"
                  class="margin-right-3"
                  @click="onExport">导出
          </Button>
          <Button type="error" v-if="isShow('H_DeleteAcInterSpreadMarginRate')" @click="doBatchDelete">批量删除</Button>
        </Col>
        <Col class-name="margin-bottom-10">
          <Button icon="md-close-circle" @click="doResetQuery" class="margin-right-3">清空</Button>
          <Button type="primary" icon="md-search" @click="onSearch" class="margin-right-3">搜索</Button>
        </Col>
      </Row>
    </div>
    <div class="plan-list">
      <Table size="small"
             border
             class="margin-bottom-10"
             :loading="isLoading"
             :columns="columns"
             :data="list"
             @on-selection-change="onSelectionChange"
             v-maxHeight
      />
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
      />
    </div>
  </div>
</template>

<script>
  import { uniqWith, isEqual } from 'lodash';
  import { utils } from '@/utils/utils';
  import api from './api';

  export default {
    name: 'AcInterSpreadMarginRateList',
    async created() {
      this.query = utils.saveQuery(this.query, 'get');
      await this.getCommonData();
      this.search();
    },
    data() {
      return {
        isLoading: false,
        isExporting: false,
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: 15
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '生效日期',
            key: 'accountingDate',
            minWidth: 100,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.accountingDate))
          },
          {
            title: '标准合约',
            key: 'instrumentCategoryText',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '期间编号A',
            key: 'tierA',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '期间编号B',
            key: 'tierB',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '每手保证金',
            key: 'marginPerLot',
            minWidth: 120,
            align: 'right',
            render: (h, param) => <format-cell>{param.row.marginPerLot}</format-cell>
          },
          {
            title: '交易所',
            key: 'exchangeText',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '更新人',
            key: 'lastManipulatorName',
            minWidth: 120,
            align: 'center',
          },
          {
            title: '更新时间',
            key: 'lastManipulationTime',
            minWidth: 120,
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.lastManipulationTime,"YYYY-MM-DD HH:mm:ss"))
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            fixed: 'right',
            render: (h, params) => {
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
                        display: this.isShow('H_UpdateAcInterSpreadMarginRate') ? 'block' : 'none'
                      },
                      on: {
                        click: () => {
                          this.onEdit(params);
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
            title: '生效日期',
            key: 'accountingDate',
            align: 'center',
            render: (h, param) => h('span', utils.formatDate(param.row.accountingDate))
          },
          {
            title: '标准合约',
            key: 'instrumentCategoryText',
            align: 'center',
          },
          {
            title: '期间编号A',
            key: 'tierA',
            align: 'center',
          },
          {
            title: '期间编号B',
            key: 'tierB',
            align: 'center',
          },
          {
            title: '每手保证金',
            key: 'marginPerLot',
            align: 'right',
            // render: (h, param) => h('span', utils.formatAmount(param.row.marginPerLot))
          }
        ],
        list: [],
        query: {
          accountingDateRange: [],
          exchangeId: '',
          instrumentCategoryId: ''
        },
        defaultQuery: {
          accountingDateRange: [],
          exchangeId: '',
          instrumentCategoryId: ''
        },
        commonData: {
          instrumentCategories: []
        },
        selections: []
      };
    },
    computed: {
      instrumentCategories () {
        return this.query.exchangeId ? this.commonData.instrumentCategories.filter(val => val.marketId === this.query.exchangeId) : []
      }
    },
    methods: {
      onSearch() {
        this.pagination.currentPage = 1;
        this.search();
      },

      async search() {
        utils.saveQuery(this.query);
        const query = Object.assign({}, this.query);
        query.accountingDateRange = this.dateRangeToKebabCase(query.accountingDateRange);
        this.isLoading = true;
        let { list, pagination } = await api.list(query, this.pagination).finally(() => {
          this.isLoading = false;
        });
        this.pagination = pagination;
        this.list = list;
      },

      // output: '2020.02 - 2020.03'
      dateRangeToKebabCase(source) {
        if (source.length === 0) {
          return '';
        }
        const [ start, end ] = source.map(t => utils.formatDate(t));
        return (start && end) ? `${start} - ${end}` : '';
      },

      async getCommonData() {
        this.commonData = await api.getCommonData('AcInterSpreadMarginRate');
      },

      onAdd() {
        this.$router.push({
          name: 'AcInterSpreadMarginRateCreate'
        });
      },

      async doBatchDelete() {
        let pickedSelections = this.selections.map(({ accountingDate, instrumentCategoryText}) => {
          return {
            accountingDate,
            instrumentCategoryText
          }
        });
        let uniqSelections = uniqWith(pickedSelections, isEqual);
        let warningMsg = uniqSelections.map(t => `${utils.formatDate(t.accountingDate)}, ${t.instrumentCategoryText}`).join('<br/>');
        this.$Modal.confirm({
          title: '批量删除',
          content: `<p>将删除以下跨期保证金,确认继续？<br/><pre>${warningMsg}</pre></p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove();
            const ids = this.selections.map(t => t.id);
            await api.batchDelete(ids);
            this.search();
          }
        });
      },

      async onExport() {
        await api.exportExcel(this.query).finally(() => {
          this.isExporting = false;
        });
      },

      doResetQuery() {
        this.query = Object.assign({}, this.defaultQuery);
      },

      onEdit(params) {
        this.$router.push({
          name: 'AcInterSpreadMarginRateEdit',
          query: {
            exchangeId: params.row.exchangeId,
            instrumentCategoryId: params.row.instrumentCategoryId,
            accountingDate: params.row.accountingDate,
          }
        });
      },

      onPageChange(currentPage) {
        this.pagination.currentPage = currentPage;
        this.search();
      },

      onPageSizeChange(pageSize) {
        this.pagination.pageSize = pageSize;
        this.search();
      },

      isShow(permission) {
        return utils.hasPermission(permission);
      },

      onSelectionChange(selections) {
        this.selections = selections;
      }
    }
  };
</script>
