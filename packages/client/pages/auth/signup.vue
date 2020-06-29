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

      <a-form @submit.prevent="handleSubmit" :form="form" class="signup__form">
        <a-form-item>
          <a-input
            v-decorator="[
              'email',
              {
                rules: [
                  {
                    validator: validationRules.email($t('validation.email')),
                  },
                ],
              },
            ]"
            :placeholder="$t('page.auth.signup.email')"
          >
            <a-icon slot="prefix" type="mail" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-decorator="[
              'password',
              {
                rules: [
                  {
                    validator: validationRules.password(
                      $t('validation.password'),
                    ),
                  },
                ],
              },
            ]"
            :placeholder="$t('page.auth.signup.password')"
          >
            <a-tooltip
              slot="prefix"
              :title="$t('page.auth.signup.password-info')"
            >
              <a-icon type="lock" />
            </a-tooltip>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-decorator="[
              'repeatPassword',
              {
                rules: [
                  {
                    validator: validationRules.matchTogether(
                      $t('validation.repeat-password-not-match'),
                      form.getFieldValue('password'),
                    ),
                  },
                ],
              },
            ]"
            :placeholder="$t('page.auth.signup.repeat password')"
          >
            <a-icon slot="prefix" type="lock" />
          </a-input-password>
        </a-form-item>
        <a-button
          :disabled="hasErrors(form.getFieldsError())"
          :loading="loading"
          html-type="submit"
          type="primary"
        >
          {{ $t('page.auth.signup.signup-btn') }}
        </a-button>
      </a-form>

      <small class="mt1 text-center">
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
import { hasErrors, validationRules } from '~/utils/form';

export default Vue.extend({
  layout: 'no-header-default',
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'signup-form' });
  },
  data() {
    return {
      hasErrors,
      validationRules,
      links,
      loading: false,
    };
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((error, values) => {
        if (error) return;

        console.log('Received values of form: ', values);
      });
    },
  },
  mounted() {},
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
    width: 100%;

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
