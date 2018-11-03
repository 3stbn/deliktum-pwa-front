<template>
  <v-app id="deliktum" style="overflow-y: hidden;">
    <v-toolbar
      color="blue darken-2"
      dark
      fixed
      app
      clipped-right
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Deliktum</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Application
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list dense class="pt-0">
        <v-list-tile
          v-for="item in items"
          :key="item.title"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      </v-navigation-drawer>
    <v-content class="contenido">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>
<script>
export default {
  data () {
    return {
      fab: false,
      drawer: null,
      items: [
        { title: 'Mapa', icon: 'dashboard' },
        { title: 'Recientes', icon: 'question_answer' },
        { title: 'Como Usar', icon: 'question_answer' }
      ],
      right: null
    }
  },
  props: {
    source: String
  }
}
</script>
<style>
#deliktum{ max-height: 100vh }
</style>
