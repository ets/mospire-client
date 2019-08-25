<template>
  <div class="home">    
    <span>Hello {{ user.username }}, welcome to your dashboard.</span>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  async beforeCreate() {
    try {
      this.user = await Auth.currentAuthenticatedUser();
    } catch (err) {
      this.$router.replace({name: 'login'})
    }
  },    
  data () {
    return {
      user: null,
    }
  }
}
</script>




  