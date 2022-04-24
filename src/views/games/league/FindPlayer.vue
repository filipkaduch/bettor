<template>
    <b-col cols="12" class="header shadow bottom h-100" style="background: #1F3C88; border-radius: 8px;">
        <div class="mb-2 d-flex justify-content-between header p-3 align-items-center">
            <div>
                <h4>Find a player</h4>
            </div>
            <div>
                <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" @click="emitClose" style="cursor: pointer;"/>
            </div>
        </div>
        <app-loading :loading="isLoading" :circle="true">
            <div v-if="info === null" class="w-100 p-3">
                <h4>{{ $t('t_NameOfRoom') }}</h4>
                <b-input v-model="name" class="mb-2 w-100" />
                <b-dropdown class="my-2 w-100" no-caret>
                    <template #button-content>
                        {{ selectedServer === null ? $t('t_ChooseServer') : selectedServer.text }}
                    </template>
                    <b-dropdown-item v-for="server in serverList" :key="server.value" @click="setServer(server)">{{ server.text }}</b-dropdown-item>
                </b-dropdown>
                <b-button class="btn btn-block btn-action mb-2 w-100" @click="getSummonerLastMatch">Show player</b-button>
            </div>
            <div v-else class="w-100 p-3">
                <h2 class="my-3">{{ foundName === '' ? 'Player' : foundName }}'s last game info</h2>
                <h3>{{ getWin === true ? 'WIN!' : 'Lost' }}</h3>
                <!--<img :src="require(`@/assets/images/lol-icons/${this.champion}Square.png`)" class="champ-icon" />-->
                <ul> 
                    <li>Game mode: {{ info.gameMode }}</li>
                    <li>Server: {{ info.platformId }}</li>
                    <li>Players: {{ info.participants.length }}</li>
                    <li>Start date: {{ startDate }}</li>
                    <li>Duration: {{ time }}</li>
                </ul>
                <b-button class="btn btn-block btn-action mb-2 w-100 position-relative px-3" style="bottom: 10px; left:0;" @click="resetSummoner">Back to search</b-button>
            </div>
        </app-loading>
    </b-col>
</template>

<script>
import {secondsToTime, timestampToDate} from '@/util/timeUtils';
import {serverList} from '@/util/consts/lolServers';
import axios from 'axios';
import AppLoading from '../../../components/design/AppLoading.vue';


export default {
  components: { AppLoading },
    name: 'FindPlayer',
    data() {
        return {
            info: null,
            name: '',
            foundName: '',
            selectedServer: null,
            time: null,
            startDate: null,
            serverList,
            isLoading: false
        };
    },
    computed: {
        getWin() {
            return false;
        }
    },
    mounted() {
    },
    methods: {
        resetSummoner() {
            this.info = null;
            this.foundName = '';
            this.selectedServer = null;
            this.time = null;
            this.champion = null,
            this.startDate = null;
            this.name = '';
        },
        setServer(server) {
            this.selectedServer = server;
        },
        findSummoner(party) {
            const player = party.find((pl) => pl.summonerName === this.name);

            if (typeof player !== 'undefined') {
                this.champion = player.championName;
                return player.summonerName;
            }
            return '';
        },
        emitClose() {
            this.$emit('closeCreate');
        },
        getSummonerLastMatch() {
            this.isLoading = true;
            if (this.name !== '') {
                return axios.get(`https://e-bettor.herokuapp.com/summoner?name=${this.name}&server=${this.selectedServer.value}`, { headers: {
                'Content-type':'application/json'
            }})
                .then(({data}) => {
                    this.info = data?.info;
                    this.time = secondsToTime(data?.info?.gameDuration);
                    this.startDate = timestampToDate(data?.info?.gameStartTimestamp);
                    this.foundName = this.findSummoner(data?.info?.participants);
                    console.log(data);
                })
                .catch((response) => {
                    console.log(response);
                }).finally(() => {
                    this.isLoading = false;
                });
            } else {
                this.name = 'Empty state not allowed';
            }
        },
    }
}

</script>

<style>
    .champ-icon {
        height: 100px;
    }
</style>