<template>
    <div>
        <div>
            <qc-collapse>
                <Row type="flex" :gutter="16">
                    <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
                        <Select
                            placeholder="法人"
                            filterable
                            clearable
                            v-model="query.corporation"
                        >
                            <Option
                                v-for="(item, index) in commonData.corporations"
                                :label="item.text"
                                :value="item.code"
                                :key="index"
                                >{{ item.code }} - {{ item.text }}</Option
                            >
                        </Select>
                    </Col>
                    <Col :lg="6" :sm="12" :xs="24" class-name="margin-bottom-10">
                        <Select
                            placeholder="资金账户"
                            filterable
                            clearable
                            v-model="query.agentId"
                        >
                            <Option
                                v-for="(item, index) in commonData.tradeAccounts"
                                :label="item.text"
                                :value="item.code"
                                :key="index"
                                >{{ item.code }} - {{ item.text }}</Option
                            >
                        </Select>
                    </Col>
                </Row>
            </qc-collapse>

            <Row type="flex" justify="space-between" :gutter="5">
                <Col class-name="margin-bottom-10">
                    <p style="line-height: 32px; color: #2d8cf0;">
                        最后刷新时间：{{
                            utils.formatDate(
                                lastUpdateTime,
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        }}
                    </p>
                </Col>
                <Col class-name="margin-bottom-10">
                    <Button
                        icon="md-close-circle"
                        @click="resetQuery"
                        class="margin-right-3"
                        >清空</Button
                    >
                    <Button
                        type="primary"
                        icon="md-search"
                        class="margin-right-3"
                        @click="onSearch"
                        >搜索</Button
                    >
                </Col>
            </Row>
        </div>
        <div>
            <Table
                size="small"
                border
                ref="table"
                class="margin-bottom-10"
                :loading="tableLoading"
                :columns="columns"
                v-maxHeight
                bottomDistance="70"
                :data="list"
            ></Table>
        </div>
    </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
export default {
    data() {
        return {
            commonData: {},
            query: {},
            list: [],
            tableLoading: false,
            columns: [
                {
                    title: "法人",
                    key: "corporation",
                    align: "center",
                    fixed: 'left',
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "span",
                            utils.showText(
                                this.commonData.corporations,
                                params.row.corporation,
                                null,
                                "code"
                            )
                        );
                    }
                },
                {
                    title: "资金账户",
                    key: "agentId",
                    align: "center",
                    fixed: 'left',
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "span",
                            utils.showText(
                                this.commonData.tradeAccounts,
                                params.row.agentId,
                                null,
                                "code"
                            )
                        );
                    }
                },
                {
                    title: "投资者账号",
                    key: "investorAccount",
                    align: "center",
                    minWidth: 120
                },
                {
                    title: "可用资金",
                    key: "availableCash",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.availableCash
                                }
                            },
                        )
                    }
                },
                {
                    title: "冻结保证金",
                    key: "frozenMargin",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.frozenMargin
                                }
                            },
                        )
                    }
                },
                {
                    title: "平仓盈亏",
                    key: "closeProfit",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.closeProfit
                                }
                            },
                        )
                    }
                },
                {
                    title: "上次存款金额",
                    key: "preDeposit",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.preDeposit
                                }
                            },
                        )
                    }
                },
                {
                    title: "更新时间",
                    key: "updateTime",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "span",
                            utils.formatDate(
                                params.row.updateTime,
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        );
                    }
                },
                {
                    title: "期货结算准备金",
                    key: "settlementReserve",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.settlementReserve
                                }
                            },
                        )
                    }
                },
                {
                    title: "可取资金",
                    key: "withdrawQuota",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.withdrawQuota
                                }
                            },
                        )
                    }
                },
                {
                    title: "入金金额",
                    key: "cashDeposit",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.cashDeposit
                                }
                            },
                        )
                    }
                },
                {
                    title: "出金金额",
                    key: "withdrawCash",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.withdrawCash
                                }
                            },
                        )
                    }
                },
                {
                    title: "占用保证金",
                    key: "exchangeMargin",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.exchangeMargin
                                }
                            },
                        )
                    }
                },
                {
                    title: "质押金额",
                    key: "mortgage",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.mortgage
                                }
                            },
                        )
                    }
                },
                {
                    title: "手续费",
                    key: "commission",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.commission
                                }
                            },
                        )
                    }
                },
                {
                    title: "冻结手续费",
                    key: "frozenCommission",
                    align: "center",
                    minWidth: 120,
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.frozenCommission
                                }
                            },
                        )
                    }
                },
                {
                    title: "冻结资金",
                    key: "frozenCash",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.frozenCash
                                }
                            },
                        )
                    }
                },
                {
                    title: "浮动盈亏",
                    key: "positionProfit",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.positionProfit
                                }
                            },
                        )
                    }
                },
                // {
                //     title: "交易所保证金",
                //     key: "exchangeMargin",
                //     align: "center",
                //     minWidth: 120,
                //     render: (h, params) => {
                //         return h(
                //             "FormatCell",{
                //                 props:{
                //                     justify: 'center',
                //                     num: params.row.exchangeMargin
                //                 }
                //             },
                //         )
                //     }
                // },
                {
                    title: "投资者交割保证金",
                    key: "investorDeliveryMargin",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.investorDeliveryMargin
                                }
                            },
                        )
                    }
                },
                {
                    title: "交易所交割保证金",
                    key: "exchangeDeliveryMargin",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.exchangeDeliveryMargin
                                }
                            },
                        )
                    }
                },
                {
                    title: "上次结算准备金",
                    key: "preBalance",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.preBalance
                                }
                            },
                        )
                    }
                },
                {
                    title: "上次占用保证金",
                    key: "preMargin",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.preMargin
                                }
                            },
                        )
                    }
                },
                {
                    title: "上次质押金额",
                    key: "preMortgage",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.preMortgage
                                }
                            },
                        )
                    }
                },
                {
                    title: "交易日",
                    key: "tradeDate",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "span",
                            utils.formatDate(params.row.tradeDate)
                        );
                    }
                }
            ],
            lastUpdateTime: null,
            timer: null
        };
    },
    async created() {
        this.query = this.utils.saveQuery(this.query, 'get')
        let commonData = await this.api.getCommonData("IntraydayRiskControl");
        this.commonData = commonData;
        this.search();
        this.timer = setInterval(() => {
            this.search();
        }, 60000);
    },
    mounted() {},
    methods: {
        onSearch() {
            if (!!this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.search();
            this.timer = setInterval(() => {
                this.search();
            }, 60000);
        },
        async search() {
            this.utils.saveQuery(this.query)
            let query = { ...this.query };
            let { list, pagination } = await api.listFundStatus(query);
            this.pagination = pagination;
            this.list = list;
            this.lastUpdateTime = new Date();
        },
        resetQuery() {
            this.query = {};
        }
    },
    destroyed() {
        clearInterval(this.timer);
        this.timer = null;
    }
};
</script>
