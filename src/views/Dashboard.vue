<template>
  <div class="home">    
    <span>Hello {{ user.username }}, welcome to your dashboard.</span>
  </div>
</template>

<script>
import { Auth, API } from 'aws-amplify'

export default {
  async beforeCreate() {
    try {
      this.user = await Auth.currentAuthenticatedUser();
      API.get(apiName, path, myInit).then(response => {
          // Add your code here
      }).catch(error => {
          console.log(error.response)
      });
    } catch (err) {
      this.$router.replace({name: 'signin'})
    }
  },    
  data () {
    return {
      user: null,
    }
  }
}
</script>




  