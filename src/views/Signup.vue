<template>
  <amplify-sign-up v-bind:signUpConfig="signUpConfig"></amplify-sign-up>
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


