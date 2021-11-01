import Vue from 'vue';
import axios from 'axios';
// import { MdButton, MdContent, MdTabs, MdTable, MdCard, MdInput } from 'vue-material/dist/components';
import VueMaterial from 'vue-material';
import App from './App.vue';
import 'vue-material/dist/vue-material.min.css';
// import 'vue-material/dist/theme/default.css';
import 'vue-material/dist/theme/default-dark.css';
import VueSessionStorage from 'vue-sessionstorage';

// Vue.use(MdButton);
// Vue.use(MdContent);
// Vue.use(MdTabs);
// Vue.use(MdTable);
// Vue.use(MdCard);
// Vue.use(MdInput);
Vue.use(VueMaterial);
Vue.use(VueSessionStorage);
Vue.prototype.$axios = axios;

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
