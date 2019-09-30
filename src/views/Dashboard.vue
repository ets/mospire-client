<template>
  <div class="dashboard">
    <v-subheader>Your Accounts</v-subheader>
    <v-data-table
      :headers="headers"
      :items="accounts"
      :items-per-page="20"
      class="elevation-1"
    ></v-data-table>
  </div>
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
          this.accounts = response.data          
      }).catch(error => {
        if(error.response.status === 404){
          this.createMospireUser()
        }else{
          console.error(error)
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
        }, 
        headers: {} // OPTIONAL
      }
      API.post('mospire', '/v1/users', myInit).then(response => {
          this.fetchDashboard();
      }).catch(error => {
          console.error("Unable to create mospire user: "+error)
      });
    }
  },
  computed: Object.assign({},
    mapGetters([
      'authenticatedUser',
      'authenticatedUserFirstName'
    ]),
    {}
  ),
  data () {
    return {
      account: 0,
      accounts: [],
      headers: [
        {
          text: 'Broker Name',
          align: 'left',
          sortable: true,
          value: 'broker_name',
        },
        { text: 'Account Number', value: 'identifier' }
      ]
    }
  }
}
</script>




  