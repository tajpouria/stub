<template>
  <main>
    <h1>{{ $t('page.index.welcome') }}</h1>
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
export default class IndexPage extends Vue {}
</script>
<style></style>
