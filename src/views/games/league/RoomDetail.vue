<template>
    <app-loading :loading="isLoading" :circle="true">
        <div v-if="isLoading === false">
            <div v-if="triggerMobile === true">
                <div class="h-100" style="max-height: 100vh;">
                    <b-container class="pt-5 p-3 pb-0" style="z-index: -10; ">
                        <div class="d-flex w-100 justify-content-center align-items-center mb-1">
                            <div class="custom-row d-flex align-items-center">
                                <h2 style="margin-right: 20px;"><span class="bettorLogo" style="font-size: 2rem;">{{ getRoomName }}</span> room:</h2>
                                <h2 style="text-align: start;">{{ `${metricObject.value} ${metricObject.metric} in ${metricObject.games} games` }}</h2>
                            </div>
                            <div>
                                <router-link style="text-decoration: none; color: inherit; position:relative; top: 0; left: 50px;" :to="{name: 'lol'}">
                                    <font-awesome-icon :icon="['fas', 'times-circle']" size="2x" style="cursor: pointer;"/>
                                </router-link>
                            </div>
                        </div>
                    </b-container>
                    <div class="hello-2">
                        <div class="orbit">
                            <ul :style="logged === 'null' ? '' : 'margin-left: 20px;'">
                                <li>
                                    <div><font-awesome-icon :icon="['fas', 'info-circle']" size="lg" class="orbital-icon"/></div>
                                    <p @click="openOrbital('info')">Game info</p>
                                </li>
                                <li>
                                    <p>Expected outcome</p>
                                </li>
                                <li>
                                    <div><font-awesome-icon :icon="['fas', 'envelope']" size="lg" class="orbital-icon"/></div>
                                    <p @click="openOrbital('chat')">Chat</p>
                                </li>
                                <li>
                                    <div class="orbital-pulse action-shadow d-flex align-items-center justify-content-center" :style="orbitalWidth" style="border-radius: 15%;">
                                        <div v-if="activeKey === ''">
                                            <font-awesome-icon :icon="['fas', 'expand']" size="lg" style="cursor: pointer;"/>
                                        </div>
                                        <div v-if="enabledDict.info" class="w-100 h-100 p-3 justify-content-between d-flex" style="flex-direction: column;">
                                            <div class="d-flex justify-content-between mb-5"><h3>Game info</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('info')"/></div>
                                            <h4 class="d-flex justify-content-between align-items-center game-info"><b>Competion:</b> {{ metricObject.metric }}</h4>
                                            <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ `${metricObject.metric} to reach`}}:</b> {{ metricObject.value }}</h4>
                                            <h4 class="d-flex justify-content-between align-items-center game-info"><b>Games available:</b> {{ metricObject.games }}</h4>
                                            <h4 class="d-flex justify-content-between align-items-center game-info"><b>Start date:</b> {{ timestampToDate(room.start_date, false) }}</h4>
                                            <h4 class="d-flex justify-content-between align-items-center game-info"><b>End date:</b> {{ timestampToDate(room.end_date, false) }}</h4>
                                            <h4 class="d-flex justify-content-between align-items-center game-info"><b>Players:</b> {{ `${Object.keys(players).length}/${getPlayersCount}` }}</h4>
                                            <b-button v-if="logged !== 'null'" class="differButton mx-1 w-100" variant="transparent" @click="refreshStats"><app-loading :loading="isLoadingRefresh" :circle="true" variant="white">
                                                Refresh stats<font-awesome-icon :icon="['fas', 'redo']" size="md" class="mx-2" style="cursor: pointer;"/>
                                                </app-loading>
                                            </b-button>
                                        </div>
                                        <div v-if="enabledDict.outcome" class="w-100 h-100 p-3 justify-content-between d-flex" style="flex-direction: column;">
                                            <div class="d-flex justify-content-between mb-5" style="text-align: start;"><h3>Expected outcome</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('outcome')"/></div>
                                            <h4 style="text-align: start;"><b>Your credits:</b> 1200 </h4>
                                            <h4 style="border-bottom: 1px solid white; text-align: start;" class="w-100"><b>Entry credits:</b> {{ room.bank }}</h4>
                                            <h4 style="text-align: start;"><b>Credits available</b> {{ 1200 - room.bank }}</h4>
                                            <b-button variant="transparent" class="btn w-100 p-2 mt-5 d-flex justify-content-center align-items-center differButton" @click="joinRoom" :disabled="canJoin">
                                                <app-loading :loading="isLoadingJoin" :circle="true">
                                                    Join
                                                    <font-awesome-icon :icon="['fas', 'coins']" size="lg" style="margin-left: 10px;" />
                                                </app-loading>
                                            </b-button>
                                        </div>
                                        <div v-if="enabledDict.stats" class="w-100 h-100 p-3">
                                            <div class="d-flex justify-content-between mb-2"><h3>Players</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('stats')"/></div>
                                            <b-row class="pt-2 pb-1 mx-2 d-lg-flex d-none">
                                                <b-col cols="1" class="d-flex justify-content-start align-items-center">

                                                </b-col>
                                                <b-col cols="6" class="d-flex justify-content-start align-items-center">
                                                    <h5>Name:</h5>
                                                </b-col>
                                                <b-col cols="2" class="d-flex align-items-center justify-content-start">
                                                    <h5>{{metricObject.metric}}:</h5>
                                                </b-col>
                                                <b-col cols="2" lg="3" xl="3" class="d-flex align-items-center justify-content-start">
                                                    <h5>Games:</h5>
                                                </b-col>
                                            </b-row>
                                            <b-row v-for="(player, index) in players" :key="`${player.id}row`" class="rounded p-2 mb-2 mx-1 rowRecord rowHover text-white" style="background: #001E6C;" @click="openPlayer(index)">
                                                <b-col cols="1" class="d-flex justify-content-start align-items-center">
                                                    {{ parseInt(index.substr(index.length - 1, index.length), 10) + 1 }}
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
                                            <div class="d-flex justify-content-between mb-2"><h3>Chat</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('chat')"/></div>
                                                <div class="hide-scrollbar py-1 py-lg-2 rounded" style="overflow-y: scroll; scrollbar-width: none; max-height: 40vh; height: 100% !important;">
                                                    <div v-for="(msg, index) in chatComputed" :key="`${index}`" :class="isAuthor(msg.author) ? 'text-start' : 'text-end'" class="my-1 my-lg-2">
                                                        <h5 class="mb-0 game-info">{{ msg.message }}</h5>
                                                        <small v-if="changedAuthor(index, msg.author)" style="border-top: 1px solid white">{{ msg.author }}, {{ timestampToDate(msg.time_sent) }}</small>
                                                    </div>
                                                </div>
                                            <div class="my-auto">
                                                <b-input-group class="mt-2">
                                                    <b-input v-model="chatMessage" type="text" style="background-color: transparent; color: white;" placeholder="Type a message..." :disabled="canWrite" v-on:keyup.enter="sendMessage" />
                                                    <b-button class="border p-1 px-3 inputIcon rounded text-white" variant="transparent" :disabled="canWrite" @click="sendMessage"><font-awesome-icon :icon="['fas', 'angle-right']" size="2x" /></b-button>
                                                </b-input-group>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li :style="activeOrbit !== false ? 'opacity: 0;' : ''">
                                    <div><font-awesome-icon :icon="['fas', 'users']" size="lg" class="orbital-icon"/></div>
                                    <p @click="openOrbital('stats')">Players</p>
                                </li>
                                <li>
                                    <p>Current table</p>
                                </li>
                                <li :style="activeOrbit !== false ? 'opacity: 0;' : ''">
                                    <div><font-awesome-icon :icon="['fas', 'piggy-bank']" size="lg" class="orbital-icon"/></div>
                                    <p @click="openOrbital('outcome')">Expected outcome</p>
                                </li>
                                <li>
                                    <p>Disciplinary</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <b-container class="pt-5 pb-0" style="z-index: -10; ">
                    <div class="d-flex w-100 justify-content-center align-items-center mb-1 mb-xl-4">
                        <div class="custom-row d-flex align-items-center">
                            <h2 style="margin-right: 20px;"><span class="bettorLogo" style="font-size: 2rem;">{{ getRoomName }}</span> room:</h2>
                            <h2>{{ `${metricObject.value} ${metricObject.metric} in ${metricObject.games} games` }}</h2>
                        </div>
                        <div>
                            <router-link style="text-decoration: none; color: inherit; position:relative; left: 50px;" :to="{name: 'lol'}">
                                <font-awesome-icon :icon="['fas', 'times-circle']" size="2x" style="cursor: pointer;"/>
                            </router-link>
                        </div>
                    </div>
                </b-container>
                <div class="hello">
                    <app-orbit :room="room" :metric="metricObject" :players="players" :chatComputed="chatComputed" @refresh="refreshStats" />
                </div>
            </div>
        </div>
    </app-loading>
