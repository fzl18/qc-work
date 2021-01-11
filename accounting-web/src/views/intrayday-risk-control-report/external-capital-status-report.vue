<template>
    <div>
        <div>
            <qc-collapse>
                <Row type="flex" :gutter="16">
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
                                :value="item.qctKey"
                                :key="index"
                                >{{ item.value }} - {{ item.text }}</Option
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
import FormatCell from "../../components/FormatCell";
export default {
    components:{FormatCell},
    data() {
        return {
            commonData: {},
            query: {
                agentId:null,
            },
            list: [],
            tableLoading: false,
            columns: [
                {
                    title: "资金账户",
                    key: "agentId",
                    align: "center",
                    // fixed: 'left',
                    minWidth: 140,
                    render: (h, params) => {
                        return h(
                            "span",
                            utils.showText(
                                this.commonData.tradeAccounts,
                                params.row.agentId,
                                'text',
                                "qctKey"
                            )
                        );
                    }
                },
                {
                    title: "子账户",
                    key: "traderAccount",
                    align: "center",
                    minWidth: 140
                },
                {
                    title: "币种",
                    key: "currency",
                    align: "center",
                    minWidth: 120,
                },
                {
                    title: "资金余额",
                    key: "fundBalance",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.fundBalance
                                }
                            },
                        )
                    }
                },
                {
                    title: "Ote",
                    key: "ote",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.ote
                                }
                            },
                        )
                    }
                },
                {
                    title: "Upl",
                    key: "upl",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.upl
                                }
                            },
                        )
                    }
                },
                {
                    title: "Mvo",
                    key: "mvo",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.mvo
                                }
                            },
                        )
                    }
                },
                {
                    title: "TotalVaule",
                    key: "totalValue",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.totalValue
                                }
                            },
                        )
                    }
                },
                {
                    title: "可用现金",
                    key: "availableCash",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
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
                    title: "抵押",
                    key: "mortgage",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
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
                    title: "初始保证金",
                    key: "margin",
                    align: "center",
                    minWidth: 120,
                    render: (h, params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    num: params.row.margin
                                }
                            },
                        )
                    }
                },
                {
                    title: "报表日",
                    key: "tradeDate",
                    align: "center",
                    minWidth: 160,
                    render: (h, params) => {
                        return h(
                            "span",
                            utils.formatDate(
                                params.row.tradeDate,
                                "YYYY-MM-DD HH:mm:ss")
                        );
                    }
                },
                {
                    title: "更新时间",
                    key: "lastUpdateTime",
                    align: "center",
                    minWidth: 160,
                    render: (h, params) => {
                        return h(
                            "span",
                            utils.formatDate(
                                params.row.lastUpdateTime,
                                "YYYY-MM-DD HH:mm:ss"
                            )
                        );
                    }
                },
            ],
            lastUpdateTime: null,
            timer: null
        };
    },
    async created() {
        this.query = this.utils.saveQuery(this.query, 'get')
        let commonData = await this.api.getCommonData("DepositRate");
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
            let list = await api.ListForeignAccountCashReportList(query);
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
