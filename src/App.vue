<template>
  <v-app id="inspire" style=" background: rgba(0,0,0,0);">
    <v-overlay
            :absolute="absolute"
            :opacity=1
            :value="window.width < 1200 & window.height < 480"
    >
      <v-card>
        <v-card-text>
          <p>The resolution of your screen is too low and Eisen | Builder cannot be correctly visualized.</p>
          <p>The minimum resolution is 480 x 1200 pixels. Your browser is currently displaying {{window.height}} x {{window.width}} pixels.</p>
          <p>Please resize your browser window or try again from a device with higher screen resolution.</p>
        </v-card-text>
      </v-card>
    </v-overlay>

    <the-navigation-drawer
            :drawer="drawer && eisenModules !== undefined"
            :eisen-version="eisenVersionList[eisenVersionIdx]"
            :eisen-modules="eisenModules"

            :current-phase="currentPhase"
            :current-task="currentTask"
    ></the-navigation-drawer>

    <the-app-bar
            :eisen-version-list="eisenVersionList"
            v-on:navdrawer-toggle="drawer = !drawer"
            v-on:get-config="generateConfigJson()"
            v-on:change-version="changeEisenVersion($event)"
    ></the-app-bar>

    <v-content v-if="eisenModules !== undefined">
      <the-configuration-workflow
              :tasks="tasks"

              v-on:task-changed="currentTask = $event"
              v-on:phase-changed="currentPhase = $event"
              v-on:config-updated="currentConfig = $event"
      ></the-configuration-workflow>
    </v-content>

    <v-content v-else>
      <div style="text-align:center;">
        <v-card>
          <v-card-text>
            Loading content ...
          </v-card-text>
        </v-card>
      </div>
    </v-content>
  </v-app>
</template>

<script>
  import TheNavigationDrawer from './components/TheNavigationDrawer'
  import TheAppBar from './components/TheAppBar'
  import TheConfigurationWorkflow from './components/TheConfigurationWorkflow'

  import $ from 'jquery'

  let MAX_COMPONENTS = 1000;

  function parseData(structure) {
    let finalValue = undefined;

    if (structure.actualValue === undefined) {
      finalValue = structure.value
    } else {
      finalValue = structure.actualValue
    }

    if (structure.type.includes('list')) {
      finalValue = finalValue.toString().replace(/'/g, '"');
      finalValue = finalValue.toString().replace(/ /g, "");

      if (finalValue === "") {
        finalValue = []
      }
      else {
        finalValue = JSON.parse(finalValue)
      }
    }

    else if (structure.type === 'bool') {
      finalValue = (finalValue === 'true')
    }

    else if (structure.type === 'float') {
      finalValue = parseFloat(finalValue)
    }

    else if (structure.type === 'int') {
      finalValue = parseInt(finalValue)
    }

    return finalValue

  }


  function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }


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
      eisenVersionIdx: 0,
      eisenVersionList: [''],

      window: {
        width: 0,
        height: 0
      },

      drawer: true,

      eisenModules: undefined,

      currentTask: 'General',
      currentPhase: 'Hyperparameters',

      tasks: [
        {
          name: 'General',
          phases: ['Hyperparameters', 'Models'],
          max_components: [MAX_COMPONENTS, 1]
        },
        {
          name: 'Training',
          phases: ['Datasets', 'Readers', 'Transforms', 'Losses', 'Metrics', 'Optimizer', 'Workflow', 'Hooks'],
          max_components: [1, MAX_COMPONENTS, MAX_COMPONENTS, MAX_COMPONENTS, MAX_COMPONENTS, 1, 1, MAX_COMPONENTS]
        },
        {
          name: 'Validation',
          phases: ['Datasets', 'Readers', 'Transforms', 'Metrics', 'Workflow', 'Hooks'],
          max_components: [1, MAX_COMPONENTS, MAX_COMPONENTS, MAX_COMPONENTS, 1, MAX_COMPONENTS]
        },
        {
          name: 'Testing',
          phases: ['Datasets', 'Readers', 'Transforms', 'Metrics', 'Workflow', 'Hooks'],
          max_components: [1, MAX_COMPONENTS, MAX_COMPONENTS, MAX_COMPONENTS, 1, MAX_COMPONENTS]
        },
        {
          name: 'Serving',
          phases: ['Readers', 'Transforms', 'Workflow'],
          max_components: [MAX_COMPONENTS, MAX_COMPONENTS, 1]
        },
      ],

      currentConfig: undefined,

    }),
    created () {
      this.$vuetify.theme.dark = false;

      this.getEisenVersions();

      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      // methods managing the view
      getEisenModules: function () {
        this.eisenModules = undefined;

        console.log('http://builder.eisen.ai/json/eisen_modules_' + this.eisenVersionList[this.eisenVersionIdx] + '.json');

        $.getJSON('http://builder.eisen.ai/json/eisen_modules_' + this.eisenVersionList[this.eisenVersionIdx] + '.json', (data) => {
          this.eisenModules = data
        });
      },

      getEisenVersions: function () {
        this.eisenVersionList = [];

        $.getJSON('http://builder.eisen.ai/json/versions.json', (data) => {
          this.eisenVersionList = data;

          this.getEisenModules()
        });
      },

      generateConfigJson: function () {
        let config = {};

        for (let key in this.currentConfig) {
          let sectionContent = {};
          let isEmpty = true;

          for (let cnt in this.currentConfig[key]) {

            sectionContent[cnt] = [];

            for (let i = 0; i < this.currentConfig[key][cnt].length; i++) {

              isEmpty = false;

              let element = {
                'type': this.currentConfig[key][cnt][i].type,
                'params': {},
              };

              for (let j = 0; j < this.currentConfig[key][cnt][i].params.length; j++) {
                let finalValue = undefined;

                finalValue = parseData(this.currentConfig[key][cnt][i].params[j]);

                element.params[this.currentConfig[key][cnt][i].params[j].name] = finalValue
              }

              sectionContent[cnt].push(element)
            }
          }

          if (isEmpty === false) {
            config[key] = sectionContent
          }

        }

        console.log(config);

        var str = JSON.stringify(config, null, 2);

        download('configuration.json', str)
      },

      changeEisenVersion: function (version) {
        this.eisenVersionIdx = version;

        this.currentTask = 'General';
        this.currentPhase = 'Hyperparameters';

        this.getEisenModules();

        console.log('changed eisen version to ' + version)
      },

      handleResize() {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
      }
    }
  }
</script>


<style>
</style>