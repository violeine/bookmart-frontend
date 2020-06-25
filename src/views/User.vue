<template>
  <div class="user p-5">
    <div class="flex justify-center py-5 shadow-lg rounded-md bg-gray-300 mb-5 px-2">
      <div>
        <img
          :src="
            `https://ui-avatars.com/api/?name=${me.name}&size=512&rounded=true`
          "
          alt="avatar"
          class="mx-auto w-1/2 shadow-lg rounded-full"
        />
      </div>
      <div class="w-1/2 py-8">
        <span class="block text-5xl text-indigo-600 font-semibold">
          {{
          me.name
          }}
        </span>
        <span class="block -mt-2 text-lg text-indigo-300 mb-2">Email: {{ me.email }}</span>
        <span class="block text-base text-indigo-300 mb-2">Book Count: {{ yourBooks.length }}</span>
        <span class="block text-base text-indigo-300">Review Count: {{ yourReview.length }}</span>
      </div>
    </div>
    <div v-if="yourBooks.length > 0" class="px-2 py-5">
      <h1 class="text-2xl text-blue-700 pl-5">Your books</h1>
      <div
        tag="div"
        class="flex py-3 px-2 border-b border-gray-500"
        v-for="book in yourBooks"
        :key="book.id"
      >
        <router-link tag="div" :to="`/book/${book.id}`">
          <span class="text-lg text-blue-600 block py-2">{{ book.name }}</span>
        </router-link>
        <a
          @click.stop="remove(book.id)"
          class="ml-auto py-2 px-1 bg-red-600 rounded-lg text-gray-400"
        >Disown</a>
      </div>
    </div>
    <p class="text-2xl text-blue-700 pl-5" v-else>You don't have any book</p>
    <div v-if="yourReview.length > 0" class="px-2 py-5">
      <h1 class="text-2xl text-blue-700 pl-5">Your reviews</h1>
      <div class="review" v-for="review in yourReview" :key="review.id">
        <span class="text-lg text-blue-600 block py-2">{{ review.name }}</span>
        <p class="pl-5 text-lg text-gray-600">{{ review.pivot.review }}</p>
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
          this.$notify({
            group: "noti",
            type: "success",
            title: "Important message",
            text: "Disown successfully"
          });
          this.$apollo.queries.me.refetch();
        });
    }
  }
};
</script>
