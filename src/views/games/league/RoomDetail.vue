<template>
    <app-loading :loading="isLoading" :circle="true">
        <div class="mobile-card d-flex justify-content-center pb-0" style="height: 100%;">
            <b-card class="custom-card pt-0 bg-semiblue" header-class="border-0" body-class="custom-body px-1">
                <template #header class="pb-0">
                  <div class="pb-0 w-100 d-flex" style="z-index: 300;">
                    <div class="d-flex w-100 justify-content-between align-items-center mb-1 mb-xl-4">
                      <div class="custom-row d-flex align-items-center">
                        <h2 class="mb-0"><span class="bettorLogo" style="font-size: 2rem;">{{ getRoomName }}</span></h2>
                        <!--<h2>{{ `${metricObject.value} ${metricObject.metric} in ${metricObject.games} games` }}</h2>-->
                      </div>
                      <div class="fa-holder">
                        <router-link style="text-decoration: none; color: inherit; position:relative;" :to="{name: 'lol'}">
                          <font-awesome-icon :icon="['fas', 'map-pin']" size="2x" style="cursor: pointer;"/>
                        </router-link>
                      </div>
                    </div>
                  </div>
                    <b-btn-group class="w-100 px-2 pb-2 pt-0">
                      <b-btn class="p-1" @click="openOrbital('info')" :style="enabledDict.info ? 'background: #001E6C !important; pointer-events: none !important;' : ''">
                        <div><font-awesome-icon :icon="['fas', 'info-circle']" size="lg" class="orbital-icon"/></div>
                        <p>{{ $t('t_gameInfo') }}</p>
                      </b-btn>
                      <b-btn class="p-1" @click="openOrbital('outcome')" :style="enabledDict.outcome ? 'background: #001E6C !important; pointer-events: none !important;' : ''">
                          <div><font-awesome-icon :icon="['fas', 'piggy-bank']" size="lg" class="orbital-icon"/></div>
                          <p>{{ $t('t_expectedOutcome') }}</p>
                      </b-btn>
                      <b-btn class="p-1" @click="openOrbital('stats')" :style="enabledDict.stats ? 'background: #001E6C !important; pointer-events: none !important;' : ''">
                          <div><font-awesome-icon :icon="['fas', 'users']" size="lg" class="orbital-icon"/></div>
                          <p>{{ $t('t_players') }}</p>
                      </b-btn>
                      <b-btn class="p-1" @click="openOrbital('chat')" :style="enabledDict.chat ? 'background: #001E6C !important; pointer-events: none !important;' : ''">
                          <div><font-awesome-icon :icon="['fas', 'envelope']" size="lg" class="orbital-icon"/></div>
                          <p>{{ $t('t_chat') }}</p>
                      </b-btn>
                    </b-btn-group>
                </template>
                <b-card-body class="d-flex justify-content-center align-items-center h-100 overflow-hidden pt-0" style="padding-bottom: 0; overflow-y: scroll;">
                    <div class="orbital-pulse action-shadow d-flex align-items-center justify-content-center h-100" style="border-radius: 15%; " :style="orbitalWidth">
                        <div v-if="activeKey === ''">
                            <font-awesome-icon :icon="['fas', 'expand']" size="lg" style="cursor: pointer;"/>
                        </div>
                        <div v-if="enabledDict.info" class="w-100 h-100 p-2 p-lg-3 justify-content-start d-flex" style="flex-direction: column;">
                            <div v-if="triggerMobile">
                              <div class="d-flex justify-content-center mb-xxl-5 mb-2"><h3>{{ $t('t_gameInfo') }}</h3></div>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_competition') }}:</b>
                                <div>{{ getMetricText }}<font-awesome-icon class="ml-2" :id="`${room.game_id}icon`" :icon="['fas', `${getIcon}`]" style="width: 24px; height: 24px;" /></div>
                              </h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ `${getMetricText} to reach`}}:</b> {{ getMetricValue }}</h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_gamesAvailable') }}:</b> {{ room.max_games }}</h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_startDate') }}:</b> {{ timestampToDate(new Date(room.start_date + ' ' + room.start_time), true) }}</h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_endDate') }}:</b> {{ timestampToDate(new Date(room.end_date + ' ' + room.end_time), true) }}</h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_players') }}:</b> {{ `${Object.keys(players).length}/${getPlayersCount}` }}</h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_winners') }}:</b> {{ `${room.winners}` }}</h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_timeLeft') }}:</b> {{ timeLeft }}</h4>
                              <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ $t('t_entryCredits') }}:</b> {{ bankText }}</h4>
                            </div>
                            <b-container v-else>
                              <div class="d-flex justify-content-center mb-xxl-5"><h3 class="game-info">{{ $t('t_gameInfo') }}</h3></div>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ `${getMetricText} to reach`}}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info">{{ getMetricValue }}</h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ $t('t_gamesAvailable') }}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info"><b>{{ room.max_games }}</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ $t('t_startDate') }}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info"><b>{{ timestampToDate(new Date(room.start_date + ' ' + room.start_time), true) }}</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ $t('t_endDate') }}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info"><b>{{ timestampToDate(new Date(room.end_date + ' ' + room.end_time), true) }}</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ $t('t_players') }}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info"><b>{{ `${Object.keys(players).length}/${getPlayersCount}` }}</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ $t('t_winners') }}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info"><b>{{ `${room.winners}` }}</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ $t('t_timeLeft') }}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info"><b>{{ timeLeft }}</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center align-items-center header-row p-1">
                                <h4 class="game-info"><b>{{ $t('t_entryCredits') }}:</b></h4>
                              </b-row>
                              <b-row class="d-flex justify-content-center">
                                <h4 class="game-info"><b>{{ bankText }}</b></h4>
                              </b-row>
                            </b-container>
                            <div
                                v-if="logged !== 'null'"
                                class="semiButton btn mx-1 w-100 mt-auto"
                                @click="refreshStats">
                              <app-loading :loading="isLoadingRefresh" :circle="true" variant="white" :disabled="true">
                                {{ $t('t_refreshStats') }}:
                                <font-awesome-icon :icon="['fas', 'redo']" size="lg" class="mx-2" style="cursor: pointer;"/>
                              </app-loading>
                            </div>
                        </div>
                        <div v-if="enabledDict.outcome" class="w-100 h-100 p-3 justify-content-between d-flex" style="flex-direction: column;">
                            <div>
                                <div class="d-flex justify-content-center mb-5" style="text-align: start;"><h3>{{ $t('t_expectedOutcome') }}</h3></div>
                                <h4 class="game-info" style="text-align: start;"><b>{{ $t('t_yourCredits') }}:</b> 1200 </h4>
                                <h4 class="game-info w-100" style="border-bottom: 1px solid white; text-align: start;"><b>{{ $t('t_entryCredits') }}:</b> {{ room.entry }}</h4>
                                <h4 class="game-info" style="text-align: start;"><b>{{ $t('t_creditsAvailable') }}:</b> {{ 1200 - room.entry }}</h4>
                            </div>
                            <b-button variant="transparent" class="btn p-2 mt-5 w-100 d-flex justify-content-center align-items-center semiButton" @click="joinRoom" :disabled="canJoin || timeLeft === '-'">
                                <app-loading :loading="isLoadingJoin" :circle="true">
                                    {{ $t('t_join') }}
                                    <font-awesome-icon :icon="['fas', 'coins']" size="lg" style="margin-left: 10px;" />
                                </app-loading>
                            </b-button>
                        </div>
                        <div v-if="enabledDict.stats" class="w-100 h-100 p-1 p-xl-3">
                            <div class="d-flex justify-content-center mb-2"><h3>{{ $t('t_players') }}</h3></div>
                            <b-row class="pt-2 pb-1 mx-2 d-lg-flex d-none">
                                <b-col cols="1" class="d-flex justify-content-start align-items-center">

                                </b-col>
                                <b-col cols="6" class="d-flex justify-content-start align-items-center">
                                    <h5>{{ $t('t_NameOfRoom') }}</h5>
                                </b-col>
                                <b-col cols="2" class="d-flex align-items-center justify-content-start">
                                    <h5>{{ getMetricText }}:</h5>
                                </b-col>
                                <b-col cols="2" lg="3" xl="3" class="d-flex align-items-center justify-content-start">
                                    <h5>{{ $t('t_games') }}:</h5>
                                </b-col>
                            </b-row>
                            <b-row v-for="(player, index) in players" :key="`${player.id}row`" class="rounded p-2 mb-2 mx-1 rowRecord playerRecord text-white" style="background: #001E6C;" @click="openPlayer(index)">
                                <b-col cols="1" class="d-flex justify-content-start align-items-center">
                                    {{ index + 1 }}
                                </b-col>
                                <b-col cols="6" class="d-flex align-items-center" :class="isOwner ? 'justify-content-between' : 'justify-content-start'">
                                    {{ player.name }}
                                    <span v-if="isOwner" class="owner-badge"><font-awesome-icon :icon="['fas', 'crown']" /></span>
                                </b-col>
                                <b-col cols="2" class="d-flex justify-content-start align-items-center">
                                    {{ player.count }}
                                </b-col>
                                <b-col cols="2" xl="3" lg="3" class="d-flex justify-content-start align-items-center">
                                    {{ player.games_count }}
                                </b-col>
                                <transition name="grow-down" mode="out-in">
                                    <b-col v-if="showPlayers[getIndex(index)]" cols="12">
                                        <competition-history :attendeeId="player.id" :gameId="room.id" :room="room" :metric="metricObject" />
                                    </b-col>
                                </transition>
                            </b-row>
                        </div>
                        <div v-if="enabledDict.chat" class="w-100 h-100 p-3" style="place-content: space-between; display: flex !important; flex-direction: column;">
                          <!--<app-chat :chat-id="chatId" :room="room"></app-chat>-->
                            <div class="d-flex justify-content-between mb-2"><h3>{{ $t('t_chat') }}</h3></div>
                                <div class="hide-scrollbar py-1 py-lg-2 rounded" style="overflow-y: scroll; scrollbar-width: none; height: 100% !important;">
                                    <div v-for="(msg, index) in chatComputed" :key="`${index}`" :class="isAuthor(msg.author) ? 'text-start' : 'text-end'" class="my-1 my-lg-2">
                                        <h5 class="mb-0 game-info">{{ msg.message }}</h5>
                                        <small v-if="changedAuthor(index, msg.author)" style="border-top: 1px solid white">{{ msg.author }}, {{ timestampToDate(msg.time_sent) }}</small>
                                    </div>
                                </div>
                            <div class="d-flex">
                                <b-input v-model="chatMessage" type="text" style="background-color: transparent; color: white; height: auto !important;" />
                                <b-btn class="border p-1 px-3 inputIcon rounded text-white" variant="transparent" :disabled="canWrite" @click="sendMessage">
                                  <font-awesome-icon :icon="['fas', 'angle-right']" size="2x" />
                                </b-btn>
                            </div>
                        </div>
                    </div>
                </b-card-body>
            </b-card>
            <!--<app-orbit :room="room" :metric="metricObject" :players="players" :chatComputed="chatComputed" @refresh="refreshStats" />-->
        </div>
    </app-loading>
