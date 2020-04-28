//import React from 'react';
import React from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    ImageBackground
} from 'react-native';
import {  Input, Button,  Text, SearchBar } from 'react-native-elements'
import { WebBrowser } from 'expo';
import { Auth } from "aws-amplify";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/FontAwesome";
import axios from 'axios';

import Modal from 'modal-enhanced-react-native-web';
//import Modal from 'react-native-modal';  For iOS and Android verions
//import { BlurView } from "@react-native-community/blur";
//import { BlurView } from 'expo-blur';

import Artist from './ArtistPage'






//Check if I actually need router stuff in render function

export default class DashBoard extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {

        super(props);
        this.state = {
            username: '',
            password: '',
            search: '',
            isFriendsModalVisible: false
        };

    }

    updateSearch = search => {
        this.setState({ search });
        console.log(this.state.search)

    };

    handleSearch = async search =>{
        console.log("search this now"+this.state.search);
        const response =
          await axios.get("https://api.spotify.com/v1/search?q="+this.state.search+"&type=artist&limit=1",
            { headers: {'Content-Type': 'application/json',
                        'Accept':'application/json',
                        'Authorization': 'Bearer BQB81IRNo8eNwR9nW9buY0LPwcUfmdKNSnxsB3wC36iNNLOkwfiMihUXfhj5FEBve8edhef53BPIjZTbh-3FzQnIXLphg8Qmfx0c7GYkR5jSArnLRZou7Cv0d3eRjH3QLSPlHnF3YMl7L33qLg'
                        }}
          )
          console.log(response.data.artists)
          console.log(response.data.artists.items[0].id)
          const artID = response.data.artists.items[0].id
          //this.props.artistID = artID
          this.props.selectArtistID(artID)
          //call artist page with the id
          
          this.props.history.push('/artist');
          
    };
    createLeague = search => {
        console.log("Deal with creation of league...")
    };


    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            alert("validate")
            comsole.log("ENter pressed????")
        }
    }
    handleLogout = async event => {
        await Auth.signOut();
        this.props.userHasAuthenticated(false)
        this.props.history.push("/");
    }
    showFriends = async event => {
     //   this.props.history.push("/friends");
        this.setState({isFriendsModalVisible: !this.state.isFriendsModalVisible});
    }
    showInvites = async event => {
        this.props.history.push("/invites");
    }
    render() {
        console.log("debug in dashbaord "+this.props.id+"    "+this.props.email)
        const { search } = this.state;
        if(Platform.OS != 'ios') {
            //alert(Platform.OS)
            var userAgent = window.navigator.userAgent.toLowerCase(),
                safari = /safari/.test(userAgent),
                ios = /iphone|ipod|ipad/.test(userAgent);
        }

        return (
            <View style={styles.containerIOS}>
                {(((ios && safari)||(ios)) || (Platform.OS == 'ios')) &&(
                    <View style={styles.containerIOS}>
                        <TextInput
                            value={this.state.username}
                            onChangeText={(username) => this.setState({ username })}
                            placeholder={'Username'}
                            style={styles.inputIOS}
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            style={styles.inputIOS}
                        />
                        <TextInput
                            value={this.state.password}
                            onChangeText={(password) => this.setState({ password })}
                            placeholder={'Repeat Password'}
                            secureTextEntry={true}
                            style={styles.inputIOS}
                        />

                        <Button
                            title={'Login'}
                            style={styles.inputIOS}
                        />
                    </View>
                )}
                {Platform.OS == 'web' && !ios &&(
                    <ImageBackground source={require('../assets/DashboardBackground .png')}
                                     style={styles.backgroundImage} >
                        <SearchBar
                            platform="default"
                            round
                            placeholder="Search artists"
                            placeholderTextColor={'#g5g5g5'}
                            inputStyle={{backgroundColor: 'white',fontSize:25,height:50,outline:'none', onKeyDown:this._handleKeyDown,fontFamily:"Monaco" }}
                            containerStyle={{backgroundColor: 'white', borderRadius: 22, width:960, height:88, marginBottom: 140, justifyContent:'center'}}
                            inputContainerStyle={{backgroundColor:'white'}}


                            onChangeText={this.updateSearch}
                            lightTheme={true}


                            removeClippedSubviews={true}
                            clearIcon={false}
                            borderBottomColor={'transparent'}
                            borderTopColor={'transparent'}
                            searchIcon={<Button
                                onClick={this.handleSearch}
                                icon={<Icon name="search" color="#3A85D6" size={40} shadowRadius={10}/>}
                                buttonStyle={{
                                    backgroundColor: "rgba(255, 255,255, 0.5)",
                                }}
                            />}
                            value={search}

                        />

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
                                    <View style={{marginTop: 100, flexDirection: 'row'}}>
                                    <Text style={{
                                         color:'#fff', fontSize:25, fontFamily:"Lucida Grande"}}>{this.props.email}Bulat Biimullun
                                    </Text>
                                    <Image
                                        source={require('../assets/postyProfilePic.png')}
                                        style={{width: 70, height: 70, borderRadius: 400/ 2}}
                                    />
                                    </View>

                                </View>
                                </ImageBackground>

                            )}
                        </Modal>




                        <View style={styles.buttonContainer}>
                            <View style={{ flexDirection: 'column', marginRight: 80}}>
                                <Button
                                  title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                      <Text style={{fontSize:45,paddingHorizontal:0 }}>  👯‍♀      </Text>
                                      <Text style={{fontSize:30, fontFamily:"Monaco",  }}>My Friends</Text>
                                  </View>}
                                  onPress={this.showFriends.bind(this)}
                                  titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top
                                  buttonStyle={{
                                    backgroundColor: "rgba(255, 255,255,1)",
                                    borderRadius: 20,
                                    width: 440,
                                    height: 55,
                                    shadowRadius:10,
                                    shadowOffset:{  width: 0,  height: 0,  },
                                    shadowColor: 'black',
                                    shadowOpacity: 0.2,
                                    marginBottom: 21,
                                    justifyContent:"left"

                                  }}
                                />
                                <Button
                                    title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize:45,paddingHorizontal:0 }}>  👯‍♀      </Text>
                                        <Text style={{fontSize:30, fontFamily:"Monaco",  }}>Friend Invites</Text>
                                    </View>}
                                    onPress={this.showInvites.bind(this)}
                                    titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top"
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255,1)",
                                        borderRadius: 20,
                                        width: 440,
                                        height: 55,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,
                                        marginBottom: 21,
                                        justifyContent:"left"
                                    }}

                                />
                                <Button
                                    title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize:45,paddingHorizontal:0 }}>  👯‍♀      </Text>
                                        <Text style={{fontSize:30, fontFamily:"Monaco",  }}>Add Friend</Text>
                                    </View>}

                                    titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top"
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255,1)",
                                        borderRadius: 20,
                                        width: 440,
                                        height: 55,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,
                                        marginBottom: 21,
                                        justifyContent:"left"

                                    }}
                                />
                        <Button
                            title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={{fontSize:45,paddingHorizontal:0 }}>  🚪      </Text>
                                <Text style={{fontSize:30, fontFamily:"Monaco",  }}>Log Out</Text>
                            </View>}
                            onPress={this.handleLogout.bind(this)}
                            titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top"
                            buttonStyle={{
                                backgroundColor: "rgba(255, 255,255,1)",
                                borderRadius: 20,
                                width: 440,
                                height: 55,
                                shadowRadius:10,
                                shadowOffset:{  width: 0,  height: 0,  },
                                shadowColor: 'black',
                                shadowOpacity: 0.2,
                                justifyContent:"left"

                            }}
                        />
                            </View>
                            <View style={{ flexDirection: 'column'}}>
                                <Button
                                    title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize:45,paddingHorizontal:0 }}>  👯‍♀      </Text>
                                        <Text style={{fontSize:30, fontFamily:"Monaco",  }}>My Leagues</Text>
                                    </View>}

                                    titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top"
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255,1)",
                                        borderRadius: 20,
                                        width: 440,
                                        height: 55,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,
                                        marginBottom: 21,
                                        justifyContent:"left"
                                    }}
                                />
                                <Button
                                    title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize:45,paddingHorizontal:0 }}>  👯‍♀      </Text>
                                        <Text style={{fontSize:30, fontFamily:"Monaco",  }}>Join League</Text>
                                    </View>}

                                    titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top"
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255,1)",
                                        borderRadius: 20,
                                        width: 440,
                                        height: 55,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,
                                        marginBottom: 21,
                                        justifyContent:"left"

                                    }}
                                />
                                <Button
                                    title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize:45,paddingHorizontal:0 }}>  👯‍♀      </Text>
                                        <Text style={{fontSize:30, fontFamily:"Monaco",  }}>Create League</Text>
                                    </View>}

                                    onPress={this.createLeague.bind(this)}

                                    titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top"
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255,1)",
                                        borderRadius: 20,
                                        width: 440,
                                        height: 55,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,
                                        marginBottom: 21,
                                        justifyContent:"left"

                                    }}
                                />
                                <Button
                                    title={<View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{fontSize:45,paddingHorizontal:0 }}>  👯‍♀      </Text>
                                        <Text style={{fontSize:30, fontFamily:"Monaco",  }}>Past Leagues</Text>
                                    </View>}

                                    titleStyle={{color:"rgba(140, 140, 140, 1.0)",fontSize:25,textAlign:"left", }}//this works textAlignVertical:"top"
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255,1)",
                                        borderRadius: 20,
                                        width: 440,
                                        height: 55,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,
                                        justifyContent:"left"
                                    }}
                                />
                            </View>
                        </View>
                    </ImageBackground>

                )}
            </View>

        );
    }


}

const styles = StyleSheet.create({

    backgroundImage: {
        flex: 1,
        resizeMode: 'cover', // or 'stretch'
        width: '100%',
        height: '100%',
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 1000,
        minHeight: 1000,
        backgroundColor: 'rgba(0,0,0,0.5)',


    },
    circleGradient: {

        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 23,



    },
    buttonContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        //marginRight: 200,
        //margin: 1000,
        justifyContent: 'top',
        marginBottom: 200

    },

    body: {
        height: '100%'
    },
    containerIOS: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    inputIOS: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },
    sideBar: {
        backgroundColor: 'rgba(65, 62, 115, 0)',
        width: '30%',
        height: '100%',
        margin: 0,
        minWidth: 500,
        minHeight: 1000,

      //  blurRadius: 1000,
   //     blur: 1000,

        //   alignItems: 'start',
      //  justifyContent: "left",
       // flex: 1
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
    }

});