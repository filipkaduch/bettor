<template>
    <nav class="Navigation navbar navbar-expand-md navbar-light p-3 m-3 justify-content-between action-shadow">
        <!-- <app-header text="Bettor" :menu="true" /> -->
        <a class="navbar-brand text-white" href="#"><router-link class="text-decoration-none text-white" :to="{name: 'home'}"><span class="bettorLogo">Bettor</span></router-link></a>
        <button 
            class="navbar-toggler border-0 text-white"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false" aria-label="Toggle navigation"
            @click="openMobileMenu">
            <font-awesome-icon :icon="['fas', 'bars']" class="mt-2" />
        </button>
        <b-collapse v-model="mobileMenu" class="position-absolute mt-2 w-100" style="border-radius: 0.5rem; border: 0; left: 0px; z-index: 1000;">
            <b-card body-class="blue-bg collapse-border" style="border: 0; border-radius: 0.5rem;">
                <ul class="navbar-nav mr-auto">
                    <li class="menu-mobile-item mb-1">
                        <b-button variant="transparent" class="text-white w-100" @click="showGameEvent">Games</b-button>
                        <b-collapse v-model="showGames" class="position-absolute mt-1 collapse-border w-auto" style="border-radius: 0.25rem; left: 35%; z-index: 1000;">
                            <div class="blue-bg borderRadius p-3 d-block" style="width: auto; border-radius: 0.25rem; border:0;">
                                <div class="justify-content-start d-flex mb-2">
                                    <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                        <div @click.self="closeBar">League of Legends</div>
                                    </router-link>
                                </div>
                                <div class="justify-content-start d-flex mb-2">
                                    <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                        <div @click="closeBar">Counter Strike: GO</div>
                                    </router-link>
                                </div>
                                <div class="justify-content-start d-flex mb-2">
                                    <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                        <div @click="closeBar">HearthStone</div>
                                    </router-link>
                                </div>
                                <div class="justify-content-start d-flex">
                                    <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                        <div @click="closeBar">DOTA 2</div>
                                    </router-link>
                                </div>
                            </div>
                        </b-collapse>
                    </li>
                    <li class="nav-item active menu-mobile-item">
                        <b-button variant="transparent" class="text-white">
                            <router-link class="nav-link text-white p-0" style="border-bottom: 0 !important;" :to="{name: 'rankings'}">
                                <div @click.self="closeBar">Rankings</div>
                            </router-link>
                        </b-button>
                    </li>
                </ul>
                <div v-if="logged === 'null'" class="my-2 my-lg-0 d-flex justify-content-center">
                    <div class="position-relative">
                        <button type="button" class="btn actionButton mx-1" @click="showLogin = !showLogin">Login</button>
                        <b-collapse v-model="showLogin" class="position-absolute mt-2" style="border-radius: 0.5rem; border: 0;">
                            <b-card body-class="blue-bg collapse-border" style="border: 0; border-radius: 0.5rem;">
                                <login @closeLogin="closeBar"/>
                            </b-card>
                        </b-collapse>
                    </div>
                    <router-link class="btn actionButton mx-1" :to="{name: 'register'}">Register now</router-link>
                </div>
                <div v-else class="my-2 my-lg-0 d-flex align-items-center w-100 justify-content-between border-top-white">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle userIcon p-1 position-relative">
                            <font-awesome-icon :icon="['fas', 'user-circle']" size="lg" class="mr-3" @click="showAcc = !showAcc"/>
                            <b-collapse v-model="showAcc" class="position-absolute mt-2 collapse-border" style="border-radius: 0.25rem;">
                                <div class="blue-bg borderRadius p-3" style="width: 160px; border-radius: 0.25rem; border:0;">
                                    <router-link style="text-decoration: none; color: inherit;" :to="{name: 'accountSettings'}">
                                        <div @click="closeBar">Account settings</div>
                                    </router-link>
                                    <router-link style="text-decoration: none; color: inherit;" :to="{name: 'roomsList'}" class="mt-2">
                                        <div @click="closeBar" class="mt-2">Your rooms</div>
                                    </router-link>
                                </div>
                            </b-collapse>
                        </div>
                        <small style="margin-left: 15px;">{{ logged.name }}</small>
                    </div>
                    <button type="button" class="btn actionButton mx-3" @click="submit">Logout</button>
                </div>
            </b-card>
        </b-collapse>

        <div class="collapse navbar-collapse justify-content-between d-flex dropdown-block" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li>
                    <b-button variant="transparent" class="mr-3 text-white" @click="showGames = !showGames">Games</b-button>
                    <b-collapse v-model="showGames" class="position-absolute mt-1 collapse-border w-auto" style="border-radius: 0.25rem; z-index: 1000;">
                        <div class="blue-bg borderRadius p-3 d-block" style="width: auto; border-radius: 0.25rem; border:0;">
                            <div class="justify-content-start d-flex mb-2">
                                <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                    <div @click="closeBar">League of Legends</div>
                                </router-link>
                            </div>
                            <div class="justify-content-start d-flex mb-2">
                                <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                    <div @click="closeBar">Counter Strike: Global Offensive</div>
                                </router-link>
                            </div>
                            <div class="justify-content-start d-flex mb-2">
                                <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                    <div @click="closeBar">HearthStone</div>
                                </router-link>
                            </div>
                            <div class="justify-content-start d-flex">
                                <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                                    <div @click="closeBar">DOTA 2</div>
                                </router-link>
                            </div>
                        </div>
                    </b-collapse>
                </li>
                <!--<li class="nav-item active">
                    <router-link class="nav-link text-white" :to="{name: 'home'}">Bets</router-link>
                </li>-->
                <li class="nav-item active">
                    <b-button variant="transparent" class="text-white"><router-link class="nav-link text-white p-0" style="border-bottom: 0 !important;" :to="{name: 'rankings'}">Rankings</router-link></b-button>
                </li>
            </ul>
            <div v-if="logged === 'null'" class="my-2 my-lg-0 d-flex">
                <div class="position-relative">
                    <button type="button" class="btn actionButton mx-1" @click="showLogin = !showLogin">Login</button>
                    <b-collapse v-model="showLogin" class="position-absolute mt-2" style="border-radius: 0.5rem; border: 0;">
                        <b-card body-class="blue-bg collapse-border" style="border: 0; border-radius: 0.5rem;">
                            <login @closeLogin="closeBar"/>
                        </b-card>
                    </b-collapse>
                </div>
                <router-link class="btn actionButton mx-1" :to="{name: 'register'}">Register now</router-link>
            </div>
            <div v-else class="my-2 my-lg-0 d-flex align-items-center">
                <div class="rounded-circle userIcon p-1 position-relative">
                    <font-awesome-icon :icon="['fas', 'user-circle']" size="lg" class="mr-3" @click="showAcc = !showAcc"/>
                    <b-collapse v-model="showAcc" class="position-absolute mt-2 collapse-border" style="border-radius: 0.25rem;">
                        <div class="blue-bg borderRadius p-3" style="width: 160px; border-radius: 0.25rem; border:0;">
                            <router-link style="text-decoration: none; color: inherit;" :to="{name: 'accountSettings'}">
                                <div @click="closeBar">Account settings</div>
                            </router-link>
                            <router-link style="text-decoration: none; color: inherit;" :to="{name: 'roomsList'}" class="mt-2">
                                <div @click="closeBar" class="mt-2">Your rooms</div>
                            </router-link>
                        </div>
                    </b-collapse>
                </div>
                <small style="margin-left: 15px;">{{ logged.name }}</small>
                <button type="button" class="btn actionButton mx-3" @click="submit">Logout</button>
            </div>
        </div>
    </nav>
