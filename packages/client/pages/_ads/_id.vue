<template>
  <PrimaryCentredCard class="ad">
    <div v-if="ticket">
      <PrimaryCentredCard>
        <a-row :gutter="50">
          <a-col :lg="12" :md="12" :sm="24" :xs="24">
            <div class="ad__img-container">
              <img
                :src="ticket.imageUrl ? ticket.imageUrl : base64src.noPic"
                :alt="ticket.title"
                class="ad__img"
              />
            </div>
          </a-col>
          <a-col :lg="12" :md="12" :sm="24" :xs="24">
            <div class="ad__header-container">
              <a-button
                :loading="loading"
                @click="handlePurchase"
                :disabled="ticket.lastOrderId"
              >
                {{ $t('page.ads.id.purchase') }}
              </a-button>
              <div>
                <h1 class="ad__title">{{ ticket.title }}</h1>
                <p class="ad__elp-time">{{ elapsedTime }}</p>
              </div>
            </div>

            <div class="ad__detail-container">
              <div
                :class="{
                  ad__detail: true,
                  'ad__farsi-dir': $i18n.locale === 'fa',
                }"
              >
                <p>{{ $t('page.ads.id.address') }}</p>
                <a-popover trigger="hover">
                  <template slot="content">
                    <p>{{ $t('page.ads.id.show on map') }}</p>
                  </template>
                  <a-button @click="() => (modalVisible = true)" type="dashed">
                    {{ ticket.address }}
                  </a-button>
                </a-popover>
              </div>

              <a-divider />

              <div
                :class="{
                  ad__detail: true,
                  'ad__farsi-dir': $i18n.locale === 'fa',
                }"
              >
                <p>{{ $t('page.ads.id.price') }}</p>
                <p>
                  <b>${{ ticket.price }} USD</b>
                </p>
              </div>

              <div class="ad__desc-container">
                <p
                  v-for="line in ticket.description.split('\n')"
                  :key="Math.random()"
                  :class="{
                    'ad__farsi-dir': $i18n.locale === 'fa',
                  }"
                >
                  {{ line }}
                </p>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-modal
          v-model="modalVisible"
          :title="ticket.address"
          centered
          :footer="null"
        >
          <div class="ad__map-container">
            <no-ssr>
              <l-map :zoom="14" :center="[ticket.lat, ticket.lng]">
                <l-tile-layer
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <l-marker :lat-lng="[ticket.lat, ticket.lng]"></l-marker>
              </l-map>
            </no-ssr>
          </div>
        </a-modal>
      </PrimaryCentredCard>
    </div>
    <div v-else>Not found!</div>
  </PrimaryCentredCard>
</template>
<script>
import Vue from 'vue';
import Component from '~/plugins/nuxt-class-component';

import PrimaryCentredCard from '~/components/card/PrimaryCentredCard';
import TicketGQL from '~/apollo/ticket/Ticket.graphql';
import { getUIElapsedDuration } from '~/utils/info';
import { base64src } from '~/constants/app';

@Component({
  components: {
    PrimaryCentredCard,
  },
  data() {
    return {
      base64src,
      modalVisible: false,
    };
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
    handlePurchase() {},
  },
  computed: {
    elapsedTime() {
      return getUIElapsedDuration(this.ticket.timestamp, this.$i18n.locale);
    },
  },
  loading() {
    return !!this.$store.state.loading.isLoading;
  },
})
export default class AdByIdPage extends Vue {}
</script>
<style lang="scss" scoped>
.ad {
  &__img-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  &__img {
    width: 50rem;

    @include slightly-curved;

    @include respond(phone) {
      width: 100%;
      max-height: 50rem;
      max-width: 50rem;
    }
  }

  &__header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1%;
  }

  &__title {
    text-align: right;
  }

  &__elp-time {
    text-align: right;
  }

  &__detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
  }

  &__farsi-dir {
    direction: rtl;
  }

  &__desc-container {
    margin: 3% 0;
  }

  &__map-container {
    height: 100vh;
    width: 100%;
    max-width: 700px;
    max-height: 400px;
  }
}
</style>