</template>

<script>
import AppLoading from '@/components/design/AppLoading';
import AppOrbit from '@/components/design/AppOrbit';
import CompetitionHistory from '@/views/games/league/CompetitionHistory';
import {timestampToDate} from '@/util/timeUtils';
import axios from 'axios';


export default {
    name: 'RoomDetail',
    components: { AppLoading, CompetitionHistory, AppOrbit },
    data() {
        return {
            metric: null,
            game: null,
            room: null,
            metricObject: null,
            isLoadingRefresh: false,
            isLoading: true,
            timestampToDate,
            players: [],
            activeOrbit: false,
            enabledDict: {
                info: false,
                stats: false,
                outcome: false,
                chat: false
            },
            activeKey: '',
            orbitalWidth: '',
            chat: null,
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
            return this.room?.game_id ?? '';
        },
        getPlayersCount() {
            return this.room?.players_count ?? 0;
        },
        chatComputed() {
            if(typeof this.chat?.['chat0']?.chat !== 'undefined') {
                return this.chat?.['chat0']?.chat;
            }
            return this?.chat ?? [];
        },
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
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
            return this.logged === 'null';
        }
    },
    watch: {
        windowWidth: {
            immediate: true,
            handler(val) {
                console.log(val);
                if (val < 767) {
                    console.log(this.$refs);
                    this.triggerMobile = true;
                    console.log(this.triggerMobile);
                } else {
                    this.triggerMobile = false;
                }
            }
        },
        '$route.params': {
            immediate: true,
            deep: true,
            handler (to) {
                console.log(to);
                if (to.meta.reload==true) {
                    this.metric = to.params.metric;
                    this.game = to.$route.params.game;
                    this.getMetric()
                    this.getRoom();
                    this.getPlayers();
                    this.loadChat();
                    // window.location.reload()
                }
            }
        },
        activeOrbit(val) {
            this.$nextTick(() => {
                if (val) {
                    this.orbitalWidth = `width: 85vw !important; height: 50vh !important; animation: none; z-index: 290; background-color: #8f94fb; border-radius: 15px;`;
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
        this.metric = this.$route.params.metric;
        this.game = this.$route.params.game;
        this.getMetric()
        this.getRoom();
        this.getPlayers();
        this.loadChat();
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
            this.activeKey = key;
            this.activeOrbit = !this.activeOrbit;
        },
        getChat() {
            if (!this.chat['chat0'].chat) {
                this.loadChat().then(() => {
                    return this.chat['chat0'].chat;
                })
            }
            console.log(this.chat['chat0'].chat['chat0'].chat);
            return this.chat['chat0'].chat;
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
            return axios.get(`https://e-bettor.herokuapp.com/check_state`, { headers: {
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
                console.log(player)
                console.log(key === player)
                if (player === key) {
                    console.log('return');
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
                return axios.get(`https://e-bettor.herokuapp.com/join_room?user=${this.logged.id}&room=${this.$route.params.game}&metric=${this.$route.params.metric}&name=${this.logged.name}`, { headers: {
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
            if (this.chat === null) {
                this.chat = [{message: this.chatMessage, author: this.logged.name}];
            } else {
                this.chat?.['chat0']?.chat.push({message: this.chatMessage, author: this.logged.name, time_sent: new Date() });
            }
            return axios.post(`https://e-bettor.herokuapp.com/send_message?room=${this.$route.params.game}`, { headers: {
                'Content-type':'application/json'
            }, data: {
                chat: this.chat,            
            }})
            .then(({data}) => {
                console.log(data);
            })
            .catch((response) => {
                console.error(response);
            }).finally(() => {
                this.chatMessage = '';
                // this.isLoading = false;
            });
        },
        loadChat() {
            return axios.get(`https://e-bettor.herokuapp.com/load_chat?room=${this.$route.params.game}`, { headers: {
                'Content-type':'application/json'
            }})
            .then(({data}) => {
                this.chat = this._.cloneDeep(data);
                if (!this.chat) {
                    this.sendMessage();
                }
                console.log(this.chat);
            })
            .catch((response) => {
                console.error(response);
            }).finally(() => {
                // this.isLoading = false;
            });
        },
        getPlayers() {
            if (this.game !== null) {
                return axios.get(`https://e-bettor.herokuapp.com/get_attendees?room=${this.$route.params.game}`, { headers: {
                'Content-type':'application/json'
            }})
                .then(({data}) => {
                    this.players = this._.clone(data);
                    Object.keys(this.players).forEach(() => {
                        this.showPlayers.push(false);
                    });
                })
                .catch((response) => {
                    console.log(response);
                }).finally(() => {
                    this.isLoading = false;
                    this.isLoadingPlayers = false;
                });
            }
        }
    }
}

</script>

<style type="scss" scoped>


.grow-down-enter-active,
.grow-down-leave-active {
  transition: all 0.6s;
  max-height: 230px;
}
.grow-down-enter,
.grow-down-leave-to
{
  opacity: 0;
  max-height: 0px;
}

.hello {
  display: grid;
  min-height: 100vh;
  place-content: center;
  overflow: hidden;
}

.hello-2 {
  display: grid;
  place-content: center;
}

.owner-badge {
    background: transparent;

}

.previewImage {
    width: 64px;
    height: auto;
}

.rowRecord {
    cursor: pointer;
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

.form-control::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: white;
    opacity: 1; /* Firefox */
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
}

.inputIcon:hover {
    opacity: 0.8;
}

@media screen and (max-width: 767px) {
	.handle-container {
        margin-top: 0px !important;
		margin-left: 36px !important;
        top: 60px;
        width: calc(100% - 36px);
        height: calc(100% - 80px) !important;
        padding-top: 0 !important;
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
}

.handle-container {
    z-index: -10;
    overflow-y: scroll;
    scrollbar-width: none;
    max-height: 100vh;
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
    transform-origin: center;
    animation: orbit var(--speed) linear infinite;
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

    @for $i from 0 through 7 {
      &:nth-child(#{$i + 1}) {
        --throb-delay: #{500ms * $i};
      }
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

.orbital-icon {
    cursor: pointer;
    width: 32;
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
