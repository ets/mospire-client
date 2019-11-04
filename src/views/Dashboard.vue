<template>
<v-container>
  <v-alert type="error" :value="alert" dark dismissible>
    {{ alertMessage }} 
  </v-alert>
  <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>
  <v-sparkline
    :value="value"
    :gradient="gradient"
    :smooth="radius || false"
    :padding="padding"
    :line-width="width"
    :stroke-linecap="lineCap"
    :gradient-direction="gradientDirection"
    :fill="fill"
    :type="type"
    :auto-line-width="autoLineWidth"
    auto-draw
  ></v-sparkline>
</v-container>
</template>

<script>
import { API } from 'aws-amplify'
import { mapGetters } from 'vuex'
import ReturnSpark from '@/components/ReturnSpark.vue'

const gradients = [
    ['#222'],
    ['#42b3f4'],
    ['red', 'orange', 'yellow'],
    ['purple', 'violet'],
    ['#00c6ff', '#F0F', '#FF0'],
    ['#f72047', '#ffd200', '#1feaea'],
  ]

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
            let myInit = {
              queryStringParameters: {
                'accounts': this.accounts.map(acct => {return acct.id})
              }
            }
            API.get('mospire', '/v1/transactions/analysis', myInit).then(response => {
              this.analysis = response.analysis   
              this.value =[this.analysis['one_month']*100,
                this.analysis['two_month']*100,
                this.analysis['three_month']*100,
                this.analysis['four_month']*100,
                this.analysis['five_month']*100,
                this.analysis['six_month']*100]
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
  fetchAnalysis: function () {
    // Pull IRR
    // let now = new Date();
    // let sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    // let myInit = {
    //   queryStringParameters: {
    //     'accounts': this.accounts.map(acct => {return acct.id}),
    //     'start_month':now.getFullYear()+'-'+now.getMonth(),
    //     'end_month':sixMonthsAgo.getFullYear()+'-'+sixMonthsAgo.getMonth()
    //   }
    // }
    let myInit = {
      queryStringParameters: {
        'accounts': this.accounts.map(acct => {return acct.id})
      }
    }
    API.get('mospire', '/v1/transactions/analysis', myInit).then(response => {
      this.analysis = response.analysis   
    })
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
      analysis: null,    
      width: 2,
      radius: 10,
      padding: 8,
      lineCap: 'round',
      gradient: gradients[5],
      value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
      gradientDirection: 'top',
      gradients,
      fill: false,
      type: 'trend',
      autoLineWidth: false,  
    }
  }
}
</script>




  