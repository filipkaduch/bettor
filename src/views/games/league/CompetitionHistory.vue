<template>
    <div class="mt-2" style="z-index: -10; border-top: 1px solid white;">
        <app-loading :loading="isLoading" :circle="true" variant="white">
            <div v-if="isLoading === false" class="h-100 hide-scrollbar py-2 rounded" style="overflow-y: scroll; scrollbar-width: none; max-height: 330px;">
                <b-row v-for="(history, index) in records" :key="index" class="px-3">
                    <b-col cols="1" class="d-flex justify-content-start align-items-center">

                    </b-col>
                    <b-col cols="6"  class="d-flex justify-content-start align-items-center">
                        {{ timestampToDate(history.played) }}
                    </b-col>
                    <b-col cols="2"  class="d-flex justify-content-start align-items-center">
                        {{ history.value }}
                    </b-col>
                    <b-col cols="1" lg="3" xl="3" class="d-flex justify-content-start align-items-center">
                        {{ history.game_count }}
                    </b-col>
                </b-row>
            </div>
        </app-loading>
    </div>
</template>

<script>
import AppLoading from '@/components/design/AppLoading';
import {timestampToDate} from '@/util/timeUtils';


export default {
    name: 'CompetitionHistory',
    components: { AppLoading },
    props: {
        attendeeId: {
            type: Number,
            default: null,
            required: true
        },
        gameId: {
            type: Number,
            default: null,
            required: true
        },
        room: {
            type: Object,
            default: null
        },
        metric: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            history: null,
            records: [],
            isLoading: true,
            timestampToDate
        };
    },
    computed: {
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        },
    },
    created() {
        this.getHistory().then(() => {
                Object.keys(this.history).forEach((key) => {
                    this.records.push(this.history[key])
                });
                this.records.sort((a,b) => b.game_count > a.game_count)
                console.log(this.records.filter((record) => new Date(this.room.start_date) <= new Date(record.played) < new Date(this.room.end_date)));
                this.records = this._.cloneDeep(this.records.filter((record) => new Date(this.room.start_date) <= new Date(record.played) &&  new Date(record.played) < new Date(this.room.end_date))).slice(0,this.metric.games);
        });
    },
    methods: {
        getHistory() {
            this.isLoading = true;
            console.log(this.logged);
            this.records = [];
            return this.$axios.post(`http://localhost:5000/room-attendee/get-attendee/${this.attendeeId}`, {
              game_id: this.gameId,
              user_id: this.logged.id
            })
            .then(({data}) => {
                console.log(data);
                this.history = this._.cloneDeep(data.match_history);
            })
            .catch((response) => {
                console.log(response);
            }).finally(() => {
                this.isLoading = false;
            });
            
        }
    }
}

</script>

<style type="scss">

.owner-badge {
    background: transparent;
}


.previewImage {
    width: 64px;
    height: auto;
}

.rowRecord {
    cursor: pointer;
    background: #90AACB;
}

.differButton {
  background: #001E6C;
  color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);

}
.differButton:hover {
    color: whitesmoke;
      -webkit-transform: scale(1.02, 1.02);
  transform: scale(1.02, 1.02);
}

.differButton::after {
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


.rowHover {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  -webkit-transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
  transition: all 0.7s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.rowHover::after {
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

.rowHover:hover {
  -webkit-transform: scale(1.02, 1.02);
  transform: scale(1.02, 1.02);
}

.rowHover:hover::after {
    opacity: 1;
}

</style>