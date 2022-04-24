<template>
    <div>
        <div class="orbit-heading">
            <div ref="orbital" class="orbital-pulse action-shadow d-flex align-items-center justify-content-center p-5" :style="orbitalWidth">
                <div v-if="activeKey === ''">
                    <font-awesome-icon :icon="['fas', 'expand']" size="lg" style="cursor: pointer;"/>
                </div>
                <div v-if="enabledDict.info" class="w-100 h-100">
                    <div class="d-flex justify-content-between mb-5"><h3>Game info</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('info')"/></div>
                    <h4 class="d-flex justify-content-between align-items-center game-info"><b>Competion:</b> {{ metric.metric }}</h4>
                    <h4 class="d-flex justify-content-between align-items-center game-info"><b>{{ `${metric.metric} to reach`}}:</b> {{ metric.value }}</h4>
                    <h4 class="d-flex justify-content-between align-items-center game-info"><b>Games available:</b> {{ metric.games }}</h4>
                    <h4 class="d-flex justify-content-between align-items-center game-info"><b>Start date:</b> {{ timestampToDate(room.start_date, false) }}</h4>
                    <h4 class="d-flex justify-content-between align-items-center game-info"><b>End date:</b> {{ timestampToDate(room.end_date, false) }}</h4>
                </div>
                <div v-if="enabledDict.outcome" class="w-100 h-100">
                    <div class="d-flex justify-content-between mb-5"><h3>Expected outcome</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('outcome')"/></div>
                </div>
                <div v-if="enabledDict.stats" class="w-100 h-100">
                    <div class="d-flex justify-content-between mb-2"><h3>Players</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('stats')"/></div>
                    <div class="hide-scrollbar py-2 rounded" style="overflow-y: scroll; scrollbar-width: none;">
                        <h4>Players:</h4>
                        <b-row class="pt-2 pb-1 mx-2 d-lg-flex d-none">
                            <b-col cols="1" class="d-flex justify-content-start align-items-center">

                            </b-col>
                            <b-col cols="6" class="d-flex justify-content-start align-items-center">
                                <h5>Name:</h5>
                            </b-col>
                            <b-col cols="2" class="d-flex align-items-center justify-content-start">
                                <h5>{{metric.metric}}:</h5>
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
                                    <competition-history :attendeeId="player.id" :gameId="room.id" :room="room" :metric="metric" />
                                </b-col>
                            </transition>
                        </b-row>
                    </div>
                </div>
                <div v-if="enabledDict.chat" class="w-100 h-100">
                    <div class="d-flex justify-content-between mb-2"><h3>Chat</h3> <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="openOrbital('chat')"/></div>
                    <app-chat :players="players" />
                </div>
            </div>
        </div>
        <div class="orbit">
            <ul>
                <li>
                    <div><font-awesome-icon :icon="['fas', 'info-circle']" size="lg" style="cursor: pointer; width: 50px; height: auto;"/></div>
                    <p @click="openOrbital('info')">Game info</p>
                </li>
                <li>
                    <p>Expected outcome</p>
                </li>
                <li>
                    <div><font-awesome-icon :icon="['fas', 'envelope']" size="lg" style="cursor: pointer; width: 50px; height: auto;"/></div>
                    <p @click="openOrbital('chat')">Chat</p>
                </li>
                <li>
                    <p>Current table</p>
                </li>
                <li>
                    <div><font-awesome-icon :icon="['fas', 'users']" size="lg" style="cursor: pointer; width: 50px; height: auto;"/></div>
                    <p @click="openOrbital('stats')">Players</p>
                </li>
                <li>
                    <p>Current table</p>
                </li>
                <li>
                    <div><font-awesome-icon :icon="['fas', 'piggy-bank']" size="lg" style="cursor: pointer; width: 50px; height: auto;"/></div>
                    <p @click="openOrbital('outcome')">Expected outcome</p>
                </li>
                <li>
                    <p>Disciplinary</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import CompetitionHistory from '@/views/games/league/CompetitionHistory';
import AppChat from '@/components/design/AppChat';
import {timestampToDate} from '@/util/timeUtils';

