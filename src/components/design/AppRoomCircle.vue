<template>
  <div class="">
    <div class="orbital-pulse action-shadow d-flex align-items-center justify-content-center p-5 text-white" :style="orbitalWidth" style="border-radius: 15%;">
      <div v-if="activeOrbit === false">
          <font-awesome-icon :icon="['fas', 'expand']" size="lg" style="cursor: pointer;"/>
      </div>
      <div v-else class="h-100 w-100">
          <app-game-card v-if="activeRoom !== null" :room="activeRoom" :closer="true" :variant="true" :metric="getMetricLabel(getIcon(activeRoom))" class="h-100 w-100" @closeCard="activeOrbit = false" />
      </div>
    </div>
    <div class="orbit">
        <ul>
            <li v-for="(room, index) in rooms.slice(0, 8)" :key="`room-${index}`">
              <div><font-awesome-icon :id="`${room.game_id}icon`" :icon="['fas', `${getIcon(room)}`]" style="width: 50px; height: 50px;" /></div>
              <p @click="openOrbital(room)">{{ room.game_id }}</p>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import {metricsList} from '@/util/consts/lolMetrics';
import AppGameCard from '@/components/design/AppGameCard';

export default {
	name: 'AppRoomCircle',
    components: {
        AppGameCard
    },
    props: {
        rooms: {
            type: Array,
            default: () => []
        },
        metrics: {
            type: Array,
            default: () => []
        }
    },
    data() {
		return {
            loading: false,
            metricsList,
            orbitalWidth: '',
            activeRoom: null,
            activeOrbit: false
		};
	},
    computed: {
        roomsList() {
            const cloneRoom = this._.cloneDeep(this.rooms);
            return cloneRoom.splice(cloneRoom.length - 1)
        }
    },
    watch: {
        activeOrbit(val) {
            this.$nextTick(() => {
                if (val) {
                    this.orbitalWidth = `width: 280px !important; height: 310px !important; animation: none;  z-index: 290; background-color: #8f94fb; border-radius: 15px; position: relative; padding: 10px !important;`;
                } else {
                    setTimeout(()=>{
                        this.activeRoom = null;
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
        openOrbital(key) {
            setTimeout(()=>{
                this.activeRoom = this._.cloneDeep(key);
            },500);
            this.activeOrbit = !this.activeOrbit;
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
    }
};
</script>

<style lang="scss" scoped>
 :root{
    --base-grid: 14px;
    --colour-white: #fff;
    --colour-black: #1a1a1a;
 }

.links {
  display: grid;
  min-height: 100vh;
  place-content: center;
  overflow: hidden;
}

.links__list {
  position: relative;
  list-style: none;
}



.links__link:hover:after {
  transition: all .3s cubic-bezier(.37,.74,.15,1.65);
  transform: scale(1.1);
  box-shadow: 0 5px 10px white;
  opacity: 1;
}

@keyframes on-load {
  0% {
    opacity: 0;
    transform: scale(.3);
  }
  70% {
    opacity: .7;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes text {
  0% {
    opacity: 0;
    transform: scale(0.3) translateY(0);
  }
  100% {
    --base-grid: 14px;
    opacity: 1;
    transform: scale(1) translateY(calc(var(--base-grid)*5));
  }
}


.orbital {
    width: 3rem;
    height: 3rem;
    border-radius: 25%;
    background-color: #001E6C;
}

.orbital-pulse {
    width: 4rem;
    height: 4rem;
    border-radius: 25%;
    background-color: #001E6C;
    transition: all 0.9s;
    top: calc(-10% - 76px);
    animation: pulse-blue 2s infinite;
    position: relative;
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


.orbit {
    top: calc(-50% - 76px);
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
    // animation: orbit var(--speed) linear infinite;
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

    & > * {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      border-radius: inherit;

      position: absolute;
      // animation: pulse-blue 2s infinite;

    }

    > div {
      background-color: var(--icon-bg);
      animation: on-load .3s ease-in-out forwards,
        pulse-blue 2s infinite;
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
    transform: translate(15rem, 0);
  }

  li:nth-child(2) {
    transform: translate(10rem, 10rem);
  }

  li:nth-child(3) {
    transform: translate(0, 15rem);
  }
  li:nth-child(4) {
    transform: translate(-10rem, 10rem);
  }

  li:nth-child(5) {
    transform: translate(-15rem, 0);
  }

  li:nth-child(6) {
    transform: translate(-10rem, -10rem);
  }

  li:nth-child(7) {
    transform: translate(0, -15rem);
  }
  li:nth-child(8) {
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

  @media screen and (max-width: 767px) {

    li:nth-child(1) {
      // --icon-bg: var(--blue-light);
      // --text-bg: var(--blue-dark);
      transform: translate(0, -11rem);
    }

    li:nth-child(2) {
      // --icon-bg: var(--green-light);
      // --text-bg: var(--green-dark);
      transform: translate(0, -5.5rem);
    }

    li:nth-child(3) {
      // --icon-bg: var(--pink-light);
      // --text-bg: var(--pink-dark);
      transform: translate(0, 6rem);
    }
    li:nth-child(4) {
      // --icon-bg: var(--red-light);
      // --text-bg: var(--red-dark);
      transform: translate(0, 12rem);
    }

    li:nth-child(5) {
      // --icon-bg: var(--brown-light);
      // --text-bg: var(--brown-dark);
      transform: translate(0, 15rem);
    }

    li:nth-child(6) {
      // --icon-bg: var(--yellow-light);
      // --text-bg: var(--yellow-dark);
      transform: translate(0, 16rem);
    }

    li:nth-child(7) {
      // --icon-bg: var(--purple-light);
      // --text-bg: var(--purple-dark);
      transform: translate(0, 21rem);
    }
    li:nth-child(8) {
      // --icon-bg: var(--orange-light);
      // --text-bg: var(--orange-dark);
      transform: translate(0, 9rem);
    }
  }

}

@media screen and (max-width: 767px) {
  .orbit {
    li {
      width: 5rem;
      height: 5rem;
    }
  }

  .orbital-pulse {
    width: 4rem;
    height: 4rem;
    padding: 10px !important;
  }
}


@media screen and (max-width: 1600px) and (max-height: 1000px) {
    .orbital-pulse {
      top: 0;
    }

    .orbit {
      top: calc(-50%) !important;
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
</style>