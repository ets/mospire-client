<template>
    <div id="app">
      <div v-if="!signedIn">
         <amplify-authenticator></amplify-authenticator>
      </div>      
    </div>
</template>

<script>
import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'

const signOutOptions = {
  msg: 'You are currently signed in.', // type: string, default: null
  signOutButton: 'Sign Out', // type: string, default: 'Sign Out', required: false
}

export default {
  name: 'app',
  async beforeCreate() {
    try {
      const user = await Auth.currentAuthenticatedUser()
      this.signedIn = true
    } catch (err) {
      this.signedIn = false
    }
    AmplifyEventBus.$on('authState', info => {
      if (info === 'signedIn') {
        this.signedIn = true
        this.$router.replace({name: 'dashboard'})
      } else {
        this.signedIn = false
      }
    });
  },
  // methods: {
  //   signOut: async function () {
  //     await Auth.signOut()
  //     this.signedIn = false
  //     console.log('signed out!')
  //   }
  // },
  data () {
    return {
      signOutOptions,
      signedIn: false
    }
  }
}
</script>

<style>
.signout {  
  margin: 0;
  padding: 11px 0px 1px;
}
</style>
