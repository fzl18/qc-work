<template>
  <div>
    <Form
      :label-width="120"
      label-position="right"
      id="ManageForm"
      :model="item"
      :rules="itemRules"
      ref="ManageForm"
    >
      <Row type="flex" :gutter="4" align="middle">
        <Col span="24" class-name="margin-bottom-10">
          <Row type="flex" :gutter="16">
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="资金账户" prop="tradeAccountId" required>
                <Select placeholder filterable clearable v-model="item.tradeAccountId">
                  <Option
                    v-for="(item, index) in commonData.tradeAccounts"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <row>
                <Col span="21">
                  <FormItem label="权益类型" prop="equityTypeId" required>
                    <Select placeholder filterable clearable v-model="item.equityTypeId">
                      <Option
                              v-for="(item, index) in benefitsTypes"
                              :label="item.text"
                              :value="item.value"
                              :key="index"
                      >{{item.text}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="3">
                  <span @click="equityTypeConfig" class="configBtn">配置</span>
                </Col>
              </row>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="权益系数" prop="equityFatorType" required>
                <Select placeholder filterable clearable v-model="item.equityFatorType">
                  <Option
                    v-for="(item, index) in commonData.options.equityFatorType"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="是否累计" prop="isCumulative" required>
                <Select placeholder filterable clearable v-model="item.isCumulative">
                  <Option
                    v-for="(item, index) in isCumulativeList"
                    :label="item.text"
                    :value="item.value"
                    :key="index"
                  >{{item.text}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col :lg="8" :md="12" :sm="24" :xs="24" class-name="margin-bottom-10">
              <FormItem label="备注" prop="remark">
                <Input type="textarea" :rows="2" v-model="item.remark" />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Divider/>
        <Col span="24">
          <Row type="flex">
            <Button type="default" class="margin-right-3" @click="backToList">返回</Button>
            <Button type="primary"  @click="onSave">保存</Button>
          </Row>
        </Col>
      </Row>
    </Form>
    <Modal
            v-model="configModal"
            title="权益类型"
            @on-cancel="doCancel">
      <Form :label-width="80"
            :id="formName"
            :ref="formName"
            :model="model"
            :rules="modelRules">
        <Row type="flex" :gutter="4">
          <Col span="24" class-name="margin-bottom-10">
            <FormItem label="唯一标识" prop="code" required>
              <Input v-model="model.code" clearable :disabled="configEdit"/>
            </FormItem>
          </Col>
          <Col span="24" class-name="margin-bottom-10">
            <FormItem label="名称" prop="friendlyName" required>
              <Input v-model="model.friendlyName" clearable/>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="viewConfigList" type="text" v-show="!configEdit">查看</Button>
        <Button @click="doCancel">取消</Button>
        <Button type="success" size="large" @click="doConfig" :loading="configModalLoading">确定</Button>
      </div>
    </Modal>
    <Modal
            v-model="configModalList"
            title="权益类型">
      <Table
              size="small"
              border
              class="margin-bottom-10"
              :loading="configModalTableLoading"
              :columns="configModalColumns"
              :data="configList"
      ></Table>
    </Modal>
  </div>
</template>
<script>
import api from "./api";
import { utils } from "@/utils/utils";
export default {
  name: "Account-Equity-Allocation",
  props: ["id"],
  data() {
    return {
      commonData: {
        options: {},
        enums: {}
      },
      configModal: false,
      configEdit: false,
      configModalList: false,
      item: {
        id: '',
        isDeleted: '',
        remark: '',
        tradeAccountId: '',
        equityTypeId: '',
        equityFatorType: '',
        isCumulative: '',
        creationTime: '',
        lastManipulationTime: '',
        creatorId: '',
        lastManipulatorId: ''

      },
      isCumulativeList: [{ text: '累计', value: 'true' }, { text: '不累计', value: 'false' }],
      itemRules: {},
      modelRules: {},
      formName: 'configForm',
      model: {
        id: '',
        code: '',
        friendlyName: '',
        isDisabled: false,
        isBuiltIn: false,
      },
      benefitsTypes: [],
      defaulModel: {
        id: '',
        code: '',
        friendlyName: '',
        isDisabled: false,
        isBuiltIn: false,
      },
      configModalLoading: false,
      isEdit: !!this.id,
      configModalTableLoading: false,
      configModalColumns: [
        {
          title: "唯一标识",
          key: "code",
          align: "center"
        },
        {
          title: "名称",
          key: "friendlyName",
          align: "center"
        },
        {
          title: "启用/禁用",
          key: "isDisabled",
          align: "center",
          render: (h, param) =>
            h(
              "span",
              typeof param.row.isDisabled === "boolean"
                ? param.row.isDisabled
                ? "禁用"
                : "启用"
                : ""
            )
        },
        {
          title: "操作",
          align: "center",
          width: 100,
          fixed: "right",
          render: (h, param) => {
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
                      // display: this.isShow('H_UpdateAcOtherPaymentRecord') ? 'block' : 'none'
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
                "Tooltip",
                {
                  props: {
                    content: param.row.isDisabled ? "启用" : "禁用",
                    placement: "top",
                    transfer: true
                  }
                },
                [
                  h("Button", {
                    props: {
                      size: "small",
                      icon: param.row.isDisabled ? "ios-checkmark-circle-outline" : "ios-remove-circle-outline",
                    },
                    style: {
                      marginRight: "3px",
                      // display: this.isShow('H_DeleteAcOtherPaymentRecord') ? 'block' : 'none'
                    },
                    on: {
                      click: () => {
                        this.doDisable(param.row);
                      }
                    }
                  })
                ]
              )
            ]);
          }
        }
      ],
      configList: []
    };
  },
  async created() {
    await this.loadCommonData();
    if (this.isEdit) {
      let data = await api.getById(this.id);
      data.isCumulative += ''
      this.item = data;
    }
  },
  methods: {
    async loadCommonData () {
      let commonData = await api.getCommonData();
      this.commonData = commonData;
      this.benefitsTypes = _.filter(this.commonData.benefitsTypes, function (o) {
        return !o.isDisabled
      })
    },

    async onSave() {
      if (!(await this.validate())) {
        return;
      }
      let data = { ...this.item };
      await api.save(data);
      this.backToList();
    },

    validate() {
      return this.$refs["ManageForm"].validate(valid => valid);
    },

    equityTypeConfig () {
      this.configEdit = false
      this.configModal = true
    },

    viewConfigList () {
      this.configModalList = true
      this.doCancel()
      this.fetchConfigList()
    },

    async fetchConfigList () {
      this.configModalTableLoading = true
      this.configList = await api.getBenefitsTypeList().finally(() => {
        this.configModalTableLoading = false
      })
    },

    doCancel () {
      this.configModal = false;
      this.$refs[this.formName].resetFields();
      this.model = _.assign({}, this.defaulModel)
    },
    doConfig () {
      this.$refs[this.formName].validate(async valid => {
        if (valid) {
          this.configModalLoading = true;
          await api.saveBenefitsTypeConfig(this.model).finally(() => {
            this.configModalLoading = false;
          });
          this.configModal = false;
          this.model = _.assign({}, this.defaulModel)
          this.fetchConfigList()
          this.commonData = await api.getCommonData()
        }
      });
    },

    onEdit (row) {
      this.configEdit = true
      this.configModal = true
      this.model = _.assign({}, row)
    },

    doDisable(row) {
      this.$Modal.confirm({
        title: "权益类型",
        content: `确认${row.isDisabled?'启用':'禁用'}权益类型：${row.friendlyName}？`,
        loading: true,
        onOk: async () => {
          this.$Modal.remove();
          await api.toggleBenefitsTypeStatus(row.id)
          this.$Message.success(`${row.isDisabled?'启用':'禁用'}成功!`);
          this.fetchConfigList();
          this.commonData = await api.getCommonData();
        }
      });
    },
    backToList() {
      this.$router.push({
        name: "AccountEquityAllocationList"
      });
    },
    isShow(permission) {
      return utils.hasPermission(permission)
    }
  }
};
</script>

<style>
  .configBtn{
    color: blue;
    margin-left:3px;
    text-decoration: underline;
    cursor: pointer;
    line-height: 32px;
  }
</style>

