<template>
<v-container>  
  <v-data-table
      :headers="headers"
      :items="accounts"
      :items-per-page="10"    
      v-on:click:row="showAccount"    
      sort-by="broker_name"            
      class="elevation-1"    
      loading-text="Loading... Please wait"
    >
      <template v-slot:top>    
        <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>
        <v-toolbar flat color="white">
          <v-toolbar-title>Your Accounts</v-toolbar-title>
          
          <div class="flex-grow-1"></div>        
          <v-dialog v-model="dialog" max-width="500px">          
            <template v-slot:activator="{ on }">        
              <v-btn color="blue darken-1" v-on="on" text>New Account</v-btn>    
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.broker_name" label="Broker name"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.identifier" label="Account number"></v-text-field>
                    </v-col>              
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon
          small
          class="mr-2"
          @click="editItem(item)"
        >
          edit
        </v-icon>
        <v-icon
          small
          @click="deleteItem(item)"
        >
          delete
        </v-icon>
      </template>
      <template v-slot:no-data>      
        Create a new account to get started
      </template>
    </v-data-table>
</v-container>
</template>

<script>
import { API } from 'aws-amplify'
import { mapGetters } from 'vuex'

export default {
  mounted() {
    this.fetchDashboard();
  },
  methods: { 
    fetchDashboard: function () {
      API.get('mospire', '/v1/accounts').then(response => {          
          this.accounts = response.accounts
          if(this.accounts.length > 0){
            // Pull IRR
            let myInit = {
              body: {
              }
            }
            API.get('mospire', '/v1/transactions/analysis', myInit).then(response => {
              
            })
          }
      }).catch(error => {
        if (error.status && error.response.status === 404){
          this.createMospireUser()
        }else{
          console.log(error.response ? error.response : error.message)
          //TODO: display errors by recording them in vuex and binding that in an Alert component in App
        }        
      });
    },
    createMospireUser: function () {
      const userEmail = this.$store.getters.authenticatedUser.attributes.email
      let name = this.$store.getters.authenticatedUserFirstName
      let myInit = {
        body: {
          'email':  userEmail,
          'first_name': name,
        }
      }
      API.post('mospire', '/v1/users', myInit).then(response => {
          this.fetchDashboard();
      }).catch(error => {
          console.error("Unable to create mospire user: "+error)
      });
    },
    showAccount(item){
      this.$router.push({name: 'account',  params: { accountId: item.id }})      
    },
    editItem (item) {
      this.editedIndex = this.accounts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      const index = this.accounts.indexOf(item)
      if ( confirm('Are you sure you want to delete this account?') ){
        this.accounts.splice(index, 1);
        API.del('mospire', '/v1/accounts/'+item.id).catch(error => {
            this.fetchDashboard();
        });        
      }        
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save () {      
      if (this.editedIndex > -1) {
        Object.assign(this.accounts[this.editedIndex], this.editedItem)
        let myInit = {
          body: this.editedItem
        }    
        API.put('mospire', '/v1/accounts/'+this.editedItem.id, myInit ).catch(error => {
            this.fetchDashboard();
        });        
      } else {
        this.accounts.push(this.editedItem)   
        let myInit = {
          body: this.editedItem
        }    
        API.post('mospire', '/v1/accounts', myInit ).then(this.fetchDashboard()).catch(error => {
            this.accounts.splice(this.accounts.indexOf(this.editedItem), 1)
            console.error("Unable to create new account: "+error)            
        });        
      }
      this.close()
    },    
  },
  computed: Object.assign({},
    mapGetters([
      'authenticatedUser',
      'authenticatedUserFirstName'
    ]),
    {
      formTitle () {
        return this.editedIndex === -1 ? 'New Account' : 'Edit Account'
      },
    }
  ),
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  data () {
    return {
      crumbs: [
        {
          text: 'Accounts',          
          to: '/accounts',
          disabled: true,
        },                
      ],
      dialog: false,
      accounts: [],
      headers: [
        {
          text: 'Broker Name',
          align: 'left',
          sortable: true,
          value: 'broker_name',
        },
        { text: 'Account Number', value: 'identifier' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        id: 0,
        broker_name: '',
        identifier: ''
      },
      defaultItem: {
        id: 0,
        broker_name: '',
        identifier: ''
      },
    }
  }
}
</script>




  