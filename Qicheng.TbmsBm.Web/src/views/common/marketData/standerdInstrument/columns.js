import { utils } from '@/utils/utils'
import api from './api'

export let listColumns = (vm) => {
  return [
    {
      title: vm.$t('唯一标识'),
      key: 'qctKey',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('名称'),
      key: 'friendlyName',
      align: 'center',
      minWidth: 150,
    },
    {
      title: vm.$t('合约代码'),
      key: 'code',
      align: 'center',
      minWidth: 150,
    },
    {
      title: vm.$t('合约类型'),
      key: 'financialInstrumentType',
      align: 'center',
      minWidth: 100,
      render: (h, { row }) => h('span', utils.showText(vm.commonData.FinancialInstrumentType, row.financialInstrumentType))
    },
    {
      title: vm.$t('交易所'),
      key: 'marketId',
      align: 'center',
      minWidth: 120,
      render: (h, { row }) => h('span', utils.showText(vm.commonData.exchanges, row.marketId))
    },
    {
      title: vm.$t('品类'),
      key: 'wfCommodityTypeId',
      align: 'center',
      minWidth: 120,
      render: (h, { row }) => h('span', utils.showText(vm.commonData.commodityTypes, row.wfCommodityTypeId))
    },
    {
      title: vm.$t('是否启用期货'),
      key: 'IiETrading',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ row.isETrading === true ? vm.$t('是') : row.isETrading === false ? vm.$t('否') : '' }</span>
      }
    },
    {
      title: vm.$t('是否启用'),
      key: 'isDeleted ',
      align: 'center',
      minWidth: 100,
      render: (h, {row}) => {
        return <span>{ row.isDeleted === true ? vm.$t('否') : row.isDeleted === false ? vm.$t('是') : '' }</span>
      }
    },
    {
      title: vm.$t('创建人'),
      key: 'creatorName',
      align: 'center',
      minWidth: 100,
    },
    {
      title: vm.$t('创建时间'),
      key: 'createTime',
      align: 'center',
      minWidth: 150,
      render: (h, {row}) => {
        return h('span', row.creationTime && utils.formatDate(row.creationTime, 'YYYY-MM-DD HH:mm:ss'))
      }
    },
    {
      title: vm.$t('修改人'),
      key: 'lastManipulatorName',
      align: 'center',
      minWidth: 100,
    },
    {
      title: vm.$t('最近修改时间'),
      key: 'tsBrokerId',
      align: 'center',
      minWidth: 150,
      render: (h, {row}) => {
        return h('span', row.lastManipulationTime && utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'))
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
            isShow: utils.hasPermission('HF_CreateExposureBalance') && !row.isDeleted,
            event: () => {
              vm.$Modal.confirm({
                title: vm.$t('停用'),
                content: vm.$t('确定停用该条数据？'),
                onOk: () => {
                  api.deleteById({id: row.wfInstrumentCategoryId}).then(() => {
                    vm.$Message.success(vm.$t('操作成功！'))
                    vm.onSearch()
                  })
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
            isShow: utils.hasPermission('HF_CreateExposureBalance') && row.isDeleted,
            event: () => {
              vm.$Modal.confirm({
                title: vm.$t('启用'),
                content: vm.$t('确定启用该条数据？'),
                onOk: () => {
                  api.deleteById({id: row.wfInstrumentCategoryId}).then(() => {
                    vm.$Message.success(vm.$t('操作成功！'))
                    vm.onSearch()
                  })
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
              vm.$refs['closePositionModal'].isShowInfoModal = true
              api.getById({id: row.wfInstrumentCategoryId}).then(data => {
                vm.$refs['closePositionModal'].infoForm = data
              })
            },
            content: vm.$t('查看'),
          },
          {
            name: 'Button',
            icon: 'md-add-circle',
            href: '',
            isShow: utils.hasPermission('HF_CreateExposureBalance'),
            event: () => {
              vm.$router.push({name: 'specificInstrumentCreate'})
            },
            content: vm.$t('新建具体合约'),
          },
          {
            name: 'Button',
            icon: 'md-eye',
            href: '',
            isShow: utils.hasPermission('HF_CreateExposureBalance'),
            event: () => {
              vm.$router.push({name: 'specificInstrumentList', query: {marketId: 2, instrumentCategoryId: 219}})
            },
            content: vm.$t('查看具体合约'),
          }
        ]
        return utils.createButton(h, buttonArr)
      },
    },
  ]
}
