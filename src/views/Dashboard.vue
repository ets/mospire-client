<template>
<v-container>
  <v-alert type="error" :value="alert" dark dismissible>
    {{ alertMessage }} 
  </v-alert>
  <v-breadcrumbs large :items="crumbs"></v-breadcrumbs>

  <v-row v-if="analysis" dense>
    <v-col cols="12">
      <v-card style="padding-bottom:10px; padding-right:30px;">
        <v-card-title class="headline">Monthly Performance</v-card-title>
        <v-chart :options="chart_perf" style="height: 400px;" autoresize />
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card>
        <v-card-title class="headline">Internal Rate of Return</v-card-title>
        <v-card-text>as of {{ new Date(analysis['end']).toLocaleDateString(undefined, {  
          day : 'numeric',
          month : 'short',
          year : 'numeric'
        }) }}</v-card-text>
        <v-chart :options="chart_irr" style="height: 400px;" autoresize />
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card v-if="analysis['monthly_performance']" >
        <v-card-title class="headline">Portfolio Performance</v-card-title>
        <v-simple-table style="height: 440px;">
          <template v-slot:default>
            <tbody>
              <tr>
                <td>Internal Rate of Return (IRR)</td>
                <td v-if="analysis['irr']" :class="analysis['irr'] > 0 ? 'green-text' : 'red-text'">{{ (100 * analysis['irr']).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>Year to Date (YTD)</td>
                <td v-if="analysis['ytd']" :class="analysis['ytd'] > 0 ? 'green-text' : 'red-text'">{{ (100 * analysis['ytd']).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>1 Year</td>
                <td v-if="analysis['monthly_performance'].length > 12" :class="analysis['monthly_performance'][12] > 0 ? 'green-text' : 'red-text'">{{ (100 * analysis['monthly_performance'][12]).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>3 Years</td>
                <td v-if="analysis['monthly_performance'].length > 36" :class="analysis['monthly_performance'][36] > 0 ? 'green-text' : 'red-text'" >{{ (100 * analysis['monthly_performance'][36]).toFixed(2) }}%</td>
              </tr>
              <tr>
                <td>5 Years</td>
                <td v-if="analysis['monthly_performance'].length > 60" :class="analysis['monthly_performance'][60] > 0 ? 'green-text' : 'red-text'">{{ (100 * analysis['monthly_performance'][60]).toFixed(2) }}%</td>
                <td v-else>N/A</td>
              </tr>                            
              <tr>
                <td>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">10 Years</span>
                    </template>
                    <span>Annual compound return</span>
                  </v-tooltip>                  
                </td>
                <td v-if="analysis['monthly_performance'].length > 120" :class="analysis['monthly_performance'][120] > 0 ? 'green-text' : 'red-text'">{{ (100 * analysis['monthly_performance'][120]).toFixed(2) }}%</td>
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
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/axis'
import 'echarts/lib/component/dataZoom'
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
              this.populatePerformanceChart();
              this.populateIRRChart();
            })
          }
      }).catch(error => {
        let errorMsg = error.response ? error.response.data.description : error.message
        // console.log(error.message)          
        this.alertMessage = "Please try again. Unable to load your dashboard due to: "+errorMsg
        this.alert = true
      });
    }, 
    populatePerformanceChart: function(){
      for (let aid in this.analysis['accounts']) {
        const account = this.accounts.find(x => x.id == aid)
        this.chart_perf.series.push( {name: account.identifier ,smooth:true,type:'line',data: []} )
      }              
      var monthIterator = new Date(this.analysis['end']);              
      for (let i = 1; i < this.analysis['monthly_performance'].length; i++) { 
        this.chart_perf.series[0].data.push( (100 * this.analysis['monthly_performance'][i]).toFixed(2) )                
        let series_idx = 1
        for (let aid in this.analysis['accounts']) {
          this.chart_perf.series[series_idx].data.push( (100 * this.analysis['accounts'][aid]['monthly_performance'][i]).toFixed(2) )
          series_idx++
        }                
        this.chart_perf.xAxis.data.push(monthIterator.toLocaleDateString(undefined, {  
          day : 'numeric',
          month : 'short',
          year : 'numeric'
        }))
        monthIterator = new Date(monthIterator.setMonth(monthIterator.getMonth()-1))
      }
      for (let i=0; i<this.chart_perf.series.length; i++){
        this.chart_perf.series[i].data.reverse()
      }
      this.chart_perf.xAxis.data.reverse()
    },
    populateIRRChart: function(){
      this.chart_irr.xAxis[0].data.push("Entire Portfolio")
      this.chart_irr.series[0].data.push( (100 * this.analysis['irr']).toFixed(2) )
      for (let aid in this.analysis['accounts']) {
        const account = this.accounts.find(x => x.id == aid)
        this.chart_irr.xAxis[0].data.push( account.identifier )
        this.chart_irr.series[0].data.push( (100 * this.analysis['accounts'][aid]['irr']).toFixed(2) )        
      }                    
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
      analysis: null,
      chart_irr:{
        color: ['#3398DB'],
        tooltip : {
            trigger: 'axis',
            formatter: function (param) {
              return param[0].name + ": "+ parseFloat(param[0].value).toFixed(2) + "%";
            },
            axisPointer : {         
                type : 'shadow'     
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : [],
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis : [
            {
              axisLabel: {
                formatter:  function (value) {                
                    return value.toFixed(2) + "%"
                }
              },
              type : 'value'
            }
        ],
        series : [
            {
                name:'IRR',
                type:'bar',
                barWidth: '60%',
                data:[]
            }
        ]
      },
      chart_perf:{
        legend: {},
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
              id: 'dataZoomX',
              type: 'slider',
              xAxisIndex: [0],
              filterMode: 'filter',
              start: 20,
              end: 100,
          }
        ],
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
        series: [{
          name: 'Entire Portfolio',
          data: [],
          smooth: true,
          type: 'line'
        }],
        xAxis:{          
          type: 'category',        
          min: 'dataMin',
          max: 'dataMax',
          data : []
        },
        yAxis: {
          axisLabel: {
            formatter:  function (value) {                
                return value.toFixed(2) + "%"
            }
          },
          type: 'value'
        }
      }
    }
  }
}
</script>
<style>
.echarts {
  width: 100%;  
}
.green-text {color: green}
.red-text {color: red}
</style>