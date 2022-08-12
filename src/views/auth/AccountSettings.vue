<template>
    <b-container class="w-50">
      <h1 class="bettorLogo game-header pb-lg-5" style="font-size: 2.5rem;">Account settings</h1>
      <app-loading :loading="isLoading" class="h-100">
      <div v-if="!triggerMobile" class="mobile-card d-flex justify-content-center pb-0" style="height: 50%;">
          <b-card class="custom-card pt-0 bg-semiblue w-100" header-class="border-0" body-class="custom-body p-lg-4">
              <b-card-body class="h-100 overflow-hidden p-lg-5 w-100" style="border-radius: 8px; overflow-y: scroll; background-color: #001E6C;
                box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
                <b-col cols="12" class="h-100" style="display: grid;">
                    <b-row>
                      <b-col cols="12" class="d-flex justify-content-between align-items-center">
                        <h5 class="game-info"><b>Profile picture:</b></h5>
                        <div
                            :class="{'has-file': showRemovedBtn}"
                            class="c-file-input js-file-input shadow bg-white profilePic cursor-pointer"
                            :style="profileUrl === '' ? '' : `background-image: url(${profileUrl})`"
                            @click="openEdit('Profile picture', true)">
                          <label class="c-file-input__label js-file-input__label bg-transparent rounded" for="inputfile">
                            <span v-if="profileUrl === ''" class="text-black-50">{{ theFileName }}</span>
                            <!--<input
                                id="inputfile"
                                type="file" @change="fileChangeHandler"
                                name="attachment" class="c-file-input__field js-file-input__field hoverCol">-->
                          </label>
                          <div v-if="showRemovedBtn" @click.stop="clearFileHandler" class="c-file-input__remove js-file-input__remove">
                            <span class="c-file-input__remove__icon c-icon c-icon--remove-circle"></span>
                          </div>
                        </div>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col cols="12" class="d-flex justify-content-between align-items-center">
                        <h5 class="game-info"><b>Name:</b> {{ logged.name }}</h5>
                        <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Name')" />
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12" class="d-flex justify-content-between align-items-center">
                        <h5 class="game-info"><b>Password:</b> ********</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Password')" />
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12" class="d-flex justify-content-between align-items-center">
                        <h5 class="game-info"><b>Member since:</b> {{ logged.joined }}</h5>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12" class="d-flex justify-content-between align-items-center">
                        <h5 class="game-info"><b>League of Legends account:</b> {{ leagueName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('LoL account')" />
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12" class="d-flex justify-content-between align-items-center">
                        <h5 class="game-info"><b>Steam account:</b> {{ leagueName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('CS:GO account')" />
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12" class="d-flex justify-content-between align-items-center">
                        <h5 class="game-info"><b>Blizzard account:</b> {{ leagueName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Blizzard account')" />
                      </b-col>
                    </b-row>
                </b-col>
              </b-card-body>
          </b-card>
        </div>
        <div v-else class="pl-3 mobile-card mobile-trigger-card d-flex justify-content-center p-1" style="height: 50%;">
          <b-card class="custom-card pt-0 bg-semiblue w-100" header-class="border-0" body-class="custom-body p-2 p-lg-5">
            <b-card-body class="h-100 overflow-hidden p-lg-5 w-100" style="border-radius: 8px; overflow-y: scroll; background-color: #001E6C;
                box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;">
              <b-col cols="12" class="h-100" style="display: grid;">
                <b-row class="header-row">
                  <h5 class="game-info"><b>Profile picture:</b></h5>
                </b-row>
                <b-row  class="d-flex justify-content-center align-items-center">
                    <div
                        :class="{'has-file': showRemovedBtn}"
                        class="c-file-input js-file-input shadow bg-white profilePic cursor-pointer"
                        :style="profileUrl === '' ? '' : `background-image: url(${profileUrl})`"
                        @click="openEdit('Profile picture', true)">
                      <label v-if="profileUrl === ''" class="c-file-input__label js-file-input__label bg-transparent rounded" for="inputfile">
                        <span class="text-black-50">{{ theFileName }}</span>
                        <!--<input
                            id="inputfile"
                            type="file" @change="fileChangeHandler"
                            name="attachment" class="c-file-input__field js-file-input__field hoverCol">-->
                      </label>
                      <div v-if="showRemovedBtn" @click.stop="clearFileHandler" class="c-file-input__remove js-file-input__remove">
                        <span class="c-file-input__remove__icon c-icon c-icon--remove-circle"></span>
                      </div>
                    </div>
                </b-row>
                <b-row class="header-row">
                  <h5 class="game-info"><b>Name:</b></h5>
                </b-row>
                <b-row>
                  <b-col cols="12" class="d-flex justify-content-between align-items-center">
                    {{ logged.name }}<font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Name')" />
                  </b-col>
                </b-row>
                <b-row class="header-row">
                  <h5 class="game-info"><b>Password:</b></h5>
                </b-row>
                <b-row class="">
                  <b-col cols="12" class="d-flex justify-content-between align-items-center">
                    ********<font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Password')" />
                  </b-col>
                </b-row>
                <b-row class="header-row">
                  <h5 class="game-info"><b>Member since:</b></h5>
                </b-row>
                <b-row class="">
                  <b-col cols="12" class="d-flex justify-content-between align-items-center">
                    <h5 class="game-info">{{ logged.joined }}</h5>
                  </b-col>
                </b-row>
                <b-row class="header-row">
                  <h5 class="game-info"><b>League of Legends account:</b></h5>
                </b-row>
                <b-row class="">
                  <b-col cols="12" class="d-flex justify-content-between align-items-center">
                    <h5 class="game-info">{{ leagueName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('LoL account')" />
                  </b-col>
                </b-row>
                <b-row class="header-row">
                  <h5 class="game-info"><b>Steam account:</b></h5>
                </b-row>
                <b-row class="">
                  <b-col cols="12" class="d-flex justify-content-between align-items-center">
                    <h5 class="game-info">{{ steamName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('CS:GO account')" />
                  </b-col>
                </b-row>
                <b-row class="header-row">
                  <h5 class="game-info"><b>Blizzard account:</b></h5>
                </b-row>
                <b-row class="">
                  <b-col cols="12" class="d-flex justify-content-between align-items-center">
                    <h5 class="game-info">{{ blizzardName }}</h5> <font-awesome-icon :icon="['fas', 'edit']" size="lg" class="mr-3 cursor-pointer" @click="openEdit('Blizzard account')" />
                  </b-col>
                </b-row>
              </b-col>
            </b-card-body>
          </b-card>
        </div>
      </app-loading>
        <b-modal centered v-show="isEdit" id="modal-1" class="p-0 text-white w-50" hide-footer hide-header>
                <b-row v-if="isEdit" class="row d-flex accountEdit game-info text-white justify-content-center w-100 m-0">
                    <b-col
                        class="rounded p-4 w-100"
                        style="box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset; background: #4e54c8;">
                        <div class="d-flex justify-content-end pb-2">
                            <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" style="cursor: pointer;" class="mb-2" @click="closeModal()" />
                        </div>
                        <div v-if="isFile">
                          <b-form-group :label="`${prependText}`" class="w-100">
                            <b-form-input type="text" v-model="profilePicUrl" :placeholder="accSettingsMenu[prependText]" class="w-100">
                            </b-form-input>
                            <!--<b-form-file
                                v-model="file"
                                :state="Boolean(file)"
                                placeholder="Choose a file or drop it here..."
                                drop-placeholder="Drop file here..."
                                accept="image/jpeg, image/png">
                            </b-form-file>-->
                          </b-form-group>
                          <b-button-group class="w-100 mt-2">
                            <b-button class="mt-3 differButton" variant="transparent" @click="updateAccount" :disabled="profilePicUrl === ''">Submit</b-button>
                          </b-button-group>
                        </div>
                        <div v-else>
                           <div class="d-flex mb-3 mr-3 align-items-center justify-content-center">
                            <!-- <div class="d-flex align-items-center justify-content-center"><h6 class="m-0 p-2 game-info"><b>{{ prependText }}</b></h6></div> -->
                            <b-form-group :label="`${prependText}`" class="w-100">
                                <b-form-input type="text" v-model="lolName" :placeholder="accSettingsMenu[prependText]" class="w-100">
                                </b-form-input>
                            </b-form-group>
                          </div>
                          <div v-if="prependText === 'Name' || prependText === 'Password'" class="d-flex mb-0 mb-lg-3 mr-3 align-items-center justify-content-center">
                            <!-- <div class="d-flex align-items-center justify-content-center"><h6  class="m-0 p-2 game-info"><b>{{ `Confirm ${prependText}` }}</b></h6></div> -->
                            <b-form-group :label="`Confirm ${prependText}`" class="w-100">
                                <b-form-input type="text" class="w-100">
                                </b-form-input>
                            </b-form-group>
                          </div>
                          <b-button-group class="w-100 mt-2">
                            <b-button class="mt-3 differButton" variant="transparent" @click="updateAccount">Submit</b-button>
                          </b-button-group>
                      </div>
                    </b-col>
                </b-row>
        </b-modal>
    </b-container>
</template>

<script>
import AppLoading from "@/components/design/AppLoading";
export default {
    name: 'AccountSettings',
  components: {AppLoading},
  data() {
        return {
            isLoading: false,
            labelPlaceholder: '72x72',
            value: '',
            files: [],
            prependText: '',
            windowWidth: 0,
            triggerMobile: false,
            lolName: '',
            csName: '',
            dotaName: '',
            file: null,
            profilePicUrl: '',
            isFile: false,
            user: null,
            showRemovedBtn: false,
            isEdit: false,
            accSettingsMenu: {}
        };
    },
    computed: {
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        },
        profileUrl() {
          return this.logged?.profile ?? '';
        },
        leagueName() {
            return this.user?.lol_name ?? '';
        },
        steamName() {
        return this.user?.cs_name ?? '';
        },
        valveName() {
          return this.user?.dota_name ?? '';
        },
        blizzardName() {
          return this.user?.dota_name ?? '';
        },
        theFileName() {
            if ((this.files.length > 0) && 'name' in this.files[0]) {
                return this.files[0].name;
            }
            return this.labelPlaceholder;
        }
    },
    watch: {
      windowWidth: {
        immediate: true,
        handler(val) {
          if (val < 767) {
            this.triggerMobile = true;
          } else {
            this.triggerMobile = false;
          }
        }
      },
    },
    created() {
      window.addEventListener('resize', this.onResize);
      this.onResize();
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize);
    },
    mounted() {
        window.addEventListener('resize', this.onResize);
        this.onResize();
        this.getUser();
        if (this.windowWidth < 767) {
          this.triggerMobile = true;
        }
        this.profilePicUrl = this.profileUrl;
        this.accSettingsMenu['Name'] = this.logged.name;
        this.accSettingsMenu['Blizzard'] = this.blizzardName;
        this.accSettingsMenu['Lol account'] = this.leagueName;
        this.accSettingsMenu['CS:GO account'] = this.csName;
    },
    methods: {
      getUser() {
        this.isLoading = true;
        return this.$axios.get(`https://bettor-be.onrender.com/user/${this.logged.id}`)
            .then(({data}) => {
              this.isLoading = false;
              this.user = this._.cloneDeep(data);
              console.log(data)
            })
            .catch((response) => {
              this.isLoading = false;
              console.log(response);
            });
      },
      uploadFile() {
        console.log(this.file);
        if (this.file) {
          let formData = new FormData();
          formData.append('file', this.file);
          console.log(formData.get('file'));
          return this.$axios.post(
              `http://localhost:5000/file/upload-file`,
              {
                file: formData.get('file')
              })
              .then(({data}) => {
                console.log(data);
                this.isEdit = false;
                this.isFile = false;
                this.$bvModal.hide('modal-1');
              })
              .catch(({response}) => {
                console.error(response);
              });
        }
      },
      updateAccount() {
          return this.$axios.put(
          `http://localhost:5000/user/${this.logged.id}`,
              {
                  email: this.logged.name,
                  lol_name: this.lolName,
                  credits: this.logged.credits,
                  cs_name: this.leagueName,
                  dota_name: this.leagueName,
                  joined: this.logged.joined,
                  profile: this.profilePicUrl
              })
              .then(({data}) => {
                  console.log(data);
                  this.isEdit = false;
                  this.user = data;
                  this.$bvModal.hide('modal-1');
              })
              .catch(({response}) => {
                  console.error(response);
              });
      },
      onResize() {
        this.windowWidth = window.innerWidth;
      },
      closeModal() {
        this.isEdit = false;
        this.isFile = false;
        this.$bvModal.hide('modal-1');
      },
      onImageChange() {
        let file = this.files[0]

        if (file == '')
              return;

         this.createImage(file);
     },
     createImage(file) {
         let reader = new FileReader();
         let el = this
         reader.onload = (e) => {
              el.form.photo = e.target.files[0];
         };
         reader.readAsDataURL(file);
     },
      fileChangeHandler(e) {
          this.files = Array.from(e.target.files);
          this.showRemovedBtn = true;
      },
      openEdit(val, file=false) {
          this.$bvModal.show('modal-1');
          this.prependText = val;
          if (file) {
            this.isFile = true;
          }
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

.header-row {
  margin-bottom: 2px;
  border: 1px solid #4e54c8;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 30px;
}


.mobile-card {
  display: flex;
  place-content: center;
  overflow: hidden;
  height: 100%;
  padding-bottom: 10px;
  min-height: 790px;
}

.mobile-trigger-card {
  min-height: 400px !important;
  height: 100% !important;
}


.game-info {
  margin-top: 0;
}

@media screen and (max-width: 767px) {
    .margin-container {
        padding-left: 40px !important;
        margin-right: 0px !important;
    }   

    .game-info {
        font-size: 14px !important;
    }

    .profilePic {
        height: 72px;
        width: 72px;
    }
}

.slide-side-leave-to {
    transform: translateX(-10px);
    opacity: 0;
}

.profilePic {
    height: 72px;
    width: 72px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid #919394;
    background-size: contain;
}

.hoverCol {
    :hover {
        cursor: pointer;
        opacity: 0.8;
        background-color:#999;
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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
  width: 100%;
  cursor: pointer;
  height: 100%;
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