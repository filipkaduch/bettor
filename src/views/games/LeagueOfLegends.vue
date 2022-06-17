<template>
  <div class="lol">
    <b-container>
        <h1 class="bettorLogo game-header" style="font-size: 2.5rem;">League of Legends</h1>
        <div class="d-flex justify-content-center mx-lg-0 mx-2 align-items-center">
            <!--<div :style="page === 0 ? 'pointer-events: none; opacity: 0.5; cursor: disabled' : ''">
                <font-awesome-icon :icon="['fas', 'arrow-left']" class="arrow" @click="page = page - 1" />
            </div>-->
            <h4 class="mt-2 game-info sub-info mx-5">
                Rooms ({{ `${transferedNumber + 1}/${Math.ceil(filteredRooms.length)}` }}):
                <font-awesome-icon :icon="['fas', 'filter']" class="filter" @click="showFilter = !showFilter" />
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
                    <b-tooltip target="filtersRemove">Remove filters</b-tooltip>
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
        
        <!--<h1 class="bettorLogo game-header" style="font-size: 2.5rem;">League of Legends</h1>
        <b-row class="d-flex justify-content-center mt-2">
            <b-col v-if="triggerMobile" cols="1" />
            <b-col cols="11" lg="10" style="border-radius: 8px;">
                <app-loading :loading="isLoading" class="h-100" :circle="true">
                    <transition name="slide-fade">
                        <div v-if="resizeRooms === false">
                            <h4 class="mb-lg-2 mb-1 game-info">Popular rooms:</h4>
                            <swiper
                                ref="mySwiper"
                                class="p-2 p-lg-4 game-info"
                                :options="swipers">
                                <swiper-slide v-for="room in rooms" :key="room.game_id" class="fancy-6">
                                    <b-col class="cardOverlay" style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
                                        <app-game-card :room="room" :metric="getMetricLabel(getIcon(room))" />
                                    </b-col>
                                </swiper-slide>
                            </swiper>
                        </div>
                    </transition>
                    <div class="d-flex justify-content-center w-100 position-relative align-items-center">
                        <h4 class="mt-2 game-info">All rooms ({{ rooms.length }}):</h4>
                        <div
                            v-if="logged !== 'null'"
                            class="position-absolute d-flex justify-content-between"
                            style="right: 0px; width: 40px;">
                            <font-awesome-icon :icon="['fas', 'sync']" class="cursor-pointer mr-2" @click="refreshRooms"/>
                            <font-awesome-icon
                                :icon="['fas', resizeRooms ? 'minus' : 'expand']"
                                class="cursor-pointer ml-2"
                                @click="resizeAll"/>
                        </div>
                    </div>
                    <div style="background: #001E6C;" class="rounded " :style="resizeRooms ? 'height: 80%;' : ''">
                        <b-row v-if="!triggerMobile" class="pt-2 pb-1 px-3 d-xs-none">
                                <b-col class="d-flex justify-content-start align-items-center" cols="3">
                                    <h5>Name:</h5>
                                </b-col>
                                <b-col cols="1" class="d-flex align-items-center">
                                    <h5>Players:</h5>
                                </b-col>
                                <b-col cols="1" class="d-flex align-items-center">
                                    <h5>Entry:</h5>
                                </b-col>
                                <b-col cols="2" class="d-flex align-items-center">
                                    <h5>Start date:</h5>
                                </b-col>
                                <b-col cols="2" class="d-flex align-items-center">
                                    <h5>Server:</h5>
                                </b-col>
                                <b-col cols="1" class="d-flex align-items-center">
                                    <h5>Competition:</h5>
                                </b-col>
                                <b-col class="d-flex align-items-center justify-content-end">
                                    <h5>Actions:</h5>
                                </b-col>
                        </b-row>
                        <b-row v-if="!triggerMobile" class="p-1 px-3">
                            <b-input-group class="d-flex">
                                <b-input v-model="search" type="text" class="ml-2 mr-4 border p-2 roundedInput" placeholder="Search for room">
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
                        <b-row v-if="logged !== 'null' && resizeRooms">
                            <b-col class="d-flex justify-content-lg-between justify-content-start align-items-center px-3 mx-3 py-1">
                                <h5 class="mb-0 d-lg-flex d-none">Filter:</h5>
                                <div v-if="!triggerMobile" class="w-100 d-flex justify-content-end align-items-center">
                                    <font-awesome-icon v-if="playersFilterCount !== 0 || playersEntryCount !== 0 || selectedServer !== null || collapsible.end_date || collapsible.start_date" id="filtersRemove" :icon="['fas', 'ban']" class="cursor-pointer mx-2" @click="cleanFilters"/>
                                    <b-tooltip target="filtersRemove">Remove filters</b-tooltip>
                                    <b-button class="actionButton mx-1" variant="transparent" @click="sortRooms('end_date')" :disabled="collapsible.end_date">Soon to end</b-button>
                                    <b-button class="actionButton mx-1" variant="transparent" @click="sortRooms('start_date')" :disabled="collapsible.start_date">Soon to start</b-button>
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
                                <div v-else>
                                    <div class="position-relative">
                                        <font-awesome-icon v-if="playersFilterCount !== 0 || playersEntryCount !== 0 || selectedServer !== null || collapsible.end_date || collapsible.start_date" id="filtersRemove" :icon="['fas', 'ban']" class="cursor-pointer mx-2" @click="cleanFilters"/>
                                        <b-tooltip target="filtersRemove">Remove filters</b-tooltip>
                                        <button type="button" class="btn actionButton mx-1" @click="showFilter = !showFilter">{{ filterVal === null ? 'Filter' : filterVal }}</button>
                                        <b-collapse v-model="showFilter" class="position-absolute mt-2 p-1 w-100vh" style="border-radius: 0.5rem; border: 0; left: -33%; font-size: 12px;">
                                            <b-card body-class="bg-deep collapse-border" style="border: 0; border-radius: 0.5rem;">
                                                <b-button class="actionButton mx-1 my-1" variant="transparent" @click="sortRooms('end_date')" :disabled="collapsible.end_date">Soon to end</b-button>
                                                <b-button class="actionButton mx-1 my-1" variant="transparent" @click="sortRooms('start_date')" :disabled="collapsible.start_date">Soon to start</b-button>
                                                <b-button class="actionButton mx-1 my-1" variant="transparent" @click="collapsible.players = !collapsible.players">Players</b-button>
                                                <transition name="slide-side">
                                                    <b-input class="w-100" v-if="collapsible.players" v-model="playersFilterCount"></b-input>
                                                </transition>
                                                <b-button class="actionButton mx-1 my-1" variant="transparent" @click="collapsible.entry = !collapsible.entry">Entry</b-button>
                                                <transition name="slide-side">
                                                    <b-input class="w-100" v-if="collapsible.entry" v-model="playersEntryCount"></b-input>
                                                </transition>
                                                <b-button class="actionButton mx-1" variant="transparent">Server</b-button>
                                                <b-dropdown class="m-0 p-0 actionButton rounded text-white" no-caret variant="transparent">
                                                    <template class="mx-1 my-1 text-white" #button-content>
                                                        {{ selectedServer === null ? 'Server' : selectedServer.text }}
                                                    </template>
                                                    <b-dropdown-item v-for="server in serverList" :key="server.value" @click="setServer(server)">{{ server.text }}</b-dropdown-item>
                                                </b-dropdown>
                                                <b-dropdown class="mx-1 my-1 p-0 actionButton rounded text-white" no-caret variant="transparent">
                                                    <template class="actionButton mx-1 text-white" #button-content>
                                                        {{ selectedMetric === null ? 'Competition' : selectedMetric.metric }}
                                                    </template>
                                                    <b-dropdown-item v-for="metric in metricsList" :key="metric.value" @click="setMetric(metric)">{{ metric.text }}</b-dropdown-item>
                                                </b-dropdown>
                                            </b-card>
                                        </b-collapse>
                                    </div> 
                                </div>
                            </b-col>
                        </b-row>
                        <b-container class="hide-scrollbar py-2 rounded" style="overflow-y: scroll; scrollbar-width: none; background: #001E6C;" :class="resizeRooms ? 'resizeMax' : 'mx-380'">
                            <app-loading :loading="isLoadingRooms" :circle="true" variant="white">
                                <b-row v-for="room in filteredRooms" :key="`${room.game_id}row`" class="border rounded p-2 mb-2 rowRecord bg-light">
                                    <b-col class="d-flex justify-content-start align-items-center" :cols="!triggerMobile ? 3 : 5">
                                        {{ room.game_id }}
                                    </b-col>
                                    <b-col cols="1" class="d-flex align-items-center">
                                        {{ room.actual_players === null ? `0` : room.actual_players }}/{{ room.players_count}}
                                    </b-col>
                                    <b-col cols="1" class="d-flex align-items-center">
                                        {{ room.bank}}
                                    </b-col>
                                    <b-col v-if="!triggerMobile" cols="2" class="d-flex align-items-center">
                                        {{ timestampToDate(room.start_date, false) }}
                                    </b-col>
                                    <b-col v-if="!triggerMobile" cols="3" class="d-flex align-items-center">
                                        {{ getServer(room.server) }}
                                    </b-col>
                                    <b-col cols="1" class="d-flex align-items-center">
                                        <font-awesome-icon :id="`${room.game_id}icon`" :icon="['fas', `${getIcon(room)}`]" />
                                        <b-tooltip :target="`${room.game_id}icon`">{{ getMetricText(getIcon(room)) }}</b-tooltip>
                                    </b-col>
                                    <b-col class="d-flex justify-content-end align-items-center">
                                        <router-link style="text-decoration: none; color: inherit;" :to="{name: 'lolRoomDetail', params: { metric: room.metric_id, game: room.id }}">
                                            <b-button variant="transparent" class="actionButton row-btn">
                                                <font-awesome-icon :icon="['fas', 'sign-in-alt']" />
                                            </b-button>
                                        </router-link>
                                    </b-col>
                                </b-row>
                            </app-loading>
                        </b-container>
                    </div>
                </app-loading>
            </b-col>
        </b-row>-->
    </b-container>
    <app-loading :loading="isLoading" :circle="true" class="h-100">
        <div class="hello my-xl-5">
          <carousel-3d class="d-flex h-75 w-100 w-xl-50 py-xl-5" :controls-visible="true" :clickable="true" @after-slide-change="moveIndex" @before-slide-change="onBeforeSlideChange" @last-slide="onLastSlide">
            <slide v-for="(room, index) in getRooms()"
                   :index="index"
                   :key="index"
                   class=""
                   style="border-radius: .25rem; box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;"
                   :controls-prev-html="'&#10092; '" :controls-next-html="'&#10093;'"
                   :controls-width="30" :controls-height="60">
              <app-game-card :room="room" :closer="true" :variant="true" :metric="getMetricLabel(getIcon(room))" class="h-100 w-100 border-0" />
            </slide>
          </carousel-3d>
            <!--<app-room-circle :rooms="getRooms()" :metrics="metrics" />-->
        </div>
    </app-loading>
  </div>
