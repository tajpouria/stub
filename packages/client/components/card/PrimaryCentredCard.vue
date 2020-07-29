<template>
  <a-card :bordered="false" class="primary-centred-card">
    <div class="primary-centred-card__card">
      <slot />
    </div>
  </a-card>
</template>

<script>
import Vue from 'vue';
import links from '~/constants/links';

export default Vue.extend({
  data() {
    return { links };
  },
});
</script>

<style lang="scss" scoped>
.primary-centred-card {
  min-width: 320px;
  max-width: 1250px;

  > :first-child {
    @include respond(phone) {
      padding: 7px;
    }
  }

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
