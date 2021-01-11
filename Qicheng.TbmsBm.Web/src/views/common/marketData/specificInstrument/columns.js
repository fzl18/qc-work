import { utils } from '@/utils/utils'

export let listColumns = (vm) => {
  return [
    {
      title: vm.$t('唯一标识'),
      key: 'AccountingName',
      align: 'center',
      minWidth: 150,
    },
    {
      title: vm.$t('代码'),
      key: 'FullName',
      align: 'center',
      minWidth: 150,
    },
    {
      title: vm.$t('名称'),
      key: 'ShortName',
      align: 'center',
      minWidth: 150,
    },
    {
      title: vm.$t('交易所'),
      key: 'tradeAccountText',
      align: 'center',
      minWidth: 80,
    },
    {
      title: vm.$t('标准合约'),
      key: 'tradeAccountText',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('特殊合约类型'),
      key: 'tradeAccountText',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('合约类型'),
      key: 'tradeAccountText',
      align: 'center',
      minWidth: 100,
    },
    {
      title: vm.$t('第一个交易日期'),
      key: 'tradeAccountText',
      align: 'center',
      minWidth: 130,
      render: (h, { row }) => h('span', utils.formatDate(row.data))
    },
    {
      title: vm.$t('最后交易日期'),
      key: 'tradeAccountText',
      align: 'center',
      minWidth: 120,
      render: (h, { row }) => h('span', utils.formatDate(row.data))
    },
    {
      title: vm.$t('是否启用期货'),
      key: 'IiETrading',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ row.IiETrading === true ? vm.$t('是') : row.IiETrading === false ? vm.$t('否') : '' }</span>
      }
    },
    {
      title: vm.$t('是否启用'),
      key: 'isDisabled ',
      align: 'center',
      minWidth: 100,
      render: (h, {row}) => {
        return <span>{ row.isDisabled === true ? vm.$t('否') : row.isDisabled === false ? vm.$t('是') : '' }</span>
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
      key: 'createTime',
      align: 'center',
      minWidth: 150,
      render: (h, {row}) => {
        return h('span', row.time && utils.formatDate(row.time, 'YYYY-MM-DD HH:mm:ss'))
      }
    },
    {
      title: vm.$t('修改人'),
      key: 'lastManipulatorName',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('最近修改时间'),
      key: 'tsBrokerId',
      align: 'center',
      minWidth: 150,
      render: (h, {row}) => {
        return h('span', row.time && utils.formatDate(row.time, 'YYYY-MM-DD HH:mm:ss'))
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
            isShow: utils.hasPermission('HF_CreateExposureBalance'),
            event: () => {
              vm.onEdit(row);
            },
            content: vm.$t('修改'),
          },
          {
            name: 'Button',
            icon: 'md-lock',
            href: '',
            color: '#ed4014',
            isShow: utils.hasPermission('HF_CreateExposureBalance') && row.isDisabled,
            event: () => {
              vm.$Modal.confirm({
                title: vm.$t('停用'),
                // content: vm.$t('confirmToDeleteExposureRecord'),
                content: vm.$t('确定停用该条数据？'),
                onOk: () => {
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
            isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDisabled,
            event: () => {
              vm.$Modal.confirm({
                title: vm.$t('启用'),
                // content: vm.$t('confirmToDeleteExposureRecord'),
                content: vm.$t('确定启用该条数据？'),
                onOk: () => {
                }
              })
            },
            content: vm.$t('启用'),
          },
          {
            name: 'Button',
            icon: 'md-eye',
            href: '',
            isShow: utils.hasPermission('HF_CreateExposureBalance'),
            event: () => {
              vm.isShowInfoModal = true
            },
            content: vm.$t('查看'),
          }
        ]
        return utils.createButton(h, buttonArr)
      },
    },
  ]
}
