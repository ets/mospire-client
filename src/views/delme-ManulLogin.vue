<template>
  <v-container class="fill-height" fluid >
        <v-row align="center" justify="center" >
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
    <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="lazy">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :type="'password'"
            label="Password"
            required
          ></v-text-field>          
        </v-form>
    </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="submit" :disabled="!valid">SignIn</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>

<script>
import { Auth } from "aws-amplify";


export default {
  computed: Object.assign({},    
    {
      isSubmitDisabled: function () {
        return this.email.length <= 0 || this.password.length <= 0;
      }
    }
  ),
  methods: {
    validate () {
      if (this.$refs.form.validate()) {
        this.valid = true
      }else{
        this.valid = false
      }
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    submit () {
      try {
        await Auth.signIn(this.state.email, this.state.password);
        alert("Logged in");
      } catch (e) {
        alert(e.message);
      }
    },
  },
  data: () => ({
    valid: false,
    email: "",
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: "",
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length >= 8) || 'Password must be at least 8 characters',
    ],
  }),
};
</script>
