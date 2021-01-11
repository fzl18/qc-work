<template>
  <el-container class="container">
    <el-main>
      <el-row :gutter="20" style="margin-bottom:50px;">
        <el-col :span="6">
          <el-select v-model="query.pushType" filterable clearable placeholder="请选择推送内容" class="item-select">
            <el-option
                v-for="item in subscriptionTypes"
                :key="item.value"
                :label="item.text"
                :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <div class="Tbar" v-if="query.pushType === 2">
        <h3>选择需要推送的日期区间</h3>
        <el-row :gutter="20">
          <el-col :span="20">
            <el-date-picker
                v-model="daterange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
          </el-col>
        </el-row>
      </div>

      <div class="Tbar">
        <h3>选择需要推送的企业</h3>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="query.code" placeholder="企业代码"></el-input>
          </el-col>
          <el-col :span="6">
            <el-input v-model="query.name" placeholder="企业名称"></el-input>
          </el-col>
          <el-col :span="6">
            <el-checkbox v-model="allChecked"
                         :disabled="showList.length === 0"
                         @change="selectAll">全选</el-checkbox>
          </el-col>
          <el-col :span="6" style="text-align:right">
            <el-button type="primary" :disabled="multipleSelection.length === 0"
                       :loading="isSaving"
                       @click="push">推送</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table ref="multipleTable" border fit highlight-current-row
                :data="showList"
                v-loading.body="listLoading"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="40" align="center">
        </el-table-column>
        <el-table-column label="企业代码" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.appTenantCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="企业名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.displayName }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
  import { list, push } from '../../api/subscription'
  import { getEnum } from '../../api/enums'

  export default {
    name: 'SubscriptionDataPush',
    created () {
      this.fetchEnums()
    },
    data () {
      return {
        allChecked: false,
        list: [],
        showList: [],
        listLoading: false,
        multipleSelection: [],
        daterange: [],
        query: {
          pushType: null,
          code: '',
          name: ''
        },
        isSaving: false,
        subscriptionTypes: []
      }
    },
    watch: {
      'query.pushType' (val) {
        if (!val) {
          this.showList = []
          return
        }
        if (val === 2) {
          this.daterange = [ new Date(), new Date() ]
        } else {
          this.daterange = []
        }
        this.fetchData(val)
      },
      'query.code': 'filterList',
      'query.name': 'filterList',
    },
    methods: {
      async fetchEnums () {
        const { data } = await getEnum('subscriptionType')
        this.subscriptionTypes = data
      },

      fetchData (val) {
        this.listLoading = true
        list({ subscriptionType: val })
          .then(result => {
            this.list = result.data || []
            this.showList = this.list
            this.listLoading = false
          })
          .catch(() => {
            this.listLoading = false
          })
      },

      selectAll (val) {
        if (val) {
          this.$refs.multipleTable.toggleAllSelection()
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
        this.allChecked = (this.showList.length > 0) && this.multipleSelection.length === this.showList.length
      },

      filterList () {
        let { list } = this
        let code = (this.query.code).trim(), name = (this.query.name).trim()

        this.allChecked = (this.showList.length > 0) && (this.multipleSelection.length === this.showList.length)
        if (code && name) {
          this.showList = list.filter((data) => {
            return ((data.appTenantCode).indexOf(code) !== -1) && (data.displayName.indexOf(name) !== -1)
          })
        } else if (code === '' && name) {
          this.showList = list.filter((data) => {
            return (data.displayName).indexOf(name) !== -1
          })
        } else if (code && name === '') {
          this.showList = list.filter((data) => {
            return (data.appTenantCode).indexOf(code) !== -1
          })
        } else {
          this.showList = list
        }
      },

      push () {
        let params = {
          SubscriptionType: this.query.pushType,
          Subscriptions: this.multipleSelection
        }

        if (this.query.pushType === 2 && this.daterange == null) {
          this.$message.error('请选择要推送的日期区间')
          return false
        }

        if (this.query.pushType !== 2) {
          this.daterange = null
          params.StartDate = null
          params.EndDate = null
        } else {
          params.StartDate = this.daterange[0]
          params.EndDate = this.daterange[1]
        }
        this.isSaving = true
        push(params)
          .then(() => {
            this.$message.success('推送成功')
            this.isSaving = false
          })
          .catch(() => {
            this.isSaving = false
          })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .container {
    margin-top: 20px;
  }

  .item-select {
    width: 100%;
  }

  .operation-btn {
    font-size: 18px;
  }

  .Tbar {
    line-height: 30px;
    margin-bottom: 50px;

    h3 {
      font-size: 16px;
      line-height: 20px;
      color: rgb(48, 65, 86);
      // border-left:4px solid rgb(48, 65, 86);
      position: relative;
      padding: 5px;

      &::after {
        content: '';
        width: 100%;
        height: 1px;
        background: rgb(48, 65, 86);
        position: absolute;
        bottom: 0px;
        left: 0
      }
    }
  }

</style>
