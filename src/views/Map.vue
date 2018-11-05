<template>
  <v-layout class="mapa">
    <div id="mapaMapbox"></div>
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
        @click="newIncident()"
      >
        <v-icon>add</v-icon>
        <v-icon v-show="newEvent">close</v-icon>
        <span class="addIcons" id="reportIcon" v-show="newEvent">Reportar incidente</span>
      </v-btn>
      <v-btn
        fab
        dark
        color="green"
      >
        <v-icon>navigate_next</v-icon>
        <span class="addIcons">SIGUIENTE</span>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="blue-grey darken-3"
      >
        <v-icon>info</v-icon>
        <span class="addIcons" id="infoIcon">Selecciona un lugar en el <br> mapa y presiona siguiente</span>
      </v-btn>
    </v-speed-dial>
  </v-layout>
</template>
<script>
import mapboxgl from 'mapbox-gl/dist/mapbox-gl'
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder'
let center = [-78.485172, -0.187670]
export default {
  data () {
    return {
      newEvent: false,
      fab: false,
      center: center,
      searchPlaceholder: 'Buscar Incidentes',
      zoom: 11,
      clusters: null,
      map: null,
      eventLocation: {
        lng: center[0],
        lat: center[1]
      },
      marker: null
    }
  },
  methods: {
    fetchClusters () {
      fetch('http://localhost:3000/api/clusters')
        .then(res => res.json())
        .then(res => {
          this.clusters = res
        })
        .then(this.drawClusters)
    },
    newIncident () {
      this.newEvent = !this.newEvent
      if(this.newEvent === false && this.marker != null ) {
        this.marker.remove()  
      } else {
        let lng = this.map.getCenter().lng
        let lat = this.map.getCenter().lat
        this.addMarker(lng,lat)
      }
    },
    addControls () {
      mapboxgl.accessToken = 'pk.eyJ1Ijoic3RibjkzIiwiYSI6ImNqbzF2anFhdzBmdXozcHF5bjQydXl5enEifQ.AWABpP4jIKH1GYXaXBDI2A'
      var geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        country: 'ec',
        placeholder: this.searchPlaceholder,
      });
      var geolocator = new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        trackUserLocation: true
      })
      this.map.addControl(geocoder)
      geocoder.on('result', (ev) => {
        if(this.newEvent === true) {
          this.addMarker(ev.result.geometry.coordinates[0], ev.result.geometry.coordinates[1])
        }
      });
      this.map.addControl(geolocator)
      geolocator.on('geolocate', (data) => {
        if(this.newEvent === true) {
          this.addMarker(data.coords.longitude, data.coords.latitude)
        }
      })
      
    },
    addMarker (lng,lat) {
      if(this.marker != null) {
        this.marker.remove()  
      }
      var marker = new mapboxgl.Marker({
        draggable: true
      })
      .setLngLat([lng, lat])
      .addTo(this.map)
      this.marker = marker
      this.eventLocation.lng = lng
      this.eventLocation.lat = lat
    },
    drawMap () {
      mapboxgl.accessToken = 'pk.eyJ1Ijoic3RibjkzIiwiYSI6ImNqbzF2anFhdzBmdXozcHF5bjQydXl5enEifQ.AWABpP4jIKH1GYXaXBDI2A'
      var map = new mapboxgl.Map({
        container: 'mapaMapbox',
        style: 'mapbox://styles/stbn93/cjo1y90k75i0n2rpcbgbb6feg',
        center: this.center,
        zoom: this.zoom
      })
      this.map = map
    },
    drawClusters () {
      let clusters = this.clusters
      this.map.on('load',  () => {
        // Add a new source from our GeoJSON data and set the
        // 'cluster' option to true. GL-JS will add the point_count property to your source data.
        this.map.addSource('events', {
          type: 'geojson',
          // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
          // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
          data: clusters,
          cluster: true,
          clusterMaxZoom: 13, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        })

        this.map.addLayer({
          id: 'clusters',
          type: 'circle',
          source: 'events',
          filter: ['has', 'point_count'],
          paint: {
            // Use step expressions (https://www.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
            // with three steps to implement three types of circles:
            //   * Blue, 20px circles when point count is less than 100
            //   * Yellow, 30px circles when point count is between 100 and 750
            //   * Pink, 40px circles when point count is greater than or equal to 750
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              100,
              '#f1f075',
              750,
              '#f28cb1'
            ],
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              20,
              100,
              30,
              750,
              40
            ]
          }
        })

        this.map.addLayer({
          id: 'cluster-count',
          type: 'symbol',
          source: 'events',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        })

        this.map.addLayer({
          id: 'unclustered-point',
          type: 'circle',
          source: 'events',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#f4745a',
            'circle-radius': 5,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#f4745a'
          }
        })

        // inspect a cluster on click
        this.map.on('click', 'clusters',  (e) => {
          var features = this.map.queryRenderedFeatures(e.point, { layers: ['clusters'] })
          var clusterId = features[0].properties.cluster_id
          this.map.getSource('events').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return
            this.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            })
          })
        })
        this.map.on('mouseenter', 'clusters',  () => {
          this.map.getCanvas().style.cursor = 'pointer'
        })
        this.map.on('mouseleave', 'clusters',  () => {
          this.map.getCanvas().style.cursor = ''
        })
      })
    },
    currentLocation () {
      navigator.geolocation.getCurrentPosition((position) => {
        return [position.coords.longitude, position.coords.latitude]
      })
    }
  },
  watch: {
    map () {
      this.map.on('click', 'unclustered-point', function (e) {
        let map = e.target
        var features = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] })
        console.log(features[0].properties)
      })
      this.map.on('click', (MapMouseEvent) => {
        if(this.newEvent === true ) {
          this.addMarker(MapMouseEvent.lngLat.lng, MapMouseEvent.lngLat.lat)
        }
      })
    }
  },
  mounted () {
    this.drawMap()
    this.fetchClusters()
    this.addControls()
  }
}
</script>
<style>
.nuevo-evento{ position: absolute; bottom: 70px !important;}
#mapaMapbox{  position:absolute; top:0; bottom:0; width:100%; }
.addIcons {
  top: auto !important;
  font-weight: 300;
  text-transform: none;
  background: #4caf50;
  left: 44px !important;
  padding: 10px 20px;
  border-radius: 5px;
  opacity: 100 !important;
  -webkit-transform: rotate(-0deg) !important;
  transform: rotate(-0deg) !important;
}
.addIcons:hover {
  background: #61B865;
}
#reportIcon{
  background: #3486D7;
  border-radius: 0px;
  padding: 4px 10px;
}
#infoIcon {
  background: #37474f;
  border-radius: 0px;
  left: 29px !important;
  padding: 2px 5px;
  font-size: 11px;
  text-align: left;
}
#infoIcon:hover {
  background: #4F5D64;
}
</style>
