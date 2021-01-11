import { utils } from '@/utils/utils'

export let listColumns = (vm) => {
  return [
    {
      type: 'selection',
      width: 60,
      align: 'center'
    },
    {
      title: vm.$t('名称'),
      key: 'name',
      align: 'center',
      tree: true,
      minWidth: 220,
    },
    {
      title: vm.$t('唯一标识'),
      key: 'qctKey',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('是否启用期货'),
      key: 'isETrading',
      align: 'center',
      minWidth: 100,
      render: (h, {row}) => {
        return <span>{ row.isETrading ? vm.$t('是'):vm.$t('否') }</span>
      }
    },
    {
      title: vm.$t('是否启用'),
      key: 'isDisabled',
      align: 'center',
      minWidth: 80,
      render: (h, {row}) => {
        return <span>{ row.isDisabled ? vm.$t('停用'):vm.$t('启用') }</span>
      }
    },
    {
      title: vm.$t('备注'),
      key: 'note',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('创建人'),
      key: 'creatorName',
      align: 'center',
      minWidth: 120
    },
    {
      title: vm.$t('创建时间'),
      key: 'creationTime',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ utils.formatDate(row.creationTime) }</span>
      }
    },
    {
      title: vm.$t('修改人'),
      key: 'lastManipulatorName',
      align: 'center',
      minWidth: 120
    },
    {
      title: vm.$t('最近修改时间'),
      key: 'lastManipulationTime ',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ utils.formatDate(row.lastManipulationTime) }</span>
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
              vm.$router.push({
                name:'strategiesCreate',
                params:{
                  commonData: vm.commonData,
                  data: row,
                  isEdit: true
                }
              });
            },
            content: vm.$t('修改'),
          },
          {
            name: 'Button',
            icon: 'md-eye',
            href: '',
            isShow: true,
            event: () => {
              vm.$refs['detail'].onShow(row);
            },
            content: vm.$t('查看'),
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
                content: vm.$t('您确定启用此策略?'),
                onOk: () => {
                  vm.setDisableStatus(row)
                }
              })
            },
            content: vm.$t('启用'),
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
                content: vm.$t('您确定停用此策略?'),
                onOk: () => {
                  vm.setDisableStatus(row)
                }
              })
            },
            content: vm.$t('停用'),
          },
        ]
        return utils.createButton(h, buttonArr)
      },
    },
  ]
}
