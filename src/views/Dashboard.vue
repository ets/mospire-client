<template>
<v-container>
  <v-alert type="error" :value="alert" dark dismissible>
    {{ alertMessage }} 
  </v-alert>
  <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>
  <ReturnSpark/>
</v-container>
</template>

<script>
import { API } from 'aws-amplify'
import { mapGetters } from 'vuex'
import ReturnSpark from '@/components/ReturnSpark.vue'


export default {
  components: {
    ReturnSpark
  },
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
        let errorMsg = error.response ? error.response.data.description : error.message
        // console.log(error.message)          
        this.alertMessage = "Please try again. Unable to load your dashboard due to: "+errorMsg
        this.alert = true
      });
    },    
  },
  computed: Object.assign({},
    mapGetters([
      'authenticatedUser',
      'authenticatedUserFirstName'
    ]),    
  ),  
  data () {
    return {
      alertMessage: 'Unable to complete your request. Please try again.',
      alert: false,
      crumbs: [
        {
          text: 'Dashboard',          
          to: '/dashboard',
          disabled: true,
        },                
      ],
      accounts: [],      
    }
  }
}
</script>




  