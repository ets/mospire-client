<template>
    <div id="app">
      <div>
         <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
      </div>      
    </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import {AWSConfig} from '../plugins/amplify';


export default {
  name: 'app',
  async mounted () {
    try {
      const user = await Auth.currentAuthenticatedUser()
      if(user){
        this.$router.push({name: 'dashboard'})
      }      
    } catch (err) {
      //ignore
    }
  },    
  data () {
    return {
      authConfig: AWSConfig.authConfig,      
    }
  }
}
</script>
