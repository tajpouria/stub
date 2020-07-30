<template>
  <PrimaryCentredCard>
    <div v-if="ticket">
      <p>{{ ticket.title }}</p>
      <p>{{ ticket.description }}</p>
    </div>
    <div v-else>Not found!</div>
  </PrimaryCentredCard>
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
