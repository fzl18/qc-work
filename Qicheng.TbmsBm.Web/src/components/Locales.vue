
<template>
    <Submenu name="locales" v-if="supportMultiLocales">
        <template slot="title">🌐︎</template>
        <MenuItem name="locales-item" v-for="item in items" :key="item.tag">
            <Button
                type="text"
                :key="item.tag"
                :value="item.tag"
                :name="item.tag"
                v-bind:disabled="item.tag === current"
                @click="setLocale(item.tag, $event)"
            >{{item.nativeName}}</Button>
        </MenuItem>
    </Submenu>
</template>
<script>
import { api } from '@/api/api';
export default {
  name: 'Locales',
  data() {
    return {
      supportMultiLocales: false,
      current: '',
      items: []
    };
  },
  created() {
    // this.getLocales();
  },
  methods: {
    async getLocales() {
      let locales = await api.getLocales();
      window.localStorage.setItem('locale', locales.current);
      this.supportMultiLocales = locales.supportMultiLocales;
      this.current = locales.current;
      this.items = locales.items;

    },
    setLocale(locale) {
      window.localStorage.setItem('locale', locale);
      window.location.reload();
    }
  }
};
</script>
