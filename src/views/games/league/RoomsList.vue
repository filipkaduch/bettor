<template>
    <div>
        <b-container>
            <app-loading :loading="isLoading" :circle="true">
                <b-row>
                    <b-col>
                        <h2>Owned ({{ ownedRooms.length }}):</h2>
                        <b-button class="differButton mx-1" variant="transparent" @click="sortRooms('end_date', 1)" :disabled="collapsibleOwned.end_date">Soon to end</b-button>
                        <b-button class="differButton mx-1" variant="transparent" @click="sortRooms('start_date', 1)" :disabled="collapsibleOwned.start_date">Soon to start</b-button>
                        <b-button class="differButton mx-1" variant="transparent">Winning</b-button>
                        <b-button class="differButton mx-1" variant="transparent">Loosing</b-button>
                        <b-button class="differButton mx-1" variant="transparent">Game</b-button>
                        <app-loading :loading="isLoadingOwned" :circle="true">
                            <swiper
                                ref="mySwiper"
                                class="p-4"
                                :options="swiperOption">
                                <swiper-slide v-for="room in ownedRooms" :key="`room-${room.id}`" class="fancy-6"><b-col class="cardOverlay"><app-game-card :room="room" :isOwn="true" :metric="getMetricLabel(getIcon(room))" /></b-col></swiper-slide>
                                <div class="swiper-pagination" />
                            </swiper>
                        </app-loading>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <h2>Joined ({{ joinedRooms.length }}):</h2>
                        <b-button class="differButton mx-1" variant="transparent" @click="sortRooms('end_date', 2)" :disabled="collapsibleJoined.end_date">Soon to end</b-button>
                        <b-button class="differButton mx-1" variant="transparent" @click="sortRooms('start_date', 2)" :disabled="collapsibleJoined.start_date">Soon to start</b-button>
                        <b-button class="differButton mx-1" variant="transparent">Winning</b-button>
                        <b-button class="differButton mx-1" variant="transparent">Loosing</b-button>
                        <b-button class="differButton mx-1" variant="transparent">Game</b-button>
                    </b-col>
                        <app-loading :loading="isLoadingJoined" :circle="true">
                            <swiper
                                ref="mySwiper"
                                class="p-4"
                                :options="swiperOptionJoined">
                                <swiper-slide v-for="room in joinedRooms" :key="room.game_id" class="fancy-6"><b-col class="cardOverlay"><app-game-card :room="room" :isOwn="true" :metric="getMetricLabel(getIcon(room))" /></b-col></swiper-slide>
                            </swiper>
                        </app-loading>
                </b-row>
            </app-loading>
        </b-container>
    </div>
</template>

<script>
import {Swiper, SwiperSlide} from 'vue-awesome-swiper';
import {metricsList} from '@/util/consts/lolMetrics';
import AppGameCard from '@/components/design/AppGameCard';
import AppLoading from '@/components/design/AppLoading';
import axios from 'axios';

