<template>
  <div class="container">
    <h2>這是後台</h2>
    <nav>
        <RouterLink to="/admin/products">產品列表</RouterLink> |
        <RouterLink to="/admin/order">訂單列表</RouterLink> |
        <RouterLink to="/">回到前台</RouterLink>
        <router-view></router-view>
    </nav>
  </div>
</template>

<script>
import axios from 'axios';

const { VITE_URL } = import.meta.env;

export default {
  methods: {
    checkAdmin() {
      const url = `${VITE_URL}/v2/api/user/check`;
      axios.post(url)
        .then((res) => {
          console.log('驗證成功', res.data.success);
        })
        .catch(() => {
          // console.log(err);
          this.$router.push('/login');
        });
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;

    this.checkAdmin();
  },
};
</script>

<style scoped>
</style>
