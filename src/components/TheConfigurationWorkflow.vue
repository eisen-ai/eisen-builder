<template>
    <v-tabs @change="changeTab($event)" v-model="currentTask" background-color="rgba(255, 255, 255, 0.7)">

        <v-tab v-for="(task, i) in tasks" :key="i"> {{task.name}} </v-tab>

        <v-tab-item v-for="(task, i) in tasks" :key="i">

            <div v-for="(phase, j) in task.phases" :key="j">

                <v-stepper v-model="step" vertical non-linear>
                    <v-stepper-step :step="j" editable>
                        Select {{phase}}
                        <small>Drag&Drop {{phase}} components from the side bar</small>
                    </v-stepper-step>

                    <v-stepper-content :step="j">

                        <v-container fluid >
                            <v-expansion-panels>
                                <draggable
                                        v-model="currItems"
                                        :group="{pull: 'move', put: true}"
                                        :disabled="currItems.length >= task.max_components[j]"
                                        :sort="false"
                                >

                                    <v-expansion-panel
                                            v-for="(item, k) in currItems"
                                            :key="k"
                                    >
                                        <v-expansion-panel-header>
                                            {{ item.type.split('.')[item.type.split('.').length-1] }}
                                        </v-expansion-panel-header>

                                        <v-expansion-panel-content>
                                            <v-row>
                                                <v-col cols="11">
                                                    <div v-for="(param, p) in item.params" :key="p">
                                                        <v-overflow-btn
                                                                v-if="Array.isArray(param.value)"
                                                                :label="param.name"
                                                                :items="param.value"
                                                                v-model="param.actualValue"
                                                                @change="$emit('config-updated', items)"
                                                        ></v-overflow-btn>

                                                        <v-checkbox
                                                                v-else-if="param.type === 'bool'"
                                                                v-model="param.actualValue"
                                                                :label="param.name + ' (select True/False)'"
                                                                :false-value="param.value === 'false'"
                                                                :true-value="param.value === 'true'"
                                                        ></v-checkbox>

                                                        <v-text-field
                                                                v-else
                                                                :label="'Parameter ' + param.name"
                                                                :placeholder="param.type"
                                                                v-model="param.actualValue"
                                                                outlined
                                                                @change="$emit('config-updated', items)"
                                                        ></v-text-field>

                                                    </div>
                                                </v-col>

                                                <v-col cols="1">
                                                    <v-btn icon @click="removeItem(k)"><v-icon>mdi-delete</v-icon></v-btn>
                                                </v-col>
                                            </v-row>

                                        </v-expansion-panel-content>
                                    </v-expansion-panel>

                                    <v-card outlined min-width="800">
                                        <v-card-text v-if="currItems.length < task.max_components[j]">
                                            <div style="text-align:center;"> Drag&Drop modules from the list on the left </div>
                                        </v-card-text>
                                        <v-card-text v-else>
                                            <div style="text-align:center;"> You have reached the maximum amounts of modules in this section</div>
                                        </v-card-text>
                                    </v-card>

                                </draggable>
                            </v-expansion-panels>

                        </v-container>

                        <v-btn dark @click="goToPrevStep" class="ma-2" v-if="step > 0">Previous</v-btn>

                        <v-btn light @click="goToNextStep" class="ma-2" v-if="step < (task.phases.length - 1)">Next</v-btn>

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
            currentTask: 0,
            items: {},


        }),
        computed: {
            currItems: {
                // getter
                get: function () {
                    return this.items[this.tasks[this.currentTask].name][this.tasks[this.currentTask].phases[this.step]]
                },
                // setter
                set: function (newValue) {
                    this.items[this.tasks[this.currentTask].name][this.tasks[this.currentTask].phases[this.step]].splice(0, this.currItems.length)

                    for (let i = 0; i < newValue.length; i++) {
                        this.items[this.tasks[this.currentTask].name][this.tasks[this.currentTask].phases[this.step]].push(newValue[i]);
                    }
                    this.$forceUpdate()
                }
            }
        },
        watch: {
            step: function () {
                this.$emit('phase-changed', this.tasks[this.currentTask].phases[this.step]);
                this.$emit('config-updated', this.items)
            },
            currentTask: function () {
                this.$emit('task-changed', this.tasks[this.currentTask].name);
                this.$emit('config-updated', this.items)
            }
        },
        methods: {
            // methods managing the view

            changeTab: function () {
                this.step = 0;
                this.$emit('phase-changed', this.tasks[this.currentTask].phases[this.step]);
                this.$emit('config-updated', this.items)
            },

            goToNextStep: function () {
                if(this.step < this.tasks[this.currentTask].phases.length) {
                    this.step = this.step + 1;
                }
                this.$emit('config-updated', this.items)
            },

            goToPrevStep: function () {
                if(this.step !== 0) {
                    this.step = this.step - 1;
                }
                this.$emit('config-updated', this.items)

            },

            removeItem: function (k) {
                this.currItems.splice(k, 1);
                this.$forceUpdate();
                this.$emit('config-updated', this.items)
            }


        },
        beforeMount () {
            for(let i = 0; i < this.tasks.length; i++) {

                this.items[this.tasks[i].name] = {};

                for(let j = 0; j < this.tasks[i].phases.length; j++) {
                    this.items[this.tasks[i].name][this.tasks[i].phases[j]] = [];
                }
            }
        }
    }
</script>

<style scoped>

</style>