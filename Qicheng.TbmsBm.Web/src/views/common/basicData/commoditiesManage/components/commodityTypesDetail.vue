<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowModal" title="品种详情" width="70%">
      <Form :model="form" label-position="right" :label-width="120" ref="form">
        <Card>
          <p slot="title">基本信息</p>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('唯一标识')">
                {{form.accountingName}}
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('code')">
                {{form.code}}
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('名称')">
                {{form.name}}
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('英文名称')">
                {{form.englishName}}
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem label="类型">
                {{form.englishName}}
              </FormItem>
            </Col>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('是否基本成分')" prop="fundamentalVarietyId">
                {{form.englishName}}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :lg="8" :sm="12" :xs="24" class-name="margin-bottom-10">
              <FormItem :label="$t('作价品类')" prop="pricingCommodityType">
                {{form.englishName}}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card>
          <p slot="title">重量单位</p>
          <Row>
            <Table
              size="small"
              border
              class="margin-bottom-10"
              :loading="false"
              :columns="columns"
              :data="form.data"
            >
              <template slot-scope="{ row, index }" slot="wFQuantityTypeId">
                <Select
                  placeholder
                  filterable
                  clearable
                  v-model="row.wFQuantityTypeId"
                  @on-change="wFQuantityTypeIdChange($event, index)"
                >
                  <Option
                    v-for="(item, index) in commonData.units"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{ item.text }}
                  </Option>
                </Select>
              </template>
              <template slot-scope="{ row, index }" slot="unitId">
                <Select
                  placeholder
                  filterable
                  clearable
                  v-model="row.unitId"
                  @on-change="unitIdChange($event, index)"
                >
                  <Option
                    v-for="(item, index) in commonData.units"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{ item.text }}
                  </Option>
                </Select>
              </template>
              <template slot-scope="{ row, index }" slot="scale">
                <!--<FormItem prop="scale" required label-width="0">
                </FormItem>-->
                <Input type="text" v-model="row.scale" @input.native="scaleChange($event, index)" placeholder="请输入0-8之间的整数"/>
              </template>
              <template slot-scope="{ row, index }" slot="priority">
                <Input type="text" v-model="row.priority" @input.native="priorityChange($event, index)"/>
              </template>
              <template slot-scope="{ row, index }" slot="isGroup">
                <Radio v-model="row.isGroup" @on-change="isGroupChange($event, index)"></Radio>
              </template>
            </Table>
          </Row>
        </Card>
      </Form>
      <div slot="footer">
        <Button @click="isShowModal = !isShowModal">{{$t('返回')}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import api from '../api'
import { utils } from '@/utils/utils'
export default {
  props: {
    commonData: {
      type: Object,
      default: () => {}
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isShowModal: false,
      columns: [
        {
          title: '量',
          slot: 'wFQuantityTypeId',
          minWidth: 100
        },
        {
          title: '量单位',
          slot: 'unitId',
          minWidth: 100
        },
        {
          title: '精度',
          slot: 'scale',
          minWidth: 100
        },
        {
          title: '优先级',
          slot: 'priority',
          minWidth: 100
        },
        {
          title: '是否集团单位',
          slot: 'isGroup',
          minWidth: 100
        }
      ]
    }
  },
  methods: {
    toggleShow () {
      this.isShowModal = !this.isShowModal
    },
    isShow (permission) {
      return utils.hasPermission(permission)
    }
  }
}
</script>
