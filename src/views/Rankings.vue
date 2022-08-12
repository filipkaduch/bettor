<template>
  <b-container>
    <div class="rankings pl-lg-0 pt-lg-5">
        <h2 class="bettorLogo pt-1 pt-lg-5 mb-0 mb-lg-1">Rankings</h2>
          <p v-if="!triggerMobile">
              Table of current top <span>Bettor</span> players.
          </p>
          <b-container>
          <div class="d-flex justify-content-center w-100 position-relative align-items-center">
              <h4 class="mt-2 game-info">All players ({{ players.length }}):</h4>
              <div
                  v-if="logged !== 'null'"
                  class="position-absolute d-flex justify-content-between"
                  style="right: 0px; width: 40px;">
                  <font-awesome-icon :icon="['fas', 'sync']" class="cursor-pointer mr-2"/>
              </div>
          </div>
          <div style="background: #001E6C; height: 90%;" class="rounded">
              <b-row class="pt-2 pb-1 px-lg-3 m-1">
                <b-col cols="0" lg="1" class="d-flex align-items-center justify-content-start">
                </b-col>
                <b-col cols="5" lg="5" class="d-flex justify-content-start align-items-center">
                    <h5 class="game-info">Name:</h5>
                </b-col>
                <b-col cols="2" lg="2" class="d-flex align-items-center">
                    <h5 class="game-info">Won:</h5>
                </b-col>
                <b-col cols="5" lg="3" class="d-flex align-items-center">
                    <h5 class="game-info">Joined date:</h5>
                </b-col>
                <b-col v-if="!triggerMobile" cols="1" class="d-flex align-items-center">
                    <h5 class="game-info">Actions:</h5>
                </b-col>
              </b-row>
              <b-row class="p-1 px-lg-3 px-2 m-1">
                  <b-input-group class="d-flex">
                      <b-input v-model="search" type="text" class="ml-2 border p-2 roundedInput" placeholder="Search for player">
                      </b-input>
                      <template v-slot:append>
                          <div
                              class="d-flex align-items-center justify-content-center bg-white border h-100 w-100 rounded roundedSearch p-1 mb-1"
                              style="width: 36px;">
                              <font-awesome-icon :icon="['fas', 'search']" style="width: 36px; color: black" />
                          </div>
                      </template>
                  </b-input-group>
              </b-row>
              <!--<b-row>
                  <b-col class="d-flex justify-content-between align-items-center px-3 mx-3 py-1">
                      <h5 class="mb-0 d-flex">Filter:</h5>
                      <div class="w-100 d-flex justify-content-end align-items-center">
                          <font-awesome-icon v-if="playersFilterCount !== 0 || playersEntryCount !== 0 || selectedServer !== null || collapsible.end_date || collapsible.start_date" id="filtersRemove" :icon="['fas', 'ban']" class="cursor-pointer mx-2" @click="cleanFilters"/>
                          <b-tooltip target="filtersRemove">Remove filters</b-tooltip>
                          <b-button class="actionButton mx-1" variant="transparent" @click="sortRooms('end_date')" :disabled="collapsible.end_date">Joined</b-button>
                          <b-button class="actionButton mx-1" variant="transparent" @click="collapsible.players = !collapsible.players">Players</b-button>
                          <transition name="slide-side">
                              <b-input style="width: 50px;" v-if="collapsible.players" v-model="playersFilterCount"></b-input>
                          </transition>
                          <b-button class="actionButton mx-1" variant="transparent" @click="collapsible.entry = !collapsible.entry">Entry</b-button>
                          <transition name="slide-side">
                              <b-input style="width: 50px;" v-if="collapsible.entry" v-model="playersEntryCount"></b-input>
                          </transition>
                          <b-button class="actionButton mx-1" variant="transparent">Server</b-button>
                          <b-dropdown class="m-0 p-0 actionButton rounded text-white" no-caret variant="transparent">
                              <template class="mx-1 text-white" #button-content>
                                  {{ selectedServer === null ? 'Server' : selectedServer.text }}
                              </template>
                              <b-dropdown-item v-for="server in serverList" :key="server.value" @click="setServer(server)">{{ server.text }}</b-dropdown-item>
                          </b-dropdown>
                          <b-dropdown class="mx-1 p-0 actionButton rounded text-white" no-caret variant="transparent">
                              <template class="actionButton mx-1 text-white" #button-content>
                                  {{ selectedMetric === null ? 'Competition' : selectedMetric.metric }}
                              </template>
                              <b-dropdown-item v-for="metric in metricsList" :key="metric.value" @click="setMetric(metric)">{{ metric.text }}</b-dropdown-item>
                          </b-dropdown>
                      </div>
                  </b-col>
              </b-row>-->
              <b-container class="hide-scrollbar py-2 rounded resizeMax" style="overflow-y: scroll; scrollbar-width: none; background: #001E6C;">
                  <app-loading :loading="loading" :circle="true" variant="white">
                      <b-row v-for="player in players" :key="`${player.id}row`" class="border rounded p-lg-2 py-2 m-2 rowRecord bg-light" >
                          <b-col cols="1" class="d-flex justify-content-start align-items-center">
                            <div v-if="player.profile !== ''" class="rounded-circle actualIcon mx-2" :style="`background-image: url(${player.profile}); width: 32px; height: 32px;`"></div>
                            <div v-else class="rounded-circle actualIcon mx-2 p-1">
                              <font-awesome-icon :icon="['fas', 'user-circle']" size="lg" />
                            </div>
                          </b-col>
                          <b-col cols="5" lg="5" class="d-flex align-items-center">
                              {{ player.email }}
                          </b-col>
                          <b-col cols="2" class="d-flex align-items-center">
                              {{ player.rooms_won }}
                          </b-col>
                          <b-col cols="3" class="d-flex align-items-center px-0">
                              {{ player.joined }}
                          </b-col>
                          <!--<b-col cols="1" class="d-flex align-items-center">
                              <font-awesome-icon :id="`${room.game_id}icon`" :icon="['fas', `${getIcon(player.competition)}`]" />
                              <b-tooltip :target="`${room.game_id}icon`">{{ getMetricText(getIcon(player.competition)) }}</b-tooltip>
                          </b-col>-->
                          <b-col v-if="!triggerMobile" class="d-flex justify-content-end align-items-center">
                              <router-link style="text-decoration: none; color: inherit;" :to="{name: 'home', params: { player: player.id }}">
                                  <b-button variant="transparent" class="actionButton">
                                      <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
                                  </b-button>
                              </router-link>
                          </b-col>
                      </b-row>
                  </app-loading>
          </b-container>
        </div>
      </b-container>
    </div>
  </b-container>
