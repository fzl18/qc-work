<template>
  <div>
    <Form :model="form" label-position="right" :label-width="120" ref="form">
      <Card>
        <p slot="title">基本信息</p>
        <Row>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('品类')" prop="commodityTypeId">
              {{form.commodityTypeId}}
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('唯一标识')" prop="accountingName">
              {{form.accountingName}}
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('code')" prop="code">
              {{form.code}}
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('名称')" prop="name">
              {{form.name}}
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('英文名称')" prop="englishName">
              {{form.englishName}}
            </FormItem>
          </Col>
          <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
            <FormItem :label="$t('显示名')" prop="friendlyName">
              {{form.friendlyName}}
            </FormItem>
          </Col>
        </Row>
      </Card>
      <br>
      <Card>
        <p slot="title">配置信息</p>
        <template>
          <div>库存信息管理</div>
          <divider></divider>
          <Row>
            <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
              <FormItem :label="$t('库存管理模式')" prop="commodityTypeId">
                {{form.commodityTypeId}}
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
              <FormItem :label="$t('主量类型')" prop="accountingName">
                {{form.accountingName}}
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
              <FormItem :label="$t('货品类型')" prop="code">
                {{form.code}}
              </FormItem>
            </Col>
          </Row>
          <div>重量单位</div>
          <Table
            size="small"
            border
            class="margin-bottom-10"
            :loading="false"
            :columns="columns"
            :data="data"
          ></Table>
          <div>品种成分</div>
          <Table
            size="small"
            border
            class="margin-bottom-10"
            :loading="false"
            :columns="columns1"
            :data="data1"
          ></Table>
        </template>
        <template>
          <div>价格信息管理</div>
          <divider></divider>
          <Row>
            <Col :xs="24" :sm="12" :md="8" :lg="8" class-name="margin-bottom-10">
              <FormItem :label="$t('价格管理模式')" prop="commodityTypeId">
                {{form.commodityTypeId}}
              </FormItem>
            </Col>
          </Row>
          <Table
            size="small"
            border
            class="margin-bottom-10"
            :loading="false"
            :columns="columns2"
            :data="data2"
          ></Table>
        </template>
        <template>
          <div>结算信息管理</div>
          <divider></divider>
          <Row>
            <Col span="24" class-name="margin-bottom-10">
              <FormItem :label="$t('结算模式')" prop="commodityTypeId">
                {{form.commodityTypeId}}
              </FormItem>
            </Col>
            <Col span="24" class-name="margin-bottom-10">
              <FormItem :label="$t('条款类型')" prop="commodityTypeId">
                {{form.commodityTypeId}}
              </FormItem>
            </Col>
          </Row>
        </template>
      </Card>
    </Form>
    <br>
    <Row type="flex" justify="space-between" :gutter="5">
      <Col class-name="margin-bottom-10">
        <Button @click="backToList" class="margin-right-3">{{$t('返回')}}</Button>
      </Col>
    </Row>
  </div>
</template>
<script>
import api from './api'
export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      form: {
        accountingName: '',
        fullName: '',
        shortName: '',
        abbreviation: '',
        currencyId: '',
        taxCode: '',
        isDomestic: '',
        isETrading: false
      },
      commonData: {
        equityFatorTypes: [],
        subTypes: []
      },
      columns: [
        {
          title: '量',
          slot: 'wFQuantityTypeId',
          minWidth: 100
        },
        {
          title: '单位',
          slot: 'unitId',
          minWidth: 100
        },
        {
          title: '精度（小数位）',
          slot: 'scale',
          minWidth: 100
        },
        {
          title: '贸易类型',
          slot: 'unitId',
          minWidth: 100
        },
        {
          title: '优先级',
          slot: 'priority',
          minWidth: 100
        },
        {
          title: '默认单位',
          slot: 'isGroup',
          minWidth: 100
        },
        {
          title: '价格精度',
          key: 'scale',
          minWidth: 100
        },
      ],
      data: [],
      columns1: [
        {
          title: '基本成分',
          slot: 'wFQuantityTypeId',
          minWidth: 100
        },
        {
          title: '名称',
          slot: 'unitId',
          minWidth: 100
        },
        {
          title: '成分含量',
          minWidth: 100,
          render: (h, { row, index }) => {
            let that = this
            return h('Button', {
              props: {
                type: 'text',
                key: 'button' + index
              },
              style: {
                margin: 'auto',
                display: 'block'
              },
              on: {
                click() {
                  that.$refs['componentModal'].toggleShow()
                }
              }
            }, '成分含量')
          }
        },
        {
          title: '优先级',
          slot: 'priority',
          minWidth: 100
        }
      ],
      data1: [],
      columns2: [
        {
          title: '基本成分',
          key: 'wFQuantityTypeId',
          minWidth: 100
        },
        {
          title: '计价品类',
          key: 'unitId',
          minWidth: 100
        }
      ],
      data2: []
    }
  },
  async created () {
    // let commonData = await api.getCommonData('IntraydayRiskControl')
    // this.commonData = commonData
    // if (!!this.id) {
    //   this.form = await api.getById(this.id)
    // }
  },
  methods: {
    backToList() {
      this.$router.push({
        name: 'corporationList'
      })
    },
    async onSave () {
      let storageValid = await this.$refs['storageTabPane'].onValidate()
      let priceValid = await this.$refs['priceTabPane'].onValidate()
      let settleValid = await this.$refs['settleTabPane'].onValidate()
      this.$refs['form'].validate(async (valid) => {
        if (storageValid && priceValid && settleValid && valid) {
          let data = { ...this.form };
          await api.save(data);
          this.$Message.success(this.isEdit ? '修改成功' : '添加成功');
        }
      })
    }
  }
}
</script>
