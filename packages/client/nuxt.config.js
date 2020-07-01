import apis from './constants/apis';

const { NAME, SHORT_NAME, DESCRIPTION, HOST, INGRESS_NGINX_HOST } = process.env;

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: NAME || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: DESCRIPTION || '',
        name: DESCRIPTION || '',
        content: DESCRIPTION || '',
      },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'white' },
      { name: 'apple-mobile-web-app-title', content: NAME || '' },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
        sizes: '192x192',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://fonts.googleapis.com/css?family=Prompt&display=swap',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.css',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [
    '~assets/scss/_base.scss',
    '~assets/scss/_typography.scss',
    '~assets/scss/_colors.scss',
    '~assets/scss/_mixins.scss',
    '~assets/scss/_space.scss',
    'ant-design-vue/dist/antd.css',
  ],
  /**
   * Load style recourses
   */
  styleResources: {
    scss: ['./assets/scss/*.scss'],
  },
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['~/plugins/antd-ui', '~/plugins/axios'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    '@nuxtjs/style-resources',
    [
      'nuxt-i18n',
      {
        defaultLocale: 'en',
        langDir: 'locales/',
        locales: [
          {
            name: 'English',
            code: 'en',
            file: 'en-US.js',
          },
          {
            name: 'Farsi',
            code: 'fa',
            file: 'fa-FA.js',
          },
        ],
        lazy: true,
      },
    ],
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    https: true,
    baseURL: INGRESS_NGINX_HOST || '',
    browserBaseURL: HOST || '',
    retry: { retries: 3 },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  /**
   * PWA configuration
   */
  pwa: {
    manifest: {
      name: NAME || '',
      short_name: SHORT_NAME || '',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
    },
  },
  /**
   * Authentication configuration
   */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: apis.auth.signin, method: 'post' },
          logout: { url: apis.auth.signout, method: 'get' },
          user: { url: apis.auth.user, method: 'get', propertyName: 'user' },
        },
        tokenRequired: false,
        tokenType: false,
        // globalToken: true,
        // autoFetchUser: true
      },
    },
  },
};
