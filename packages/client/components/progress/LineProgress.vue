<template>
  <a-progress
    v-if="loading"
    :stroke-color="{
      from: '#84f1c5',
      to: '#60b6bf',
    }"
    :percent="100"
    status="active"
    :show-info="false"
    strokeLinecap="square"
    class="line-progress"
  />
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  props: {
    loading: Boolean,
  },
});
</script>

<style lang="scss">
.line-progress {
  display: inline;
  .ant-progress-outer {
    display: grid;
  }

  .ant-progress-inner {
    vertical-align: top;
  }
}
</style>
