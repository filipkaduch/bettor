<template>
    <b-col cols="12" class="shadow bottom h-100" style="background: #1F3C88; border-radius: 8px;">
        <div class="d-flex justify-content-between header p-3 align-items-center">
            <div>
                <h4>Create a room</h4>
            </div>
            <div>
                <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" @click="emitClose" style="cursor: pointer;"/>
            </div>
        </div>
        <div class="w-100 overflow-scroll hide-scrollbar h-100 p-1 mb-5">
            <b-dropdown class="my-2 w-100 px-4 game-dropdown" variant="game-dropdown" no-caret>
                <template #button-content>
                    {{ selectedGame === null ? $t('t_ChooseGame') : selectedGame.text }}
                </template>
                <b-dropdown-item class="w-100" v-for="game in gamesList" :key="game.value" @click="setGame(game)">{{ game.text }}</b-dropdown-item>
            </b-dropdown>
            <div v-if="selectedGame">
                <div v-if="selectedGame.value === 'lol'">
                    <room-create @closeCreate="emitClose" />
                </div>
            </div>
        </div>
    </b-col>
</template>

<script>
import {gamesList} from '@/util/consts/games';
import RoomCreate from '@/views/games/league/RoomCreate';

export default {
	name: 'AppGamepicker',
    components: {
        RoomCreate
    },
    data() {
		return {
            loading: false,
            selectedGame: null,
            gamesList
		};
	},
    methods: {
        emitClose() {
            this.$emit('closeCreate');
        },
        setGame(game) {
            this.selectedGame = game;
        }
    }
};
</script>

<style lang="scss" scoped>


.customHeader {
    text-align: start;
}

.firstInfo {
    font-weight: 600;
}

.actionButton {
    background: #ebf0f2;
    border: 2px solid lightslategrey;
    color: black;

    :hover {
        opacity: 1.3;
    }
}

.tabClass {
    text-decoration: none;
    color: black;
    font-weight: bold;
}

.textBlack {
    color: black;
}

.text-align-left {
    text-align: left;
}
</style>