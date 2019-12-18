import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Router, Switch, Route } from './routing';
import Home from './Home';
import Pokemon from './Pokemon';
import Dashboard from "./Dashboard";
import SignUp from "./SignUp";
import TestAmplify from "./testAmplify";
import { AppLoading} from 'expo';
import {Asset} from "expo-asset";
import * as Font from "expo-font";
import Amplify from '@aws-amplify/core'
import config from './config'
import Friends from "./Friends";
Amplify.configure({ Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID, userPoolWebClientId: config.cognito.APP_CLIENT_ID

  }
});
export default class App extends React.Component {
  state = {
    selectedPokemon: null,
    isLoadingComplete: false,
    isAuthenticated: false,
    id:null
  };


  selectPokemon = selectedPokemon => {
    this.setState({
      selectedPokemon
    });
  };
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
  returnUserId(){
     return this.state.id
   }
  selectID = id => {
        this.setState({ id });
  }


  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
          <AppLoading
              startAsync={this._loadResourcesAsync}
              onError={this._handleLoadingError}
              onFinish={this._handleFinishLoading}
          />
      );
    } else {
      alert("hey")
      return (

            <Router>
              <Switch>
                <Route
                    exact
                    path="/"
                    render={props => (
                        <Home {...props} selectPokemon={this.selectPokemon} userHasAuthenticated={this.userHasAuthenticated} returnUserId={this.returnUserId} selectID={this.selectID} isAuthenticated={this.state.isAuthenticated} />
                    )}
                />
                <Route
                    exact
                    path="/SignUp"
                    render={props => (
                        <SignUp {...props} selectPokemon={this.selectPokemon} userHasAuthenticated={this.userHasAuthenticated} isAuthenticated={this.state.isAuthenticated}/>
                    )}
                />
                <Route
                    path="/pokemon"
                    render={props => (
                        this.state.isAuthenticated === true
                        ?<Pokemon
                            selectedPokemon={this.state.selectedPokemon}
                            {...props}
                        />
                        :alert(this.state.authenticated)

                    )}
                />
                <Route
                    path="/dashboard"
                    render={props => (
                        this.state.isAuthenticated === true
                            ?<Dashboard {...props} userHasAuthenticated={this.userHasAuthenticated} id={this.state.id}

                            />
                            :alert(this.state.authenticated)

                    )}
                />
                <Route
                    path="/test"
                    render={props => (
                        this.state.isAuthenticated === true
                            ?<TestAmplify {...props} userHasAuthenticated={this.userHasAuthenticated}

                            />
                            :alert(this.state.authenticated)

                    )}
                />
                  <Route
                      path="/friends"
                      render={props => (
                          this.state.isAuthenticated === true
                              ?<Friends {...props} userHasAuthenticated={this.userHasAuthenticated} id={this.state.id}

                              />
                              :alert(this.state.authenticated)

                      )}
                  />

              </Switch>
            </Router>

      );
    }
  }
  _loadResourcesAsync = async () => {

    return Promise.all([
      Asset.loadAsync([

        require('../assets/edSheeran.png'),  //makes page load only after loading the image
        require('../assets/DashboardBackground .png')
      ]),
      await Font.loadAsync({
        // This is the font that we are using for our tab bar
      //  ...Icon.Ionicons.font,
        // ionicons: require('../assets/fonts/ionicons.ttf'),
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
      //  'FontAwesome':require('../assets/fonts/FontAwesome.ttf')

      }),
    ]);
  };
  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
    padding: 50
  }
});
