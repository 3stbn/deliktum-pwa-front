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
  	}
  },
  mutations: {
  	eventLocation ( state, location ) {
  		state.eventLocation.lng = location.lng
  		state.eventLocation.lat = location.lat
  	}
  },
  actions: {

  }
})
