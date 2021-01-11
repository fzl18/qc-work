<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.fullName" :placeholder="$t('全称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.shortName" :placeholder="$t('简称')"/>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('是否启用期货')"
              filterable
              clearable
              v-model="query.IsETrading"
            >
              <Option
                v-for="(item, index) in enums.yONOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('是否启用')"
              filterable
              clearable
              v-model="query.disabled"
            >
              <Option
                v-for="(item, index) in enums.isDisabledOptions"
                :label="item.text"
                :value="item.value"
                :key="index"
                >{{ item.text }}</Option
              >
            </Select>
          </Col>
        </Row>
      </Form>
    </qc-collapse>
    <Row type="flex" justify="space-between" :gutter="5">
      <Col class-name="margin-bottom-10">
        <Button
          type="primary"
          icon="md-add"
          @click="onAdd"
          v-if="isShow('H_CreateAcOtherPaymentRecord')"
          >{{$t('添加')}}</Button
        >
      </Col>
      <Col class-name="margin-bottom-10">
        <Button
          icon="md-close-circle"
          @click="resetQuery"
          class="margin-right-3"
          >{{$t('清空')}}</Button
        >
        <Button type="primary" icon="md-search" @click="onSearch"
          >{{$t('搜索')}}</Button
        >
      </Col>
    </Row>
    <Table
      size="small"
      v-maxHeight
      border
      class="margin-bottom-10"
      :loading="false"
      :columns="listColumns"
      :data="listData"
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
    <Modal class="closePositionModal" v-model="isShowAddModal" :title="isEdit ? $t('修改') : $t('新增')" width="700">
      <Form :model="addForm" label-position="right" :label-width="120" ref="addForm">
        <Row>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="accountingName" required>
              <Input v-model="addForm.accountingName" :placeholder="$t('唯一标识')"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('全称')" prop="fullName" required>
              <Input v-model="addForm.fullName" :placeholder="$t('全称')"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('简称')" prop="shortName" required>
              <Input v-model="addForm.shortName" :placeholder="$t('简称')"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <Col span="20" class-name="margin-bottom-10">
              <FormItem :label="$t('类型')" prop="exchangeTypeId" required>
                <Select
                  :placeholder="$t('类型')"
                  filterable
                  clearable
                  transfer
                  v-model="addForm.exchangeTypeId"
                >
                  <Option
                    v-for="(item, index) in commonData.allExchangeTypes"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                    >{{ item.text }}</Option
                  >
                </Select>
              </FormItem>
            </Col>
            <Col span="4" class-name="margin-bottom-10">
              <Button type="primary" class="width100" @click="setExchangeType">{{$t('配置')}}</Button>
            </Col>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('是否启用期货')" prop="isETrading" required>
              <i-switch v-model="addForm.isETrading"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('是否允许开平')" prop="isAllowOpenClose" required>
              <i-switch v-model="addForm.isAllowOpenClose"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('是否允许今仓')" prop="isAllowToday" required>
              <i-switch v-model="addForm.isAllowToday"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('是否允许投/保')" prop="isAllowHedge" required>
              <i-switch v-model="addForm.isAllowHedge"/>
            </FormItem>
          </Col>
          <Col :sm="12" :xs="24" class-name="margin-bottom-10">
            <FormItem :label="$t('时区')" prop="timeZoneId">
              <Select
                :placeholder="$t('时区')"
                filterable
                clearable
                transfer
                v-model="addForm.timeZoneId"
              >
                <Option
                  v-for="(item, index) in commonData.allTimeZones"
                  :label="item.text"
                  :value="item.value"
                  :key="index"
                  >{{ item.text }}</Option
                >
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="isShowAddModal = !isShowAddModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="onSave">{{$t('保存')}}</Button>
      </div>
    </Modal>
    <Modal class="closePositionModal" v-model="isShowSetExchangeTypeModal" :title="$t('配置作价市场类型')" width="700">
      <Form :model="tableForm" ref="setExchangeTypeDataForm">
        <Table size="small" max-height="400" border class="margin-bottom-10" :loading="false" :columns="setExchangeTypeColumns" :data="tableForm.setExchangeTypeData">
        </Table>
      </Form>
      <div slot="footer">
        <Button @click="isShowSetExchangeTypeModal = !isShowSetExchangeTypeModal">{{$t('返回')}}</Button>
        <Button type="primary" @click="saveExchangeType">{{$t('保存')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import enums from '@/utils/enums'
import { listColumns } from './columns'
import api from './api';

export default {
  data() {
    return {
      isShowAddModal: false,
      isShowSetExchangeTypeModal: false,
      isEdit: false,
      query: {},
      enums,
      commonData: {
        allExchangeTypes: [],
        allTimeZones: [],
        CorporationTypeFlag: [],
      },
      LoadingExportState: false,
      listData: [{}],
      tableForm: {
        setExchangeTypeData: []
      },
      pagination: {
        currentPage: 1,
        pageSize: 15
      },
      red: '#ed4014',
      listColumns: listColumns(this),
      setExchangeTypeColumns: [{
        align: 'center',
        renderHeader: () => <span><span class="error">*</span>唯一标识</span>,
        render: (h, { row, index }) => {
          let that = this
          return  row.value ? <span>{row.code}</span> : h('FormItem', { props: {
            prop: 'setExchangeTypeData[' + index + '].code',
            required: true
          }
          },
          [
            h('Input', {
              props: {
                value: row.code,
                key: 'code' + index
              },
              on: {
                input (value) {
                  that.$set(that.tableForm.setExchangeTypeData[index], 'code', value)
                }
              }
            })
          ])
        }
      }, {
        align: 'center',
        renderHeader: () => <span><span class="error">*</span>名称</span>,
        render: (h, { row, index }) => {
          let that = this
          return h('FormItem', { props: {
            prop: 'setExchangeTypeData[' + index + '].text',
            required: true
          }
          },
          [
            h('Input', {
              props: {
                value: row.text,
                key: 'name' + index
              },
              on: {
                input (value) {
                  that.$set(that.tableForm.setExchangeTypeData[index], 'text', value)
                }
              }
            })
          ])
        }
      }, {
        align: 'center',
        renderHeader: (h) => {
          let that = this
          return h('Button', {
            props: {
              type: 'primary',
              icon: 'md-add',
              size: 'small'
            },
            on: {
              click() {
                that.tableForm.setExchangeTypeData.push({
                  code: ''
                })
              }
            }
          })
        },
        render: (h, { index, row }) => {
          let that = this
          return h('Button', {
            props: {
              type: 'warning',
              icon: 'md-close',
              size: 'small',
              key: 'button' + index
            },
            style: {
              margin: 'auto',
              display: 'block'
            },
            on: {
              click() {
                // that.tableForm.setExchangeTypeData[index] = {}
                // that.tableForm.setExchangeTypeData.splice(index, 1)
                api.deleteExchangeType({id: row.value})
              }
            }
          })
        }
      }],
      addForm: {
        accountingName: '',
        fullName: '',
        shortName: '',
        exchangeTypeId: '',
        isETrading: false,
        isAllowOpenClose: false,
        isAllowToday: false,
        isAllowHedge: false,
        timeZoneId: ''
      }
    };
  },
  created() {},
  async mounted() {
    this.query = utils.saveQuery(this.query, 'get');
    this.commonData = await api.getCommonData()
    this.tableForm.setExchangeTypeData = this.commonData.allExchangeTypes
    this.onSearch()
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    async search() {
      utils.saveQuery(this.query);
      let data = await api.list(this.query, this.pagination)
      this.listData = data.list
      this.pagination = data.pagination
    },
    onAdd() {
      this.isShowAddModal = true
      this.isEdit = false
      this.$refs['addForm'].resetFields()
    },
    onSave() {
      this.$refs['addForm'].validate(valid => {
        if(valid) {
          api.save(this.addForm).then(() => {

          })
        }
      })
    },
    saveExchangeType() {
      this.$refs['setExchangeTypeDataForm'].validate(valid => {
        if(valid) {
          api.saveExchangeType(this.tableForm.setExchangeTypeData).then(() => {

          })
        }
      })
    },
    onEdit() {
      this.isShowAddModal = true
      this.isEdit = true
      //请求数据填充
    },
    isShow(permission) {
      return utils.hasPermission(permission);
    },
    resetQuery() {
      this.query = {};
      this.query.accountingDate = '';
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    },
    setExchangeType() {
      this.isShowSetExchangeTypeModal = true
    }
  },
};
</script>

<style scoped lang='less'>
.width100 {
  width: 100%;
}
</style>
