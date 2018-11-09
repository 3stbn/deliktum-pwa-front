<template>
	<div :class="{container: !checkMobile, 'container-pc': !checkMobile }">
  <v-list two-line>
      <v-list-tile
      	v-for="(item, index) in incidents"
        :key="item._id"
        avatar
        @click="handleIncident(item._id)"
      >
        <v-list-tile-avatar>
          <img :src="incidentIcon(item.properties.type)">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-text="item.properties.type"></v-list-tile-title>
          <v-list-tile-sub-title v-text="item.properties.date"></v-list-tile-sub-title>
          <v-list-tile-sub-title v-text="item.properties.description"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
  </v-list>
	</div>
</template>
<script>
import {mapGetters} from 'vuex'
import config from '../../config/default'
export default  {
	name: 'Recent',
	data () {
		return {
			incidents: null
		}
	},
	methods: {
		fetchIncidents(){
			fetch(config.url.events ,{mode: 'cors'})
		    .then(res => res.json())
		    .then(res => {
		      this.incidents = res
      })
		},
		incidentIcon(incidentType) {
			return 'img/report/' + incidentType.replace(/ /g,'').toLowerCase() + '.png'
		},
		handleIncident(incidentId) {
			this.$router.push(`/?incident=${incidentId}`)
		}
	},
	 computed: {
  	...mapGetters({
      checkMobile: 'checkMobile'
  	})
	},
	mounted () {
		this.fetchIncidents()
	}
}
</script>