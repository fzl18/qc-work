<template>
  <Table :columns="columns" :data="data">
    <template slot-scope="{ row, index }" slot="name">
      <Input type="text" v-model="saveModel.editName" v-if="editIndex === index" />
      <span v-else>{{ row.name }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="age">
      <Input type="text" v-model="saveModel.editAge" v-if="editIndex === index" />
      <span v-else>{{ row.age }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="birthday">
      <Input type="text" v-model="saveModel.editBirthday" v-if="editIndex === index" />
      <span v-else>{{ getBirthday(row.birthday) }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="address">
      <Input type="text" v-model="saveModel.editAddress" v-if="editIndex === index" />
      <span v-else>{{ row.address }}</span>
    </template>

    <template slot-scope="{ row, index }" slot="action">
      <div v-if="editIndex === index">
        <Tooltip content='保存' placement='top' :transfer=true @click="editIndex = -1"><Button size='small' icon='md-checkbox-outline' @click="handleSave(row, index)"></Button></Tooltip>
        <Tooltip content='撤销' placement='top' :transfer=true @click="editIndex = -1"><Button size='small' icon='md-redo' @click="handleNotEdit(row, index)"></Button></Tooltip>
      </div>
      <div v-else>
        <Tooltip content='编辑' placement='top' :transfer=true @click="editIndex = -1"><Button size='small' icon='md-create' @click="handleEdit(row, index)"></Button></Tooltip>
      </div>
    </template>
  </Table>
</template>
<script>
export default {
  data () {
    return {
      columns: [
        {
          title: '姓名',
          slot: 'name'
        },
        {
          title: '年龄',
          slot: 'age'
        },
        {
          title: '出生日期',
          slot: 'birthday'
        },
        {
          title: '地址',
          slot: 'address'
        },
        {
          title: '操作',
          slot: 'action'
        }
      ],
      data: [
        {
          name: '王小明',
          age: 18,
          birthday: '919526400000',
          address: '北京市朝阳区芍药居'
        },
        {
          name: '张小刚',
          age: 25,
          birthday: '696096000000',
          address: '北京市海淀区西二旗'
        },
        {
          name: '李小红',
          age: 30,
          birthday: '563472000000',
          address: '上海市浦东新区世纪大道'
        },
        {
          name: '周小伟',
          age: 26,
          birthday: '687024000000',
          address: '深圳市南山区深南大道'
        }
      ],
      editIndex: -1,  // 当前聚焦的输入框的行数
      saveModel: {
        editName: '',  // 第一列输入框，当然聚焦的输入框的输入内容，与 data 分离避免重构的闪烁
        editAge: '',  // 第二列输入框
        editBirthday: '',  // 第三列输入框
        editAddress: '',  // 第四列输入框
      }
    }
  },
  methods: {
    handleNotEdit() {
      this.editIndex = -1
    },
    handleEdit (row, index) {
      this.saveModel.editName = row.name;
      this.saveModel.editAge = row.age;
      this.saveModel.editAddress = row.address;
      this.saveModel.editBirthday = row.birthday;
      this.editIndex = index;
    },
    handleSave (row, index) {
      this.data[index].name = this.saveModel.editName;
      this.data[index].age = this.saveModel.editAge;
      this.data[index].birthday = this.saveModel.editBirthday;
      this.data[index].address = this.saveModel.editAddress;
      this.editIndex = -1;
    },
    getBirthday (birthday) {
      const date = new Date(parseInt(birthday));
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month}-${day}`;
    }
  }
}
</script>