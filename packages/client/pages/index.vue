<template>
  <main>
    <h1>{{ $t('home.welcome') }}</h1>

    <nuxt-link v-if="$i18n.locale !== 'en'" :to="switchLocalePath('en')">
      English
    </nuxt-link>

    <nuxt-link v-if="$i18n.locale !== 'fa'" :to="switchLocalePath('fa')">
      Farsi
    </nuxt-link>
  </main>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style></style>
