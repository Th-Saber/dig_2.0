<template>
  <el-tabs v-model="activeName" type="card" class="setDeal">
    <el-tab-pane label="用户管理" name="user" lazy>
      <role-user />
    </el-tab-pane>
    <el-tab-pane label="角色管理" name="role" lazy>
      <role-page />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import RoleUser from "./items/RoleUser";
import RolePage from "./items/RolePage";
export default {
  components: { RoleUser, RolePage },
  data() {
    return {
      activeName: "user",
    };
  },
};
</script>

<style lang="less" scoped></style>
