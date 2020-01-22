<template>
    <v-tabs @change="changeTab($event)">

        <v-tab v-for="(task, i) in tasks" :key="i" v-model="currentTask"> {{task.name}} </v-tab>

        <v-tab-item v-for="(task, i) in tasks" :key="i">

            <div v-for="(phase, i) in task.phases" :key="i">

                <v-stepper @change="changePhase($event)" v-model="step" vertical non-linear>
                    <v-stepper-step :step="i" editable>
                        Select {{phase}}
                        <small>Drag&Drop {{phase}} components from the side bar</small>
                    </v-stepper-step>

                    <v-stepper-content :step="i">
                        <v-container fluid>
                            <v-expansion-panels light>
                                <draggable
                                        v-model="currItems"
                                        :group="{put: true}"
                                        ghost-class="ghost"
                                        :sort="false"
                                >
                                    <v-expansion-panel
                                            v-for="(item, i) in currItems"
                                            :key="i"
                                    >
                                        <v-expansion-panel-header>
                                            {{ item.type.split('.')[item.type.split('.').length-1] }}
                                        </v-expansion-panel-header>

                                        <v-expansion-panel-content>

                                            <v-row>
                                                <v-col cols="11">
                                                    <v-text-field
                                                            v-for="(param, j) in item.params" :key="j"
                                                            :label="'Parameter ' + param.name"
                                                            :placeholder="param.type"
                                                            outlined
                                                    ></v-text-field>

                                                </v-col>

                                                <v-col cols="1">
                                                    <v-btn icon @click="currItems.splice(i, 1)"><v-icon>mdi-delete</v-icon></v-btn>
                                                </v-col>
                                            </v-row>

                                        </v-expansion-panel-content>
                                    </v-expansion-panel>


                                    <v-card light>
                                        <v-card-text style="align: center">
                                            <v-btn outlined x-large disabled>Drop a Module Here!</v-btn>
                                        </v-card-text>
                                    </v-card>

                                </draggable>
                            </v-expansion-panels>

                        </v-container>

                        <v-btn color="primary" @click="step = i + 1">Next</v-btn>
                    </v-stepper-content>
                </v-stepper>
            </div>

        </v-tab-item>
    </v-tabs>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        name: "TheConfigurationWorkflow",
        props: [
            'tasks',
        ],
        components: {
            draggable,
        },
        data: () => ({
            progress: {},
            step: 0,
            currentTask: null,

            currAddedItems: [],
            currDeletedItems: [],
            currItems: []


        }),
        methods: {
            // methods managing the view

            changeTab: function (event) {
                this.currentTask = event;
                this.step = 0;

                this.$emit('task-changed', this.tasks[this.currentTask].name);
                this.$emit('phase-changed', this.tasks[this.currentTask].phases[this.step]);
            },

            changePhase: function (event) {
                this.$emit('phase-changed', this.tasks[this.currentTask].phases[event]);
            },

            addItemToMainList: function () {
                this.currItems = this.currItems + this.currAddedItems
            },

            deleteItemFromMainList: function () {
                console.log('deleted something')
            }
        },
    }
</script>

<style scoped>

</style>