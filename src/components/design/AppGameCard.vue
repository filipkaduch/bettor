<template>
	<b-card :header-class="variant ? 'customHeaderLight' : 'customHeader'" bg-variant="light" :header="variant ? 'bodyCardLight' : 'bodyCard'" :body-class="variant ? 'bodyCardLight' : 'bodyCard'" :footer-class="variant ? 'bodyCardLight' : 'bodyCard'" class="border-0">
        <template #header>
            <div v-if="closer" class="d-flex justify-content-end">
                <font-awesome-icon :icon="['fas', 'minus-circle']" size="2x" style="cursor: pointer;" @click="closeCard"/>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <div class="firstInfo">
                    Room:
                </div>
                <div> 
                {{ gameName }}
                </div>
            </div>
            <div class="d-flex justify-content-between">
                <div class="firstInfo">
                Players:
                </div>
                <div> 
                {{ playersText }}
                </div>
            </div>
        </template>
        <b-card-body class="p-0">
            <div>
                Competition: {{ metric }}
            </div>
            <div>
                Time left: {{ timeLeft }}
            </div>
            <div>
                Entry: {{ bankText }}
            </div>
        </b-card-body>
        <template #footer>
            <b-button-group class="w-100">
                <b-button class="actionButton" :to="{name: 'lolRoomDetail', params: { metric: room.metric_id, game: room.id }}">
                    Detail
                </b-button>
                <b-button v-if="!isOwn" class="actionButton" :disabled="logged === 'null'">
                    Join
                </b-button>
                <b-button v-if="isOwn && onlyPlayer" class="actionButton" :disabled="logged === 'null'" @click="showModal">
                    Delete
                </b-button>
            </b-button-group>
        </template>
        <b-modal id="modal-1" ref="my-modal" body-class="actionModal d-block" hide-footer centered hide-header>
            <div class="d-flex justify-content-center pt-2">
                <h4 class="mb-4">Do you want to delete this room?</h4>
            </div>
            <div class="d-flex justify-content-center pb-2">
                <div class="d-flex justify-content-between w-100 px-5">
                    <b-button v-if="isOwn && onlyPlayer" class="yesButton" @click="hideModal">
                        Yes, delete!
                    </b-button>
                    <b-button class="nopeButton" @click="hideModal">
                        Nope
                    </b-button>
                </div>
            </div>
        </b-modal>
	</b-card>
</template>

<script>
import axios from 'axios';

export default {
	name: 'AppGameCard',
	props: {
		room: {
			type: Object,
			default: null
		},
        variant: {
            type: Boolean,
            default: false
        },
        isOwn: {
            type: Boolean,
            default: false
        },
        closer: {
            type: Boolean,
            default: false
        },
        metric: {
            type: String,
            default: null
        }
	},
	computed: {
		gameName() {
            return this.room?.game_id;
		},
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        },
        playersText() {
            return `${this.room.actual_players === null ? `0` : this.room.actual_players}/${this.room.players_count}`;
        },
        bankText() {
            return `${this.room.bank} credits`;
        },
        onlyPlayer() {
            return this.room.actual_players === 1;
        },
        timeLeft() {
            const date3 = new Date(this.room.start_date);
            const date1 = new Date();
            const date2 = new Date(this.room.end_date);
            const diffTimeGame = Math.abs(date2 - date3);
            const diffTime = Math.abs(date2 - date1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            const diffDaysGame = Math.ceil(diffTimeGame / (1000 * 60 * 60 * 24)); 
            return `${ diffDays > diffDaysGame ? '' : diffDays} ${ diffDays > diffDaysGame ? `-` : diffDays > 1 ? `days` : `day`}`;
        },
        competitionIcon() {
            return null;
        }
	},
    methods: {
        removeRoom() {
            return axios.delete(
            `https://e-bettor.herokuapp.com/remove_roomm?room=${this.room.id}`,
                { headers: {
                    'Content-type':'application/json'
                }})
                .then(({data}) => {
                    console.log(data);
                    
                })
                .catch(({response}) => {
                    console.error(response);
                });
        },
        hideModal() {
            this.$refs['my-modal'].hide();
        },
        closeCard() {
            this.$emit('closeCard');
        },
        showModal() {
            this.$refs['my-modal'].show();
        }
    }
};
</script>

<style lang="scss" scoped>

.customHeader {
    text-align: start;
    background: #001E6C;
    color: white;
}

.customHeaderLight {
    text-align: start;
    background: #8f94fb;
    color: white;
}

.bodyCard {
    color: white;
    background: #001E6C;
}

.bodyCardLight {
    color: white;
    background: #8f94fb;
}

.firstInfo {
    font-weight: 600;
}

.actionButton {
  background: #4e54c8;
  // border: 2px solid white;
  color: white;

  :hover {
      opacity: 1.3;
  }
}


.yesButton {
  background: #001E6C;
  color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);

}
.yesButton:hover {
    color: whitesmoke;
    background: #001E6C;
      -webkit-transform: scale(1.02, 1.02);
  transform: scale(1.02, 1.02);
}

.nopeButton {
    box-shadow: 0 1px 2px rgba(81, 15, 15, 0.1);
  border-radius: 5px;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);

}
.nopeButton:hover {
      -webkit-transform: scale(1.02, 1.02);
  transform: scale(1.02, 1.02);
}


</style>