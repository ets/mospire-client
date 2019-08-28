<template>
    <div id="app">
      <div v-if="!signedIn">
         <amplify-authenticator v-bind:authConfig="authConfig"></amplify-authenticator>
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
        if(this.$route.params.nextUrl != null){
          this.$router.push(this.$route.params.nextUrl)
        }else{
          this.$router.replace({name: 'dashboard'})
        }        
      }else if (info === 'signIn') { //after signup process is completed

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
      signedIn: false,
      authConfig: {
        usernameAttributes: 'Email',
        signInConfig:{
          header: 'Sign In to your Mospire account.',
        },
        signUpConfig: {
            header: 'Create a new Mospire account.',
            hideAllDefaults: true,
            defaultCountryCode: '1',
            signUpFields: [
              {
                label: 'Email',
                key: 'email',
                required: true,
                displayOrder: 1,
                type: 'string',
                signUpWith: true
              },
              {
                label: 'Password',
                key: 'password',
                required: true,
                displayOrder: 2,
                type: 'password'
              }
            ]
          }
      }
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