</template>

<script>
import AppHeader from '@/components/design/AppHeader';
import Login from '@/views/auth/Login.vue';
import {mapActions} from 'vuex';


export default {
  // eslint-disable-next-line vue/no-unused-components
  components: { Login, AppHeader },
    name: 'AppNavbar',
    data() {
        return {
            loginUser: 0,
            loginPass: '',
            showAcc: false,
            showLogin: false,
            showGames: false,
            mobileMenu: false
        };
    },
    computed: {
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        }
    },
    watch: {
        logged(value) {
            console.log(value);
            if (value !== null) {
                console.log('www');
            }
        },
        mobileMenu: {
            immediate: true,
            handler(val) {
                console.log('CHANGE ', val);
                if (val === false) {
                    this.showGames = false;
                }
            }
        }
    },
    mounted() {

    },
    methods: {
        ...mapActions('authLogin', ['logout']),
        submit() {
            this.showLogin = false;
            this.mobileMenu = false;
            this.logout({username: this.name, password: this.password});
        },
        showGameEvent() {
            console.log('HAPPEND');
            this.showGames = !this.showGames;
        },
        closeBar() {
            console.log('HELLO');
            this.mobileMenu = false;
            this.showGames = false;
            this.showLogin = false;
            this.showAcc = false;
        },
        openMobileMenu() {
            this.mobileMenu = !this.mobileMenu;
            if (!this.openMobileMenu) {
                this.showGames = false;
            }
            console.log('click');
        }
    }
}
</script>

<style>
#app {
  font-family: Gilroy;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: white;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

li { 
    color: white;
}

.borderRadius {
    border-radius: 0.25rem; 
}

.actionDropdown {
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: 0 !important;
    color: white !important;
    background-color: #8f94fb;
    border: 1px solid white;
}

.Navigation {
    background-color: #8f94fb;
    /* border: 2px solid white; */
    border-radius: 8px;
    padding: 20px;
    z-index: 600;
    color: white;
    margin: 20px 40px 0px 40px;
    text-align: center;
}

@media screen and (max-width: 767px) {
	.Navigation {
        margin-top: 0px !important;
		margin-left: 0px !important;
        margin-right: 0px !important;
        border-radius: 0;
        display: block !important;
	}

    .dropdown-block {
        display: none !important;
    }

}

.dropdown-item:hover {
    background-color: #001E6C;
    color: white
}

.userIcon {
    border: 2px solid white;
    cursor: pointer;
    width: 35px;
    height: 35px;
}

.menu-mobile-item {
  cursor: pointer;
  border-radius: 5px;
}

.menu-mobile-item:hover {
    background-color: #001E6C !important;
    transition: all ease .8s;
}

.adjust-margin {
    margin-top: 1px;
}

.collapse-border {
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    border: 0 !important;
}

.blue-bg {
    background-color: #8f94fb;
    border: 0;
}

</style>
