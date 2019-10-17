<template>
    <div class="signup">
      <v-row
          align="center"
          justify="center"
        >
        <amplify-sign-up v-bind:signUpConfig="signUpConfig"></amplify-sign-up>
      </v-row>
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


