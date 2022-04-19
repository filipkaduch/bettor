<template>
    <b-container class="mt-4 p-3 rounded handle-container" style="z-index: -10; ">
        <app-loading :loading="isLoading" :circle="true">
            <div  v-if="isLoading === false">
                <div class="d-flex w-100 justify-content-between align-items-center mb-1 mb-lg-4">
                    <div class="custom-row d-flex align-items-center">
                        <h2 style="margin-right: 20px;"><span class="bettorLogo" style="font-size: 2rem;">{{ getRoomName }}</span> room:</h2>
                        <!-- <small class="ml-3" style="margin-right: 20px;">0/{{ getPlayersCount }} players</small> -->
                        <!-- <img src="@/assets/images/lol.png" alt="LoL" class="previewImage" /> -->
                        <h2>{{ `${metricObject.value} ${metricObject.metric} in ${metricObject.games} games` }}</h2>
                    </div>
                    <div>
                        <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lol'}">
                            <font-awesome-icon :icon="['fas', 'times-circle']" size="2x" style="cursor: pointer;"/>
                        </router-link>
                    </div>
                </div>
                <div class="d-flex py-1 py-lg-3">
                    <b-col cols="12" xl="5" md="12" sm="12" xs="10" class="text-start pr-2 mr-2">
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
                    </b-col>
                    <b-col cols="1" xl="1" md="0" sm="0"></b-col>
                    <b-col cols="12" xl="5" md="12" sm="12" xs="10" v-if="!canJoin" class="text-start">
                        <h4><b>Your credits:</b> 1200 </h4>
                        <h4 style="border-bottom: 1px solid white;" class="w-75"><b>Entry credits:</b> {{ room.bank }}</h4>
                        <h4><b>Credits available</b> {{ 1200 - room.bank }}</h4>
                        <b-button variant="transparent" class="btn w-75 p-2 mt-5 d-flex justify-content-center align-items-center differButton" @click="joinRoom" :disabled="canJoin">
                            <app-loading :loading="isLoadingJoin" :circle="true">
                                Join
                                <font-awesome-icon :icon="['fas', 'coins']" size="lg" style="margin-left: 10px;" />
                            </app-loading>
                        </b-button>
                    </b-col>
                    <b-col cols="5" xl="5" md="12" sm="12" xs="10" v-else-if="logged !== 'null'" class="text-center">
                        <h4><b>Expected outcome:</b></h4>
                    </b-col>
                </div>
                <b-row class="h-100 mt-1 mt-lg-5">
                    <b-col cols="12" xl="5" sm="12" xs="12" class="hide-scrollbar py-2 rounded" style="overflow-y: scroll; scrollbar-width: none;">
                        <h4>Players:</h4>
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
                    </b-col>
                    <b-col cols="0" xl="1"></b-col>
                    <b-col cols="12" xl="5" md="12" sm="12" xs="10">
                        <h4>Chat:</h4>
                        <div class="hide-scrollbar py-1 py-lg-2 rounded chat-box" style="overflow-y: scroll; scrollbar-width: none; max-height: 340px;">
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
                    </b-col>
                </b-row>
            </div>
        </app-loading>
    </b-container>
</template>

<script>
import AppLoading from '@/components/design/AppLoading';
import CompetitionHistory from '@/views/games/league/CompetitionHistory';
import {timestampToDate} from '@/util/timeUtils';
import axios from 'axios';


export default {
    name: 'RoomDetail',
    components: { AppLoading, CompetitionHistory },
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
                    this.$refs.mySwiper.swiperInstance.params.slidesPerView = 1;
                    this.$refs.mySwiper.swiperInstance.update();
                    this.triggerMobile = true;
                    console.log(this.triggerMobile);
                } else {
                    this.$refs.mySwiper.swiperInstance.params.slidesPerView = 3;
                    this.$refs.mySwiper.swiperInstance.update();
                    this.triggerMobile = false;
                }
            }
        },
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

    small {
        font-size: 10px;
    }

    .chat-box {
        max-height: 180px !important;
    }

    .game-info {
        font-size: 12px;
    }

    .custom-row {
        display: block !important;
    }
}

.handle-container {
    z-index: -10;
    overflow-y: scroll;
    scrollbar-width: none;
    max-height: 100vh;
}

</style>