<template>
  <Modal v-model="isShow"  width="900px">
    <p slot="header">
      <Icon type="md-cloud-upload"></Icon>
      <span>标题</span>
    </p>
    <Form
      :label-width="100"
      label-position="right"
      id="ManageForm"
      style="margin:0 20px"
      :model="item"
      ref="ManageForm"
    >
      <Row type="flex" :gutter="4">
        <Col span="24" class-name="margin-bottom-10">
          <Row type="flex" :gutter="16">
            <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
              <FormItem :label="$t('唯一标识')" prop="accountingName" required>
                <Input type="text"  v-model="item.accountingName" :disabled='edit'/>
              </FormItem>
            </Col>
             <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
              <FormItem :label="$t('code')" prop="code" required>
                <Input type="text"  v-model="item.code"/>
              </FormItem>
            </Col>
             <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
            <FormItem :label="$t('名称')" prop="name" required>
                <Input type="text"  v-model="item.name"/>
              </FormItem>
            </Col>
             <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
              <FormItem :label="$t('简称')">
                <Input type="text"  v-model="item.shortName"/>
              </FormItem>
            </Col>
             <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
              <FormItem :label="$t('符号')" >
                <Input type="text"  v-model="item.symbol"/>
              </FormItem>
            </Col>
             <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
               <FormItem :label="$t('英文名称')" prop="englishName" required>
                <Input type="text"  v-model="item.englishName"/>
              </FormItem>
            </Col>
            <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
                <Row type="flex" :gutter="4">
                  <Col :span="22">
                  <FormItem :label="$t('内贸排序')" prop="domesticIndex" required>
                    <Input type="number"  v-model="item.domesticIndex"/>
                  </FormItem>
                  </Col>
                  <Col :span="2">
                   <Tooltip :content="$t('数值越小排序越靠前')" placement="top-end">
                      <Icon type="md-alert" style="color:red; font-size:16px;margin-top:8px"/>
                  </Tooltip>
                  </Col>
                </Row>
             </Col>
            <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
             <FormItem :label="$t('精度')" prop="scale" required>
                <Input type="number"  v-model="item.scale"/>
              </FormItem>
            </Col>
             <Col :lg="12" :md="12" :sm="12" :xs="12" class-name="margin-bottom-10">
                <Row type="flex" :gutter="4">
                  <Col :span="22">
                    <FormItem :label="$t('外贸排序')" prop="interIndex" required>
                      <Input type="number"  v-model="item.interIndex"/>
                    </FormItem>
                  </Col>
                  <Col :span="2">
                   <Tooltip :content="$t('数值越小排序越靠前')" placement="top-end">
                      <Icon type="md-alert" style="color:red; font-size:16px;margin-top:8px"/>
                  </Tooltip>
                  </Col>
                </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
     <p slot="footer">
        <Button @click="isShow=false">取消</Button>
        <Button type="primary" @click="save">保存</Button>
    </p>
  </Modal>
</template>

<script>
import api from './api'
export default {
  data() {
    return{
      isShow: false,
      editMore: false,
      edit: false,
      commonData: {},
      item: {
        isDeleted: false
      },
      itemRules: {}
    }
  },
  methods: {
    show(data) {
      if(data) {
        this.edit = true
        this.item = {...data}
      }else {
        this.item = {}
        this.$refs['ManageForm'].resetFields()
      }
      this.isShow = true
    },
    save() {
      this.$refs['ManageForm'].validate(valid => {
        if(valid) {
          if(this.edit) {
            api.update(this.item).then(() => {
              this.$Message.success(this.$t('修改成功'))
              this.isShow = false
              this.$emit('success')
            })
          }else {
            api.save(this.item).then(() => {
              this.$Message.success(this.$t('添加成功'))
              this.isShow = false
              this.$emit('success')
            })
          }
        }
      })
    }
  }
}
</script>