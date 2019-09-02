<template>
    <div id="app">
      <div>
         <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
      </div>      
    </div>
</template>

<script>
import {AWSConfig} from '../plugins/amplify';


export default {
  name: 'app',
  mounted () {
    if(this.$store.getters.authenticatedUser){
      this.$router.push({name: 'dashboard'})
    }    
  },
  data () {
    return {
      authConfig: AWSConfig.authConfig,
    }
  }
}
</script>
