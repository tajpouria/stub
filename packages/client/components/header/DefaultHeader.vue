<template>
  <header class="header-default">
    <div class="header-default__announce">
      Coronavirus Update: Visit My tickets for your event's status or click here
      to learn more about our impacted event policy
    </div>
    <div class="header-default__container">
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
          :alt="$t('layout.default.stub-logo-alt')"
          class="header-default__logo"
        />
      </picture>

      <a-input-search
        placeholder="input search text"
        class="header-default__input-search"
      />

      <a-menu mode="horizontal" class="header-default__menu-container">
        <a-menu-item key="3">
          {{ $t('layout.default.sell') }}
        </a-menu-item>
        <a-menu-item key="2">
          {{ $t('layout.default.my tickets') }}
        </a-menu-item>
        <a-menu-item key="1">
          {{ $t('layout.default.sign in') }}
        </a-menu-item>
        <a-icon type="user" />
      </a-menu>
    </div>
  </header>
</template>
<style lang="scss" scoped>
.header-default {
  &__announce {
    width: 100%;
    text-align: center;
    font-size: 1.6rem;
    background-color: var(--primary);
    color: var(--light);
  }

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
}
</style>
