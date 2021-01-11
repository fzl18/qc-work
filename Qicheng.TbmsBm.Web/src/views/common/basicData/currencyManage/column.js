import { utils } from '@/utils/utils';
export let column = (commonData, that) => [
  {
    title: that.$t('唯一标识'),
    key: 'accountingName',
    align: 'center',
    minWidth: 100
  },
  {
    title: that.$t('Code'),
    key: 'code',
    align: 'center',
    minWidth: 100,
  },
  {
    title: that.$t('名称'),
    key: 'name',
    align: 'center',
    minWidth: 100
  },
  {
    title: that.$t('简称'),
    key: 'shortName',
    align: 'center',
    minWidth: 100,
  },
  {
    title: that.$t('符号'),
    key: 'symbol',
    align: 'center',
    minWidth: 100
  },
  {
    title: that.$t('英文名称'),
    key: 'englishName',
    align: 'center',
    minWidth: 150
  },
  {
    title: that.$t('精度'),
    key: 'scale',
    align: 'center',
    minWidth: 100,
  },
  {
    title: that.$t('内贸排序'),
    key: 'domesticIndex',
    align: 'center',
    minWidth: 100
  },
  {
    title: that.$t('外贸排序'),
    key: 'interIndex',
    align: 'center',
    minWidth: 100
  },
  {
    title: that.$t('是否启用'),
    key: 'isDeleted',
    align: 'center',
    minWidth: 100,
    render(h, {row}) {
      return <span>{ row.isDeleted === true ? that.$t('停用') : row.isDeleted === false ? that.$t('启用') : ''}</span>
    },
  },
  {
    title: that.$t('创建人'),
    key: 'creatorName',
    align: 'center',
    minWidth: 100
  },
  {
    title: that.$t('创建时间'),
    key: 'creationTime',
    align: 'center',
    minWidth: 150,
    render(h, {row}) {
      return h('span', utils.formatDate(row.creationTime, 'YYYY-MM-DD HH:mm:ss'));
    },
  },
  {
    title: that.$t('修改人'),
    key: 'lastManipulatorName',
    align: 'center',
    minWidth: 100
  },
  {
    title: that.$t('最近修改时间'),
    key: 'lastManipulationTime',
    align: 'center',
    minWidth: 150,
    render(h, {row}) {
      return h('span', utils.formatDate(row.lastManipulationTime, 'YYYY-MM-DD HH:mm:ss'));
    },
  },
  {
    title: that.$t('操作'),
    align: 'center',
    minWidth: 120,
    fixed: 'right',
    render: (h, param) => {
      let arr = [
        {
          name: 'Button',
          icon: 'md-create',
          event: () => {
            that.$refs.add.show(param.row)
          },
          content: '修改'
        },
        {
          name: 'Button',
          icon: 'md-unlock',
          color: '#19be6b',
          isShow: param.row.isDeleted,
          content: '启用',
          event: () => {
            that.$Modal.confirm({
              title: '启用',
              content: that.$t('是启停用此币种信息？'),
              onOk: () => {
                that.setDisableStatus(param.row)
              }
            })
          },
        },
        {
          name: 'Button',
          icon: 'md-lock',
          color: '#ed4014',
          isShow: !param.row.isDeleted,
          content: '停用',
          event: () => {
            that.$Modal.confirm({
              title: '停用',
              content: that.$t('是否停用此币种信息？'),
              onOk: () => {
                that.setDisableStatus(param.row)
              }
            })
          },
        },
      ];
      return utils.createButton(h, arr)
    }
  }
]
