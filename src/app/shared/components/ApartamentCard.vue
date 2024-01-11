<template>
  <v-card elevation="4" class="pa-4">
    <v-row>
      <v-col>
        <v-card-title>{{ title }}</v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="d-flex justify-end">
          <v-btn 
            color="primary mr-3"
            :href="'/apartaments/' + id"
          >
            <v-icon icon="mdi-pen"></v-icon>
          </v-btn>
          <v-btn 
            color="error"
            @click="remove"
          >
            <v-icon icon="mdi-trash-can"></v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>


<script>
export default {

  name: 'apartament-card',

  props: {
    title: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },

  methods: {
    remove() {
      this.$emit('remove', this.id);
    }
  },
  
}
</script>
