<template>
    <el-container class="container">
        <el-header>
            <div class="search-header-row">
                <div>
                    <el-input
                        placeholder="ID"
                        v-model="query.id"
                        clearable>
                    </el-input>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
                </div>
                <div>
                    <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
                </div>
            </div>
        </el-header>

        <el-main>
            <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
                <el-table-column label="数据库实例名称" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.instanceServerName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数据库连接用户名" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.deployUsername }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.notes }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建人" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.creatorName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.creationTime | parseTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最近修改人" align="center">
                    <template slot-scope="scope">
                        {{scope.row.lastManipulatorName}}
                    </template>
                </el-table-column>
                <el-table-column label="最近修改时间" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.lastManipulationTime | parseTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        label="操作"
                        width="120">
                    <template slot-scope="scope">
                        <el-tooltip content="编辑" placement="top">
                            <el-button type="text" icon="el-icon-edit" @click="doEdit(scope.row)" class="operation-btn" v-hasAuth="[$route,'update']"></el-button>
                        </el-tooltip>
                        <el-tooltip content="修改数据库凭据" placement="top">
                            <el-button type="text" icon="el-icon-edit-outline" @click="doUpdateDeployCredential(scope.row)" class="color-warning operation-btn" v-hasAuth="[$route,'update-db-credential']"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button type="text" icon="el-icon-delete" class="color-danger operation-btn" @click="doDelete(scope.row)" v-hasAuth="[$route,'delete']"></el-button>
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
                             label-width="140px"
                             status-icon
                             :ref="formName"
                             :rules="rules"
                             :model="dbInstance">
                        <el-form-item label="数据库类型" prop="dbmsType">
                            <el-select v-model="dbInstance.dbmsType" filterable clearable placeholder="" class="item-select">
                                <el-option
                                        v-for="(item, index) in dbmsTypeOptions"
                                        :key="index"
                                        :label="item.text"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据库版本" prop="dbmsVersion">
                            <el-select v-model="dbInstance.dbmsVersion" filterable clearable placeholder="" class="item-select">
                                <el-option
                                        v-for="(item, index) in dbmsVersionOptions"
                                        :key="index"
                                        :label="item.text"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="dataProviderType" prop="dataProviderType">
                            <el-select v-model="dbInstance.dataProviderType" filterable clearable placeholder="" class="item-select">
                                <el-option
                                        v-for="(item, index) in dataProviderTypeOptions"
                                        :key="index"
                                        :label="item.text"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据库实例名称" prop="instanceServerName">
                            <el-input v-model="dbInstance.instanceServerName"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库连接用户名" prop="deployUsername" v-if="dialogStatus === 'add'">
                            <el-input v-model="dbInstance.deployUsername"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库连接密码" prop="deployPassword" v-if="dialogStatus === 'add'">
                            <el-input type="password" v-model="dbInstance.deployPassword"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" prop="notes">
                            <el-input v-model="dbInstance.notes"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="doCancel">取 消</el-button>
                    <el-button type="primary" @click="doSave" :loading="isLoading">保 存</el-button>
                </span>
            </el-dialog>

            <el-dialog
                    title="编辑"
                    :visible.sync="deployCredentialDialogVisible"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    width="30%">
                <div>
                    <el-form label-position="right"
                             label-width="140px"
                             status-icon
                             :ref="deployCredentialFormName"
                             :rules="deployCredentialRules"
                             :model="deployCredential">
                        <el-form-item label="数据库连接用户名" prop="deployUsername">
                            <el-input v-model="deployCredential.deployUsername"></el-input>
                        </el-form-item>
                        <el-form-item label="数据库连接密码" prop="deployPassword">
                            <el-input type="password" v-model="deployCredential.deployPassword"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="doCancel">取 消</el-button>
                    <el-button type="primary" @click="doDeployCredentialSave" :loading="isDeployCredentialLoading">保 存</el-button>
                </span>
            </el-dialog>
        </div>
    </el-container>
</template>

<script>
import {
    list,
    add,
    update,
    updateDeployCredential,
    remove
} from "../../api/dbInstanceManage";
import { getEnums } from "../../api/enums";

