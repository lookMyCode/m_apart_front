<template>
  <v-layout class="auth_page">
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>


<script>
export default {
  
}
</script>


<style scoped>
  .auth_page {
    background: linear-gradient(rgba(17, 28, 36, 0.6), rgba(17, 28, 36, 0.6)), url(../../../assets/auth_bg.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    display: flex;
    flex-direction: column;
  }
</style>