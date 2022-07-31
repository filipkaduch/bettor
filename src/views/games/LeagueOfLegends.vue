<template>
  <div class="lol">
    <b-container>
        <h1 class="bettorLogo game-header" style="font-size: 2.5rem;">League of Legends</h1>
        <div class="d-flex justify-content-center mx-lg-0 mx-2 align-items-center">
            <!--<div :style="page === 0 ? 'pointer-events: none; opacity: 0.5; cursor: disabled' : ''">
                <font-awesome-icon :icon="['fas', 'arrow-left']" class="arrow" @click="page = page - 1" />
            </div>-->
            <h4 class="mt-lg-2 mt-0 mb-0 mb-lg-2 game-info sub-info mx-5">
                Rooms ({{ `${transferedNumber}/${Math.ceil(filteredRooms.length)}` }}):
                <font-awesome-icon :icon="['fas', 'search']" class="filter" @click="showFilter = !showFilter" />
            </h4>
            <!--<div :style="(page * step + step) >= filteredRooms.length ? 'pointer-events: none; opacity: 0.5; cursor: disabled' : ''" class="ml-5">
                <font-awesome-icon :icon="['fas', 'arrow-right']" class="arrow" @click="page = page + 1" />
            </div> -->
        </div>
        <b-collapse v-model="showFilter" class="filterBlock position-absolute mt-2 p-1 w-100vh" style="border-radius: 0.5rem; border: 0; font-size: 12px;">
            <b-card body-class="bg-deep collapse-border" style="border: 0; border-radius: 0.5rem;">
                <b-card-header class="d-flex justify-content-end p-1" :class="showCleanFilter ? 'justify-content-between' : ''">
                    <font-awesome-icon v-if="showCleanFilter"
                        id="filtersRemove"
                        :icon="['fas', 'ban']"
                        size="2x"
                        class="cursor-pointer mx-2"
                        @click="cleanFilters"/>
                    <font-awesome-icon :icon="['fas', 'times-circle']" size="2x" style="cursor: pointer;" @click="showFilter = false"/>
                </b-card-header>
                <b-tooltip target="filtersRemove">{{ $t('t_removeFilters') }}</b-tooltip>
                <b-button class="actionButton my-1 w-100" variant="transparent" @click="sortRooms('end_date')" :disabled="collapsible.end_date">Soon to end</b-button>
                <b-button class="actionButton my-1 w-100" variant="transparent" @click="sortRooms('start_date')" :disabled="collapsible.start_date">Soon to start</b-button>
                <b-button class="actionButton my-1 w-100" variant="transparent" @click="collapsible.players = !collapsible.players">Players</b-button>
                <transition name="slide-side">
                    <b-input class="w-100" v-if="collapsible.players" v-model="playersFilterCount"></b-input>
                </transition>
                <b-button class="actionButton my-1 w-100" variant="transparent" @click="collapsible.entry = !collapsible.entry">Entry</b-button>
                <transition name="slide-side">
                    <b-input class="w-100" v-if="collapsible.entry" v-model="playersEntryCount"></b-input>
                </transition>
                <b-dropdown class="m-0 my-1 p-0 actionButton rounded text-white w-100" no-caret variant="transparent">
                    <template class="mx-1 my-1 text-white" #button-content>
                        {{ selectedServer === null ? 'Server' : selectedServer.text }}
                    </template>
                    <b-dropdown-item v-for="server in serverList" :key="server.value" @click="setServer(server)">{{ server.text }}</b-dropdown-item>
                </b-dropdown>
                <b-dropdown class="my-1 p-0 actionButton rounded text-white w-100" no-caret variant="transparent">
                    <template class="actionButton mx-1 text-white" #button-content>
                        {{ selectedMetric === null ? 'Competition' : selectedMetric.metric }}
                    </template>
                    <b-dropdown-item v-for="metric in metricsList" :key="metric.value" @click="setMetric(metric)">{{ metric.text }}</b-dropdown-item>
                </b-dropdown>
            </b-card>
        </b-collapse>
    </b-container>
    <app-loading :loading="isLoading" :circle="true" class="h-100">
      <div class="h-100 w-100 my-2 my-xxl-5 px-xl-5 px-3">
        <swiper
            ref="mySwiper"
            class="pr-1 pb-1 w-50 h-85 pt-0 px-lg-4 "
            :class="triggerMobile && logged !== 'null' ? 'pl-4' : 'pl-1'"
            @slideChange="moveIndex"
            :options="swiperOptionJoined">
          <swiper-slide v-for="(room, index) in getRooms()"
               :key="index"
               class="h-100"
               style="border-radius: 16px !important; border: 0 !important; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
            <room-detail :room="room" :metric-object="getMetric(room.metric_id)[0]" class="h-100"></room-detail>
            <!--<app-game-card :room="room" :closer="true" :variant="true" :metric="getMetricLabel(getIcon(room))" class="h-100 w-100 border-0" />-->
          </swiper-slide>
          <!--<div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>-->
        </swiper>
      </div>
    </app-loading>
    <!--<app-loading :loading="isLoading" :circle="true" class="h-100">
        <div class="hello h-100 my-2 my-xxl-5">
          <carousel-3d
              class="d-flex h-100 h-xxl-75 w-100 py-2 py-xxl-5"
              :controls-visible="false"
              :clickable="true"
              :count="getRooms().length"
              @after-slide-change="moveIndex"
              :controls-prev-html="'&#10092; '"
              :controls-next-html="'&#10093;'"
              :controls-width="30" :controls-height="60">
            <slide v-for="(room, index) in getRooms()"
                   :index="index"
                   :key="index"
                   class="h-100 w-100"
                   style="border-radius: 16px !important; border: 0 !important; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
              <room-detail :room="room" :metric-object="getMetric(room.metric_id)[0]" class="h-100 w-100"></room-detail>
              <app-game-card :room="room" :closer="true" :variant="true" :metric="getMetricLabel(getIcon(room))" class="h-100 w-100 border-0" />
            </slide>
          </carousel-3d>
            <app-room-circle :rooms="getRooms()" :metrics="metrics" />
        </div>
    </app-loading>-->
  </div>
