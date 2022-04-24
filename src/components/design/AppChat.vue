<template>
    <app-loading :loading="loading" class="h-100">
        <div class="h-100" style="place-content: space-between; display: flex !important; flex-direction: column;">
            <div class="hide-scrollbar py-1 py-lg-2 rounded" style="overflow-y: scroll; scrollbar-width: none; max-height: 40vh;">
                <div v-for="(msg, index) in chatComputed" :key="`${index}`" :class="isAuthor(msg.author) ? 'text-start' : 'text-end'" class="my-1 my-lg-2">
                    <h5 class="mb-0 game-info">{{ msg.message }}</h5>
                    <small v-if="changedAuthor(index, msg.author)" style="border-top: 1px solid white">{{ msg.author }}, {{ timestampToDate(msg.time_sent) }}</small>
                </div>
            </div>
            <div class="my-auto">
                <b-input-group class="mt-2">
                    <b-input v-model="chatMessage" type="text" style="background-color: transparent; color: white;" placeholder="Type a message..." />
                    <b-button class="border p-1 px-3 inputIcon rounded text-white" variant="transparent"><font-awesome-icon :icon="['fas', 'angle-right']" size="2x" /></b-button>
                </b-input-group>
            </div>
        </div>
    </app-loading>
</template>

<script>
import axios from 'axios';
import {timestampToDate} from '@/util/timeUtils';
import AppLoading from './AppLoading.vue';

export default {
    name: 'AppChat',
    components: {
        AppLoading
    },
    props: {
        players: {
            type: Array,
            default: () => []
        }
    },
    data() {
		return {
            loading: false,
            chatMessage: '',
            chat: null,
            timestampToDate
		};
	},
    computed: {
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        },
        chatComputed() {
            if(typeof this.chat?.['chat0']?.chat !== 'undefined') {
                return this.chat?.['chat0']?.chat;
            }
            return this?.chat ?? [];
        }
    },
    mounted() {
        this.loading = true;
        this.loadChat();
    },
    methods: {
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
                if (player === key) {
                    return count;
                }
                count += 1;
            });
            return count;
        },
        canJoin() {
            let found = false;
            Object.keys(this.players).forEach((key) => {
                if (this.players[key].user_id === this.logged.id) {
                    found = true;
                }
            });
            return found || this.logged === 'null';
        },
        canWrite() {
            return this.logged === 'null';
        },
        sendMessage() {
            if (this.chat === null) {
                this.chat = [{message: this.chatMessage, author: this.logged.name}];
            } else {
                this.chat?.['chat0']?.chat.push({message: this.chatMessage, author: this.logged.name, time_sent: new Date() });
            }
            return axios.post(`https://e-bettor.herokuapp.com/send_message?room=${this.$route.params.game}`, { headers: {
                'Content-type':'application/json'
            }, data: {
                chat: this.chat,            
            }})
            .then(({data}) => {
                console.log(data);
            })
            .catch((response) => {
                console.error(response);
            }).finally(() => {
                this.chatMessage = '';
                // this.isLoading = false;
            });
        },
        loadChat() {
            this.loading = true;
            return axios.get(`https://e-bettor.herokuapp.com/load_chat?room=${this.$route.params.game}`, { headers: {
                'Content-type':'application/json'
            }})
            .then(({data}) => {
                this.chat = this._.cloneDeep(data);
                if (!this.chat) {
                    this.sendMessage();
                }
                console.log(this.chat);
            })
            .catch((response) => {
                console.error(response);
            }).finally(() => {
                this.loading = false;
            });
        },
    }
}
</script>


<style type="scss" scoped>

.form-control::placeholder { 
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: white;
    opacity: 1; /* Firefox */
}

.form-control {
    border-top: 1px solid white;
    border-left: 1px solid white;
    border-right: 0;
    border-bottom: 1px solid white;
}

.inputIcon {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    cursor: pointer;
}

.inputIcon:hover {
    opacity: 0.8;
}



</style>
