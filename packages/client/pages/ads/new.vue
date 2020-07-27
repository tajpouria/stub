<template>
  <PrimaryCentredCard>
    <section class="new-ads">
      <h1>
        <b>{{ $t('page.ads.new.register free advertisement') }}</b>
      </h1>

      <a-divider />

      <a-form @submit.prevent="handleSubmit" :form="form" class="new-ads__form">
        <a-form-item :label="$t('page.ads.new.map')" class="new-ads__form-item">
          <div class="new-ads__map-container">
            <no-ssr>
              <l-map
                :zoom="11"
                @click="handleMapClick"
                :center="[35.6892, 51.389]"
              >
                <l-tile-layer
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <l-marker :lat-lng="[35.6892, 51.389]"></l-marker>
              </l-map>
            </no-ssr>
          </div>
        </a-form-item>

        <a-form-item
          :label="$t('page.ads.new.picture')"
          class="new-ads__form-item"
        >
          <ImgUploadInput :setImageUrl="setImageUrl" />
        </a-form-item>

        <a-divider />

        <a-form-item
          :label="$t('page.ads.new.price')"
          class="new-ads__form-item"
        >
          <CurrencyInput v-model="price" currency="USD" />
        </a-form-item>

        <a-form-item
          :label="$t('page.ads.new.title')"
          class="new-ads__form-item"
        >
          <a-input
            v-decorator="[
              'title',
              {
                rules: [
                  {
                    required: true,
                    validator: validationRules.required(
                      $t('validation.required'),
                    ),
                  },
                ],
              },
            ]"
            :placeholder="$t('page.ads.new.in ad title')"
          >
          </a-input>
        </a-form-item>

        <a-form-item
          :label="$t('page.ads.new.description')"
          class="new-ads__form-item"
        >
          <a-textarea
            v-decorator="[
              'description',
              {
                rules: [
                  {
                    required: true,
                    validator: validationRules.required(
                      $t('validation.required'),
                    ),
                  },
                ],
              },
            ]"
            :placeholder="$t('page.ads.new.in ad description')"
            :auto-size="{ minRows: 3, maxRows: 10 }"
          />
        </a-form-item>
        <a-form-item class="new-ads__form-item">
          <a-button
            :disabled="hasErrors(form.getFieldsError())"
            :loading="loading"
            html-type="submit"
            type="primary"
          >
            <a-icon type="upload" />
            {{ $t('page.ads.new.register') }}
          </a-button>
        </a-form-item>
      </a-form>
    </section>
  </PrimaryCentredCard>
</template>

<script>
import Vue from 'vue';

import PrimaryCentredCard from '~/components/card/PrimaryCentredCard';
import CurrencyInput from '~/components/input/CurrencyInput';
import ImgUploadInput from '~/components/input/ImgUploadInput';
import apis from '~/constants/apis';
import { hasErrors, validationRules } from '~/utils/form';
import { errorParser } from '~/utils/notification';

export default Vue.extend({
  data() {
    return {
      hasErrors,
      validationRules,
      price: 0,
      imageUrl: null,
      address: null,
      lat: null,
      lng: null,
    };
  },

  components: {
    PrimaryCentredCard,
    CurrencyInput,
    ImgUploadInput,
  },

  methods: {
    setImageUrl(imageUrl) {
      this.imageUrl = imageUrl;
    },
    async handleMapClick(event) {
      const { lat, lng } = event.latlng;
      this.lat = lat;
      this.lng = lng;

      // const { status, data } = await this.$axios.get(
      //   apis.thirdParty.getPlace(lat, lng),
      // );

      // console.info(status, data);
    },
    async handleSubmit() {
      this.form.validateFields(async (error, values) => {
        const { price, imageUrl, lat, lng } = this;
        console.info(error, {
          ...values,
          price,
          imageUrl,
          lat,
          lng,
        });
      });
    },
  },

  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'new-ads-form' });
  },

  computed: {
    loading() {
      return !!this.$store.state.loading.isLoading;
    },
  },
});
</script>

<style lang="scss" scoped>
.new-ads {
  &__map-container {
    height: 28vh;
    width: 80vw;
    max-width: 700px;
    max-height: 400px;

    @include respond(tab-port) {
      width: 85vw;
    }
    @include respond(phone) {
      width: 95vw;
    }
  }

  &__form-item {
    margin-top: 1%;
    @include respond(phone) {
      margin-top: 2%;
    }
  }
}
</style>
