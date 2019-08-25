<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Mospire</span>
        <span class="font-weight-light"> Portal</span>
      </v-toolbar-title>      
      <v-spacer></v-spacer>
      <v-btn to="/" text>
        <span class="mr-2">Home</span>
      </v-btn>      
      <v-btn v-if="!signedIn" to="/login" text>
        <span class="mr-2">Login</span>
      </v-btn>            
      <v-btn v-if="signedIn" to="/logout" text>
        <span class="mr-2">Logout</span>
      </v-btn>                  
      <v-btn to="/about" text>
        <span class="mr-2">About</span>
      </v-btn>
    </v-app-bar>    
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>


<script>
import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth } from 'aws-amplify'

export default {
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
      } else if (info === 'signedOut'){
        this.signedIn = false
      }
    });
  },    
  data () {
    return {
      signedIn: false
    }
  }
}
</script>

<style>
body {
  margin: 0
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
