import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { createProvider } from "./vue-apollo";
import store from "./store";
import Notifications from "vue-notification";
import "./assets/tailwind.css";

Vue.config.productionTip = false;
Vue.use(Notifications);

new Vue({
  router,
  apolloProvider: createProvider(),
  store,
  render: (h) => h(App),
  data: {
    isLogin: localStorage.getItem("apollo-token") ? true : false,
    userData: localStorage.getItem("userData"),
  },
}).$mount("#app");