</template>

<script>
// import {secondsToTime, timestampToDate} from '@/util/timeUtils';
import {serverList} from '@/util/consts/lolServers';
import AppLoading from '@/components/design/AppLoading';

export default {
  name: 'Rankings',
  components: {
    AppLoading
  },
    data() {
      return {
        serverList,
        selectedServer: null,
        selectedMetric: null,
        players: null,
        triggerMobile: false,
        loading: false,
        collapsible: {
          end_date: false,
          start_date: false,
          players: false,
          entry: false
        }
      }
   },
  computed: {
    logged() {
        return this.$store.getters['authLogin/token'] ?? null;
    },
    timeLeft() {
        const date3 = new Date(this.room.start_date);
        const date1 = new Date();
        const date2 = new Date(this.room.end_date);
        const diffTimeGame = Math.abs(date2 - date3);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        const diffDaysGame = Math.ceil(diffTimeGame / (1000 * 60 * 60 * 24)); 
        return `${ diffDays > diffDaysGame ? '' : diffDays} ${ diffDays > diffDaysGame ? `-` : diffDays > 1 ? `days` : `day`}`;
    }
  },
  watch: {
    windowWidth: {
      immediate: true,
      handler(val) {
        if (val < 767) {
          this.triggerMobile = true;
        } else {
          this.triggerMobile = false;
        }
      }
    }
  },
  created() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  },
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.onResize();
    if (this.windowWidth < 767) {
      this.triggerMobile = true;
    }
    this.loading = true;
    this.getRankings();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
      onResize() {
        this.windowWidth = window.innerWidth;
      },
      getMetricText() {
        return this.metricObject?.metric ?? '';
      },
      getRankings() {
          return this.$axios.get(
          'https://bettor-be.onrender.com/user/rankings')
              .then(({data}) => {
                  console.log(data);
                  this.players = this._.cloneDeep(data);
                  this.loading = false;
              })
              .catch(({response}) => {
                  console.error(response);
              });
      }
  }
}
</script>