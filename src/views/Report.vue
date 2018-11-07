/* eslint-disable */
<template>
  <v-stepper v-model="step" vertical id="report">
    <v-stepper-step :complete="step > 1" step="1" editable>
      Tipo de Incidente
      <small>Selecciona el tipo de incidente</small>
    </v-stepper-step>
    <v-stepper-content step="1">
    	<v-form ref="form1" v-model="valid1" lazy-validation>
				<v-select
          :items="typeIncident"
          item-text="name"
          item-value="name"
          :rules="[v => !!v || 'Es requerido el tipo de incidente']"
          v-model="incident.type"
          label="Tipo de Incidente"
          outline
      ></v-select>
      <v-btn color="primary" @click="typePass()">Continuar</v-btn>
      <v-btn flat>Cancelar</v-btn>	  
    	</v-form>
    </v-stepper-content>
    <v-stepper-step :complete="step > 2" step="2" :editable="step > 2" @click.native="photoRegret()" >Añade una fotografía (opcional)</v-stepper-step >
    <v-stepper-content step="2">
    	<div class="camera-modal text-xs-center" v-if="photo === 'capture'">
      	<video ref="video" class="camera-stream"/>
      	  <v-btn fab dark color="pink" class="cameraButton" @click="capturePhoto()">
      			<v-icon dark>camera</v-icon>
    			</v-btn>
  		</div>
  		<div v-if="photo === 'taked'">
  			<img :src="imageCamera" class="takenImage" >
    	  <v-btn fab dark color="orange" class="cameraButton" @click="refreshCamera()">
    			<v-icon dark>close</v-icon>
  			</v-btn>
  		</div>
      <v-btn color="primary" @click="photoPass()"v-if="photo==='taked'">Continuar</v-btn>
      <v-btn flat @click="photoPass()" v-if="photo === 'capture'" >Omitir</v-btn>
    </v-stepper-content>
    <v-stepper-step :complete="step > 3" step="3" :editable="step > 3 ">Describe el Incidente</v-stepper-step>
    <v-stepper-content step="3">
    	<v-form ref="form2" v-model="valid2" lazy-validation>
	      <v-textarea
	        outline
	        name="input-7-4"
	        v-model="incident.description"
	        :rules="[v => !!v || 'Es requerido la descripción']"
	        label="Descripcion del Incidente"
	      ></v-textarea>
	      <!-- Date picker -->
	      <v-dialog
	        ref="dialog"
	        v-model="modal"
	        :return-value.sync="incident.date"
	        persistent
	        lazy
	        full-width
	        width="290px"
	      >
	        <v-text-field
	          slot="activator"
	          v-model="incident.date"
	          label="Seleccionar la fecha del evento"
	          prepend-icon="event"
	          readonly
	        ></v-text-field>
	        <v-date-picker v-model="incident.date" scrollable locale="es">
	          <v-spacer></v-spacer>
	          <v-btn flat color="primary" @click="modal = false">Cancelar</v-btn>
	          <v-btn flat color="primary" @click="$refs.dialog.save(incident.date)">OK</v-btn>
	        </v-date-picker>
	      </v-dialog>
	      <v-btn color="primary" @click="report()">Reportar</v-btn>
	      <v-btn flat>Cancelar</v-btn>
	    </v-form>
    </v-stepper-content>
  </v-stepper>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
	name: 'Report',
  data () {
    return {
      step: 1,
      valid1: true,
      valid2: true,
      incident: {
      	type: null,
      	date: new Date().toISOString().substr(0, 10),
      	description: null,
      },
      mediaStream: null,
      photo: 'capture',
      imageCamera: null,
	    modal: false,
    }
  },
  computed: {
  	...mapGetters({
      typeIncident: 'typesOfIncidents',
      incidentLocation: 'eventLocation'
  	})
	},
	methods: {
		typePass () {
			if (this.$refs.form1.validate()) {
				this.step = 2
				this.showCamera()
			}
		},
		photoPass () {
			this.step = 3
			this.stopCamera()
		},
		report (){
			if (this.$refs.form2.validate()) {
				console.log([this.incident, this.incidentLocation])
			}
		},
		showCamera () {
      navigator.mediaDevices.getUserMedia({ video: this.mobileCamera() })
      .then(mediaStream => {
      	this.mediaStream = mediaStream
        this.$refs.video.srcObject = mediaStream
        this.$refs.video.play()
      })
      .catch(error => console.error('getUserMedia() error:', error))
		},
		capturePhoto () {
		  const mediaStreamTrack = this.mediaStream.getVideoTracks()[0]
		  const imageCapture = new window.ImageCapture(mediaStreamTrack)
		  return imageCapture.takePhoto().then(blob => {
		    console.log(blob)
		    const reader = new FileReader()
		    reader.onload = (e) => {
		    	this.imageCamera = e.target.result
		    }
		    reader.readAsDataURL(blob)
		  }).then(() => {
		  	this.photo = 'taked'
		  	this.stopCamera()
		  })
		},
		refreshCamera () {
			this.photo = 'capture'
			this.imageCamera = null
			this.showCamera()
		},
		photoRegret () {
			if (this.step > 2 && this.photo != 'taked' ) {
				this.showCamera()
			}
		},
		mobileCamera () {
			if (this.checkMobile() == true ) {
				return { facingMode: { exact: "environment" } }
			} else {
				return true
			}
		},
		stopCamera () {
			const tracks = this.mediaStream.getTracks()
    	tracks.map(track => track.stop())
		},
		checkMobile() { 
			if ( navigator.userAgent.match(/Android/i)
			|| navigator.userAgent.match(/webOS/i)
			|| navigator.userAgent.match(/iPhone/i)
			|| navigator.userAgent.match(/iPad/i)
			|| navigator.userAgent.match(/iPod/i)
			|| navigator.userAgent.match(/BlackBerry/i)
			|| navigator.userAgent.match(/Windows Phone/i)
			) { 
				return true
			} else {
				return false
      }
    }
  }
}
</script>
<style>
#report {
	min-height: calc(100vh - 56px)
}
.camera-modal {
  width: 100%;
  height: 100%;
  background-color: white;
  z-index: 10;
}
.camera-stream {
  width: 100%;
  max-height: 100%;
}
.cameraButton {
  margin-top: -28px !important;
}
.takenImage {
	width: 100%;
}
</style>
