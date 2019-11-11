<template>
<v-container>
  <v-alert type="error" :value="alert" dark dismissible>
    {{ alertMessage }} 
  </v-alert>
  <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>

  <v-row dense>
    <v-col cols="12">
      <v-card>
        <v-card-title class="headline">Monthly Performance</v-card-title>
        <v-chart :options="chart" autoresize />
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card v-if="analysis && analysis['monthly_performance']">
        <v-card-title class="headline">Portfolio Performance</v-card-title>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Internal Rate of Return (IRR)</td>
                <td v-if="analysis['irr']">{{ (100 * analysis['irr']).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>Year to Date (YTD)</td>
                <td v-if="analysis['ytd']">{{ (100 * analysis['ytd']).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>1 Year</td>
                <td v-if="analysis['monthly_performance'].length > 12">{{ (100 * analysis['monthly_performance'][12]).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>3 Year</td>
                <td v-if="analysis['monthly_performance'].length > 36">{{ (100 * analysis['monthly_performance'][36]).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>5 Year</td>
                <td v-if="analysis['monthly_performance'].length > 60">{{ (100 * analysis['monthly_performance'][60]).toFixed(2) }}%</td>
                <td v-else>N/A</td>
              </tr>                            
              <tr>
                <td>10 Year</td>
                <td v-if="analysis['monthly_performance'].length > 120">{{ (100 * analysis['monthly_performance'][120]).toFixed(2) }}%</td>
                <td v-else>N/A</td>
              </tr>              
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </v-col>
  </v-row>

</v-container>
</template>

<script>
import { API } from 'aws-amplify'
import { mapGetters } from 'vuex'
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/axis'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/timeline'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'

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
              var monthIterator = new Date(this.analysis['end']);
              for (let i = 1; i < this.analysis['monthly_performance'].length; i++) { 
                this.chart.series[0].data.push( (100 * this.analysis['monthly_performance'][i]).toFixed(2) )
                this.chart.xAxis.data.push(monthIterator.toLocaleDateString(undefined, {  
                  day : 'numeric',
                  month : 'short',
                  year : 'numeric'
                }))
                monthIterator = new Date(monthIterator.setMonth(monthIterator.getMonth()-1))
              }
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
        tooltip: {
          trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
          show: true,
          showTitle: false, // hide the default text so they don't overlap each other
          feature: {
              saveAsImage: {
                  show: true,
                  title: 'Save As Image'
              },
          },
          tooltip: { // same as option.tooltip
            show: true,
            formatter: function (param) {
                return '<div>' + param.title + '</div>'; // user-defined DOM structure
            },
            backgroundColor: '#222',
            textStyle: {
                fontSize: 12,
            },
            extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);' // user-defined CSS styles
          }
        },
        xAxis:{          
          type: 'category',        
          data : []
        },
        yAxis: {
          axisLabel: {
            formatter:  function (value) {                
                return value.toFixed(2) + "%"
            }
          },
          type: 'value'
        },
        series: [{
          // name: 'Named data',
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