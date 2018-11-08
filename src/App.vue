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
      :permanent="checkPointOfView()"
      class="panel-left"
      v-model="drawer"
      color="red"
      dark
      fixed
      app
    >
      <v-toolbar flat color="blue darken-4">
        <v-list>
          <v-list-tile>
            <v-list-tile-title class="title">
              Reporta y actúa
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list two-line class="pt-0" color="blue">
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
      <transition>
        <router-view></router-view>
      </transition>
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
      this.drawer = !this.drawer
      if(item.title === 'Reportar Incidente') {
        this.$store.commit({
          type: 'newIncident', 
          router: this.$router,
          route: this.$route,
          state: true
        })
      }
    },
    checkPointOfView ( ) {
      if(window.innerWidth > 1200 ){
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.$store.commit('checkMobile')
  },
}
</script>
<style>
#deliktum{ max-height: 100vh }
.container-pc {max-width: 600px}
.panel-left { background-color: #3b7db5 !important }
</style>
