(function($) {
    /*
     *  grid table init
     *  need moment.js accounting.js utility.js
     */
    var QCGrid = function() {
        var _this = this;
        this.options = {};
        this.gridOptions = {};

        this.defaultGridOptions = {
            // define grid columns
            columnDefs: [],
            // default ColDef, gets applied to every column
            defaultColDef: {
                // set the default column width
                width: 150,
                // make every column editable
                editable: false,
                // make every column use 'text' filter by default
                filter: 'agTextColumnFilter',
                // enableRowGroup: true, //不能设置default rowgroup 会导致多个group出问题
                suppressDragLeaveHidesColumns: true,
                suppressMakeColumnVisibleAfterUnGroup: true
            },
            // default ColGroupDef, get applied to every column group
            defaultColGroupDef: {
                marryChildren: true
            },
            autoGroupColumnDef: {
                cellRendererParams: {
                    suppressCount: true
                }
            },
            // define specific column types
            columnTypes: {
                numberColumn: {
                    width: 83,
                    filter: 'agNumberColumnFilter',
                    valueFormatter: function(params) { //default value format
                        if (params && params.value == +params.value) {
                            if (params.column.colId.toLowerCase().indexOf('weight') > -1)
                                return accounting.formatNumber(params.value, 4);
                            if (params.column.colId.toLowerCase().indexOf('amount') > -1 || params.column.colId.toLowerCase().indexOf('price') > -1)
                                return accounting.formatNumber(params.value, 2);
                            return accounting.formatNumber(params.value, 4); //default format
                        }
                    },
                    cellRenderer: function(params) {
                        var formatted = params.valueFormatted;
                        if (params && params.value < 0) {
                            var formattedValue = formatted.split("-")[1]; //移除'-'
                            return '<span class="text-bold text-danger">(' + formattedValue + ')</span>';
                        }
                        return formatted;
                    }
                },
                medalColumn: { width: 100, columnGroupShow: 'open', suppressFilter: true },
                nonEditableColumn: { editable: false },
                dateColumn: {
                    filter: 'agDateColumnFilter', // specify we want to use the date filter
                    valueFormatter: function(params) {
                        if (params && params.value) {
                            return moment(params.value).format('YYYY-MM-DD');
                        }
                    },
                    // add extra parameters for the date filter
                    filterParams: {
                        // provide comparator function
                        comparator: function(filterLocalDateAtMidnight, cellValue) {

                            var cellDate = new Date(Date.parse(cellValue));
                            // Now that both parameters are Date objects, we can compare
                            if (cellDate < filterLocalDateAtMidnight) {
                                return -1;
                            } else if (cellDate > filterLocalDateAtMidnight) {
                                return 1;
                            } else {
                                return 0;
                            }
                        }
                    }
                },
                datetimeColumn: {
                    valueFormatter: function(params) {
                        if (params && params.value) {
                            return moment(params.value).format('YYYY-MM-DD HH:mm:ss');
                        }
                    },
                }
            },
            rowData: null,
            // gridAutoHeight: true,
            enableFilter: true,
            floatingFilter: true,
            rowGroupPanelShow: 'always',
            enableColResize: true,
            enableSorting: true,
            enableStatusBar: true,
            //alwaysShowStatusBar: true,
            suppressRowClickSelection: true,
            enableRangeSelection: true,
            rowSelection: "multiple", // one of ['single','multiple'], leave blank for no selection
            rowDeselection: true,
            quickFilterText: null,
            groupSelectsChildren: true, // one of [true, false]
            // suppressHorizontalScroll: true,
            localeText: {
                pivotMode: '透视',
                columns: '操作',
                sum: '和',
                filterOoo: '过滤',
                equals: '等于',
                notEqual: '不等于',
                lessThan: '小于',
                greaterThan: '大于',
                contains: '包含',
                notContains: '不包含',
                startsWith: '开始于',
                endsWith: '结束于',
                pinColumn: '固定列',
                pinLeft: '固定到左侧',
                pinRight: '固定到右侧',
                noPin: '取消固定',
                valueAggregation: 'laValue Agg',
                autosizeThiscolumn: '调整此列',
                autosizeAllColumns: '调整所有列',
                resetColumns: '重置列',
                groupBy: '分组',
                toolPanel: '操作面板',
                copy: '复制',
                paste: '粘贴',
                copyWithHeaders: '复制（含表头）',
                export: '导出',
                csvExport: '导出 CSV',
                excelExport: '导出 Excel',
                groups: '分组（行）',
                rowGroupColumnsEmptyMessage: '拖至此处分组',
                values: '聚合（列）',
                average: '平均',
                count: '数量',
                min: '最小值',
                max: '最大值',
                first: '第一个',
                last: '最后一个',
                to: '到',
                of: '共',
                group: '分类',
                expandAll: '展开全部',
                collapseAll: '收起全部'
            },
            suppressAggFuncInHeader: true,
            //toolPanelSuppressSideButtons: true,
            alignedGrids: [],
            pagination: true,
            suppressPaginationPanel: true,
            aggFuncs: {},

        };
        this.defaultGridOptions.onGridReady = function(params) {
            _this._autoFit(); //设置初次加载页面显示

            if (_this.options.onGridReady && typeof(_this.options.onGridReady) === 'function') {
                _this.options.onGridReady(params);
            }
        }
        if (localStorage.getItem("language") === 'en') {
            this.defaultGridOptions.localeText = {}
        }
        this.defaultOptions = {
            pagination: true, //pagination setting. true:need;
            pageParam: { //default page param
                pagination: 'toquery.Pagination',
                onPageChange: 'onSearch',
                //  pageSizeList: []
            },
            defaultPageSize: 15,
            autoFitScreen: false, //auto fit 
            columnDefs: [], //columnDefs
            rowData: [], //rowdata
            aggFuncs: { //default function
                'sum': function(values) {
                    var result = 0;
                    values.forEach(function(value) {
                        if (typeof value === 'number') {
                            result = utils.add(result, value);
                        }
                    });
                    return result;
                },
            },
            enablePageSummary: true,
        };

        this._pageSummary = {};

        this._summaryDiv = null;
        this._pageDiv = null;
        this._summary = [];
    };
    QCGrid.prototype = {
        constructor: QCGrid,
        //basic private function start
        _initialize: function(options, element) {
            this.options = $.extend(this.defaultOptions, options);

            this.gridOptions = $.extend(this.defaultGridOptions, options, {
                pagination: this.options.pagination || true,
                suppressPaginationPanel: this.options.pagination || true
            });
            // this._generatePage(options, element);

            if (this.gridOptions.detailCellRendererParams) { //detail extend master
                this.gridOptions.detailCellRendererParams.detailGridOptions.columnTypes = $.extend(this.gridOptions.columnTypes, this.gridOptions.detailCellRendererParams.detailGridOptions.columnTypes);
                this.gridOptions.detailCellRendererParams.detailGridOptions.aggFuncs = $.extend(this.gridOptions.aggFuncs, this.gridOptions.detailCellRendererParams.detailGridOptions.aggFuncs);
            }
            //fix warning
            delete this.gridOptions.autoFitScreen;
            delete this.gridOptions.pageParam;
            delete this.gridOptions.enablePageSummary;

            new agGrid.Grid(element[0], this.gridOptions);
            this._autoFit();
        },
        //屏幕自适应
        _autoFit: function() {
            if (this.options.autoFitScreen) {
                this.gridOptions.api.sizeColumnsToFit();
            } else {
                this._autoSizeAll();
            }
        },
        _autoSizeAll: function() {
            var allColumnIds = [];
            this.gridOptions.columnApi.getAllColumns().forEach(function(column) {
                allColumnIds.push(column.colId);
            });
            this.gridOptions.columnApi.autoSizeColumns(allColumnIds);
        },
        //自动添加page&pageSummary
        _generatePage: function(options, element) {
            if (!!this.options.enablePageSummary) {
                this._generateSummary();
            }
            if (!!this.options.pagination || !!this.options.enablePageSummary)
                $(element.selector).after(this._generatePageDiv(this.options));

            if (this.options.rowData) {}
        },
        _generatePageDiv: function(options) {
            this._pageDiv = "qc_pagination_" + moment().format('YYYYMMDDHHmmss');
            this._summaryDiv = "qc_pagination_summary_" + moment().format('YYYYMMDDHHmmss');

            var div = '';
            if (options.pagination && options.enablePageSummary) {
                div =
                    '<div>\
                         <nav aria-label="pagination" id="' + this._pageDiv + '" class="qc-pagination-summary">\
                            <qc-pagination params="pagination:' + options.pageParam.pagination + ',onPageChange: ' + options.pageParam.onPageChange + '">\
                            </qc-pagination>\
                            <div class="qc-summary" id="' + this._summaryDiv + '">\
                            </div>\
                        </nav>\
                    </div>';
            } else if (options.pagination && !options.enablePageSummary) {
                div =
                    '<div style="height:50px;">\
                         <nav aria-label="pagination" id="' + this._pageDiv + '" style="display: flex; justify-content: space-between;">\
                            <qc-pagination params="pagination:' + options.pageParam.pagination + ',onPageChange: ' + options.pageParam.onPageChange + '">\
                            </qc-pagination>\
                            </div>\
                        </nav>\
                    </div>';
            } else if (!options.pagination && options.enablePageSummary) {
                div =
                    '<div style="height:50px;">\
                         <nav aria-label="pagination" id="' + this._pageDiv + '" style="display: flex; justify-content: flex-end;">\
                            <div class="qc-summary" id="' + this._summaryDiv + '" style="display: flex; justify-content: flex-end; ">\
                            </div>\
                         </nav>\
                     </div>';
            }
            return div;
        },
        _generateSummary: function() {
            this._summary = [];
            this._getSummaryField(this.gridOptions.columnDefs);
        },
        _getSummaryField: function(data) {
            for (var i = 0; i < data.length; i++) {
                var r = data[i];
                if (!!r.enableSummary) {
                    delete r.enableSummary;
                    this._summary.push({
                        text: r.headerName,
                        field: r.field,
                        value: null
                    });
                }
                if (r.children && r.children.length > 0) {
                    this._getSummaryField(r.children);
                }
            }
        },

        // basic function end
        //get function start
        getColumnDefs: function() {

        },
        //get function end
        //set function start
        setData: function(data, callback) {
            this.gridOptions.api.setRowData(data || []);
            this._autoFit();
            if (callback) callback();
        },
        //set function end
        //event start
        onPageSizeChange: function(newPageSize, callback) {
            if (newPageSize) {
                this.gridOptions.api.paginationSetPageSize(newPageSize || this.options.defaultPageSize);
            }
            if (callback)
                callback();
        },
        onPageNumberChange: function(newPageNumber, callback) {
            if (newPageNumber) {
                this.gridOptions.api.paginationGoToPage(newPageNumber < 0 ? 1 : newPageNumber);
            }
            if (callback)
                callback();
        },
        getSelected: function() {
                return this.gridOptions.api.getSelectedRows();
            }
            //event end
    };

    $.fn.qcgrid = function(options, newInstance = false) {
        if (!$.qcgrid || newInstance) {
            $(this).empty();
            $.qcgrid = new QCGrid();
        }
        $.qcgrid.element = this;
        $.qcgrid._initialize(options, this);
        return $.qcgrid;
    };

})(jQuery);