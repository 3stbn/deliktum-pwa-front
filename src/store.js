/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	eventLocation: {
        lng: null,
        lat: null
    },
    checkMobile: null,
    clusters: [],
    newIncident: false,
  	typesOfIncidents: [
  		{id: 1, name: 'Asalto'},
  		{id: 2, name: 'Robo'},
  		{id: 3, name: 'Vandalismo'},
  		{id: 4, name: 'Abuso de autoridad'},
  		{id: 5, name: 'Soborno a autoridad'},
  		{id: 6, name: 'Venta de Drogas'}

  	]
  },
  getters: {
  	typesOfIncidents(state) {
  		return state.typesOfIncidents
  	},
  	eventLocation (state) {
  		return state.eventLocation
  	},
  	checkMobile (state) {
  		return state.checkMobile
  	},
  	newIncident ( state ) {
  		return state.newIncident
  	}
  },
  mutations: {
  	eventLocation ( state, location ) {
  		state.eventLocation.lng = location.lng
  		state.eventLocation.lat = location.lat
  	},
  	newIncident ( state, payload ) {
  		if (payload.route.path != '/') payload.router.push('/')
  		state.newIncident = payload.state
  	},
  	checkMobile ( state ) {
			if ( navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
			) { 
				state.checkMobile = true
			} else {
				state.checkMobile = false
      }
  	}
  },
  actions: {
  }
})
