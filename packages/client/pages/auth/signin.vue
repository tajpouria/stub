<template>
  <LogoCentredCard>
    <section class="signin">
      <h1>
        <b>{{ $t('page.auth.signin.sign in to stub') }}</b>
      </h1>
      <a-form @submit.prevent="handleSubmit" :form="form" class="signin__form">
        <a-form-item>
          <a-input
            v-decorator="[
              'usernameOrEmail',
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
            :placeholder="$t('page.auth.signin.username or email')"
          >
            <a-icon slot="prefix" type="user" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input-password
            v-decorator="[
              'password',
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
            :placeholder="$t('page.auth.signin.password')"
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
          {{ $t('page.auth.signin.signin-btn') }}
        </a-button>
      </a-form>
      <small class="mt1 text-center">
        {{ $t('page.auth.signin.user agreement') }}
      </small>

      <p class="m1">
        <b> {{ $t('page.auth.signin.contact with friends') }} </b>
      </p>
      <a :href="apis.auth.googleSignin">
        <img
          src="~/static/pics/auth/btn_google_signin_light_normal_web.png"
          alt="sign in with google"
          class="signin__google-img"
          width="190"
          height="45"
        />
      </a>
      <p class="mt1">
        <b>
          {{ $t('page.auth.signin.new to stub') }}
          <nuxt-link :to="links.signup">
            {{ $t('page.auth.signin.create account') }}
          </nuxt-link></b
        >
      </p>
    </section>
  </LogoCentredCard>
</template>

<script>
import Vue from 'vue';

import LogoCentredCard from '~/components/card/LogoCentredCard';
import links from '~/constants/links';
import apis from '~/constants/apis';
import { hasErrors, validationRules } from '~/utils/form';
import { errorParser } from '~/utils/notification';

export default Vue.extend({
  data() {
    return {
      hasErrors,
      validationRules,
      links,
      apis,
    };
  },
  components: {
    LogoCentredCard,
  },
  methods: {
    async handleSubmit() {
      this.form.validateFields(async (error, values) => {
        if (error) return;

        const { status, data } = await this.$auth.loginWith('local', {
          data: values,
        });

        if (status !== 200)
          return this.$notification.error(
            errorParser(
              data,
              status === 401
                ? this.$t('page.auth.signin.invalid email or password')
                : '',
            ),
          );

        this.$notification.info({
          message: this.$t('page.auth.signin.welcome back'),
        });

        this.$router.push({ path: links, index });
      });
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'signin-form' });
  },
  computed: {
    loading() {
      return !!this.$store.state.loading.isLoading;
    },
  },
});
</script>

<style lang="scss" scoped>
.signin {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  &__form {
    margin-top: 3%;
    width: 100%;

    > div {
      margin-bottom: 2%;
    }

    > button {
      width: 100%;
      margin: 1% 0;
    }

    &__google-img {
      max-width: 100%;
      height: auto;
      @include btn-effect;
    }
  }
}
</style>
