<template>
    <div class = "dashboard-container">
        <div class = "dashboard-text">name: {{name}} </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Dashboard',
    computed: {
        ...mapGetters([
        'name'
        ])
    }
}
</script>
<style>
.dashboard-container{
    margin: 30px;
}
.dashboard-text{
    font-size: 30px;
    line-height: 46px;
}
</style>