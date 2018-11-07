<template>
  <v-app id="deliktum">
    <v-toolbar
      color="blue darken-3"
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
      dark
      fixed
      app
    >
      <v-toolbar flat>
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Delilktum
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list two-line class="pt-0">
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          @click='handleView(item)'
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
      drawer: null,
      items: [
        { title: 'Mapa', icon: 'map' },
        { title: 'Incidentes Recientes', icon: 'feedback' },
        { title: 'Reportar Incidente', icon: 'record_voice_over' },
        { title: 'Como Reportar', icon: 'help' }
      ]
    }
  },
  props: {
    source: String
  },
  methods: {
    handleView (item) {
      console.log(item)
    }
  }
}
</script>
<style>
#deliktum{ max-height: 100vh }
</style>
