<template>
  <div class="app-container">
    <div class="search-header-row search-margin-bottom">
      <div class="full-width">
        <el-select filterable
                   clearable
                   title="选择推送内容后自动查询"
                   placeholder="请选择推送内容"
                   v-model="subscriptionType">
          <el-option
              v-for="item in subscriptionTypes"
              :key="item.value"
              :label="item.text"
              :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="full-width">
        <el-input
            clearable
            title="可以输入企业代码或者企业名称检索"
            v-model="fuzzyQueryStr"
            placeholder="输入关键字搜索"/>
      </div>
      <transition name="el-zoom-in-center">
        <div class="full-width" v-if="subscriptionType === subscribeTypeEnum['ContractFeed']">
          <el-date-picker
              align="center"
              v-model="dateOfPushData"
              title="选择推送的日期区间（开始日期、结束日期）"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </transition>
      <div>
        <el-button type="success"
                   icon="el-icon-position"
                   v-loading.fullscreen.lock="isPushing"
                   v-hasAuth="[$route,'multi-push']"
                   @click="batchPush">批量推送
        </el-button>
      </div>
    </div>

    <div>
      <el-table border fit highlight-current-row
                :data="listByFuzzyQuery"
                v-loading.body="listLoading"
                @selection-change="handleSelectionChange">
        <el-table-column align="center" label="选择需要推送的企业">
          <el-table-column type="selection" width="50" align="center">
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
          <el-table-column
              label="操作"
              width="80"
              align="center">
            <template slot-scope="scope">
              <el-button
                  type="text"
                  v-loading.fullscreen.lock="isPushing"
                  v-hasAuth="[$route,'pull']"
                  @click="pushSubscribedData(scope.row)">推送
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
  import { list, push } from '../../api/subscription'
  import { getEnum } from '../../api/enums'
  import {parseTime} from '../../utils'

  export default {
    name: 'SubscriptionDataPush',
    created () {
      this.fetchEnums()
    },
    watch: {
      'subscriptionType': 'fetchData'
    },
    computed: {
      listByFuzzyQuery () {
        return this.list.filter(item => {
          return item.appTenantCode.includes(this.fuzzyQueryStr) || item.displayName.includes(this.fuzzyQueryStr)
        })
      }
    },
    data () {
      return {
        subscribeTypeEnum: {
          StandardContract: 1,
          ContractFeed: 2
        },
        subscriptionType: '',
        fuzzyQueryStr: '',
        subscriptionTypes: [],
        listLoading: false,
        isPushing: false,
        list: [],
        selections: [],
        dateOfPushData: [ new Date(), new Date() ]
      }
    },
    methods: {
      async fetchEnums () {
        const { data } = await getEnum('subscriptionType')
        this.subscriptionTypes = data
      },

      async fetchData (subscriptionType) {
        if(subscriptionType){
          this.listLoading = true
          const { data } = await list({ subscriptionType }).finally(() => {
            this.listLoading = false
          })
          this.list = data
        }else{
          this.list = []
        }
        
      },

      handleSelectionChange (data) {
        this.selections = data
      },

      async batchPush () {
        const subscriptions = this.selections
        const [ startDate, endDate ] = this.dateOfPushData
        const subscriptionType = this.subscriptionType
        const dto = {
          subscriptionType,
          startDate: parseTime(startDate,'{y}-{m}-{d}'),
          endDate: parseTime(endDate,'{y}-{m}-{d}'),
          subscriptions
        }

        if (subscriptions.length === 0) {
          this.$message.info('请至少选择一条数据')
          return
        }
        if (subscriptionType === this.subscribeTypeEnum['ContractFeed'] && !(startDate && endDate)) {
          this.$message.info('请选择开始、结束日期')
          return
        }

        this.isPushing = true
        await push(dto).finally(() => {
          this.isPushing = false
        })
        this.$message.success('批量订阅推送成功')
      },

      async pushSubscribedData (row) {
        const subscriptions = [ row ]
        const [ startDate, endDate ] = this.dateOfPushData
        const subscriptionType = this.subscriptionType
        const dto = {
          subscriptionType,
          startDate: parseTime(startDate,'{y}-{m}-{d}'),
          endDate: parseTime(endDate,'{y}-{m}-{d}'),
          subscriptions
        }

        if (subscriptionType === this.subscribeTypeEnum['ContractFeed'] && !(startDate && endDate)) {
          this.$message.info('请选择开始、结束日期')
          return
        }
        this.isPushing = true
        await push(dto).finally(() => {
          this.isPushing = false
        })
        this.$message.success('订阅推送成功')
      }

    }
  }
</script>