<template>
  <v-app id="inspire">

    <the-navigation-drawer
            :drawer="drawer"
            :eisen-version="eisenVersion"
            :eisen-modules="eisenModules"

            :current-phase="currentPhase"
            :current-task="currentTask"
    ></the-navigation-drawer>

    <the-app-bar
            v-on:navdrawer-toggle="drawer = !drawer"
    ></the-app-bar>

    <v-content>
      <the-configuration-workflow
              :tasks="tasks"

              v-on:task-changed="currentTask = $event"
              v-on:phase-changed="currentPhase = $event"
      ></the-configuration-workflow>

    </v-content>

  </v-app>
</template>

<script>
  import TheNavigationDrawer from './components/TheNavigationDrawer'
  import TheAppBar from './components/TheAppBar'
  import TheConfigurationWorkflow from './components/TheConfigurationWorkflow'

  import $ from 'jquery'


  export default {
    props: {
      source: String,
    },

    components: {
      TheAppBar,
      TheNavigationDrawer,
      TheConfigurationWorkflow
    },

    data: () => ({
      eisenVersion: 'v0.0.1',

      drawer: true,

      eisenModules: null,

      tasks: [
        {name: 'General', phases: ['Hyperparameters', 'Models']},
        {name: 'Training', phases: ['Datasets', 'Readers', 'Transforms', 'Losses', 'Metrics', 'Optimizer', 'Workflow', 'Hooks']},
        {name: 'Validation', phases: ['Datasets', 'Readers', 'Transforms', 'Metrics', 'Workflow', 'Hooks']},
        {name: 'Testing', phases: ['Datasets', 'Readers', 'Transforms', 'Metrics', 'Workflow', 'Hooks']},
        {name: 'Serving', phases: ['Readers', 'Transforms', 'Workflow']},
      ],

      currentTask: null,
      currentPhase: null,

    }),
    created () {
      this.$vuetify.theme.dark = true;

      $.getJSON('https://a.uguu.se/ESMejemVZRA8_eisen_modules_' + this.eisenVersion + '.json', (data) => {
        this.eisenModules = data
      });
    },
    methods: {
      // methods managing the view

    }
  }
</script>