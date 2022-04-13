'use strict'

import '../utils/autocomplete.js';
import './dialog/details_dialog.js';

// componente clients
let home = Vue.component('sold', {

  data: () => ({
    dialog: false,
    dialogDelete: false,
	dialogDetails: false,
    page: 1,
    pageCount: 0,
    search: "",
    hidden: false,
    headers: [
		{ text: 'ID', value: 'id' },
		{ text: 'Nombre', value: 'name' },
		{ text: 'Serial', value: 'code' },
		{ text: 'Descripcion', value: 'description' },
		{ text: 'Categoria', value: 'category' },
		{ text: 'Fecha de venta', value: 'sale_date' },
		{ text: 'Inversión Total', value: 'total' },
		{ text: 'Acciones', value: 'actions', sortable: false },
    ],
    trucks: [],
	truck_id: null,
    editedIndex: -1,
    editedItem: {},
	menu: false,
  }),


  created: function() { 
	this.initialize();
},

  methods: {
    initialize: async function () {
      this.trucks = await execute('index-trucks-sold',{});

      if(Math.round ( Object.keys(this.trucks).length / 16) >= 1 )
        this.pageCount =  Math.round ( Object.keys(this.trucks).length / 16);
    },


	formatMoney: function(value) {
		let formatter = new Intl.NumberFormat('en-US', {
		  style: 'currency',
		  currency: 'USD',
		});
	  
		return formatter.format(value);
	  },

	openDialog: function(truck){
		this.truck_id = truck.id;
		this.dialogDetails = true;
	},

	closeDialog: function() {
		this.dialogDetails = false;
		this.truck_id = null;
	},

  },


	template: `
  		<v-container>


		<details-dialog
			:active="dialogDetails"
			:hidde="closeDialog"
			:truck_id="truck_id"
  		>
  		</details-dialog>
  
			<v-data-table
				:headers="headers"
				:items="trucks"
				sort-by="calories"
				class="elevation-0"
				hide-default-footer
				@page-count="pageCount = $event"
				:page.sync="page"
				:items-per-page="16"
				:search="search"
			>
  				<template v-slot:top>
    				<v-toolbar flat >
      					<v-toolbar-title>Maquinarias Vendidas</v-toolbar-title>
						<v-divider
							class="mx-4"
							inset
							vertical
						></v-divider>

						<v-scroll-x-reverse-transition>
						<v-text-field
							v-show="hidden"
							v-model="search"
							append-icon="mdi-magnify"
							label="Buscar"
							single-line
							hide-details
						></v-text-field>
						</v-scroll-x-reverse-transition>

      					<v-spacer></v-spacer>
      
      					<v-dialog v-model="dialog" max-width="500px" >
							<template v-slot:activator="{ on, attrs }">

								<v-btn
									color="primary"
									icon
									class="mb-2"
									v-bind="attrs"
									@click="initialize"
								>
									<v-icon> mdi-reload </v-icon>
								</v-btn> 
									
							</template>		
                </v-toolbar>
            </template>

  <template v-slot:item.total="{item}">
  {{formatMoney(item.total)}}
  </template>
  
  <template v-slot:item.actions="{ item }">
	
  <v-icon
      dense
      class="mr-2"
      @click="openDialog(item)"
      color="primary"
    >
	mdi-clipboard-list-outline
    </v-icon>

  </template>

</v-data-table>
<div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
  </v-container>

  `
});

export default home;