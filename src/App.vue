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
      <v-btn to="/signup" text>
        <span class="mr-2">Sign Up</span>
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