</template>

<script>
import {secondsToTime, timestampToDate} from '@/util/timeUtils';
import {mapActions, mapGetters} from 'vuex';
import {metricsList} from '@/util/consts/lolMetrics';
import {serverList} from '@/util/consts/lolServers';
import axios from 'axios';
import RoomDetail from "@/views/games/league/RoomDetail";
import AppLoading from '@/components/design/AppLoading';
import { Navigation, Pagination } from 'swiper';


export default {
    name: 'LeagueOfLegends',
  // eslint-disable-next-line vue/no-unused-components
    components: { AppLoading, RoomDetail, Navigation, Pagination },
    data() {
      return {
        info: null,
        name: '',
        page: 0,
        step: 8,
        foundName: '',
        roomsData: null,
        selectedServer: null,
        selectedMetric: null,
        time: null,
        search: '',
        startDate: null,
        isLoadingRooms: false,
        isLoading: true,
        rooms: [],
        filteredRooms: [],
        metricsData: null,
        metrics: [],
        roomIndex: 0,
        serverList,
        metricsList,
        modules: [Navigation, Pagination],
        playersFilterCount: 0,
        playersEntryCount: 0,
        swiperOptionJoined: {
          slidesPerView: 1,
          spaceBetween: 30,
        },
        resizeRooms: false,
        collapsible: {
            end_date: false,
            start_date: false,
            players: false,
            entry: false
        },
        timestampToDate,
        showFilter: false,
        filterVal: null,
        prevIndexRoom: 0,
        transferedNumber: 1,
        windowWidth: 0,
        triggerMobile: false
      };
    },
    computed: {
		...mapGetters('roomsData', ['storeRooms']),
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        },
        showCleanFilter() {
            return this.playersFilterCount !== 0 || this.playersEntryCount !== 0 || this.selectedServer !== null || this.collapsible.end_date || this.collapsible.start_date || this.selectedMetric !== null
        },
        storeMetrics() {
            return this.$store.getters['roomsData/storeMetrics'] ?? null;
        },
    },
    watch: {
        windowWidth: {
            immediate: true,
            handler(val) {
                if (val < 767) {
                    /// this.$refs.mySwiper.swiperInstance.params.slidesPerView = 1;
                    // this.$refs.mySwiper.swiperInstance.update();
                    this.triggerMobile = true;
                    this.step = 4;
                } else {
                    // this.$refs.mySwiper.swiperInstance.params.slidesPerView = 3;
                    // this.$refs.mySwiper.swiperInstance.update();
                    this.triggerMobile = false;
                    this.step = 8;
                }
            }
        },
        filteredRooms() {
            this.page = 0;
        },
        search(val) {
            if (val === '') {
                this.filteredRooms = this._.cloneDeep(this.rooms);
            }
            this.filteredRooms = this.filteredRooms.filter((room) => room.game_id.toLowerCase().includes(val.toLowerCase()));
        },
        playersFilterCount(val) {
            this.filteredRooms = this.filteredRooms.filter((room) => room.actual_players === parseInt(val, 10));
            if (this.filteredRooms.length === 0) {
                this.filteredRooms = this._.cloneDeep(this.rooms);
            }
        },
        playersEntryCount(val) {
            this.filteredRooms = this.filteredRooms.filter((room) => room.bank === parseInt(val, 10));
            if (this.filteredRooms.length === 0) {
                this.filteredRooms = this._.cloneDeep(this.rooms);
            }
        },
        selectedServer(val) {
            if (this.selectedMetric === null) {
                this.filteredRooms = this._.cloneDeep(this.rooms);
            }
            this.filteredRooms = this.filteredRooms.filter((room) => room.server === val.value);
            if (this.filteredRooms.length === 0) {
                this.filteredRooms = this._.cloneDeep(this.rooms);
            } 
        },
        selectedMetric(val) {
            if (this.selectedServer === null) {
                this.filteredRooms = this._.cloneDeep(this.rooms);
            }
            this.filteredRooms = this.filteredRooms.filter((room) => {
                return this.getMetricLabel(this.getIcon(room)) === val.metric;
            });
            if (this.filteredRooms.length === 0) {
                this.filteredRooms = this._.cloneDeep(this.rooms);
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
        /* this.loadAllRooms().then(() => {
            this.loadAllMetrics();
        }); */
        this.getAllRooms().then(() => {
            Object.keys(this.roomsData).forEach((key) => {
                this.rooms.push(this.roomsData[key]);
            });
        }).finally(() => {
            this.filteredRooms = this._.cloneDeep(this.rooms);
            this.isLoading = false;
        });
        this.getAllMetrics().then(() => {
            Object.keys(this.metricsData).forEach((key) => {
                this.metrics.push(this.metricsData[key]);
            });
        });
    },
    beforeDestroy() { 
        window.removeEventListener('resize', this.onResize); 
    },
    methods: {
        ...mapActions('roomsData', ['loadAllRooms', 'loadAllMetrics']),
        resetSummoner() {
            this.info = null;
            this.foundName = '';
            this.selectedServer = null;
            this.time = null;
            this.startDate = null;
            this.name = '';
        },
        moveIndex(event) {
          this.transferedNumber = event.realIndex + 1;
          this.roomIndex = event.realIndex;
        },
        onResize() {
            this.windowWidth = window.innerWidth;
        },
        getRooms() {
            // return this.filteredRooms.slice(this.page * this.step, this.page * this.step + this.step);
            return this.filteredRooms;
        },
        getServer(server) {
            return this.serverList?.find((el) => el.value === server)?.text ?? '';
        },
        resetFilters() {
            Object.keys(this.collapsible).forEach((key) => {
                this.collapsible[key] = false;
            });
        },
        cleanFilters() {
            this.resetFilters();
            this.selectedServer = null;
            this.selectedMetric = null;
            this.playersFilterCount = 0;
            this.playersEntryCount = 0;
            this.filteredRooms = this._.cloneDeep(this.rooms);
        },
        resizeAll() {
            this.resizeRooms = !this.resizeRooms;
        },
        getMetric(id) {
          return this.metrics.filter((met) => met.id === id);
        },
        getMetricText(icon) {
            const index = this.metricsList.filter((el) => {
                return el.icon === icon;
            });
            return index[0]?.text ?? 'Metric';
        },
        getMetricLabel(icon) {
            const index = this.metricsList.filter((el) => {
                return el.icon === icon;
            });
            if(index[0]) {
                return index[0].metric ?? 'Metric';
            }
            return 'Metric';
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
        getWin(party) {
            const player = party.find((pl) => pl.summonerName === this.name);

            if (typeof player !== 'undefined') {
                return player.win;
            }
            return false;
        },
        getAllMetrics() {
          return axios.get(
        'https://bettor-be.onrender.com/metric/all-metrics')
            .then(({data}) => {
              console.log(data);
              this.metricsData = this._.cloneDeep(data);
            })
            .catch(({response}) => {
                console.error(response);
            });
        },
        setMetric(metric) {
            this.selectedMetric = metric
        },
        setServer(server) {
            this.selectedServer = server;
        },
        findSummoner(party) {
            const player = party.find((pl) => pl.summonerName === this.name);

            if (typeof player !== 'undefined') {
                return player.summonerName;
            }
            return '';
        },
        getSummonerLastMatch() {
            if (this.name !== '') {
                return axios.get(`https://e-bettor.herokuapp.com/summoner?name=${this.name}&server=${this.selectedServer}`, { headers: {
                'Content-type':'application/json'
            }})
                .then(({data}) => {
                    this.info = data?.info;
                    this.time = secondsToTime(data?.info?.gameDuration);
                    this.startDate = timestampToDate(data?.info?.gameStartTimestamp);
                    this.foundName = this.findSummoner(data?.info?.participants);
                })
                .catch((response) => {
                    console.error(response);
                });
            } else {
                this.name = 'Empty state not allowed';
            }
        },
        refreshRooms() {
            this.isLoadingRooms = true;
            this.roomsData = null;
            this.filteredRooms = [];
            this.getAllRooms().then(() => {
                Object.keys(this.roomsData).forEach((key) => {
                    this.filteredRooms.push(this.roomsData[key]);
                });
                this.isLoadingRooms = false;
            });
        },
        sortRooms(type) {
            this.resetFilters();
            if (type === 'end_date' || type === 'start_date') {
                this.collapsible[type] = !this.collapsible[type];
                this.filteredRooms = this.filteredRooms.sort((a,b) => {
                    return new Date(b[type]) - new Date(a[type]);
                })
            }
            // else if(type === 'game') {
            //     console.log(type);
            // }
        },
        getAllRooms() {
            return axios.get(`https://bettor-be.onrender.com/room/active-rooms`)
                .then(({data}) => {
                  console.log(data);
                    this.roomsData = this._.cloneDeep(data);
                    return Promise.resolve();
                })
                .catch((response) => {
                    console.error(response);
                    return Promise.reject();
                });
        }
    }
}
</script>

<style lang="scss">

.grid-system {
  display: block;
  gap: 1rem;
  margin: 0 auto;
  column-count: 4;
  orphans: 1;
  widows: 1;
}

.b-dropdown {
    button {
        color: white;
    }
}

.h-85 {
  height: 85% !important;
}

.slide-fade-enter-active {
  height: 350px;
  transition: height 1.1s ease;
}
.slide-fade-leave-active {
  height: 80%;
  transition: height .9s ease-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  // transform: translateY(-20px);
  opacity: 0;
  height: 0;
  transition: height .9s ease-out;
}

.slide-side-enter-active {
  transition: all .3s ease;
}
.slide-side-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-side-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.custom-card {
  width: 100% !important;
  border-radius: 16px !important;
  padding-top: 0 !important;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.rowRecord {
    cursor: pointer;
    color: #233963;
    &:hover {
        background-color: #c1c5c7;
    }
}

.roundedInput {
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
}

.roundedSearch {
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
}

.hide-scrollbar {
    overflow-y: scroll;
    -ms-overflow-style: none; /* IE 11 */
    scrollbar-width: none; /* Firefox 64 */
}

::-webkit-scrollbar {
  display: none;
}


.hello {
  display: flex;
  align-items: center;
  place-content: center;
  overflow: hidden;
}

.carousel-3d-slider {
  height: 75% !important;
  width: calc(100% / 4) !important;
}

@media screen and (max-width: 1600px) and (max-height: 1000px) {

}

@media screen and (min-width: 767.1px) and (max-width: 1300px) {
  .carousel-3d-slider {
    height: 75% !important;
    width: calc(100% - (100% / 3)) !important;
  }

  .carousel-3d-container {
    height: 100% !important;
  }
}

@media screen and (min-width: 1300.1px) and (max-width: 1900px) {
  .carousel-3d-slider {
    height: 100% !important;
    width: calc(100% - (100% / 2)) !important;
  }


  .hello {
    height: 80% !important;
  }

  .carousel-3d-container {
    height: 100% !important;
  }
}

.mx-380 {
    max-height: 350px;
    transition: max-height 0.7s ease-in;
}

.resizeMax {
    max-height: 650px;
    transition: max-height 0.7s ease-in;
}

@media screen and (max-width: 767px) {
    .resizeMax {
        max-height: calc(100vh - 226px);
    }

    .swiper-container {
      width: 100% !important;
      height: 100% !important;
    }

    .filterBlock {
        font-size: 10px !important;

        .btn {
            font-size: 10px !important;
        }
    }

    .hello {
      height: 100% !important;
    }
    .carousel-3d-slide {
      height: 100% !important;
    }
    .carousel-3d-slider {
      height: 100% !important;
      width: 80% !important;
    }
    
    .game-header {
        font-size: 16px !important;
    }

    .mx-380 {
        max-height: calc(75vh - 241px);
    }

    .arrow {
        height: 16px !important;
        width: 16px !important;
    }

    .rowRecord {
        font-size: 10px;
    }

    .game-info {
        font-size: 14px !important;
    }

    .room-bg {
        margin-right: 20px;
    }
}

.resizeHeight {
    height: 90%;
}


.resize-sw-container {
    height: 0;
    transition: height 0.9s ease;
}

.sw-container {
    max-height: 100%;
    transition: max-height 0.9s ease;
}

.arrow {
    width: 40px !important;
    height: 40px !important;
    color: white;
    cursor: pointer;
}

.filter {
    cursor: pointer;
}

.filterBlock {
    transform: scaleY(1.0);
    transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
    position: absolute;
    width: 200px;
    left: calc(50% - 100px);
    border-radius: 8px;
    z-index: 5000;
}

.fancy-6:hover {
  color: #233963;
}


</style>