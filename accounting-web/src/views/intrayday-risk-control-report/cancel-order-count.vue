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
                        <InstrumentSelect
                                @change="instrumentChange"
                                :allDate="true"
                                :filterQuery="[]"
                                v-model="query.instrumentCode"></InstrumentSelect>
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
                :data="list"
            ></Table>
        </div>
        <div>
            <QcPage
                size="small"
                show-total
                show-elevator
                show-sizer
                :current="pagination.currentPage"
                :total="pagination.totalCount"
                :page-size="pagination.pageSize"
                @on-change="onPageChange"
                @on-page-size-change="onPageSizeChange"
            ></QcPage>
        </div>
    </div>
</template>
<script>
import { utils } from "@/utils/utils";
import api from "./api";
import FormatCell from '../../components/FormatCell'
export default {
    components:{FormatCell},
    data() {
        return {
            commonData: {
                options: {},
                enums: {}
            },
            query: {},
            list: [],
            tableLoading: false,
            pagination: {
                currentPage: 1,
                totalCount: 0,
                pageSize: 15
            },
            columns: [
                {
                    title: "法人",
                    key: "corporation",
                    align: "center",
                    minWidth: 150,
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
                    title: "合约",
                    key: "instrumentCode",
                    minWidth: 150,
                    align: "center"
                },
                {
                    title: "今日已撤单次数",
                    key: "cancelOrderNum",
                    minWidth: 150,
                    align: "center",
                    render: (h,params) => {
                        return h(
                            "FormatCell",{
                                props:{
                                    justify: 'center',
                                    needFormatter: false,
                                    num: params.row.cancelOrderNum
                                }
                            },
                        )
                    }
                }
            ],
            lastUpdateTime: null,
            instrumentCode: ''
        };
    },
    async created() {
        this.query = this.utils.saveQuery(this.query, 'get')
        let commonData = await this.api.getCommonData("IntraydayRiskControl");
        this.commonData = commonData;
        this.search();
    },
    methods: {
        instrumentChange (data) {
            this.instrumentCode = data && data.code;
        },
        onSearch() {
            this.pagination.currentPage = 1;
            this.search();
        },
        async search() {
            this.utils.saveQuery(this.query)
            let query = { ...this.query, instrumentCode: this.instrumentCode };
            let { list, pagination } = await api.listCancelOrderCount(
                query,
                this.pagination
            );
            this.pagination = pagination;
            this.list = list;
            this.lastUpdateTime = new Date();
        },
        resetQuery() {
            this.query = {};
            this.tradingDateRange = [];
            this.instrumentCode = ''
        },
        onPageChange(page) {
            this.pagination.currentPage = page;
            this.search();
        },
        onPageSizeChange(pageSize) {
            this.pagination.pageSize = pageSize;
            this.search();
        }
    }
};
</script>
