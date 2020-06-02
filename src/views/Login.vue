<!--<template>
  <form action="#">
    <div class="container">
      <div class="flex flex-col">
        <label for="username" class="mb-1">
          username
          <input
            type="text"
            name="username"
            id="username"
            class="border border-gray-500 rounded-lg"
          />
        </label>
        <label for="password">
          password
          <input
            type="password"
            name="password"
            id="password"
            class="border border-gray-500 rounded-lg"
          />
        </label>
      </div>
      <button class="rounded-sm bg-gray-400 p-2 py-1">login</button>
    </div>
  </form>
</template>     -->
<template>
  <div class="w-full max-w-xs container">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          placeholder="Username"
        />
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
        <input
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          id="password"
          type="password"
          placeholder="******************"
        />
        <!--<p class="text-red-500 text-xs italic">Please choose a password.</p> -->
      </div>
      <div class="flex items-center justify-between">
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
        >Sign In</button>
        <a
          class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          href="#"
        >Forgot Password?</a>
      </div>
      <router-link
        to="/signup"
        class="text-center text-gray-500 text-xs block mt-5"
      >Don't have an account, Sign Up now</router-link>
    </form>
  </div>
</template>