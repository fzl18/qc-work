<template>
  <div class="app-container">
    <div class="search-header-row search-margin-bottom">
      <div>
        <el-input placeholder="账户名"
                  title="账户名"
                  v-model="query.accountName"
                  clearable>
        </el-input>
      </div>
      <div style="margin-left: 10px;">
        <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        <el-button type="success" icon="el-icon-plus" v-hasAuth="[$route,'create']" @click="doAdd">新增</el-button>
        <el-button icon="el-icon-error" title="清空" @click="doReset">清空</el-button>
      </div>
    </div>

    <div class="search-margin-bottom">
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row>
        <el-table-column label="账户名" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.username}}</span>
          </template>
        </el-table-column>
        <el-table-column label="AuthCode" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.authCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="AppId" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.appId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="BrokerId" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.brokerId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="通道类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.dispatcherAdapterType | mapKV(dispatcherAdapterTypeList)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易地址" align="center" min-width="140">
          <template slot-scope="scope">
            <div v-for="(item, index) in doSplit(scope.row.tradeAddresses)" :key="index">
              {{item}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="行情地址" align="center" min-width="140">
          <template slot-scope="scope">
            <div v-for="(item, index) in doSplit(scope.row.quoteAddresses)" :key="index">
              {{item}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="复核对象" align="center" min-width="120">
          <template slot-scope="scope">
            <div v-for="(item, index) in doSplit(scope.row.reviewObject)" :key="index">
              {{item}}
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="120">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="text" icon="el-icon-edit"
                         class="operation-btn"
                         v-hasAuth="[$route, 'update']"
                         @click="doEdit(scope.row)"/>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button type="text" icon="el-icon-delete"
                         class="operation-btn operation-disable-btn" 
                         v-hasAuth="[$route, 'delete']"
                         @click="doDelete(scope.row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

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

    <!-- dialog -->
    <div>
      <el-dialog
          :title="dialogTitle[dialogStatus]"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="60%">
        <div>
          <el-form label-position="right"
                   label-width="140px"
                   status-icon
                   :ref="formName"
                   :rules="rules"
                   :model="model">
            <el-row>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="账户名" prop="username">
                  <el-input v-model="model.username" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="密码" prop="passwordEncrypted">
                  <el-input v-model="model.passwordEncrypted" show-password clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="AuthCode" prop="authCode">
                  <el-input v-model="model.authCode" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="AppId" prop="appId">
                  <el-input v-model="model.appId" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="BrokerId" prop="brokerId">
                  <el-input v-model="model.brokerId" clearable placeholder=""/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="通道类型" prop="dispatcherAdapterType" class="full-width">
                  <el-select v-model="model.dispatcherAdapterType" filterable clearable placeholder="">
                    <el-option
                        v-for="item in dispatcherAdapterTypeList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                        :disabled="item.value !== 3">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="交易地址" :autosize="{ minRows: 1, maxRows: 4 }" prop="tradeAddresses">
                  <el-input type="textarea" v-model="model.tradeAddresses" clearable/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
                <el-form-item label="行情地址" :autosize="{ minRows: 1, maxRows: 4 }" prop="quoteAddresses">
                  <el-input type="textarea" v-model="model.quoteAddresses" clearable/>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="复核对象" prop="reviewObjects" class="full-width">
                  <el-select v-model="model.reviewObjects" multiple filterable clearable placeholder="">
                    <el-option
                        v-for="(item, index) in exchanges"
                        :key="index"
                        :label="item.fullName"
                        :value="item.qcKey">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="" class="full-width">
                  <el-alert
                      title="备注"
                      type="info"
                      description="">
                    <p>1.如果是多个交易地址，则使用符号“;”分隔开，例如：net.tcp://xgtest:6401/;net.tcp://xgtest:6402/。</p>
                    <p>2.如果是多个行情地址，则使用符号“;”分隔开，例如：net.tcp://xgtest:6401/;net.tcp://xgtest:6402/。</p>
                  </el-alert>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="doCancel">取消</el-button>
          <el-button type="primary" @click="doSave" :loading="isLoading">保存</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import {
    list,
    add,
    update,
    remove,
    getCommonData
  } from '../../api/tradeAccountReview';

  export default {
    name: 'TradeAccountReview',
    data() {
      return {
        list: [],
        listLoading: false,
        itemCount: 0,
        commonData: {},
        query: {
          accountName: '',
          pagination: {
            currentPage: 1,
            pageSize: 10
          }
        },
        defaultQuery: {
          accountName: '',
          pagination: {
            currentPage: 1,
            pageSize: 10,
            itemCount: 0
          }
        },
        formName: 'tradeAccountReviewForm',
        dialogVisible: false,
        rules: {
          username: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          passwordEncrypted: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          authCode: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          appId: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          brokerId: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          dispatcherAdapterType: [ { required: true, message: '不能为空', trigger: 'change' } ],
          tradeAddresses: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          quoteAddresses: [ { required: true, message: '不能为空', trigger: 'blur' } ],
          reviewObjects: [ { required: true, message: '不能为空', trigger: 'change', type: 'array' } ]
        },
        model: {
          id: '',
          isDeleted: '',
          name: '',
          username: '',
          passwordEncrypted: '',
          authCode: '',
          appId: '',
          brokerId: '',
          dispatcherAdapterType: '',
          tradeAddresses: '',
          quoteAddresses: '',
          reviewObjects: []
        },
        defaultData: {
          id: '',
          isDeleted: '',
          name: '',
          username: '',
          passwordEncrypted: '',
          authCode: '',
          appId: '',
          brokerId: '',
          dispatcherAdapterType: '',
          tradeAddresses: '',
          quoteAddresses: '',
          reviewObjects: []
        },
        dialogStatus: '',
        dialogTitle: {
          add: '新增',
          update: '编辑'
        },
        isLoading: false,
        dispatcherAdapterTypeList: [],
        exchanges: []
      };
    },
    async created() {
      await this.fetchEnums();
      await this.fetchData();
    },
    methods: {
      doSearch() {
        this.query.pagination.currentPage = 1;
        this.fetchData();
      },

      async fetchEnums() {
        this.commonData = (await getCommonData()).data;
        this.dispatcherAdapterTypeList = this.commonData.options.dispatcherAdapterType;
        this.exchanges = this.commonData.exchanges;
      },

      async fetchData() {
        this.listLoading = true;
        const { data } = await list(this.query).finally(() => {
          this.listLoading = false;
        });
        this.list = this.convertReviewObjs(data.list);
        this.query.pagination.currentPage = data.pagination.currentPage;
        this.query.pagination.pageSize = data.pagination.pageSize;
        this.itemCount = data.pagination.itemCount;
      },

      convertReviewObjs(list) {
        return list.map(t => {
          t.reviewObject = t.reviewObjects.map(qcKey => {
            const _target = this.exchanges.find(exchange => exchange.qcKey === qcKey);
            return _target && _target.fullName || '';
          }).join(',');
          
          return t;
        });
      },

      doSplit(str) {
        if (!str) return '';
        return str.split(/[,，；;]/g);
      },

      handleCurrentChange(currentPage) {
        this.query.pagination.currentPage = currentPage;
        this.fetchData();
      },

      handleSizeChange(pageSize) {
        this.query.pagination.pageSize = pageSize;
        this.fetchData();
      },

      doAdd() {
        this.dialogStatus = 'add';
        this.dialogVisible = true;
        this.isLoading = false;
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.model = { ...this.defaultData };
      },

      doEdit(row) {
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.model = { ...row };
      },

      doDelete(row) {
        this.$confirm(
          `确认删除账户名：【${row.username}】`,
          '提示',
          {
            type: 'warning',
            confirmButtonText: '删除',
            cancelButtonText: '取消'
          }
        )
          .then(() => {
            remove(row.id).then(response => {
              if (response.status === 204) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
                this.fetchData();
              }
            });
          });
      },

      doCancel() {
        this.dialogVisible = false;
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
      },

      doSave() {
        let _model = { ...this.model };
        this.$refs[this.formName].validate(async valid => {
          if (valid) {
            this.isLoading = true;
            if (this.dialogStatus === 'update') {
              await update(_model.id, _model).finally(() => {
                this.isLoading = false;
              });
              this.dialogVisible = false;
              this.$refs[this.formName].resetFields();
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              await this.fetchData();
            } else {
              await add(_model).finally(() => {
                this.isLoading = false;
              });
              this.dialogVisible = false;
              this.$refs[this.formName].resetFields();
              this.$message({
                type: 'success',
                message: '新增成功'
              });
              await this.fetchData();
            }
          } else {
            return false;
          }
        });
      },

      doReset() {
        this.query = Object.assign({}, this.defaultQuery);
      }

    }
  };
</script>