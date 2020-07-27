<template>
  <PrimaryCentredCard>
    <section class="new-ads">
      <h1>
        <b>{{ $t('page.ads.new.register free advertisement') }}</b>
      </h1>

      <a-form @submit.prevent="handleSubmit" :form="form">
        <a-form-item :label="$t('page.ads.new.map')">
          <div class="new-ads__map-container">
            <no-ssr>
              <l-map :zoom="11" :center="[35.6892, 51.389]">
                <l-tile-layer
                  url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                ></l-tile-layer>
                <l-marker :lat-lng="[35.6892, 51.389]"></l-marker>
              </l-map>
            </no-ssr>
          </div>
        </a-form-item>

        <a-form-item :label="$t('page.ads.new.price')">
          <CurrencyInput v-model="price" currency="USD" />
        </a-form-item>

        <a-form-item :label="$t('page.ads.new.picture')">
          <div>
            <a-upload-dragger
              v-decorator="[
                'picture',
                {
                  valuePropName: 'fileList',
                  getValueFromEvent: normFile,
                },
              ]"
            >
              <p>
                <a-icon type="inbox" />
              </p>
              <p>{{ $t('page.ads.new.upload hint') }}</p>
              <small>{{ $t('page.ads.new.adding a photo will') }}</small>
            </a-upload-dragger>
          </div>
        </a-form-item>

        <a-form-item :label="$t('page.ads.new.title')">
          <a-input
            v-decorator="[
              'title',
              {
                rules: [
                  {
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
        <a-form-item :label="$t('page.ads.new.description')">
          <a-textarea
            v-decorator="[
              'description',
              {
                rules: [
                  {
                    validator: validationRules.required(
                      $t('validation.required'),
                    ),
                  },
                ],
              },
            ]"
            :placeholder="$t('page.ads.new.in ad description')"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
          <a-button
            :disabled="hasErrors(form.getFieldsError())"
            :loading="loading"
            html-type="submit"
            type="primary"
          >
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
import links from '~/constants/links';
import { hasErrors, validationRules } from '~/utils/form';
import { errorParser } from '~/utils/notification';

export default Vue.extend({
  data() {
    return {
      hasErrors,
      validationRules,
      links,
      price: 0,
    };
  },
  components: {
    PrimaryCentredCard,
    CurrencyInput,
  },
  methods: {
    async handleSubmit() {
      this.form.validateFields(async (error, values) => {});
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
    height: 35vh;
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
}
</style>
