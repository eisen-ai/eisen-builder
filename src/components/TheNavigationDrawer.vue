<template>
    <v-navigation-drawer
            v-model="drawer"
            clipped
            app
            color="rgba(255, 255, 255, 0.7)"
            stateless
    >
        <v-list dense>
            <v-subheader class="text--lighten-1"> Modules implementing {{ currentPhase }} </v-subheader>

            <draggable
                    v-model="itemsToDisplay"
                    :group="{pull: 'clone', put: false }"
                    :clone="handleClone"
                    ghost-class="ghost"
                    :sort="true"
            >

                    <v-list-item
                            v-for="item in itemsToDisplay"
                            :key="item.type"
                            link
                    >
                        <v-list-item-content>
                            <v-card outlined color="black">
                                <v-card-text style="color: white">{{ item.type.split('.')[item.type.split('.').length-1] }}</v-card-text>
                            </v-card>
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
        }),
        methods: {
            handleClone (item) {
                // Create a fresh copy of item
                let cloneMe = JSON.parse(JSON.stringify(item));

                this.$delete(cloneMe, 'uid');

                return cloneMe;
            },
        },
        computed: {
            itemsToDisplay: function () {
                if (this.eisenModules === undefined) {
                    return [{type: 'Nothing to Display'}]
                } else {
                    return this.eisenModules[this.currentPhase.toLowerCase()]
                }
            }
        }
    }
</script>

<style scoped>

</style>