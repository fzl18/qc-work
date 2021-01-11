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
                    <el-input
                        placeholder="应用ID"
                        v-model="query.externalAppIdEquals"
                        clearable>
                    </el-input>
                </div>
                <div>
                    <el-input
                            placeholder="显示名称"
                            v-model="query.externalAppId"
                            clearable>
                    </el-input>
                </div>
                <div>
                    <el-select v-model="query.qcExternalAppType" filterable clearable placeholder="移动应用类型" class="item-select">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <el-input
                            placeholder="企业编码"
                            v-model="query.appTenantCodeEquals"
                            clearable>
                    </el-input>
                </div>
                <div>
                    <el-input
                            placeholder="企业租户ID"
                            v-model="query.appTenantId"
                            clearable>
                    </el-input>
                </div>
                <div>
                    <el-input
                            placeholder="企业应用CorpId"
                            v-model="query.externalCorpIdEquals"
                            clearable>
                    </el-input>
                </div>
                <div>
                    <el-input
                            placeholder="企业名称"
                            v-model="query.externalCorpNameContains"
                            clearable>
                    </el-input>
                </div>
                <div>
                    <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
                </div>
                <!--<div>-->
                    <!--<el-button type="success" icon="el-icon-plus" @click="doAdd">新增</el-button>-->
                <!--</div>-->
            </div>
        </el-header>

        <el-main>
            <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
                <el-table-column label="ID" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="移动应用ID" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.externalAppId }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="企业代码" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.appTenantCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="企业应用Id" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.externalCorpId }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="企业名称" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.externalCorpName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="永久授权码" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.permanentCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="临时授权码" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.temporaryCode }}</span>
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
                        <el-tooltip content="停用" placement="top">
                            <el-button type="text" icon="el-icon-remove-outline" class="color-danger operation-btn" @click="doDelete(scope.row)" v-hasAuth="[$route,'delete']"></el-button>
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

        <!--dialog  -->
        <div>
            <el-dialog
                    :title="dialogTitle[dialogStatus]"
                    :visible.sync="dialogVisible"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    width="30%">
                <div>
                    <el-form label-position="right"
                             label-width="120px"
                             status-icon
                             :ref="formName"
                             :rules="rules"
                             :model="tenantExternalApp">
                        <el-form-item label="企业代码" prop="appTenantCode">
                            <el-select v-model="tenantExternalApp.appTenantCode" filterable clearable placeholder="" class="item-select">
                                <el-option
                                    v-for="item in corporations"
                                    :key="item.appTenantCode"
                                    :label="item.displayName"
                                    :value="item.appTenantCode">
                                    <div style="display: flex;justify-content: space-between;">
                                        <div>{{item.displayName}}</div>
                                        <div style="color: #8492a6;">{{item.appTenantCode}}</div>
                                    </div>
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button @click="doCancel">取 消</el-button>
                <el-button type="primary" @click="doSave">保 存</el-button>
            </span>
            </el-dialog>
        </div>
    </el-container>
</template>

<script>
import { list, update, remove } from "../../api/tenantExternalApp";
import { list as corporationList } from "../../api/corporationManage";
import { getEnum } from "../../api/enums";

export default {
    name: "TenantExternalApp",
    data() {
        return {
            options: [],
            list: [],
            listLoading: false,
            itemCount: 0,
            query: {
                id: "",
                externalAppIdEquals: "",
                externalAppId: "",
                qcExternalAppType: "",
                appTenantCodeEquals: "",
                appTenantId: "",
                externalCorpIdEquals: "",
                externalCorpNameContains: "",
                pagination: {
                    currentPage: 1,
                    pageSize: 10
                }
            },
            formName: "tenantExternalAppForm",
            dialogVisible: false,
            rules: {
                appTenantCode: [
                    { required: true, message: "不能为空", trigger: "blur" }
                ]
            },
            tenantExternalApp: {
                id: "",
                appTenantCode: ""
            },
            defaultTenantExternalApp: {
                id: "",
                appTenantCode: ""
            },
            dialogStatus: "",
            dialogTitle: {
                add: "新增",
                update: "编辑"
            },
            pwdType: "password",
            corporations: []
        };
    },
    async created() {
        await this.fetchEnums();
        this.getCorporations();
        this.fetchData();
    },
    methods: {
        doSearch() {
            this.query.pagination.currentPage = 1;
            this.fetchData();
        },

        async fetchEnums() {
            const response = await getEnum("qcExternalAppType");
            this.options = response.data;
        },

        getCorporations() {
            corporationList({
                isDisabled: false,
                pagination: {
                    pageSize: 0,
                }
            }).then(response => {
                this.corporations = response.data.list;
            });
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
            this.dialogStatus = "update";
            this.dialogVisible = true;
            this.tenantExternalApp = { ...row };
        },

        doDelete(row) {
            this.$confirm(
                `确认企业： ${row.appTenantCode} 【${row.displayName}】`,
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
                        message: "已取消操作!"
                    });
                });
        },

        doAdd() {
            this.dialogStatus = "add";
            this.dialogVisible = true;
            if (this.$refs[this.formName]) {
                this.$refs[this.formName].resetFields();
            }
            this.tenantExternalApp = { ...this.defaultTenantExternalApp };
        },

        doCancel() {
            this.dialogVisible = false;
            this.$refs[this.formName].resetFields();
        },

        doSave() {
            let t = { ...this.tenantExternalApp };
            this.$refs[this.formName].validate(valid => {
                if (valid) {
                    if (this.dialogStatus === "update") {
                        update(t.id, { appTenantCode: t.appTenantCode }).then(
                            response => {
                                if (response.status) {
                                    this.dialogVisible = false;
                                    this.$refs[this.formName].resetFields();
                                    this.$message({
                                        type: "success",
                                        message: "编辑成功"
                                    });
                                    this.fetchData();
                                }
                            }
                        );
                    }
                } else {
                    return false;
                }
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
