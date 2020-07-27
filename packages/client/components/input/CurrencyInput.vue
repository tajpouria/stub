<template>
  <a-input
    type="text"
    :prefix="prefix"
    :suffix="currency"
    v-model="displayValue"
    @blur="isInputActive = false"
    @focus="isInputActive = true"
  />
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  data: function () {
    return {
      isInputActive: false,
    };
  },
  props: ['value', 'currency'],
  computed: {
    displayValue: {
      get: function () {
        if (this.isInputActive) {
          return this.value.toString();
        } else {
          return this.value
            .toString()
            .replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,');
        }
      },
      set: function (modifiedValue) {
        let newValue = parseFloat(modifiedValue.replace(/[^\d\.]/g, ''));
        if (isNaN(newValue)) {
          newValue = 0;
        }
        this.$emit('input', newValue);
      },
    },
    prefix() {
      switch (this.currency) {
        case 'USD':
          return '$';
        default:
          return '$';
      }
    },
  },
});
</script>

<style></style>
