<template>
    <v-app-bar
            app
            clipped-left
            color="rgba(255, 255, 255, 0.9)"
            dense
    >
        <v-app-bar-nav-icon @click.stop="$emit('navdrawer-toggle')" color="black" />

        <v-toolbar-title class="mr-12 align-center">
            <span class="title">EISEN | Builder</span>
        </v-toolbar-title>

        <v-spacer />
        <div class="text-center">
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn dark v-on="on" class="ma-2">
                        {{ eisenVersions[index] }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, idx) in eisenVersions"
                            :key="idx"
                            @click="changeVersion(idx)"
                    >
                        <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-btn light @click="$emit('get-config')" class="ma-2">
                Get config
            </v-btn>
        </div>
    </v-app-bar>
</template>

<script>
    import $ from 'jquery'

    export default {
        name: "TheAppBar",
        data: () => ({
            index: 0,
            eisenVersions: ['v0.0.2']
        }),
        methods: {
            changeVersion (idx) {
                this.$emit('change-version', this.eisenVersions[idx])
                this.index = idx
            },

            getEisenVersions: function () {
                this.eisenVersions = [];

                $.getJSON('http://builder.eisen.ai/json/versions.json', (data) => {
                    this.eisenVersions = data
                });
            },
        },
        created () {
            this.getEisenVersions();
            this.changeVersion(0);
        },

    }
</script>

<style scoped>

</style>