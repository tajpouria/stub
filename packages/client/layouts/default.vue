<template>
  <a-layout class="default-layout">
    <Announce />
    <DefaultHeader v-if="notToIncludeHeader" />
    <LineProgress :loading="loading" />
    <a-layout-content class="default-layout__content-container">
      <Nuxt />
    </a-layout-content>
    <DefaultFooter />
  </a-layout>
</template>

<script>
import Vue from 'vue';
import Announce from '~/components/Announce';
import DefaultHeader from '~/components/header/DefaultHeader';
import DefaultFooter from '~/components/footer/DefaultFooter';
import LineProgress from '~/components/progress/LineProgress';
import links from '~/constants/links';

const { signup, signin, signinGoogle } = links;

export default Vue.extend({
  components: {
    Announce,
    DefaultHeader,
    DefaultFooter,
    LineProgress,
  },
  computed: {
    loading() {
      return this.$store.state.loading.isLoading;
    },
    notToIncludeHeader() {
      return !new RegExp(`${signup}|${signin}|${signinGoogle}`).test(
        this.$route.path,
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.default-layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100vh;

  &__content-container {
    position: relative;
    background-color: var(--bg-light);
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
