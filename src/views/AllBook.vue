<template>
  <div>
    <select name="categories" multiple id>
      <option value="all">All books</option>
    </select>
    <div>render here</div>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  data: function() {
    return {
      books: [],
      categoriesSelected: "all"
    };
  },
  apollo: {
    books: {
      query: function() {
        if (this.categoriesSelected == "all") {
          return gql`
            {
              books {
                id
                name
              }
            }
          `;
        }
      }
    }
  }
};
</script>
