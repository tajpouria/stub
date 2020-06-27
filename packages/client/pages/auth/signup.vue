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
      <h1>
        <b>{{ $t('page.auth.signup.sign up for stub') }}</b>
      </h1>
      <form class="signup__form">
        <a-input :placeholder="$t('page.auth.signup.email')">
          <a-icon slot="prefix" type="mail" />
        </a-input>
        <a-input-password :placeholder="$t('page.auth.signup.password')">
          <a-icon slot="prefix" type="lock" />
        </a-input-password>
        <a-input-password
          :placeholder="$t('page.auth.signup.confirm password')"
        >
          <a-icon slot="prefix" type="lock" />
        </a-input-password>
        <a-button type="primary" :loading="loading">
          {{ $t('page.auth.signup.signup-btn') }}
        </a-button>
      </form>
      <small class="mt1">
        {{ $t('page.auth.signup.user agreement') }}
      </small>
      <p class="m1">
        <b> {{ $t('page.auth.signup.contact with friends') }} </b>
      </p>
      <nuxt-link :to="links.signinGoogle">
        <img
          src="~/static/pics/auth/btn_google_signin_light_normal_web.png"
          alt="sign in with google"
          class="signup__google-img"
        />
      </nuxt-link>
      <p class="mt1">
        <b>
          {{ $t('page.auth.signup.have a stub account') }}
          <nuxt-link :to="links.signin">
            {{ $t('page.auth.signup.signin') }}
          </nuxt-link></b
        >
      </p>
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
  min-width: 320px;
  max-width: 50rem;

  @include respond(phone) {
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__logo {
    width: 10rem;
  }

  &__form {
    margin-top: 3%;

    > span {
      margin-bottom: 2%;
    }

    > button {
      width: 100%;
      margin: 1% 0;
    }
  }

  &__google-img {
    width: 100%;
    @include btn-effect;
  }
}
</style>
