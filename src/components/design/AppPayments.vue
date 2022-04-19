<template>
    <b-col cols="12" class="bg-semiblue shadow bottom h-100" style="background: #1F3C88; border-radius: 8px;">
        <div class="mt-md-2 d-flex justify-content-between header p-3 align-items-center">
            <div>
                <h4>Credits overview</h4>
            </div>
            <div>
                <font-awesome-icon :icon="['fas', 'times-circle']" size="lg" @click="emitClose" style="cursor: pointer;"/>
            </div>
        </div>
        <b-card class="h-100 bg-semiblue" body-class="bg-semiblue" no-body>
            <b-tabs fill title-item-class="tabClass" content-class="h-100" active-nav-item-class="tabClass" nav-item-class="tabClass">
                <b-tab title="Deposit funds">
                    <b-card-text class="h-100 text-align-left d-block w-100 px-5 py-4">
                        <b-row class="w-100">
                            <h4>Choose amount of $ to deposit</h4>
                        </b-row>
                        <b-row class="w-100 mb-5">
                            <b-form-group class="my-2">
                                <b-input v-model="cash" type="number" min="0" />
                            </b-form-group>
                            <hr class="my-1" />
                            <h4>{{ cash * rate }} credits</h4>
                        </b-row>
                        <b-row class="w-100 ">
                            <stripe-checkout
                                ref="checkoutRef"
                                mode="payment"
                                :pk="publishableKey"
                                @loading="v => loading = v" />
                            <b-button variant="transparent" class="actionButton" @click="submit">Pay now!</b-button>
                        </b-row>
                    </b-card-text>
                </b-tab>
                <b-tab title="Withdraw funds">
                    <b-card-text class="h-100 text-align-left d-block w-100 px-5 py-4">
                        <b-row class="w-100">
                            <h4>Choose amount of credits to withdraw</h4>
                        </b-row>
                        <b-row class="w-100 mb-5">
                            <b-form-group class="my-2">
                                <b-input v-model="cash" type="number" min="0" />
                            </b-form-group>
                            <hr class="my-1" />
                            <h4>{{ cash / rate }} $</h4>
                        </b-row>
                        <b-row class="w-100 ">
                            <stripe-checkout
                                ref="checkoutRef"
                                mode="payment"
                                :pk="publishableKey"
                                @loading="v => loading = v" />
                            <b-button variant="transparent" class="actionButton" @click="submit">Withdraw now!</b-button>
                        </b-row>
                    </b-card-text>
                </b-tab>
                <b-tab title="Credits wallet">
                    <b-card-text class="h-100 text-align-left d-block w-100 px-5 py-4">
                        <b-row class="w-100">
                            <h4>Your wallet</h4>
                        </b-row>
                        <b-row class="w-100 mb-5">
                            <hr class="my-1" />
                            <h4>{{ logged.credits }} credits = {{ logged.credits / rate}}$</h4>
                        </b-row>
                    </b-card-text>
                </b-tab>
            </b-tabs>
        </b-card>
    </b-col>
</template>

<script>
import { StripeCheckout } from '@vue-stripe/vue-stripe';

export default {
	name: 'AppPayments',
    components: {StripeCheckout},
	props: {
		room: {
			type: Object,
			default: null
		}
	},
    data() {
		return {
			deposit: false,
            withdraw: false,
            loading: false,
            rate: 25,
            cash: 0
		};
	},
	computed: {
		gameName() {
            console.log(this.room);
            return null;
		},
        publishableKey() {
            return this.$appConfig?.stripeKey;
        },
        logged() {
            return this.$store.getters['authLogin/token'] ?? null;
        }
	},
    methods: {
        closeBar(bar) {
            if (bar === 'deposit') {
                if (this.deposit) {
                    this.deposit = false
                } else {
                    this.deposit = true;
                }
                this.withdraw = false;
            } else {
                if (this.withdraw) {
                    this.withdraw = false;
                } else {
                    this.withdraw = true;
                }
                this.deposit = false;
            }
        },
        submit () {
            // You will be redirected to Stripe's secure checkout page
            this.$refs.checkoutRef.redirectToCheckout();
        },
        emitClose() {
            this.$emit('closeCreate');
        }
    }
};
</script>

<style>

    .nav-tabs .nav-link:hover {
        opacity: 0.4;
        color: white !important;
    }

    .nav-link.active {
        background-color: rgb(31, 60, 136) !important;
        border-bottom: 0 !important;
    }

    .nav-tabs {
        border-bottom: 0 !important;
    }

    .nav-link {
        color: white !important;
        border-bottom: 1px solid #dee2e6 !important;
        text-decoration: none !important;
    }

    .nav-tabs.nav-link {
        color: white !important;
        border-bottom: 1px solid #dee2e6 !important;
        text-decoration: none !important;
    }
    </style>

<style lang="scss" scoped>

.customHeader {
    text-align: start;
}

.firstInfo {
    font-weight: 600;
}

.tabClass {
    text-decoration: none;
    color: white !important;;
    background-color: rgb(31, 60, 136) !important;
    font-weight: bold;
}

.textBlack {
    color: black;
}

.actionButton {
  background: #4e54c8;
  // border: 2px solid white;
  color: white;

  :hover {
      opacity: 1.8;
  }
}

.text-align-left {
    text-align: left;
}
</style>