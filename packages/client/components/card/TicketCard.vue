<template>
  <nuxt-link :to="`${links.ads}/${ticket.id}`">
    <a-card hoverable class="ticket-card">
      <img
        :src="ticket.imageUrl ? ticket.imageUrl : base64src.noPic"
        :alt="ticket.title"
        class="ticket-card__img"
        height="128"
        width="128"
      />
      <div>
        <h3>{{ ticket.title }}</h3>
        <div class="ticket-card__detail-continer">
          <p>{{ ticket.address }}</p>
          <p>${{ ticket.price }} USD</p>
          <p>{{ elapsedTime }}</p>
        </div>
      </div>
    </a-card>
  </nuxt-link>
</template>
<script>
import Vue from 'vue';
import Component from '~/plugins/nuxt-class-component';

import TicketsGQL from '~/apollo/ticket/Tickets.graphql';
import { getUIElapsedDuration } from '~/utils/info';
import links from '~/constants/links';
import { base64src } from '~/constants/app';

@Component({
  data() {
    return {
      links,
      base64src,
    };
  },
  computed: {
    elapsedTime() {
      return getUIElapsedDuration(this.ticket.timestamp, this.$i18n.locale);
    },
  },
  props: { ticket: { type: Object, required: true } },
})
export default class TicketCard extends Vue {}
</script>

<style lang="scss">
.ticket-card {
  .ant-card-body {
    display: flex;
    justify-content: space-between;
    padding: 5% 1%;
  }
  margin-bottom: 3%;

  &__img {
    @include slightly-curved;
  }
}
</style>
