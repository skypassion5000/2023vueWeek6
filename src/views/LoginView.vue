<template>
  <h2>登入列表</h2>
  <div class="container">
    <div class="row justify-content-center">
      <h1 class="h3 mb-3 font-weight-normal">
        請先登入
      </h1>
      <div class="col-8">
        <form class="form-signin" @submit.prevent="login">
          <div class="form-floating mb-3">
            <input type="email" class="form-control" v-model="user.username" id="floatingInput"
              placeholder="name@example.com" required autofocus>
            <label for="floatingInput">Email address</label>
          </div>
          <div class="form-floating">
            <input type="password"
              class="form-control"
              v-model="user.password"
              id="floatingPassword"
              placeholder="Password" required>
            <label for="floatingPassword">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="submit">
            登入
          </button>
        </form>
      </div>
    </div>
    <p class="mt-5 mb-3 text-muted">
      &copy; 2023~∞ - 六角學院
    </p>
  </div>
</template>

<script>
import axios from 'axios';

const site = 'https://vue3-course-api.hexschool.io/v2/';

export default {
  data() {
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      const api = `${site}admin/signin`;
      axios.post(api, this.user).then((response) => {
        const { token, expired } = response.data;
        console.log(token, expired);
        // 寫入 cookie token
        // expires 設置有效時間
        document.cookie = `hexToken=${token};expires=${new Date(expired)}; path=/`;
        // window.location = 'products.html';
      }).catch(() => {
        // alert(err.response.data.message);
        alert('登入失敗');
      });
    },
  },
};
</script>
