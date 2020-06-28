<template>
  <a-card class="signup">
    <div class="signup__card">
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
            :alt="$t('page.auth.signup.stub-logo-alt')"
            class="signup__logo"
          />
        </picture>
      </nuxt-link>
      <h1>
        <b>{{ $t('page.auth.signup.sign up for stub') }}</b>
      </h1>

      <ValidationObserver v-slot="{ invalid }">
        <a-form @submit.prevent="onSubmit" class="signup__form">
          <a-form-item>
            <a-input
              v-model="values.email"
              v-decorator="[
                'values.email',
                {
                  rules: [
                    { required: true, message: 'Please input your note!' },
                  ],
                },
              ]"
              :placeholder="$t('page.auth.signup.email')"
            >
              <a-icon slot="prefix" type="mail" />
            </a-input>
          </a-form-item>
          <a-input-password
            v-model="values.password"
            :placeholder="$t('page.auth.signup.password')"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
          <a-input-password
            v-model="values.confirmPassword"
            :placeholder="$t('page.auth.signup.confirm password')"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
          <a-button :loading="loading" html-type="submit" type="primary">
            {{ $t('page.auth.signup.signup-btn') }}
          </a-button>
        </a-form>
      </ValidationObserver>

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
import { ValidationObserver, ValidationProvider } from 'vee-validate';

import links from '~/constants/links';

export default Vue.extend({
  layout: 'no-header-default',
  data() {
    return {
      links,
      loading: false,
      values: {
        email: null,
        password: null,
        confirmPassword: null,
      },
    };
  },
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  methods: {
    onSubmit() {
      const { email, password, confirmPassword } = this.values;
      console.log(email, password, confirmPassword);
    },
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
    @include btn-effect;
  }

  &__form {
    margin-top: 3%;

    > span > span {
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
