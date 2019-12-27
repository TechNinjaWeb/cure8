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

        };

    }
    updateSearch = search => {
        this.setState({ search });
    };


    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            alert("validate")
        }
    }
    handleLogout = async event => {
        await Auth.signOut();
        this.props.userHasAuthenticated(false)
        this.props.history.push("/");
    }
    showFriends = async event => {
        this.props.history.push("/friends");
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
                    <ImageBackground source={require('../assets/DashboardBackground .png')} style={styles.backgroundImage} >
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
                                icon={<Icon name="search" color="#3A85D6" size={40} shadowRadius={10}/>}
                                buttonStyle={{
                                    backgroundColor: "rgba(255, 255,255, 0.5)",
                                }}
                            />}
                            value={search}

                        />
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
});