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
                        {{ eisenVersionList[index] }}
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item
                            v-for="(item, idx) in eisenVersionList"
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
    export default {
        name: "TheAppBar",
        data: () => ({
            index: 0
        }),
        props: [
            'eisenVersionList'
        ],
        methods: {
            changeVersion (idx) {
                this.index=idx;
                this.$emit('change-version', this.index);
            },
        },
    }
</script>

<style scoped>

</style>