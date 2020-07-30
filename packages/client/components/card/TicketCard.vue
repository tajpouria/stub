<template>
  <nuxt-link :to="`${links.ads}/${ticket.id}`">
    <div class="ticket-card">
      <img
        :src="ticket.imageUrl ? ticket.imageUrl : base64src.noPic"
        :alt="ticket.title"
        class="ticket-card__img"
        height="128"
        width="128"
      />
      <div class="ticket-card__detail-container">
        <h2 class="ticket-card__detail-title">{{ ticket.title }}</h2>
        <!-- TODO: !ticket.lastOrderId => ticket.lastOrderId--->
        <div
          v-if="!ticket.lastOrderId"
          class="ticket-card__detail-lock-container"
        >
          <a-tooltip
            placement="topLeft"
            :title="$t('component.ticketCard.locked')"
          >
            <a-icon type="lock" class="ticket-card__detail-lock" />
          </a-tooltip>
        </div>

        <div>
          <p>
            <b>${{ ticket.price }} USD</b>
          </p>
          <p class="ticket-card__detail-alpha">{{ ticket.address }}</p>
          <p class="ticket-card__detail-beta">{{ elapsedTime }}</p>
        </div>
      </div>
    </div>
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
  @include border-drawing;
  position: relative;
  margin-bottom: 3%;
  display: flex;
  justify-content: space-between;
  padding: 3% 3%;
  width: 100%;

  @include respond(tab-port) {
    max-width: 415px;
  }

  &__detail-container {
    display: flex;
    flex-direction: column;
    text-align: right;
    justify-content: space-between;
  }

  &__detail-lock-container {
    @include absolute-expand;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(white, 0.5);
  }

  &__detail-lock {
    color: var(--txt-primary);
    font-size: 3.5rem;
  }

  &__detail-title {
    line-height: 2rem;
  }

  &__detail-alpha {
    color: var(--txt-dark);
  }

  &__detail-beta {
    color: var(--txt-grey-dark-2);
  }

  &__img {
    @include slightly-curved;
  }
}
</style>
