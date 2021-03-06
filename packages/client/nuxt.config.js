import apis from './constants/apis';

const {
  NAME,
  SHORT_NAME,
  DESCRIPTION,
  // TODO: Delete or Make sure to override by k8s envVars when running it inside the pod
  SERVER_HOST = 'http://stub.dev',
  CLIENT_HOST = 'http://localhost:3000',
  TICKET_GQL_PATH = '/api/ticket/graphql',
  ORDER_GQL_PATH = '/api/order/graphql',
  CHARGE_GQL_PATH = '/api/charge/graphql',
} = process.env;

export default {
  mode: 'universal',

  target: 'server',

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
        href: 'https://fonts.googleapis.com/css?family=Raleway&display=swap',
      },
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: 'https://cdn.fontcdn.ir/Font/Persian/Vazir/Vazir.css',
      },
    ],
  },

  css: [
    '~assets/scss/_base.scss',
    '~assets/scss/_typography.scss',
    '~assets/scss/_colors.scss',
    '~assets/scss/_mixins.scss',
    '~assets/scss/_space.scss',
    'ant-design-vue/dist/antd.css',
  ],

  styleResources: {
    scss: ['./assets/scss/*.scss'],
  },

  router: {
    middleware: ['ssr-cookie'],
  },

  plugins: [
    '~/plugins/antd-ui',
    '~/plugins/axios',
    '~/plugins/nuxt-class-component',
    { src: '~/plugins/infinite-loading', ssr: false },
  ],

  components: true,

  buildModules: ['@nuxt/typescript-build'],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/auth',
    '@nuxtjs/style-resources',
    'nuxt-leaflet',
    '@nuxtjs/apollo',
    '@nuxtjs/proxy',
    '@nuxtjs/device',
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
  proxy: {
    '/api/': {
      target: SERVER_HOST,
      pathRewrite: {
        '^/api/': '/api/',
      },
      changeOrigin: true,
    },
    [TICKET_GQL_PATH]: {
      target: SERVER_HOST,
      pathRewrite: {
        [`^${TICKET_GQL_PATH}`]: TICKET_GQL_PATH,
      },
      changeOrigin: true,
    },
    [ORDER_GQL_PATH]: {
      target: SERVER_HOST,
      pathRewrite: {
        [`^${ORDER_GQL_PATH}`]: ORDER_GQL_PATH,
      },
      changeOrigin: true,
    },
    [CHARGE_GQL_PATH]: {
      target: SERVER_HOST,
      pathRewrite: {
        [`^${CHARGE_GQL_PATH}`]: CHARGE_GQL_PATH,
      },
      changeOrigin: true,
    },
  },
  apollo: {
    watchLoading: '~/plugins/apollo-watch-loading-handler.js',
    errorHandler: '~/plugins/apollo-error-handler.js',
    clientConfigs: {
      default: {
        httpEndpoint: `USE FOLLOWING CLIENTS`,
      },
      ticket: {
        httpEndpoint: `${CLIENT_HOST}${TICKET_GQL_PATH}`,
      },
      order: {
        httpEndpoint: `${CLIENT_HOST}${ORDER_GQL_PATH}`,
      },
      charge: {
        httpEndpoint: `${CLIENT_HOST}${CHARGE_GQL_PATH}`,
      },
    },
  },

  axios: {
    retry: { retries: 3 },
    proxy: true,
  },

  build: {},

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
      },
    },
  },
};
