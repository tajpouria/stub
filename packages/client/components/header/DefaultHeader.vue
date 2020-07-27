<template>
  <header class="header-default">
    <div class="header-default__container">
      <nuxt-link :to="links.index">
        <img
          src="~/static/pics/layout/stub_header_logo.png"
          :alt="$t('page.index.stub-alt')"
          class="header-default__logo"
          height="80"
          width="80"
        />
      </nuxt-link>

      <a-menu mode="horizontal" class="header-default__menu">
        <a-menu-item key="1" class="header-default__menu-item">
          {{ $t('layout.default.sell') }}
        </a-menu-item>

        <a-menu-item key="2" class="header-default__menu-item">
          {{ $t('layout.default.my tickets') }}
        </a-menu-item>

        <a-menu-item key="3" class="header-default__menu-item">
          <nuxt-link v-if="$i18n.locale !== 'en'" :to="switchLocalePath('en')">
            {{ $t('layout.default.english') }}
            <a-icon type="global" />
          </nuxt-link>
          <nuxt-link v-if="$i18n.locale !== 'fa'" :to="switchLocalePath('fa')">
            {{ $t('layout.default.farsi') }}
            <a-icon type="global" />
          </nuxt-link>
        </a-menu-item>

        <a-menu-item key="4" class="header-default__menu-item">
          <nuxt-link v-if="!$auth.user" :to="links.signin">
            {{ $t('layout.default.sign in') }}
          </nuxt-link>
        </a-menu-item>

        <a-menu-item key="5" class="header-default__menu-item">
          <a-popover
            v-if="$auth.user"
            :title="$auth.user.email"
            trigger="click"
            placement="bottomLeft"
            class="header-default__user-avatar"
          >
            <template slot="content">
              <p>
                <nuxt-link :to="links.profile">
                  {{ $t('layout.default.profile') }}
                </nuxt-link>
              </p>
              <p>
                <a v-on:click="handleSignOut" :href="links.index">
                  {{ $t('layout.default.sign out') }}
                </a>
              </p>
            </template>
            <img
              :src="$auth.user.pictureURL"
              :alt="$auth.user.email"
              width="40"
              height="40"
            />
          </a-popover>
          <a-icon v-else type="user" />
        </a-menu-item>
      </a-menu>
    </div>
  </header>
</template>

<script>
import Vue from 'vue';

import links from '~/constants/links';

export default Vue.extend({
  data() {
    return {
      links,
    };
  },
  methods: {
    async handleSignOut() {
      await this.$auth.logout();

      this.$router.push({
        path: links.index,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.header-default {
  &__container {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    background-color: white;
    justify-content: space-around;
    max-height: 8rem;

    @include respond(tab-port) {
      justify-content: space-between;
    }
  }

  &__logo {
    width: 20rem;
    height: auto;

    @include btn-effect;
    @include respond(phone) {
      display: none;
    }
  }

  &__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 40rem;
    margin: 0 4%;

    @include respond(phone) {
      height: 3%;
      flex: 1;
      margin: 0;
    }
  }

  &__menu-item {
    text-align: center;
    margin: 0 2%;
    font-size: 1.5rem;
  }

  &__user-avatar {
    width: 5rem;
    @include avatar-border;
    @include btn-effect;
  }
}
</style>
