<template>
  <LogoCentredCard>
    <section class="signup">
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
          <a-input
            v-decorator="[
              'username',
              {
                rules: [
                  {
                    validator: validationRules.username(
                      $t('validation.username'),
                    ),
                  },
                ],
              },
            ]"
            :placeholder="$t('page.auth.signup.username')"
          >
            <a-icon slot="prefix" type="user" />
            <a-tooltip
              slot="postfix"
              :title="$t('page.auth.signup.username-info')"
            >
              <a-icon type="info" />
            </a-tooltip>
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
      <a :href="apis.auth.googleSignin">
        <img
          src="~/static/pics/auth/btn_google_signin_light_normal_web.png"
          alt="sign in with google"
          class="signup__google-img"
        />
      </a>
      <p class="mt1">
        <b>
          {{ $t('page.auth.signup.have a stub account') }}
          <nuxt-link :to="links.signin">
            {{ $t('page.auth.signup.signin') }}
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
    handleSubmit() {
      this.form.validateFields(async (error, values) => {
        if (error) return;

        const { status, data } = await this.$axios.post(
          apis.auth.signup,
          values,
        );

        if (status !== 200) return this.$notification.error(errorParser(data));

        this.$notification.info({
          message: this.$t('page.auth.signup.email-sent'),
          description: data.email,
        });
      });
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: 'signup-form' });
  },
  computed: {
    loading() {
      return !!this.$store.state.loading.isLoading;
    },
  },
});
</script>

<style lang="scss" scoped>
.signup {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

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

    &__google-img {
      width: 100%;
      @include btn-effect;
    }
  }
}
</style>
