<template>
  <el-container class="container">
    <el-header>
      <div class="search-header-row">
        <div>
          <el-input placeholder="企业代码" v-model="query.appTenantCodeEquals" clearable/>
        </div>
        <div>
          <el-input placeholder="显示名称" v-model="query.displayNameContains" clearable/>
        </div>
        <div>
          <el-date-picker v-model="query.expireDateRangeStart" type="date" placeholder="选择起始过期日期"/>
        </div>
        <div>
          <el-date-picker v-model="query.expireDateRangeEnd" type="date" placeholder="选择结束过期日期"/>
        </div>
        <div>
          <el-select v-model="query.isDisabled" :title="assertData['isDisabled']"
                     :placeholder="assertData['isDisabled']" clearable>
            <el-option
                v-for="(item, index) in yOrNList"
                :key="index"
                :label="item.value"
                :value="item.key"
            />
          </el-select>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
        <div>
          <el-button type="success" icon="el-icon-plus" @click="doAdd" v-hasAuth="[$route,'create']">新增</el-button>
        </div>
        <div>
          <el-button icon="el-icon-error" title="清空" @click="doReset">
            <span class="hidden-lg-and-down">清空</span>
          </el-button>
        </div>
      </div>
    </el-header>

    <div class="tit-info" v-if="overTimeNum">
      <i class="el-icon-bell">
        <span class="text-tip">三个月内即将过期用户数有{{overTimeNum}}个，请及时提醒用户延期！</span>
      </i>
    </div>
    <el-main>
      <el-table
          :data="list"
          v-loading.body="listLoading"
          element-loading-text="Loading"
          border fit highlight-current-row
      >
        <el-table-column :label="assertData.appTenantCode" align="center">
          <template slot-scope="scope">{{ scope.row.appTenantCode }}</template>
        </el-table-column>
        <el-table-column :label="assertData.displayName" align="center">
          <template slot-scope="scope">{{ scope.row.displayName }}</template>
        </el-table-column>
        <!-- 联系人名称 -->
        <el-table-column :label="assertData.contactName" align="center">
          <template slot-scope="scope">{{ scope.row.contactName }}</template>
        </el-table-column>
        <!-- 联系人电话 -->
        <el-table-column :label="assertData.contactPhone" align="center">
          <template slot-scope="scope">{{ scope.row.contactPhone }}</template>
        </el-table-column>
        <!-- 联系人邮箱 -->
        <el-table-column :label="assertData.contactEmail" align="center">
          <template slot-scope="scope">{{ scope.row.contactEmail }}</template>
        </el-table-column>
        <!-- systemType: '系统类别', -->
        <el-table-column :label="assertData.systemType" align="center">
          <template slot-scope="scope">{{ showTexts(systemTypes, scope.row.systemType) }}</template>
        </el-table-column>
        <!-- tradeType: '贸易类别',-->
        <el-table-column :label="assertData.tradeType" align="center">
          <template slot-scope="scope">{{ showTexts(tradeTypes, scope.row.tradeType) }}</template>
        </el-table-column>

        <!-- <el-table-column :label="assertData.flagValue" align="center">
          <template slot-scope="scope">
            <span>{{ showTexts(flagValues, scope.row.flagValue) }}</span>
          </template>
        </el-table-column> -->

        <el-table-column :label="assertData.expireDate" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.expireDate | parseTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="assertData.isDisabled" align="center" width="100">
          <template slot-scope="scope">{{ scope.row.isDisabled | parseBool }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="140">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-button type="text" class="operation-btn" v-hasAuth="[$route,'update']" icon="el-icon-edit" @click="doEdit(scope.row)"/>
            </el-tooltip>
            <!-- <el-tooltip content="发送邮件" placement="top">
              <el-button class="operation-btn" style="color: #E6A23C;" type="text" icon="el-icon-message" v-hasAuth="[$route,'send-email']"
                         @click="sendEmail(scope.row)"/>
            </el-tooltip> -->
            <el-tooltip content="启用" placement="top" v-if="scope.row.isDisabled">
              <el-button type="text" icon="el-icon-success" class="operation-btn operation-enable-btn" v-hasAuth="[$route,'switch-enable-status']"
                         @click="doEnable(scope.row)"/>
            </el-tooltip>
            <el-tooltip content="停用" placement="top" v-else>
              <el-button type="text" icon="el-icon-remove-outline" class="operation-btn operation-disable-btn" v-hasAuth="[$route,'switch-enable-status']"
                         @click="doDisable(scope.row)"
              />
            </el-tooltip>
            <el-tooltip content="查看" placement="top">
              <el-button type="text" icon="el-icon-view" class="operation-btn operation-view-btn"
                         @click="doView(scope.row)"/>
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
          :total="query.pagination.itemCount"
      />
    </el-footer>

    <!--新增企业dialog  -->
    <div class="corporation-manage">
      <el-dialog
          :title="dialogTitle[dialogStatus]"
          :visible.sync="dialogVisible"
          :close-on-click-modal="false"
          :close-on-press-escape="false"
          width="80%"
          top="15px"
      >
        <el-row>
          <el-form
              label-position="right"
              label-width="160px"
              status-icon
              :ref="formName"
              :rules="rules"
              :model="corporation"
              size="mini"
          >
            <el-card shadow="hover" :body-style="{ paddingTop: '10px' }" class="box-card">
              <div slot="header">
                <span>基本数据</span>
                <el-tag type="primary" style="margin-left: 20px;">如果没有选择期货，那么期货系统配置数据所有的选项均为非必填</el-tag>
              </div>
              <el-col :span="8">
                <el-form-item :label="assertData.appTenantCode" prop="appTenantCode">
                  <el-input v-model="corporation.appTenantCode" :disabled="isDisabled"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.displayName" prop="displayName">
                  <el-input v-model="corporation.displayName"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="full-width" :label="assertData.tenantType" prop="tenantType">
                  <el-select v-model="corporation.tenantType"
                             filterable
                             clearable
                             placeholder="请选择"
                  >
                    <el-option v-for="(item, index) in corporationTypes"
                               :key="index"
                               :label="item.text"
                               :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.contactName" prop="contactName">
                  <el-input v-model="corporation.contactName"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.contactPhone" prop="contactPhone">
                  <el-input v-model="corporation.contactPhone" type="tel"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.contactEmail" prop="contactEmail"
                              :title="!(dialogStatus === 'add') ? '新增时默认作为管理员邮箱' : ''">
                  <el-input v-model="corporation.contactEmail" type="email"/>
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item :label="assertData.notes">
                  <el-input v-model="corporation.notes" type="textarea" :rows="2"/>
                </el-form-item>
              </el-col>
            </el-card>
            <el-card class="box-card" shadow="hover" :body-style="{ paddingTop: '10px' }">
              <div slot="header">
                <span>权限配置</span>
              </div>
              <el-col :span="8">
                <el-form-item :label="assertData.systemType" prop="systemTypes">
                  <el-select v-model="corporation.systemTypes"
                             filterable
                             clearable
                             multiple
                             placeholder="请选择"
                             class="item-select">
                    <el-option v-for="(item, index) in systemTypes"
                               :key="index"
                               :label="item.text"
                               :value="item.value"/>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- <el-col :span="8">
                <el-form-item
                        :label="assertData.flagValue"
                        prop="flagValues"
                >
                  <el-select
                          v-model="corporation.flagValues"
                          filterable
                          clearable
                          multiple
                          class="item-select"
                  >
                    <el-option
                            v-for="(item, index) in flagValues"
                            :key="index"
                            :label="item.text"
                            :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col> -->
              <el-col :span="8">
                <el-form-item
                        :label="assertData.tradeType"
                        prop="tradeTypes"
                >
                  <el-select
                          v-model="corporation.tradeTypes"
                          filterable
                          clearable
                          multiple
                          placeholder="请选择"
                          class="item-select"
                  >
                    <el-option
                            v-for="(item, index) in tradeTypes"
                            :key="index"
                            :label="item.text"
                            :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.expireDate" prop="expireDate">
                  <el-date-picker class="item-select"
                                  v-model="corporation.expireDate"
                                  align="right"
                                  type="datetime"
                                  placeholder="请选择日期与时间"
                                  :picker-options="expireDatePickerOptions"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="full-width" :label="assertData.futureUserLimit" prop="futureUserLimit">
                  <el-input v-model.number="corporation.futureUserLimit"
                            :max="corporation.spotUserLimit"
                            clearable
                            placeholder
                            type="number"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item class="full-width" :label="assertData.spotUserLimit" prop="spotUserLimit">
                  <el-input v-model.number="corporation.spotUserLimit"
                            :min="corporation.futureUserLimit"
                            clearable
                            placeholder
                            type="number"/>
                </el-form-item>
              </el-col>
              <el-col required="true" :span="8">
                <el-form-item :label="assertData.webserviceSecret" prop="webserviceSecret">
                  <el-input v-model="corporation.webserviceSecret"
                            type="string"
                            min="1"
                            clearable
                            maxlength="16"
                            placeholder>
                    <el-button size="mini"
                               slot="append"
                               icon="el-icon-refresh"
                               @click="applicableRandom()"
                               style="background:#67C23A;color: #fff"/>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                    :label="assertData.isDisabled"
                    prop="isDisabled"
                    v-if="isDisabled">
                  <el-switch style="min-height: 33px;" v-model="corporation.isDisabled"/>
                </el-form-item>
              </el-col>
              <div class="clear"></div>
              <!-- 可用服务器信息 -->
              <div class="sever-info-box">
                <div class="title-info">可用服务器信息</div>
                <div class="sever-title">
                  <span class="info-text">{{assertData.serverInfo}}</span>
                  <span class="btn-box">
                    <el-button plain circle round class="add-btn"
                               size="mini" type="primary" icon="el-icon-plus"
                               @click="addSeverInfoLine()"/>
                  </span>
                </div>
                <div class="line-box" v-for="(item, index) in severInfoArr" :key="index">
                  <span class="info-text">
                      <el-input v-model="severInfoArr[index]" placeholder="请输入"/>
                  </span>
                  <span class="btn-box">
                    <el-button plain circle round
                               class="add-btn" size="mini" type="warning"
                               icon="el-icon-minus"
                               @click="reduceSeverInfoLine(index)"/>
                  </span>
                </div>
              </div>
            </el-card>
            <el-card shadow="hover"
                     :body-style="{ paddingTop: '10px' }"
                     class="box-card"
                     v-if="isSaaSTenant">
              <div slot="header">
                <span>现货/清算系统配置数据</span>
              </div>
              <el-col :span="8">
                <el-form-item :label="assertData.dbInstanceId" prop="dbInstanceId">
                  <el-select v-model="corporation.dbInstanceId"
                             filterable
                             clearable
                             placeholder="请选择"
                             class="item-select"
                             :disabled="isDisabled">
                    <el-option v-for="(item, index) in dbInstances"
                               :key="index"
                               :label="item.instanceServerName"
                               :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.bmSiteURL" prop="bmSiteURL">
                  <el-input v-model="corporation.bmSiteURL" placeholder="http:// 或 https://"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.webSiteURL" prop="webSiteURL">
                  <el-input v-model="corporation.webSiteURL" placeholder="http:// 或 https://"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.marketFeedSiteURL" prop="marketFeedSiteURL">
                  <el-input v-model="corporation.marketFeedSiteURL" placeholder="http:// 或 https://"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.settlementSiteURL" prop="settlementSiteURL">
                  <el-input v-model="corporation.settlementSiteURL" placeholder="http:// 或 https://"/>
                </el-form-item>
              </el-col>
            </el-card>
            <el-card shadow="hover" class="box-card" :body-style="{ paddingTop: '10px' }" v-if="isSaaSTenant">
              <div slot="header">
                <span>期货系统配置数据</span>
              </div>
              <el-col :span="8">
                <el-form-item :label="assertData.tradingSystemApiUrl" prop="tradingSystemApiUrl">
                  <el-input v-model="corporation.tradingSystemApiUrl"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureServiceAddress" prop="futureServiceAddress">
                  <el-input v-model="corporation.futureServiceAddress"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureExchangeServicePort" prop="futureExchangeServicePort">
                  <el-input v-model.number="corporation.futureExchangeServicePort"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureStrategyServicePort" prop="futureStrategyServicePort">
                  <el-input v-model.number="corporation.futureStrategyServicePort"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureBMServicePort" prop="futureBMServicePort">
                  <el-input v-model.number="corporation.futureBMServicePort"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureDbIPAddress" prop="futureDbIPAddress">
                  <el-input v-model="corporation.futureDbIPAddress"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureDbName" prop="futureDbName">
                  <el-input v-model="corporation.futureDbName"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureDbTableName" prop="futureDbTableName">
                  <el-input v-model="corporation.futureDbTableName"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureDbUserName" prop="futureDbUserName">
                  <el-input v-model="corporation.futureDbUserName"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="assertData.futureDbUserPwd" prop="futureDbUserPwd">
                  <el-input v-model="corporation.futureDbUserPwd"/>
                </el-form-item>
              </el-col>
            </el-card>
          </el-form>
        </el-row>
        <span slot="footer" class="dialog-footer">
            <el-button @click="doCancel" :disabled="isLoading">取消</el-button>
            <el-button type="primary" @click="doValidateSomePropertyChanges" :loading="isLoading">保存</el-button>
        </span>
        <el-dialog width="30%"
                   title="提示"
                   :visible.sync="innerVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   append-to-body>
          <el-alert show-icon
                    title="由于您新增或修改了授权相关信息，请输入密码提交并下载授权信息"
                    type="warning"
                    :closable="false">
          </el-alert>
          <el-input class="mt_20"
                    type="textarea"
                    :rows="8"
                    placeholder="请输入"
                    v-model="dialogTextarea">
          </el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="innerCancelBtn()">取 消</el-button>
            <el-button type="success" @click="doSaveAndDownLoad()">提交并下载授权</el-button>
          </div>
        </el-dialog>
      </el-dialog>
    </div>

    <div>
      <el-drawer custom-class="drawer-scroll"
                 title="详情"
                 size="40%"
                 :visible.sync="showDetail"
                 direction="rtl"
      >
        <div style="padding: 0 20px;">
          <el-form label-position="left"
                   inline
                   class="user-table-expand"
                   label-width="140px"
                   size="mini"
          >
            <el-divider>基本数据</el-divider>
            <el-form-item :label="assertData.appTenantCode">
              <span>{{ detailData.appTenantCode }}</span>
            </el-form-item>
            <el-form-item :label="assertData.displayName">
              <span>{{ detailData.displayName }}</span>
            </el-form-item>
            <el-form-item :label="assertData.tenantType">
              <span>{{ detailData.tenantType | mapKV(corporationTypes) }}</span>
            </el-form-item>
            <el-form-item :label="assertData.contactName">
              <span>{{ detailData.contactName }}</span>
            </el-form-item>
            <el-form-item :label="assertData.contactPhone">
              <span>{{ detailData.contactPhone }}</span>
            </el-form-item>
            <el-form-item :label="assertData.contactEmail">
              <span>{{ detailData.contactEmail }}</span>
            </el-form-item>
            <el-form-item :label="assertData.notes">
              <span>{{ detailData.notes }}</span>
            </el-form-item>
            <el-divider>权限配置</el-divider>
            <el-form-item :label="assertData.systemType">
              <span>{{ showTexts(systemTypes, detailData.systemType) }}</span>
            </el-form-item>
            <el-form-item :label="assertData.expireDate">
              <span>{{ detailData.expireDate | parseTime }}</span>
            </el-form-item>
            <el-form-item :label="assertData.tradeType">
              <span>{{showTexts(tradeTypes, detailData.tradeType)}}</span>
            </el-form-item>
            <el-form-item :label="assertData.futureUserLimit">
              <span>{{detailData.futureUserLimit}}</span>
            </el-form-item>
            <el-form-item :label="assertData.spotUserLimit">
              <span>{{detailData.spotUserLimit}}</span>
            </el-form-item>
            <el-form-item :label="assertData.webserviceSecret">
              <span>{{detailData.webserviceSecret}}</span>
            </el-form-item>
            <el-form-item :label="assertData.isDisabled">
              <span>{{ detailData.isDisabled | parseBool }}</span>
            </el-form-item>
            <el-form-item :label="assertData.serverInfo" class="el-form-one-line">
              <el-input class="line-info"
                        type="textarea"
                        disabled
                        :rows="4"
                        v-for="(item, index) in hardwareIds"
                        :key="index"
                        v-model="hardwareIds[index]"/>
            </el-form-item>
            <template v-if="detailData.tenantType === 1">
              <el-divider>现货/清算系统配置数据</el-divider>
              <el-form-item :label="assertData.dbInstanceId" class="el-form-one-line">
                <span>{{detailData.dbInstanceId | mapKV(dbInstances, 'instanceServerName', 'id') }}</span>
              </el-form-item>
              <el-form-item :label="assertData.bmSiteURL" class="el-form-one-line">
                <span>{{ detailData.bmSiteURL }}</span>
              </el-form-item>
              <el-form-item :label="assertData.webSiteURL" class="el-form-one-line">
                <span>{{ detailData.webSiteURL }}</span>
              </el-form-item>
              <el-form-item :label="assertData.marketFeedSiteURL" class="el-form-one-line">
                <span>{{ detailData.marketFeedSiteURL }}</span>
              </el-form-item>
              <el-form-item :label="assertData.settlementSiteURL" class="el-form-one-line">
                <span>{{ detailData.settlementSiteURL }}</span>
              </el-form-item>
            </template>
            <template v-if="detailData.tenantType === 1">
              <el-divider>期货系统配置数据</el-divider>
              <el-form-item :label="assertData.tradingSystemApiUrl" class="el-form-one-line">
                <span>{{ detailData.tradingSystemApiUrl }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureServiceAddress" class="el-form-one-line">
                <span>{{ detailData.futureServiceAddress }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureExchangeServicePort">
                <span>{{ detailData.futureExchangeServicePort }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureStrategyServicePort">
                <span>{{ detailData.futureStrategyServicePort }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureBMServicePort">
                <span>{{ detailData.futureBMServicePort }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureDbIPAddress">
                <span>{{ detailData.futureDbIPAddress }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureDbName">
                <span>{{ detailData.futureDbName }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureDbTableName">
                <span>{{ detailData.futureDbTableName }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureDbUserName">
                <span>{{ detailData.futureDbUserName }}</span>
              </el-form-item>
              <el-form-item :label="assertData.futureDbUserPwd">
                <span>{{ detailData.futureDbUserPwd }}</span>
              </el-form-item>
            </template>
          </el-form>
        </div>
      </el-drawer>
    </div>
  </el-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import {
    add,
    addAndDownLoad,
    disable,
    enable,
    getInstances,
    industryCategories,
    list as getList,
    sendEmail,
    update,
    updateAndDownLoad
  } from '../../api/corporationManage';
  import { getEnums } from '../../api/enums';
  import { YOrNList } from '../../assets/enums';
  import { getRandom } from '../../utils/index';

  const loadingOption = {
    lock: true,
    text: '加载中',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  };
  let loadingInstance;

  export default {
    name: 'CorporationManage',
    data() {
      // 自定义 校验期货用户数
      let validateFutureUserLimit = (rule, value, callback) => {

        const { spotUserLimit, futureUserLimit } = { ...this.corporation };
        let futureUserLimitFlag = false;
        let spotUserLimitFlag = false;
        if (!spotUserLimit && !value) {
          return callback();
        }
        let flagNum = futureUserLimit * 1 > 0 && spotUserLimit * 1 < futureUserLimit * 1; //为真不满足

        if ((spotUserLimit && spotUserLimit.length === 0 && value && value.length > 0) || (value && value.length === 0 && spotUserLimit && spotUserLimit.length > 0) || flagNum) {
          futureUserLimitFlag = true;
          spotUserLimitFlag = true;
        } else {
          futureUserLimitFlag = false;
          spotUserLimitFlag = false;
        }

        if (futureUserLimitFlag) {
          callback(new Error('期货用户数和总用户数只能同时有值，或者同时为空。且总用户数需要大于期货用户数'));
        } else {
          callback();
        }
        this.rules1.spotUserLimit[0].required = spotUserLimitFlag;
        this.rules1.futureUserLimit[0].required = futureUserLimitFlag;
      };
      // 自定义 校验总用户数
      let validateSpotUserLimit = (rule, value, callback) => {
        const { spotUserLimit, futureUserLimit } = { ...this.corporation };
        let futureUserLimitFlag = false;
        let spotUserLimitFlag = false;
        if (!futureUserLimit && !value) {
          return callback();
        }
        let flagNum = futureUserLimit * 1 > 0 && spotUserLimit * 1 < futureUserLimit * 1; //为真不满足
        if ((spotUserLimit.length === 0 && value.length > 0) || (value.length === 0 && spotUserLimit.length > 0) || flagNum) {
          futureUserLimitFlag = true;
          spotUserLimitFlag = true;
        } else {
          futureUserLimitFlag = false;
          spotUserLimitFlag = false;
        }
        if (futureUserLimitFlag) {
          callback(new Error('期货用户数和总用户数只能同时有值，或者同时为空。且总用户数需要大于期货用户数'));
        } else {
          callback();
        }
        this.rules1.spotUserLimit[0].required = spotUserLimitFlag;
        this.rules1.futureUserLimit[0].required = futureUserLimitFlag;
      };
      return {
        expireDatePickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        dbInstances: [],
        list: [],
        listLoading: false,
        query: {
          //   appTenantId: '',
          appTenantCodeEquals: '',
          displayNameContains: '',
          isDisabled: '',
          expireDateRangeStart: '',
          expireDateRangeEnd: '',
          pagination: {
            currentPage: 1,
            pageSize: 10,
            itemCount: 0
          }
        },
        formName: 'corporationForm',
        dialogVisible: false,
        showDetail: false,
        rules: {},
        rules1: {
          appTenantCode: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          displayName: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          tenantType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          tradeTypes: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          expireDate: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          dbInstanceId: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          contactEmail: [
            {
              required: true,
              message: '邮箱地址不能为空',
              trigger: 'blur'
            },
            {
              type: 'email',
              message: '请输入正确格式的邮箱地址，例如：xxx@xxx.com',
              trigger: [ 'blur', 'change' ]
            }
          ],
          bmSiteURL: [
            {
              type: 'url',
              message: '必须是合法的URL格式',
              trigger: 'blur'
            }
          ],
          webSiteURL: [
            {
              type: 'url',
              message: '必须是合法的URL格式',
              trigger: 'blur'
            }
          ],
          settlementSiteURL: [
            {
              type: 'url',
              message: '必须是合法的URL格式',
              trigger: 'blur'
            }
          ],
          marketFeedSiteURL: [
            {
              type: 'url',
              message: '必须是合法的URL格式',
              trigger: [ 'blur', 'change' ]
            }
          ],
          tradingSystemApiUrl: [
            {
              type: 'url',
              message: '必须是合法的URL格式',
              trigger: 'blur'
            }
          ],
          futureExchangeServicePort: [
            { type: 'number', message: '必须是数字', trigger: 'blur' }
          ],
          futureStrategyServicePort: [
            { type: 'number', message: '必须是数字', trigger: 'blur' }
          ],
          futureBMServicePort: [
            { type: 'number', message: '必须是数字', trigger: 'blur' }
          ],
          contactName: [ { required: true, message: '不能为空' } ],
          contactPhone: [ { required: true, message: '不能为空' } ],
          systemTypes: [ { required: true, message: '不能为空' } ],
          webserviceSecret: [ { required: true, message: '不能为空', trigger: 'change' } ],
          spotUserLimit: [ {
            validator: validateSpotUserLimit,
            required: false,
            message: '期货用户数和总用户数只能同时有值，或者同时为空。且总用户数需要大于期货用户数',
            trigger: 'blur'
          } ],
          futureUserLimit: [ {
            validator: validateFutureUserLimit,
            required: false,
            message: '期货用户数和总用户数只能同时有值，或者同时为空。且总用户数需要大于期货用户数',
            trigger: 'blur'
          } ],
        },
        rules2: {
          tradingSystemApiUrl: [
            { required: true, message: '不能为空' },
            {
              type: 'url',
              message: '必须是合法的URL格式',
              trigger: 'blur'
            }
          ],
          futureServiceAddress: [ { required: true, message: '不能为空' } ],
          futureExchangeServicePort: [
            { required: true, message: '不能为空' },
            { type: 'number', message: '必须是数字', trigger: 'blur' }
          ],
          futureStrategyServicePort: [
            { required: true, message: '不能为空' },
            { type: 'number', message: '必须是数字', trigger: 'blur' }
          ],
          futureBMServicePort: [
            { required: true, message: '不能为空' },
            { type: 'number', message: '必须是数字', trigger: 'blur' }
          ],
          futureTradersDefaultPwd: [
            { required: true, message: '不能为空' }
          ],
          futureDbTableName: [ { required: true, message: '不能为空' } ],
          futureDbIPAddress: [ { required: true, message: '不能为空' } ],
          futureDbName: [ { required: true, message: '不能为空' } ],
          futureDbUserName: [ { required: true, message: '不能为空' } ],
          futureDbUserPwd: [ { required: true, message: '不能为空' } ],
        },
        corporation: {
          appTenantCode: '',
          displayName: '',
          tenantType: '',
          expireDate: '',
          dbInstanceId: '',
          bmSiteURL: '',
          webSiteURL: '',
          settlementSiteURL: '',
          marketFeedSiteURL: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          isDisabled: '',
          tradingSystemApiUrl: '',
          flagValues: [],
          flagValue: null,
          tradeTypes: [],
          tradeType: null,
          systemType: null,
          systemTypes: [],
          futureServiceAddress: null,
          futureExchangeServicePort: null,
          futureStrategyServicePort: null,
          futureBMServicePort: null,
          futureTradersDefaultPwd: null,
          futureDbTableName: null,
          futureDbIPAddress: null,
          futureDbName: null,
          futureDbUserName: null,
          futureDbUserPwd: null,
          futureUserLimit: '',
          spotUserLimit: '',
          webserviceSecret: '',
          severInfoArr: []
        },
        oldCorporation: {},
        defaultCorporation: {
          appTenantCode: '',
          displayName: '',
          tenantType: '',
          expireDate: '',
          dbInstanceId: '',
          bmSiteURL: '',
          webSiteURL: '',
          settlementSiteURL: '',
          marketFeedSiteURL: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          isDisabled: '',
          tradingSystemApiUrl: '',
          flagValues: [],
          flagValue: null,
          tradeTypes: [],
          tradeType: null,
          systemType: null,
          systemTypes: [],
          futureServiceAddress: null,
          futureExchangeServicePort: null,
          futureStrategyServicePort: null,
          futureBMServicePort: null,
          futureTradersDefaultPwd: null,
          futureDbTableName: null,
          futureDbIPAddress: null,
          futureDbName: null,
          futureDbUserName: null,
          futureDbUserPwd: null,
          futureUserLimit: '',
          spotUserLimit: '',
          webserviceSecret: '',
          severInfoArr: [],
        },
        dialogStatus: '',
        dialogTitle: {
          add: '新增',
          update: '编辑'
        },
        pwdType: 'password',
        isLoading: false,
        isOperating: false,
        tradeTypes: [], // 交易类别
        systemTypes: [], // 系统类别
        corporationTypes: [], // 企业类型
        assertData: {
          appTenantCode: '企业代码',
          displayName: '企业名称',
          tenantType: '企业类型',
          expireDate: '过期时间',
          dbInstanceId: '服务器实例',
          bmSiteURL: '管理平台URL',
          webSiteURL: '贸易业务平台URL',
          settlementSiteURL: '风控清算平台URL',
          marketFeedSiteURL: '市场行情平台URL',
          contactName: '联系人名称',
          contactPhone: '联系人电话',
          contactEmail: '联系人邮箱',
          isDisabled: '是否停用',
          tradingSystemApiUrl: '期货系统对接URL',
          // flagValue: '行业类别集合',
          tradeType: '业务类型',
          systemType: '系统类别',
          futureServiceAddress: '期货服务器地址',
          futureExchangeServicePort: '交易服务器端口号',
          futureStrategyServicePort: '策略服务器端口号',
          futureBMServicePort: '管理端服务器端口号',
          // futureTradersDefaultPwd: "登录账户默认密码",
          futureDbTableName: '数据库表',
          futureDbIPAddress: '数据库IP地址',
          futureDbName: '公共数据库名称',
          futureDbUserName: '数据库访问用户',
          futureDbUserPwd: '数据库访问密码',
          futureUserLimit: '期货用户数',
          spotUserLimit: '总用户数',
          webserviceSecret: '随机密码',
          serverInfo: '服务器信息',
          notes: '备注',
        },
        detailData: {
          appTenantCode: '',
          displayName: '',
          tenantType: '',
          expireDate: '',
          dbInstanceId: '',
          bmSiteURL: '',
          webSiteURL: '',
          settlementSiteURL: '',
          marketFeedSiteURL: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          isDisabled: '',
          tradingSystemApiUrl: '',
          flagValue: '',
          tradeType: '',
          systemType: '',
          futureServiceAddress: '',
          futureExchangeServicePort: '',
          futureStrategyServicePort: '',
          futureBMServicePort: '',
          // futureTradersDefaultPwd: "",
          futureDbTableName: '',
          futureDbIPAddress: '',
          futureDbName: '',
          futureDbUserName: '',
          futureDbUserPwd: '',
          notes: ''
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
          },
          severInfoArr: []
        },
        severInfoArr: [],
        filename: '权限配置文件',
        innerVisible: false,
        dialogTextarea: '',
        overTimeNum: '',
        hardwareIds: []
      };
    },
    async created() {
      await this.fetChIndustryCategories();
      await this.fetchEnums();
      await this.fetchDbInstances();
      await this.fetchData();
      this.rules = { ...this.rules1 };
    },
    watch: {
      'corporation.systemTypes': function (newVal) {
        let hasFuture = (newVal || []).indexOf(1) > -1;
        if (hasFuture) {
          this.rules = { ...this.rules1, ...this.rules2 };
        } else {
          this.rules = { ...this.rules1 };
        }
        this.$nextTick(() => {
          this.$refs[this.formName].clearValidate([
            'appTenantCode',
            'displayName',
            'tenantType',
            'contactName',
            'contactPhone',
            'contactEmail',
            'expireDate',
            'dbInstanceId',
            'systemTypes',
            'tradingSystemApiUrl',
            'futureServiceAddress',
            'futureExchangeServicePort',
            'futureStrategyServicePort',
            'futureBMServicePort',
            // "futureTradersDefaultPwd",
            'futureDbTableName',
            'futureDbIPAddress',
            'futureDbName',
            'futureDbUserName',
            'futureDbUserPwd',
            'webserviceSecret',
            'futureUserLimit',
            'spotUserLimit',
            'tradeTypes',
          ])
        })
      },
    },
    computed: {
      ...mapGetters([ 'userInfo' ]),
      isDisabled() {
        return this.dialogStatus === 'update';
      },
      isAdmin() {
        return this.userInfo.isAdmin;
      },
      isSaaSTenant() {
        return this.corporation.tenantType === 1;
      },
      yOrNList() {
        return YOrNList;
      }
    },
    methods: {
      doSearch() {
        this.query.pagination.currentPage = 1;
        this.fetchData();
      },

      doReset() {
        this.query = Object.assign({}, this.defaultQuery);
      },

      async fetChIndustryCategories() {
        const { data } = await industryCategories().catch();
        this.flagValues = data && data.map(t => {
          return {
            text: t.name,
            value: t.flag
          };
        });
      },

      async fetchEnums() {
        const { data } = await getEnums({
          enumTypeNames: [
            'simpleTradeType',
            'TenantInitPrivilegeGroup',
            'QcTenantType'
          ]
        })
        data.simpleTradeType.map(item => {
          if(item.text == '内贸'){item.text = '国内'}
          if(item.text == '外贸'){item.text = '国际'}
        })
        this.tradeTypes = data.simpleTradeType
        this.systemTypes = data.tenantInitPrivilegeGroup
        this.corporationTypes = data.qcTenantType
      },

      async fetchDbInstances() {
        const { data } = await getInstances();
        this.dbInstances = data.list;
      },

      async fetchData() {
        this.listLoading = true;
        const { data } = await getList(this.query).catch(() => {
          this.listLoading = false;
        });
        this.listLoading = false;
        this.overTimeNum = data.expiringAuthrazionCount;
        const { list, pagination } = data.result;
        this.list = list;
        this.list.forEach(d => {
          d.flagValues = this.getValues(this.flagValues, d.flagValue);
          d.systemTypes = this.getValues(this.systemTypes, d.systemType);
          d.tradeTypes = this.getValues(this.tradeTypes, d.tradeType);
        });
        this.query.pagination.currentPage = pagination.currentPage;
        this.query.pagination.pageSize = pagination.pageSize;
        this.query.pagination.itemCount = pagination.itemCount;
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
        this.isLoading = false;
        this.severInfoArr = [];
        this.corporation = { ...this.defaultCorporation };
        this.$nextTick().then(() => {
          this.$refs[this.formName].clearValidate([
            'appTenantCode',
            'displayName',
            'contactName',
            'contactPhone',
            'contactEmail',
            'expireDate',
            'dbInstanceId',
            'systemTypes',
            'severInfoArr',
            'webserviceSecret',
          ]);
        });
      },
      doEdit(row) {
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
        this.dialogStatus = 'update';
        this.dialogVisible = true;
        this.corporation = { ...row };
        this.oldCorporation = { ...row };
        this.severInfoArr = row.hardwareIds ? row.hardwareIds.split('&') : [];
      },

      doEnable(row) {
        if (row.isDisabled) {
          this.$confirm(
            `确认启用企业：ID：${row.appTenantId}【${row.displayName}】？`,
            '提示',
            {
              type: 'warning',
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            }
          )
            .then(() => {
              this.isOperating = true;
              loadingInstance = this.$loading(loadingOption);
              enable(row.appTenantId)
                .then(response => {
                  if (response.status === 200) {
                    this.isOperating = false;
                    loadingInstance.close();
                    this.$message({
                      type: 'success',
                      message: '启用成功'
                    });
                    this.fetchData();
                  }
                })
                .catch(() => {
                  this.isOperating = false;
                  loadingInstance.close();
                });
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
        }
      },

      doDisable(row) {
        if (!row.isDisabled) {
          this.$confirm(
            `确认禁用企业：ID：${row.appTenantId}【${row.displayName}】？`,
            '提示',
            {
              type: 'warning',
              confirmButtonText: '确认',
              cancelButtonText: '取消'
            }
          )
            .then(() => {
              this.isOperating = true;
              loadingInstance = this.$loading(loadingOption);
              disable(row.appTenantId)
                .then(response => {
                  if (response.status === 200) {
                    this.isOperating = false;
                    loadingInstance.close();
                    this.$message({
                      type: 'success',
                      message: '禁用成功'
                    });
                    this.fetchData();
                  }
                })
                .catch(() => {
                  this.isOperating = false;
                  loadingInstance.close();
                });
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
        }
      },

      doView(row) {
        this.showDetail = true;
        const data = Object.assign({}, row);
        this.hardwareIds = data.hardwareIds ? data.hardwareIds.split('&') : [];
        this.detailData = { ...this.detailData, ...data };
      },

      doCancel() {
        this.dialogVisible = false;
        if (this.$refs[this.formName]) {
          this.$refs[this.formName].resetFields();
        }
      },

      sendEmail(row) {
        this.$confirm(`发送邮件到邮箱：${row.contactEmail}？`, '提示', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        })
          .then(() => {
            this.isOperating = true;
            loadingInstance = this.$loading(loadingOption);
            sendEmail(row.appTenantId)
              .then(response => {
                if (response.status === 200) {
                  this.isOperating = false;
                  loadingInstance.close();
                  this.$message({
                    type: 'success',
                    message: '邮件发送成功'
                  });
                }
              })
              .catch(() => {
                this.isOperating = false;
                loadingInstance.close();
              });
          })
          .catch(() => {
            this.$message({
              type: 'warning',
              message: '取消发送'
            });
          });
      },

      doValidateSomePropertyChanges() {
        const { futureUserLimit, spotUserLimit, webserviceSecret, hardwareIds, expireDate } = { ...this.oldCorporation };
        let severInfo = this.severInfoArr.length ? this.severInfoArr.join('&') : null;
        let isValid = Number(futureUserLimit) === Number(this.corporation.futureUserLimit) &&
          Number(spotUserLimit) === Number(this.corporation.spotUserLimit) &&
          webserviceSecret === this.corporation.webserviceSecret &&
          hardwareIds === severInfo &&
          expireDate === this.corporation.expireDate;
        // 服务器信息有的话必须都填 没有不提示
        if (this.severInfoArr.some(v => !v)) {
          this.$message.error('服务器信息不能有空行');
          return;
        }
        // 判断 任意一个（过期时间  过期用户数  总用户数  租户密钥 可用服务信息）变化 ，则弹框输入密码并下载（即调用doSaveAddDownLoad），否则直接保存（即调用dosave）
        if (this.dialogStatus === 'add' || (this.dialogStatus === 'update' && !isValid)) {
          this.$refs[this.formName].validate(valid => {
            if (valid) {
              this.dialogTextarea = '';
              this.innerVisible = true;
            } else {
              return false;
            }
          });
        } else {
          this.doSave();
        }
      },

      doSave() {
        let t = { ...this.corporation };
        t.flagValue = this.sum(t.flagValues);
        t.systemType = this.sum(t.systemTypes);
        t.tradeType = this.sum(t.tradeTypes);
        t.hardwareIds = this.severInfoArr;
        this.$refs[this.formName].validate(valid => {
          if (valid) {
            this.isLoading = true;
            if (this.dialogStatus === 'add') {
              delete t.isDisabled;
              add(t)
                .then(response => {
                  if (response.status) {
                    this.isLoading = false;
                    this.dialogVisible = false;
                    this.$refs[this.formName].resetFields();
                    this.$message({
                      type: 'success',
                      message: '新增成功'
                    });
                    this.fetchData();
                  }
                })
                .catch(() => {
                  this.isLoading = false;
                });

            } else {
              update(t.appTenantId, t)
                .then(response => {
                  if (response.status) {
                    this.isLoading = false;
                    this.dialogVisible = false;
                    this.$refs[this.formName].resetFields();
                    this.$message({
                      type: 'success',
                      message: '编辑成功'
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

      doSaveAndDownLoad() {
        let t = { ...this.corporation };
        t.flagValue = this.sum(t.flagValues);
        t.systemType = this.sum(t.systemTypes);
        t.tradeType = this.sum(t.tradeTypes);
        t.hardwareIds = this.severInfoArr;
        this.isLoading = true;
        if (!this.dialogTextarea) {
          this.$message({
            type: 'error',
            message: '密码不能为空'
          });
          return;
        }
        if (this.dialogStatus === 'add') {
          delete t.isDisabled;

          t.xmlStringRsaPrivateKey = this.dialogTextarea;
          addAndDownLoad(t)
            .then(response => {
              if (response.status) {
                this.isLoading = false;
                this.dialogVisible = false;
                this.$refs[this.formName].resetFields();
                this.$message({
                  type: 'success',
                  message: '新增成功'
                });
                this.download(this.filename, response);
                this.fetchData();
              }
            })
            .catch(() => {
              this.isLoading = false;
            });
        } else {
          t.xmlStringRsaPrivateKey = this.dialogTextarea;
          updateAndDownLoad(t.appTenantId, t)
            .then(response => {
              if (response.status) {
                this.isLoading = false;
                this.dialogVisible = false;
                this.$refs[this.formName].resetFields();
                this.$message({
                  type: 'success',
                  message: '编辑成功'
                });
                this.dialogTextarea = '';
                this.innerVisible = false;
                this.download(this.filename, response);
                this.fetchData();
              }
            })
            .catch(() => {
              this.isLoading = false;
            });
        }
      },

      innerCancelBtn() {
        this.dialogTextarea = '';
        this.innerVisible = false;
        this.isLoading = false;
      },

      sum(arr) {
        return arr.reduce((acc, cur) => acc + cur, 0);
      },

      showTexts(array, value) {
        if (!array) return;
        if (!(Array.isArray(array) && array.length)) return;
        let selectedValues = array.filter(d => {
          return (+d.value & +value) !== 0;
        });
        let selectTexts = selectedValues.map(d => {
          let item =
            array.find(r => {
              return r.value === d.value;
            }) || {};
          return item.text || null;
        });
        selectTexts = selectTexts.filter(d => {
          return !!d;
        });
        return selectTexts.join('，');
      },

      getValues(array, value) {
        return array
          .filter(d => {
            return (+d.value & +value) !== 0;
          })
          .map(d => {
            return d.value;
          });
      },

      applicableRandom() {
        this.$set(this.corporation, 'webserviceSecret', getRandom(true, 8, 8));
      },

      addSeverInfoLine() {
        this.severInfoArr.push('');
      },

      reduceSeverInfoLine(i) {
        this.severInfoArr.splice(i, 1);
      },

      download(filename, response) {
        const fileName = decodeURIComponent(response.request.getResponseHeader('Content-Disposition').split(';')[1].split('\'\'')[1]);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response.data));
        element.setAttribute('download', fileName || filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        this.innerVisible = false;
        this.dialogTextarea = '';
      }
    }
  };
</script>

<style>
  .user-table-expand {
    font-size: 0;
  }

  .user-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .user-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .user-table-expand .el-form-one-line {
    width: 100%;
  }

  .corporation-manage .el-dialog__body {
    padding: 0 20px;
  }

  .drawer-scroll {
    overflow: auto;
  }
</style>

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

  .operation-enable-btn {
    color: #67c23a;
  }

  .operation-disable-btn {
    color: #f56c6c;
  }

  .box-card {
    margin: 5px 0;
  }

  .clear {
    clear: both;
  }

  .sever-info-box {
    width: 88%;
    /* height: 50px; */
    /* border: 1px solid #f00; */
    margin: 0 auto;
  }

  .sever-title {
    width: 100%;
    height: 40px;
    background: #f1f1f1;
    border: 1px solid #ccc;
  }

  .title-info {
    width: 100%;
    height: 40px;
    line-height: 40px;
  }

  .info-text {
    width: 90%;
    line-height: 40px;
    display: inline-block;
    border-right: 1px solid #ccc;
    text-align: center;

  }

  .btn-box {
    width: 10%;
    display: inline-block;
    text-align: center
  }

  .line-box {
    width: 100%;
    height: 40px;
    line-height: 40px;
    border: 1px solid #ccc;
    border-top: none;
  }

  .line-box:last-child {
    border-top: none;
  }

  .tit-info {
    width: 98%;
    margin: 0 auto;
    height: 40px;
    line-height: 40px;
    text-align: right;
    font-size: 14px;
    color: #666;
    margin-bottom: -20px;
  }

  .text-tip {
    float: right;
    color: #f56c6c;
  }

  .line-info {
    width: 100%;
    line-height: 6px;
  }

  .mt_20 {
    margin-top: 20px;
  }
</style>
