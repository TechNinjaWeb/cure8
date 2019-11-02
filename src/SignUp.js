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
import {  Input, Button,  Text, } from 'react-native-elements'
import { WebBrowser } from 'expo';
import { Auth } from "aws-amplify";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/FontAwesome";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";



const poolData = {UserPoolId: "us-east-2_tEo59OfCG", ClientId: "6nlq2nulsoehuu7cr7smsa0src"};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

//Check if I actually need router stuff in render function

export default class SignUp extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {

        super(props);
        this.state = {
            isLoading: false,
            email: "",
            password: "",
            confirmPassword: "",
            confirmationCode: "",
            newUser: null,
            userEmail:"  "

        };

    }
    validateConfirmationForm() {
        return this.state.confirmationCode.length > 0;
    }
    onLoginPress = async event =>{
        const { username, password } = this.state;


        event.preventDefault();

        try {
            await Auth.signIn(this.state.username, this.state.password);
            this.props.userHasAuthenticated(true)
            //alert(this.state.authenticated)

            alert("Successful login");
            this.props.history.push("/dashboard");

        } catch (e) {
            alert(e.message);
            this.props.userHasAuthenticated(true) //!!
            this.props.history.push("/dashboard"); //!!!

            this.setState({ isLoading: false });


        }
    }
    handleSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            const newUser = await Auth.signUp({
                username: this.state.email,
                password: this.state.password
            });
            this.setState({
                newUser
            });
        } catch (e) {
            alert(e.message);
        }

        this.setState({ isLoading: false });
    }
    handleConfirmationSubmit = async event => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            await Auth.confirmSignUp(this.state.email, this.state.confirmationCode);
            await Auth.signIn(this.state.email, this.state.password);

            this.props.userHasAuthenticated(true);
            this.props.history.push("/dashboard");

        } catch (e) {
            alert(e.message);
            this.setState({ isLoading: false });
        }
    }

   /* componentDidMount(){
        var userEmail;
        const cognitoUser = userPool.getCurrentUser();
        if (cognitoUser != null) {
            cognitoUser.getSession((err, session) => {
                if (err) {
                    console.log(err);
                } else if (!session.isValid()) {
                    console.log("Invalid session.");
                } else {
                    console.log("IdToken: " + session.getIdToken().getJwtToken());
                    const getUserAttributes = cognitoUser.getUserAttributes(err);
                    Auth.currentUserInfo().then((userInfo) => {
                        console.dir( userInfo.attributes.email);
                        userEmail = userInfo.attributes.email;
                        console.log("is it allright?"+userEmail)
                        this.setState({userEmail})
                    })
                    let info =  Auth.currentUserInfo();
                    console.dir("Email: " + info);



                }
            });
        } else {
            console.log("User not found.");
        }

    }*/
    renderConfirmationForm() {

        return (

            <LinearGradient start={[0, 0]}
                            end={[1, 0]}
                            colors={['#5eafdc', '#614798']}
                            style={{flex: 1,
                                resizeMode: 'cover', // or 'stretch'
                                width: '100%',
                                height: '100%',
                                margin: 0,
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: 1000,
                                minHeight: 1000,
                                }}
            >
                <View style={styles.containerConfirmation}>
            <form onSubmit={this.handleConfirmationSubmit}>
                    <Text>Hey, {this.state.email}! To complete your sign up, please check your email for the code</Text>
                    <Input
                        value={this.state.confirmationCode}
                        onChangeText={(confirmationCode) => this.setState({ confirmationCode })}

                    />

                <Button
                    block
                    bsSize="large"
                    disabled={!this.validateConfirmationForm()}
                    type="submit"
                    isLoading={this.state.isLoading}
                    text="Verify"
                    loadingText="Verifying…"
                />
            </form>
                </View>
            </LinearGradient>

        );
    }

    renderForm() {
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
                            onPress={this.onLoginPress.bind(this)}
                        />
                    </View>
                )}
                {Platform.OS == 'web' && !ios &&(

                    <LinearGradient start={[0, 0]}
                                    end={[1, 0]}
                                    colors={['#5eafdc', '#614798']}
                                    style={styles.backgroundImage}
                    >
                        <View style={styles.container}>
                            <Text style={styles.label}>Sign Up</Text>
                            <Input
                                value={this.state.email}
                                onChangeText={(email) => this.setState({ email })}
                                placeholder={'Your Email'}
                                containerStyle={styles.input1}
                                shake={true}
                            />
                            <Input
                                value={this.state.password}
                                onChangeText={(password) => this.setState({ password })}
                                placeholder={'Your Password'}
                                containerStyle={styles.input}
                                secureTextEntry={true}
                                shake={true}
                            />


                            <TouchableOpacity style={{borderRadius: 100,marginTop: 60, width:'80%', height:'9%',backgroundColor: '#DDDDDD'}} onPress={this.handleSubmit.bind(this)}>
                                <LinearGradient start={[0, 0]}
                                                end={[1, 0]}
                                                colors={['#5eafdc', '#314998']}
                                                style={{borderRadius: 100,  shadowRadius:50,
                                                    shadowOffset:{  width: 0,  height: 0,  },
                                                    shadowColor: 'black',
                                                    shadowOpacity: 0.3,
                                                    height:'100%'
                                                }
                                                }>
                                    <View style={styles.circleGradient}>
                                        <Text style={{fontSize: 20,
                                            fontWeight: 'bold',
                                            color: '#fff'}}>SIGN UP</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                            <Text style={styles.label2}>or Sign up with:</Text>
                            <View style={styles.buttonContainer}>
                                <Button
                                    icon={<Icon name="facebook" color="#3A85D6" size={18} />}
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255, 0.5)",
                                        borderRadius: 100,
                                        width: 110,
                                        height: 60,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,

                                    }}
                                />
                                <Button
                                    icon={<Icon name="twitter" color="#3A85D6" size={18} />}
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255, 0.5)",
                                        borderRadius: 100,
                                        width: 110,
                                        height: 60,
                                        marginLeft:60,
                                        marginRight:60,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,
                                    }}
                                />
                                <Button
                                    icon={<Icon name="google" color="#3A85D6" size={18} />}
                                    buttonStyle={{
                                        backgroundColor: "rgba(255, 255,255, 0.5)",
                                        borderRadius: 100,
                                        width: 110,
                                        height: 60,
                                        shadowRadius:10,
                                        shadowOffset:{  width: 0,  height: 0,  },
                                        shadowColor: 'black',
                                        shadowOpacity: 0.2,

                                    }}
                                />
                            </View>
                            <View style={{marginTop: 80,
                                width: 450,
                                height: 1,
                                backgroundColor: '#c2c3c7',

                            }}>
                            </View>
                            <View style={styles.SignUpView}>
                                <Text style={styles.label3}>
                                    Have an account?
                                </Text>
                                <Button
                                    title={'Log In'}
                                    style={styles.SignUpButton}
                                    onPress={this.onLoginPress.bind(this)}
                                    type="clear"
                                />
                            </View>
                        </View>
                    </LinearGradient>
                )}
            </View>

        );




    }
    render() {
        return(
            <View style={styles.body}>
                {this.state.newUser === null
                    ? this.renderForm()
                    : this.renderConfirmationForm()}
            </View>
        )
       /*return(
        this.renderConfirmationForm()
       )*/
    }


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        opacity: 0.9,
        width: '33%',
        maxWidth:'90%',
        minWidth: 500,
        maxHeight: '80%',
        minHeight: 600
    },
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
    input1: {

        width: 450,
        height: 44,
        padding: 30,
        borderColor: '#c2c3c7',
        marginBottom: 10,
    },
    input: {
        width: 450,
        height: 44,
        padding: 30,
        borderColor: '#c2c3c7',
        marginBottom: 10,
    },
    label:{
        padding: 30,
        textAlign: 'center',
        fontSize: 40,
        fontWeight: 'bold',
        color: '#55514F',

    },
    label2:{
        padding: 10,
        textAlign: 'center',
        fontSize: 20,
        color: '#55514F',
        marginTop: 30

    },
    button:{
        width: 450,
        height: 44,
        padding: 30,
        borderTopLeftRadius: 3,
        borderTopRightRadius:3,
        borderBottomLeftRadius:3,
        borderBottomRightRadius:3,
        borderColor: 'black',
        marginBottom: 10,
    },
    forgotPasswordButton:{

    },
    shadow:{
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    circleGradient: {

        textAlign: 'center',
        justifyContent: 'center',
        marginTop: 23


    },
    buttonContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30

    },
    forgotPasswordView:{
        marginLeft: 290
    },
    SignUpView:{
        marginLeft: 120,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    SignUpButton:{
        height: 20,
        margin:0,
        padding: 0,

    },
    label3:{
        textAlign: 'center',
        fontSize: 20,
        color: '#a8a6a1',
        marginTop: 8,


    },
    containerConfirmation: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        opacity: 0.9,
        height: '33%',
        width:"70%",
        maxHeight:'65%',
        minHeight: 500,
        maxWidth: '90%',
        minWidth: 600,
        marginBottom:200
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