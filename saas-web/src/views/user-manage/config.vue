<template>
  <el-container class="container">
    <el-header>
      <div class="search-header-row">
        <div>          
            <el-input v-model="query.sectionCode" clearable placeholder="页面标识" />          
        </div>
        <div>          
            <el-input v-model="query.sectionDescription" clearable placeholder="页面名称" />          
        </div>
        <div>          
            <el-input v-model="searchAuth" clearable placeholder="权限" />          
        </div>
        <div>
          <el-button type="defalut" @click="queryClear">清空</el-button>
          <el-button type="primary" icon="el-icon-search" @click="doSearch">搜索</el-button>
        </div>
      </div>
    </el-header>

    <el-main>
      <el-row :gutter="10" justify="space-between" type="flex" align="middle">
        <el-col :span="18">
          <h3 style="display:inline-block;margin-right:10px;">{{userName}}的权限</h3>
          <el-button type="success" style="background:rgb(0, 185, 172)" @click="handleCloneBox">权限复制</el-button>
        </el-col>
        <el-col :span="6" align="right">
          <el-button type="success" @click="toggleSelectAll(true)">全选</el-button>
          <el-button type="primary" @click="toggleSelectAll(false)">全不选</el-button>
        </el-col>
      </el-row>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit
                highlight-current-row class="authTable">
        <el-table-column label="页面标识" align="center" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.sectionCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="页面名称" align="center" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.sectionDescription }}</span>
          </template>
        </el-table-column>
        <el-table-column label="权限" align="left">
          <template slot-scope="scope">            
            <el-button v-for="(item,index) in scope.row.sectionOperations" :key="item.qcOperationId" :type=" item.selected ? 'success' : item.clicked ? 'primary' : ''" @click="handleChoosed(scope.row,index)" v-show="item.visible" >{{item.operatioDescription}}</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-main>

    <el-footer>
      <el-button type="text" @click="$router.push($route.path)">返回</el-button>
      <el-button type="primary" @click="doSave" :loading="isLoading">提交</el-button>
    </el-footer>

    <!-- dialog -->
      <div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="30%">
          <div>
            <div style="margin-bottom:20px">{{userName}}将复制以下用户的权限</div>
            <el-select v-model="copyUser" filterable clearable placeholder="选择用户" class="item-select">
              <el-option
                  v-for="item in allUser"
                  :key="item.userId"
                  :label="item.displayName"
                  :value="item.userId">
              </el-option>
            </el-select>
          </div>
          <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="handleClone" style="width:100%" :loading="isLoading">复制</el-button>
          </span>
        </el-dialog>
      </div>

  </el-container>
</template>

