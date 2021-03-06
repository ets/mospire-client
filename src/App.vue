<template>
  <v-app id="mospire">    
    <v-navigation-drawer v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <v-list-item link to="/dashboard">
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/accounts">
          <v-list-item-icon>
            <v-icon>mdi-folder-multiple-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Accounts</v-list-item-title>
          </v-list-item-content>
        </v-list-item>        
        <v-list-item link to="/about">
          <v-list-item-icon>
            <v-icon>mdi-information-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app>
      <v-toolbar-title class="headline text-uppercase">
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span>Mospire</span>
        <span class="font-weight-light"> Portal</span>
      </v-toolbar-title>      
      <v-spacer></v-spacer>
      <v-btn to="/" text>
        <span class="mr-2">Home</span>
      </v-btn>      
      <v-btn v-if="!signedIn" to="/signin" text>
        <span class="mr-2">Sign In</span>
      </v-btn>            
      <v-btn v-if="signedIn" to="/signout" text>
        <span class="mr-2">Sign Out</span>
      </v-btn>                  
    </v-app-bar>        
    <v-content>      
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-content>    
  </v-app>
</template>


<script>
import { mapGetters } from 'vuex'
import { AmplifyEventBus } from 'aws-amplify-vue'
import { Auth, API } from 'aws-amplify'

export default {
  created() {    
    AmplifyEventBus.$on('authState', info => {
      // console.log("Caught an event: "+info)
      if (info === 'signedIn') {
        Auth.currentAuthenticatedUser()
            .then(user => {              
              if(!this.signedIn){
                this.$store.dispatch('setAuthenticatedUser', user)
                this.signedIn = true              
                // console.log("Just set setAuthenticatedUser")                            
                this.refreshIdleTimeout()
                this.createMospireUser()                                
                if(this.$route.params.nextUrl != null){
                  this.$router.push(this.$route.params.nextUrl)
                }else{
                  this.$router.push({name: 'dashboard'})
                }              
              }              
            })
            .catch(err => {
              this.signedIn = false
            });                
      } else if (info === 'signedOut'){        
        this.postSignout()
      } else if (info === 'signIn') { 
        this.$router.push({name: 'signin'})        
      }
    });    
  },
  mounted: function () {
    document.addEventListener('click', this.refreshIdleTimeout)
  },
  beforeDestroy: function () {
    if ("development" != process.env.NODE_ENV){
      Auth.signOut()
      this.postSignout()    
    }    
  },
  methods:{
    createMospireUser() {      
      const userEmail = this.$store.getters.authenticatedUser.attributes.email
      let name = this.$store.getters.authenticatedUserFirstName
      let myInit = {
        body: {
          'email':  userEmail,
          'first_name': name,
        }
      }
      API.post('mospire', '/v1/users', myInit).catch(error => {
          console.error("Unable to create mospire user: "+error)
      });
    },
    async postSignout() {
      this.$store.dispatch('setAuthenticatedUser', null)
      this.signedIn = false
      document.removeEventListener('click', this.refreshIdleTimeout)      
    },
    refreshIdleTimeout: function () {
      if(this.idleTimeout) clearTimeout(this.idleTimeout)
      if(this.signedIn) {
        this.idleTimeout = setTimeout(() => {
          Auth.signOut()
          this.postSignout()
          this.$router.replace({name: 'home'}) 
        }, 30 * 60 * 1000)      
      }      
    }
  },
  computed: Object.assign({},
    mapGetters([
      'authenticatedUser'
    ]),
    {}
  ),
  data () {
    return {
      drawer: null,
      idleTimeout: null,      
      signedIn: this.$store.getters.authenticatedUser != null
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
