<style scoped>
</style>

<template>
  <div>
    <div style="padding: 10px 0;">
      <div :id="id" class="ag-theme-balham" :style="{height: maxHeight}"></div>
    </div>
    <QcPage
      v-if="hasPage"
      :current="qcPage.currentPage"
      :total="qcPage.itemCount"
      :show-total="true"
      :page-size="qcPage.pageSize"
      :page-size-opts="[15, 30, 50]"
      show-sizer
      @on-change="onPageChange"
      @on-page-size-change="onPageSizeChange"
      size="small"
    />
  </div>
</template>
<script>
/*global $ _*/
import defaultOptions from './defaultGridOptions';
import createElement from './render'
export default {
  name: 'QcGrid',
  props: {
    id: {
      type: String,
      default: 'qc-grid'
    },
    hasPage: {
      type: Boolean,
      default: true
    },
    rowData: Array,
    pagination: {
      type: Object,
      default: () => {
        15;
      }
    },
    autoGroupColumnDef: Object,
    manualGroup: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: ''
    },
    gridOptions: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      grid: null,
      maxHeight: ''
    };
  },
  mounted() {
    // let options = _.extend(defaultOptions, this.gridOptions);
    // if (this.manualGroup) {
    //   options.components = {
    //     showCellRenderer: this.createShowCellRenderer()
    //   };
    //   options.suppressRowTransform = true;
    // }
    // this.renderGrid(options);
    if(this.height) {
      this.maxHeight = this.height + 'px'
    }
  },
  computed: {
    qcPage: {
      get: function() {
        return this.pagination || { pageSize: 15 };
      },
      set: function(val) {
        this.pagination = val;
      }
    }
  },
  watch: {
    rowData(val) {
      if (!this.grid) {
        return;
      }
      this.grid.setData(val);
    },
    gridOptions() {
      let options = _.extend(defaultOptions, this.gridOptions);
      if (this.manualGroup) {
        options.components = {
          showCellRenderer: this.createShowCellRenderer()
        };
        options.suppressRowTransform = true;
      }
      this.renderGrid(options);
    }
  },
  methods: {
    renderGrid(options) {
      let vnode = this.$createElement('span', '')
      let VNode = vnode.constructor
      let that = this
      let $qcGrid = $('#' + this.id);
      options.columnDefs = options.columnDefs.map((item) => {
        if(item.render) {
          item.cellRenderer = function(params) {
            let cellData = item.render(that.$createElement, params)
            if(cellData instanceof Array && cellData.length && cellData[0] instanceof VNode) {
              return createElement(cellData)
            }
            if(cellData instanceof VNode) {
              return createElement(cellData)
            }
            return cellData
          }
        }
        let obj = {}
        for(let i in item) {
          if(i != 'render') {
            obj[i] = item[i]
          }
        }
        return obj
      })
      this.grid = $qcGrid.qcgrid(options, true);
    },
    createShowCellRenderer() {
      function ShowCellRenderer() {}

      ShowCellRenderer.prototype.init = function(params) {
        let value = params.valueFormatted || params.value;
        var cellBlank = !value;
        if (cellBlank) {
          return null;
        }
        let parentOffsetHeight = params.eGridCell.offsetHeight;
        let rowSpan = params.data.rowSpan || 1;
        let top = `calc( 50% - ${Math.round(
          parentOffsetHeight / rowSpan / 2
        )}px)`;

        this.ui = document.createElement('div');
        this.ui.style.cssText = `top:${top};`;
        this.ui.className = 'manual-group-cell';
        this.ui.innerHTML = value;
      };

      ShowCellRenderer.prototype.getGui = function() {
        return this.ui;
      };

      return ShowCellRenderer;
    },
    onPageChange(value) {
      this.qcPage.currentPage = value;
      this.$emit('on-page-change', this.qcPage);
    },
    onPageSizeChange(value) {
      this.qcPage.pageSize = value;
      this.$emit('on-page-change', this.qcPage);
    }
  }
};
</script>