<script>
  import { mapGetters } from "vuex";
  import { userAuth, authSave, allUser, clone } from '../../api/userManage';

  export default {
    name: 'authConfig',
    data () {
      return {
        list: [],
        srcList: [],
        listLoading: false,
        commonData:{},
        query: {
          sectionCode: '',
          sectionDescription: '',
        },
        searchAuth: '',
        dialogVisible: false,        
        dialogStatus: '',
        dialogTitle: '权限复制',
        isLoading: false,
        userId: '',
        copyUser: null,
        allUser: [],
        userList: [],
        userName: ''
      }
    },
    async created () {
      this.userId = this.$route.query.userId
      await this.init()
      allUser().then( res =>{
        this.userList = res.data.list
        this.userName = this.userList.find(item => item.userId == this.userId).displayName
      })
    },
    computed: {
      ...mapGetters(["name","userInfo"])
    },
    methods: {
      async init () {
        let AuthList = (await userAuth()).data;
        let sectionOperations = (await userAuth(this.userId)).data.sectionOperations;
        // if(this.userInfo.isAdmin){
        //   AuthList.map((item)=>{
        //     item.sectionOperations.map((value)=>{
        //       value.selected = true;
        //       value.clicked = false;
        //       value.visible = true;
        //     })
        //   })
        // }else{
          sectionOperations.map(item=>{                                 
            let hasAuthList = item.operations.map( auth => auth.qcOperationCode )
            AuthList.map(val => {
              if(item.qcSectionCode == val.sectionCode){
                val.sectionOperations.map((data)=>{                   
                  if(hasAuthList.includes(data.qcOperationCode)){   
                    data.selected = true;
                    data.clicked = false;
                    data.visible = true;
                  }else{
                    data.selected = false;
                    data.clicked = false;
                    data.visible = true;
                  }
                })
              }else{
                val.sectionOperations.map((value)=>{
                  // value.selected = true;
                  value.clicked = false;
                  value.visible = true;
                })
              }          
            })
          })
        // }      
        this.list = AuthList
      },
      doSearch () {
        if(this.srcList.length){          
          let changeList = this.list.map(data => data.sectionCode)
          this.srcList.map(item => {
            if(changeList.includes(item.sectionCode)){
              let sameOne = this.list.find(val => val.sectionCode == item.sectionCode)
              item.sectionOperations = sameOne.sectionOperations
            }
          })          
        }else{          
          this.srcList = this.list
        }

        let list = this.srcList
        let newList = this.listFilter(this.query, list)

        if(this.searchAuth){
          newList.map(data => {
            data.sectionOperations.map(item => {
                item.visible = item.operatioDescription.includes(this.searchAuth)
            })
          })
        }else{
          newList.map(data => {
            data.sectionOperations.map(item => {
                item.visible = true
            })
          })
        }
        
        this.list = newList
      },
      doSave () {
        if(this.query.sectionCode || this.query.sectionDescription){
          this.query.sectionCode = ''
          this.query.sectionDescription = ''
          this.doSearch()
        }
        let sectionOperations = []
        this.list.map(item => {
          let operations = []
          item.sectionOperations.map(data => {
            if(data.clicked || data.selected){
              operations.push({
                id: 0,
                qcOperationId: data.qcOperationId,
                qcOperationCode: data.qcOperationCode
              })              
            }            
          })
          sectionOperations.push({
            qcSectionId: item.qcSectionId,
            qcSectionCode: item.sectionCode,
            operations
          })
        })
        sectionOperations = sectionOperations.filter(item => {
          return item.operations.length > 0 
        })
        
        // console.log(this.srcList,sectionOperations)
        authSave({
          qcUserId: this.userId,
          sectionOperations
        })
        .then(response => {
          if (response.status === 200) {
            this.isLoading = false
            this.$message({
              type: 'success',
              message: '配置成功'
            })
            if(this.userId == this.userInfo.userId){
              this.$router.go(0);
            }else{
              this.init()
            }
          }
        })
        .catch(() => {
          this.isLoading = false
        })
      },
      queryClear () {
        this.query = {
          sectionCode: '',
          sectionDescription: '',
        }
        this.searchAuth = ''
      },
      listFilter(condition, data){
        return data.filter(item => {
          return Object.keys(condition).every(key => {
            return String(item[key]).toLowerCase().includes(
              String(condition[key]).trim().toLowerCase())
          })
        })
      },

      toggleSelectAll (val) {
        let old = this.list
        old.map(item =>{          
          item.sectionOperations.map(value =>{
            if(value.visible){
              value.clicked = val
              value.selected = false
            }            
          })
        })
        this.list = old
      },
      handleCloneBox () {
        this.dialogVisible = true
        this.allUser = this.userList.filter(val => !val.isAdmin)        
      },
      handleChoosed (data,index) {
        let old = this.list
        old.map(item =>{
          if(item.sectionCode == data.sectionCode){
            let oldSelected = item.sectionOperations[index].selected
            item.sectionOperations[index].selected = false
            item.sectionOperations[index].clicked = !oldSelected ? !item.sectionOperations[index].clicked : false
          }
        })
        this.list = old
      },
      handleClone () {
        clone({
          fromUserId: this.copyUser,
          toUserId: +this.userId
        })
        .then( response => {
          if (response.status === 200) {
            this.isLoading = false
            this.dialogVisible = false
            this.$message({
              type: 'success',
              message: '复制成功'
            })
            if(this.userId == this.userInfo.userId){
              this.$router.go(0);
            }else{
              this.init()
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  .container {
    margin-top: 20px;
  }

  .item-select {
    width: 100%;
  }

  .operation-btn {
    font-size: 18px;
  }
  /* .el-button:focus, .el-button:hover{
    color: inherit;
    background-color: inherit;
  } */
  .authTable .el-button+.el-button {
    margin-left: 0
  }
  .authTable .el-button--small, .el-button--small.is-round{
    margin-right: 10px;
  }
</style>
