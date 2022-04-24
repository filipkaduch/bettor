<template>
    <b-col cols="12" class="shadow bottom h-100" style="background: #1F3C88; border-radius: 8px;">
        <div class="mt-md-2 d-flex justify-content-between header p-3 align-items-center">
            <div>
                <h4>Support center</h4>
            </div>
            <div>
                <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" @click="emitClose" style="cursor: pointer;"/>
            </div>
        </div>
        <div class="w-100 overflow-scroll hide-scrollbar h-100 p-1 mb-5">
            <div class="c">
                <input type="checkbox" id="faq-1">
                <h5 class="game-info"><label for="faq-1">I did not receive my withdrawal</label></h5>
                <div class="p text-align-left">
                    <p>This a very very simple accordion.</p>
                </div>
            </div>
            <div class="c">
                <input type="checkbox" id="faq-2">
                <h5 class="game-info"><label for="faq-2">Deposit did not update my wallet</label></h5>
                <div class="p text-align-left">
                    <p>Yes with pure CSS and HTML.</p>
                </div>
            </div>
            <div class="c">
                <input type="checkbox" id="faq-3">
                <h5 class="game-info"><label for="faq-3">How does room work?</label></h5>
                <div class="p text-align-left">
                    <p>I was inpired by an article on css-tricks. <a href="https://css-tricks.com/the-checkbox-hack/">link to article</a>
                    </p>
                </div>
            </div>
            <div class="c">
                <input type="checkbox" id="faq-4">
                <h5 class="game-info"><label for="faq-4">I can not connect my game account to Bettor</label></h5>
                <div class="p text-align-left">
                    <p>I was inpired by an article on css-tricks. <a href="https://css-tricks.com/the-checkbox-hack/">link to article</a>
                    </p>
                </div>
            </div>
        </div>
    </b-col>
</template>

<script>

export default {
	name: 'AppSupport',
    data() {
		return {
            loading: false
		};
	},
    methods: {
        emitClose() {
            this.$emit('closeCreate');
        }
    }
};
</script>

<style lang="scss" scoped>

div.c{
  position: relative;
  margin:1em;
}
input{
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  opacity:0;
  visibility: 0;
}
h5{
  background:#4e54c8;
  color:white;
  padding:1em;
  border-radius: 4px;
  position: relative;
}

@media screen and (max-width: 767px) {
    h5 {
        font-size: 16px;
    }
}

label::before{
  content: "\276F";
  display: inline-block;
      -webkit-transition: all 0.3s;
    transition: all 0.3s;
    margin-right: 10px;
}
label{
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
}
div.p{
  max-height:0px;
  overflow: hidden;
  border-radius: 4px;
  transition:max-height 0.5s;
  background-color: #4e54c8;
  box-shadow:0 0 10px 0 rgba(0, 0, 0, 0.2);
}
div.p p {
  padding:1em;
}
input:checked ~ h5 label::before{
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
}
input:checked ~ h5 ~ div.p{
  max-height:80px;
}
a{
  color:steelblue;
}

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