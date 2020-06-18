<template>
  <div class="user">
    <h1>this is an user page</h1>
    <div class="user-name">Your user name : {{me.name}}</div>
    <img
      :src="`https://ui-avatars.com/api/?name=${me.name}`"
      alt="avatar"
      class="user-avatar mx-auto"
    />
    <div class="user-email">Your email: {{me.email}}</div>
    <hr />
    <div v-if="yourBooks.length>0" class="user-books">
      Your books :PogChamp: :thumbsup:
      <div class="book" v-for="book in yourBooks" :key="book.id">
        <span class="text-lg text-blue-600 block">{{book.name}}</span>
        <button
          @click="remove(book.id)"
          class="border-red-600 border"
        >this button to disown your book</button>
      </div>
    </div>
    <p v-else>You don't have any book</p>
    <hr />
    <div v-if="yourReview.length>0" class="user-books">
      Your reviews
      <div class="review" v-for="review in yourReview" :key="review.id">
        <span class="text-lg text-blue-600">{{review.name}}</span>
        <p class="review">{{review.pivot.review}}</p>
      </div>
    </div>
    <p v-else>You don't have any book</p>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data: function() {
    return {
      me: null
    };
  },
  computed: {
    yourReview: function() {
      return this.me.books.filter(el => el.pivot.review);
    },
    yourBooks: function() {
      return this.me.books.filter(el => el.pivot.owned);
    }
  },
  apollo: {
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
      `
    }
  },
  methods: {
    remove: function(id) {
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
                syncWithoutDetaching: [{ id: id, owned: false }]
              }
            }
          }
        })
        .then(data => {
          console.log(data);
          this.$apollo.queries.me.refetch();
        });
    }
  }
};
</script>