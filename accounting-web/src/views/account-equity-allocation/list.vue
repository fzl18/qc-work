<template>
  <div>
    <div>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="资金账户" filterable clearable v-model="query.tradeAccountId">
            <Option
                    v-for="(item, index) in commonData.tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.value}} - {{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="权益类型" filterable clearable v-model="query.equityTypeId">
            <Option
                    v-for="(item, index) in benefitsTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="权益系数" filterable clearable v-model="query.equityFatorType">
            <Option
                    v-for="(item, index) in commonData.options.equityFatorType"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Select placeholder="是否累计" filterable clearable v-model="query.isCumulative">
            <Option
                    v-for="(item, index) in isCumulativeList"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
            >{{item.text}}
            </Option>
          </Select>
        </Col>
      </Row>
      <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button type="primary" icon="md-add" @click="onAdd" v-if="isShow('H_CreateAcTradeAccountEquityConfig')">添加</Button>
          <file-upload
                  tempName="账户权益配置导入模板"
                  action="AcAccountBenefitsConfig/Preview"
                  import="AcAccountBenefitsConfig/Import"
                  download="AcAccountBenefitsConfig/Download"
                  :columns="importColumns"
                  @imported="imported"
                  v-if="isShow('H_CreateAcTradeAccountEquityConfig')"
          ></file-upload>
           <Button type="info" icon="ios-cloud-download-outline" @click="onExport" :loading="LoadingExportState"
                  v-if="isShow('H_ExportAcTradeAccountEquityConfig')">导出
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
    data () {
      return {
        commonData: {
          options: {},
          enums: {}
        },
        isCumulativeList: [{ text: '累计', value: 'true' }, { text: '不累计', value: 'false' }],
        query: {
          equityTypeId: '',
          tradeAccountId: '',
          equityFatorType: '',
          isCumulative: ''
        },
        benefitsTypes: [],
        defaultQuery: {
          equityTypeId: '',
          tradeAccountId: '',
          equityFatorType: '',
          isCumulative: ''
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
            title: '资金账户',
            key: 'tradeAccountId',
            align: 'center',
            render: (h, param) => h(
              'span',
              utils.showText(
                this.commonData.tradeAccounts,
                param.row.tradeAccountId
              )
            )
          },
          {
            title: '权益类型',
            key: 'equityTypeId',
            align: 'center',
            render: (h, param) => h(
              'span',
              utils.showText(
                this.commonData.benefitsTypes,
                param.row.equityTypeId
              )
            )
          },
          {
            title: '权益系数',
            key: 'equityFatorType',
            align: 'center',
            render: (h, param) => h(
              'span',
              utils.showText(
                this.commonData.options.equityFatorType,
                param.row.equityFatorType
              )
            )
          },
          {
            title: '是否累计',
            key: 'isCumulative',
            align: 'center',
            render: (h, param) => h(
              'span',
              typeof param.row.isCumulative === 'boolean'
                ? param.row.isCumulative
                ? '累计'
                : '不累计'
                : ''
              // utils.showText(this.isCumulativeList, param.row.isCumulative)
            )
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center'
          },
          {
            title: '更新人',
            key: 'lastManipulatorId',
            align: 'center',
            fixed: 'right',
            width: 80,
            render: (h, param) => h(
              'span',
              utils.showText(
                this.commonData.userinfo,
                param.row.lastManipulatorId
              )
            )
          },
          {
            title: '更新时间',
            fixed: 'right',
            key: 'lastManipulationTime',
            align: 'center',
            width: 150,
            render: (h, param) => h(
              'span',
              utils.formatDate(
                param.row.lastManipulationTime,
                'YYYY-MM-DD HH:mm:ss'
              )
            )
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
                        icon: 'md-create',

                      },
                      style: {
                        marginRight: '3px',
                        display: this.isShow('H_UpdateAcTradeAccountEquityConfig') ? 'block' : 'none'
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
                        marginRight: '3px',
                        display: this.isShow('H_DeleteAcTradeAccountEquityConfig') ? 'block' : 'none'
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
            title: '资金账户',
            key: 'tradeAccountText',
            align: 'center'
          },
          {
            title: '权益类型',
            key: 'equityTypeText',
            align: 'center'
          },
          {
            title: '权益系数',
            key: 'equityFatorTypeText',
            align: 'center'
          },
          {
            title: '是否累计',
            key: 'isCumulativeText',
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            width: 150,
            align: 'center'
          }
        ]
      };
    },
    async created () {
      this.query = utils.saveQuery(this.query, 'get');
      this.commonData = await this.api.getCommonData('AcAccountBenefitsConfig');
      this.benefitsTypes = _.filter(this.commonData.benefitsTypes, function (o) {
        return !o.isDisabled;
      });
      this.search();
    },
    methods: {
      onAdd () {
        this.$router.push({
          name: 'AccountEquityAllocationCreate'
        });
      },
      onSearch () {
        this.pagination.currentPage = 1;
        this.search();
      },
      async search () {
        utils.saveQuery(this.query);
        let query = { ...this.query };
        let { list, pagination } = await api.list(query, this.pagination);
        this.pagination = pagination;
        this.list = list;
      },
      resetQuery () {
        this.query = _.assign({}, this.defaultQuery);
      },
      onPageChange (page) {
        this.pagination.currentPage = page;
        this.search();
      },
      onPageSizeChange (pageSize) {
        this.pagination.pageSize = pageSize;
        this.search();
      },
      onDelete (param) {
        this.$Modal.confirm({
          title: '删除',
          content: `<p>确认删除该条数据？</p>`,
          loading: true,
          onOk: async () => {
            this.$Modal.remove();
            await api.delete(param.id);
            this.$Message.success(`删除成功!`);
            this.search();
          }
        });
      },
      onEdit (param) {
        this.$router.push({
          name: 'AccountEquityAllocationEdit',
          query: { id: param.id }
        });
      },
      imported () {
        this.search();
      },
      onExport () {
        this.LoadingExportState = true;
        api.exportExcel(
          this.query,
          `账户权益配置${utils.formatDate(new Date(), 'YYYYMMDDHHmmss')}`
        ).then(() => {
          this.LoadingExportState = false;
        });
      },
      isShow (permission) {
        return utils.hasPermission(permission);
      }
    }
  };
</script>
