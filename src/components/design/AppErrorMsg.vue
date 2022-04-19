<template>
    <div class="w-100">
        <small :class="variant ? 'error' : 'success'"></small>
    </div>
</template>

<script>

export default {
    name: 'AppErrorMsg',
    props: {
        text: {
            type: String,
            default: ''
        },
        variant: {
            type: Boolean,
            default: false
        }
    }
}

</script>

<style scoped>

.error {
    color: darkred;
}

.success {
    color: darkgreen;
}

</style>