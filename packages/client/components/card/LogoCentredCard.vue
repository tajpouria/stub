<template>
  <a-card class="logo-centred-card">
    <div class="logo-centred-card__card">
      <nuxt-link :to="links.index">
        <picture>
          <source
            media="(max-width: 768px)"
            srcset="~/static/pics/layout/stub_logo_1x.png"
          />
          <source
            media="(min-width: 769px)"
            srcset="~/static/pics/layout/stub_logo_2x.png"
          />
          <img
            src="~/static/pics/layout/stub_logo_2x.png"
            :alt="$t('page.index.stub-alt')"
            class="logo-centred-card__logo"
          />
        </picture>
      </nuxt-link>
      <slot />
    </div>
  </a-card>
</template>

<script>
import Vue from 'vue';
import links from '~/constants/links';

export default Vue.extend({
  data() {
    return { links };
  },
});
</script>

<style lang="scss" scoped>
.logo-centred-card {
  @include absolute-center;
  min-width: 320px;
  max-width: 50rem;

  > :first-child {
    @include respond(phone) {
      padding: 7px;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__logo {
    width: 10rem;
    @include btn-effect;
  }
}
</style>
