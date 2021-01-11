import { utils } from '@/utils/utils';
export let column = (commonData, that) => [
  {
    title: '资金账户',
    key: 'tradeAccountText',
    align: 'center',
    minWidth: 100
  },
  {
    title: '具体合约',
    key: 'instrumentText',
    align: 'center',
    minWidth: 100,
  },
  {
    title: '方向',
    key: 'isBuy',
    align: 'center',
    minWidth: 100,
    render(h, {row}) {
      return <span>{ row.isBuy === true ? '买' : row.isBuy === false ? '卖' : ''}</span>
    },
  },
  {
    title: '持仓手数',
    key: 'currentPosition',
    align: 'center',
    minWidth: 100,
    render(h, params) {
      return <format-cell  fixed={0}>{params.row.currentPosition}</format-cell>
    }
  },
  {
    title: '持仓量',
    key: 'currentWeight',
    align: 'center',
    minWidth: 100,
    render(h, params) {
      return <format-cell fixed={4}>{params.row.currentWeight}</format-cell>
    }
  },
  {
    title: '持仓价',
    key: 'currentPrice',
    align: 'center',
    minWidth: 100,
    render(h, params) {
      return <format-cell >{params.row.currentPrice}</format-cell>
    }
  },
  {
    title: '投机/套保',
    key: 'hedgeFlagType',
    align: 'center',
    minWidth: 100,
  },
  {
    title: '是否启用',
    key: 'status',
    align: 'center',
    minWidth: 100,
    render: (h, {row}) => {
      return <span>{ row.status === true ? '否' : row.status === false ? '是' : ''}</span>
    }
  },
  {
    title: '成交时间',
    key: 'tradeTime',
    align: 'center',
    minWidth: 100,
    render: (h, params) => {
      return h('span', utils.formatDate(params.row.tradeTime, 'HH:mm:ss'));
    }
  },
  {
    title: '是否禁用',
    key: 'IsDeleted',
    align: 'center',
    minWidth: 100,
    render: (h, params) => {
      return h('span', utils.formatDate(params.row.tradeTime, 'HH:mm:ss'));
    }
  },
  {
    title: '操作',
    align: 'center',
    minWidth: 120,
    fixed: 'right',
    render: (h, param) => {
      let arr = [
        {
          name: 'Button',
          icon: 'md-add-circle',
          href: '',
          isShow: utils.hasPermission('HF_CreateExposureBalance') && param.row.currentPrice > 5000,
          event: () => {
            // that.$router.push('/exposure-hedging/exposureHedgingAdd?exporsureId=' + param.value)
          },
          content: '添加敞口对冲',
        },
        {
          name: 'Button',
          icon: 'md-create',
          isShow: utils.hasPermission('HF_UpdateRiskExposure'),
          event: () => {
            that.$router.push('/exposure/edit/' + param.value)
          },
          content: '修改'
        },
        {
          name: 'Button',
          icon: 'md-trash',
          color: '#ed4014',
          isShow: utils.hasPermission('HF_DeleteRiskExposure'),
          content: that.$t('delete'),
          event: () => {
            that.$Modal.confirm({
              title: '删除',
              content: that.$t('confirmToDeleteExposureRecord'),
              onOk: () => {
              }
            })
          },
        },
        {
          name: 'Button',
          icon: 'md-unlock',
          color: '#19be6b',
          isShow: utils.hasPermission('HF_DeleteRiskExposure') && param.row.status,
          content: '启用',
          event: () => {
            that.$Modal.confirm({
              title: '启用',
              content: that.$t('confirmToDeleteExposureRecord'),
              onOk: () => {
                that.list[param.index].status = !that.list[param.index].status
              }
            })
          },
        },
        {
          name: 'Button',
          icon: 'md-lock',
          color: '#ed4014',
          isShow: utils.hasPermission('HF_DeleteRiskExposure') && !param.row.status,
          content: '停用',
          event: () => {
            that.$Modal.confirm({
              title: '停用',
              content: that.$t('confirmToDeleteExposureRecord'),
              onOk: () => {
                that.list[param.index].status = !that.list[param.index].status
              }
            })
          },
        },
        {
          name: 'Button',
          icon: 'md-eye',
          isShow: true,
          content: '查看',
          event: () => {
            that.$router.push('/exposure/info/' + param.value)
          }
        },
      ];
      return utils.createButton(h, arr)
    }
  }
]