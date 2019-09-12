import Vue from 'vue';
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'


let aws_config = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.mospire.com"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_4yDF44akh",
    APP_CLIENT_ID: "42a93lddmohtb1jmievl74ibmb",
    IDENTITY_POOL_ID: "us-east-1:f7a84e17-debe-4b4c-8356-2df91bdf772a"
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
    identityPoolId: aws_config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: aws_config.cognito.APP_CLIENT_ID
  },
  API: {
    endpoints: [
      {
        name: "mospire",
        endpoint: aws_config.apiGateway.URL,
        region: aws_config.apiGateway.REGION
      },
    ]
  }
});

Vue.use(AmplifyPlugin, AmplifyModules)
export const AWSConfig = aws_config
export default Amplify