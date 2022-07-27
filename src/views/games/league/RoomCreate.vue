<template>
    <b-form class="w-100 overflow-scroll hide-scrollbar h-100 p-3 mb-5">
        <b-form-group class="mt-md-2 mb-2">
            <div class="">
                <h4>{{ $t('t_NameOfRoom') }}</h4>
            </div>
            <b-input v-model="name" type="text" :maxLength="30" />
        </b-form-group>
        <h4>{{ $t('t_ChooseAccessibility') }}</h4>
        <b-form-group class="my-2">
            <div class="d-flex justify-content-between w-100 px-5">
                <b-form-radio v-model="selectedAccess" value="PUBLIC">Public</b-form-radio>
                <b-form-radio v-model="selectedAccess" value="PRIVATE">Private</b-form-radio>
            </div>
        </b-form-group>
        <b-dropdown class="my-2 w-100" no-caret>
            <template #button-content>
                {{ selectedServer === null ? $t('t_ChooseServer') : selectedServer.text }}
            </template>
            <b-dropdown-item v-for="server in serverList" :key="server.value" @click="setServer(server)">{{ server.text }}</b-dropdown-item>
        </b-dropdown>
        <div class="my-2">
            <h4>{{ $t('t_ChooseGamemode') }}</h4>
            <b-form-group class="my-2">
                <div class="d-flex justify-content-between w-100 px-5">
                    <b-form-radio name="ranked" v-model="selectedMode" value="RANKED">Ranked</b-form-radio>
                    <b-form-radio v-model="selectedMode" value="NORMAL">Normal</b-form-radio>
                    <b-form-radio v-model="selectedMode" value="CUSTOM">Custom</b-form-radio>
                </div>
            </b-form-group>
        </div>
        <h4>{{ $t('t_NumberOfPlayers') }}</h4>
        <b-form-group class="my-2">
            <b-input v-model="numOfPlayers" type="number" min="2" />
        </b-form-group>
        <hr />
        <h4 class="align-text-left">Competition mode setup</h4>    
        <b-dropdown class="mb-2 mt-4 w-100" no-caret>
            <template #button-content>
                {{ selectedMetric === null ? $t('t_ChooseMetric') : selectedMetric.text }}
            </template>
            <b-dropdown-item v-for="metric in metricsList" :key="metric.value" @click="setCompetitionMetric(metric)">{{ metric.text }}</b-dropdown-item>
        </b-dropdown>               
        <h4>{{ selectedMetric !== null ? `${selectedMetric.metric} to reach:` : 'Metric to reach:' }}</h4>
        <b-form-group class="my-2">
            <b-input v-model="metricCount" type="number" min="0" :disabled="selectedMetric === null" />
        </b-form-group>
        <h4>{{ $t('t_GamesToReach') }}</h4>
        <b-form-group class="my-2">
            <b-input v-model="maxGames" type="number" min="1" />
        </b-form-group>
        <h4>{{ $t('t_DurationTime') }}</h4>
        <div class="d-flex justify-content-between">
            <div>
                <small>Start date</small>
                <b-form-group class="my-2">
                    <b-datepicker v-model="startDate" :min="new Date().toISOString().substr(0, 10)" />
                </b-form-group>
            </div>
            <div>
                <small>End date</small>
                <b-form-group class="my-2">
                    <b-datepicker v-model="endDate" :min="new Date().toISOString().substr(0, 10)" />
                </b-form-group>
            </div>
        </div>
        <div class="d-flex justify-content-between">
          <div>
            <small>Start time</small>
            <b-form-group class="my-2">
              <b-form-timepicker v-model="startTime" locale="en"></b-form-timepicker>
            </b-form-group>
          </div>
          <div>
            <small>End time</small>
            <b-form-group class="my-2">
              <b-form-timepicker v-model="endTime" locale="en"></b-form-timepicker>
            </b-form-group>
          </div>
        </div>
        <hr />
        <h4 class="align-text-left">Prize pool setup</h4>
        <div class="mt-4">
            <h4>{{ $t('t_ChooseNumberOfWinners') }}</h4>
            <b-form-group class="my-2">
                <b-input v-model="winners" type="number" min="1" :max="numOfPlayers - 1" />
            </b-form-group>
            <h4>{{ $t('t_CompetitionCredits') }}</h4>
            <b-form-group class="my-2">
                <b-input v-model="competitionCredits" type="number" min="0" />
            </b-form-group>
            <div class="d-flex justify-content-between mt-4">
                <h4 class="align-text-left">Average prize:</h4>
                <h4>{{ getAveragePrize() }} credits</h4>
            </div>
            <hr />
        </div>
        <div class="mb-4">
            <b-button class="btn btn-block mb-5" :disabled="!enableCreate" @click="createRoom">Create and join</b-button>
        </div>
    </b-form>
</template>

<script>
// import {secondsToTime, timestampToDate} from '@/util/timeUtils';
// import axios from 'axios';
import {serverList} from '@/util/consts/lolServers';
import {metricsList} from '@/util/consts/lolMetrics';

export default {
    name: 'RoomCreate',
    data() {
        return {
            info: null,
            name: '',
            selectedServer: null,
            startDate: null,
            endDate: null,
            selectedAccess: '',
            disableCreate: false,
            selectedMetric: null,
            selectedMode: '',
            metric: '',
            competitionCredits: 0,
            numOfPlayers: 2,
            winners: 1,
            endTime: null,
            startTime: null,
            maxGames: 1,
            metricCount: 0,
            serverList,
            metricsList
        };
    },
    computed: {
        enableCreate() {
            return (this.startDate !== null && this.endDate !== null && this.selectedMetric !== null && this.numOfPlayers !== 0
                && this.winners !== 0 && this.maxGames !== 0 && this.metricCount !== 0 && this.selectedServer !== null && this.selectedAccess !== '')
                && !this.disableCreate;
        },
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        }
    },
    mounted() {

    },
    methods: {
        resetRoom() {
            this.selectedServer = null;
            this.startDate = null;
            this.name = '';
        },
        createRoom() {
          this.disableCreate = true;
          return this.$axios.post(`http://localhost:5000/room`, {
            game_id: 'lol',
            players_count: this.numOfPlayers,
            actual_players: 1,
            bank: 0,
            owner_id: this.logged.id,
            room_id: this.name,
            access: this.selectedAccess,
            metric: this.selectedMetric.metric,
            metric_value: this.metricCount,
            max_games: this.maxGames,
            winners: this.winners,
            server: this.selectedServer.value,
            start_date: this.startDate,
            end_date: this.endDate,
            start_time: this.startTime,
            end_time: this.endTime,
            entry: this.competitionCredits,
            gamemode: this.selectedMode
          })
          .then(({data}) => {
              console.log(data);
          })
          .catch((response) => {
              console.log(response);
          }).finally(() => {
              this.$emit('closeCreate');
          });
        },
        setCompetitionMetric(metric) {
            this.selectedMetric = metric;
        },
        setServer(server) {
            this.selectedServer = server;
        },
        emitClose() {
            this.$emit('closeCreate');
        },
        getAveragePrize() {
            if (this.winners !== 0 && this.competitionCredits !== 0) {
                return (this.competitionCredits * this.numOfPlayers) / this.winners;
            }
            return 0;
        }
    }
}
</script>

<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.hide-scrollbar {
    overflow: auto;
    -ms-overflow-style: none; /* IE 11 */
    scrollbar-width: none; /* Firefox 64 */
}

.align-text-left {
    text-align: left;
}

::-webkit-scrollbar {
  display: none;
}

</style>