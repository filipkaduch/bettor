import Vue from 'vue';
import Router from 'vue-router';
import Home from '../views/Home.vue';
import Rankings from '../views/Rankings.vue';
import Register from '../views/auth/Register.vue';
import LeagueOfLegends from '../views/games/LeagueOfLegends.vue';
import RoomCreate from '../views/games/league/RoomCreate.vue';
import RoomDetail from '../views/games/league/RoomDetail.vue';
import RoomsList from '../views/games/league/RoomsList.vue';
import AccountSettings from '../views/auth/AccountSettings.vue';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/lol',
    name: 'lol',
    component: LeagueOfLegends
  },
  {
    path: '/lolCreateRoom',
    name: 'lolCreateRoom',
    component: RoomCreate
  },
  {
    path: '/lolRoomDetail/:game',
    name: 'lolRoomDetail',
    component: RoomDetail,
    params: true,
    meta: {
      reload: true
    }
  },
  {
    path: '/accountSettings',
    name: 'accountSettings',
    component: AccountSettings
  },
  {
    path: '/roomsList',
    name: 'roomsList',
    component: RoomsList
  },
  {
    path: '/rankings',
    name: 'rankings',
    component: Rankings
  }
];

const router = new Router({
  routes
});

export default router;
