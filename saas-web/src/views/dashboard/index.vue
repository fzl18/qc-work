<template>
    <div class="dashboard-container">
        <el-row :gutter="12">
            <el-col :span="8">
                <el-card shadow="always">
                    <p>userId：{{userInfo.userId}}</p>
                    <p>username：{{userInfo.username}}</p>
                    <p>displayName：{{userInfo.displayName}}</p>
                    <p>email：{{userInfo.email}}</p>
                    <p>phone：{{userInfo.phone}}</p>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "dashboard",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["userInfo"])
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
