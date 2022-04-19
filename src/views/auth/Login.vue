<template>
    <b-form style="width: 150px;">
        <app-loading :loading="isLoading" :circle="true">
            <b-form-group>
                Name: <b-form-input v-model="name" type="text" />
            </b-form-group>
            <b-form-group class="mt-2">
                Password: <b-form-input v-model="password" type="password" />
            </b-form-group>
            <b-button class="mt-2 w-100 actionButton btn" @click="submit" >Submit</b-button>
        </app-loading>
    </b-form>
</template>

<script>
import {mapActions} from 'vuex';
import AppLoading from '@/components/design/AppLoading';

export default {
    name: 'Login',
    components: { AppLoading },
    data() {
        return {
            name: '',
            password: '',
            isLoading: false
        };
    },
    mounted() {
    },
    methods: {
        ...mapActions('authLogin', ['login']),
        submit() {
            this.isLoading = true;
            this.login({username: this.name, password: this.password}).then(() => {
                this.isLoading = false;
                this.$emit('closeLogin');
            });
        }
    }
}

</script>