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
      <v-btn v-if="signedIn" to="/dashboard" text>
        <span class="mr-2">Dashboard</span>
      </v-btn>            
      <v-btn v-if="!signedIn" to="/signin" text>
        <span class="mr-2">Sign In</span>
      </v-btn>            
      <v-btn v-if="signedIn" to="/signout" text>
        <span class="mr-2">Sign Out</span>
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
      console.log("Inside EventBus block: "+info)
      if (info === 'signedIn') {
        this.signedIn = true        
        if(this.$route.params.nextUrl != null){
          this.$router.push(this.$route.params.nextUrl)
        }else{
          this.$router.push({name: 'dashboard'})
        }              
      } else if (info === 'signedOut'){
        this.signedIn = false
      } else if (info === 'signIn') { 
        this.$router.push({name: 'signin'})
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
:root {
  /* Colors from https://github.com/aws-amplify/amplify-js/blob/master/packages/amplify-ui/src/Theme.css */
  --amazonOrange: #009900; /* Redefined to dark green */
  --lightAmazonOrange: #FFAC31;
  --darkAmazonOrange: #E88B01;
  --squidInk: #232F3E;
  --lightSquidInk: #31465F;
  --deepSquidInk: #152939;
  --grey: #828282;
  --lightGrey: #C4C4C4;
  --silver: #E1E4EA;
  --darkBlue: #31465F;
  --red: #DD3F5B;
  --white: #FFFFFF;
  --light-blue: #00a1c9;
  }
</style>
