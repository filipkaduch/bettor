<template>
    <b-col cols="12" class="header shadow bottom h-100 pr-0 pl-0" style="background: #1F3C88; border-radius: 8px;">
        <div class="mb-2 d-flex justify-content-between header p-3 align-items-center">
            <div>
                <h4>Rooms progress</h4>
            </div>
            <div>
                <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" @click="emitClose" style="cursor: pointer;"/>
            </div>
        </div>
        <app-loading :loading="isLoading" class="h-100 pb-5" :circle="true" variant="white">
            <div class="w-100 overflow-scroll hide-scrollbar history-height p-3 pt-0 mb-1 mb-lg-5" style="height: calc(100% - 68px) !important;">
                <b-row v-for="(history, index) in historiesData" :key="index" style="height: 250px; background-color: #4e54c8;" class="rounded p-2 m-2 mb-xl-4 rowHover cursor-pointer">
                    <b-col cols="1" class="border-line-white justify-content-between d-flex align-items-center" style="border-right: 1px solid white; flex-direction: column;">
                      {{ index + 1 }}.
                      <div class="actionIcons py-2">
                        <div class="actionIcon rounded-circle px-2 py-1">
                          <font-awesome-icon :icon="['fas', 'trash']" size="sm" class="ml-0" @click="deleteRoomAttendee(history.id)"/>
                        </div>
                        <div class="actionIcon rounded-circle px-2 py-1">
                          <font-awesome-icon :icon="['fas', 'redo']" size="sm" class="ml-0" @click="refreshRoomAttendee(history.id)" />
                        </div>
                      </div>
                    </b-col>
                    <b-col cols="8">
                        <h4 class="history-text">{{ relevantMetricsComputed[index].metric }}: {{ history.count }}/{{ relevantMetricsComputed[index].value }}</h4>
                        <h4 class="history-text">{{ $t('t_games') }}: {{ history.games_count }}/{{ relevantMetricsComputed[index].games }}</h4>
                        <h4 class="history-text">{{ $t('t_timeLeft') }}: {{ getTimeLeft(relevantMetricsComputed[index]) }} </h4>
                        <h4 class="mt-auto history-text">{{ $t('t_outcome') }}:</h4>
                        <h4 class="history-text">{{ $t('t_game') }}: {{ getGame(index) }} </h4>
                    </b-col>
                    <b-col cols="12" xs="12" lg="3" sm="3" md="3" class="d-flex history-text mb-2 px-1">
                        <div class="rounded p-2 h-100 w-100" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">{{ `Get ${relevantMetricsComputed[index].value - history.count}
                            ${lowercaseFirstLetter(relevantMetricsComputed[index].metric)} in ${relevantMetricsComputed[index].games - history.games_count} games and land a spot` }}</div>
                    </b-col>
                  <b-button variant="transparent" class="differButton my-auto d-flex align-items-center justify-content-center w-100" @click="goToRoom(history.game_id, relevantMetricsComputed[index].id)">
                    {{ $t('t_room') }}
                    <font-awesome-icon :icon="['fas', 'angle-right']" size="lg" style="margin-left: 10px;" />
                  </b-button>
                </b-row>
            </div>
        </app-loading>
    </b-col>
</template>

<script>
import {timestampToDate} from '@/util/timeUtils';
import {serverList} from '@/util/consts/lolServers';
import {gamesList} from '@/util/consts/games';
import AppLoading from '@/components/design/AppLoading.vue';


export default {
  components: { AppLoading },
    name: 'HistoryList',
    props: {
        player: {
            type: Object,
            default: null
        },
        room: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            histories: [],
            historiesData: null,
            metricsData: null,
            relevantMetrics: [],
            relevantRooms: [],
            compareHistories: [],
            gamesList,
            serverList,
            isLoading: false,
            timestampToDate
        };
    },
    computed: {
        getWin() {
            return false;
        },
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        },
        metrics() {
            return this.$store.getters['roomsData/storeMetrics'] ?? null;
        },
        rooms() {
            return this.$store.getters['roomsData/storeRooms'] ?? null;
        },
        relevantMetricsComputed() {
            return this.relevantMetrics ?? [];
        }
    },
    created() {
      this.getAllMetrics().then(() => {
        this.getAllHistory().then(() => {
          this.relevantMetrics = [];
          this.relevantRooms = [];
          Object.keys(this.metricsData).forEach((key) => {
            if (this.historiesData.findIndex((hist) =>
                hist.metric_id === this.metricsData[key].id
            ) > -1 ) {
              this.relevantMetrics.push(this.metricsData[key]);
              this.relevantRooms.push(this.metricsData[key].game_id);
            }
          });
        }).finally(() => {
          this.isLoading = false;
        });
      });
    },
    methods: {
        emitClose() {
            this.$emit('closeCreate');
        },
        goToRoom(room, metric) {
            console.log(room, metric);
            this.emitClose();
            this.$router.push({
                name: 'lolRoomDetail',
                params: {
                    metric: metric,
                    game: room
            }});
        },
        deleteRoomAttendee(id) {
          console.log(id);
          if (this.logged) {
            return this.$axios.delete(
            `https://bettor-be.onrender.com/room-attendee/${id}`)
                .then(({data}) => {
                  console.log(data);
                  this.historiesData.splice(this.historiesData.indexOf((el) => el.id === id), 1);

                })
                .catch(({response}) => {
                  console.error(response);
                });
          }
        },
        refreshRoomAttendee(id) {
          return this.$axios.get(
              `http://localhost:5000/room-attendee/${id}`)
              .then(({data}) => {
                console.log(data);
              })
              .catch(({response}) => {
                console.error(response);
              });
        },
        getGame(index) {
            const findIndex = this.gamesList.findIndex((game) => game.metric === this.relevantMetricsComputed[index].game_id);
            if (findIndex > -1) {
                return this.gamesList[findIndex].text;
            }
            return '';
        },
        lowercaseFirstLetter(string) {
            return string.charAt(0).toLowerCase() + string.slice(1);
        },
        getAllMetrics() {
          this.isLoading = true;
          if (this.logged) {
            return this.$axios.get(
                'https://bettor-be.onrender.com/metric/all-metrics')
                .then(({data}) => {
                  console.log(data);
                  this.metricsData = this._.cloneDeep(data);
                })
                .catch(({response}) => {
                  console.error(response);
                });
          }
        },
        getAllHistory() {
            this.histories = [];
            if (this.logged) {
              return this.$axios.get(`https://bettor-be.onrender.com/room-attendee/by-user/${this.logged.id}`)
              .then(({data}) => {
                  console.log(data);
                  this.historiesData = this._.cloneDeep(data);
              })
              .catch((response) => {
                  console.error(response);
              });
            }
        },
        getTimeLeft(history) {
            return this.timeLeft(history);
        },
        timeLeft(room) {
            const date3 = new Date(room.start_date);
            const date1 = new Date();
            const date2 = new Date(room.end_date);
            const diffTimeGame = Math.abs(date2 - date3);
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const diffDaysGame = Math.ceil(diffTimeGame / (1000 * 60 * 60 * 24)); 
            return `${ diffDays > diffDaysGame ? '' : diffDays} ${ diffDays > diffDaysGame ? `-` : diffDays > 1 ? `days` : `day`}`;
        }
    }
}

</script>

<style scoped>

.history-text {
  text-align: start;
}

.actionIcon:hover {
  background-color: #001E6C;
  opacity: 0.7;
}

@media screen and (max-width: 767px) {
    .history-text {
        font-size: 12px;   
    }
    .border-line-white {
        border: 0 !important;
    }
}

</style>