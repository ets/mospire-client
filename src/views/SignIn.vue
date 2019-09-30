<template>
    <div class="signin">
      <div>
         <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
      </div>      
    </div>
</template>

<script>
import {AWSConfig} from '../plugins/amplify';
import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'

export default {
  name: 'app',
  mounted () {
    if(this.$store.getters.authenticatedUser){
      this.$router.push({name: 'dashboard'})
    } else { //ensure any stale sessions are signed out
      Auth.signOut()
        .then(data => {
          AmplifyEventBus.$emit('authState', 'signedOut')
        })        
    }
  },
  data () {
    return {
      authConfig: AWSConfig.authConfig,
    }
  }
}
</script>
