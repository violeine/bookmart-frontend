<template>
  <div v-if="!book">loading</div>
  <div v-else class="p-5">
    <!-- book -->
    <div class="book w-auto">
      <div class="flex mb-40">
        <div class="w-1/2">
          <img :src="book.image" alt="book image" class="mx-auto h-full block" />
        </div>
        <div>
          <div class="name mb-1">
            <span class="text-3xl text-indigo-600 font-semibold">{{book.name}}</span>
          </div>
          <div class="author mb-5 pt-0">
            <span class="text-indigo-500 text-xl mr-2">By</span>
            <span class="text-2xl text-indigo-500">{{book.author}}</span>
          </div>
          <div class="category">
            <span
              v-for="cate in book.categories"
              class="text-red-500 mr-1"
              :key="cate.id"
            >{{cate.name}}</span>
          </div>
          <div v-if="$root.$data.isLogin">
            <span v-if="me && me.includes(id)" class="text-green-500">You owned this book</span>
            <button @click="add" class="block text-teal-500" v-else>Add this to your library</button>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div>
        <p class="text-indigo-600 text-lg border-b border-gray-500">Community Reviews</p>
        <div v-if="reviews.length>0">
          <p class="px-5 pt-5" v-for="review in reviews" :key="review.id">
            <span id="user" class="text-blue-600 mr-3">{{review.name}}</span>
            <span id="review" class="text-gray-700">{{review.pivot.review}}</span>
          </p>
        </div>
        <h1
          class="text-gray-700 text-lg mb-4"
          v-else
        >This book dont have any review, review now !!!!</h1>
      </div>
    </div>
    <!-- //TO DO add auth route -> kick back to login  -->
    <div v-if="$root.$data.isLogin" id="form-review" class="pt-5">
      <form action="#">
        <textarea
          class="w-full border border-blue-400 rounded-md outline-none h-32 py-3 px-5 text-md"
          placeholder="Your review"
          v-model="reviewBox"
        ></textarea>
        <button
          v-if="reviewBox"
          class="block ml-auto py-2 px-4 border border-transparent text-gray-700 rounded-md mr-5 bg-teal-500"
          @click.prevent="submit"
        >Send</button>
      </form>
    </div>
    <router-link
      class="pt-5 px-5 text-gray-500 block"
      to="/login"
      v-else
    >You have to login to review this book :)</router-link>
  </div>
</template>

<script>
import gql from "graphql-tag";
export default {
  props: ["id"],
  data: function() {
    return {
      book: null,
      reviewBox: "",
      me: null
    };
  },
  computed: {
    reviews: function() {
      console.log(this.$root.isLogin);
      return this.book.users.filter(el => el.pivot.review);
    },
    login: function() {
      return this.$root.$data.isLogin;
    }
  },
  methods: {
    add: function() {
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
                syncWithoutDetaching: [{ id: this.id, owned: true }]
              }
            }
          }
        })
        .then(data => {
          console.log(data);
          this.$apollo.queries.me.refetch();
        });
    },
    submit: function() {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($input: UpdateReviewInput!) {
              updateReview(input: $input) {
                id
                __typename
                books {
                  pivot {
                    review
                    __typename
                  }
                }
              }
            }
          `,
          variables: {
            input: {
              id: this.$root.userData,
              books: {
                syncWithoutDetaching: [{ id: this.id, review: this.reviewBox }]
              }
            }
          }
        })
        .then(data => {
          console.log(data);
          this.$apollo.queries.book.refetch();
          this.reviewBox = "";
        })
        .catch(err => console.log(err));
    },
    addToMyBook: function() {}
  },
  apollo: {
    book: {
      query: gql`
        query($id: ID!) {
          book(id: $id) {
            id
            name
            author
            image
            users {
              id
              name
              pivot {
                review
              }
            }
            categories {
              id
              name
            }
          }
        }
      `,
      variables() {
        return {
          id: this.id
        };
      }
    },
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
        return !this.login;
      },
      update: data =>
        data.me.books.filter(el => el.pivot.owned).map(el => el.id)
    }
  }
};
</script>
