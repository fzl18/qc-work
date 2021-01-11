<template>
  <div class="app-container">
    <el-row>
      <el-col :span="6">
        <el-select v-model="accountId" filterable clearable placeholder="账户" title="账户">
          <el-option
              v-for="(item, index) in accounts"
              :key="index"
              :label="item.text"
              :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-document-checked" :loading="isLoading"
                   v-hasAuth="[$route, 'list']"
                   @click="doReview">复核</el-button>
        <el-button type="warning" icon="el-icon-download" :disabled="disabledExport" :loading="isExporting"
                   v-hasAuth="[$route, 'export']"
                   @click="doExport">导出
        </el-button>
      </el-col>
      <el-col :span="12">
        <div class="data-summary">
          <i class="el-icon-bell color-danger"></i>系统数据
          <el-link type="primary" class="font-16" :underline="false">{{ isInstrumentCategoryTab ?
            summaryInfo.sysInstrumentCategoryCount : summaryInfo.sysInstrumentCount}}
          </el-link>
          条，期货数据
          <el-link type="warning" class="font-16" :underline="false">{{ isInstrumentCategoryTab ?
            summaryInfo.futureInstrumentCategoryCount : summaryInfo.futureInstrumentCount }}
          </el-link>
          条，差异
          <el-link type="danger" class="font-16" :underline="false">{{ isInstrumentCategoryTab ?
            summaryInfo.diffInstrumentCategoryCount: summaryInfo.diffInstrumentCount }}
          </el-link>
          条
        </div>
      </el-col>
    </el-row>

    <el-tabs v-model="currentTab">
      <el-tab-pane name="0" label="标准合约">
        <el-table :data="paginatedInstrumentCategoryReviews" v-loading.body="isLoading">
          <el-table-column label="系统" align="center">
            <el-table-column
                prop="sysInstrumentCategoryQctkey"
                align="center"
                label="标准合约">
            </el-table-column>
            <el-table-column
                prop="sysOriginContract"
                align="center"
                label="原始合约">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysOriginContract !== row.futureInstrumentCategoryQctkey }">
                  {{row.sysOriginContract}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysLotSize"
                align="center"
                label="交易单位量">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysLotSize !== row.futureLotSize }">
                  {{row.sysLotSize}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysTickSize"
                align="center"
                label="最小价格变动单位">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysTickSize !== row.futureTickSize }">
                  {{row.sysTickSize}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysFinancialInstrumentType"
                align="center"
                label="合约类型">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysFinancialInstrumentType !== row.futureFinancialInstrumentType }">
                  {{row.sysFinancialInstrumentType | mapKV(commonData.options.financialInstrumentType)}}
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="期货" align="center">
            <el-table-column
                prop="futureInstrumentCategoryQctkey"
                align="center"
                label="标准合约">
            </el-table-column>
            <el-table-column
                prop="futureLotSize"
                align="center"
                label="交易单位量">
            </el-table-column>
            <el-table-column
                prop="futureTickSize"
                align="center"
                label="最小价格变动单位">
            </el-table-column>
            <el-table-column
                prop="futureFinancialInstrumentType"
                align="center"
                label="合约类型">
              <template slot-scope="scope">
                <span>{{scope.row.futureFinancialInstrumentType | mapKV(commonData.options.financialInstrumentType)}}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleInstrumentCategorySizeChange"
            @current-change="handleInstrumentCategoryCurrentChange"
            :current-page="paginationOfInstrumentCategory.currentPage"
            :page-size="paginationOfInstrumentCategory.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="instrumentCategoryReviews.length">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane name="1" label="具体合约">
        <el-table :data="paginatedInstrumentReviews">
          <el-table-column label="系统" align="center">
            <el-table-column
                prop="sysQctKey"
                align="center"
                min-width="100"
                label="唯一标识">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysQctKey !== row.futureQctKey }">
                  {{row.sysQctKey}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysNumberOfLegs"
                align="center"
                label="合约腿数">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysNumberOfLegs !== row.futureNumberOfLegs }">
                  {{row.sysNumberOfLegs}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysRealStrikePrice"
                align="center"
                label="行权价">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysRealStrikePrice !== row.futureRealStrikePrice }">
                  {{ row.sysRealStrikePrice | currency }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysIsCallOption"
                align="center"
                label="是否认购期权">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysIsCallOption !== row.futureIsCallOption }">
                  {{row.sysIsCallOption | parseBool}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysFinancialInstrumentType"
                align="center"
                label="合约类型">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysFinancialInstrumentType !== row.futureFinancialInstrumentType }">
                  {{row.sysFinancialInstrumentType | mapKV(commonData.options.financialInstrumentType)}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysLastTradingDay"
                align="center"
                min-width="100"
                label="最后交易日期">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysLastTradingDay !== row.futureLastTradingDay }">
                  {{row.sysLastTradingDay | parseTime('{y}-{m}-{d}')}}
                </div>
              </template>
            </el-table-column>
            <el-table-column
                prop="sysyFirstTradingDate"
                align="center"
                min-width="100"
                label="开始交易日期">
              <template slot-scope="{row}">
                <div :class="{ 'is-diff': row.sysyFirstTradingDate !== row.futureyFirstTradingDate }">
                  {{row.sysyFirstTradingDate | parseTime('{y}-{m}-{d}')}}
                </div>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="期货" align="center">
            <el-table-column
                prop="futureQctKey"
                align="center"
                min-width="100"
                label="唯一标识">
            </el-table-column>
            <el-table-column
                prop="futureNumberOfLegs"
                align="center"
                label="合约腿数">
            </el-table-column>
            <el-table-column
                prop="futureRealStrikePrice"
                align="center"
                label="行权价">
              <template slot-scope="scope">
                <span>{{ scope.row.futureRealStrikePrice | currency }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="futureIsCallOption"
                align="center"
                label="是否认购期权">
              <template slot-scope="scope">
                <span>{{ scope.row.futureIsCallOption | parseBool }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="futureFinancialInstrumentType"
                align="center"
                label="合约类型">
              <template slot-scope="scope">
                <span>{{scope.row.futureFinancialInstrumentType | mapKV(commonData.options.financialInstrumentType)}}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="futureLastTradingDay"
                align="center"
                min-width="100"
                label="最后交易日期">
              <template slot-scope="scope">
                <span>{{ scope.row.futureLastTradingDay | parseTime('{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
            <el-table-column
                prop="futureyFirstTradingDate"
                align="center"
                min-width="100"
                label="开始交易日期">
              <template slot-scope="scope">
                <span>{{ scope.row.futureyFirstTradingDate | parseTime('{y}-{m}-{d}') }}</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleInstrumentSizeChange"
            @current-change="handleInstrumentCurrentChange"
            :current-page="paginationOfInstrument.currentPage"
            :page-size="paginationOfInstrument.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="instrumentReviews.length">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { review, getCommonData, exportList } from '../../api/contractReview';

  export default {
    name: 'ContractReview',
    async created() {
      await this.fetchEnums();
    },
    watch: {
      accountId: function (newVal) {
        if (newVal) {
          this.disabledExport = true;
        }
      }
    },
    computed: {
      isInstrumentCategoryTab() {
        return this.currentTab === '0';
      }
    },
    data() {
      return {
        currentTab: '0',
        accountId: '',
        instrumentCategoryReviews: [],
        paginationOfInstrumentCategory: {
          currentPage: 1,
          pageSize: 10
        },
        paginatedInstrumentCategoryReviews: [],
        instrumentReviews: [],
        paginationOfInstrument: {
          currentPage: 1,
          pageSize: 10
        },
        paginatedInstrumentReviews: [],
        commonData: {
          options: {},
          enums: {},
          accounts: []
        },
        summaryInfo: {
          sysInstrumentCategoryCount: null,
          futureInstrumentCategoryCount: null,
          diffInstrumentCategoryCount: null,
          sysInstrumentCount: null,
          futureInstrumentCount: null,
          diffInstrumentCount: null
        },
        accounts: [],
        isLoading: false,
        isExporting: false,
        disabledExport: true
      };
    },
    methods: {
      async fetchEnums() {
        this.commonData = (await getCommonData()).data;
        this.accounts = this.commonData.accounts;
      },

      async doReview() {
        if (!this.accountId) {
          this.$message.info('请选择账户');
          return;
        }
        this.isLoading = true;
        const { data } = await review(this.accountId).finally(() => {
          this.isLoading = false;
          this.disabledExport = true;
        });
        this.disabledExport = false;
        this.instrumentCategoryReviews = data.instrumentCategoryReviews;
        this.instrumentReviews = data.instrumentReviews;
        this.paginatedInstrumentCategoryReviews = [
          ...this.paginate(
            this.instrumentCategoryReviews,
            this.paginationOfInstrumentCategory.pageSize,
            this.paginationOfInstrumentCategory.currentPage
          )
        ];

        this.paginatedInstrumentReviews = [
          ...this.paginate(
            this.instrumentReviews,
            this.paginationOfInstrument.pageSize,
            this.paginationOfInstrument.currentPage
          )
        ];

        this.summaryInfo = data.contractNumber;
      },

      async doExport() {
        if (!this.accountId) {
          this.$message.info('请选择账户并复核');
          return;
        }
        this.isExporting = true;
        const { data } = await exportList(this.accountId).finally(() => {
          this.isExporting = false;
        });
        let a = document.createElement('a');
        let url = window.URL.createObjectURL(data);
        a.download = '合约数据复核.xlsx';
        a.href = url;
        a.click();
      },

      handleInstrumentCategorySizeChange(pageSize) {
        this.paginationOfInstrumentCategory.pageSize = pageSize;
        this.paginatedInstrumentCategoryReviews = [
          ...this.paginate(
            this.instrumentCategoryReviews,
            pageSize,
            this.paginationOfInstrumentCategory.currentPage
          )
        ];
      },

      handleInstrumentCategoryCurrentChange(currentPage) {
        this.paginationOfInstrumentCategory.currentPage = currentPage;
        this.paginatedInstrumentCategoryReviews = [
          ...this.paginate(
            this.instrumentCategoryReviews,
            this.paginationOfInstrumentCategory.pageSize,
            currentPage
          )
        ];
      },

      handleInstrumentSizeChange(pageSize) {
        this.paginationOfInstrument.pageSize = pageSize;
        this.paginatedInstrumentReviews = [
          ...this.paginate(
            this.instrumentReviews,
            pageSize,
            this.paginationOfInstrument.currentPage
          )
        ];
      },

      handleInstrumentCurrentChange(currentPage) {
        this.paginationOfInstrument.currentPage = currentPage;
        this.paginatedInstrumentReviews = [
          ...this.paginate(
            this.instrumentReviews,
            this.paginationOfInstrument.pageSize,
            currentPage
          )
        ];
      },

      paginate(arr, pageSize, pageNumber) {
        const start = pageSize * (pageNumber - 1);
        const end = pageSize * pageNumber;
        return {
          * [Symbol.iterator]() {
            for (let i = start; i < arr.length && i < end; i++) {
              yield arr[i];
            }
          }
        };
      }
    }
  };
</script>

<style scoped>
  .data-summary {
    text-align: right;
    height: 32px;
    line-height: 32px;
  }

  .font-16 {
    font-size: 16px;
  }

  .is-diff {
    height: 20px;
    border: 1px dashed #F56C6C;
  }
</style>