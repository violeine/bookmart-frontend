<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>|
      <span v-if="login">
        <router-link to="/user">User</router-link>|
        <router-link to="/submitbook">Submit Book</router-link>|
        <a href="#" class="router-link-excal-active" @click="logout">Log out</a>
      </span>
      <span v-else>
        <router-link to="/login">Login</router-link>|
        <router-link to="/signup">Sign up</router-link>
      </span>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<script>
import { onLogout } from "./vue-apollo";
export default {
  computed: {
    login: function() {
      return this.$root.$data.isLogin;
    }
  },
  methods: {
    logout: function() {
      onLogout(this.$apolloProvider.defaultClient);
      this.$root.$data.isLogin = false;
      this.$root.$data.userData = null;
    }
  }
};
</script>