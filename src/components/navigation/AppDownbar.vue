<template>
  <transition name="slide-fade">
    <b-col v-if="show" cols="wp" class="position-fixed p-0 main-tab">
      <div class="bg-transparent" style="height: 100vh;">
        <div class="palette-sidebar shadow pl-0">
          <app-gamepicker v-if="type === 'create'" @closeCreate="closeSidebar"/>
          <find-player v-else-if="type === 'find'" @closeCreate="closeSidebar"/>
          <app-payments v-else-if="type === 'payments'" @closeCreate="closeSidebar"/>
          <history-list v-else-if="type === 'list'" @closeCreate="closeSidebar"/>
          <app-support v-else-if="type === 'support'" @closeCreate="closeSidebar"/>
        </div>
      </div>
    </b-col>
  </transition>
</template>

<script>
import AppGamepicker from '@/components/design/AppGamepicker';
import FindPlayer from '@/views/games/league/FindPlayer';
import AppPayments from '@/components/design/AppPayments';
import AppSupport from '@/components/design/AppSupport';
import HistoryList from '@/views/games/league/HistoryList';

export default {
  name: 'AppDownbar',
  components: { AppPayments,
    AppGamepicker,
    FindPlayer,
    HistoryList,
    AppSupport
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      sidebarClosingTimeout: null,
      showSidebar: false
    };
  },
  computed: {
    isMobile() {
      return screen.width < 576;
    }
  },
  mounted() {

  },
  methods: {
    closeSidebar() {
      this.$emit('closeCreate');
    }
  }
};
</script>

<style scoped>

.palette-sidebar {
  overflow: hidden;
  height: 100%;
  background-color: transparent;
  transition: down ease 0.2s;
  transform: scaleY(1.0);
  border-radius: 8px;
  padding-top: 70px;
}

.main-tab {
  z-index: 300;
  margin-left: 52px;
  top: 0;
  height: 100%;
  width: 600px;
}

@media screen and (max-width: 767px) {
  .main-tab {
    z-index: 300;
    top: 0;
    height: 100vh;
    margin-left: 0 !important;
    width: 100% !important;
  }
  .palette-sidebar {
    height: 100vh;
    padding-top: 120px !important;
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter {
  transition: all 0.3s ease-in;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter
  /* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateY(-40px);
}

.slide-fade-leave-to {
  transform: translateY(-40px);
}
</style>
