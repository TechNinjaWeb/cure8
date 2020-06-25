import React, {Fragment} from 'react';
import {Image, ImageBackground, Platform, StyleSheet, View} from 'react-native';
import { Router, Switch, Route, Link } from './routing';
import Home from './Home';
import Pokemon from './Pokemon';
import Dashboard from "./Dashboard";
import SignUp from "./SignUp";
import FriendRequest from "./FriendRequest"
import { AppLoading} from 'expo';
import {Asset} from "expo-asset";
import * as Font from "expo-font";
import Amplify from '@aws-amplify/core'
import config from './config'
import Friends from "./Friends";
import Artist from "./ArtistPage"
import { Nav, Navbar, NavItem } from "react-bootstrap";
import { Auth } from "aws-amplify";
import {Button, SearchBar, Text} from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import Modal from "modal-enhanced-react-native-web";
import axios from 'axios';
import { API, graphqlOperation } from 'aws-amplify';
Amplify.configure({ Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID, userPoolWebClientId: config.cognito.APP_CLIENT_ID

  }
});
const ListUsers = `
     query GetUsers($id: ID!) {
       getUsers(id: $id) {
         friends
  }
}
    `;

const getUsersFriendRequests = `
     query GetUsers($id: ID!) {
       getUsers(id: $id) {
         friendRequests
  }
}
    `;


const FindUserByEmail = `
     query GetUsers($email: String!) {
       getUsersByEmail(email: $email) {
         id
  }
}
    `;


const RequestFriend2 = `
    mutation ($friendRequests: String!, $id: ID!){

     updateUsers(input: {
        friendRequests: $friendRequests,
        id: $id
     }) {
        friendRequests
     }
    }
    `;
const AcceptFriend = `
    mutation ($userID: ID!, $userEmail: String!, $friendEmail: String!, $index: Int!){

     addFriend(input: {
         id: $userID,
        email: $userEmail, 
        friendEmail: $friendEmail, 
        index: $index
      }) {
        friendRequests,
        friends
     }
    }
    `;

const RejectFriend = `
    mutation ($userID: ID!, $index: Int!){

     rejectFriend(input: {
        id: $userID,
        index: $index
      }) {
        friendRequests
     }
    }
    `;
