<template>
<v-container>
  <v-alert type="error" :value="alert" dark dismissible>
    {{ alertMessage }} 
  </v-alert>
  <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>
  <v-chart :options="chart" autoresize="true" />
</v-container>
</template>

<script>
import { API } from 'aws-amplify'
import { mapGetters } from 'vuex'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'

export default {
  components: {
    'v-chart': ECharts
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
              this.chart.series[0].data =[this.analysis['one_month']*100,
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
      chart:{
        title:{
          text: 'Your IRR'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis:{          
          type: 'category',        
          data : ['One','Two','Three','Four','Five','Six']                         
        },
        yAxis: {
          axisLabel: {
            formatter:  function (value) {                
                return value.toFixed(3)
            }
          },
          type: 'value'
        },
        series: [{
          data: [],
          type: 'line'
        }]
      }
    }
  }
}
</script>
<style>
/**
 * The default size is 600px×400px, for responsive charts
 * you may need to set percentage values as follows (also
 * don't forget to provide a size for the container).
 */
.echarts {
  width: 100%;
  height: 500px;
}
</style>