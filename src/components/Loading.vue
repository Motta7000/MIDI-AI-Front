<script setup>
const { white } = defineProps(['white'])
console.log(white)
</script>

<template>
    <div class="flex-item flex-loading pt-2">
        <h5 v-if="white == false" class="mb-1 cargando-text"><i>Cargando...</i></h5>
        <h5 v-if="white == true" class="mb-1 cargando-text" style="color:#fff"><i>Cargando...</i></h5>
        <h5 v-if="white == null"></h5>
        <Icon height="30" width="30" icon="subway:missing" />
        <div class="loader-container pb-4 pt-4">
            <div class="loader"></div>
        </div>
    </div>
</template>

<style scoped>
@keyframes fade {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

icon {
    margin-top: 0;
    padding-top: 0;
}

.loader-container {
    display: flex;
    justify-content: center;
}

.flex-loading {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    display: flex;
    height: 300px;
}

.loader {
    border: 16px solid #f3f3f3;
    /* Light grey */
    border-top: 16px solid #3498db;
    /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.cargando-text {
    text-align: center;
    margin: 0;
    animation: fade 1s infinite;
    font-size: large;
    /* Apply the fade animation */
}
</style>