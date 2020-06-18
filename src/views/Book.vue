<template>
  <div v-if="!book">loading</div>
  <div v-else class="about">
    <!-- book -->
    <div class="book">
      <div class="name">
        Book title:
        <span class="text-lg text-blue-300">{{book.name}}</span>
      </div>
      <div class="author">
        Book Author:
        <span class="text-md text-blue-300">{{book.author}}</span>
      </div>
      <div class="category">
        <span v-for="cate in book.categories" class="text-red-400" :key="cate.id">{{cate.name}}</span>
      </div>
      <div v-if="reviews.length>0">
        <div v-for="review in reviews" :key="review.id">
          <div id="user" class="text-orange-500">{{review.name}}</div>
          <div id="review" class="text-orange-500">{{review.pivot.review}}</div>
        </div>
      </div>
      <p v-else>This book dont have any review, review now !!!!</p>
    </div>
    <!-- //TO DO add auth route -> kick back to login  -->
    <div v-if="$root.$data.isLogin" id="form-review">
      <span v-if="me && me.includes(id)" class="text-green-400">you owned this book</span>
      <button @click="add" class="block text-teal-500" v-else>Add this to your library</button>
      <form action="#">
        <textarea class="w-full border border-blue-400 h-24 rounded-sm" v-model="reviewBox"></textarea>
        <button v-if="reviewBox" class="block" @click.prevent="submit">send</button>
      </form>
    </div>
    <router-link to="/login" v-else>you have to Login to review this book :)</router-link>
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
