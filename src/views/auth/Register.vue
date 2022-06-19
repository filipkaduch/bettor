<template>
	<b-container>
		<b-row class="vh-100">
			<b-col cols="12" class="bg-transparent">
				<b-container style="padding: 12%">
					<b-row>
					</b-row>
					<template v-if="registrationDone">
						<b-row>
							<b-col>
								<b-alert variant="success" show>{{ $t('t_RegisterConfirmationMessage') }}</b-alert>
							</b-col>
						</b-row>
					</template>
					<template v-else>
						<b-row class="py-xl-5 pb-0">
							<b-col cols="12" class="d-flex justify-content-start">
								<h1 class="bettorLogo" style="font-size: 2.5rem;">Register</h1>
							</b-col>
						</b-row>
						<b-row v-if="error">
							<b-col cols="12" lg="10" xl="8">
								<b-alert show variant="warning">
									<strong>{{ error }}</strong>
								</b-alert>
							</b-col>
						</b-row>
						<b-row>
							<b-col cols="12" lg="10" xl="8" class="bg-lightblue p-4 borderRadius action-shadow border-0">
								<b-form @submit.stop.prevent="onSubmit">
									<b-form-group class="mb-3">
										<b-input
											v-model="$v.form.firstName.$model"
											type="text"
											placeholder="User name"
											:state="$v.form.firstName.$dirty ? !$v.form.firstName.$error : null"
											aria-describedby="email-live-feedback"
											autofocus />
										<b-form-invalid-feedback id="email-live-feedback">
											<span v-if="!$v.form.firstName.required">User name is required</span>
										</b-form-invalid-feedback>
									</b-form-group>

									<b-form-group class="mb-3">
										<b-input
											v-model="$v.form.email.$model"
											type="text"
											placeholder="Email"
											:state="$v.form.email.$dirty ? !$v.form.email.$error : null"
											aria-describedby="email-live-feedback" />
										<b-form-invalid-feedback id="email-live-feedback">
											<span v-if="!$v.form.email.required">Email is required</span>
											<span v-if="!$v.form.email.email">Please enter a valid Email address</span>
										</b-form-invalid-feedback>
									</b-form-group>

									<b-form-group class="mb-3">
										<b-input
											v-model="$v.form.password.$model"
											type="password"
											placeholder="Password"
											:state="
												$v.form.password.$dirty ? !$v.form.password.$error : null
											"
											aria-describedby="password-live-feedback" />
										<b-form-invalid-feedback id="password-live-feedback">
											<span v-if="!$v.form.password.required">Password is required</span>
											<span v-if="!$v.form.password.minLength">Password must be at least {{ $v.form.password.$params.minLength.min }} characters long.</span>
										</b-form-invalid-feedback>
									</b-form-group>

									<b-form-group>
										<b-input
											v-model="$v.form.confirmPassword.$model"
											type="password"
											placeholder="Confirm password"
											:state="
												$v.form.confirmPassword.$dirty
													? !$v.form.confirmPassword.$error
													: null
											"
											aria-describedby="confirm-password-live-feedback" />
										<b-form-invalid-feedback id="confirm-password-live-feedback">
											Passwords don't match
										</b-form-invalid-feedback>
									</b-form-group>

									<b-form-group>
										<b-form-checkbox
											id="checkbox-1"
											v-model="$v.form.terms.$model"
											name="checkbox-1"
											class="my-3 mr-2"
											aria-describedby="terms-live-feedback">
											I accept the <router-link target="_blank" to="/terms-and-conditions" class="text-white">terms of use</router-link>
										</b-form-checkbox>

										<b-form-invalid-feedback id="terms-live-feedback">
											You need to accept terms of use
										</b-form-invalid-feedback>
									</b-form-group>

									<app-loading :loading="loading">
										<b-form-group>
											<b-button type="submit" :disabled="$v.form.$invalid" class="lightButton mr-2">
												<font-awesome-icon :icon="['fas', 'user-plus']" />
												Sign up
											</b-button>

											<router-link
												variant="light"
												class="btn ml-3 actionButton"
												:to="{name: 'home'}">
												<font-awesome-icon :icon="['fas', 'angle-left']" />
												Back
											</router-link>
										</b-form-group>
									</app-loading>
								</b-form>
							</b-col>
						</b-row>
					</template>
				</b-container>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
import {email, minLength, required, sameAs} from 'vuelidate/lib/validators';
import {mapActions, mapGetters} from 'vuex';
import AppLoading from '@/components/design/AppLoading';
import {validationMixin} from 'vuelidate';

const isTrue = (value) => value === true;

export default {
	name: 'Register',
	components: {
		AppLoading
	},
	mixins: [validationMixin],
	data() {
		return {
			registrationDone: false,
			form: {
				confirmPassword: null,
				email: null,
				password: null,
				firstName: null,
				terms: null
			}
		};
	},
	validations: {
		form: {
			firstName: {
				required
			},
			email: {
				required,
				email
			},
			password: {
				required,
				minLength: minLength(6)
			},
			confirmPassword: {
				required,
				sameAsPassword: sameAs('password')
			},
			terms: {
				required,
				isTrue
			}
		}
	},
	computed: {
		...mapGetters('authRegister', [
			'error',
			'loading'
		])
	},
	methods: {
		...mapActions('authRegister', ['register']),
		...mapActions('flashMessages', ['addMessage']),
		onSubmit() {
			this.register(this.form)
				.then(() => {
					this.registrationDone = true;
				})
				.catch(() => null);
		}
	}
};
</script>

