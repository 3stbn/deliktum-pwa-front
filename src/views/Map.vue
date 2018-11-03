<template>
  <v-layout class="mapa">
    <GmapMap
      :center="center"
      :zoom="zoom"
      map-type-id="roadmap"
      v-bind:options="mapStyle"
      style="width: 100%; min-height: 100%"
    >
    </GmapMap>
    <v-speed-dial class="nuevo-evento"
      v-model="fab"
      bottom
      left
    >
      <v-btn
        slot="activator"
        v-model="fab"
        color="blue darken-2"
        dark
        fab
      >
        <v-icon>add</v-icon>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="indigo"
      >
        <v-icon>location_searching</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="green"
      >
        <v-icon>search</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-layout>
</template>
<script>
import mapStyles from '../assets/mapstyles.json'
export default {
  data () {
    return {
      fab: false,
      mapStyle: mapStyles,
      center: {
        lat: -0.187670,
        lng: -78.485172
      },
      zoom: 15
    }
  }
}
</script>
<style>
.nuevo-evento{ position: absolute; bottom: 70px !important;}
.mapa { min-height: -webkit-calc(100vh - 56px); min-height: calc(100vh - 56px); }
</style>
