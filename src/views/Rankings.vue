<template>
  <div class="rankings">
      <h1 class="bettorLogo" style="font-size: 2.5rem;">Rankings</h1>
        <p>
            Table of current top <span>Bettor</span> players.
        </p>
        <b-container>
        <div class="d-flex justify-content-center w-100 position-relative align-items-center">
            <h4 class="mt-2">All players ({{ players.length }}):</h4>
            <div
                v-if="logged !== 'null'"
                class="position-absolute d-flex justify-content-between"
                style="right: 0px; width: 40px;">
                <font-awesome-icon :icon="['fas', 'sync']" class="cursor-pointer mr-2"/>
            </div>
        </div>
        <div style="background: #001E6C; height: 80%;" class="rounded">
            <b-row class="pt-2 pb-1 px-3">
                    <b-col class="d-flex justify-content-start align-items-center" cols="3">
                        <h5>Name:</h5>
                    </b-col>
                    <b-col cols="1" class="d-flex align-items-center">
                        <h5>Attended:</h5>
                    </b-col>
                    <b-col cols="1" class="d-flex align-items-center">
                        <h5>Won:</h5>
                    </b-col>
                    <b-col cols="2" class="d-flex align-items-center">
                        <h5>Joined date:</h5>
                    </b-col>
                    <b-col cols="2" class="d-flex align-items-center">
                        <h5>Game:</h5>
                    </b-col>
                    <b-col cols="1" class="d-flex align-items-center">
                        <h5>Competition:</h5>
                    </b-col>
                    <b-col class="d-flex align-items-center justify-content-end">
                        <h5>Actions:</h5>
                    </b-col>
            </b-row>
            <b-row class="p-1 px-3">
                <b-input-group class="d-flex">
                    <b-input v-model="search" type="text" class="ml-2 mr-4 border p-2 roundedInput" placeholder="Search for player">
                    </b-input>
                    <template slot="append">
                        <div
                            class="d-flex align-items-center justify-content-center bg-white border h-100 w-100 rounded roundedSearch p-1 mb-1"
                            style="width: 36px;">
                            <font-awesome-icon :icon="['fas', 'search']" style="width: 36px; color: black" />
                        </div>
                    </template>
                </b-input-group>
            </b-row>
            <b-row>
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
                        <!-- <b-button class="actionButton mx-1" variant="transparent">Server</b-button> -->
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
            </b-row>
            <b-container class="hide-scrollbar py-2 rounded resizeMax" style="overflow-y: scroll; scrollbar-width: none; background: #001E6C;">
                <app-loading :loading="loading" :circle="true" variant="white">
                    <b-row v-for="player in filteredPlayers" :key="`${player.id}row`" class="border rounded p-2 mb-2 rowRecord bg-light" >
                        <b-col class="d-flex justify-content-start align-items-center" cols="3">
                            {{ player }}
                        </b-col>
                        <b-col cols="1" class="d-flex align-items-center">
                            {{ player }}
                        </b-col>
                        <b-col cols="1" class="d-flex align-items-center">
                            {{ player}}
                        </b-col>
                        <b-col cols="2" class="d-flex align-items-center">
                            {{ player }}
                        </b-col>
                        <b-col cols="3" class="d-flex align-items-center">
                            {{ player }}
                        </b-col>
                        <b-col cols="1" class="d-flex align-items-center">
                            <font-awesome-icon :id="`${room.game_id}icon`" :icon="['fas', `${getIcon(player.competition)}`]" />
                            <b-tooltip :target="`${room.game_id}icon`">{{ getMetricText(getIcon(player.competition)) }}</b-tooltip>
                        </b-col>
                        <b-col class="d-flex justify-content-end align-items-center">
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
</template>

<script>
// import {secondsToTime, timestampToDate} from '@/util/timeUtils';
import {serverList} from '@/util/consts/lolServers';
import AppLoading from '@/components/design/AppLoading';
import axios from 'axios';

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
        players: [],
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
  methods: {
      removeRoom() {
          return axios.delete(
          `https://e-bettor.herokuapp.com/remove_roomm?room=${this.room.id}`,
              { headers: {
                  'Content-type':'application/json'
              }})
              .then(({data}) => {
                  console.log(data);
                  
              })
              .catch(({response}) => {
                  console.error(response);
              });
      }
  }
}
</script>