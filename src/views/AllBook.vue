<template>
  <div class="flex flex-wrap">
    <div class="left">
      <div class="h-full flex flex-col bg-gray-700">
        <span
          v-if="categoriesSelected.length > 1"
          class="text-orange-500 px-3 pt-3 ml-3"
          @click="change"
        >Filter with: {{ filterBy }}</span>
        <select
          class="block appearance-none w-full outline-none h-full bg-transparent overflow-y-hidden mb-5"
          name="categories"
          v-model="categoriesSelected"
          multiple
          id
        >
          <option value="all" class="opt">All books</option>

          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            class="opt"
          >{{ category.name }}</option>
        </select>
      </div>
    </div>

    <div class="right pb-5">
      <router-link
        tag="div"
        class="book"
        v-for="book in renderedBook"
        :key="book.id"
        :to="`/book/${book.id}`"
      >
        <span class="text-indigo-600 text-sm block">{{ book.name }}</span>
        <span class="text-red-500 text-xs block mb-1">{{ book.author }}</span>
        <img :src="book.image" alt="book img" class="h-64 block mx-auto" />
        <div>
          <span
            v-for="category in book.categories"
            :key="category.id"
            class="text-xs text-blue-500 inline-block mr-1"
          >{{ category.name }}</span>
        </div>
        <span
          v-if="login && me && me.includes(book.id)"
          class="block text-green-600 mx-auto px-1 py-1"
        >You own this book</span>
        <button
          @click.stop="add(book.id)"
          v-else-if="login && me"
          class="inline-block text-gray-300 mx-auto px-1 py-1 border border-transparent rounded-md bg-teal-400"
        >Add to your library</button>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
.left {
  @apply w-1/4 p-5;
}
.right {
  @apply flex flex-wrap w-3/4 pt-5;
}
.book {
  @apply w-1/3 mb-4 text-center;
}
.book:hover {
  @apply w-1/3 mb-3 text-center shadow;
}
.opt {
  @apply block p-3 m-3 text-lg text-indigo-500;
}
</style>
<script>
import gql from "graphql-tag";
export default {
  data: function() {
    return {
      books: [],
      categories: [],
      categoriesSelected: ["all"],
      filterBy: "all",
      me: undefined
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
    },
    login: function() {
      return this.$root.$data.isLogin;
    }
  },
  methods: {
    add: function(id) {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: UpdateReviewInput!) {
              updateReview(input: $input) {
                id
              }
            }
          `,
          variables: {
            input: {
              id: this.$root.userData,
              books: {
                syncWithoutDetaching: [{ id: id, owned: true }]
              }
            }
          }
        })
        .then(data => {
          console.log(data);
          this.$notify({
            group: "noti",
            type: "success",
            title: "important message",
            text: "Add book successfully"
          });
          this.$apollo.queries.me.refetch();
        })
        .catch(err => {
          console.log(err);
          this.$notify({
            group: "noti",
            type: "error",
            title: "Important message",
            text: "Oops something wrong"
          });
        });
    },
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
                image
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
                image
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
    `,
    //query user's books when user logged in
    me: {
      query: gql`
        query {
          me {
            id
            name
            email
            books {
              name
              id
              pivot {
                book_id
                review
                owned
              }
            }
          }
        }
      `,
      skip() {
        console.log(this.login);
        return !this.login;
      },
      update: data =>
        data.me.books.filter(el => el.pivot.owned).map(el => el.id)
    }
  }
};
</script>
