<template>
  <header class="header-default">
    <div class="header-default__container">
      <nuxt-link :to="links.index">
        <picture>
          <source
            media="(max-width: 768px)"
            srcset="~/static/pics/layout/stub_logo_1x.png"
          />
          <source
            media="(min-width: 769px)"
            srcset="~/static/pics/layout/stub_logo_2x.png"
          />
          <img
            src="~/static/pics/layout/stub_logo_2x.png"
            :alt="$t('page.index.stub-alt')"
            class="header-default__logo"
            height="80"
            width="80"
          /> </picture
      ></nuxt-link>

      <a-input-search
        placeholder="input search text"
        class="header-default__input-search"
      />

      <a-menu mode="horizontal" class="header-default__menu-container">
        <a-menu-item key="1">
          {{ $t('layout.default.sell') }}
        </a-menu-item>
        <a-menu-item key="2">
          {{ $t('layout.default.my tickets') }}
        </a-menu-item>
        <a-menu-item key="3">
          <nuxt-link v-if="!$auth.user" :to="links.signin">
            {{ $t('layout.default.sign in') }}
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="4">
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
import { errorParser } from '~/utils/notification';

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

    @include respond(tab-port) {
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  &__logo {
    width: 10rem;
    height: auto;

    @include btn-effect;
    @include respond(phone) {
      display: none;
    }
  }

  &__input-search {
    max-width: 45rem;
    margin: 0 1%;
    height: 5rem;

    @include respond(tab-port) {
      order: 2;
      max-width: none;
      margin: 1% 5%;
    }
  }

  &__menu-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 40rem;
    margin: 0 2%;
    margin-left: auto;

    @include respond(phone) {
      height: 3%;
      flex: 1;
    }
  }

  &__user-avatar {
    width: 5rem;
    @include avatar-border;
    @include btn-effect;
  }
}
</style>
