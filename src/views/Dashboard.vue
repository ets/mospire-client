<template>
  <div class="home">    
    <span v-if="user">Hello {{ user.username }}, welcome to your dashboard.</span>
  </div>
</template>

<script>
import { Auth, API } from 'aws-amplify'

export default {
  async beforeCreate() {
    try {
      this.user = await Auth.currentAuthenticatedUser();      
    } catch (err) {
      this.$router.replace({name: 'signin'})
    }
    // API.get(apiName, path, myInit).then(response => {
    //     // Add your code here
    // }).catch(error => {
    //     console.log(error.response)
    // });
  },    
  data () {
    return {
      user: null,
    }
  }
}
</script>




  