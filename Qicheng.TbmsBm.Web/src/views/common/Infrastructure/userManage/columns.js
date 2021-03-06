import { utils } from '@/utils/utils'

export let listColumns = (vm) => {
  return [
    {
      title: vm.$t("用户名"),
      key: "loginName",
      align: "center",
      minWidth: 120,
    },
    {
      title: vm.$t("姓名"),
      key: "name",
      align: "center",
      minWidth: 120,
    },
    {
      title: vm.$t("状态"),
      key: "status",
      align: "center",
      minWidth: 100,
      render: (h, { row }) => {
      return ( <span>{utils.showText(vm.commonData.UserStatus,row.status)}</span> )
      },
    },
    {
      title: vm.$t("邮箱"),
      key: "mailAddress",
      align: "center",
      minWidth: 180,
    },
    {
      title: vm.$t("岗位"),
      key: "departmentId",
      align: "center",
      minWidth: 300,
      render: (h, { row }) => {
        let roles = []
        row.wfUserRoleDto && row.wfUserRoleDto.map(val=> {
          vm.commonData.roles.map((data,index)=>{
            if(data.value == val.wfRoleInfoId){
              roles.push(data.text)
            }
          })
        })
        return (
        <span>{roles.join(', ')}</span>
        );
      },
    },
    {
      title: vm.$t("办公电话"),
      key: "officePhone",
      align: "center",
      minWidth: 120,
    },
    {
      title: vm.$t("传真"),
      key: "fax ",
      align: "center",
      minWidth: 120,
    },
    {
      title: vm.$t("通知类型"),
      key: "notifyingAgents ",
      align: "center",
      minWidth: 120,
      render: (h, { row }) => {
        const notifyingAgents = []
        vm.commonData.NotifyingAgentType.forEach(val => {
          if((row.notifyingAgents & val.value) !== 0){
            notifyingAgents.push(val.text)
          }
        });
        return ( <span> {notifyingAgents.join(', ')}</span>)
      },
    },
    {
      title: vm.$t("是否启用"),
      key: "isDisabled ",
      align: "center",
      minWidth: 120,
      render: (h, { row }) => {
        return (
          <span>
            {row.isDisabled === false
              ? vm.$t("是")
              : row.isDisabled === true
              ? vm.$t("否")
              : ""}
          </span>
        );
      },
    },
    {
      title: vm.$t("创建人"),
      key: "creatorName",
      align: "center",
      minWidth: 120
    },
    {
      title: vm.$t("创建时间"),
      key: "creationTime ",
      align: "center",
      minWidth: 120,
      render: (h, { row }) => {
        return <span>{utils.formatDate(row.creationTime)}</span>
      },
    },
    {
      title: vm.$t("修改人"),
      key: "lastManipulatorName",
      align: "center",
      minWidth: 120
    },
    {
      title: vm.$t("修改时间"),
      key: "lastManipulationTime ",
      align: "center",
      minWidth: 120,
      render: (h, { row }) => {
        return <span>{utils.formatDate(row.lastManipulationTime)}</span>
      },
    },
    {
      title: vm.$t("操作"),
      fixed: "right",
      align: "left",
      minWidth: 150,
      render: (h, { row }) => {
        let buttonArr = [
          {
            name: "Button",
            icon: "md-create",
            href: "",
            isShow: utils.hasPermission("HF_CreateExposureBalance") && !row.isDisabled,
            event: () => {
              vm.$refs['edit'].onEdit(row);
            },
            content: vm.$t("修改"),
          },
          {
            name: "Button",
            icon: "md-eye",
            href: "",
            isShow: true,
            event: () => {
              vm.onDetail(row);
            },
            content: vm.$t("查看"),
          },
          {
            name: "Button",
            icon: "md-key",
            href: "",
            color: "",
            isShow:
              utils.hasPermission("HF_CreateExposureBalance") &&
              !row.isDisabled,
            event: () => {
              vm.$refs['setPassword'].handlePassWord(row);
            },
            content: vm.$t("设置登录密码"),
          },
          {
            name: "Button",
            icon: "md-timer",
            href: "",
            color: "",
            isShow:
              utils.hasPermission("HF_CreateExposureBalance"),
            event: () => {
              vm.$router.push({
                  name:"UserLoginHistory",
                  params:{
                    data: row
                  }
                });
            },
            content: vm.$t("查看登录历史"),
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
                content: vm.$t('确定启用该用户？'),
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
                content: vm.$t('确定停用该用户？'),
                onOk: () => {
                  vm.setDisableStatus(row)
                }
              })
            },
            content: vm.$t('停用'),
          },
        ];
        return utils.createButton(h, buttonArr);
      },
    },
  ]
}
