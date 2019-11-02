import React from 'react';
import ReactDom from 'react-dom';
import Amplify from "aws-amplify";
import App from './App';
import config from "./config";

import './index.css';
alert("index.js")
Amplify.configure({ Auth: {
        mandatorySignIn: true,
        region: config.cognito.REGION,
        userPoolId: config.cognito.USER_POOL_ID, userPoolWebClientId: config.cognito.APP_CLIENT_ID
    }
});
ReactDom.render(<App />, document.getElementById('root'));
