import { utils } from '@/utils/utils'

export let listColumns = (vm) => {
  return [
    {
      title: vm.$t('用户名'),
      key: 'loginName',
      align: 'center',
      minWidth: 120
    },
    {
      title: vm.$t('姓名'),
      key: 'name',
      align: 'center',
      minWidth: 120,
    },
    {
      title: vm.$t('岗位'),
      key: 'wfUserRoleDto',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return <span>{ }</span>
      }
    },
    {
      title: vm.$t('IP限制'),
      key: 'IP',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return h('div',{
          domProps: {
            innerHTML: row.IPH
          }
        })
      }
    },
    {
      title: vm.$t('Mac限制'),
      key: 'Mac',
      align: 'center',
      minWidth: 120,
      render: (h, {row}) => {
        return h('div',{
          domProps: {
            innerHTML: row.MacH
          }
        })
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
        return <span>{ utils.formatDate(row.lastManipulationTime)}</span>
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
              vm.$refs['edit'].onEdit(row);
            },
            content: vm.$t('修改'),
          },
          {
            name: 'Button',
            icon: 'md-trash',
            color: '#f00',
            isShow: utils.hasPermission('HF_CreateExposureBalance'),
            event: () => {
              vm.$Modal.confirm({
                title: vm.$t('删除'),
                // content: vm.$t('confirmToDeleteExposureRecord'),
                content: vm.$t('确认删除此用户的登录限制？'),
                onOk: () => {
                  vm.onDelete(row)
                }
              })
            },
            content: vm.$t('删除'),
          }
        ]
        return utils.createButton(h, buttonArr)
      },
    },
  ]
}