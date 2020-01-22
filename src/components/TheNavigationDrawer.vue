<template>
    <v-navigation-drawer
            v-model="drawer"
            clipped
            app
            color=grey.darken-1
            stateless
    >
        <v-list dense>
            <v-subheader class="mt-4 grey--text text--darken-1"> Modules for {{ currentPhase }}</v-subheader>

            <draggable
                    v-model="itemsToDisplay"
                    :group="{pull: 'clone', put: false }"
                    ghost-class="ghost"
                    :sort="true"
            >

                    <v-list-item
                            v-for="item in itemsToDisplay"
                            :key="item.type"
                            link
                    >


                        <v-list-item-action>
                            <v-icon></v-icon>
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ item.type.split('.')[item.type.split('.').length-1] }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>

            </draggable>

        </v-list>
    </v-navigation-drawer>

</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: "TheNavigationDrawer",
        props: [
            'drawer',

            'eisenVersion',
            'eisenModules',

            'currentPhase',
            'currentTask',
        ],
        components: {
            draggable,
        },
        data: () => ({
            items: [
                { icon: 'trending_up', text: 'Most Popular' },
                { icon: 'subscriptions', text: 'Subscriptions' },
                { icon: 'history', text: 'History' },
                { icon: 'featured_play_list', text: 'Playlists' },
                { icon: 'watch_later', text: 'Watch Later' },
            ],
            items2: [
                { picture: 28, text: 'Joseph' },
                { picture: 38, text: 'Apple' },
                { picture: 48, text: 'Xbox Ahoy' },
                { picture: 58, text: 'Nokia' },
                { picture: 78, text: 'MKBHD' },
            ],
        }),
        computed: {
            // a computed getter

            itemsToDisplay: function () {
                // `this` points to the vm instance
                return this.eisenModules[this.currentPhase.toLowerCase()]
            }
        }
    }
</script>

<style scoped>

</style>