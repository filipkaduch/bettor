<template>
    <b-container class="margin-container mr-0 ml-xl-0 ml-lg-0">
        <b-col cols="11" lg="9" xl="9">
            <b-row class="pt-3 pt-lg-5">
                <b-col cols="12" md="12" sm="12" lg="6" xl="6" class="d-flex justify-content-center justify-content-lg-start"><h1>Account settings</h1></b-col>
            </b-row>
            <b-row class="mt-1 mt-lg-5 d-flex">
                <b-col cols="12" class="rounded hoverCol mb-2 mb-lg-0 d-flex justify-content-center" md="12" sm="12"  lg="3" xl="3">
                    <div
                        :class="{'has-file': showRemovedBtn}"
                        class="c-file-input js-file-input h-100 shadow bg-white rounded profilePic">
                        <div class="c-file-input__indicator">
                            <span class="c-file-input__indicator__icon c-icon c-icon--attach"></span>
                        </div>
                        <label class="c-file-input__label js-file-input__label bg-transparent rounded" for="inputfile">
                            <span>{{ theFileName }}</span>
                            <input
                                id="inputfile"
                                type="file" @change="fileChangeHandler"
                                name="attachment" class="c-file-input__field js-file-input__field">
                        </label>
                        <div v-if="showRemovedBtn" @click.stop="clearFileHandler" class="c-file-input__remove js-file-input__remove">
                            <span class="c-file-input__remove__icon c-icon c-icon--remove-circle"></span>
                        </div>
                    </div>
                </b-col>
                <b-col cols="12" xl="6" lg="6" md="12" sm="12" class="">
                    <b-row>
                        <b-col cols="12" class="d-flex justify-content-between">
                            <h5 class="game-info"><b>Name:</b> {{ logged.name }}</h5>
                            <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Name')" />
                        </b-col>
                    </b-row>
                    <b-row class="mt-2">
                        <b-col cols="12" class="d-flex justify-content-between">
                            <h5 class="game-info"><b>Password:</b> ********</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Password')" />
                        </b-col>
                    </b-row>
                    <b-row class="mt-2">
                        <b-col cols="12" class="d-flex justify-content-between">
                            <h5 class="game-info"><b>Member since:</b> {{ logged.token_time }}</h5>
                        </b-col>
                    </b-row>
                    <b-row class="mt-2">
                        <b-col cols="12" class="d-flex justify-content-between">
                            <h5 class="game-info"><b>League of Legends account:</b> {{ leagueName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('LoL account')" />
                        </b-col>
                    </b-row>
                    <b-row class="mt-2">
                        <b-col cols="12" class="d-flex justify-content-between">
                            <h5 class="game-info"><b>Steam account:</b> {{ leagueName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('CS:GO account')" />
                        </b-col>
                    </b-row>
                    <b-row class="mt-2">
                        <b-col cols="12" class="d-flex justify-content-between">
                            <h5 class="game-info"><b>Blizzard account:</b> {{ leagueName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Blizzard account')" />
                        </b-col>
                    </b-row>
                </b-col>
            </b-row>
            <!--<transition name="slide-side">
                <b-row v-if="isEdit" class="mt-3 d-flex mx-1 accountEdit game-info">
                    <b-col
                        cols="12"
                        lg="9"
                        xl="9"
                        class="rounded p-2 p-lg-3"
                        style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset; background: #4e54c8;">
                        <div class="d-flex justify-content-end pb-2">
                            <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" style="cursor: pointer;" class="mb-2" @click="isEdit = false" />
                        </div>
                        <div class="d-flex mb-3 mr-3 align-items-center justify-content-between">
                            <div class="d-flex align-items-center justify-content-center" style="width: 20%;"><h6 class="m-0 game-info"><b>{{ prependText }}</b></h6></div>
                            <b-form-input type="text" v-model="lolName" :placeholder="accSettingsMenu[prependText]" class="w-75">
                            </b-form-input>
                        </div>
                        <div v-if="prependText === 'Name' || prependText === 'Password'" class="d-flex mb-0 mb-lg-3 mr-3 align-items-center justify-content-between">
                            <div class="d-flex align-items-center justify-content-center" style="width: 20%;"><h6  class="m-0"><b>{{ `Confirm ${prependText}` }}</b></h6></div>
                            <b-form-input type="text" class="w-75">
                            </b-form-input>
                        </div>
                        <b-button-group class="w-50">
                            <b-button class="mt-3 differButton" variant="transparent" @click="updateAccount">Submit</b-button>
                        </b-button-group>
                    </b-col>
                </b-row>
            </transition>-->
        </b-col>
        <b-modal centered v-show="isEdit" id="modal-1" class="p-0 text-white" hide-footer hide-header>
                <b-row v-if="isEdit" class="d-flex accountEdit game-info text-white justify-content-center">
                    <b-col
                        cols="12"
                        lg="9"
                        xl="9"
                        class="rounded p-2 p-lg-3"
                        style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset; background: #4e54c8;">
                        <div class="d-flex justify-content-end pb-2">
                            <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" style="cursor: pointer;" class="mb-2" @click="closeModal()" />
                        </div>
                        <div class="d-flex mb-3 mr-3 align-items-center justify-content-center">
                            <div class="d-flex align-items-center justify-content-center" style="width: 20%;"><h6 class="m-0 game-info"><b>{{ prependText }}</b></h6></div>
                            <b-form-input type="text" v-model="lolName" :placeholder="accSettingsMenu[prependText]" class="w-75">
                            </b-form-input>
                        </div>
                        <div v-if="prependText === 'Name' || prependText === 'Password'" class="d-flex mb-0 mb-lg-3 mr-3 align-items-center justify-content-center">
                            <div class="d-flex align-items-center justify-content-center" style="width: 20%;"><h6  class="m-0 game-info"><b>{{ `Confirm ${prependText}` }}</b></h6></div>
                            <b-form-input type="text" class="w-75">
                            </b-form-input>
                        </div>
                        <b-button-group class="w-100 mt-2">
                            <b-button class="mt-3 differButton" variant="transparent" @click="updateAccount">Submit</b-button>
                        </b-button-group>
                    </b-col>
                </b-row>
        </b-modal>
    </b-container>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AccountSettings',
    data() {
        return {
            isLoading: false,
            labelPlaceholder: 'Profile picture 225x250',
            value: '',
            files: [],
            prependText: '',
            lolName: '',
            showRemovedBtn: false,
            isEdit: false,
            accSettingsMenu: {}
        };
    },
    computed: {
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        },
        leagueName() {
            return this.$store.getters['authLogin/token']?.lol_name ?? '';
        },
        theFileName() {
            if ((this.files.length > 0) && 'name' in this.files[0]) {
                return this.files[0].name;
            }
            return this.labelPlaceholder;
        }
    },
    mounted() {
        this.accSettingsMenu['Name'] = this.logged.name;
        this.accSettingsMenu['Blizzard'] = this.leagueName;
        this.accSettingsMenu['Lol account'] = this.leagueName;
        this.accSettingsMenu['CS:GO account'] = this.leagueName;
    },
    methods: {
        updateAccount() {
            return axios.post(
            `https://e-bettor.herokuapp.com/update_account?user=${this.logged.id}`,
                { headers: {
                    'Content-type':'application/json'
                }, data: {
                    email: this.logged.name,
                    username: this.logged.name,
                    lol_name: this.lolName
                }})
                .then(({data}) => {
                    console.log(data);
                    this.isEdit = false;
                    this.$bvModal.hide('modal-1');
                })
                .catch(({response}) => {
                    console.error(response);
                });
        },
        closeModal() {
            this.isEdit = false
            this.$bvModal.hide('modal-1');
        },
        fileChangeHandler(e) {
            this.files = Array.from(e.target.files);
            this.showRemovedBtn = true;
        },
        openEdit(val) {
            this.$bvModal.show('modal-1');
            this.prependText = val;
            this.isEdit = true;
        },
        clearFileHandler() {
            const el = this.$el.querySelector('.js-file-input__field');
            const wrapper = document.createElement('form');
            this.wrapInputAndReset(el, wrapper);
        },
        wrapInputAndReset(el, wrapper) {
            // wrap input with form tag
            el.parentNode.insertBefore(wrapper, el);
            wrapper.appendChild(el);

            // reset input with form.reset()
            wrapper.reset();

            // place childNodes in document fragment
            const docFrag = document.createDocumentFragment();
            while (wrapper.firstChild) {
                const child = wrapper.removeChild(wrapper.firstChild);
                docFrag.appendChild(child);
            }

            // replace wrapper with document fragment
            wrapper.parentNode.replaceChild(docFrag, wrapper);

            this.files = [];
            this.showRemovedBtn = false;
        }
    }
}

</script>

<style lang="scss" scoped>

.slide-side-enter-active {
  transition: all .3s ease;
}
.slide-side-leave-active {
  transition: all .3s ease;
}
.slide-side-enter
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  width: 100%;
  opacity: 0;
}

.game-info {
    margin-top: 0;
}

@media screen and (max-width: 767px) {
    .margin-container {
        margin-left: 30px !important;
        margin-right: 0px !important;
    }   

    .game-info {
        font-size: 14px !important;
    }

    .profilePic {
        height: 150px !important;
        width: 130px !important;
    }
}

.slide-side-leave-to {
    transform: translateX(-10px);
    opacity: 0;
}

.profilePic {
    height: 250px;
    width: 225px;
}

.hoverCol {
    :hover {
        cursor: pointer;
        opacity: 0.8;
    }
}


.o-container {
  padding-top: 40px;
  padding-bottom: 40px;
}

.c-field__error {
  font-size: 12px;
  color: #d71149;
}

.c-file-input {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #fff;
}

/* line 24, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input:invalid,
.c-field--error .c-file-input {
  background-color: #ffe6e9;
  border-color: #ff566a;
}

/* line 28, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input:invalid:focus,
.c-field--error .c-file-input:focus {
  background-color: #ffe6e9;
  border-color: #ff566a;
}

/* line 34, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input__label {
  position: absolute;
  border: 2px solid #919394;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-left: 36px;
  padding-right: 36px;
  line-height: 36px;
  color: #999;
  font-size: 12px;
  overflow: hidden;
  word-wrap: break-word;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* line 50, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input__field {
  position: absolute !important;
  height: 1px !important;
  width: 1px !important;
  padding: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  z-index: -1;
}

/* line 59, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input__field:focus {
  outline: none;
}

/* line 64, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input__indicator {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 36px;
  z-index: 2;
}

/* line 73, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input__indicator__icon {
  color: #bbb;
  position: absolute;
  top: 50%;
  -webkit-transform: translate(0, -50%);
      -ms-transform: translate(0, -50%);
       -o-transform: translate(0, -50%);
          transform: translate(0, -50%);
  left: 4px;
  font-size: 20px;
}

/* line 81, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.has-file .c-file-input__indicator__icon {
  color: #d71149;
}

/* line 86, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input__remove {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 36px;
  z-index: 2;
}

.has-file > .c-file-input__remove {
  display: block;
}

/* line 100, app/assets/stylesheets/mweb/6-components/_components.file-input.scss */
.c-file-input__remove__icon {
  position: absolute;
  top: 50%;
  -webkit-transform: translate(0, -50%);
      -ms-transform: translate(0, -50%);
       -o-transform: translate(0, -50%);
          transform: translate(0, -50%);
  left: 4px;
  font-size: 20px;
  color: #ff566a;
}

.dashedBorder {
    border: 3px dashed white;
}

</style>