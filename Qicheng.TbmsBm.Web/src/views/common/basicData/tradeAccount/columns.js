import { utils } from '@/utils/utils'

export let listColumns = (vm) => {
  return [
    {
      title: vm.$t('唯一标识'),
      key: 'qctKey',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('姓名'),
      key: 'name',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('账户名'),
      key: 'userName',
      align: 'center',
      minWidth: 100,
    },
    {
      title: vm.$t('账户类型'),
      key: 'tradeAccountTypeId',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ utils.showText(vm.commonData.accountTypes, row.tradeAccountTypeId)}</span>
      }
    },
    {
      title: vm.$t('法人'),
      key: 'corporationId',
      align: 'center',
      minWidth: 80,
      render: (h, {row}) => {
        return <span>{utils.showText(vm.commonData.corporations, row.corporationId) }</span>
      }
    },
    {
      title: vm.$t('经纪公司'),
      key: 'brokerId',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{utils.showText(vm.commonData.brokers, row.brokerId)}</span>
      }
    },

    // {
    //   title: vm.$t('期货服务通道'),
    //   key: 'dispatcherId',
    //   align: 'center',
    //   minWidth: 120,
    // },
    // {
    //   title: vm.$t('通道类型'),
    //   key: 'isDisabled ',
    //   align: 'center',
    //   minWidth: 120,
    // },
    {
      title: vm.$t('结算币种'),
      key: 'accountCurrencyId ',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ utils.showText(vm.commonData.currencies, row.accountCurrencyId) }</span>
      }
    },
    {
      title: vm.$t('是否启用期货'),
      key: 'isETrading ',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ row.isETrading === true ? vm.$t('是') : row.isETrading === false ? vm.$t('否') : '' }</span>
      }
    },
    {
      title: vm.$t('是否启用'),
      key: 'isDisabled ',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ row.isDisabled === true ? vm.$t('是') : row.isDisabled === false ? vm.$t('否') : '' }</span>
      }
    },
    {
      title: vm.$t('创建人'),
      key: 'creatorName',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('创建时间'),
      key: 'creationTime',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{utils.formatDate(row.creationTime)}</span>
      }
    },
    {
      title: vm.$t('修改人'),
      key: 'lastManipulatorName ',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('最近修改时间'),
      key: 'lastManipulationTime',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{utils.formatDate(row.lastManipulationTime)}</span>
      }
    },
    {
      title: vm.$t('操作'),
      fixed: 'right',
      align: 'center',
      minWidth: 150,
      render: (h, { row }) => {
        let buttonArr = [
          {
            name: 'Button',
            icon: 'md-create',
            href: '',
            isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled,
            event: () => {
              vm.onEdit(row);
            },
            content: vm.$t('修改'),
          },
          {
            name: 'Button',
            icon: 'md-settings',
            href: '',
            isShow: row.isETrading && utils.hasPermission('HF_CreateExposureBalance'),
            event: () => {
              vm.$router.push({path:'/TradeAccountConfig/configEdit', query:{id:row.wfTradeAccountId}})
            },
            content: vm.$t('配置'),
          },
          {
            name: 'Button',
            icon: 'md-lock',
            href: '',
            color: '#ed4014',
            isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled,
            event: () => {
              vm.$Modal.confirm({
                title: vm.$t('停用'),
                // content: vm.$t('confirmToDeleteExposureRecord'),
                content: vm.$t('您确定停用此资金账户?'),
                onOk: () => {
                  vm.setDisableStatus(row.wfTradeAccountId,!row.isDisabled)
                }
              })
            },
            content: vm.$t('停用'),
          },
          {
            name: 'Button',
            icon: 'md-unlock',
            href: '',
            color: '#19be6b',
            isShow: utils.hasPermission('HF_CreateExposureBalance') && row.isDisabled,
            event: () => {
              vm.$Modal.confirm({
                title: vm.$t('启用'),
                // content: vm.$t('confirmToDeleteExposureRecord'),
                content: vm.$t('您确定启用此资金账户?'),
                onOk: () => {
                  vm.setDisableStatus(row.wfTradeAccountId,!row.isDisabled)
                }
              })
            },
            content: vm.$t('启用'),
          },
        ]
        return utils.createButton(h, buttonArr)
      },
    },
  ]
}
