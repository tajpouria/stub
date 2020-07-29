<template>
  <PrimaryCentredCard>
    <a-row :gutter="10">
      <a-col
        v-for="t in tickets"
        :key="t.id"
        :xs="24"
        :sm="24"
        :md="12"
        :lg="8"
        :xl="8"
      >
        <TicketCard :ticket="t" />
      </a-col>
      <infinite-loading spinner="spiral" @infinite="infiniteScroll">
      </infinite-loading>
    </a-row>
  </PrimaryCentredCard>
</template>
<script>
import Vue from 'vue';
import Component from '~/plugins/nuxt-class-component';

import PrimaryCentredCard from '~/components/card/PrimaryCentredCard';
import TicketsGQL from '~/apollo/ticket/Tickets.graphql';
import TicketCard from '~/components/card/TicketCard';

@Component({
  components: {
    PrimaryCentredCard,
    TicketCard,
  },
  data() {
    return {
      take: 21,
    };
  },
  apollo: {
    tickets: {
      query: TicketsGQL,
      prefetch: true,
      variables() {
        return { take: this.take };
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
export default class AdsPage extends Vue {}
</script>
<style></style>
