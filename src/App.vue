<template>
  <div id="app" class="area overflow-scroll">
    <ul class="circles">
        <li></li>
        <!-- <li><img src="@/assets/images/lol.png" alt="LoL" class="hideImg" /></li> -->
        <li></li>
        <li></li>
        <!-- <li><img src="@/assets/images/csgo-img.png" alt="LoL" class="hideImg" /></li> -->
        <li></li>
        <li></li>
        <!-- <li><img src="@/assets/images/dota2-image.png" alt="LoL" class="hideImg" /></li> -->
        <li></li>
        <li></li>
        <!-- <li><img src="@/assets/images/hearthstone-image.png" alt="LoL" class="hideImg" /></li> -->
        <li></li>
        <li></li>
        <li></li>
    </ul>
    <app-loading :loading="false" class="h-100 overflow-scroll">
      <div class="d-flex justify-content-between h-100" style="flex-direction: column;">
       <app-navbar/>
       <div class="d-flex justify-content-center view-block" style="flex-direction: column;">
          <transition name="grow-height">
            <app-new-navbar v-if="logged !== 'null'" />
          </transition>
          <router-view :key="$route.fullPath" class="pt-2 pt-xl-4 w-100 pb-2 pb-xl-4 main-block h-100" />
        </div>
        <div class="w-100 d-flex justify-content-between page-footer" style="flex-direction: column;">
            <div class="page-footer-line" />
              <div class="w-100 d-flex justify-content-center page-footer-2">
                <div class="d-flex justify-content-center page-footer-content">
                  <router-link style="text-decoration: none; color: inherit;" :to="{name: 'home'}" class="mx-2">Legal policies</router-link>
                  <router-link style="text-decoration: none; color: inherit;" :to="{name: 'home'}" class="mx-2">Terms of service</router-link>
                  <router-link style="text-decoration: none; color: inherit;" :to="{name: 'home'}" class="mx-2">Cookies</router-link>
                  © 2022
                </div>
              </div>
            </div>
          </div>
    </app-loading>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import AppNavbar from '@/components/navigation/AppNavbar.vue';
import AppLoading from '@/components/design/AppLoading';
import AppNewNavbar from '@/components/navigation/AppNewNavbar.vue';

export default {
  components: {
    AppNavbar,
    AppLoading,
    AppNewNavbar
  },
	computed: {
		...mapGetters('appLoading', ['loading']),
		...mapGetters('authLogin', ['needRefresh']),
      logged() {
          return this.$store.getters['authLogin/token'] ?? null;
      }
	},
  watch: {
      windowWidth(newWidth, oldWidth) {
          this.txt = `it changed to ${newWidth} from ${oldWidth}`;
      }
  }
}
</script>

<style scoped>

.grow-height-enter-active {
  transition: all .6s ease;
}
.grow-height-leave-active {
  transition: all .6s ease;
}
.grow-height-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  height: auto;
}

.grow-height-leave-to {
    height: 0;
}

</style>


<style type="scss">
#nav {
  padding: 30px;
}

.view-block {
  height: calc(100% - 88px);
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.page-footer {
  height: 16px;
}

.page-footer-2 {
  position: absolute;
}

.page-footer-line {
  height: 1px;
  width: 100%;
  background: white;
  opacity: 0.4;
}

.page-footer-content {
  font-size: 10px;
  opacity: 0.4;
}

a:active {
  color: black;
}

a[tabindex]:focus {
    color:black;
    outline: none;
}

@media screen and (max-width: 767px) {
  .main-block {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .view-block {
    height: calc(100% - 88px);
  }
}

.area {
  background: #4e54c8;  
  background: -webkit-linear-gradient(to left, #8f94fb, #4e54c8);  
  width: 100%;
  height:100vh;
  position: absolute;
  z-index: -10000;
}

.circles {
  z-index: -10000;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.circles li{
    position: absolute;
    display: block;
    list-style: none;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    animation: animate 25s linear infinite;
    bottom: -150px;
    
}

.circles li:nth-child(1){
    left: 25%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
}


.circles li:nth-child(2){
    left: 10%;
    width: 20px;
    height: 20px;
    animation-delay: 2s;
    animation-duration: 12s;
}

.circles li:nth-child(3){
    left: 70%;
    width: 20px;
    height: 20px;
    animation-delay: 4s;
}

.circles li:nth-child(4){
    left: 40%;
    width: 60px;
    height: 60px;
    animation-delay: 0s;
    animation-duration: 18s;
}

.circles li:nth-child(5){
    left: 65%;
    width: 20px;
    height: 20px;
    animation-delay: 0s;
}

.circles li:nth-child(6){
    left: 75%;
    width: 110px;
    height: 110px;
    animation-delay: 3s;
}

.circles li:nth-child(7){
    left: 35%;
    width: 150px;
    height: 150px;
    animation-delay: 7s;
}

.circles li:nth-child(8){
    left: 50%;
    width: 25px;
    height: 25px;
    animation-delay: 15s;
    animation-duration: 45s;
}

.circles li:nth-child(9){
    left: 20%;
    width: 15px;
    height: 15px;
    animation-delay: 2s;
    animation-duration: 35s;
}

.circles li:nth-child(10){
    left: 85%;
    width: 150px;
    height: 150px;
    animation-delay: 0s;
    animation-duration: 11s;
}



@keyframes animate {

    0%{
        transform: translateY(0) rotate(0deg);
        opacity: 1;
        border-radius: 0;
    }

    100%{
        transform: translateY(-1000px) rotate(720deg);
        opacity: 0;
        border-radius: 50%;
    }

}

.hideImg {
  opacity: 0.4;
  max-height: 200px;
  max-width: 400px;
}

</style>
