<template>
  <amplify-sign-out v-bind:signOutConfig="signOutConfig"></amplify-sign-out>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'
import {AWSConfig} from '../plugins/amplify';

export default {  
  mounted () {
    this.logout();    
  },  
  methods: {    
    logout: async function () {
      Auth.signOut()
        .then(data => {
          AmplifyEventBus.$emit('authState', 'signedOut')
          this.$router.replace({name: 'home'})  
        })        
    },
  },
  data () {
    return {
      signOutConfig: AWSConfig.authConfig.signOutConfig      
      // Not using the component / view at all...
    }
  }
}
</script>
<!-- styling for the component -->
<style>
</style>
