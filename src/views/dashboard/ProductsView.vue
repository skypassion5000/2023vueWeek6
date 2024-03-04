<template>
  <div class="mt-4">
    <h2>這裡是 後台 產品列表</h2>
    <table class="table mt-4">
      <thead>
        <tr>
          <th width="120">分類</th>
          <th>產品名稱</th>
          <th width="120">原價</th>
          <th width="120">售價</th>
          <th width="100">是否啟用</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td>{{ item.category }}</td>
          <td>{{ item.title }}</td>
          <td class="text-end">
            {{ item.origin_price }}
          </td>
          <td class="text-end">
            {{ item.price }}
          </td>
          <td>
            <span v-if="item.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
        </tr>
      </tbody>
    </table>
    <PaginationComponent :pages="pagination" @emit-pages="getProducts" />
  </div>
</template>

<script>
import axios from 'axios';
import PaginationComponent from '@/components/PaginationComponent.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  props: ['token'],
  data() {
    return {
      products: [],
      pagination: {},
    };
  },
  components: {
    PaginationComponent,
  },
  methods: {
    getProducts(page = 1) {
      // API
      const api = `${VITE_URL}/v2/api/${VITE_PATH}/admin/products?page=${page}`;
      axios.get(api)
        .then((response) => {
          this.products = response.data.products;
          this.pagination = response.data.pagination;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    this.getProducts();
  },
};
</script>