</template>

<script>
import AppLoading from '@/components/design/AppLoading';
// import AppOrbit from '@/components/design/AppOrbit';
// import AppChat from "@/components/design/AppChat";
import CompetitionHistory from '@/views/games/league/CompetitionHistory';
import {timestampToDate} from '@/util/timeUtils';
import axios from 'axios';


export default {
    name: 'RoomDetail',
    components: { AppLoading, CompetitionHistory },
    props: {
      room: {
        type: Object,
        default: null
      },
      metricObject: {
        type: Object,
        default: null
      }
    },
    data() {
        return {
            metric: this.metricId,
            isLoadingRefresh: false,
            isLoading: false,
            timestampToDate,
            players: [],
            activeOrbit: false,
            enabledDict: {
                info: true,
                stats: false,
                outcome: false,
                chat: false
            },
            activeKey: 'info',
            orbitalWidth: `width: 100% !important; height: 100% !important; animation: none; z-index: 290; background-color: #001E6C; border-radius: 15px;`,
            chat: null,
            chatId: 1,
            windowWidth: 0,
            triggerMobile: false,
            showPlayers: [],
            isLoadingJoin: false,
            isLoadingPlayers: false,
            chatMessage: ''
        };
    },
    computed: {
        getRoomName() {
            return this.room?.room_id ?? '';
        },
        getPlayersCount() {
            return this.room?.players_count ?? 0;
        },
        chatComputed() {
            return this?.chat ?? [];
        },
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
        },
      bankText() {
        return `${this.room.entry} credits`;
      },
      getMetricText() {
        return this.metricObject?.metric ?? '';
      },
      getMetricValue() {
        return this.metricObject?.value ?? 0;
      },
      getIcon() {
        if (this.metricObject?.metric) {
          switch(this.metricObject?.metric) {
            case 'Kills':
              return 'skull';
            case 'Wins':
              return 'broom';
            case 'Assists':
              return 'hands-helping';
            case 'Golds':
              return 'coins';
            default:
              return 'skull';
          }
        }
        return 'skull';
      },
      canJoin() {
          let found = false;
          Object.keys(this.players).forEach((key) => {
              if (this.players[key].user_id === this.logged.id) {
                  found = true;
              }
          });
          return found || this.logged === 'null';
      },
      canWrite() {
          console.log(this.logged);
          return this.logged === 'null';
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
        },
        activeOrbit(val) {
            this.$nextTick(() => {
                if (val) {
                    this.orbitalWidth = `width: 100% !important; height: 100% !important; animation: none; z-index: 290; background-color: #001E6C; border-radius: 15px;`;
                    setTimeout(()=>{
                        this.enabledDict[this.activeKey] = true;
                    },700);
                } else {
                    this.enabledDict[this.activeKey] = false;
                    setTimeout(()=>{
                        this.activeKey = '';
                    },500);
                    this.orbitalWidth = '';
                }
            })
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
        this.getPlayers();
        this.getChat();
    },
    beforeDestroy() { 
        window.removeEventListener('resize', this.onResize); 
    },
    methods: {
        isAuthor(author) {
            if (typeof this.logged.name === 'undefined') {
                return Math.random() < 0.5;
            }
            return this.logged?.name === author;
        },
        onResize() {
            this.windowWidth = window.innerWidth;
        },
        openOrbital(key) {
            for(const checkKey in this.enabledDict) {
                this.enabledDict[checkKey] = false;
            }
            this.enabledDict[key] = true;
            this.activeKey = key;
            // this.activeOrbit = !this.activeOrbit;
        },
        getChat() {
          this.loadChat().then(() => {
            console.log('LOADED CHAT');
          })
        },
        changedAuthor(index, author) {
            if (typeof this.logged.name === 'undefined') {
                return true;
            }
            if (index !== this.chat.length - 1) {
                return this.chat?.['chat0']?.chat[index + 1]?.author !== author;
            }
            return true;
        },
        refreshStats() {
            this.isLoadingRefresh = true;
            return axios.get(`https://bettor-be.onrender.com/room/check-room/${this.room.id}`, { headers: {
                'Content-type':'application/json'
            }})
            .then(({data}) => {
                this.isLoadingRefresh = false;
                console.log(data)
            })
            .catch((response) => {
                this.isLoadingRefresh = false;
                console.log(response);
            });
            
        },
        getMetric() {
            if (this.metric !== null) {
                return axios.get(`https://e-bettor.herokuapp.com/metric?metric=${this.$route.params.metric}`, { headers: {
                'Content-type':'application/json'
            }})
                .then(({data}) => {
                    this.metricObject = this._.clone(data[Object.keys(data)[0]]);
                })
                .catch((response) => {
                    console.log(response);
                });
            }
        },
        getIndex(key) {
          let count = 0;
          Object.keys(this.players).forEach((player) => {
            if (player === key) {
              return count;
            }
            count += 1;
          });
          return count;
        },
        openPlayer(key) {
            const index = this.getIndex(key);
            console.log(index);
            this.showPlayers[index] = !this.showPlayers[index];
            this.showPlayers = this._.cloneDeep(this.showPlayers);
        },
        isOwner(player) {
            return this.room.owner_id === player.id;
        },
        getRoom() {
            if (this.game !== null) {
                return axios.get(`https://e-bettor.herokuapp.com/get_room?id=${this.$route.params.game}`, { headers: {
                'Content-type':'application/json'
            }})
                .then(({data}) => {
                    this.room = this._.clone(data[Object.keys(data)[0]]);
                })
                .catch((response) => {
                    console.log(response);
                });
            }
        },
        joinRoom() {
            if (this.game !== null) {
                this.isLoadingJoin = true;
                return axios.get(`http://localhost:500/join_room?user=${this.logged.id}&room=${this.$route.params.game}&metric=${this.$route.params.metric}&name=${this.logged.name}`, { headers: {
                'Content-type':'application/json'
            }})
                .then(({data}) => {
                    console.log(data);
                })
                .catch((response) => {
                    console.log(response);
                }).finally(() => {
                    this.isLoadingJoin = false;
                    this.isLoadingPlayers = true;
                    this.getPlayers();
                });
            }
        },
        sendMessage() {
          this.chat[`Message${Object.keys(this.chat).length + 1}`] = {message: this.chatMessage, author: this.logged.name, time_sent: new Date()}
          return this.$axios.put(`http://localhost:5000/chat/${this.chatId}`, {
            chat: this.chat,
          })
          .then(({data}) => {
              console.log(data);
              this.chat = this._.cloneDeep(data?.chat);
          })
          .catch((response) => {
              console.error(response);
          }).finally(() => {
              this.chatMessage = '';
          });
        },
      loadChat() {
        this.loading = true;
        return axios.get(`http://localhost:5000/chat/${this.room.chat_id}`)
            .then(({data}) => {
              console.log(data);
              this.chat = this._.cloneDeep(data?.chat);
            })
            .catch((response) => {
              console.error(response);
            }).finally(() => {
              this.loading = false;
            });
      },
      getPlayers() {
        return axios.get(`http://localhost:5000/room-attendee/${this.room.id}`)
          .then(({data}) => {
            console.log('PLAYERS: ', data);
            this.players = this._.clone(data);
            Object.keys(this.players).forEach(() => {
              this.showPlayers.push(false);
            });
          })
          .catch((response) => {
            console.error(response);
          }).finally(() => {
            this.isLoading = false;
            this.isLoadingPlayers = false;
          });
      }
    }
}

