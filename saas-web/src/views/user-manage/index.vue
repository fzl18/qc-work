<template>
  <el-container class="container">
    <section v-if="!isSetting" style="width:100%">
      <el-header>
        <div class="search-header-row">
          <div>
            <el-input
                placeholder="显示名称"
                v-model="query.displayNameContains"
                clearable>
            </el-input>
          </div>
          <div>
            <el-input
                placeholder="登录名称"
                v-model="query.userNameEquals"
                clearable>
            </el-input>
          </div>
          <div>
            <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
            <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
            <el-button icon="el-icon-error" title="清空" @click="doResetQuery">清空</el-button>
          </div>
        </div>
      </el-header>

      <el-main>
        <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                  highlight-current-row>
          <el-table-column label="显示名称" align="center">
            <template slot-scope="scope">
              {{scope.row.displayName}}
            </template>
          </el-table-column>
          <el-table-column label="登录名称" align="center">
            <template slot-scope="scope">
              {{scope.row.username}}
            </template>
          </el-table-column>
          <el-table-column label="电子邮件" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.email}}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="操作"
              width="150">
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button type="text" icon="el-icon-edit" @click="doEdit(scope.row)"
                           v-hasAuth="[$route,'update']"
                           class="operation-btn"></el-button>
              </el-tooltip>
              <el-tooltip content="重置密码" placement="top" v-if="isAdmin">
                <el-button type="text" icon="el-icon-refresh" class="color-warning operation-btn"
                           @click="doSetPasswordByAdmin(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top" v-if="!scope.row.isAdmin">
                <el-button type="text" icon="el-icon-delete" class="color-danger operation-btn"
                           v-hasAuth="[$route,'delete']"
                           @click="doDelete(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip content="权限配置" placement="top">
                <el-button type="text" icon="el-icon-setting" @click="toggleConfig(scope.row.userId,'setting')"
                           v-if="!scope.row.isAdmin" v-hasAuth="[$route,'authority-config']"
                           class="color-default operation-btn"></el-button>
              </el-tooltip>
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

      <!-- dialog -->
      <div>
        <el-dialog
            :title="dialogTitle[dialogStatus]"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="30%">
          <div>
            <el-form label-position="right"
                     label-width="80px"
                     :ref="formName"
                     :rules="rules"
                     :model="user">
              <el-form-item label="显示名称" prop="displayName">
                <el-input v-model="user.displayName"></el-input>
              </el-form-item>
              <el-form-item label="登录名称" prop="username" :required="dialogStatus === 'add'">
                <el-input v-model="user.username" :disabled="isDisabled"></el-input>
              </el-form-item>
              <el-form-item label="电子邮件" prop="email">
                <el-input v-model="user.email" type="email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="phone">
                <el-input v-model="user.phone" type="tel"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
                  <el-button @click="doCancel">取 消</el-button>
                  <el-button type="primary" @click="doSave">保 存</el-button>
              </span>
        </el-dialog>
      </div>
    </section>
    <auth-config v-if="isSetting"/>
  </el-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import authConfig from './config';

  import {
    list,
    add,
    update,
    setPasswordByAdmin,
    remove
  } from '../../api/userManage';

  export default {
    components: { authConfig },
    name: 'UserManage',
    data() {
      const validateUserName = (rule, value, callback) => {
        if (!value) {
          return callback('用户名称不能为空');
        } else {
          callback();
        }
      };

      return {
        all: [],
        list: [],
        listLoading: true,
        itemCount: 0,
        isSetting: false,
        query: {
          userNameEquals: '',
          displayNameContains: '',
          pagination: {
            currentPage: 1,
            pageSize: 10,
            itemCount: 0
          }
        },
        defaultQuery: {
          userNameEquals: '',
          displayNameContains: '',
          pagination: {
            currentPage: 1,
            pageSize: 10,
            itemCount: 0
          }
        },
        formName: 'userForm',
        dialogVisible: false,
        rules: {
          username: [ { validator: validateUserName, trigger: 'blur' } ],
          displayName: [ { required: true,message: '显示名称不能为空', trigger: 'blur' } ],
          email: [
            {
              required: true,
              message: '邮箱地址不能为空',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入正确格式的邮箱地址：a@b.com',
              trigger: [ 'blur', 'change' ]
            }
          ]
        },
        user: {
          userId: '',
          displayName: '',
          username: '',
          email: '',
          phone: ''
        },
        defaultUser: {
          userId: '',
          displayName: '',
          username: '',
          email: '',
          phone: ''
        },
        dialogStatus: '',
        dialogTitle: {
          add: '新增',
          update: '编辑'
        },
        params: {}
      };
    },
    created() {
      this.fetchData();
      let show = this.$route.query && this.$route.query.type == 'setting';
      if (show) {
        this.$route.meta.subTitle = '权限配置';
      } else {
        this.$route.meta.subTitle = '';
      }
      this.isSetting = show;
    },
    methods: {
      doSearch() {
        this.query.pagination.currentPage = 1;
        this.fetchData();
      },

      fetchData() {
        this.listLoading = true;
        list(this.query)
          .then(response => {
            this.listLoading = false;
            this.list = response.data.list;
            this.query.pagination.currentPage =
              response.data.pagination.currentPage;
            this.query.pagination.pageSize =
              response.data.pagination.pageSize;
            this.itemCount = response.data.pagination.itemCount;
          })
          .catch(() => {
            this.listLoading = false;
          });
      },

      handleSizeChange(val) {
        this.query.pagination.pageSize = val;
        this.fetchData();
      },

      handleCurrentChange(val) {
        this.query.pagination.currentPage = val;
        this.fetchData();
      },

      doAdd() {
        this.dialogStatus = 'add';
        this.dialogVisible = true;
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.user = { ...this.defaultUser };
      },

      doCancel() {
        this.dialogVisible = false;
        this.$refs[this.formName].resetFields();
      },

      doSave() {
        let t = { ...this.user };
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            if (this.dialogStatus === 'add' && this.isAdmin) {
              add({ ...t, password: '666666' }).then(response => {
                if (response.status) {
                  this.dialogVisible = false;
                  this.$refs[this.formName].resetFields();
                  this.$message({
                    type: 'success',
                    message: '添加用户成功'
                  });
                  this.fetchData();
                }
              });
            } else {
              if (this.isEditable(t)) {
                update(t.userId, t).then(response => {
                  if (response.status) {
                    this.dialogVisible = false;
                    this.$refs[this.formName].resetFields();
                    this.$message({
                      type: 'success',
                      message: '修改用户成功'
                    });
                    this.fetchData();
                  }
                });
              }
            }
          } else {
            return false;
          }
        });
      },

      doEdit(row) {
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.user = { ...row };
      },

      doSetPasswordByAdmin(row) {
        if (this.userInfo && this.userInfo.userId) {
          this.$confirm(
            `确认重置用户ID：${row.userId} 【${
              row.displayName
            }】的密码为：${process.env.VUE_APP_INITIAL_PASSWORD}`,
            '提示',
            {
              type: 'warning',
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            }
          ).then(() => {
            setPasswordByAdmin(row.userId, {
              changeePasswordNew: `${process.env.VUE_APP_INITIAL_PASSWORD}`
            }).then(response => {
              if (response.status === 204) {
                this.$message({
                  type: 'success',
                  message: '重置密码成功'
                });
              }
            });
          });
        }
      },

      doDelete(row) {
        this.$confirm(`确认删除该用户：【${row.displayName}】`, '提示', {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        })
          .then(() => {
            if (this.isAdmin) {
              remove(row.userId).then(response => {
                if (response.status === 204) {
                  this.$message({
                    type: 'success',
                    message: '删除成功'
                  });
                  this.fetchData();
                }
              });
            } else {
              this.$message({
                type: 'error',
                message: '无操作权限'
              });
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
      },

      isEditable(user) {
        if (this.userInfo.userId && this.isAdmin) {
          // 管理员可修改所有人信息
          return true;
        } else {
          // 非管理员只可以修改自己信息
          return user.userId === this.userInfo.userId;
        }
      },

      toggleConfig(userId, type) {
        this.$router.push({ path: this.$route.path, query: { type, userId } });
      },

      doResetQuery() {
        this.query = Object.assign({}, this.defaultQuery)
      }
    },
    computed: {
      ...mapGetters([ 'userInfo' ]),
      isDisabled() {
        return this.dialogStatus === 'update';
      },
      isAdmin() {
        return this.userInfo.username === 'admin';
      }

    }
  };
</script>

<style scoped>
  .container {
    margin-top: 20px;
  }

  .operation-btn {
    font-size: 18px;
  }
</style>
