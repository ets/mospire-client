<template>
<v-data-table
    :headers="headers"
    :items="txns"
    :items-per-page="15"    
    sort-by="txn_time"
    single-select
    class="elevation-1"    
    loading-text="Loading... Please wait"
  >
    <template v-slot:item.txn_time="{ item }">
      <span>{{new Date(item.txn_time).toISOString().substr(0, 10)}}</span>
    </template>
    <template v-slot:top>
      <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>
      <v-toolbar flat color="white">
        <v-toolbar-title v-if="account != null">Account Ledger</v-toolbar-title>
        <v-toolbar-title v-else>Loading Ledger...</v-toolbar-title>

        <div class="flex-grow-1"></div>    

        <v-toolbar-items>          
          <v-dialog v-model="stmtDialog" max-width="500px">   
            <template v-slot:activator="{ on }">            
              <v-btn color="blue darken-1" v-on="on" text>Upload Statements</v-btn>
            </template>          
            <v-card>
              <v-card-title>
                <span class="headline">Upload Statements</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      Paste entries into the text box below. One per line using the format:<br>
                      <i>entry day (YYYY-MM-DD), cash flow, account balance</i>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-textarea
                        v-model="stmtCSV"
                        outlined
                        label="Account Ledger Entries"
                      ></v-textarea>
                    </v-col>
                  </v-row>                                  
                </v-container>
              </v-card-text>

              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="closeStmt">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="saveStmt">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="entryDialog" max-width="500px">       
            <template v-slot:activator="{ on }">            
              <v-btn color="blue darken-1" v-on="on" text>New Entry</v-btn>
            </template>   
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-menu
                        v-model="hideDatePicker"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on }">
                          <v-text-field
                            v-model="editedItem.txn_time"
                            label="Entry Date"
                            prepend-icon="event"
                            readonly
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker v-model="editedItem.txn_time" @input="hideDatePicker = false"></v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>                
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.flow" type="number" label="Cash Flow"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field v-model="editedItem.balance" type="number" label="Account Balance"></v-text-field>
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
        </v-toolbar-items>


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
      Enter Transactions
    </template>
  </v-data-table>
</template>

<script>
import { API } from 'aws-amplify'
import { mapGetters } from 'vuex'

export default {  
  mounted() {
    this.fetchTxns();
  },
  methods: { 
    fetchTxns: function () {
      API.get('mospire', '/v1/transactions/'+this.$route.params.accountId).then(response => {          
          this.txns = response.transactions
          this.account = response.account
          this.crumbs[1].text = this.account.broker_name  + " : " + this.account.identifier 
      }).catch(error => {        
        console.error(error)                
      });
    },    
    editItem (item) {
      this.editedIndex = this.txns.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editedItem.txn_time = new Date(item.txn_time).toISOString().substr(0, 10)
      this.entryDialog = true
    },

    deleteItem (item) {
      const index = this.txns.indexOf(item)
      if ( confirm('Are you sure you want to delete this entry?') ){
        this.txns.splice(index, 1);
        API.del('mospire', '/v1/transactions/'+this.$route.params.accountId+'/'+item.id).catch(error => {
            this.fetchTxns();
        });        
      }        
    },

    close () {
      this.entryDialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.resetItemValues)
        this.editedIndex = -1
      }, 300)
    },
    closeStmt(){
      this.stmtDialog = false
    },
    saveStmt(){
      let transactions = []
      for (const row of this.stmtCSV.replace(/(\r\n|\n|\r)/gm, ";").split(";")) {
        const cols = row.split(",")
        transactions.push({ 
          txn_time: cols[0], 
          flow: parseFloat(cols[1]), 
          balance: parseFloat(cols[2])
        })        
      }
      let myInit = {
        body: {
          transactions: transactions
        }
      }            
      API.post('mospire', '/v1/transactions/'+this.$route.params.accountId, myInit ).then(response => {
            this.fetchTxns()
            this.closeStmt()
          }).catch(error => {            
          console.error("Unable to upload stmt: "+error)            
      });        
        
    },
    save () {      
      // v-textfield doesn't persist with number type...have to convert here
      this.editedItem.balance = parseFloat(this.editedItem.balance)
      this.editedItem.flow = parseFloat(this.editedItem.flow)

      if (this.editedIndex > -1) {
        Object.assign(this.txns[this.editedIndex], this.editedItem)
        let myInit = {
          body: this.editedItem
        }    
        API.put('mospire', '/v1/transactions/'+this.$route.params.accountId+'/'+this.editedItem.id, myInit ).catch(error => {
            this.fetchTxns();
        });        
      } else {
        this.txns.push(this.editedItem)   
        let myInit = {
          body: {
            transactions: [this.editedItem]
          }
        }            
        API.post('mospire', '/v1/transactions/'+this.$route.params.accountId, myInit ).then(this.fetchTxns()).catch(error => {
            this.txns.splice(this.txns.indexOf(this.editedItem), 1)
            console.error("Unable to create new entry: "+error)            
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
        return this.editedIndex === -1 ? 'New Entry' : 'Edit Entry'
      },
    }
  ),
  watch: {
    dialog (val) {
      val || this.close()
    },
    '$route' (to, from) {
      this.fetchTxns();
    }
  },  
  data () {
    return {      
      crumbs: [
        {
          text: 'Accounts',          
          to: '/accounts',
        },        
        {
          text: 'Account',
          disabled: true,
          href: 'breadcrumbs_link_2',
        },
      ],
      stmtDialog: false,    
      entryDialog: false,  
      hideDatePicker: false,
      account: null,
      txns: [],
      headers: [
        { text: 'Entry Time', align: 'left', sortable: true, value: 'txn_time'},
        { text: 'Flow', sortable: true, value: 'flow' },
        { text: 'Balance', sortable: true, value: 'balance' },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      stmtCSV: "1970-01-01, -8, 50",
      editedIndex: -1,
      editedItem: {
        id: 0,
        txn_time: new Date().toISOString().substr(0, 10),
        flow: 0,
        balance: 0
      },
      resetItemValues: {
        id: 0,
        txn_time: new Date().toISOString().substr(0, 10),
        flow: 0,
        balance: 0
      },
    }
  }
}
</script>




  