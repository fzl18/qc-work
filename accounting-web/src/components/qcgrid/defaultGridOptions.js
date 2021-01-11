const defaultGridOptions = {
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
            valueFormatter: function (params) { //default value format
                if (params && params.value == +params.value) {
                    if (params.column.colId.toLowerCase().indexOf('weight') > -1)
                        return accounting.formatNumber(params.value, 4);
                    if (params.column.colId.toLowerCase().indexOf('amount') > -1 || params.column.colId.toLowerCase().indexOf('price') > -1)
                        return accounting.formatNumber(params.value, 2);
                    return accounting.formatNumber(params.value, 4); //default format
                }
            },
            cellRenderer: function (params) {
                var formatted = params.valueFormatted;
                if (params && params.value < 0) {
                    var formattedValue = formatted.split("-")[1];//移除'-'
                    return '<span class="text-bold text-danger">(' + formattedValue + ')</span>';
                }
                return formatted;
            }
        },
        medalColumn: { width: 100, columnGroupShow: 'open', suppressFilter: true },
        nonEditableColumn: { editable: false },
        dateColumn: {
            filter: 'agDateColumnFilter',  // specify we want to use the date filter
            valueFormatter: function (params) {
                if (params && params.value) {
                    return moment(params.value).format('YYYY-MM-DD');
                }
            },
            // add extra parameters for the date filter
            filterParams: {
                // provide comparator function
                comparator: function (filterLocalDateAtMidnight, cellValue) {

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
            valueFormatter: function (params) {
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
        lessThanOrEqual: '小于等于',
        greaterThanOrEqual: '大于等于',
        lessThan: '小于',
        inRange: "在区间内",
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

export default defaultGridOptions