</script>

<style type="scss" scoped>

.custom-card {
  width: 100% !important;
  border-radius: 16px !important;
  padding-top: 0 !important;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.custom-card .btn-secondary {
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    background: #1f3c88 !important;
    max-width: calc(100% / 4);
    border: 0 !important;
}

.custom-card .btn:hover {
    background: #001E6C !important;
    opacity: 0.8;
}

.mobile-card {
  display: flex;
  place-content: center;
  overflow: hidden;
  height: 100%;
  padding-bottom: 10px;
  min-height: 790px;
}


.owner-badge {
  background: transparent;
}

.previewImage {
    width: 64px;
    height: auto;
}

.rowRecord {
    background: #90AACB;
}

.differButton {
  background: #001E6C;
  color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);

}
.differButton:hover {
  color: whitesmoke;
   -webkit-transform: scale(1.02, 1.02);
  transform: scale(1.02, 1.02);
}

.differButton::after {
  content: "";
  border-radius: 5px;
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: 0 5px 10px white;
  opacity: 0;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.form-control {
    border-top: 1px solid white;
    border-left: 1px solid white;
    border-right: 0;
    border-bottom: 1px solid white;
}

.inputIcon {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    cursor: pointer;
    background: transparent !important;
}

.inputIcon:hover {
    opacity: 0.8;
}

.playerRecord:hover {
  -webkit-transform: scale(1.02, 1.02);
  transform: scale(1.02, 1.02);
  box-shadow: 0 5px 10px white;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
}


@media screen and (max-width: 767px) {

    .custom-card .btn p {
        display:none;
    }
    .custom-card {
        width: 100% !important;
    }

    .card-body {
        padding: 5px !important;
    }

    .bettorLogo {
        font-size: 16px !important;
    }

    small {
        font-size: 10px;
    }

    .chat-box {
        max-height: 180px !important;
    }

    .game-info {
        font-size: 12px;
    }

    h2 {
        font-size: 16px !important;
    }

    .custom-row {
        display: block !important;
        font-size: 16px !important;
    }

    .mobile-card {
      min-height: 100%;
    }
}


.custom-body {
  max-height: calc(100% - 88px);
  padding-top: 0;
}

.header-row {
  margin-bottom: 2px;
  border: 1px solid #4e54c8;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

</style>

<style lang="scss" scoped>
.orbit {
    position: relative;
  --size: 8rem;
  --speed: 120s;
  .center-image {
    width: var(--size);
    position: relative;
    z-index: 10;

    img {
      position: absolute;
      transition: opacity 500ms;

      &:not(:first-child):hover {
        opacity: 0;
      }
    }
  }

  ul {
    display: grid;
    place-items: center;
    width: 100%;
    height: var(--size);
    position: relative;
    list-style: none;
    --icon-bg: blue;
    --text-bg: darkblue;
    &:hover {
      animation-play-state: paused;
      --orbit-play-state: paused;
    }
  }

  li {
    --icon-bg: #001E6C;
    --text-bg: blue;

    position: absolute;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    font-weight: 500;
    color: lightcyan;
    text-align: center;
    line-height: 1;
    display: grid;
    place-items: center;

    &:hover {
      --throb-play-state: paused;
    }

    & > * {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      border-radius: inherit;

      position: absolute;
    }

    > div {
      background-color: var(--icon-bg);
      color: white;
    }

    > p {
      position: relative;
      background: #8f94fb;
      transition: opacity 500ms;
      opacity: 0;
    }

    &:hover > p {
      cursor: pointer;
      opacity: 1;
    }
  }
}

  li:nth-child(1) {
    // --icon-bg: var(--blue-light);
    // --text-bg: var(--blue-dark);
    transform: translate(0, -1rem);
  }

  li:nth-child(2) {
      display: none;
    // --icon-bg: var(--green-light);
    // --text-bg: var(--green-dark);
    transform: translate(0, 6rem);
  }

  li:nth-child(3) {
    // --icon-bg: var(--pink-light);
    // --text-bg: var(--pink-dark);
    transform: translate(0, 4rem);
  }
  li:nth-child(4) {
    // --icon-bg: var(--red-light);
    // --text-bg: var(--red-dark);
    transform: translate(0, 9rem);
  }

  li:nth-child(5) {
    // --icon-bg: var(--brown-light);
    // --text-bg: var(--brown-dark);
    transform: translate(0, 14rem);
  }

  li:nth-child(6) {
      display: none;
    // --icon-bg: var(--yellow-light);
    // --text-bg: var(--yellow-dark);
    transform: translate(0, 16rem);
  }

  li:nth-child(7) {
    // --icon-bg: var(--purple-light);
    // --text-bg: var(--purple-dark);
    transform: translate(0, 19rem);
  }
  li:nth-child(8) {
      display: none;
    // --icon-bg: var(--orange-light);
    // --text-bg: var(--orange-dark);
    transform: translate(0, 9rem);
  }

.orbital-pulse {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 25%;
    background-color: #001E6C;
    transition: all 0.9s;
    animation: pulse-blue 2s infinite;
}

.fa-holder:hover {
  border-radius: 50%;
  animation: pulse-blue 2s infinite;
}

.pulsation {
  animation: pulse-blue 2s infinite;
}

.orbital-icon {
    width: 32px;
    height: 32px;
}

@media screen and (max-width: 1600px) and (max-height: 1000px) {

}

    @keyframes pulse-blue {
        0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(91, 153, 229, 0.7);
        }
    
        70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(52, 172, 224, 0);
        }
    
        100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(52, 172, 224, 0);
        }
    }
</style>
