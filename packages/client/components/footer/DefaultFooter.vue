<template>
  <a-layout-footer class="default-footer">
    Ant Design ©2018 Created by Ant UED
    <nuxt-link v-if="$i18n.locale !== 'en'" :to="switchLocalePath('en')">
      {{ $t('layout.default.english') }}
    </nuxt-link>
    <nuxt-link v-if="$i18n.locale !== 'fa'" :to="switchLocalePath('fa')">
      {{ $t('layout.default.farsi') }}
    </nuxt-link>
  </a-layout-footer>
</template>
<style lang="scss" scoped>
.default-footer {
  background-color: white;
}
</style>
