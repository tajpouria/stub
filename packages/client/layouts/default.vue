<template>
  <a-layout class="default-layout">
    <div class="default-layout__announce">
      Coronavirus Update: Visit My tickets for your event's status or click here
      to learn more about our impacted event policy
    </div>

    <DefaultHeader />

    <a-layout-content class="default-layout__content-container">
      <Nuxt />
    </a-layout-content>

    <DefaultFooter />
  </a-layout>
</template>
<script>
import Vue from 'vue';
import DefaultHeader from '~/components/header/DefaultHeader';
import DefaultFooter from '~/components/footer/DefaultFooter';

export default Vue.extend({
  components: {
    DefaultHeader,
    DefaultFooter,
  },
});
</script>
<style lang="scss" scoped>
.default-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__announce {
    width: 100%;
    text-align: center;
    font-size: 1.6rem;
    background-color: var(--bg-primary-dark);
    color: var(--txt-light);
    padding: 0.5rem 0;
  }

  &__content-container {
    position: relative;
    background-color: var(--bg-light);
  }
}
</style>
