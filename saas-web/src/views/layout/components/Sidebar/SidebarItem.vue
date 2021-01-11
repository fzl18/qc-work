<template>
  <div v-if="!item.hidden && item.children && !item.hiddenSubMenu" class="menu-wrapper">

    <router-link v-if="hasOneShowingChild(item.children) && !onlyOneChild.children&&!item.alwaysShow"
                 :to="resolvePath(onlyOneChild.path)">
      <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <svg-icon v-if="onlyOneChild.meta && onlyOneChild.meta.icon" :icon-class="onlyOneChild.meta.icon" />
        <span v-if="onlyOneChild.meta&&onlyOneChild.meta.title" slot="title">{{onlyOneChild.meta.title}}</span>
      </el-menu-item>
    </router-link>

    <el-submenu v-else :index="item.name || item.path">
      <template slot="title">
        <svg-icon v-if="item.meta && item.meta.icon" :icon-class="item.meta.icon" />
        <span v-if="item.meta && item.meta.title" slot="title">{{item.meta.title}}</span>
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item class="nest-menu"
                      :is-nest="true"
                      v-if="child.children && child.children.length"
                      :item="child" :key="child.path"
                      :base-path="resolvePath(child.path)">
        </sidebar-item>

        <router-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item :index="resolvePath(child.path)" :title="child.meta.title">
            <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon" />
            <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}} </span>
          </el-menu-item>
        </router-link>
      </template>
    </el-submenu>

  </div>
  <div v-else-if="item.hiddenSubMenu">
    <router-link :to="resolvePath()">
      <el-menu-item :index="resolvePath()">
        <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
      </el-menu-item>
    </router-link>
  </div>
</template>

<script>
  import path from 'path'
  import { mapGetters } from "vuex";
  export default {
    name: 'SidebarItem',
    props: {
      item: {
        type: Object,
        required: true
      },
      isNest: {
        type: Boolean,
        default: false
      },
      basePath: {
        type: String,
        default: ''
      }
    },
    data () {
      return {
        onlyOneChild: null
      }
    },
    created(){
      if(!this.userInfo.isAdmin){
        let sectionOperations = this.userInfo.userAuth.sectionOperations
        let sectionOperationsList = sectionOperations.map(item => item.qcSectionCode)
        if(!this.item.hidden){
          if(this.item.children && this.item.children[0].name === 'dashboard') { return }
          let newMenu = []
          this.item.children && this.item.children.map(item => {
            if (sectionOperationsList.includes(item.meta.sectionCode)){
              let findOne = sectionOperations.find(data => data.qcSectionCode == item.meta.sectionCode)
              findOne.operations.map(val => {
                if(val.qcOperationCode == 'list'){
                  newMenu.push(item)
                }
              })
            }
          })
          if(newMenu.length){
            this.item.children = newMenu
          }else{
            this.item.hidden = true
          }
        }
      }      
    },
    computed: {
      ...mapGetters(["userInfo"])
    },
    methods: {
      hasOneShowingChild (children) {
        const showingChildren = children.filter(item => {
          if (item.alwaysShow || item.hidden) {
            return false
          } else {
            this.onlyOneChild = item
            return true
          }
        })
        return showingChildren.length === 1
      },
      resolvePath (...paths) {
        return path.resolve(this.basePath, ...paths)
      }
    }
  }
</script>
