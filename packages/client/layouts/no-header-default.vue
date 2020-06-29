<template>
  <a-layout class="default-layout">
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

export default Vue.extend({
  components: {
    Announce,
    DefaultFooter,
    LineProgress,
  },
  computed: {
    loading() {
      return !!this.$store.state.loading.isLoading;
    },
  },
});
</script>
<style lang="scss" scoped>
.default-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__content-container {
    position: relative;
    background-color: var(--bg-light);
  }
}
</style>
