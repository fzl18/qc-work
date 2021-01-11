<template>
  <div>
      <slot name="queryArea"></slot>
      <div class="button-area">
        <template v-for="(moduleItem, moduleIndex) in data">
          <Divider :key="moduleItem.text + moduleIndex">{{moduleItem.text}}</Divider>
          <div :key="'div' + moduleIndex" class="button-content">
            <template v-for="(buttonItem, buttonIndex) in moduleItem[itemKey]">
              <Button
                @click="changeButton({buttonItem, moduleIndex, buttonIndex})"
               :class="['button-style', buttonItem.isSelected ? 'seleced':'']"
               :key="buttonItem.Note + buttonIndex"
               >{{buttonItem.Note}}</Button
              >
            </template>
          </div>
        </template>
      </div>
  </div>
</template>

<script>
/*global _*/
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    originPrivilegeData: {
      type: Array,
      default: () => []
    },
    itemKey: {
      type: String,
      default: 'item'
    }
  },
  computed: {
    allButtons() {
      let buttonInModule = _.map(this.originPrivilegeData,  function (r) {
        return _.filter(r.item, function (d) {
          return d.isSelected
        });
      })
      return _.union(...buttonInModule)
    },
    caculIsSelectAll() {
      let isSelectAll = true
      this.data.forEach(data => {
        data.item.forEach(d => {
          if(!d.isSelected) {
            isSelectAll = false
          }
        })
      })
      return isSelectAll
    }
  },
  watch: {
    caculIsSelectAll(newVal) {
      if(newVal) {
        this.$emit('changeButtonStatus', {caculIsSelectAll: this.caculIsSelectAll})
      } else {
        this.$emit('changeButtonStatus', {caculIsSelectAll: this.caculIsSelectAll})
      }
    }
  },
  methods: {
    changeButton(item) {
      this.$emit('changeButtonStatus', {...item})
    },
    getAllSelected: function () {
      return _.map(this.allButtons, 'FunctionId')
    },
  }
}
</script>

<style lang="less" scoped>
.button-content {
  display: flex;
  // justify-content: space-between;
  flex-wrap: wrap;
}
.button-style {
  width: 200px;
  margin: 5px 8px 5px 0;
}
.seleced {
  background-color: #2db7f5;
  color: white;
}
.button-area {
  max-height: 550px;
  overflow-y: scroll;
}
</style>