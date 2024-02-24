<template>
  <div class="mt-4">
    <!-- 產品列表 -->
    <h2>產品列表</h2>
    <table class="table align-middle">
      <thead>
        <tr>
          <th>圖片</th>
          <th>商品名稱</th>
          <th>價格</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in products" :key="item.id">
          <td style="width: 200px">
            <div
              style="
                height: 100px;
                background-size: cover;
                background-position: center;
              "
            ></div>
          </td>
          <td>{{ item.title }}</td>
          <td>
            <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
            <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
            <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
          </td>
          <td>
            <div class="btn-group btn-group-sm">
              <!-- getProduct(item.id)、disabled、loadingStatus -->
              <button type="button"
                class="btn btn-outline-secondary"
                @click="getProduct(item.id)"
                :disabled="loadingStatus.loadingItem === item.id || !item.is_enabled">
                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.loadingItem === item.id"></i>
                查看更多
              </button>
              <button type="button" class="btn btn-outline-danger" @click="addToCart(item.id)">
                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.loadingItem === item.id"></i>
                加到購物車
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- 產品Modal -->
    <UserProductModal ref="userProductModal"
    :product="product" @add-to-cart="addToCart"></UserProductModal>
  </div>
</template>

<script>
import axios from 'axios';
import UserProductModal from '@/components/UserProductModal.vue';

const { VITE_URL, VITE_PATH } = import.meta.env;

export default {
  data() {
    return {
      loadingStatus: {
        loadingItem: '',
      },
      products: [],
      product: {},
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      cart: {},
    };
  },
  // VeeValidate 註冊元件
  components: {
    UserProductModal,
  },
  mounted() { // 初始化
    this.getProducts();
    this.getCart();
  },
  methods: {
    getProducts() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/products`;
      axios.get(url)
        .then((response) => {
          this.products = response.data.products;
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/product/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.get(url).then((response) => {
        this.loadingStatus.loadingItem = '';
        this.product = response.data.product;
        // 控制 Vue元件
        this.$refs.userProductModal.openModal();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    getCart() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart`;
      axios.get(url).then((response) => {
        this.cart = response.data.data;
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    addToCart(id, qty = 1) {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart`;
      this.loadingStatus.loadingItem = id;
      const cart = {
        product_id: id,
        qty,
      };
      // 隱藏 userProductModal
      this.$refs.userProductModal.hideModal();
      axios.post(url, { data: cart }).then((response) => {
        alert(response.data.message);
        this.loadingStatus.loadingItem = '';
        // 取得購物車資訊去渲染
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    deleteAllCarts() {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/carts`;
      axios.delete(url).then((response) => {
        alert(response.data.message);
        this.getCart();
      }).catch((err) => {
        alert(err.response.data.message);
      });
    },
    removeCartItem(id) {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart/${id}`;
      this.loadingStatus.loadingItem = id;
      axios.delete(url)
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
    updateCart(data) {
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/cart/${data.id}`;
      this.loadingStatus.loadingItem = data.id;
      const cart = {
        product_id: data.product_id,
        qty: data.qty,
      };
      axios.put(url, { data: cart })
        .then((response) => {
          alert(response.data.message);
          this.loadingStatus.loadingItem = '';
          this.getCart();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
    createOrder() {
      // console.log(this.form.user,"form");
      const url = `${VITE_URL}/v2/api/${VITE_PATH}/order`;
      const order = this.form;
      axios.post(url, { data: order })
        .then((response) => {
          alert(response.data.message);
          this.$refs.form.resetForm();
          this.getCart();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
};
</script>
