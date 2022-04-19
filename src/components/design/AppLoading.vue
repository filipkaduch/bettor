<template>
	<div>
		<template v-if="loading">
			<div v-if="noOverlay" class="progress-bar--container visible" />
			<div v-if="!circle && !noOverlay" class="d-flex align-items-center justify-content-center h-100">
				<div class="bar bar1"></div>
				<div class="bar bar2"></div>
				<div class="bar bar3"></div>
				<div class="bar bar4"></div>
				<div class="bar bar5"></div>
				<div class="bar bar6"></div>
				<div class="bar bar7"></div>
				<div class="bar bar8"></div>
				<!-- <b-spinner
					variant="primary"
					:style="style" /> -->
		</div>
    <div v-if="circle && !noOverlay" id="container" class="d-flex align-items-center justify-content-center w-100 h-100">
        <svg viewBox="0 0 100 100" class="loader">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" 
                :flood-color="variant === 'white' ? 'white' : 'black'"/>
            </filter>
          </defs>
          <circle id="spinner" :style="`fill:transparent;stroke:${variant === 'white' ? 'white' : '#001E6C'};stroke-width: 7px;stroke-linecap: round;filter:url(#shadow);`" cx="50" cy="50" r="45"/>
        </svg>
    </div>
		</template>
		<slot v-else />
	</div>
</template>

<script>
// import { gsap } from 'gsap';

export default {
	name: 'AppLoading',
	props: {
		loading: {
			type: Boolean,
			required: true
		},
    circle: {
			type: Boolean,
			default: true
		},
		variant: {
			type: String,
			default: 'primary'
		},
		noOverlay: {
			type: Boolean,
			default: false
		},
		size: {
			type: Number,
			default: 4
		}
	},
  data() {
      return {
        getDocProp: null,
      };
  },
	computed: {
		style() {
			return {
				height: `${this.size}rem`,
				width: `${this.size}rem`
			};
		}
	},
  mounted() {

    },
  methods: {

  }
};
</script>

<style lang="scss" >
/* stolen from https://codepen.io/apptum/pen/GNGXZj */
.progress-bar--container {
  width: 100%;
  height: 4px;
  background-color: rgba(black, .3);
  display: none;
  position: absolute;
	top: 0;
  overflow: hidden;
  transition: opacity 0.1s ease-out;
  opacity: 1;
}

.progress-bar--container::after {
  background-color: black;
  content: "";
  position: absolute;
  width: inherit;
  height: inherit;
  transform-origin: left;
}

.progress-bar--container.visible {
  display: block;
  animation: progress-bar--container_fadeIn 0.2s ease-in;
}

.progress-bar--container.visible::after {
  display: block;
  animation: progress-bar_fill 2s linear;
  animation-iteration-count: infinite;
}

@keyframes progress-bar_fill {
  0% {
    transform: scaleX(0) translateX(0);
  }
  1% {
    transform: scaleX(0) translateX(0);
  }
  33% {
    transform: scaleX(0.66) translateX(16.5%);
  }
  75% {
    transform: scaleX(1.5) translateX(66%);
  }
  100% {
    transform: scaleX(2) translateX(150%);
  }
}

@keyframes progress-bar--container_fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.loader {
  padding: 10px;
  width: 70px;
  height: 70px;
}

.bar {
  width: 10px;
  height: 70px;
  background: #8095ba;
  display: inline-block;
  transform-origin: bottom center;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  /*   box-shadow:5px 10px 20px inset rgba(255,23,25.2); */
  animation: loader 1.2s linear infinite;
}
.bar1 {
  animation-delay: 0.1s;
}
.bar2 {
  animation-delay: 0.2s;
}
.bar3 {
  animation-delay: 0.3s;
}
.bar4 {
  animation-delay: 0.4s;
}
.bar5 {
  animation-delay: 0.5s;
}
.bar6 {
  animation-delay: 0.6s;
}
.bar7 {
  animation-delay: 0.7s;
}
.bar8 {
  animation-delay: 0.8s;
}

@keyframes loader {
  0% {
    transform: scaleY(0.1);
    // background: ;
  }
  50% {
    transform: scaleY(1);
    background: #5C8DF6;
  }
  100% {
    transform: scaleY(0.1);
    background: transparent;
  }
}


@keyframes animation {
  0% {
    stroke-dasharray: 1 98;
    stroke-dashoffset: -105;
  }
  50% {
    stroke-dasharray: 80 10;
    stroke-dashoffset: -160;
  }
  100% {
    stroke-dasharray: 1 98;
    stroke-dashoffset: -300;
  }
}

#spinner {
  transform-origin: center;
  animation-name: animation;
  animation-duration: 1.2s;
  animation-timing-function: cubic-bezier;
  animation-iteration-count: infinite;
}

</style>
