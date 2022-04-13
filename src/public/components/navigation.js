'use strict'

// componente home
let navigation = Vue.component('navigation', {

    data: function() {
        return {
        }
    },

    methods: {


        toHome: function() { this.$router.push('/'); },

        toSold: function() { this.$router.push('/sold'); },

    },


	template: `
    <v-navigation-drawer 
        width="60"
        app 
        permanent
        expand-on-hover
        color="#263043"
    >

    <v-list class="mt-4" nav>

    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">

        <v-list-item 
            link
            v-bind="attrs"
            v-on="on"
        >
            <v-list-item-icon @click="toHome">
                <v-icon color="white">mdi-dump-truck</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
            <v-list-item-title class="text-body-1" style="color: white;">Dashboard</v-list-item-title>
        </v-list-item-content>
    </v-list-item>

      </template>
      <span>Maquinaria</span>
    </v-tooltip>


    <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">

      <v-list-item 
          link
          v-bind="attrs"
          v-on="on"
      >
          <v-list-item-icon @click="toSold">
              <v-icon color="white">mdi-cash-check</v-icon>
          </v-list-item-icon>

          <v-list-item-content >
          <v-list-item-title class="text-body-1" style="color: white;">Dashboard</v-list-item-title>
      </v-list-item-content>
  </v-list-item>

    </template>
    <span>Maquinaria Vendida</span>
  </v-tooltip>



    </v-list>

  </v-navigation-drawer>

  `
});

export default navigation;
