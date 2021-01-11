<template>
  <div>
    <qc-collapse>
      <Row type="flex" :gutter="16">
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input :placeholder="$t('唯一标识')" type="text" v-model="query.AccountingNameContains" />
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input :placeholder="$t('Code')" type="text" v-model="query.CodeContains" />
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
           <Input :placeholder="$t('名称')" type="text" v-model="query.NameContains" />
        </Col>

        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
          <Input :placeholder="$t('英文名称')" type="text" v-model="query.EnligshNameContains" />
        </Col>
        <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
           <Input :placeholder="$t('符号')" type="text" v-model="query.SymbolContains" />
        </Col>
      </Row>
     </qc-collapse>
     <Row type="flex" justify="space-between" :gutter="5">
        <Col class-name="margin-bottom-10">
          <Button
            type="primary"
            icon="md-add"
            @click="onAdd"
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
        border
        v-maxHeight
        isDisabledKey='isDeleted'
        class="margin-bottom-10"
        :loading="tableLoading"
        :columns="column"
        :data="list"
      ></Table>
      <QcPage
        size="small"
        show-total
        show-sizer
        :current="pagination.currentPage"
        :total="pagination.totalCount"
        :page-size="pagination.pageSize"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      ></QcPage>
      <add ref='add' @success='onSearch'/>
  </div>
</template>
<script>
import {column} from './column'
import add from './add'
import api from './api'
export default {
  components: {add},
  data() {
    return {
      query: {},
      commonData: {},
      tableLoading: false,
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      list: []
    }
  },
  computed: {
    column() {
      return column({}, this)
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    onAdd() {
      this.$refs.add.show()
    },
    onSearch() {
      api.list(this.query, this.pagination).then(res => {
        this.list = res.list
        this.pagination = res.pagination;
      })
    },
    setDisableStatus(row) {
      api.setDisableStatus({
        isDisable: !row.isDeleted,
        id: row.wfCurrencyId,
        notes: '11'
      }).then(() => {
        this.onSearch()
      })
    },
    resetQuery() {
      this.query = {}
    },
    onPageChange(page) {
      this.pagination.currentPage = page;
      this.onSearch();
    },
    onPageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.onSearch();
    },
  }
}
</script>