<template>
  <div>
    <qc-collapse>
      <Form :model="query" label-position="right" ref="queryForm">
        <Row type="flex" :gutter="16">
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.loginNameContains" :placeholder="$t('用户名')" />
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Input v-model="query.nameContains" :placeholder="$t('姓名')" />
          </Col>
          <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
            <Select
              :placeholder="$t('岗位')"
              filterable
              clearable
              v-model="query.RoleId"
            >
              <Option
                v-for="(item, index) in commonData.roles"
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
              v-model="query.isDisabled"
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
          >{{ $t("添加") }}</Button
        >
      </Col>
      <Col class-name="margin-bottom-10">
        <Button
          icon="md-close-circle"
          @click="resetQuery"
          class="margin-right-3"
          >{{ $t("清空") }}</Button
        >
        <Button type="primary" icon="md-search" @click="onSearch">{{
          $t("搜索")
        }}</Button>
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
    <Edit ref="edit" :commonData="commonData" />
    <Detail ref="detail" :commonData="commonData" />
    <SetPassword ref="setPassword" />
  </div>
</template>

<script>
import { utils } from "@/utils/utils";
import enums from "@/utils/enums";
import api from "./api";
import Edit from "./edit"
import SetPassword from "./setPassword"
import {listColumns} from "./columns"
import Detail from './detail.vue';
export default {
  components: {
    Edit,
    SetPassword,
    Detail
  },
  data() {
    return {
      query: {
        nameContains: "",
        loginNameContains: "",
        IsDisabled: "",
        RoleId: "",
      },
      enums,
      commonData: {
        roles: [],
        UserStatus: [],
        NotifyingAgentType: [],
        BindingType: [],
        ActivateStatus: []
      },
      listData: [{}],
      pagination: {
        currentPage:1,
        pageSize:15
      },
      listColumns: listColumns(this)
    };
  },
  created() {},
  mounted() {
    api.getCommonData().then(res=>{
      this.commonData = res
    })
    this.query = utils.saveQuery(this.query, "get");
    this.onSearch();
  },
  methods: {
    onSearch() {
      this.pagination.currentPage = 1;
      this.search();
    },
    search() {
      utils.saveQuery(this.query, this.pagination);
      api.list(this.query, this.pagination).then((res) => {
        this.listData = res.list;
        this.pagination = res.pagination
      });
    },

    isShow(permission) {
      return utils.hasPermission(permission);
    },
    resetQuery() {
      this.query = {};
      this.query.accountingDate = "";
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.search();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.search();
    },
    onAdd() {
      this.$refs['edit'].onAdd()
    },
    onDetail(data) {
      this.$refs.detail.onShow(data)
    },
    setDisableStatus(data) {
      api.setDisableStatus({
        isDisable: !data.isDisabled,
        id: data.wfUserId,
        note: "string"
      }).then(res=>{
        this.onSearch()
      })
    }
  },
};
</script>

<style scoped lang='less'>
.icoBtn {
  margin-top: 5px;
  color: #2d8cf0;
  cursor: pointer;
}
</style>
