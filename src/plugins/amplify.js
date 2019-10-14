import Vue from 'vue';
import Amplify, * as AmplifyModules from 'aws-amplify'
import { Auth } from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'

let aws_config = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "http://localhost:8000"
  },
  cognito: {
    REGION: "us-east-1",
    APP_CLIENT_ID: "5p860tpu5f8rgnpjsq68nra9nn",
    USER_POOL_ID: "us-east-1_IqkdYtxXH",
  },
  authConfig: {
    usernameAttributes: 'Email',
    signInConfig:{
      header: 'Sign In to your Mospire account.',
    },
    signOutConfig: {
      msg: 'You are currently signed in.', // type: string, default: null
      signOutButton: 'Sign Out', // type: string, default: 'Sign Out', required: false      
    },
    signUpConfig: {
        header: 'Create a new Mospire account.',
        hideAllDefaults: true,
        defaultCountryCode: '1',
        signUpFields: [
          {
            label: 'Name',
            key: 'name',
            required: false,
            displayOrder: 1,
            type: 'string',
          },              
          {
            label: 'Email',
            key: 'email',
            required: true,
            displayOrder: 2,
            type: 'string',
            signUpWith: true
          },
          {
            label: 'Password',
            key: 'password',
            required: true,
            displayOrder: 3,
            type: 'password'
          }
        ]
      }
  }
};

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: aws_config.cognito.REGION,
    userPoolId: aws_config.cognito.USER_POOL_ID,
    userPoolWebClientId: aws_config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "mospire",
        endpoint: aws_config.apiGateway.URL,
        region: aws_config.apiGateway.REGION,
        custom_header: async () => {           
          return { Authorization: `Bearer ${(await Auth.currentSession()).getAccessToken().getJwtToken()}` }
        }
      },
    ]
  }
});

Vue.use(AmplifyPlugin, AmplifyModules)
export const AWSConfig = aws_config
export default Amplify