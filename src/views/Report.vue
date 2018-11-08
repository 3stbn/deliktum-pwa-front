/* eslint-disable */
<template>
	<div :class="{container: !checkMobile, 'container-pc': !checkMobile }">
  <v-stepper v-model="step" vertical :class="{ reportMobile: checkMobile} ">
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
      <v-btn color="primary" @click="typeStep()">Continuar</v-btn>
      <v-btn flat @click="handleCancel()">Cancelar</v-btn>
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
  			<img :src="uploadedPhoto" class="takenImage" >
    	  <v-btn fab dark color="orange" class="cameraButton" @click="refreshCamera()">
    			<v-icon dark>close</v-icon>
  			</v-btn>
  		</div>
      <v-btn color="primary" @click="photoStep()"v-if="photo==='taked'">Continuar</v-btn>
  		<div class="v-btn theme--light primary jbtn-file" v-if="photo === 'capture'"> 
  			Elegir archivo
  			<input type="file" v-on:change="fileSelected">
  		</div>
      <v-btn flat @click="photoStep()" v-if="photo === 'capture'" >Omitir</v-btn>
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
	      <v-btn color="primary" @click="reportSubmit()">Reportar</v-btn>
	      <v-btn flat @click="handleCancel()">Cancelar</v-btn>
	    </v-form>
    </v-stepper-content>
  </v-stepper>
	</div>
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
      imageToUpload: null,
      uploadedPhoto: null,
	    modal: false,
    }
  },
  computed: {
  	...mapGetters({
      typeIncident: 'typesOfIncidents',
      incidentLocation: 'eventLocation',
      checkMobile: 'checkMobile'
  	})
	},
	methods: {
		typeStep () {
			if (this.$refs.form1.validate()) {
				this.step = 2
				this.showCamera()
			}
		},
		photoStep () {
			this.step = 3
			this.stopCamera()
		},
		reportSubmit (){
			if (this.$refs.form2.validate()) {
				fetch('http://localhost:3000/api/events', {
					method: 'post',
					body: JSON.stringify({ 
						"properties": {
							"type": this.incident.type,
							"description": this.incident.description,
							"date": this.incident.date
						},
						"geometry": {
							"coordinates": [this.incidentLocation.lng , this.incidentLocation.lat ]
						}
					}),
          headers: {
            'content-type': 'application/json'
          }
				})
				.then(res => res.json())
				.then(response => {
					if(this.imageToUpload != null ) {
						const url = 'http://localhost:3000/api/events/image/'+ response._id
						this.uploadImage(url)						
					} else {
						console.log(response)
					}
				} )
				.catch(err => console.log(err))
			}
		},
		uploadImage(url) {
			const fd = new FormData()
			fd.append('eventImage', this.imageToUpload)
			fetch(url, {
				method: 'POST',
    		body: fd
			})
			.then(res => res.json())
			.then(response => console.log(response))
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
		  	const fileName = Date.now()+'.jpg'
		  	const file = new File([blob], fileName , {type: 'image/jpg' , lastModified: Date.now()});
		  	console.log(file)
		  	this.imageToUpload = file
		  	this.readImage(blob)
		  }).then(() => {
		  	this.photo = 'taked'
		  	this.stopCamera()
		  })
		},
		readImage(image) {
			const reader = new FileReader()
	    reader.onload = (e) => {
	    	this.uploadedPhoto = e.target.result
	    }
	    reader.readAsDataURL(image)
		},
		refreshCamera () {
			this.photo = 'capture'
			this.imageToUpload = null
			this.uploadedPhoto = null
			this.showCamera()
		},
		photoRegret () {
			if (this.step > 2 && this.photo != 'taked' ) {
				this.showCamera()
			}
		},
		mobileCamera () {
			if (this.checkMobile == true ) {
				/*return { facingMode: { exact: "environment" } }*/
				return true
			} else {
				return true
			}
		},
		stopCamera () {
			if(this.mediaStream != null) {
				const tracks = this.mediaStream.getTracks()
	    	tracks.map(track => track.stop())
	    	this.mediaStream = null
			}
		},
		fileSelected(event) {
			const image = event.target.files[0]
			console.log(image)
			this.imageToUpload = image
			this.readImage(image)
			this.photo = 'taked'
			this.stopCamera()
    },
    handleCancel () {
    	this.$store.commit({
        type: 'eventLocation',
        lng: null,
        lat: null
      })
    	this.$router.go(-1)
    }
  }
}
</script>
<style>
.reportMobile {
	min-height: calc(100vh - 56px) !important
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
.jbtn-file {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.jbtn-file input[type=file] {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 100%;
  min-height: 100%;
  text-align: right;
  filter: alpha(opacity=0);
  opacity: 0;
  outline: none;
  cursor: inherit;
  display: block;
}
</style>
