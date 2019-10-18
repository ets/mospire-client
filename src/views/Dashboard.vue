<template>
<v-container>
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
        console.log(error.response ? error.response : error.message)
        //TODO: display errors by recording them in vuex and binding that in an Alert component in App
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




  