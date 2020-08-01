<template>
  <PrimaryCentredCard>
    <section class="ads-index">
      <a-row :gutter="10" class="ads-index__container">
        <a-col
          v-for="t in tickets"
          :key="t.id"
          :md="12"
          :lg="8"
          :xl="8"
          class="ads-index__item"
        >
          <TicketCard :ticket="t" />
        </a-col>
      </a-row>

      <infinite-loading spinner="waveDots" @infinite="infiniteScroll">
        <div slot="no-more">{{ $t('page.ads.index.no more data') }}</div>
        <div slot="no-results">{{ $t('page.ads.index.no results') }}</div>
      </infinite-loading>
    </section>
  </PrimaryCentredCard>
</template>
<script>
import Vue from 'vue';
import Component from '~/plugins/nuxt-class-component';

import PrimaryCentredCard from '~/components/card/PrimaryCentredCard';
import TicketsGQL from '~/apollo/ticket/Tickets.graphql';
import TicketCard from '~/components/card/TicketCard';
import { isMobile } from '~/utils/info';

@Component({
  components: {
    PrimaryCentredCard,
    TicketCard,
  },
  data() {
    return {
      take: this.$device.isMobile ? 12 : 21,
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
    infiniteScroll($infLoading) {
      setTimeout(() => {
        this.take += this.$device.isMobile ? 8 : 12;
        if (!this.loading) $infLoading.loaded();
      }, 1000);
    },
  },
  computed: {
    loading() {
      return !!this.$store.state.loading.isLoading;
    },
  },
})
export default class AdsPage extends Vue {}
</script>
<style lang="scss" scoped>
.ads-index {
  &__container {
    @include respond(phone) {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__item {
    @include respond(phone) {
      width: 100%;
    }
  }
}
</style>