export default {
	name: 'AppOrbit',
    components: {
        CompetitionHistory,
        AppChat
    },
    props: {
        metric: {
            type: Object,
            default: null
        },
        room: {
            type: Object,
            default: null
        },
        players: {
            type: Array,
            default: () => []
        },
        showPlayers: {
            type: Array,
            default: () => []
        },
        chatComputed: {
            type: Object,
            default: null
        }
    },
    data() {
		return {
            loading: false,
            activeOrbit: false,
            enabledDict: {
                info: false,
                stats: false,
                outcome: false,
                chat: false
            },
            chatMessage: '',
            activeKey: '',
            orbitalWidth: '',
            timestampToDate
		};
	},
    computed: {
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        }
    },
    watch: {
        activeOrbit(val) {
            this.$nextTick(() => {
                if (val) {
                    this.orbitalWidth = `width: 680px !important; height: 700px !important; animation: none; position: relative; z-index: 290; background-color: #8f94fb; border-radius: 15px;`;
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
    methods: {
        emitClose() {
            this.$emit('closeCreate');
        },
        isAuthor(author) {
            if (typeof this.logged.name === 'undefined') {
                return Math.random() < 0.5;
            }
            return this.logged?.name === author;
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
        isOwner(player) {
            return this.room.owner_id === player.id;
        },
        openPlayer(key) {
            const index = this.getIndex(key);
            console.log(index);
            this.showPlayers[index] = !this.showPlayers[index];
            this.showPlayers = this._.cloneDeep(this.showPlayers);
        },
        openOrbital(key) {
            this.activeKey = key;
            this.activeOrbit = !this.activeOrbit;
        }
    }
};
</script>

<style lang="scss" scoped>

.orbital-grow-enter-active {
  animation: anime 3s cubic-bezier(0.16, 1, 0.3, 1);

}
.orbital-grow-leave-active {
  animation: anime 3s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}

.grow-down-enter-active,
.grow-down-leave-active {
  transition: all 0.6s;
  max-height: 450px;
}
.grow-down-enter,
.grow-down-leave-to
{
  opacity: 0;
  max-height: 0px;
}


.orbital {
    width: 3rem;
    height: 3rem;
    border-radius: 25%;
    background-color: #001E6C;
}

.orbital-pulse {
    width: 2rem;
    height: 2rem;
    border-radius: 25%;
    background-color: #001E6C;
    transition: all 0.9s;
    animation: pulse-blue 2s infinite;
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

    @keyframes anime {
      0% {
        width: 3rem;
        height: 3rem;
      }
      25% {
        width: 120px;
        height: 120px;
      }
      50% {
        width: 260px;
        height: 240px;
      }
      100% {
        width: 480px;
        height: 240px;
      }
    }

.orbit {
    top: -55%;
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
    width: 7rem;
    aspect-ratio: 1 / 1;
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
      animation: orbit var(--speed) linear reverse infinite,
        throb 1s var(--throb-delay) ease-in-out infinite alternate;
      animation-play-state: var(--orbit-play-state, running),
        var(--throb-play-state, running);
    }

    > div {
      background-color: var(--icon-bg);
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

  li:nth-child(1) {
    // --icon-bg: var(--blue-light);
    // --text-bg: var(--blue-dark);
    transform: translate(15rem, 0);
  }

  li:nth-child(2) {
      display: none;
    // --icon-bg: var(--green-light);
    // --text-bg: var(--green-dark);
    transform: translate(10rem, 10rem);
  }

  li:nth-child(3) {
    // --icon-bg: var(--pink-light);
    // --text-bg: var(--pink-dark);
    transform: translate(0, 15rem);
  }
  li:nth-child(4) {
      display: none;
    // --icon-bg: var(--red-light);
    // --text-bg: var(--red-dark);
    transform: translate(-10rem, 10rem);
  }

  li:nth-child(5) {
    // --icon-bg: var(--brown-light);
    // --text-bg: var(--brown-dark);
    transform: translate(-15rem, 0);
  }

  li:nth-child(6) {
      display: none;
    // --icon-bg: var(--yellow-light);
    // --text-bg: var(--yellow-dark);
    transform: translate(-10rem, -10rem);
  }

  li:nth-child(7) {
    // --icon-bg: var(--purple-light);
    // --text-bg: var(--purple-dark);
    transform: translate(0, -15rem);
  }
  li:nth-child(8) {
      display: none;
    // --icon-bg: var(--orange-light);
    // --text-bg: var(--orange-dark);
    transform: translate(10rem, -10rem);
  }

    @media screen and (max-width: 1600px) {
    
    li:nth-child(1) {
      transform: translate(12rem, 0);
    }

    li:nth-child(2) {
      transform: translate(9rem, 9rem);
    }

    li:nth-child(3) {
      transform: translate(0, 12rem);
    }
    li:nth-child(4) {
      transform: translate(-9rem, 9rem);
    }

    li:nth-child(5) {
      transform: translate(-12rem, 0);
    }

    li:nth-child(6) {
      transform: translate(-9rem, -9rem);
    }

    li:nth-child(7) {
      transform: translate(0, -12rem);
    }
    li:nth-child(8) {
      transform: translate(9rem, -9rem);
    }
  }
}

@keyframes orbit {
  100% {
    rotate: 1turn;
  }
}

@keyframes hold-position {
  100% {
    rotate: -1turn;
  }
}

@keyframes throb {
  100% {
    scale: 1.05;
  }
}

ul[role="list"],
ol[role="list"] {
  list-style: none;
}

/* Set core body defaults */


/* Make images easier to work with */
img,
picture {
  max-width: 100%;
  display: block;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
  html:focus-within {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>