</template>

<script>
import {secondsToTime, timestampToDate} from '@/util/timeUtils';
import {mapActions, mapGetters} from 'vuex';
import {metricsList} from '@/util/consts/lolMetrics';
import {serverList} from '@/util/consts/lolServers';
import axios from 'axios';
import RoomDetail from "@/views/games/league/RoomDetail";
import AppGameCard from '@/components/design/AppGameCard';
import AppRoomCircle from '@/components/design/AppRoomCircle';
import AppHeader from '@/components/design/AppHeader';
import AppLoading from '@/components/design/AppLoading';
import {Swiper, SwiperSlide, Pagination, directive} from 'vue-awesome-swiper';



export default {
    name: 'LeagueOfLegends',
    // eslint-disable-next-line vue/no-unused-components
    components: { AppGameCard, AppLoading, Swiper, SwiperSlide, AppHeader, Pagination, AppRoomCircle, RoomDetail },
    directives: {
		swiper: directive
	},
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
            playersFilterCount: 0,
            playersEntryCount: 0,
            resizeRooms: false,
            collapsible: {
                end_date: false,
                start_date: false,
                players: false,
                entry: false
            },
            timestampToDate,
            swiperOption: {
                slidesPerView: 3,
                spaceBetween: 30,
                slidesOffsetAfter: 40,
                    pagination: {
                    el: '.swiper-pagination'
                },
                navigation: {
                    nextEl: '.sw-next',
                    prevEl: '.sw-prev'
                },
                observer: true,
                observeParents: true,
                parallax:true
            },
            showFilter: false,
            filterVal: null,
            prevIndexRoom: 0,
            transferedNumber: 0,
            windowWidth: 0,
            triggerMobile: false,
            swiperOptionMobile: {
                slidesPerView: 1,
                spaceBetween: 30,
                slidesOffsetAfter: 40,
                    pagination: {
                    el: '.swiper-pagination'
                },
                navigation: {
                    nextEl: '.sw-next',
                    prevEl: '.sw-prev'
                },
                observer: true,
                observeParents: true,
                parallax:true
            }
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
        swipers() {
            return this.triggerMobile ? this.swiperOptionMobile : this.swiperOption;
        }
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
        this.loadAllRooms().then(() => {
            this.loadAllMetrics();
        });
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
        onBeforeSlideChange(index) {
          console.log('@onBeforeSlideChange Callback Triggered', 'Slide Index ' + index)
        },
        onLastSlide(index) {
          this.page += 1;
          this.transferedNumber = (this.page * this.step) + index;
        },
        moveIndex(event) {
          console.log(event);
          if (this.prevIndexRoom >= event) {
            this.transferedNumber -= 1;
          } else {
            this.transferedNumber += 1;
          }
          this.roomIndex = event;
          if (event !== this.prevIndexRoom) {
            this.prevIndexRoom = event;
          }
        },
        getSwiperOptions() {
            return this.triggerMobile ? this.swiperOptionMobile : this.swiperOption;
        },
        onResize() {
            this.windowWidth = window.innerWidth;
        },
        getRooms() {
            console.log(this.rooms);
            console.log(this.rooms.slice(this.page * this.step, this.step));
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
            'https://e-bettor.herokuapp.com/all_metrics',
                { headers: {
                    'Content-type':'application/json'
                }})
                .then(({data}) => {
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
                    console.log(response);
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
            return axios.get(`https://e-bettor.herokuapp.com/all_rooms`, { headers: {
                'Content-type':'application/json'
            }})
                .then(({data}) => {
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

.b-dropdown {
    button {
        color: white;
    }
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

.hide-scrollbar
{
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

.carousel-3d-slide:hover {
  -webkit-transform: scale(1.05, 1.05);
  transform: scale(1.05, 1.05);
}

@media screen and (max-width: 1600px) and (max-height: 1000px) {

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

.swiper-slide {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.arrow {
    width: 40px !important;
    height: 40px !important;
    color: white;
    cursor: pointer;
}

.swiper-slide::after {
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

.swiper-slide:hover {
  -webkit-transform: scale(1.05, 1.05);
  transform: scale(1.05, 1.05);
  
}

.swiper-slide:hover > .cardOverlay {
    // background-color: white;
    opacity: 0.6;

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

.swiper-slide:hover::after {
    opacity: 1;
}

.sw-prev {
    position: absolute;
    top: 40%;
    left: -10px;
    z-index: 100;
    color: #5c636a;
    border-radius: 50%;
    border: 5px solid white;
    cursor: pointer;
}

.sw-next {
    position: absolute;
    top: 40%;
    right: -10px;
    z-index: 200;
    border-radius: 50%;
    border: 5px solid white;
    color: #5c636a;
    cursor: pointer;
}

.fancy-6:hover {
  color: #233963;
}

.actionButton {
  background: #4e54c8;
  // border: 2px solid white;
  color: white;

  :hover {
      opacity: 1.3;
  }
}

</style>