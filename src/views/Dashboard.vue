<template>
  
  <v-list dense>
    <v-subheader>{{ authenticatedUser.username }}'s accounts</v-subheader>
    <v-list-item-group v-model="account" color="primary">
      <v-list-item
        v-for="(account, i) in accounts"
        :key="i"
      >
        <v-list-item-content>
          <v-list-item-title v-text="account.broker_name"></v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>

</template>

<script>
import { API } from 'aws-amplify'
import { mapGetters } from 'vuex'

export default {
  mounted() {
    this.fetchDashboard();
  },
  methods: {
    fetchDashboard: function () {
      API.get('mospire', '/v1/accounts').then(response => {
          this.accounts = response.data
      }).catch(error => {
        //TODO: look for unauthorized and trigger signedout
          console.error("Unable to fetch user's accounts: "+error)
      });
    },
    createMospireUser: function () {
      const userEmail = this.$store.getters.authenticatedUser.attributes.email
      let name = this.$store.getters.authenticatedUser.attributes.name ? this.$store.getters.authenticatedUser.attributes.name 
        : userEmail.substring(0, userEmail.indexOf('@') );
      let myInit = {
        body: {
          'email':  userEmail,
          'first_name': name,
        }, 
        headers: {} // OPTIONAL
      }
      API.post('mospire', '/v1/users', myInit).then(response => {
          this.fetchDashboard();
      }).catch(error => {
          console.error("Unable to create mospire user: "+error)
      });
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
      account: 0,
      accounts: []
    }
  }
}
</script>




  