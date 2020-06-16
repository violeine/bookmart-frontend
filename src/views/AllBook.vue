<template>
  <div>
    <select name="categories" v-model="categoriesSelected" multiple id>
      <option value="all">All books</option>
      <option
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
      >{{category.name}}</option>
    </select>
    <button v-if="categoriesSelected.length>1" class="block mx-auto" @click="change">{{filterBy}}</button>
    <router-link tag="div" v-for="book in renderedBook" :key="book.id" :to="`/book/${book.id}`">
      <span class="text-gray-700 text-md block">{{book.name}}</span>
      <span class="text-red-400 text-xs block">{{book.author}}</span>
      <div>
        <span
          v-for="category in book.categories"
          :key="category.id"
          class="text-xs text-blue-300 inline-block mr-1"
        >{{category.name}}</span>
      </div>
      <hr />
    </router-link>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data: function() {
    return {
      books: [],
      categories: [],
      categoriesSelected: ["all"],
      filterBy: "all"
    };
  },
  computed: {
    renderedBook: function() {
      if (this.filterBy == "all") {
        return this.books;
      } else if (this.filterBy == "and") {
        return this.books.filter(el => el.isIncludeAll);
      } else {
        return this.books;
      }
    }
  },
  methods: {
    checkStrict: function(array1, array2) {
      //check array1 inside array2
      console.log("is ", array1, " inside ", array2);
      return array1.every(el => array2.includes(el));
    },
    change: function() {
      if (this.filterBy == "and") this.filterBy = "or";
      else this.filterBy = "and";
    }
  },

  apollo: {
    books: {
      query: function() {
        if (
          this.categoriesSelected[0] == "all" &&
          this.categoriesSelected.length == 1
        ) {
          return gql`
            query {
              books {
                id
                name
                author
                categories {
                  id
                  name
                }
              }
            }
          `;
        } else
          return gql`
            query filterBookByCategory($id: [Int!]) {
              filterBookByCategory(id: $id) {
                name
                id
                author
                categories {
                  id
                  name
                }
              }
            }
          `;
      },
      variables() {
        if (
          !(
            this.categoriesSelected[0] == "all" &&
            this.categoriesSelected.length == 1
          )
        ) {
          return {
            id: this.categoriesSelected.map(el => Number(el))
          };
        }
      },
      update: function(data) {
        if (
          this.categoriesSelected.length == 1 &&
          this.categoriesSelected[0] == "all"
        ) {
          this.filterBy = "all";
          return data.books;
        } else {
          this.filterBy = "and";
          return data.filterBookByCategory
            .map(book => {
              return {
                ...book,
                categoriesArray: book.categories.map(el => Number(el.id))
              };
            })
            .map(el => {
              var isIncludeAll = this.checkStrict(
                this.categoriesSelected.map(el => Number(el)),
                el.categoriesArray
              );
              console.log("a", isIncludeAll);
              return {
                ...el,
                isIncludeAll
              };
            });
        }
      }
    },
    categories: gql`
      query {
        categories {
          id
          name
        }
      }
    `
  }
};
</script>
