<template>
  <PrimaryCentredCard> id</PrimaryCentredCard>
</template>
<script>
import Vue from 'vue';
import Component from '~/plugins/nuxt-class-component';

import PrimaryCentredCard from '~/components/card/PrimaryCentredCard';
import TicketGQL from '~/apollo/ticket/Ticket.graphql';
import TicketCard from '~/components/card/TicketCard';

@Component({
  components: {
    PrimaryCentredCard,
    TicketCard,
  },
  data() {
    return {};
  },
  apollo: {
    ticket: {
      query: TicketGQL,
      prefetch: true,
      variables() {
        return { id: this.$route.params.id };
      },
    },
    $client: 'ticket',
  },
  methods: {
    infiniteScroll(infLoading) {
      setTimeout(() => {}, 500);
    },
  },
})
export default class AdByIdPage extends Vue {}
</script>
<style></style>
