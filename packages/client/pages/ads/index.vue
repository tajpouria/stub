<template>
  <main>
    <p v-for="t in tickets" :key="t.id">{{ t.title }}-{{ t.address }}

        <img :src="t.imageUrl"/>
    </p>
  </main>
</template>
<script>
import Vue from 'vue';
import Component from '~/plugins/nuxt-class-component';

import TicketsGQL from '~/apollo/ticket/tickets.graphql';

@Component({
  apollo: {
    tickets: {
      query: TicketsGQL,
      prefetch: true,
    },
    $client: 'ticket',
  },
})
export default class AdsPage extends Vue {}
</script>
<style></style>
