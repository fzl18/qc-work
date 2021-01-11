<template>
	<div class="app-container">
		<div class="search-header-row search-margin-bottom">
			<div>
				<el-input placeholder="唯一标识" title="唯一标识" v-model="query.qcKey" clearable />
			</div>
			<div>
				<el-input placeholder="代码" title="唯一标识" v-model="query.code" clearable />
			</div>
			<div>
				<el-input placeholder="名称" title="名称" v-model="query.name" clearable> </el-input>
			</div>
			<div>
				<el-select v-model="query.industryCategory" filterable clearable placeholder="行业类别" title="行业类别">
					<el-option v-for="item in commonData.industryCategoryList" :key="item.qcKey" :label="item.name" :value="item.qcKey"> </el-option>
				</el-select>
			</div>
			<div>
				<el-select v-model="query.defaultUnit" filterable clearable placeholder="默认重量单位" title="默认重量单位">
					<el-option v-for="item in commonData.unitList" :key="item.qcKey" :label="item.name" :value="item.qcKey"> </el-option>
				</el-select>
			</div>
			<div>
				<el-select v-model="query.isDeleted" :title="isDeleted" :placeholder="isDeleted" clearable>
					<el-option v-for="(item, index) in yOrNList" :key="index" :label="item.value" :value="item.key" />
				</el-select>
			</div>
			<el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
			<el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
			<import-file
				:download-file-name="downloadFileName"
				:column="importColumn"
				:download-url="downloadUrl"
				:preview-url="previewUrl"
				:import-url="importUrl"
				@fetch-data="fetchData"
				v-hasAuth="[$route,'import']"
			/>
			<div>
				<el-button icon="el-icon-error" title="清空" @click="doReset"><span class="hidden-lg-and-down">清空</span> </el-button>
			</div>
		</div>

		<div class="search-margin-bottom">
			<el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
				<el-table-column label="唯一标识" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.qcKey }}</span>
					</template>
				</el-table-column>
				<el-table-column label="代码" align="center">
					<template slot-scope="scope">
						{{ scope.row.code }}
					</template>
				</el-table-column>
				<el-table-column label="名称" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="行业类别" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.industryCategory | mapKV(commonData.industryCategoryList, 'name', 'qcKey') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="默认量类别" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.defaultQuantityType | mapKV(commonData.quantityTypeList, 'name', 'qcKey') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="默认重量单位" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.defaultUnit | mapKV(commonData.unitList, 'name', 'qcKey') }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否基本成分" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.isFundamentalComponentText }}</span>
					</template>
				</el-table-column>
				<el-table-column label="是否停用" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.isDeleted | parseBool }}</span>
					</template>
				</el-table-column>
				<el-table-column label="英文名称" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.englishName }}</span>
					</template>
				</el-table-column>
				<el-table-column label="精度" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.defaultUnitScale }}</span>
					</template>
				</el-table-column>
				<el-table-column label="国内进销项税" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.domesticTaxRate }}</span>
					</template>
				</el-table-column>
				<el-table-column label="创建时间" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.creationTime | parseTime }}</span>
					</template>
				</el-table-column>
				<el-table-column label="最近更新时间" align="center">
					<template slot-scope="scope">
						<span>{{ scope.row.lastManipulationTime | parseTime }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" width="120">
					<template slot-scope="scope">
						<el-tooltip content="编辑" placement="top">
							<el-button type="text" icon="el-icon-edit" v-hasAuth="[$route,'update']" @click="doEdit(scope.row)" class="operation-btn"></el-button>
						</el-tooltip>
						<el-tooltip content="启用" placement="top" v-if="scope.row.isDeleted">
							<el-button
								type="text"
								icon="el-icon-success"
								@click="doEnable(scope.row)"
								v-hasAuth="[$route,'switch-enable-status']"
								class="operation-btn operation-enable-btn"
							></el-button>
						</el-tooltip>
						<el-tooltip content="停用" placement="top" v-else>
							<el-button
								type="text"
								icon="el-icon-remove-outline"
								@click="doDisable(scope.row)"
								v-hasAuth="[$route,'switch-enable-status']"
								class="operation-btn operation-disable-btn"
							></el-button>
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
				:total="itemCount"
			>
			</el-pagination>
		</el-footer>

		<!-- dialog -->
		<div>
			<el-dialog
				:title="dialogTitle[dialogStatus]"
				:visible.sync="dialogVisible"
				:close-on-click-modal="false"
				:close-on-press-escape="false"
				width="60%"
			>
				<div>
					<el-form label-position="right" label-width="140px" status-icon :ref="formName" :rules="rules" :model="commodityTypeModel">
						<el-row>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="唯一标识" prop="qcKey">
									<el-input v-model="commodityTypeModel.qcKey" clearable placeholder="" :disabled="dialogStatus === 'update'" />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="代码" prop="code">
									<el-input v-model="commodityTypeModel.code" clearable placeholder="" :disabled="dialogStatus === 'update'" />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="名称" prop="name">
									<el-input v-model="commodityTypeModel.name" clearable placeholder="" :disabled="dialogStatus === 'update'" />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="行业类别" prop="industryCategory" class="full-width">
									<el-select v-model="commodityTypeModel.industryCategory" filterable clearable placeholder="">
										<el-option v-for="(item, index) in commonData.industryCategoryList" :key="index" :label="item.name" :value="item.qcKey">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="默认量类别" prop="defaultQuantityType" class="full-width">
									<el-select v-model="commodityTypeModel.defaultQuantityType" filterable clearable placeholder="">
										<el-option v-for="(item, index) in commonData.quantityTypeList" :key="index" :label="item.name" :value="item.qcKey">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="默认重量单位" prop="defaultUnit" class="full-width">
									<el-select v-model="commodityTypeModel.defaultUnit" filterable clearable placeholder="">
										<el-option v-for="(item, index) in commonData.unitList" :key="index" :label="item.name" :value="item.qcKey">
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="是否基本成分" prop="isFundamentalComponent" class="full-width">
									<el-select v-model="commodityTypeModel.isFundamentalComponent" filterable clearable placeholder="">
										<el-option v-for="(item, index) in yOrNList" :key="index" :label="item.value" :value="item.key" >
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="英文名称" prop="englishName">
									<el-input v-model="commodityTypeModel.englishName" clearable placeholder="" />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="精度" prop="defaultUnitScale" class="full-width">
									<el-input-number v-model="commodityTypeModel.defaultUnitScale" :precision="0" :step="1" :max="8" :min="0" />
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
								<el-form-item label="国内进销项税" prop="domesticTaxRate">
									<el-input v-model="commodityTypeModel.domesticTaxRate" clearable placeholder="" />
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
	import { mapGetters } from 'vuex'
	import ImportFile from '../../components/ImportFile/index'
	import { getEnums } from '../../api/enums'
	import { list, update, toggleAble, getCommonData, add, baseUrl } from '../../api/commodityType'
	import { YOrNList } from '../../assets/enums'

	export default {
		name: 'commodityType',
		components: {
			ImportFile
		},
		data() {
			return {
				importColumn: [
					{
						label: '品类代码',
						prop: 'code'
					},
					{
						label: '品类名称',
						prop: 'name'
					},
					{
						label: '唯一标识',
						prop: 'qcKey'
					},
					{
						label: '行业类别',
						prop: 'industryCategory'
					},
					{
						label: '默认量类别',
						prop: 'defaultQuantityType'
					},
					{
						label: '默认重量单位',
						prop: 'defaultUnit'
					},
					{
						label: '是否基本成分',
						prop: 'isFundamentalComponent'
					},
					{
						label: '英文名称',
						prop: 'englishName'
					},
					{
						label: '精度',
						prop: 'defaultUnitScale'
					},
					{
						label: '国内进销项税',
						prop: 'domesticTaxRate'
					}
				],
				downloadFileName: '品类模板.xls',
				downloadUrl: `${baseUrl}/Download`,
				previewUrl: `${baseUrl}/Preview`,
				importUrl: `${baseUrl}/Import`,
				isOperating: false,
				list: [],
				listLoading: false,
				itemCount: 0,
				commonData: [],
				query: {
					qcKey: '',
					code: '',
					name: '',
					industryCategory: '',
					defaultUnit: '',
					isDeleted: '',
					pagination: {
						currentPage: 1,
						pageSize: 10
					}
				},
				formName: 'commodityTypeForm',
				dialogVisible: false,
				rules: {
					qcKey: [{ required: true, message: '不能为空', trigger: 'blur' }],
					code: [{ required: true, message: '不能为空', trigger: 'blur' }],
					name: [{ required: true, message: '不能为空', trigger: 'blur' }],
					industryCategory: [{ required: true, message: '不能为空', trigger: 'change' }],
					defaultQuantityType: [{ required: true, message: '不能为空', trigger: 'change' }],
					defaultUnit: [{ required: true, message: '不能为空', trigger: 'change' }],
					isFundamentalComponent: [{ required: true, message: '不能为空', trigger: 'change' }]
				},
				exchangeType: [],
				commodityTypeModel: {
					id: '',
					code: '',
					name: '',
					qcKey: '',
					industryCategory: '',
					defaultUnit: '',
					isDeleted: false,
					englishName: '',
					creationTime: '',
					lastManipulationTime: '',
					defaultUnitScale: '',
					domesticTaxRate: ''
				},
				defaultData: {
					id: '',
					code: '',
					name: '',
					qcKey: '',
					industryCategory: '',
					defaultUnit: '',
					isDeleted: false,
					englishName: '',
					creationTime: '',
					lastManipulationTime: '',
					defaultUnitScale: '',
					domesticTaxRate: '',
					isFundamentalComponent: true
				},
				defaultQuery: {
					qcKey: '',
					instrumentCategoryCode: '',
					exchange: '',
					commodityType: '',
					currency: '',
					unit: '',
					isETrading: '',
					isDeleted: '',
					pagination: {
						currentPage: 1,
						pageSize: 10,
						itemCount: 0
					}
				},
				dialogStatus: '',
				dialogTitle: {
					add: '新增',
					update: '编辑'
				},
				isLoading: false,
				isDeleted: '是否停用'
			}
		},
		async created() {
			await this.fetchEnums()
			this.fetchData()
		},
		methods: {
			doEnable(row) {
				if (row.isDeleted) {
					this.$confirm(`确认启用：【${row.name}】？`, '提示', {
						type: 'warning',
						confirmButtonText: '确认',
						cancelButtonText: '取消'
					})
						.then(async () => {
							this.isOperating = true
							await toggleAble(row.id).finally(() => {
								this.isOperating = false
							})
							this.$message({
								type: 'success',
								message: '启用成功'
							})
							await this.fetchData()
						})
				}
			},

			doDisable(row) {
				if (!row.isDeleted) {
					this.$confirm(`确认停用：【${row.name}】？`, '提示', {
						type: 'warning',
						confirmButtonText: '确认',
						cancelButtonText: '取消'
					})
						.then(async () => {
							this.isOperating = true
							await toggleAble(row.id).finally(() => {
								this.isOperating = false
							})
							this.isOperating = false
							this.$message({
								type: 'success',
								message: '停用成功'
							})
							await this.fetchData()
						})
				}
			},

			doAdd() {
				this.dialogStatus = 'add'
				this.dialogVisible = true
				this.isLoading = false
				if (this.$refs[this.formName]) {
					this.$refs[this.formName].resetFields()
				}
				this.commodityTypeModel = { ...this.defaultData }
			},

			doSearch() {
				this.query.pagination.currentPage = 1
				this.fetchData()
			},

			async fetchEnums() {
				const { data } = await getEnums({
					enumTypeNames: ['exchangeType']
				})
				const data1 = (await getCommonData()).data
				this.exchangeType = data.exchangeType
				this.commonData = data1
			},

			async fetchData() {
				this.listLoading = true
				const { data } = await list(this.query).finally(() => {
					this.listLoading = false
				})
				this.list = data.list
				this.query.pagination.currentPage = data.pagination.currentPage
				this.query.pagination.pageSize = data.pagination.pageSize
				this.itemCount = data.pagination.itemCount
			},

			handleSizeChange(val) {
				this.query.pagination.pageSize = val
				this.fetchData()
			},

			handleCurrentChange(val) {
				this.query.pagination.currentPage = val
				this.fetchData()
			},

			doEdit(row) {
				this.dialogStatus = 'update'
				this.dialogVisible = true
				this.commodityTypeModel = { ...row }
			},

			doCancel() {
				this.dialogVisible = false
				if (this.$refs[this.formName]) {
					this.$refs[this.formName].resetFields()
				}
			},

			doSave() {
				let t = { ...this.commodityTypeModel }
				this.$refs[this.formName].validate(async valid => {
					if (valid) {
						this.isLoading = true
						if (this.dialogStatus === 'update') {
							await update(t.id, t).finally(() => {
								this.isLoading = false
							})
							this.dialogVisible = false
							this.$refs[this.formName].resetFields()
							this.$message({
								type: 'success',
								message: '修改成功'
							})
							this.fetchData()
						} else {
							await add(t).finally(() => {
								this.isLoading = false
							})
							this.dialogVisible = false
							this.$refs[this.formName].resetFields()
							this.$message({
								type: 'success',
								message: '新增成功'
							})
							this.fetchData()
						}
					} else {
						return false
					}
				})
			},
			
			doReset() {
				this.query = Object.assign({}, this.defaultQuery)
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			isAdmin() {
				return this.userInfo.isAdmin
			},
			yOrNList() {
				return YOrNList
			}
		}
	}
</script>

<style scoped>
	.operation-btn {
		font-size: 18px;
	}
</style>