export default {
    name: 'RoomsList',
    components: { AppGameCard, AppLoading, Swiper, SwiperSlide },
    data() {
        return {
            name: '',
            isLoading: false,
            rooms: [],
            ownedRooms: [],
            tempPlayers: [],
            joinedRooms: [],
            showJoined: [],
            joinedCount: 0,
            metricsList,
            collapsibleOwned: {
                end_date: false,
                start_date: false,
            },
            collapsibleJoined: {
                end_date: false,
                start_date: false,
            },
            isLoadingOwned: false,
            isLoadingJoined: false,
            roomsData: null,
            metrics: [],
            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 30,
                slidesOffsetAfter: 40,
                    pagination: {
                    el: '.swiper-pagination'
                }
            },
            swiperOptionJoined: {
                slidesPerView: 3,
                spaceBetween: 30,
                slidesOffsetAfter: 40,
                    pagination: {
                    el: '.swiper-pagination'
                }
            }
        };
    },
    computed: {
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        }
    },
    mounted() {
        this.isLoading = true;
        this.isLoadingJoined = true;
        this.getAllMetrics().then(() => {
            Object.keys(this.metricsData).forEach((key) => {
                this.metrics.push(this.metricsData[key]);
            });
        });

        this.getAllRooms().then(() => {
            Object.keys(this.roomsData).forEach((key) => {
                this.rooms.push(this.roomsData[key]);
            });
            this.rooms.forEach((ro) => {
                this.getAllHistory(ro).then(() => {
                    if (this.tempPlayers.filter((fil) => {
                        return fil.user_id === this.logged.id && ro.owner_id !== fil.user_id;
                    }).length > 0) {
                        this.joinedRooms.push(ro);
                        this.joinedCount += 1;
                    }
                });
            });
               this.isLoadingJoined = false;
        }).finally(() => {
            this.ownedRooms = this._.cloneDeep(this.rooms.filter((room) => {
                return room.owner_id === this.logged.id;
            }));
            this.showJoined = this._.clone(this.joinedRooms);
            this.isLoading = false;
        });
        // this.joinedCount = this.joinedRooms.length;
    },
    methods: {
        getAllMetrics() {
          return axios.get(
              'http://localhost:5000/metric/all-metrics')
              .then(({data}) => {
                console.log(data);
                this.metricsData = this._.cloneDeep(data);
              })
              .catch(({response}) => {
                console.error(response);
              });
        },
          getAllRooms() {
          return axios.get(`http://localhost:5000/room/active-rooms`)
              .then(({data}) => {
                console.log(data);
                this.roomsData = this._.cloneDeep(data);
                return Promise.resolve();
              })
              .catch((response) => {
                console.error(response);
                return Promise.reject();
              });
        },
        getMetricLabel(icon) {
            const index = this.metricsList.filter((el) => {
                return el.icon === icon;
            });
            console.log(index[0].metric);
            return index[0].metric ?? 'Metric';
        },
        getIcon(room) {
            const findIcon = this.metrics.filter((metric) => {
                return metric.id === room.metric_id;
            });

            if (findIcon[0]) {
                switch(findIcon[0].watch) {
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
        getAllHistory() {
          this.histories = [];
          if (this.logged) {
            return this.$axios.get(`http://localhost:5000/room-attendee/by-user/${this.logged.id}`)
                .then(({data}) => {
                  console.log(data);
                  this.tempPlayers = this._.cloneDeep(data);
                  this.isLoading = false;
                  this.isLoadingPlayers = false;
                })
                .catch((response) => {
                  console.error(response);
                });
          }
        },
        resetFilters(choice) {
            if (choice === 1) {
                Object.keys(this.collapsibleOwned).forEach((key) => {
                    this.collapsibleOwned[key] = false;
                });
            } else {
                Object.keys(this.collapsibleJoined).forEach((key) => {
                    this.collapsibleJoined[key] = false;
                });
            }
        },
        sortRooms(type, choice) {
            console.log(choice);
            this.resetFilters(choice);
            if (choice === 1) {
                this.isLoadingOwned = true;
                if (type === 'end_date' || type === 'start_date') {
                    this.collapsibleOwned[type] = !this.collapsibleOwned[type];
                    this.ownedRooms = this.ownedRooms.sort((a,b) => {
                        return new Date(b[type]) - new Date(a[type]);
                    })
                } else if(type === 'game') {
                    console.log(type);
                }
                this.isLoadingOwned = false;
            } else {
                if (type === 'end_date' || type === 'start_date') {
                    this.collapsibleJoined[type] = !this.collapsibleJoined[type];
                    this.joinedRooms = this.joinedRooms.sort((a,b) => {
                        return new Date(b[type]) - new Date(a[type]);
                    });
                } else if (type === 'game') {
                    console.log(type)
                }
            }
        }
    }
}

</script>