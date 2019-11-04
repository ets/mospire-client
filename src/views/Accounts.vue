<template>
<v-container>  
  <v-alert type="error" :value="alert" dark dismissible>
      {{ alertMessage }} 
  </v-alert>
  <v-data-table
      :headers="headers"
      :items="accounts"
      :items-per-page="10"    
      sort-by="broker_name"            
      class="elevation-1"    
      loading-text="Loading... Please wait"
    >
      <template v-slot:footer>
        <v-dialog v-model="dialog" max-width="500px">          
            <template v-slot:activator="{ on }">                      
              <v-btn        
                v-on="on"       
                dark
                fab              
                left
                color="red"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
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
      </template>
      <template v-slot:top>    
        <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>
        <v-toolbar flat color="white">
          <v-toolbar-title>Your Accounts</v-toolbar-title>
          <div class="flex-grow-1"></div>                  
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">        
        <v-icon
          small
          class="mr-2"
          @click="showAccount(item)"
        >
          mdi-table-large
        </v-icon>
        <v-icon
          small
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
    this.fetchAccounts();
  },
  methods: { 
    fetchAccounts: function () {
      API.get('mospire', '/v1/accounts').then(response => {          
          this.accounts = response.accounts          
      }).catch(error => {
        let errorMsg = error.response ? error.response.data.description : error.message
        // console.log(errorMsg)          
        this.alertMessage = "Please try again. Unable to load your accounts due to: "+errorMsg
        this.alert = true
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
            this.fetchAccounts();
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
            this.fetchAccounts();
        });        
      } else {
        this.accounts.push(this.editedItem)   
        let myInit = {
          body: this.editedItem
        }    
        API.post('mospire', '/v1/accounts', myInit ).then(this.fetchAccounts()).catch(error => {
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
      alertMessage: 'Unable to complete your request. Please try again.',
      alert: false,
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
        { text: 'Latest Entry', sortable: true, value: 'latest_entry'},
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




  