<template>
  <div class="w-full max-w-md container">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-32">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="email">email</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="email"
          type="email"
          v-model="email"
          placeholder="your email here"
          required
        />
        <span
          class="text-red-500 text-xs italic"
          v-show="!email&&toggleSubmit"
        >this is a required fields</span>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
          v-model="password"
          required
        />
        <!--<p class="text-red-500 text-xs italic">Please choose a password.</p> -->
        <span
          v-show="!password&&toggleSubmit"
          class="text-red-500 text-xs italic"
        >this is a required fields</span>
      </div>
      <div class="mb-6">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="password"
        >retype your password</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="retype-password"
          :class="classRetype"
          v-model="retypePassword"
          type="password"
          placeholder="******************"
          required
        />
        <span
          v-show="!retypePassword&&toggleSubmit"
          class="text-red-500 text-xs italic"
        >this is a required fields</span>
        <!--<p class="text-red-500 text-xs italic">Please choose a password.</p> -->
      </div>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-auto focus:outline-none focus:shadow-outline"
        type="button"
        @click="submit()"
      >Sign up now</button>
      <router-link
        to="/login"
        class="text-center text-gray-500 text-xs block mt-5"
      >Already have an account, Login now!!</router-link>
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
      retypePassword: "",
      toggleSubmit: false
    };
  },
  computed: {
    classRetype: function() {
      return {
        "bg-red-300":
          this.password != this.retypePassword &&
          this.retypePassword != "" &&
          this.password != ""
      };
    }
  },
  methods: {
    submit: function() {
      //check unfilled input and mark red ??
      this.toggleSubmit = true;
      this.email &&
        this.password &&
        this.retypePassword &&
        this.retypePassword == this.password &&
        this.$apollo
          .mutate({
            mutation: gql`
              mutation($input: RegisterInput) {
                register(input: $input) {
                  tokens {
                    access_token
                    user {
                      id
                    }
                  }
                }
              }
            `,
            variables: {
              input: {
                email: this.email,
                password: this.password,
                password_confirmation: this.retypePassword,
                name: this.email.split("@")[0]
              }
            }
          })
          .then(data => {
            this.$root.$data.isLogin = true;
            this.$root.$data.userData = data.data.login.user.id;
            localStorage.setItem("userData", data.data.login.user.id);
            console.log(this.$root.$data.isLogin);
            onLogin(
              this.$apolloProvider.defaultClient,
              data.data.login.access_token
            );
            this.$notify({
              group: "noti",
              type: "success",
              title: "important message",
              text: "Login successfully"
            });
            this.$router.go(-1);
          });
    }
  }
};
</script>
