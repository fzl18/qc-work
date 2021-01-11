<template>
  <el-container class="container">
    <el-header>
      <div class="search-header-row">
        <div>
          <el-select v-model="query.SectionId" filterable clearable placeholder="页面名称" class="item-select">
            <el-option
                v-for="item in enums.section"
                :key="item.value"
                :label="item.text"
                :value="item.name">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="query.OperationType" filterable clearable placeholder="操作类型" class="item-select">
            <el-option
                v-for="item in enums.operationType"
                :key="item.value"
                :label="item.text"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>          
          <el-date-picker
            v-model="query.rangeDate"
            type="daterange"
            range-separator="~"
            start-placeholder="操作开始时间"
            end-placeholder="结束时间">
          </el-date-picker>
        </div>
        <div>
          <el-select v-model="query.operatorId" filterable clearable placeholder="操作人员" class="item-select">
            <el-option
                v-for="item in commonData.data"
                :key="item.value"
                :label="item.text"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-button type="defalut" @click="queryClear">清空</el-button>
          <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column label="页面名称" align="center">
          <template slot-scope="scope">
            <span>{{ enumToName('section',scope.row.sectionId) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类名" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.className }}</span>
          </template>
        </el-table-column><el-table-column label="操作类型" align="center">
          <template slot-scope="scope">
            <span>{{ enumToName('operationType',scope.row.operationType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作对象" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.operatedTenantCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作内容" align="center">
          <template slot-scope="scope">
            {{scope.row.operatedContent}}
          </template>
        </el-table-column>
        <el-table-column label="操作时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.operateTime | parseTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作人员" align="center">
          <template slot-scope="scope">
            <span>{{ operator(scope.row.operatorId) }}</span>
          </template>
        </el-table-column>
      </el-table>

    </el-main>

    <el-footer>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pagination.currentPage"
          :page-size="query.pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="itemCount">
      </el-pagination>
    </el-footer>


  </el-container>
</template>

<script>
  import { list, commonData} from '../../api/systemLogs'
  import { getEnums } from '../../api/enums'
  import { parseTime } from '../../utils'

  export default {
    name: 'SystemConfigurations',
    data () {
      return {
        commonData:{},
        enums:{},
        list: [],
        listLoading: false,
        query: {
          rangeDate: [],
          OperationId: null,
          OperationType: null,
          SectionId: null,
          pagination: {
            currentPage: 1,
            pageSize: 10
          }
        },
        isLoading: false,
        itemCount: 0,
      }
    },
    async created () {
      await this.fetchEnums()
      this.commonData = await commonData()
      this.fetchData()
    },
    methods: {
      doSearch () {
        this.query.pagination.currentPage = 1
        this.fetchData()
      },
      queryClear () {
        this.query = {
          rangeDate: [],
          operationId: null,
          operationType: null,
          SectionId: null,
          pagination: this.query.pagination
        }
      },
      async fetchEnums () {
        const response = await getEnums()
        this.enums = response.data
      },

      fetchData () {
        this.listLoading = true
        if (this.query.rangeDate && this.query.rangeDate.length == 2) {
          this.query.StartDate = parseTime(this.query.rangeDate[0],'{y}-{m}-{d}') 
          this.query.EndDate = parseTime(this.query.rangeDate[1],'{y}-{m}-{d}') 
        }else{
          this.query.StartDate = null
          this.query.EndDate = null
        }
        list(this.query)
          .then(response => {
            this.listLoading = false
            this.list = response.data.list
            this.query.pagination.currentPage =
              response.data.pagination.currentPage
            this.query.pagination.pageSize = response.data.pagination.pageSize
            this.itemCount = response.data.pagination.itemCount
          })
          .catch(() => {
            this.listLoading = false
          })
      },

      handleSizeChange (val) {
        this.query.pagination.pageSize = val
        this.fetchData()
      },

      handleCurrentChange (val) {
        this.query.pagination.currentPage = val
        this.fetchData()
      },

      operator (val) {
        return this.commonData.data.filter((item) => val == item.value)[0].text
      },
      enumToName (name,val) {
        return this.enums[name].filter((item) => val == item.name)[0].text
      }
    }
  }
</script>

<style scoped>
  .container {
    margin-top: 20px;
  }

  .item-select {
    width: 100%;
  }

  .operation-btn {
    font-size: 18px;
  }
</style>
