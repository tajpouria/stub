<template>
  <a-card class="signup">
    <div class="signup__card">
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
          :alt="$t('page.auth.signup.stub-logo-alt')"
          class="signup__logo"
        />
      </picture>
      <h1>{{ $t('page.auth.signup.sign up for stub') }}</h1>
      <a-input :placeholder="$t('page.auth.signup.email')">
        <a-icon slot="prefix" type="mail" />
      </a-input>
      <a-input-password :placeholder="$t('page.auth.signup.password')">
        <a-icon slot="prefix" type="lock" />
      </a-input-password>
      <a-input-password :placeholder="$t('page.auth.signup.confirm password')">
        <a-icon slot="prefix" type="lock" />
      </a-input-password>
      <a-button type="primary" :loading="loading">
        {{ $t('page.auth.signup.signup-btn') }}
      </a-button>
      <p>
        {{ $t('page.auth.signup.user agreement') }}
      </p>
      <h5>
        <b> {{ $t('page.auth.signup.contact with friends') }} </b>
      </h5>
      <picture>
        <source
          media="(max-width: 768px)"
          srcset="~/static/pics/auth/btn_google_signin_light_normal_web.png"
        />
        <source
          media="(min-width: 769px)"
          srcset="~/static/pics/auth/btn_google_signin_light_normal_web@2x.png"
        />
        <nuxt-link :to="links.signinGoogle">
          <img
            src="~/static/pics/auth/btn_google_signin_light_normal_web@2x.png"
            alt="sign in with google"
            class="signup__logo"
          />
        </nuxt-link>
      </picture>
      <h5>
        <b>
          {{ $t('page.auth.signup.have a stub account') }}
          <nuxt-link :to="links.signin">
            {{ $t('page.auth.signup.signin') }}
          </nuxt-link></b
        >
      </h5>
    </div>
  </a-card>
</template>
<script>
import Vue from 'vue';

import links from '~/constants/links';

export default Vue.extend({
  data() {
    return {
      links,
      loading: false,
    };
  },
});
</script>
<style lang="scss" scoped>
.signup {
  @include absolute-center;

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
