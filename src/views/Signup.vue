<template>
    <div id="app">
      <div>
        <amplify-sign-up v-bind:signUpConfig="signUpConfig"></amplify-sign-up>
      </div>      
    </div>        
</template>

<script>
import {AWSConfig} from '../plugins/amplify';

export default {
  data () {
    return {
      signUpConfig: AWSConfig.authConfig.signUpConfig      
    }
  }
}
</script>


