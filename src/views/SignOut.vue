<template>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  props: [ 'target'],
  mounted () {
    this.logout();    
  },
  methods: {    
    logout: async function () {
      await Auth.signOut();
      this.$router.replace({name: 'home'})
      window.location = this.target
    },
  },
  data () {
    return {
      name: 'redirect'
    }
  }
}
</script>
<!-- styling for the component -->
<style>
</style>
