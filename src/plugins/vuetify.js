import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
            dark: {
                primary: colors.blueGrey.darken2, // #E53935
                secondary: colors.grey.darken1, // #FFCDD2
                accent: colors.indigo.base, // #3F51B5
            },
        },
    },
});
