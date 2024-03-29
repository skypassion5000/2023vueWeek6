import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'bootstrap/scss/bootstrap.scss';
// 匯入vee-validate
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Form, Field, ErrorMessage, defineRule, configure,
} from 'vee-validate';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AllRules from '@vee-validate/rules';
// eslint-disable-next-line import/no-extraneous-dependencies
import { localize, setLocale } from '@vee-validate/i18n';
// eslint-disable-next-line import/no-extraneous-dependencies
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import App from './App.vue';
import router from './router';
// vee-validate 規則
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});
configure({
  generateMessage: localize({ zh_TW: zhTW }), // 載入繁體中文語系
  validateOnInput: true, // 當輸入任何內容直接進行驗證
});
// 設定預設語系
setLocale('zh_TW');

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('VForm', Form);
app.component('VField', Field);
app.component('ErrorMessage', ErrorMessage);
app.mount('#app');
