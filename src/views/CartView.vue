<template>
  <h2>購物車列表</h2>
  <div class="mt-4">
    <!-- 購物車列表 -->
    <div class="text-end">
      <button class="btn btn-outline-danger" type="button" @click="deleteAllCarts">
        清空購物車
      </button>
    </div>
    <table class="table align-middle">
      <thead>
        <tr>
          <th></th>
          <th>品名</th>
          <th style="width: 150px">數量/單位</th>
          <th>單價</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="cart.carts">
          <tr v-for="item in cart.carts" :key="item.id">
            <td>
              <button type="button"
              class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)"
              :disabled="loadingStatus.loadingItem === item.id">
                <i class="fas fa-spinner fa-pulse" v-if="loadingStatus.loadingItem === item.id"></i>
                x
              </button>
            </td>
            <td>
              {{ item.product.title }}
              <div class="text-success" v-if="item.coupon">已套用優惠券</div>
            </td>
            <td>
              <div class="input-group input-group-sm">
                <div class="input-group mb-3">
                  <input v-model.number="item.qty" @blur="updateCart(item)"
                  :disabled="loadingStatus.loadingItem === item.id"
                  min="1" type="number" class="form-control"/>
                  <span class="input-group-text" id="basic-addon2"
                    >{{ item.product.unit }}</span
                  >
                </div>
              </div>
            </td>
            <td class="text-end">
              <small v-if="cart.final_total !== cart.total" class="text-success">折扣價：</small>
              {{ item.final_total }}
            </td>
          </tr>
        </template>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="3" class="text-end">總計</td>
          <td class="text-end">{{ cart.total }}</td>
        </tr>
        <tr v-if="cart.final_total !== cart.total">
          <td colspan="3" class="text-end text-success">折扣價</td>
          <td class="text-end text-success">{{ cart.final_total }}</td>
        </tr>
      </tfoot>
    </table>
    <!-- 表單驗證 -->
    <div class="my-5 row justify-content-center">
      <v-form ref="form" class="col-md-6" v-slot="{ errors }" @submit="createOrder">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <v-field
            id="email"
            name="email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': errors['email'] }"
            placeholder="請輸入 Email"
            rules="email|required"
            v-model="form.user.email"
          ></v-field>
          <error-message
            name="email"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="name" class="form-label">收件人姓名</label>
          <v-field
            id="name"
            name="姓名"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['姓名'] }"
            placeholder="請輸入姓名"
            rules="required"
            v-model="form.user.name"
          ></v-field>
          <error-message
            name="姓名"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="tel" class="form-label">收件人電話</label>
          <v-field
            id="tel"
            name="電話"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['電話'] }"
            placeholder="請輸入電話"
            rules="required|min:8|max:10" v-model="form.user.tel"
          ></v-field>
          <error-message
            name="電話"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">收件人地址</label>
          <v-field
            id="address"
            name="地址"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors['地址'] }"
            placeholder="請輸入地址"
            rules="required"
            v-model="form.user.address"
          ></v-field>
          <error-message
            name="地址"
            class="invalid-feedback"
          ></error-message>
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">留言</label>
          <textarea
            id="message"
            class="form-control"
            cols="30"
            rows="10"
            v-model="form.message"
          ></textarea>
        </div>
        <div class="text-end">
          <button type="submit" class="btn btn-danger">送出訂單</button>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

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
    // VForm: Form,
    // VField: Field,
    // ErrorMessage,
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
