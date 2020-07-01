<template>
  <a-empty class="signup-token">
    <span slot="description">
      {{ this.$t('page.auth.signup.credential validation') }}
    </span>
    <a-button
      v-on:click="handleParamTokenSignup"
      :loading="loading"
      type="primary"
      class="signup-token__try-again-btn"
    >
      {{ this.$t('page.auth.signup.try again') }}
    </a-button>
  </a-empty>
</template>
<script>
import Vue from 'vue';

import api from '~/constants/api';
import links from '~/constants/links';
import { errorParser } from '~/utils/notification';

export default Vue.extend({
  methods: {
    async handleParamTokenSignup() {
      const token = this.$route.params.token;
      const { status, data } = await this.$axios.get(
        api.auth.signupToken(token),
      );

      if (status !== 201) return this.$notification.error(errorParser(data));

      await this.$auth.fetchUser();

      this.$notification.info({
        message: this.$t('page.auth.signin.welcome back'),
      });

      this.$router.push({
        path: links.index,
      });
    },
  },
  computed: {
    loading() {
      return !!this.$store.state.loading.isLoading;
    },
  },
  async mounted() {
    await this.handleParamTokenSignup();
  },
});
</script>

<style lang="scss" scoped>
.signup-token {
  @include absolute-center;

  &__try-again-btn {
    padding: 0 1.5rem;
  }
}
</style>