const CreateLeague = `
    mutation ($leagueID: ID!, $ownerID: ID!){

     createLeague(input: {
        leagueID: $leagueID,
        ownerID: $ownerID
      }) {
        leagueID
     }
    }
    `;

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPokemon: null,
            isLoadingComplete: false,
            isAuthenticated: false,
            ArtistID: null,
            id:null,
            email: null,
            bearer: null,
            isFriendsModalVisible: false,
            friend: '',
            friendList: [],
            idOfFriend:'',
            friend2: '',
            friendRequestsList: [],
            hasFriendsAfterSignUp: 1,
            hasRequestsAfterSignUp: 1
        };

    }
    updateFriendSearch = friend => {
        this.setState({ friend });
        console.log(this.state.friend)

    };
    handleFriendSearch = async() =>{
        if (this.state.friend === '') return;
        const book = { friend: this.state.friend };
        if(this.state.friend==this.state.email){
            alert("You can't add yourself")
            throw "can't add yourself"
        }
        try {
            const params = {email: this.state.friend}
            this.state.idOfFriend = await API.graphql(graphqlOperation(FindUserByEmail,params));
            console.log(this.state.idOfFriend+ "in try");
            if(this.state.idOfFriend.data.getUsersByEmail==null){
                alert("no such user")
                throw "no such user"
            }
            try{
                for (var i = 0; i < this.state.friendList.length; i++) {
                    if (this.state.friendList[i] == this.state.friend) {
                        alert("the user is already your friend")
                        throw "the user is already your friend"
                    }

                }
            }catch(err){

            }
            try {
                for (var i = 0; i < this.state.friendRequestsList.length; i++) {
                    if (this.state.friendRequestsList[i] == this.state.friend) {
                        alert("the user has already sent you a friend request")
                        throw "the user has already sent you a friend request"
                    }

                }
            }catch (err) {

            }
            try {
                const params2 = { id: this.state.idOfFriend.data.getUsersByEmail.id };
                const friendRequestsOfThatUser = await API.graphql(graphqlOperation(getUsersFriendRequests,params2));
                const friendRequests = Array.from(friendRequestsOfThatUser.data.getUsers.friendRequests)
                for (var j = 0; j < friendRequests.length; j++) {
                    if (friendRequests[j] == this.state.email) {
                        alert("You've already sent a friend request to that user")
                        throw "You've already sent a friend request to that user"
                    }

                }
            }catch (err) {

            }
            try {
                /*const books = [...this.state.friend, book];
                this.setState({ books, friend: '', author: '' });
                console.log('books: ', books);*/
                const params = {friendRequests: this.state.email, id: this.state.idOfFriend.data.getUsersByEmail.id};
                // const params = {email: this.props.email, receiverEmail: this.state.friend};
                await API.graphql(graphqlOperation(RequestFriend2, params));
                console.log('success');
            } catch (err) {
                console.log('error: ', err);
            }
        }catch (err) {
            console.log('error: ', err);
        }



    };
    showFriends = async event => {
        try {
            alert("in show friends");
            const params = {id: this.state.id};
            const books = await API.graphql(graphqlOperation(ListUsers, params));
            console.log('books: ', books);
            console.log('after test');
            this.setState({friendList: Array.from(books.data.getUsers.friends)});
            console.log(this.state.friendList);
        }catch (err) {
            this.state.hasFriendsAfterSignUp = false;
        }
        try {
            const params = {id: this.state.id};
            const books2 = await API.graphql(graphqlOperation(getUsersFriendRequests, params));
            console.log('requests: ', books2);
            this.setState({friendRequestsList: Array.from(books2.data.getUsers.friendRequests)});
            console.log(this.state.friendRequestsList);
        }catch (err) {
            alert("error in friend request");
            this.state.hasRequestsAfterSignUp = false;
        }
        this.setState({isFriendsModalVisible: !this.state.isFriendsModalVisible});
    }

    acceptFriend = async (friendEmail, index) => {

        const params = { userID: this.state.id, userEmail: this.state.email, friendEmail:friendEmail, index: index};
        const books = await API.graphql(graphqlOperation(AcceptFriend,params));
        console.log('books: ', books);
        this.setState({friendRequestsList: Array.from(books.data.addFriend.friendRequests)});
        this.setState({friendList: Array.from(books.data.addFriend.friends)});
    }
    rejectFriend = async (index) => {
        const params = { userID: this.state.id, index: index};
        const books = await API.graphql(graphqlOperation(RejectFriend,params));
        console.log('books: ', books);
        this.setState({friendRequestsList: Array.from(books.data.rejectFriend.friendRequests)});
    }
    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            alert("validate")
            console.log("ENter pressed????")
        }
    }

  selectPokemon = selectedPokemon => {
    this.setState({
      selectedPokemon
    });
  };
  userHasAuthenticated = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }
    showSideBar = show => {
        this.setState({ isFriendsModalVisible: show });
    }

  returnUserId(){
     return this.state.id
   }
  selectID = id => {
        this.setState({ id });
  }

  selectEmail= email => {
        this.setState({ email });
  }
  selectArtistID = ArtistID =>{
      this.setState({ArtistID});
  }
    selectBearer = bearer =>{
        this.setState({bearer});
    }

    handleLogout = async event => {
        await Auth.signOut();
        this.userHasAuthenticated(false);
    }
    handleSidebar = async event => {
        this.showSideBar(!this.state.isFriendsModalVisible);
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
        const { search } = this.state;
        const { friend } = this.state;
        if(Platform.OS != 'ios') {
            //alert(Platform.OS)
            var userAgent = window.navigator.userAgent.toLowerCase(),
                safari = /safari/.test(userAgent),
                ios = /iphone|ipod|ipad/.test(userAgent);
        }
      return (
            <Router>
                {(Platform.OS === 'web')&&(
                <Navbar style={{backgroundColor: "rgb(60,130,200)"}} fluid>
                    <View style={{flexDirection: 'row'}}>
                    <Navbar.Brand style={{ display: "flex", alignItems: "center"}}>
                        <Icon.Button onPress={this.showFriends.bind(this)}  name="navicon"  size={40} shadowRadius={10} solid/>
                        <Link to="/">cure8</Link>
                    </Navbar.Brand>
                    <Nav pullRight>
                        {this.state.isAuthenticated
                            ? <Navbar>
                                    <NavItem onClick={this.showFriends.bind(this)}>Sidebar</NavItem>
                                    <Link onClick={this.handleLogout} to="/">Log out</Link>
                                    <Link to="/addFriend">My profile</Link>
                                    <Link to="/ArtistProfile">My Artist</Link>
                                </Navbar>
                                : <Fragment>
                                    <Link to="/SignUp">Signup</Link>
                                    <Link to="/">Login</Link>

                                </Fragment>
                            }
                    </Nav>
                    </View>
                </Navbar>

            )}
                <Modal  isVisible={this.state.isFriendsModalVisible} animationIn="slideInLeft" animationOut="slideOutLeft" hasBackdrop={false}  style={styles.sideBar}  backdropOpacity={0} >
                    {this.state.isFriendsModalVisible == true &&(
                        <ImageBackground source={require('../assets/SidebarBack3.png')}
                                         style={{ height: '97.5%',  width: '100%', resizeMode: 'stretch',   // or 'stretch'
                                             margin: 0,
                                             minWidth: 300,
                                             minHeight: 1000}} imageStyle={{  borderBottomRightRadius: 60, borderTopRightRadius: 60 }} >
                            <View style={styles.sideBarInside}>
                                <Button  icon={<Icon name="chevron-left" color="#FFFFFF" size={30} />} buttonStyle={{
                                    alignSelf: 'flex-end',
                                    position: 'absolute',
                                    marginTop:20,
                                    left: 180,
                                    width: 60,
                                    height: 60,
                                    backgroundColor: "none"
                                }} onPress={this.showFriends} />
                                <View style={{marginTop: 100, flexDirection: 'column', marginRight: 70}}>
                                    <View style={{ flexDirection: 'row'}}>
                                        <Image
                                            source={require('../assets/postyProfilePic.png')}
                                            style={{width: 70, height: 70, borderRadius: 400/ 2}}
                                        />
                                        <View style={{marginTop: 5, left: 83, flexDirection: 'column', marginRight: 100, position: "absolute"}}>
                                            <Text numberOfLines={1} style={{
                                                color:'#fff', fontSize:25, width:300, flex: 1,fontFamily:"Lucida Grande"}}>  {this.state.email}Bulat Bikmullin vgvvevrehlvbwvblebvwfivk.bbveflv
                                            </Text>
                                            <Text style={{
                                                color:'#fff', fontSize:18, fontFamily:"Monaco"}}> Level 1
                                            </Text>
                                        </View>
                                    </View>
                                    <SearchBar
                                        platform="default"
                                        round
                                        placeholder="Add friends"
                                        placeholderTextColor={'#g5g5g5'}
                                        inputStyle={{backgroundColor: 'white',fontSize:25,height:50,outline:'none', onKeyDown:this._handleKeyDown,fontFamily:"Monaco" }}
                                        containerStyle={{backgroundColor: 'white', borderRadius: 22, width:350, height:55, justifyContent:'center', padding: 0, marginTop: 25}}
                                        inputContainerStyle={{backgroundColor:'white'}}
                                        onChangeText={this.updateFriendSearch}
                                        lightTheme={true}


                                        removeClippedSubviews={true}
                                        clearIcon={false}
                                        borderBottomColor={'transparent'}
                                        borderTopColor={'transparent'}
                                        searchIcon={<Button
                                            onClick={this.handleFriendSearch}
                                            icon={<Icon name="search" color="#3A85D6" size={40} shadowRadius={10}/>}
                                            buttonStyle={{
                                                backgroundColor: "rgba(255, 255,255, 0.5)",
                                            }}
                                        />}
                                        value={friend}

                                    />
                                    <Text style={{
                                        color:'#fff', fontSize:22, marginTop: 20,fontFamily:"Lucida Grande"}}>My Friends:
                                    </Text>
                                    {this.state.hasFriendsAfterSignUp &&this.state.friendList.map((book, index) => (
                                        <View key={index} style={styles.book}>
                                            <Image
                                                source={require('../assets/postyProfilePic.png')}
                                                style={{width: 70, height: 70, borderRadius: 400/ 2}}
                                            />
                                            <Text numberOfLines={1} style={styles.friendText}>{book}</Text>
                                            <Button  icon={<Icon name="envelope" color="#FFFFFF" size={25} />} buttonStyle={{
                                                alignSelf: 'flex-end',
                                                position: 'absolute',
                                                width: 25,
                                                height: 25,
                                                backgroundColor: "none",
                                                marginTop: 17
                                            }} onPress={this.showFriends} />
                                            <Button  icon={<Icon name="gamepad" color="#FFFFFF" size={25} />} buttonStyle={{
                                                alignSelf: 'flex-end',
                                                position: 'absolute',
                                                width: 25,
                                                height: 25,
                                                backgroundColor: "none",
                                                marginTop: 17,
                                                marginLeft: 45
                                            }} onPress={this.showFriends} />
                                            <Button  icon={<Icon name="remove" color="#FFFFFF" size={25} />} buttonStyle={{
                                                alignSelf: 'flex-end',
                                                position: 'absolute',
                                                width: 25,
                                                height: 25,
                                                backgroundColor: "none",
                                                marginTop: 17,
                                                marginLeft: 90
                                            }} onPress={this.showFriends} />

                                        </View>
                                    ))}
                                    {!this.state.hasFriendsAfterSignUp &&(
                                        <Text style={{
                                            color:'#fff', fontSize:22, marginTop: 10,fontFamily:"Lucida Grande"}}>No friends
                                        </Text>
                                    )}
                                    <Text style={{
                                        color:'#fff', fontSize:22, marginTop: 20,fontFamily:"Lucida Grande"}}>Friend Invites:
                                    </Text>
                                    {this.state.hasRequestsAfterSignUp &&this.state.friendRequestsList.map((book, index) => (
                                        <View key={index} style={styles.book}>
                                            <Image
                                                source={require('../assets/postyProfilePic.png')}
                                                style={{width: 70, height: 70, borderRadius: 400/ 2}}
                                            />
                                            <Text numberOfLines={1} style={styles.friendText}>{book}</Text>
                                            <Button  icon={<Icon name="check" color="#FFFFFF" size={25} />} buttonStyle={{
                                                alignSelf: 'flex-end',
                                                position: 'absolute',
                                                width: 25,
                                                height: 25,
                                                backgroundColor: "none",
                                                marginTop: 17,
                                                marginLeft: 45
                                            }} onPress={() => this.acceptFriend(book, index)} />
                                            <Button  icon={<Icon name="remove" color="#FFFFFF" size={25} />} buttonStyle={{
                                                alignSelf: 'flex-end',
                                                position: 'absolute',
                                                width: 25,
                                                height: 25,
                                                backgroundColor: "none",
                                                marginTop: 17,
                                                marginLeft: 90
                                            }} onPress={() => this.rejectFriend(index)} />
                                        </View>
                                    ))}
                                    {!this.state.hasRequestsAfterSignUp &&(
                                        <Text style={{
                                            color:'#fff', fontSize:22, marginTop: 10,fontFamily:"Lucida Grande"}}>No friend requests
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </ImageBackground>

                    )}
                </Modal>
              <Switch>
                <Route
                    exact
                    path="/"
                    render={props => (
                        <Home {...props} selectPokemon={this.selectPokemon} userHasAuthenticated={this.userHasAuthenticated} returnUserId={this.returnUserId} selectID={this.selectID} selectEmail={this.selectEmail} isAuthenticated={this.state.isAuthenticated} />
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
                            ?<Dashboard {...props} userHasAuthenticated={this.userHasAuthenticated} id={this.state.id} email={this.state.email} ArtistID={this.state.ArtistID} selectArtistID={this.selectArtistID} bearer={this.state.bearer} selectBearer={this.selectBearer}

                            />
                            :alert(this.state.authenticated)

                    )}
                />
                <Route
                    path="/artist"
                    render={props => (
                      <Artist {...props} selectPokemon={this.selectPokemon} userHasAuthenticated={this.userHasAuthenticated} returnUserId={this.returnUserId} selectID={this.selectID} selectEmail={this.selectEmail} isAuthenticated={this.state.isAuthenticated} ArtistID={this.state.ArtistID} bearer={this.state.bearer} selectBearer={this.selectBearer}/>
                  )}
                />
                  <Route
                      path="/friends"
                      render={props => (
                          this.state.isAuthenticated === true
                              ?<Friends {...props} userHasAuthenticated={this.userHasAuthenticated} id={this.state.id} email={this.state.email}

                              />
                              :alert(this.state.authenticated)

                      )}
                  />
                  <Route
                      path="/invites"
                      render={props => (
                          this.state.isAuthenticated === true
                              ?<FriendRequest {...props} userHasAuthenticated={this.userHasAuthenticated} id={this.state.id} email={this.state.email}

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
        require('../assets/DashboardBackground.png')
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
  },
    sideBar: {
        backgroundColor: 'rgba(65, 62, 115, 0)',
        width: '30%',
        height: '100%',
        margin: 0,
        minWidth: 500,
        minHeight: 1000,
    },
    sideBar2main: {
        width: '30%',
        height: '100%',
        margin: 0,
        //  backgroundColor: 'rgba(65, 62, 115, 1)',
        //    blurRadius: 1000,
        //   blur: 1000,

        //   alignItems: 'start',
        //  justifyContent: "left",
        // flex: 1
    },
    sideBarInside: {
        // backgroundColor: 'rgba(255, 255, 255, 1)',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
        // blurRadius: 1000,
        // blur: 1000
    },
    sideBar2: {
        // backgroundColor: 'rgba(255, 255, 255, 1)',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1
        //   blurRadius: 1000,
        //   blur: 1000
    },
    book: {
        paddingVertical: 10,
        flexDirection: 'row',
        marginTop: 10
    },
    friendText: { color:'#fff', fontSize:22, width:200, flex: 1,fontFamily:"Lucida Grande", marginTop: 17, paddingLeft: 14 }
});
