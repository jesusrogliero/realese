'use strict'

// componente clients
let details_dialog = Vue.component('details-dialog', {

    props: ['truck_id', 'hidde', 'active'],

    data: () => ({
        dialog: false,
        dialogDelete: false,
        dialogWorkforce: false,
        page: 1,
        pageCount: 0,
        search: "",
        hidden: false,
        headers: [
            { text: 'ID', value: 'id'},
            { text: 'Nombre', value: 'name' },
            { text: 'Vendedor', value: 'vendor' },
            { text: 'Descripción', value: 'description' },
            { text: 'Fecha de compra', value: 'date_purchase' },
            { text: 'Categoria', value: 'category' },
            { text: 'Costo', value: 'cost' },
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
        truck: {},
        workforce: '',
        trucks_details: [],
        editedIndex: -1,

        menu: false,
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Registrar un Nuevo Articulo' : 'Actualizar un Articulo';
        },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },

        truck_id (val) {
          this.initialize();
        }
    },

    created: function() { 
        this.initialize();
        this.cleanForm();
    },


    methods: {
        initialize: async function () {
            this.truck = await execute('show-truck', this.truck_id);
            this.trucks_details = await execute('index-trucks-details', this.truck_id);

            this.workforce = this.truck.workforce;

            if(this.truck.is_sold == 1 ) {
              this.headers.splice(7,1);
            }

            if(Math.round ( Object.keys(this.trucks_details).length / 16) >= 1 )
            this.pageCount =  Math.round ( Object.keys(this.trucks_details).length / 16);
        },

        editItem: async function(item) {
            this.editedIndex = item.id
            this.editedItem = await execute('show-truck-detail', this.editedIndex);
            this.dialog = true
        },

        deleteItem: async function(item) {
            this.editedIndex = item.id;
            this.editedItem = await execute('show-truck-detail', this.editedIndex);

            if(this.editedItem.code == 0){
            alertApp({color:"error", text: this.editedItem, icon: "alert" });
            this.editedItem = {id: '',name: '',lastname: '',cedula: ''};
            }

            this.dialogDelete = true
        },

        deleteItemConfirm: async function() {
            let result = await execute('destroy-truck-detail', this.editedIndex);


            if(result.code == 1) {
            alertApp({color:"success", text: result, icon: "check" }); 
            }else{
            alertApp({color:"error", text: result, icon: "alert" }); 
            }

            this.closeDelete();
        },

        formatMoney: function(value) {
          let formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
        
          return formatter.format(value);
        },

        cleanForm: function() {
            this.editedItem = {
                id: '',
                name: '',
                code: '',
                vendor: '',
                description: '',
                date_purchase: '',
                category: '',
                cost: ''
            };
        },

        close: function() {
            this.dialog = false;
            this.cleanForm();
            this.$nextTick(() => {
            this.initialize();
            this.editedIndex = -1;
            })
        },

        closeDelete: function() {
            this.dialogDelete = false;
            this.cleanForm();
            this.$nextTick(() => {
            this.initialize();
            this.editedIndex = -1;
            })
        },

        setWorkforce: async function() {
          let result = await execute('set-workforce', {
            id: this.truck.id,
            workforce: this.workforce
          });

       
          if(result.code === 1) {
            alertApp({color:"success", text: result, icon: "check" }); 
            this.dialogWorkforce = false;
            this.initialize();
          }else{
            alertApp({color:"error", text: result, icon: "alert" }); 
          }
        },

        setTruckSold: async function() {
          let result = await execute('set-truck-sold', this.truck.id);

          if(result.code === 1) {
            alertApp({color:"success", text: result, icon: "check" });  
            this.hidde();
          }else{
            alertApp({color:"error", text: result, icon: "alert" }); 
          }
        },

        save: async function() {
            let result = null;
            this.editedItem.truck_id = this.truck.id;
            
            if (this.editedIndex > -1) {
            result = await execute('update-truck-detail', this.editedItem);
            } else {
            result = await execute('create-truck-detail', this.editedItem);
            }

            if(result.code === 1) {
            alertApp({color:"success", text: result, icon: "check" }); 
            this.close();
            }else{
            alertApp({color:"error", text: result, icon: "alert" }); 
            }
            
        },
    },


	template: `

  <v-dialog
    v-model="active"
    fullscreen
  >

  <v-dialog
    v-if="truck.is_sold == 0"
    v-model="dialogWorkforce"
    max-width="350"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">Ajustar Costo M.O</span>
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="dialogWorkforce = false" > <v-icon>mdi-close-thick</v-icon> </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-text-field 
        class="mt-5"
          v-model="workforce" 
          label="Ingresa el Costo M.O"
          type="number"
          prepend-icon="mdi-currency-usd"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mt-n6"
          color="green darken-1"
          text
          @click="setWorkforce"
        >
          Actualizar
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
    
    <v-card>
    <v-toolbar
      color="primary"
    >
      <v-toolbar-title class="white--text">{{truck.name}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn color="red" text @click="hidde()" > <v-icon>mdi-close-thick</v-icon> </v-btn>
    </v-toolbar>

    <v-container>
      <v-row justify="center" >

          <v-col cols="6" sm="6">
            <v-card
              max-width="500"
              outlined
              elevation="3"
            >
            <v-card-title center>
              Detalles del Camión
            </v-card-title>
            <v-divider class="mt-n3"></v-divider>

            <v-row>
              <v-col cols="12" class="ml-6 mt-2">
                <strong>Nombre:</strong> {{truck.name}}
              </v-col>

              <v-col cols="12" class="ml-6">
              <strong>Modelo:</strong> {{truck.model}}
              </v-col>

              <v-col cols="12" class="ml-6">
              <strong>Codigo:</strong> {{truck.code}}
              </v-col>
              
              <v-col cols="12" class="ml-6">
              <strong>Description:</strong> {{truck.description}}
              </v-col>

              <v-col cols="12" class="ml-6 mb-2">
              <strong>Fecha de compra: </strong> {{truck.date_purchase}}
              </v-col>

              <v-col cols="12" class="ml-6 mb-2" v-if="truck.is_sold == 1">
                <strong>Fecha de venta: </strong> {{truck.sale_date}}
              </v-col>

            </v-row>
         
    
            </v-card>
          </v-col>

          <v-col cols="6" >
          <v-card
            max-width="500"
            outlined
            elevation="3"
          >
          <v-card-title center>
           Detalles de Inversión
          </v-card-title>
          <v-divider class="mt-n3"></v-divider>

          <v-row>

          <v-col cols="12" class="ml-6 mt-2">
          <strong>Vendedor:</strong> {{ truck.vendor}}
          </v-col>

          <v-col cols="12" class="ml-6">
          <strong>Costo del articulo:</strong> {{ formatMoney(truck.cost) }}
        </v-col>

          <v-col cols="12" class="ml-6">
            <strong>Costo de Transporte:</strong> {{ formatMoney(truck.transport_cost) }}
          </v-col>

          <v-col cols="12" class="ml-6">
          <strong>Costo de Mano de Obra:</strong> {{ formatMoney(truck.workforce) }}
          </v-col>
          
          <v-col cols="12" class="ml-6 mb-2">
          <strong>Total Invertido:</strong> {{ formatMoney(truck.total) }}
          </v-col>

          <v-col cols="12" class="ml-6 mb-2" v-if="truck.is_sold == 1">
            <strong>Vendido:</strong>  <v-icon color="green"> mdi-check-bold </v-icon>
          </v-col>


          </v-row>
       
  
          </v-card>
        </v-col>

        </v-row>
      </v-container>

			<v-data-table
				:headers="headers"
				:items="trucks_details"
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
      					<v-toolbar-title>Repuesto y/o Accesorios Aplicados</v-toolbar-title>
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
                  v-if="truck.is_sold == 0"
									color="green"
									icon
									class="mb-2"
									v-bind="attrs"
									v-on="on"
								>
									<v-icon> mdi-plus </v-icon>
								</v-btn> 

								<v-btn
									color="primary"
									icon
									class="mb-2"
									v-bind="attrs"
									@click="initialize"
								>
									<v-icon> mdi-reload </v-icon>
								</v-btn> 
									

								<v-btn
									color="primary"
									icon
									class="mb-2"
									v-bind="attrs"
									@click="hidden =!hidden"
								>
									<v-icon> mdi-magnify </v-icon>
								</v-btn> 

                <v-btn
                v-if="truck.is_sold == 0"
                color="red"
                icon
                class="mb-2"
                v-bind="attrs"
                @click="dialogWorkforce = true"
              >
                <v-icon> mdi-account-cash </v-icon>
              </v-btn> 

              <v-btn
                v-if="truck.is_sold == 0"
                color="green"
                icon
                class="mb-2"
                v-bind="attrs"
                @click="setTruckSold"
              >
                <v-icon> mdi-truck-check </v-icon>
              </v-btn> 
							</template>
							
       				<v-card v-if="truck.is_sold == 0">
							
							   <v-card-title>
									<span class="text-h5">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="close" > <v-icon>mdi-close-thick</v-icon> </v-btn>
								</v-card-title>
                <v-divider></v-divider>

          			<v-card-text>
									<v-container>
										<v-row>
											<v-col cols="12" >
												<v-text-field 
												v-model="editedItem.name" 
												label="Nombre"
												prepend-icon="mdi-dump-truck"
												></v-text-field>
											</v-col>

                      <v-col cols="6" >
                      <v-text-field
                        v-model="editedItem.code"
                        label="Codigo"
                        type="number"
                        prepend-icon="mdi-barcode"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="6" >
                    <v-text-field
                      v-model="editedItem.category"
                      label="Categoria"
                      prepend-icon="mdi-clipboard-list-outline"
                    ></v-text-field>
                  </v-col>
										
											
											<v-col cols="12" >
												<v-text-field
													v-model="editedItem.description"
													label="Descripción"
													prepend-icon="mdi-playlist-edit"
												></v-text-field>
											</v-col>

											<v-col cols="12" >
												<v-text-field
													v-model="editedItem.vendor"
													label="Vendedor"
													prepend-icon="mdi-store"
												></v-text-field>
											</v-col>


                      <v-col cols="6" >
                      <v-text-field
                        v-model="editedItem.cost"
                        label="Costo"
                        prepend-icon="mdi-currency-usd"
                      ></v-text-field>
                    </v-col>


											<v-col cols="6" >
												<v-menu
													ref="menu"
													v-model="menu"
													:close-on-content-click="false"
													:return-value.sync="editedItem.date_purchase"
													transition="scale-transition"
													offset-y
													min-width="auto"
												>
													<template v-slot:activator="{ on, attrs }">
														<v-text-field 
															v-model="editedItem.date_purchase"
															label="Fecha de Compra"
															prepend-icon="mdi-calendar"
															readonly
															v-bind="attrs"
															v-on="on"
														></v-text-field>
													</template>
													<v-date-picker
														v-model="editedItem.date_purchase"
														no-title
														scrollable
													>
														<v-spacer></v-spacer>
														<v-btn
														text
														color="primary"
														@click="menu = false"
														> Cancel </v-btn>
														<v-btn
															text
															color="primary"
															@click="$refs.menu.save(editedItem.date_purchase)"
														> OK </v-btn>
											  		</v-date-picker>
												</v-menu>
										  	</v-col>

										</v-row>
									</v-container>
          						</v-card-text>


          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="success"
              text
              @click="save"
            >

              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="600px" v-if="truck.is_sold == 0">
        <v-card>
          <v-card-title class="text-h5">Estas seguro que deseas eliminar este articulo?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="closeDelete">Cancelar</v-btn>
            <v-btn color="success" text @click="deleteItemConfirm">Confirmar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  </template>

  <template v-slot:item.cost="{item}">
  {{formatMoney(item.cost)}}
  </template>
  
  <template v-slot:item.actions="{ item }">
    <v-icon
      v-if="truck.is_sold == 0"
      dense
      class="mr-2"
      @click="editItem(item)"
      color="primary"
    >
      mdi-pencil
    </v-icon>

    <v-icon
      v-if="truck.is_sold == 0"
      dense
      @click="deleteItem(item)"
      color="error"
    >
      mdi-delete
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
      </v-card-text>
  </v-card>
</v-dialog>


  `
});

export default details_dialog;