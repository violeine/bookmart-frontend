<template>
  <div class="w-full max-w-md pt-32 container">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email"
          >email</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          placeholder="email"
          v-model="email"
        />
        <span
          class="text-red-500 text-xs italic"
          v-show="!email && toggleSubmit"
          >this is a required fields</span
        >
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password"
          >Password</label
        >
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
          v-model="password"
        />
        <span
          class="text-red-500 text-xs italic"
          v-show="!password && toggleSubmit"
          >this is a required fields</span
        >
        <!--<p class="text-red-500 text-xs italic">Please choose a password.</p> -->
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          @click="submit()"
        >
          Sign In
        </button>
        <a
          class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          href="#"
          >Forgot Password?</a
        >
      </div>
      <router-link
        to="/signup"
        class="text-center text-gray-500 text-xs block mt-5"
        >Don't have an account, Sign Up now</router-link
      >
    </form>
  </div>
</template>
<script>
import gql from "graphql-tag";
import { onLogin } from "../vue-apollo";
export default {
  data: function() {
    return {
      email: "",
      password: "",
      toggleSubmit: false,
    };
  },
  methods: {
    submit: function() {
      //toggle the submit to check validation
      this.toggleSubmit = true;
      // validate stuff, if statisfy all then process to login
      this.email &&
        this.password &&
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($input: LoginInput) {
                login(input: $input) {
                  access_token
                  user {
                    id
                  }
                }
              }
            `,
            variables: {
              input: {
                username: this.email,
                password: this.password,
              },
            },
          })
          .then((data) => {
            console.log(data);
            this.$root.$data.isLogin = true;
            this.$root.$data.userData = data.data.login.user.id;
            localStorage.setItem("userData", data.data.login.user.id);
            console.log(this.$root.$data.isLogin);
            onLogin(
              this.$apolloProvider.defaultClient,
              data.data.login.access_token
            );
            this.$router.go(-1);
          })
          .catch((err) => console.log(err));
    },
  },
};
</script>
