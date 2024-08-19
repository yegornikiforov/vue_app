<template>
  <v-app>
    <v-container>
      <AccountForm />
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AccountForm from '../src/components/AccountFrom.vue';

export default defineComponent({
  components: {
    AccountForm,
  },
});
</script>

<style>
body {
  background-color: #f5f5f5;
}
</style>
