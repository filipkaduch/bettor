<template>
  <div class="about d-flex justify-content-center">
    <div id="app" class="web-camera-container">
      <div class="camera-button">
          <button type="button" class="btn btn-action button is-rounded" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
            <span v-if="!isCameraOpen">Open Camera</span>
            <span v-else>Close Camera</span>
        </button>
      </div>
      
      <div v-show="isCameraOpen && isLoading" class="camera-loading">
        <ul class="loader-circle">
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      
      <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">
        
        <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
          
        <video v-show="!isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>
        
        <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="450" :height="337.5"></canvas>
      </div>
      
      <div v-if="isCameraOpen && !isLoading && photos.length < 3" class="camera-shoot">
        <button type="button" class="button" @click="takePhoto">
          <img src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png">
        </button>
      </div>
      <!-- <img v-if="dataUrl !== ''" v-bind:src="dataUrl" /> -->
      <h3 v-if="isCameraOpen"> {{ pictureText[photos.length]}} </h3>
      <div class="alert" v-if="overlay"> Couldn't detect, please take another picture </div>

      <div v-if="isPhotoTaken && isCameraOpen" class="camera-download">
        <a id="downloadPhoto" download="my-photo.jpg" class="button btn btn-action-inverse" role="button" @click="downloadImage">
          Download
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'About',
    data() {
        return {
          isCameraOpen: false,
          isPhotoTaken: false,
          isShotPhoto: false,
          isLoading: false,
          pictureCount: 0,
          overlay: false,
          check: null,
          dataUrl: '',
          pictureText: ['Frontal photo', 'Side photo 1', 'Side photo 2', 'Completed'],
          photos: [],
          link: '#'
        };
    },
    mounted() {

    },
    methods: {
        toggleCamera() {
          if(this.isCameraOpen) {
            this.isCameraOpen = false;
            this.isPhotoTaken = false;
            this.isShotPhoto = false;
            this.photos = [];
            this.check = null;
            this.pictureCount = 0;
            this.dataUrl = '';
            this.overlay = false;
            this.stopCameraStream();
          } else {
            this.isCameraOpen = true;
            this.createCameraElement();
          }
        },
      createCameraElement() {
        this.isLoading = true;
        
        const constraints = (window.constraints = {
          audio: false,
          video: true
        });
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(stream => {
            this.isLoading = false;
            this.$refs.camera.srcObject = stream;
          })
          .catch(error => {
            this.isLoading = false;
            console.log(error);
            alert("May the browser didn't support or there is some errors.");
          });
      },
      stopCameraStream() {
        let tracks = this.$refs.camera.srcObject.getTracks();

        tracks.forEach(track => {
          track.stop();
        });
      },
      takePhoto() {
        if(!this.isPhotoTaken) {
          this.isShotPhoto = true;

          const FLASH_TIMEOUT = 50;

          setTimeout(() => {
            this.isShotPhoto = false;
          }, FLASH_TIMEOUT);
        }
        const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
          .replace("image/jpeg", "image/octet-stream");
        
        if (this.photos.length < 3) {
          this.downloadImage().then((data) => {
            this.check = data;
            console.log(this.check);
            console.log(typeof this.check);
            if (this.check !== 'Not detected') {
              // this.dataUrl = URL.createObjectURL(this.check)
              this.pictureCount++;
              this.overlay = false;
              this.photos.push(canvas);
            } else {
              this.overlay = true;
            }
          })
        } 
        
        if (this.photos.length === 3) {
          this.isPhotoTaken = !this.isPhotoTaken;
        }
        
        const context = this.$refs.canvas.getContext('2d');
        context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
      },
      imgUrl(){
        const arrayBuffer = new Uint8Array(this.check);
        const blob  = new Blob([arrayBuffer], {type: "image/jpeg"});

        return window.URL.createObjectURL(blob);
      },
      downloadImage() {
        // eslint-disable-next-line no-unused-vars
        const download = document.getElementById("downloadPhoto");
        const canvas = document.getElementById("photoTaken").toDataURL("image/jpeg")
      .replace("image/jpeg", "image/octet-stream");
          return axios.post(`https://e-bettor.herokuapp.com/check_view`, { headers: {
                    'Content-type':'multipart/form-data'
                }, responseType: 'blob', data: {
                  image: canvas,
                  detection: this.photos.length === 0 ? 'face' : 'side'
                }})
                .then(({data}) => {
                    return data;
                })
                .catch((response) => {
                    console.log(response);
                });
        // download.setAttribute("href", canvas);
      }
  }
}
</script>

<style lang="scss">


.web-camera-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 500px;

  
  .camera-button {
    margin-bottom: 2rem;
  }
  
  .camera-box {    
    .camera-shutter {
      opacity: 0;
      width: 450px;
      height: 337.5px;
      background-color: #fff;
      position: absolute;
      
      &.flash {
        opacity: 1;
      }
    }
  }
  
  .camera-shoot {
    margin: 1rem 0;
    
    button {
      height: 60px;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;
      
      img {
        height: 35px;
        object-fit: cover;
      }
    }
  }
  
  .camera-loading {
    overflow: hidden;
    height: 100%;
    position: absolute;
    width: 100%;
    min-height: 150px;
    margin: 3rem 0 0 -1.2rem;
    
    ul {
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 999999;
      margin: 0;
    }
    
    .loader-circle {
      display: block;
      height: 14px;
      margin: 0 auto;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      transform: translateX(-50%);
      position: absolute;
      width: 100%;
      padding: 0;
      
      li {
        display: block;
        float: left;
        width: 10px;
        height: 10px;
        line-height: 10px;
        padding: 0;
        position: relative;
        margin: 0 0 0 4px;
        background: #999;
        animation: preload 1s infinite;
        top: -50%;
        border-radius: 100%;
        
        &:nth-child(2) {
          animation-delay: .2s;
        }
        
        &:nth-child(3) {
          animation-delay: .4s;
        }
      }
    }
  }

  @keyframes preload {
    0% {
      opacity: 1
    }
    50% {
      opacity: .4
    }
    100% {
      opacity: 1
    }
  }
}

.alert {
  background: lightcoral;
  border: 2px solid red;
  color: white;
}

</style>