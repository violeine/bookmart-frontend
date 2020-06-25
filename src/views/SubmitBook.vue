<template>
  <div class="w-full pt-32 max-w-md container">
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
          >Book title</label
        >
        <input
          type="text"
          v-model="name"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2 " for="name"
          >Category</label
        >
        <select
          name="Category"
          v-model="selectedCategory"
          multiple
          class="appearance-none w-full shadow border rounded py-2 px-3"
        >
          <option
            v-for="category in queriedCategory"
            :key="category.id"
            :value="category"
            >{{ category.name }}</option
          >
        </select>
      </div>
      <div class="mb-4">
        <label
          class="block text-gray-700 text-sm font-bold mb-2"
          for="newCategory"
          >Dont have category? add one!!</label
        >
        <input
          type="text"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
          v-model="newCategory"
          @keydown.enter.prevent="addCategory"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="author"
          >Author</label
        >
        <input
          type="text"
          v-model="author"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
        />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="name"
          >img</label
        >
        <input
          type="tet"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight"
        />
      </div>

      <button
        class="block ml-auto rounded px-4 py-2 bg-green-500"
        @click.prevent="submit"
      >
        submit
      </button>
    </form>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data: function() {
    return {
      name: "",
      author: "",
      selectedCategory: [],
      queriedCategory: [],
      newCategory: "",
    };
  },
  apollo: {
    queriedCategory: {
      query: gql`
        query {
          categories {
            id
            name
          }
        }
      `,
      update: (data) => {
        return data.categories.map(function(el) {
          return { id: el.id, name: el.name };
        });
      },
    },
  },
  methods: {
    submit: function() {
      console.log("submitting ");
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: AddBookInput!) {
              addBook(input: $input) {
                name
                categories {
                  name
                  id
                }
              }
            }
          `,
          variables: {
            input: {
              name: this.name,
              author: this.author,
              categories: {
                upsert: this.selectedCategory,
              },
            },
          },
        })
        .then((data) => console.log(data))
        .catch((err) => console.warn(err));
    },
    addCategory: function(e) {
      if (e.keyCode == 13 && this.newCategory != "") {
        this.queriedCategory.push({
          name: this.newCategory,
          id: `${this.queriedCategory.length + 1}`,
        });
        this.newCategory = "";
      }
    },
  },
};
</script>
