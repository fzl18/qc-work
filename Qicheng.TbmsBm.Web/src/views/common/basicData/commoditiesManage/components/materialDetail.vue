<template>
  <div>
    <Modal class="closePositionModal" v-model="isShowModal" title="物料详情" width="70%">
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
              <FormItem label="隶属品种">
                {{form.commodityId}}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card>
          <p slot="title">
            其他属性
          </p>
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
              <template slot-scope="{ row, index }" slot="priority">
                <Input type="text" v-model="row.priority" @input.native="priorityChange($event, index)"/>
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
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      isShowModal: false,
      form: {
        accountingName: '',
        name: '',
        englishName: '',
        commodityId: '',
        data: []
      },
      columns: [
        {
          title: '属性名称',
          key: 'wFQuantityTypeId'
        },
        {
          title: '属性值',
          key: 'priority'
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
    },
  }
}
</script>