export default {
    name: "TenantExternalApp",
    data() {
        return {
            dbmsTypeOptions: [],
            dbmsVersionOptions: [],
            dataProviderTypeOptions: [],
            list: [],
            listLoading: false,
            itemCount: 0,
            query: {
                id: "",
                dbmsType: "",
                dataProviderType: "",
                dbmsVersion: "",
                pagination: {
                    currentPage: 1,
                    pageSize: 10
                }
            },
            formName: "dbInstanceManageForm",
            deployCredentialFormName: "deployCredentialForm",
            dialogVisible: false,
            deployCredentialDialogVisible: false,
            rules: {
                dbmsType: [
                    { required: true, message: "不能为空", trigger: "change" }
                ],
                dbmsVersion: [
                    { required: true, message: "不能为空", trigger: "change" }
                ],
                dataProviderType: [
                    { required: true, message: "不能为空", trigger: "change" }
                ],
                instanceServerName: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                deployUsername: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                deployPassword: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ]
            },
            deployCredentialRules: {
                deployUsername: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ],
                deployPassword: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ]
            },
            dbInstance: {
                dbmsType: "",
                dbmsVersion: "",
                dataProviderType: "",
                instanceServerName: "",
                deployUsername: "",
                deployPassword: "",
                notes: ""
            },
            defaultDbInstance: {
                dbmsType: "",
                dbmsVersion: "",
                dataProviderType: "",
                instanceServerName: "",
                deployUsername: "",
                deployPassword: "",
                notes: ""
            },
            deployCredential: {
                deployUsername: "",
                deployPassword: ""
            },
            dialogStatus: "",
            dialogTitle: {
                add: "新增",
                update: "编辑"
            },
            pwdType: "password",
            isLoading: false,
            isDeployCredentialLoading: false
        };
    },
    async created() {
        await this.fetchEnums();
        this.fetchData();
    },
    methods: {
        doSearch() {
            this.query.pagination.currentPage = 1;
            this.fetchData();
        },

        async fetchEnums() {
            const response = await getEnums({
                enumTypeNames: ["dataProviderType", "dbmsType", "dbmsVersions"]
            });
            this.dataProviderTypeOptions = response.data.dataProviderType;
            this.dbmsTypeOptions = response.data.dbmsType;
            this.dbmsVersionOptions = response.data.dbmsVersions;
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

        doEdit(row) {
            if (this.$refs[this.formName]) {
                this.$refs[this.formName].resetFields();
            }
            this.dialogStatus = "update";
            this.dialogVisible = true;
            this.dbInstance = { ...row };
        },

        doAdd() {
            this.dialogStatus = "add";
            this.dialogVisible = true;
            if (this.$refs[this.formName]) {
                this.$refs[this.formName].resetFields();
            }
            this.dbInstance = { ...this.defaultDbInstance };
        },

        doCancel() {
            this.dialogVisible = false;
            this.deployCredentialDialogVisible = false;
            if (this.$refs[this.formName]) {
                this.$refs[this.formName].resetFields();
            }
            if (this.$refs[this.deployCredentialFormName]) {
                this.$refs[this.deployCredentialFormName].resetFields();
            }
        },

        doSave() {
            let t = { ...this.dbInstance };
            this.$refs[this.formName].validate(valid => {
                if (valid) {
                    this.isLoading = true;
                    if (this.dialogStatus === "add") {
                        add(t)
                            .then(response => {
                                if (response.status === 200) {
                                    this.isLoading = false;
                                    this.dialogVisible = false;
                                    this.$refs[this.formName].resetFields();
                                    this.$message({
                                        type: "success",
                                        message: "新增成功"
                                    });
                                    this.fetchData();
                                }
                            })
                            .catch(() => {
                                this.isLoading = false;
                            });
                    } else {
                        update(t.id, t)
                            .then(response => {
                                if (response.status === 200) {
                                    this.isLoading = false;
                                    this.dialogVisible = false;
                                    this.$refs[this.formName].resetFields();
                                    this.$message({
                                        type: "success",
                                        message: "编辑成功"
                                    });
                                    this.fetchData();
                                }
                            })
                            .catch(() => {
                                this.isLoading = false;
                            });
                    }
                } else {
                    return false;
                }
            });
        },

        doUpdateDeployCredential({ id, deployUsername, deployPassword }) {
            this.deployCredential = { id, deployUsername, deployPassword };
            this.deployCredentialDialogVisible = true;
        },

        doDeployCredentialSave() {
            let { id, deployUsername, deployPassword } = {
                ...this.deployCredential
            };
            this.$refs[this.deployCredentialFormName].validate(valid => {
                if (valid) {
                    this.isDeployCredentialLoading = true;
                    updateDeployCredential(id, {
                        deployUsername,
                        deployPassword
                    })
                        .then(response => {
                            if (response.status === 204) {
                                this.deployCredentialDialogVisible = false;
                                this.$refs[
                                    this.deployCredentialFormName
                                ].resetFields();
                                this.isDeployCredentialLoading = false;
                                this.$message({
                                    type: "success",
                                    message: "修改成功"
                                });
                                this.fetchData();
                            }
                        })
                        .catch(() => {
                            this.isDeployCredentialLoading = false;
                        });
                } else {
                    return false;
                }
            });
        },

        doDelete(row) {
            this.$confirm(
                `确认删除该数据库实例：ID【${row.instanceServerName}】`,
                "提示",
                {
                    type: "warning",
                    confirmButtonText: "删除",
                    cancelButtonText: "取消"
                }
            )
                .then(() => {
                    remove(row.id).then(response => {
                        if (response.status === 204) {
                            this.$message({
                                type: "success",
                                message: "删除成功"
                            });
                            this.fetchData();
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消操作"
                    });
                });
        }
    }
};
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
