<template>
    <v-app-bar
            app
            clipped-left
            color=black
            dense
    >
        <v-app-bar-nav-icon @click.stop="$emit('navdrawer-toggle')" />

        <v-toolbar-title class="mr-12 align-center">
            <span class="title">EISEN | Builder</span>
        </v-toolbar-title>

        <v-spacer />
        <div class="text-center">
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn light v-on="on">
                        {{ eisenVersions[index] }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, idx) in eisenVersions"
                            :key="idx"
                            @click="index = idx"
                    >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-app-bar>
</template>

<script>
    export default {
        name: "TheAppBar",
        data: () => ({
            index: 0,
            eisenVersions: ['v0.0.2', 'v0.0.1']
        })
    }
</script>

<style scoped>

</style>