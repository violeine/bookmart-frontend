<template>
  <div id="app" class="container bg-gray-400 shadow-md">
    <div id="nav" class="flex pt-3 bg-green-300">
      <div class="ml-6">
        <router-link class="text-lg text-indigo-600" tag="div" to="/"
          >Bookmart</router-link
        >
      </div>
      <div class="ml-auto">
        <span v-if="login">
          <router-link class="inline-block mr-4 nav-button" to="/user"
            >User</router-link
          >
          <router-link
            tag="div"
            to="/submitbook"
            class="nav-button inline-block mr-4 cursor-pointer"
            >Submit Book</router-link
          >
          <a
            href="#"
            class="router-link-exact-active nav-button inline-block mr-4"
            @click="logout"
            >Log out</a
          >
        </span>
        <span v-else>
          <router-link class="inline-block mr-4 nav-button" to="/login"
            >Login</router-link
          >
          <router-link to="/signup" class="nav-button mr-4"
            >Sign up</router-link
          >
        </span>
      </div>
    </div>

    <router-view id="content" class="box-border" />
  </div>
</template>

<style>
.router-link-exact-active {
  @apply text-blue-600;
}
#app {
  min-height: 100vh;
}
#nav {
  height: 5vh;
}
#content {
  min-height: 95vh;
}
</style>

<script>
import { onLogout } from "./vue-apollo";
export default {
  computed: {
    login: function() {
      return this.$root.$data.isLogin;
    },
  },
  methods: {
    logout: function() {
      onLogout(this.$apolloProvider.defaultClient);
      this.$root.$data.isLogin = false;
      this.$root.$data.userData = null;
      localStorage.removeItem("userData");
      this.$router.push("/");
    },
  },
};
</script>
