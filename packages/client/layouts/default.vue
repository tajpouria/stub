<template>
  <a-layout>
    <DefaultHeader />

    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">
        <Nuxt />
      </div>
    </a-layout-content>

    <a-layout-footer :style="{ textAlign: 'center' }">
      Ant Design ©2018 Created by Ant UED
      <nuxt-link v-if="$i18n.locale !== 'en'" :to="switchLocalePath('en')">
        {{ $t('layout.default.english') }}
      </nuxt-link>

      <nuxt-link v-if="$i18n.locale !== 'fa'" :to="switchLocalePath('fa')">
        {{ $t('layout.default.farsi') }}
      </nuxt-link>
    </a-layout-footer>
  </a-layout>
</template>
<script>
import Vue from 'vue';
import DefaultHeader from '~/components/header/DefaultHeader';

export default Vue.extend({
  components: {
    DefaultHeader,
  },
});
</script>
