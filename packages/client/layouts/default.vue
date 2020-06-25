<template>
  <a-layout id="components-layout-demo-fixed">
    <a-layout-header :style="{ background: '#fff' }">
      <a-row>
        <a-col :md="{ span: 2, offset: -8 }">
          <picture>
            <source
              media="(max-width: 768px)"
              srcset="~/assets/layout/stub_logo_1x.png"
            />
            <source
              media="(min-width: 769px)"
              srcset="~/assets/layout/stub_logo_2x.png"
            />
            <img
              src="~/assets/layout/stub_logo_2x.png"
              :alt="$t('layout.default.stub-logo-alt')"
              :style="{ width: '100px' }"
            />
          </picture>
        </a-col>

        <a-col :md="{ span: 8, offset: 1 }">
          <a-input-search placeholder="input search text" />
        </a-col>

        <a-col :md="{ span: 8, offset: 4 }">
          <a-menu mode="horizontal">
            <a-menu-item key="1">
              {{ $t('layout.default.sign in') }}
            </a-menu-item>
            <a-menu-item key="2">
              {{ $t('layout.default.my tickets') }}
            </a-menu-item>
            <a-menu-item key="3">
              {{ $t('layout.default.sell') }}
            </a-menu-item>
            <a-icon type="user" />
          </a-menu>
        </a-col>
      </a-row>
    </a-layout-header>

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

<style>
:root {
  --primary: #eb2f64;
  --primary-light: #ff3366;
  --primary-dark: #ba265d;
  --light: #faf9f9;
  --grey-light: #f4f2f2;
  --grey-light-1: #f0eeee;
  --grey-light-2: #ccc;
  --grey-dark: #333;
  --grey-dark-1: #777;
  --grey-dark-2: #999;

  --shadow-light: 0 2rem 5rem rgba(0, 0, 0, 0.03);
  --shadow-dark: 0 2rem 8rem rgba(0, 0, 0, 0.3);

  --line: 1px solid var(--grey-light-4);
}

* {
  margin: 0;
  padding: 0;
}

*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

html {
  font-size: 62.5%;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  font-family: 'Quicksand', 'Vazir', 'Open Sans', sans-serif;
  color: var(--grey-dark);
  font-weight: 400;
  line-height: 1.6;
}
</style>
